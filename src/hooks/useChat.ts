import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  image_url: string | null;
  created_at: string;
}

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  created_at: string;
  updated_at: string;
}

export const useChat = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId || !user) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        console.log('Loaded messages for conversation:', conversationId, data?.length);
        setMessages(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
        console.error('Error fetching messages:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages in this conversation
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('New message received:', payload.new);
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const sendMessage = async (
    content: string, 
    type: 'text' | 'image' = 'text', 
    imageUrl?: string
  ) => {
    if (!user || !conversationId || !content.trim()) return;

    try {
      const { error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          message_type: type,
          image_url: imageUrl
        });

      if (sendError) throw sendError;
      
      console.log('Message sent successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      console.error('Error sending message:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage
  };
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('conversations')
          .select('*')
          .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
          .order('updated_at', { ascending: false });

        if (fetchError) throw fetchError;

        console.log('Loaded conversations:', data?.length);
        setConversations(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations';
        console.error('Error fetching conversations:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to conversation updates
    const channel = supabase
      .channel('user-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant_1=eq.${user.id}`
        },
        () => fetchConversations()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant_2=eq.${user.id}`
        },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createOrFindConversation = async (otherUserId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      // First try to find existing conversation
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`
        )
        .maybeSingle();

      if (existing) {
        console.log('Found existing conversation:', existing.id);
        return existing.id;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: otherUserId
        })
        .select('id')
        .single();

      if (createError) throw createError;

      console.log('Created new conversation:', newConv.id);
      return newConv.id;
    } catch (err) {
      console.error('Error creating/finding conversation:', err);
      return null;
    }
  };

  return {
    conversations,
    loading,
    error,
    createOrFindConversation
  };
};
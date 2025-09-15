import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIStylistChatProps {
  userProfile: Profile;
  className?: string;
}

export const AIStylistChat = ({ userProfile, className = "" }: AIStylistChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi ${userProfile.name}! 👋 I'm Nova, your AI fashion stylist. I'm here to help you discover your perfect style based on your unique preferences and body type. What fashion challenge can I help you with today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading || !user) return;

    setLoading(true);
    const userMessage: ChatMessage = { 
      role: 'user', 
      content: content.trim(), 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-stylist', {
        body: {
          message: content.trim(),
          userProfile,
          conversationHistory
        }
      });

      if (error) throw error;

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI Stylist error:', error);
      toast({
        title: "AI Stylist Error",
        description: error.message || "Failed to get styling advice. Please try again.",
        variant: "destructive",
      });

      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try asking your question again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const ChatBubble = ({ message }: { message: ChatMessage }) => (
    <div className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
      {message.role === 'assistant' && (
        <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500">
          <AvatarFallback className="bg-transparent text-white text-xs">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] rounded-lg p-3 ${
        message.role === 'user' 
          ? 'bg-antique-gold text-ink ml-auto' 
          : 'bg-muted text-ink'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {message.role === 'user' && (
        <Avatar className="h-8 w-8 bg-antique-gold">
          <AvatarFallback className="bg-transparent text-ink text-xs">
            {userProfile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );

  return (
    <Card className={`bg-canvas border-muted-ink/20 flex flex-col h-[600px] ${className}`}>
      <CardHeader className="border-b border-muted-ink/20 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500">
            <AvatarFallback className="bg-transparent text-white">
              <Sparkles className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-ink text-lg">Nova - AI Fashion Stylist</CardTitle>
            <p className="text-sm text-muted-ink">Personalized styling advice just for you</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages.map((message, idx) => (
            <ChatBubble key={idx} message={message} />
          ))}
          
          {loading && (
            <div className="flex gap-3 mb-4">
              <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500">
                <AvatarFallback className="bg-transparent text-white text-xs">
                  <Sparkles className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-ink">Nova is thinking...</span>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-muted-ink/20 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about styling, trends, or outfit suggestions..."
              className="border-muted-ink/20 focus:border-antique-gold"
              disabled={loading}
            />
            <Button 
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="bg-antique-gold hover:bg-antique-gold/90 text-ink"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
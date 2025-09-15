import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft, Loader2, Phone, Video } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface ChatInterfaceProps {
  conversationId: string;
  otherUser: Profile;
  onBack?: () => void;
  className?: string;
}

export const ChatInterface = ({ 
  conversationId, 
  otherUser, 
  onBack,
  className = ""
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [otherUserProfile, setOtherUserProfile] = useState<Profile | null>(null);
  const { messages, loading, sendMessage } = useChat(conversationId);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOtherUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', otherUser.user_id)
          .single();

        if (error) throw error;
        setOtherUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (otherUser.user_id) {
      fetchOtherUserProfile();
    }
  }, [otherUser.user_id]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    try {
      await sendMessage(input.trim());
      setInput('');
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = ({ message }: { message: any }) => {
    const isOwnMessage = message.sender_id === user?.id;
    const profile = isOwnMessage ? null : otherUserProfile;

    return (
      <div className={`flex gap-3 mb-4 ${isOwnMessage ? 'justify-end' : ''}`}>
        {!isOwnMessage && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.portfolio_image_url || undefined} />
            <AvatarFallback className="bg-muted text-ink text-xs">
              {profile?.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage 
            ? 'bg-antique-gold text-ink ml-auto' 
            : 'bg-muted text-ink'
        }`}>
          {message.message_type === 'image' && message.image_url && (
            <img 
              src={message.image_url} 
              alt="Shared image" 
              className="rounded-lg max-w-full h-auto mb-2"
            />
          )}
          
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(message.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>

        {isOwnMessage && (
          <Avatar className="h-8 w-8 bg-antique-gold">
            <AvatarFallback className="bg-transparent text-ink text-xs">
              You
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'designer': return 'bg-purple-100 text-purple-800';
      case 'tailor': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`bg-canvas border-muted-ink/20 flex flex-col h-[600px] ${className}`}>
      <CardHeader className="border-b border-muted-ink/20 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUserProfile?.portfolio_image_url || undefined} />
            <AvatarFallback className="bg-muted text-ink">
              {otherUserProfile?.name?.charAt(0) || otherUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <CardTitle className="text-ink text-lg">
              {otherUserProfile?.name || otherUser.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getUserTypeColor(otherUser.user_type)}>
                {otherUser.user_type}
              </Badge>
              {otherUserProfile?.location && (
                <span className="text-sm text-muted-ink">
                  {otherUserProfile.location}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-ink">
              <p>Start a conversation with {otherUserProfile?.name || otherUser.name}</p>
            </div>
          ) : (
            messages.map((message, idx) => (
              <MessageBubble key={message.id || idx} message={message} />
            ))
          )}
          
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-antique-gold" />
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-muted-ink/20 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${otherUserProfile?.name || otherUser.name}...`}
              className="border-muted-ink/20 focus:border-antique-gold"
              disabled={loading}
            />
            <Button 
              onClick={handleSendMessage}
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
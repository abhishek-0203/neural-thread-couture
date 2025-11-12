import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Sparkles, Loader2 } from 'lucide-react';
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
  const [streamingContent, setStreamingContent] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(`wss://hgeojvutyyypkoysuuvh.supabase.co/functions/v1/ai-stylist-stream`);
    
    ws.onopen = () => {
      console.log('WebSocket connected to AI Stylist');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'connected':
            console.log('AI Stylist ready');
            break;
            
          case 'start':
            setStreamingContent('');
            break;
            
          case 'delta':
            setStreamingContent(prev => prev + data.content);
            break;
            
          case 'done':
            if (streamingContent) {
              const aiMessage: ChatMessage = {
                role: 'assistant',
                content: streamingContent,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, aiMessage]);
              setStreamingContent('');
            }
            setLoading(false);
            break;
            
          case 'error':
            console.error('AI Stylist error:', data.error);
            toast({
              title: "AI Stylist Error",
              description: data.error,
              variant: "destructive",
            });
            setLoading(false);
            setStreamingContent('');
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI Stylist",
        variant: "destructive",
      });
      setLoading(false);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    wsRef.current = ws;
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [toast, streamingContent]);

  const sendMessage = (content: string) => {
    if (!content.trim() || loading || !user || !wsRef.current) return;

    setLoading(true);
    const userMessage: ChatMessage = { 
      role: 'user', 
      content: content.trim(), 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    wsRef.current.send(JSON.stringify({
      message: content.trim(),
      userProfile,
      conversationHistory
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const ChatBubble = ({ message }: { message: ChatMessage }) => (
    <div className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
      {message.role === 'assistant' && (
        <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
          <AvatarFallback className="bg-transparent text-white text-xs">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-2.5 sm:p-3 ${
        message.role === 'user' 
          ? 'bg-antique-gold text-ink ml-auto' 
          : 'bg-muted text-ink'
      }`}>
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <span className="text-xs opacity-70 mt-1.5 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {message.role === 'user' && (
        <Avatar className="h-8 w-8 bg-antique-gold flex-shrink-0">
          <AvatarFallback className="bg-transparent text-ink text-xs">
            {userProfile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );

  return (
    <Card className={`bg-canvas border-muted-ink/20 flex flex-col ${className}`}>
      <CardHeader className="border-b border-muted-ink/20 pb-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
            <AvatarFallback className="bg-transparent text-white">
              <Sparkles className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-ink text-base sm:text-lg truncate">Nova - AI Fashion Stylist</CardTitle>
            <p className="text-xs sm:text-sm text-muted-ink truncate">Personalized styling advice just for you</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <ChatBubble key={idx} message={message} />
            ))}
            
            {(loading || streamingContent) && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                  <AvatarFallback className="bg-transparent text-white text-xs">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 flex-1">
                  {streamingContent ? (
                    <p className="text-sm whitespace-pre-wrap text-ink">{streamingContent}</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-ink" />
                      <span className="text-sm text-muted-ink">Nova is thinking...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-muted-ink/20 p-3 sm:p-4 bg-canvas">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about styling, trends, or outfit suggestions..."
              className="flex-1 border-muted-ink/20 focus:border-antique-gold text-sm"
              disabled={loading}
            />
            <Button 
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="bg-antique-gold hover:bg-antique-gold/90 text-ink flex-shrink-0"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
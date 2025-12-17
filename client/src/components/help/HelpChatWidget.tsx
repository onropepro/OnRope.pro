import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ThumbsUp, ThumbsDown, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; slug: string }>;
  messageId?: string;
}

interface HelpChatWidgetProps {
  initialOpen?: boolean;
}

export default function HelpChatWidget({ initialOpen = false }: HelpChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>('visitor');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: `Hi! I'm the OnRopePro assistant. I can help you learn about our platform, find specific features, or troubleshoot issues.\n\nWhat can I help you with today?`,
      }]);
    }
  }, [isOpen, messages.length]);
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/help/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationId,
          userType,
        }),
      });
      
      const data = await response.json();
      
      if (!conversationId) {
        setConversationId(data.conversationId);
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString() + '-response',
        role: 'assistant',
        content: data.message,
        sources: data.sources,
        messageId: data.messageId,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact support.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFeedback = async (messageId: string | undefined, feedback: 'positive' | 'negative') => {
    if (!messageId) return;
    
    try {
      await fetch('/api/help/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, feedback }),
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50',
          isOpen && 'hidden'
        )}
        data-testid="button-help-chat-open"
        aria-label="Open help chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] bg-background rounded-2xl shadow-2xl flex flex-col z-50 border max-w-[calc(100vw-3rem)]">
          <div className="p-4 border-b bg-blue-600 text-white rounded-t-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">OnRopePro Assistant</h3>
                <p className="text-xs text-blue-100">Ask me anything</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md"
              aria-label="Close chat"
              data-testid="button-help-chat-close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {messages.length <= 1 && (
            <div className="p-4 border-b bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">I am a:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'owner', label: 'Company Owner' },
                  { value: 'technician', label: 'Technician' },
                  { value: 'building-manager', label: 'Building Manager' },
                  { value: 'visitor', label: 'Just Exploring' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setUserType(option.value)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition-colors',
                      userType === option.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-background border-border'
                    )}
                    data-testid={`button-user-type-${option.value}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  )}
                  data-testid={`message-${message.role}-${message.id}`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">Related articles:</p>
                      <div className="space-y-1">
                        {message.sources.map(source => (
                          <a
                            key={source.slug}
                            href={`/help/modules/${source.slug}`}
                            className="text-xs text-blue-400 flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.role === 'assistant' && message.id !== 'greeting' && (
                    <div className="mt-2 pt-2 border-t border-border/30 flex gap-2">
                      <button
                        onClick={() => handleFeedback(message.messageId, 'positive')}
                        className="p-1 rounded text-muted-foreground/70"
                        aria-label="Helpful"
                        data-testid={`button-feedback-positive-${message.id}`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(message.messageId, 'negative')}
                        className="p-1 rounded text-muted-foreground/70"
                        aria-label="Not helpful"
                        data-testid={`button-feedback-negative-${message.id}`}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1"
                disabled={isLoading}
                data-testid="input-help-chat"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !input.trim()}
                size="icon"
                data-testid="button-help-chat-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI-powered by OnRopePro documentation
            </p>
          </div>
        </div>
      )}
    </>
  );
}

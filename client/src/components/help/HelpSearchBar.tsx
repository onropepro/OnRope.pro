import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Loader2, MessageCircle, Send, ArrowRight, FileText, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  excerpt?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; slug: string }>;
}

interface HelpSearchBarProps {
  placeholder?: string;
  size?: 'default' | 'large';
  autoFocus?: boolean;
  stakeholderColor?: string;
}

const QUESTION_PATTERNS = [
  /^(how|what|why|when|where|who|which|can|could|would|should|is|are|do|does|will|have|has)\s/i,
  /\?$/,
  /^(i\s+(want|need|would like|am trying)|help me|show me|explain|tell me)/i,
];

function isQuestion(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 2) return false;
  if (trimmed.endsWith('?')) return true;
  if (trimmed.length < 5) return false;
  return QUESTION_PATTERNS.some(pattern => pattern.test(trimmed));
}

export default function HelpSearchBar({ 
  placeholder, 
  size = 'default',
  autoFocus = false,
  stakeholderColor,
}: HelpSearchBarProps) {
  const { t } = useLanguage();
  const defaultPlaceholder = t('helpCenter.search.placeholder', 'Ask a question or search for help with projects, safety, scheduling...');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!chatMode) {
          setShowResults(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [chatMode]);

  const searchArticles = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/help/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.results || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!chatMode && value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        if (!isQuestion(value)) {
          searchArticles(value);
        } else {
          setShowResults(false);
        }
      }, 300);
    } else {
      setShowResults(false);
    }
  }, [chatMode, searchArticles]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    if (isQuestion(trimmedQuery) || chatMode) {
      if (!chatMode) {
        setChatMode(true);
        setShowResults(false);
        setChatMessages([{
          id: 'greeting',
          role: 'assistant',
          content: t('helpCenter.chat.greeting', "I'm here to help! Let me find an answer for you..."),
        }]);
      }

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmedQuery,
      };
      setChatMessages(prev => [...prev, userMessage]);
      setQuery('');
      setIsChatLoading(true);

      try {
        const response = await fetch('/api/help/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmedQuery,
            conversationId,
            userType: 'visitor',
          }),
        });

        const data = await response.json();
        
        if (!conversationId) {
          setConversationId(data.conversationId);
        }

        const assistantMessage: ChatMessage = {
          id: Date.now().toString() + '-response',
          role: 'assistant',
          content: data.message,
          sources: data.sources,
        };

        setChatMessages(prev => {
          const filtered = prev.filter(m => m.id !== 'greeting');
          return [...filtered, assistantMessage];
        });
      } catch (error) {
        setChatMessages(prev => [...prev, {
          id: Date.now().toString() + '-error',
          role: 'assistant',
          content: t('helpCenter.chat.error', 'Sorry, I encountered an error. Please try again.'),
        }]);
      } finally {
        setIsChatLoading(false);
      }
    } else {
      setLocation(`/help/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  }, [query, chatMode, conversationId, setLocation]);

  const handleResultClick = useCallback((slug: string) => {
    setShowResults(false);
    setQuery('');
    setLocation(`/help/modules/${slug}`);
  }, [setLocation]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      if (chatMode) {
        setChatMode(false);
        setChatMessages([]);
        setConversationId(null);
      }
      setShowResults(false);
    }
  }, [handleSubmit, chatMode]);

  const exitChatMode = useCallback(() => {
    setChatMode(false);
    setChatMessages([]);
    setConversationId(null);
    setQuery('');
  }, []);

  const inputModeHint = query.trim().length >= 3 
    ? (isQuestion(query) ? 'chat' : 'search')
    : null;

  const iconClasses = size === 'large'
    ? 'h-5 w-5 left-4'
    : 'h-4 w-4 left-3';

  const containerClasses = size === 'large'
    ? 'relative w-full rounded-2xl overflow-visible shadow-lg bg-background'
    : 'relative w-full rounded-2xl overflow-visible bg-background';

  const inputBaseClasses = size === 'large' 
    ? 'h-14 text-base pl-12 pr-32 border-0 rounded-2xl' 
    : 'h-10 pl-10 pr-24 border-0 rounded-2xl';

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className={containerClasses}>
          {chatMode ? (
            <MessageCircle 
              className={`absolute text-blue-500 z-10 pointer-events-none ${iconClasses} top-4`} 
            />
          ) : (
            <Search 
              className={`absolute text-muted-foreground z-10 pointer-events-none ${iconClasses} top-1/2 -translate-y-1/2`} 
            />
          )}
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchResults.length > 0 && !chatMode && !isQuestion(query)) {
                setShowResults(true);
              }
            }}
            placeholder={chatMode ? t('helpCenter.chat.followUp', 'Ask a follow-up question...') : (placeholder || defaultPlaceholder)}
            className={cn(
              'flex-1 text-foreground bg-background focus-visible:ring-0 focus-visible:ring-offset-0',
              inputBaseClasses,
              chatMode && 'rounded-b-none border-b'
            )}
            autoFocus={autoFocus}
            data-testid="input-help-search"
          />
          
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {inputModeHint && !chatMode && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                inputModeHint === 'chat' 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                  : "bg-muted text-muted-foreground"
              )}>
                {inputModeHint === 'chat' ? t('helpCenter.chat.aiChat', 'AI Chat') : t('helpCenter.search.label', 'Search')}
              </span>
            )}
            
            {chatMode && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={exitChatMode}
                className="text-muted-foreground"
                data-testid="button-exit-chat"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              type="submit" 
              size={size === 'large' ? 'default' : 'sm'}
              className="rounded-full"
              disabled={!query.trim() || isSearching || isChatLoading}
              data-testid="button-help-search"
            >
              {isSearching || isChatLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : chatMode ? (
                <Send className="h-4 w-4" />
              ) : (
                isQuestion(query) ? t('helpCenter.chat.ask', 'Ask') : t('helpCenter.search.label', 'Search')
              )}
            </Button>
          </div>
        </div>
      </form>

      {showResults && searchResults.length > 0 && !chatMode && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-xl border z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-3 py-2">
              {t('helpCenter.search.resultsFound', '{{count}} results found', { count: searchResults.length })}
            </p>
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result.slug)}
                className="w-full text-left px-3 py-3 rounded-lg hover-elevate flex items-start gap-3 transition-colors"
                data-testid={`search-result-${result.slug}`}
              >
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{result.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {result.description || result.excerpt}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              </button>
            ))}
          </div>
          <div className="border-t px-3 py-2">
            <button
              onClick={() => setLocation(`/help/search?q=${encodeURIComponent(query)}`)}
              className="text-sm text-blue-600 flex items-center gap-1"
              data-testid="button-view-all-results"
            >
              {t('helpCenter.search.viewAll', 'View all results')}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {chatMode && (
        <div className="bg-background rounded-b-xl shadow-xl border border-t-0 z-50">
          <div ref={chatContainerRef} className="max-h-80 overflow-y-auto p-4 space-y-4">
            {chatMessages.filter(m => m.id !== 'greeting' || isChatLoading).map(message => (
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
                      : 'bg-muted text-foreground rounded-bl-md'
                  )}
                  style={message.role === 'user' && stakeholderColor ? { backgroundColor: stakeholderColor } : undefined}
                  data-testid={`chat-message-${message.role}-${message.id}`}
                >
                  <p className={cn(
                    "text-sm whitespace-pre-wrap text-left",
                    message.role === 'user' ? 'text-white' : 'text-foreground'
                  )}>{message.content}</p>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">{t('helpCenter.chat.relatedArticles', 'Related articles:')}</p>
                      <div className="space-y-1">
                        {message.sources.map(source => (
                          <button
                            key={source.slug}
                            onClick={() => {
                              exitChatMode();
                              setLocation(`/help/modules/${source.slug}`);
                            }}
                            className="text-xs text-blue-400 flex items-center gap-1 hover:underline"
                          >
                            <FileText className="h-3 w-3" />
                            {source.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t px-4 py-3 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {t('helpCenter.chat.aiPowered', 'AI-powered assistant')}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={exitChatMode}
              className="text-xs"
              data-testid="button-close-chat"
            >
              {t('helpCenter.chat.close', 'Close chat')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

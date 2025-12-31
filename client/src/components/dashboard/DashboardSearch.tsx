import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Search, ArrowRight, Building2, Users, Calendar, HelpCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

function formatResponseText(text: string): JSX.Element[] {
  const elements: JSX.Element[] = [];
  const lines = text.split(/\n+/).filter(line => line.trim());
  
  lines.forEach((line, lineIndex) => {
    let content = line.trim();
    
    if (content === '---' || content === '***') {
      elements.push(
        <hr key={lineIndex} className="my-3 border-slate-200 dark:border-slate-700" />
      );
      return;
    }
    
    content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    content = content.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">$1</code>');
    
    if (content.startsWith('* ') || content.startsWith('- ')) {
      const listContent = content.slice(2);
      elements.push(
        <li 
          key={lineIndex} 
          className="ml-4 text-sm text-slate-600 dark:text-slate-400 py-0.5"
          dangerouslySetInnerHTML={{ __html: listContent }}
        />
      );
    } else {
      elements.push(
        <p 
          key={lineIndex} 
          className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2 last:mb-0"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
  });
  
  return elements;
}

interface DataResult {
  type: 'employee' | 'project' | 'schedule' | 'knowledge';
  title: string;
  subtitle?: string;
  details?: Record<string, string | number>;
  link?: string;
}

interface AssistantResponse {
  response: string;
  results: DataResult[];
  suggestions: string[];
  category?: string;
}

const typeConfig = {
  employee: { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/50' },
  project: { icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
  schedule: { icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/50' },
  knowledge: { icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/50' },
};

export function DashboardSearch() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResponse(null);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest('POST', '/api/assistant/query', { query: searchQuery });
      const result: AssistantResponse = await res.json();
      setResponse(result);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search failed:', error);
      setResponse(null);
      setIsOpen(false);
      toast({
        title: t('search.unavailable', 'Search unavailable'),
        description: t('search.tryAgain', 'Please try again in a moment.'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(value);
    }, 300);
  };

  const handleResultClick = (result: DataResult) => {
    if (result.link) {
      setLocation(result.link);
    }
    setIsOpen(false);
    setQuery('');
    setResponse(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !response) return;

    const totalItems = response.results.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < totalItems) {
          handleResultClick(response.results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex-1 max-w-md lg:max-w-xl">
      <div className="relative">
        {isLoading ? (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        )}
        <Input
          ref={inputRef}
          type="text"
          placeholder={t('search.placeholder', 'Ask anything...')}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => response && setIsOpen(true)}
          className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0B64A3]/20 focus:border-[#0B64A3]"
          data-testid="input-dashboard-search"
        />
      </div>

      {isOpen && response && (response.results.length > 0 || response.response) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-[200] max-h-[70vh] overflow-y-auto"
          data-testid="dropdown-search-results"
        >
          {response.response && (
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 max-h-48 overflow-y-auto">
              <div className="prose prose-sm dark:prose-invert prose-slate max-w-none">
                {formatResponseText(response.response)}
              </div>
            </div>
          )}

          {response.results.length > 0 && (
            <div className="py-1">
              {response.results.map((result, index) => {
                const config = typeConfig[result.type] || typeConfig.knowledge;
                const Icon = config.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={`${result.type}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "w-full px-4 py-3 flex items-start gap-3 text-left transition-colors",
                      isSelected
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                    data-testid={`search-result-${result.type}-${index}`}
                  >
                    <div className={cn("w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0", config.bg)}>
                      <Icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {result.subtitle}
                        </p>
                      )}
                      {result.details && Object.keys(result.details).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {Object.entries(result.details).slice(0, 3).map(([key, value]) => (
                            <span
                              key={key}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {result.link && (
                      <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {response.suggestions && response.suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">{t('search.tryAsking', 'Try asking')}</p>
              <div className="flex flex-wrap gap-1.5">
                {response.suggestions.slice(0, 3).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(suggestion);
                      fetchResults(suggestion);
                    }}
                    className="text-xs px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    data-testid={`search-suggestion-${i}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

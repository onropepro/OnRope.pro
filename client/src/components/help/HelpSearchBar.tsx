import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HelpSearchBarProps {
  placeholder?: string;
  size?: 'default' | 'large';
  autoFocus?: boolean;
}

export default function HelpSearchBar({ 
  placeholder = 'Search for help topics...', 
  size = 'default',
  autoFocus = false,
}: HelpSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [, setLocation] = useLocation();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      setLocation(`/help/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, setLocation]);

  const inputClasses = size === 'large' 
    ? 'h-14 text-base pl-12 rounded-full border-0 shadow-lg' 
    : 'h-10 pl-10 rounded-full';

  const iconClasses = size === 'large'
    ? 'h-5 w-5 left-4'
    : 'h-4 w-4 left-3';

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center w-full">
        <Search 
          className={`absolute text-muted-foreground z-10 pointer-events-none ${iconClasses}`} 
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 text-foreground bg-background pr-24 ${inputClasses}`}
          autoFocus={autoFocus}
          data-testid="input-help-search"
        />
        <Button 
          type="submit" 
          size={size === 'large' ? 'default' : 'sm'}
          className="absolute right-1.5 rounded-full"
          disabled={!query.trim() || isSearching}
          data-testid="button-help-search"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </div>
    </form>
  );
}

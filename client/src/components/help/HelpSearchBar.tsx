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
    ? 'h-12 text-base pl-12' 
    : 'h-9 pl-10';

  const iconClasses = size === 'large'
    ? 'h-5 w-5 left-4'
    : 'h-4 w-4 left-3';

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search 
        className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${iconClasses}`} 
      />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`pr-24 ${inputClasses}`}
        autoFocus={autoFocus}
        data-testid="input-help-search"
      />
      <Button 
        type="submit" 
        size={size === 'large' ? 'default' : 'sm'}
        className="absolute right-1 top-1/2 -translate-y-1/2"
        disabled={!query.trim() || isSearching}
        data-testid="button-help-search"
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Search'
        )}
      </Button>
    </form>
  );
}

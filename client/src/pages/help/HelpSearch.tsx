import { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import HelpSearchBar from '@/components/help/HelpSearchBar';
import HelpArticleCard from '@/components/help/HelpArticleCard';
import HelpBreadcrumb from '@/components/help/HelpBreadcrumb';
import HelpChatWidget from '@/components/help/HelpChatWidget';
import { PublicHeader } from '@/components/PublicHeader';

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  stakeholders: string[] | null;
  excerpt: string;
  relevance: number;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
}

export default function HelpSearch() {
  const { t } = useTranslation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const query = params.get('q') || '';

  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['/api/help/search', query],
    queryFn: async () => {
      const res = await fetch(`/api/help/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Link href="/help">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Help Center
              </Button>
            </Link>
            <HelpBreadcrumb items={[{ label: 'Search Results' }]} />
          </div>
          <div className="max-w-2xl">
            <HelpSearchBar placeholder={t('helpCenter.searchAgain', 'Search again...')} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {!query ? (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Enter a search term</h2>
            <p className="text-muted-foreground">
              Search for help topics, features, or troubleshooting guides
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">Search failed. Please try again.</p>
            <Link href="/help">
              <Button>Return to Help Center</Button>
            </Link>
          </div>
        ) : data?.results.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any articles matching "{query}"
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Try different keywords or ask our AI assistant
            </p>
            <Button 
              onClick={() => {
                const chatBtn = document.querySelector('[data-testid="button-help-chat-open"]') as HTMLButtonElement;
                chatBtn?.click();
              }}
            >
              Ask AI Assistant
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2" data-testid="text-search-results-title">
                Search results for "{query}"
              </h1>
              <p className="text-muted-foreground">
                Found {data?.total || 0} result{(data?.total || 0) !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.results.map((result) => (
                <HelpArticleCard
                  key={result.slug}
                  slug={result.slug}
                  title={result.title}
                  description={result.description}
                  category={result.category}
                  stakeholders={result.stakeholders}
                  excerpt={result.excerpt}
                  relevance={result.relevance}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <HelpChatWidget />
    </div>
  );
}

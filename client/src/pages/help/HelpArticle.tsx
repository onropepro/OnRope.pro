import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft, Calendar, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import HelpBreadcrumb from '@/components/help/HelpBreadcrumb';
import HelpChatWidget from '@/components/help/HelpChatWidget';
import { PublicHeader } from '@/components/PublicHeader';

interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  sourceFile: string;
  content: string;
  stakeholders: string[] | null;
  isPublished: boolean;
  indexedAt: string;
  updatedAt: string;
}

const categoryLabels: Record<string, string> = {
  operations: 'Operations',
  safety: 'Safety & Compliance',
  hr: 'HR & Team',
  financial: 'Financial',
  communication: 'Communication',
  customization: 'Customization',
};

const stakeholderLabels: Record<string, string> = {
  owner: 'Company Owners',
  technician: 'Technicians',
  'building-manager': 'Building Managers',
  'property-manager': 'Property Managers',
  operations_manager: 'Operations Managers',
  supervisor: 'Supervisors',
};

export default function HelpArticle() {
  const [, params] = useRoute('/help/modules/:slug');
  const slug = params?.slug || '';

  const { data, isLoading, error } = useQuery<{ article: HelpArticle }>({
    queryKey: ['/api/help/articles', slug],
    queryFn: async () => {
      const res = await fetch(`/api/help/articles/${slug}`);
      if (!res.ok) throw new Error('Article not found');
      return res.json();
    },
    enabled: !!slug,
  });

  const article = data?.article;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or hasn't been indexed yet.
          </p>
          <Link href="/help">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help Center
            </Button>
          </Link>
        </div>
        <HelpChatWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Link href="/help">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Help Center
              </Button>
            </Link>
            <HelpBreadcrumb items={[
              { label: categoryLabels[article.category] || article.category, href: `/help?category=${article.category}` },
              { label: article.title },
            ]} />
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant="secondary">
                {categoryLabels[article.category] || article.category}
              </Badge>
              {article.stakeholders?.map(stakeholder => (
                <Badge key={stakeholder} variant="outline">
                  {stakeholderLabels[stakeholder] || stakeholder}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-article-title">
              {article.title}
            </h1>
            
            {article.description && (
              <p className="text-lg text-muted-foreground mb-4">
                {article.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Updated {new Date(article.updatedAt).toLocaleDateString()}
              </span>
              {article.stakeholders && article.stakeholders.length > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  For {article.stakeholders.length} role{article.stakeholders.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90">
                {(() => {
                  try {
                  // Helper function to render inline formatting (bold, links)
                  const renderInlineFormatting = (text: string) => {
                    if (!text) return null;
                    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
                    return parts.map((part, i) => {
                      if (!part) return null;
                      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
                      }
                      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                      if (linkMatch) {
                        return (
                          <a key={i} href={linkMatch[2]} className="text-primary hover:underline">
                            {linkMatch[1]}
                          </a>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    });
                  };
                  
                  // Parse content line by line for more accurate rendering
                  const lines = article.content.split('\n');
                  const elements: JSX.Element[] = [];
                  let i = 0;
                  
                  while (i < lines.length) {
                    const line = lines[i].trim();
                    
                    // Skip empty lines
                    if (!line) {
                      i++;
                      continue;
                    }
                    
                    // Skip h1 title (rendered separately)
                    if (line.startsWith('# ') && !line.startsWith('## ')) {
                      i++;
                      continue;
                    }
                    
                    // h2 headings
                    if (line.startsWith('## ')) {
                      elements.push(
                        <h2 key={`h2-${i}`} className="text-xl font-semibold mt-8 mb-4 first:mt-0 border-b pb-2">
                          {line.slice(3)}
                        </h2>
                      );
                      i++;
                      continue;
                    }
                    
                    // h3 headings
                    if (line.startsWith('### ') && !line.startsWith('#### ')) {
                      elements.push(
                        <h3 key={`h3-${i}`} className="text-lg font-medium mt-6 mb-3">
                          {line.slice(4)}
                        </h3>
                      );
                      i++;
                      continue;
                    }
                    
                    // h4 headings
                    if (line.startsWith('#### ')) {
                      elements.push(
                        <h4 key={`h4-${i}`} className="text-base font-medium mt-4 mb-2">
                          {line.slice(5)}
                        </h4>
                      );
                      i++;
                      continue;
                    }
                    
                    // Code blocks
                    if (line.startsWith('```')) {
                      const codeLines: string[] = [];
                      i++; // Skip opening ```
                      while (i < lines.length && !lines[i].trim().startsWith('```')) {
                        codeLines.push(lines[i]);
                        i++;
                      }
                      if (i < lines.length) i++; // Skip closing ``` if it exists
                      elements.push(
                        <pre key={`code-${i}`} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                          <code className="text-sm">{codeLines.join('\n')}</code>
                        </pre>
                      );
                      continue;
                    }
                    
                    // Horizontal rules
                    if (line === '---') {
                      elements.push(<hr key={`hr-${i}`} className="my-6 border-border" />);
                      i++;
                      continue;
                    }
                    
                    // Images - ![alt text](src)
                    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                    if (imageMatch) {
                      const altText = imageMatch[1];
                      const imageSrc = imageMatch[2];
                      elements.push(
                        <figure key={`img-${i}`} className="my-6">
                          <img 
                            src={imageSrc} 
                            alt={altText}
                            className="rounded-lg border shadow-sm max-w-[50%]"
                          />
                          {altText && (
                            <figcaption className="text-sm text-muted-foreground text-center mt-2 italic">
                              {altText}
                            </figcaption>
                          )}
                        </figure>
                      );
                      i++;
                      continue;
                    }
                    
                    // Markdown tables - detect lines starting with |
                    if (line.startsWith('|') && line.endsWith('|')) {
                      const tableRows: string[][] = [];
                      let hasHeader = false;
                      
                      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
                        const rowLine = lines[i].trim();
                        // Check if this is a separator row (|---|---|)
                        if (/^\|[\s\-:|]+\|$/.test(rowLine)) {
                          hasHeader = true;
                          i++;
                          continue;
                        }
                        // Parse cells - split by | and filter out empty first/last
                        const cells = rowLine.split('|').slice(1, -1).map(cell => cell.trim());
                        tableRows.push(cells);
                        i++;
                      }
                      
                      if (tableRows.length > 0) {
                        const headerRow = hasHeader ? tableRows[0] : null;
                        const bodyRows = hasHeader ? tableRows.slice(1) : tableRows;
                        
                        elements.push(
                          <div key={`table-${i}`} className="my-6 overflow-x-auto">
                            <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
                              {headerRow && (
                                <thead className="bg-muted">
                                  <tr>
                                    {headerRow.map((cell, idx) => (
                                      <th key={idx} className="border border-border px-4 py-2 text-left font-semibold text-sm">
                                        {renderInlineFormatting(cell)}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                              )}
                              <tbody>
                                {bodyRows.map((row, rowIdx) => (
                                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                                    {row.map((cell, cellIdx) => (
                                      <td key={cellIdx} className="border border-border px-4 py-2 text-sm">
                                        {renderInlineFormatting(cell)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }
                      continue;
                    }
                    
                    // Bullet list
                    if (line.startsWith('- ')) {
                      const items: string[] = [];
                      while (i < lines.length && lines[i].trim().startsWith('- ')) {
                        items.push(lines[i].trim().slice(2));
                        i++;
                      }
                      elements.push(
                        <ul key={`ul-${i}`} className="list-disc pl-6 space-y-1 my-4">
                          {items.map((item, idx) => (
                            <li key={idx} className="text-base">
                              {renderInlineFormatting(item)}
                            </li>
                          ))}
                        </ul>
                      );
                      continue;
                    }
                    
                    // Numbered list
                    if (/^\d+\.\s/.test(line)) {
                      const items: string[] = [];
                      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
                        i++;
                      }
                      elements.push(
                        <ol key={`ol-${i}`} className="list-decimal pl-6 space-y-1 my-4">
                          {items.map((item, idx) => (
                            <li key={idx} className="text-base">
                              {renderInlineFormatting(item)}
                            </li>
                          ))}
                        </ol>
                      );
                      continue;
                    }
                    
                    // Q&A format - capture both Q and A lines together
                    if (line.startsWith('**Q:')) {
                      const questionLine = line;
                      i++;
                      // Get the answer line if it exists
                      let answerLine = '';
                      if (i < lines.length && lines[i].trim().startsWith('A:')) {
                        answerLine = lines[i].trim();
                        i++;
                      }
                      elements.push(
                        <div key={`qa-${i}`} className="my-4 p-4 bg-muted/50 rounded-lg space-y-2">
                          <p className="text-base font-medium">
                            {renderInlineFormatting(questionLine)}
                          </p>
                          {answerLine && (
                            <p className="text-base text-muted-foreground">
                              {renderInlineFormatting(answerLine)}
                            </p>
                          )}
                        </div>
                      );
                      continue;
                    }
                    
                    // Regular paragraph - collect consecutive non-empty text lines
                    const paragraphLines: string[] = [];
                    while (i < lines.length && 
                           lines[i].trim() && 
                           !lines[i].trim().startsWith('#') && 
                           !lines[i].trim().startsWith('- ') &&
                           !lines[i].trim().startsWith('```') &&
                           !lines[i].trim().startsWith('**Q:') &&
                           !lines[i].trim().startsWith('![') &&
                           !/^\d+\.\s/.test(lines[i].trim()) &&
                           lines[i].trim() !== '---') {
                      paragraphLines.push(lines[i].trim());
                      i++;
                    }
                    if (paragraphLines.length > 0) {
                      elements.push(
                        <p key={`p-${i}`} className="mb-4 text-base leading-relaxed">
                          {renderInlineFormatting(paragraphLines.join(' '))}
                        </p>
                      );
                    } else {
                      // Safety fallback - if nothing matched, skip this line to prevent infinite loop
                      i++;
                    }
                  }
                  
                  return elements;
                  } catch (error) {
                    console.error('Error parsing markdown:', error);
                    return <p className="text-destructive">Error rendering content. Please try refreshing the page.</p>;
                  }
                })()}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Need more help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have questions about {article.title.toLowerCase()}, our AI assistant can help.
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
        </div>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}

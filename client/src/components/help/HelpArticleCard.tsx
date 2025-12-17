import { Link } from 'wouter';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Shield, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Palette,
  FileText,
} from 'lucide-react';

interface HelpArticleCardProps {
  slug: string;
  title: string;
  description?: string | null;
  category: string;
  stakeholders?: string[] | null;
  excerpt?: string;
  relevance?: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
  operations: <Briefcase className="h-4 w-4" />,
  safety: <Shield className="h-4 w-4" />,
  hr: <Users className="h-4 w-4" />,
  financial: <DollarSign className="h-4 w-4" />,
  communication: <MessageSquare className="h-4 w-4" />,
  customization: <Palette className="h-4 w-4" />,
};

const categoryLabels: Record<string, string> = {
  operations: 'Operations',
  safety: 'Safety',
  hr: 'HR & Team',
  financial: 'Financial',
  communication: 'Communication',
  customization: 'Customization',
};

export default function HelpArticleCard({
  slug,
  title,
  description,
  category,
  stakeholders,
  excerpt,
  relevance,
}: HelpArticleCardProps) {
  return (
    <Link href={`/help/modules/${slug}`}>
      <Card 
        className="h-full cursor-pointer transition-shadow hover:shadow-md"
        data-testid={`card-article-${slug}`}
      >
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1">
              {categoryIcons[category] || <FileText className="h-4 w-4" />}
              <span>{categoryLabels[category] || category}</span>
            </Badge>
            {relevance !== undefined && relevance > 0.5 && (
              <Badge variant="outline" className="text-xs">
                {Math.round(relevance * 100)}% match
              </Badge>
            )}
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {excerpt || description || 'Learn more about this feature'}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

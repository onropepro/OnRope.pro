import { Link } from 'wouter';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  HeartPulse, 
  Users, 
  Wallet, 
  MessageSquare, 
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

// Category configuration matching mega menu colors
const categoryConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  operations: { 
    icon: <Settings className="h-4 w-4" />, 
    label: 'Operations', 
    color: 'text-blue-600' 
  },
  safety: { 
    icon: <HeartPulse className="h-4 w-4" />, 
    label: 'Safety', 
    color: 'text-red-600' 
  },
  hr: { 
    icon: <Users className="h-4 w-4" />, 
    label: 'Team', 
    color: 'text-violet-600' 
  },
  team: { 
    icon: <Users className="h-4 w-4" />, 
    label: 'Team', 
    color: 'text-violet-600' 
  },
  financial: { 
    icon: <Wallet className="h-4 w-4" />, 
    label: 'Financial & Sales', 
    color: 'text-emerald-600' 
  },
  communication: { 
    icon: <MessageSquare className="h-4 w-4" />, 
    label: 'Communication', 
    color: 'text-rose-600' 
  },
  customization: { 
    icon: <Settings className="h-4 w-4" />, 
    label: 'Operations', 
    color: 'text-blue-600' 
  },
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
  const config = categoryConfig[category] || { 
    icon: <FileText className="h-4 w-4" />, 
    label: category, 
    color: 'text-muted-foreground' 
  };

  return (
    <Link href={`/help/modules/${slug}`}>
      <Card 
        className="h-full cursor-pointer transition-shadow hover:shadow-md"
        data-testid={`card-article-${slug}`}
      >
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={`flex items-center gap-1 ${config.color}`}>
              {config.icon}
              <span>{config.label}</span>
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

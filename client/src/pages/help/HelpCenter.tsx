import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  Users, 
  Shield, 
  Briefcase,
  HardHat,
  DollarSign,
  MessageSquare,
  Palette,
  Calendar,
  FileText,
  ClipboardList,
  BarChart3,
  BookOpen,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HelpSearchBar from '@/components/help/HelpSearchBar';
import HelpChatWidget from '@/components/help/HelpChatWidget';

interface Module {
  slug: string;
  title: string;
  category: string;
  stakeholders: string[];
}

const stakeholderCards = [
  {
    id: 'owner',
    title: 'For Company Owners',
    description: 'Manage your business, team, and grow efficiently',
    href: '/help/for-company-owners',
    icon: Building2,
    color: 'bg-blue-500',
  },
  {
    id: 'technician',
    title: 'For Technicians',
    description: 'Track your time, certifications, and career',
    href: '/help/for-technicians',
    icon: HardHat,
    color: 'bg-amber-500',
  },
  {
    id: 'building-manager',
    title: 'For Building Managers',
    description: 'Monitor work, compliance, and communicate with residents',
    href: '/help/for-building-managers',
    icon: Building2,
    color: 'bg-violet-500',
  },
  {
    id: 'property-manager',
    title: 'For Property Managers',
    description: 'Oversee your portfolio and vendor relationships',
    href: '/help/for-property-managers',
    icon: Users,
    color: 'bg-emerald-500',
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  operations: <Briefcase className="h-5 w-5" />,
  safety: <Shield className="h-5 w-5" />,
  hr: <Users className="h-5 w-5" />,
  financial: <DollarSign className="h-5 w-5" />,
  communication: <MessageSquare className="h-5 w-5" />,
  customization: <Palette className="h-5 w-5" />,
};

const moduleIcons: Record<string, React.ReactNode> = {
  'project-management': <ClipboardList className="h-5 w-5" />,
  'time-tracking': <Calendar className="h-5 w-5" />,
  'safety-compliance': <Shield className="h-5 w-5" />,
  'irata-sprat-logging': <FileText className="h-5 w-5" />,
  'employee-management': <Users className="h-5 w-5" />,
  'document-management': <FileText className="h-5 w-5" />,
  'gear-inventory': <Briefcase className="h-5 w-5" />,
  'scheduling': <Calendar className="h-5 w-5" />,
  'payroll': <DollarSign className="h-5 w-5" />,
  'company-safety-rating': <Shield className="h-5 w-5" />,
  'job-board': <Users className="h-5 w-5" />,
  'quoting-sales': <DollarSign className="h-5 w-5" />,
  'resident-portal': <MessageSquare className="h-5 w-5" />,
  'property-manager-interface': <Building2 className="h-5 w-5" />,
  'white-label-branding': <Palette className="h-5 w-5" />,
  'analytics-reporting': <BarChart3 className="h-5 w-5" />,
};

export default function HelpCenter() {
  const { data: modulesData, isLoading } = useQuery<{ modules: Module[] }>({
    queryKey: ['/api/help/modules'],
  });

  const modules = modulesData?.modules || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-help-title">
              How can we help you?
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Search our knowledge base or browse by topic
            </p>
            <div className="max-w-xl mx-auto">
              <HelpSearchBar 
                size="large" 
                placeholder="Search for help with projects, safety, scheduling..."
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" data-testid="text-section-stakeholders">
            Find help for your role
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stakeholderCards.map((card) => (
              <Link key={card.id} href={card.href}>
                <Card 
                  className="h-full cursor-pointer transition-shadow hover:shadow-md"
                  data-testid={`card-stakeholder-${card.id}`}
                >
                  <CardHeader className="flex flex-col gap-3">
                    <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                      <CardDescription className="mt-1">{card.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <h2 className="text-2xl font-semibold" data-testid="text-section-modules">
              Browse by module
            </h2>
            <Link href="/help/getting-started">
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Getting Started Guide
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {modules.map((module) => (
                <Link key={module.slug} href={`/help/modules/${module.slug}`}>
                  <Card 
                    className="h-full cursor-pointer transition-shadow hover:shadow-md"
                    data-testid={`card-module-${module.slug}`}
                  >
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground shrink-0">
                        {moduleIcons[module.slug] || categoryIcons[module.category] || <FileText className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base truncate">{module.title}</CardTitle>
                        <CardDescription className="capitalize">{module.category}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" data-testid="text-section-popular">
            Popular topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TopicCard 
              title="How to create a project" 
              description="Learn the basics of setting up your first project"
              href="/help/modules/project-management"
            />
            <TopicCard 
              title="Time tracking and GPS" 
              description="Track billable hours and technician locations"
              href="/help/modules/time-tracking"
            />
            <TopicCard 
              title="Safety inspections" 
              description="Complete harness inspections and safety documentation"
              href="/help/modules/safety-compliance"
            />
            <TopicCard 
              title="IRATA certification logging" 
              description="Log work hours for certification progression"
              href="/help/modules/irata-sprat-logging"
            />
            <TopicCard 
              title="Scheduling technicians" 
              description="Assign technicians to projects efficiently"
              href="/help/modules/scheduling"
            />
            <TopicCard 
              title="ROI Calculator" 
              description="Calculate your potential savings with OnRopePro"
              href="/help/tools/roi-calculator"
            />
          </div>
        </section>
        
        <section className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
          <p className="text-muted-foreground mb-4">
            Our AI assistant can answer your questions instantly
          </p>
          <Button 
            onClick={() => {
              const chatBtn = document.querySelector('[data-testid="button-help-chat-open"]') as HTMLButtonElement;
              chatBtn?.click();
            }}
            data-testid="button-open-chat-cta"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with AI Assistant
          </Button>
        </section>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}

function TopicCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href}>
      <Card 
        className="h-full cursor-pointer transition-shadow hover:shadow-md"
        data-testid={`card-topic-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

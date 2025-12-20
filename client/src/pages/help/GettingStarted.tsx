import { Link } from 'wouter';
import { 
  ArrowLeft, 
  Building2, 
  HardHat, 
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import HelpBreadcrumb from '@/components/help/HelpBreadcrumb';
import HelpChatWidget from '@/components/help/HelpChatWidget';
import { PublicHeader } from '@/components/PublicHeader';

export default function GettingStarted() {
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
            <HelpBreadcrumb items={[{ label: 'Getting Started' }]} />
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-getting-started-title">
            Getting Started with OnRopePro
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Welcome to OnRopePro! Choose your role below to get personalized onboarding guidance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <RoleCard
              title="Company Owner"
              description="Set up your business, add team members, and start managing projects"
              icon={Building2}
              color="blue"
              href="/help/for-company-owners"
              steps={[
                'Create your company account',
                'Configure company settings and branding',
                'Add team members and set permissions',
                'Create your first project',
                'Set up safety documentation',
              ]}
            />
            
            <RoleCard
              title="Technician"
              description="Track time, log IRATA hours, and manage your certifications"
              icon={HardHat}
              color="amber"
              href="/help/for-technicians"
              steps={[
                'Register as a technician',
                'Add your certifications',
                'Connect with your employer',
                'Learn to clock in/out',
                'Start logging IRATA tasks',
              ]}
            />
            
            <RoleCard
              title="Building Manager"
              description="Monitor work at your building and communicate with residents"
              icon={Building2}
              color="violet"
              href="/help/for-building-managers"
              steps={[
                'Create your free account',
                'Connect to your building',
                'View vendor safety ratings',
                'Set up resident notifications',
                'Access documentation',
              ]}
            />
            
            <RoleCard
              title="Property Manager"
              description="Oversee your portfolio and manage vendor relationships"
              icon={Users}
              color="emerald"
              href="/help/for-property-managers"
              steps={[
                'Create your PM account',
                'Add buildings to portfolio',
                'Connect with vendors',
                'Compare safety ratings',
                'Track service history',
              ]}
            />
          </div>
          
          <section className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our AI assistant is available 24/7 to answer your questions about OnRopePro. 
              Click the chat button in the bottom right corner to get started.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => {
                  const chatBtn = document.querySelector('[data-testid="button-help-chat-open"]') as HTMLButtonElement;
                  chatBtn?.click();
                }}
              >
                Chat with AI Assistant
              </Button>
              <Link href="/help">
                <Button variant="outline">
                  Browse Help Topics
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}

function RoleCard({ 
  title, 
  description, 
  icon: Icon, 
  color,
  href,
  steps,
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  color: 'blue' | 'amber' | 'violet' | 'emerald';
  href: string;
  steps: string[];
}) {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    amber: 'bg-amber-500 text-white',
    violet: 'bg-violet-500 text-white',
    emerald: 'bg-emerald-500 text-white',
  };

  return (
    <Card className="h-full" data-testid={`card-role-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
        <Link href={href}>
          <Button variant="outline" className="w-full">
            Learn More
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

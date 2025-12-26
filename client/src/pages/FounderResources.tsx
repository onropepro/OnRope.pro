import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Code,
  Rocket,
  TrendingUp,
  Link as LinkIcon,
  FileText,
  Target,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Mail,
  BookOpen,
  Plus,
  Trash2,
  Globe,
  Database,
  CreditCard,
  MessageSquare,
  Settings,
  Shield
} from "lucide-react";

interface ResourceLink {
  name: string;
  url: string;
  description: string;
  icon: any;
}

interface DBResource {
  id: string;
  name: string;
  url: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  sortOrder: number | null;
}

interface StrategyItem {
  title: string;
  status: "completed" | "in-progress" | "planned";
  description: string;
  notes?: string;
}

const iconMap: Record<string, any> = {
  Code,
  Globe,
  Database,
  CreditCard,
  Mail,
  BookOpen,
  FileText,
  TrendingUp,
  MessageSquare,
  Settings,
  Shield,
  Link: LinkIcon,
};

const developmentTools: ResourceLink[] = [
  {
    name: "Replit Workspace",
    url: "https://replit.com",
    description: "Main development environment",
    icon: Code,
  },
  {
    name: "GitHub Repository",
    url: "https://github.com",
    description: "Source code version control",
    icon: Code,
  },
  {
    name: "Stripe Dashboard",
    url: "https://dashboard.stripe.com",
    description: "Payment processing and subscriptions | info@onrope.pro",
    icon: TrendingUp,
  },
  {
    name: "Neon Database",
    url: "https://console.neon.tech",
    description: "PostgreSQL database management",
    icon: FileText,
  },
  {
    name: "NotebookLM",
    url: "https://notebooklm.google.com",
    description: "AI research assistant | info@onrope.pro",
    icon: BookOpen,
  },
  {
    name: "Gmail",
    url: "https://mail.google.com",
    description: "Email | info@onrope.pro",
    icon: Mail,
  },
  {
    name: "Shadcn Blocks",
    url: "https://www.shadcnblocks.com/components",
    description: "UI component blocks and templates",
    icon: Code,
  },
  {
    name: "21st.dev Components",
    url: "https://21st.dev/community/components",
    description: "Community UI components",
    icon: Code,
  },
  {
    name: "2Captcha",
    url: "https://2captcha.com/",
    description: "CAPTCHA solving API | Use Google account to login",
    icon: Code,
  },
];

const launchStrategy: StrategyItem[] = [
  {
    title: "Core Platform Development",
    status: "completed",
    description: "Build all essential features for rope access management",
    notes: "Employee management, projects, safety forms, scheduling, inventory tracking all complete",
  },
  {
    title: "Security Hardening",
    status: "completed",
    description: "Implement rate limiting, password policies, and access controls",
    notes: "Completed Dec 4, 2025 - Rate limiting, password complexity, session security",
  },
  {
    title: "Beta Testing",
    status: "in-progress",
    description: "Onboard initial rope access companies for feedback",
    notes: "Targeting 3-5 companies for beta testing phase",
  },
  {
    title: "Documentation & Knowledge Base",
    status: "completed",
    description: "Create comprehensive guides for all platform features",
    notes: "19 guide pages covering all major platform areas",
  },
  {
    title: "Marketing Website",
    status: "planned",
    description: "Build public-facing marketing site with pricing and features",
  },
  {
    title: "Public Launch",
    status: "planned",
    description: "Official launch with marketing campaign",
  },
];

const salesStrategy: StrategyItem[] = [
  {
    title: "Target Market Identification",
    status: "completed",
    description: "Define ideal customer profile for rope access companies",
    notes: "Focus on mid-size companies (5-50 technicians) with multiple building contracts",
  },
  {
    title: "Pricing Structure",
    status: "completed",
    description: "Establish subscription tiers (Basic, Starter, Premium, Enterprise)",
    notes: "USD and CAD pricing with add-ons for white-label branding",
  },
  {
    title: "Sales Collateral",
    status: "planned",
    description: "Create pitch deck, one-pagers, and demo videos",
  },
  {
    title: "Outreach Campaign",
    status: "planned",
    description: "Direct outreach to rope access companies in target regions",
  },
  {
    title: "Partnership Strategy",
    status: "planned",
    description: "Partner with irata and SPRAT certification bodies for referrals",
  },
];

const importantNotes: string[] = [
  "Always test payment flows in Stripe test mode before production",
  "Database backups are handled automatically by Neon",
  "Replit provides automatic SSL certificates for deployed apps",
  "SESSION_SECRET environment variable is required for production",
];

function StatusBadge({ status }: { status: "completed" | "in-progress" | "planned" }) {
  if (status === "completed") {
    return (
      <Badge variant="default" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Completed
      </Badge>
    );
  }
  if (status === "in-progress") {
    return (
      <Badge variant="default" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
        <Clock className="w-3 h-3 mr-1" />
        In Progress
      </Badge>
    );
  }
  return (
    <Badge variant="default" className="bg-muted text-muted-foreground">
      <AlertCircle className="w-3 h-3 mr-1" />
      Planned
    </Badge>
  );
}

export default function FounderResources() {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState({ name: "", url: "", description: "", icon: "Link" });

  // Fetch custom resources from database
  const { data: customResources = [], isLoading } = useQuery<DBResource[]>({
    queryKey: ["/api/founder-resources"],
    select: (data: any) => data.resources || [],
  });

  // Add resource mutation
  const addResourceMutation = useMutation({
    mutationFn: async (resource: { name: string; url: string; description: string; icon: string }) => {
      return apiRequest("POST", "/api/founder-resources", resource);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/founder-resources"] });
      setAddDialogOpen(false);
      setNewResource({ name: "", url: "", description: "", icon: "Link" });
      toast({ title: "Resource added", description: "The resource has been added successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to add resource", variant: "destructive" });
    },
  });

  // Delete resource mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/founder-resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/founder-resources"] });
      toast({ title: "Resource deleted", description: "The resource has been removed." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete resource", variant: "destructive" });
    },
  });

  const handleAddResource = () => {
    if (!newResource.name || !newResource.url) {
      toast({ title: "Error", description: "Name and URL are required", variant: "destructive" });
      return;
    }
    addResourceMutation.mutate(newResource);
  };

  return (
    <div className="min-h-screen page-gradient p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <BackButton to="/superuser" label="Back to Dashboard" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Founder Resources</h1>
            <p className="text-muted-foreground mt-1">Private resources for Tommy & Glenn</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-resource">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    placeholder="Resource name"
                    data-testid="input-resource-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    placeholder="https://example.com"
                    data-testid="input-resource-url"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    placeholder="Brief description"
                    data-testid="input-resource-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={newResource.icon} onValueChange={(v) => setNewResource({ ...newResource, icon: v })}>
                    <SelectTrigger data-testid="select-resource-icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Link">Link</SelectItem>
                      <SelectItem value="Code">Code</SelectItem>
                      <SelectItem value="Globe">Globe</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="CreditCard">Payment</SelectItem>
                      <SelectItem value="Mail">Email</SelectItem>
                      <SelectItem value="BookOpen">Book</SelectItem>
                      <SelectItem value="FileText">Document</SelectItem>
                      <SelectItem value="MessageSquare">Chat</SelectItem>
                      <SelectItem value="Settings">Settings</SelectItem>
                      <SelectItem value="Shield">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddResource} disabled={addResourceMutation.isPending} data-testid="button-save-resource">
                  {addResourceMutation.isPending ? "Adding..." : "Add Resource"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="card-development-tools">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <LinkIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Development Tools</CardTitle>
                  <CardDescription>Quick access to key platforms</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {developmentTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-md hover-elevate active-elevate-2 bg-muted/50 group"
                  data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="flex items-center gap-3">
                    <tool.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">{tool.description}</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
              
              {/* Custom resources from database */}
              {customResources.map((resource) => {
                const IconComponent = iconMap[resource.icon || "Link"] || LinkIcon;
                return (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 rounded-md hover-elevate active-elevate-2 bg-muted/50 group"
                    data-testid={`link-resource-${resource.id}`}
                  >
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 flex-1"
                    >
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-sm text-muted-foreground">{resource.description || ""}</div>
                      </div>
                    </a>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteResourceMutation.mutate(resource.id)}
                        data-testid={`button-delete-resource-${resource.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card data-testid="card-important-notes">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle>Important Notes</CardTitle>
                  <CardDescription>Key reminders and best practices</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {importantNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card data-testid="card-launch-strategy">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Rocket className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle>Launch Strategy</CardTitle>
                <CardDescription>Roadmap to market launch</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {launchStrategy.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-md bg-muted/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium">{item.title}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">{item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-sales-strategy">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Sales Strategy</CardTitle>
                <CardDescription>Go-to-market planning</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesStrategy.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-md bg-muted/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium">{item.title}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">{item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground py-4">
          <p>Last updated: December 4, 2025</p>
          <p className="mt-1">Ask the AI assistant to update this page anytime</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SuperUserLayout from "@/components/SuperUserLayout";

interface GiftCompanyForm {
  companyName: string;
  email: string;
  password: string;
  tier: string;
  licenseKey: string;
}

function generateLicenseKey(tier: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const generateSegment = () => Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  const tierSuffix = 'P';
  return `GIFT-${generateSegment()}-${generateSegment()}-${generateSegment()}-${tierSuffix}`;
}

interface GiftCompanyResponse {
  success: boolean;
  message: string;
  user: any;
  licenseKey: string;
  tier: string;
  maxProjects: number;
  maxSeats: number;
}

interface CompanyStats {
  total: number;
  active: number;
  byTier: Record<string, number>;
}

interface MetricsData {
  mrr: number;
  arr: number;
  totalRevenue: number;
  companies: CompanyStats;
}

export default function SuperUser() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [showSuccessInfo, setShowSuccessInfo] = useState<GiftCompanyResponse | null>(null);
  const [formData, setFormData] = useState<GiftCompanyForm>({
    companyName: '',
    email: '',
    password: '',
    tier: 'onropepro',
    licenseKey: generateLicenseKey('onropepro'),
  });

  const { data: metricsData } = useQuery<MetricsData>({
    queryKey: ["/api/superuser/metrics"],
  });

  const { data: companiesData } = useQuery<{ companies: any[] }>({
    queryKey: ["/api/superuser/companies"],
  });

  const { data: buildingsData } = useQuery<{ buildings: any[] }>({
    queryKey: ["/api/superuser/buildings"],
  });

  const { data: tasksData } = useQuery<{ tasks: any[] }>({
    queryKey: ["/api/superuser/tasks"],
  });

  const { data: featureRequestsData } = useQuery<{ requests: any[] }>({
    queryKey: ["/api/superuser/feature-requests"],
  });
  
  const openGiftDialog = () => {
    const newLicenseKey = generateLicenseKey(formData.tier);
    setFormData(prev => ({ ...prev, licenseKey: newLicenseKey }));
    setGiftDialogOpen(true);
  };
  
  const handleTierChange = (newTier: string) => {
    const newLicenseKey = generateLicenseKey(newTier);
    setFormData(prev => ({ ...prev, tier: newTier, licenseKey: newLicenseKey }));
  };

  const giftCompanyMutation = useMutation({
    mutationFn: async (data: GiftCompanyForm) => {
      const response = await apiRequest('POST', '/api/superuser/gift-company', data);
      return await response.json() as GiftCompanyResponse;
    },
    onSuccess: (data) => {
      setShowSuccessInfo(data);
      toast({
        title: t('superUser.accountCreated', 'Account Created'),
        description: data.message,
      });
      setFormData({ companyName: '', email: '', password: '', tier: 'onropepro', licenseKey: generateLicenseKey('onropepro') });
      queryClient.invalidateQueries({ queryKey: ['/api/superuser/companies'] });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('superUser.createFailed', 'Failed to create company account'),
        variant: "destructive",
      });
    },
  });

  const tasks = tasksData?.tasks || [];
  const requests = featureRequestsData?.requests || [];
  const companies = companiesData?.companies || [];
  const buildings = buildingsData?.buildings || [];
  
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'under_review').length;

  return (
    <SuperUserLayout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground">
            Here's an overview of your platform activity
          </p>
        </div>

        {/* Quick Stats - TailAdmin Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="su-metric-card">
            <div className="flex items-center gap-4">
              <div className="su-metric-icon bg-blue-50 dark:bg-blue-500/10">
                <span className="material-icons text-blue-500 text-xl">business</span>
              </div>
              <div>
                <p className="su-metric-value">{companies.length}</p>
                <p className="su-metric-label">Total Companies</p>
              </div>
            </div>
          </div>

          <div className="su-metric-card">
            <div className="flex items-center gap-4">
              <div className="su-metric-icon bg-cyan-50 dark:bg-cyan-500/10">
                <span className="material-icons text-cyan-500 text-xl">apartment</span>
              </div>
              <div>
                <p className="su-metric-value">{buildings.length}</p>
                <p className="su-metric-label">Global Buildings</p>
              </div>
            </div>
          </div>

          <div className="su-metric-card">
            <div className="flex items-center gap-4">
              <div className="su-metric-icon bg-indigo-50 dark:bg-indigo-500/10">
                <span className="material-icons text-indigo-500 text-xl">checklist</span>
              </div>
              <div>
                <p className="su-metric-value">{pendingTasks}</p>
                <p className="su-metric-label">Pending Tasks</p>
              </div>
            </div>
          </div>

          <div className="su-metric-card">
            <div className="flex items-center gap-4">
              <div className="su-metric-icon bg-purple-50 dark:bg-purple-500/10">
                <span className="material-icons text-purple-500 text-xl">lightbulb</span>
              </div>
              <div>
                <p className="su-metric-value">{pendingRequests}</p>
                <p className="su-metric-label">Pending Requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Stats - TailAdmin Style */}
        {metricsData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="su-metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="su-metric-label mb-1">Monthly Revenue</p>
                  <p className="su-metric-value text-emerald-600 dark:text-emerald-400">
                    ${metricsData.mrr?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="su-metric-icon bg-emerald-50 dark:bg-emerald-500/10">
                  <span className="material-icons text-emerald-500 text-xl">trending_up</span>
                </div>
              </div>
            </div>

            <div className="su-metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="su-metric-label mb-1">Annual Revenue</p>
                  <p className="su-metric-value text-blue-600 dark:text-blue-400">
                    ${metricsData.arr?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="su-metric-icon bg-blue-50 dark:bg-blue-500/10">
                  <span className="material-icons text-blue-500 text-xl">assessment</span>
                </div>
              </div>
            </div>

            <div className="su-metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="su-metric-label mb-1">Total Revenue</p>
                  <p className="su-metric-value text-amber-600 dark:text-amber-400">
                    ${metricsData.totalRevenue?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="su-metric-icon bg-amber-50 dark:bg-amber-500/10">
                  <span className="material-icons text-amber-500 text-xl">account_balance</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - TailAdmin Card Style */}
        <div className="su-card">
          <div className="su-card-header">
            <h3 className="su-section-title flex items-center gap-2">
              <span className="material-icons text-blue-500">bolt</span>
              Quick Actions
            </h3>
            <p className="su-section-subtitle text-sm mt-1">Common administrative tasks</p>
          </div>
          <div className="su-card-body">
            <div className="flex flex-wrap gap-3">
              <Button onClick={openGiftDialog} data-testid="button-gift-company">
                <span className="material-icons mr-2">card_giftcard</span>
                Gift Company Account
              </Button>
            </div>
          </div>
        </div>

        {/* Development Quick Logins - For Testing */}
        <div className="su-card">
          <div className="su-card-header">
            <h3 className="su-section-title flex items-center gap-2">
              <span className="material-icons text-purple-500">developer_mode</span>
              Development Quick Logins
            </h3>
            <p className="su-section-subtitle text-sm mt-1">Quick login as different user types for testing</p>
          </div>
          <div className="su-card-body">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600 text-black" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "testcom", password: "test123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/dashboard";
                    } else {
                      toast({ title: t('common.failed', 'Failed'), description: result.message, variant: "destructive" });
                    }
                  } catch (error) {
                    toast({ title: t('common.error', 'Error'), description: t('common.networkError', 'Network error'), variant: "destructive" });
                  }
                }}
                data-testid="button-quick-login-testcom"
              >
                <span className="material-icons mr-1 text-sm">business</span>
                Owner
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "tester@tester.com", password: "tester123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/dashboard";
                    } else {
                      toast({ title: t('common.failed', 'Failed'), description: result.message, variant: "destructive" });
                    }
                  } catch (error) {
                    toast({ title: t('common.error', 'Error'), description: t('common.networkError', 'Network error'), variant: "destructive" });
                  }
                }}
                data-testid="button-quick-login-tester"
              >
                <span className="material-icons mr-1 text-sm">science</span>
                Tester
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "employee@employee.com", password: "employee123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/dashboard";
                    } else {
                      toast({ title: t('common.failed', 'Failed'), description: result.message, variant: "destructive" });
                    }
                  } catch (error) {
                    toast({ title: t('common.error', 'Error'), description: t('common.networkError', 'Network error'), variant: "destructive" });
                  }
                }}
                data-testid="button-quick-login-employee"
              >
                <span className="material-icons mr-1 text-sm">badge</span>
                Employee
              </Button>
              <Button 
                variant="secondary"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "resident@resident.com", password: "resident123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/resident-dashboard";
                    } else {
                      toast({ title: t('common.failed', 'Failed'), description: result.message, variant: "destructive" });
                    }
                  } catch (error) {
                    toast({ title: t('common.error', 'Error'), description: t('common.networkError', 'Network error'), variant: "destructive" });
                  }
                }}
                data-testid="button-quick-login-resident"
              >
                <span className="material-icons mr-1 text-sm">person</span>
                Resident
              </Button>
              <Button 
                variant="secondary"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "property@property.com", password: "property123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/pm-dashboard";
                    } else {
                      toast({ title: t('common.failed', 'Failed'), description: result.message, variant: "destructive" });
                    }
                  } catch (error) {
                    toast({ title: t('common.error', 'Error'), description: t('common.networkError', 'Network error'), variant: "destructive" });
                  }
                }}
                data-testid="button-quick-login-property-manager"
              >
                <span className="material-icons mr-1 text-sm">apartment</span>
                Prop Mgr
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "info@onrope.pro", password: "onropepro" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/superuser";
                    } else {
                      toast({ title: t('common.failed', 'Failed'), description: result.message, variant: "destructive" });
                    }
                  } catch (error) {
                    toast({ title: t('common.error', 'Error'), description: t('common.networkError', 'Network error'), variant: "destructive" });
                  }
                }}
                data-testid="button-quick-login-superuser"
              >
                <span className="material-icons mr-1 text-sm">admin_panel_settings</span>
                SuperUser
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Company Dialog */}
      <Dialog open={giftDialogOpen} onOpenChange={(open) => {
        setGiftDialogOpen(open);
        if (!open) setShowSuccessInfo(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-green-500">card_giftcard</span>
              Gift Company Account
            </DialogTitle>
            <DialogDescription>
              Create a new company account with full access as a gift. No payment required.
            </DialogDescription>
          </DialogHeader>

          {showSuccessInfo ? (
            <div className="space-y-4">
              <div className="rounded-md bg-green-500/10 p-4 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium mb-2">
                  <span className="material-icons text-lg">check_circle</span>
                  Account Created Successfully
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{showSuccessInfo.user.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{showSuccessInfo.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tier:</span>
                    <span className="font-medium">{showSuccessInfo.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects:</span>
                    <span className="font-medium">{showSuccessInfo.maxProjects === -1 ? 'Unlimited' : showSuccessInfo.maxProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats:</span>
                    <span className="font-medium">{showSuccessInfo.maxSeats === -1 ? 'Unlimited' : showSuccessInfo.maxSeats}</span>
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <div className="text-muted-foreground mb-1">License Key:</div>
                    <code className="block text-xs bg-muted p-2 rounded break-all">{showSuccessInfo.licenseKey}</code>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => {
                  setGiftDialogOpen(false);
                  setShowSuccessInfo(null);
                }} data-testid="button-close-success">
                  Close
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              giftCompanyMutation.mutate(formData);
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., ABC Rope Access Ltd."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  data-testid="input-company-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  data-testid="input-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier">Plan</Label>
                <Select
                  value={formData.tier}
                  onValueChange={handleTierChange}
                >
                  <SelectTrigger data-testid="select-tier">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onropepro" data-testid="option-tier-onropepro">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>OnRopePro</span>
                        <span className="text-muted-foreground text-xs">$99/mo, unlimited projects</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* License Key Preview */}
              <div className="space-y-2">
                <Label>License Key</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-muted p-2.5 rounded border font-mono" data-testid="text-license-key-preview">
                    {formData.licenseKey}
                  </code>
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline"
                    onClick={() => {
                      const newKey = generateLicenseKey(formData.tier);
                      setFormData(prev => ({ ...prev, licenseKey: newKey }));
                    }}
                    title="Generate new key"
                    data-testid="button-regenerate-key"
                  >
                    <span className="material-icons text-lg">refresh</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This license key will be assigned to the new company
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setGiftDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={giftCompanyMutation.isPending}
                  data-testid="button-create-gift-account"
                >
                  {giftCompanyMutation.isPending ? (
                    <>
                      <span className="material-icons animate-spin mr-2 text-lg">refresh</span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-2 text-lg">card_giftcard</span>
                      Create Gift Account
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </SuperUserLayout>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GiftCompanyForm {
  companyName: string;
  email: string;
  password: string;
  tier: string;
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

export default function SuperUser() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [showSuccessInfo, setShowSuccessInfo] = useState<GiftCompanyResponse | null>(null);
  const [formData, setFormData] = useState<GiftCompanyForm>({
    companyName: '',
    email: '',
    password: '',
    tier: 'basic',
  });
  
  const { data: userData, isLoading } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const giftCompanyMutation = useMutation({
    mutationFn: async (data: GiftCompanyForm) => {
      const response = await apiRequest('POST', '/api/superuser/gift-company', data);
      return await response.json() as GiftCompanyResponse;
    },
    onSuccess: (data) => {
      setShowSuccessInfo(data);
      toast({
        title: "Account Created",
        description: data.message,
      });
      // Reset form
      setFormData({ companyName: '', email: '', password: '', tier: 'basic' });
      // Refresh companies list if needed
      queryClient.invalidateQueries({ queryKey: ['/api/superuser/companies'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create company account",
        variant: "destructive",
      });
    },
  });
  
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect if not superuser
  if (userData?.user?.role !== 'superuser') {
    setLocation('/');
    return null;
  }
  
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    // Clear ALL query cache to prevent stale data from causing redirect issues
    queryClient.clear();
    setLocation('/login');
  };
  
  return (
    <div className="min-h-screen page-gradient p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold gradient-text">Super User Dashboard</h1>
          <Button 
            onClick={handleLogout}
            variant="outline"
            data-testid="button-logout"
          >
            <span className="material-icons mr-2">logout</span>
            Logout
          </Button>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="hover-elevate active-elevate-2 cursor-pointer transition-all"
            onClick={() => setLocation('/superuser/companies')}
            data-testid="card-view-companies"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-icons text-primary text-2xl">business</span>
                </div>
                <div>
                  <CardTitle className="text-xl">View All Companies</CardTitle>
                  <CardDescription>View all registered companies on the platform</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access complete list of companies, their details, and license status
              </p>
            </CardContent>
          </Card>

          <Card 
            className="hover-elevate active-elevate-2 cursor-pointer transition-all"
            onClick={() => setGiftDialogOpen(true)}
            data-testid="card-gift-company"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="material-icons text-green-500 text-2xl">card_giftcard</span>
                </div>
                <div>
                  <CardTitle className="text-xl">Gift Company Account</CardTitle>
                  <CardDescription>Create a free company account as a gift</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Provision a company with full access without requiring payment
              </p>
            </CardContent>
          </Card>
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
                <Label htmlFor="tier">Subscription Tier</Label>
                <Select
                  value={formData.tier}
                  onValueChange={(value) => setFormData({ ...formData, tier: value })}
                >
                  <SelectTrigger data-testid="select-tier">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic" data-testid="option-tier-basic">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Basic</span>
                        <span className="text-muted-foreground text-xs">2 projects, 4 seats</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="starter" data-testid="option-tier-starter">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Starter</span>
                        <span className="text-muted-foreground text-xs">5 projects, 10 seats</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="premium" data-testid="option-tier-premium">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Premium</span>
                        <span className="text-muted-foreground text-xs">9 projects, 18 seats</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="enterprise" data-testid="option-tier-enterprise">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Enterprise</span>
                        <span className="text-muted-foreground text-xs">Unlimited</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
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
    </div>
  );
}

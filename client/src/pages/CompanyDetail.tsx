import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CompanyDetail() {
  const [, params] = useRoute("/superuser/companies/:id");
  const [, setLocation] = useLocation();
  const companyId = params?.id;

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: companyData, isLoading } = useQuery<{ company: any }>({
    queryKey: ["/api/superuser/companies", companyId],
    enabled: !!companyId,
  });

  // Redirect if not superuser
  if (userData?.user?.role !== 'superuser') {
    setLocation('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen page-gradient p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Loading company details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const company = companyData?.company;

  if (!company) {
    return (
      <div className="min-h-screen page-gradient p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <span className="material-icons text-6xl text-muted-foreground mb-4">business</span>
              <p className="text-muted-foreground">Company not found</p>
              <Link href="/superuser/companies">
                <Button variant="outline" className="mt-4" data-testid="button-back">
                  <span className="material-icons mr-2">arrow_back</span>
                  Back to Companies
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/superuser/companies">
              <Button variant="outline" data-testid="button-back">
                <span className="material-icons mr-2">arrow_back</span>
                Back
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold gradient-text">{company.companyName || "Unnamed Company"}</h1>
                {company.licenseVerified ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20" data-testid="badge-verified">
                    <span className="material-icons text-sm mr-1">verified</span>
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" data-testid="badge-unverified">
                    <span className="material-icons text-sm mr-1">warning</span>
                    Not Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-2">
                {company.email || 'No email on file'}
              </p>
            </div>
          </div>
        </div>

        {/* Company Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Company ID</p>
                <p className="font-mono text-xs">{company.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                <p className="text-sm">{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">License Status</p>
                <p className="text-sm">{company.licenseVerified ? "Active" : "Inactive"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="text-sm">{company.streetAddress || 'N/A'}{company.province ? `, ${company.province}` : ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" data-testid="tab-company-dashboard">
              <span className="material-icons text-sm mr-2">dashboard</span>
              View Company Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <span className="material-icons text-sm mr-2">analytics</span>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="overall" data-testid="tab-overall">
              <span className="material-icons text-sm mr-2">assessment</span>
              Overall
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardContent className="p-12 text-center">
                <span className="material-icons text-6xl text-muted-foreground mb-4">dashboard</span>
                <h3 className="text-xl font-semibold mb-2">Company Dashboard</h3>
                <p className="text-muted-foreground">
                  View the company's dashboard as they see it
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-12 text-center">
                <span className="material-icons text-6xl text-muted-foreground mb-4">analytics</span>
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-muted-foreground">
                  Company analytics and metrics will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overall">
            <Card>
              <CardContent className="p-12 text-center">
                <span className="material-icons text-6xl text-muted-foreground mb-4">assessment</span>
                <h3 className="text-xl font-semibold mb-2">Overall</h3>
                <p className="text-muted-foreground">
                  Overall company information and statistics will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

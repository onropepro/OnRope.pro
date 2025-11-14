import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AllCompanies() {
  const [, setLocation] = useLocation();

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: companiesData, isLoading } = useQuery<{ companies: any[] }>({
    queryKey: ["/api/superuser/companies"],
  });

  // Redirect if not superuser
  if (userData?.user?.role !== 'superuser') {
    setLocation('/');
    return null;
  }

  const companies = companiesData?.companies || [];

  return (
    <div className="min-h-screen page-gradient p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text">All Registered Companies</h1>
            <p className="text-muted-foreground mt-2">
              View and manage all companies registered on the platform
            </p>
          </div>
          <Link href="/superuser">
            <Button variant="outline" data-testid="button-back-to-dashboard">
              <span className="material-icons mr-2">arrow_back</span>
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Companies List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Loading companies...</p>
              </CardContent>
            </Card>
          ) : companies.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <span className="material-icons text-6xl text-muted-foreground mb-4">business_center</span>
                <p className="text-muted-foreground">No companies registered yet</p>
              </CardContent>
            </Card>
          ) : (
            companies.map((company: any) => (
              <Card key={company.id} className="hover-elevate" data-testid={`card-company-${company.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{company.companyName || "Unnamed Company"}</CardTitle>
                        {company.licenseVerified ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20" data-testid={`badge-verified-${company.id}`}>
                            <span className="material-icons text-sm mr-1">verified</span>
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="destructive" data-testid={`badge-unverified-${company.id}`}>
                            <span className="material-icons text-sm mr-1">warning</span>
                            Not Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="space-y-1">
                        {company.email && (
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-sm">email</span>
                            <span>{company.email}</span>
                          </div>
                        )}
                        {company.streetAddress && (
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-sm">location_on</span>
                            <span>{company.streetAddress}{company.province ? `, ${company.province}` : ''}</span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Company ID</p>
                      <p className="font-mono text-xs">{company.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Registration Date</p>
                      <p>{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">License Key</p>
                      <p className="font-mono text-xs">
                        {company.licenseKey === "BYPASSED" ? (
                          <Badge variant="outline">Bypassed</Badge>
                        ) : company.licenseKey ? (
                          "••••••••"
                        ) : (
                          "Not set"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p>{company.licenseVerified ? "Active" : "Inactive"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

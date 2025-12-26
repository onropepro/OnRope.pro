import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTimestampDate, formatTime } from "@/lib/dateUtils";
import SuperUserLayout from "@/components/SuperUserLayout";

export default function AllCompanies() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: companiesData, isLoading: isLoadingCompanies } = useQuery<{ companies: any[] }>({
    queryKey: ["/api/superuser/companies"],
  });

  // Wait for user data to load before checking permissions
  const isLoadingUser = userData === undefined;
  
  // Check if user is superuser or staff with view_companies permission
  const isSuperuser = userData?.user?.role === 'superuser';
  const isStaffWithPermission = userData?.user?.role === 'staff' && 
    userData?.user?.staffPermissions?.includes('view_companies');
  const hasAccess = isSuperuser || isStaffWithPermission;

  // Only redirect after user data has loaded and we know they don't have access
  if (!isLoadingUser && !hasAccess) {
    setLocation('/');
    return null;
  }

  const companies = companiesData?.companies || [];
  const isLoading = isLoadingUser || isLoadingCompanies;

  return (
    <SuperUserLayout title="All Companies">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">All Registered Companies</h1>
            <p className="text-muted-foreground mt-2">
              View and manage all companies registered on the platform
            </p>
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
              <Card 
                key={company.id} 
                className="hover-elevate active-elevate-2 cursor-pointer transition-all" 
                onClick={() => setLocation(`/superuser/companies/${company.id}`)}
                data-testid={`card-company-${company.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{company.companyName || "Unnamed Company"}</CardTitle>
                        {company.subscriptionStatus === 'active' || company.subscriptionStatus === 'trialing' ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20" data-testid={`badge-verified-${company.id}`}>
                            <span className="material-icons text-sm mr-1">verified</span>
                            {company.subscriptionStatus === 'trialing' ? 'Trial' : 'Verified'}
                          </Badge>
                        ) : (
                          <Badge variant="destructive" data-testid={`badge-unverified-${company.id}`}>
                            <span className="material-icons text-sm mr-1">warning</span>
                            {company.subscriptionStatus === 'canceled' ? 'Canceled' : 'Not Verified'}
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
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Company ID</p>
                      <p className="font-mono text-xs">{company.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Registration Date</p>
                      <p>{company.createdAt ? formatTimestampDate(company.createdAt) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Activity</p>
                      <p className={company.lastCompanyActivity ? '' : 'text-muted-foreground'}>
                        {company.lastCompanyActivity ? (
                          <>
                            {formatTimestampDate(company.lastCompanyActivity)}{' '}
                            <span className="text-muted-foreground">
                              {formatTime(company.lastCompanyActivity)}
                            </span>
                          </>
                        ) : (
                          'Never'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">License Key</p>
                      <p className="font-mono text-xs">
                        {company.licenseKey === "BYPASSED" ? (
                          <Badge variant="outline">Bypassed</Badge>
                        ) : company.licenseKey ? (
                          company.licenseKey
                        ) : (
                          "Not set"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="capitalize">{company.subscriptionStatus || "Inactive"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}

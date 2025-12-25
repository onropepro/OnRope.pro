import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface Technician {
  id: string;
  name: string;
  email: string;
  companyId: string | null;
  companyName: string | null;
  irataLevel: string | null;
  irataLicenseNumber: string | null;
  irataExpiry: string | null;
  irataVerified: boolean | null;
  spratLevel: string | null;
  spratLicenseNumber: string | null;
  spratExpiry: string | null;
  spratVerified: boolean | null;
  startDate: string | null;
  terminatedDate: string | null;
  terminationReason: string | null;
  createdAt: string;
  lastActivityAt: string | null;
  employeeCity: string | null;
  employeeProvinceState: string | null;
  employeeCountry: string | null;
  referralCode: string | null;
  referralCount: number;
  hasPlusAccess: boolean;
  isDisabled: boolean;
}

interface TechnicianDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
  irataLevel: string | null;
  irataLicenseNumber: string | null;
  irataExpiry: string | null;
  irataVerified: boolean | null;
  irataVerifiedAt: string | null;
  spratLevel: string | null;
  spratLicenseNumber: string | null;
  spratExpiry: string | null;
  spratVerified: boolean | null;
  spratVerifiedAt: string | null;
  startDate: string | null;
  terminatedDate: string | null;
  terminationReason: string | null;
  hourlyRate: string | null;
  isSalary: boolean | null;
  salary: string | null;
  permissions: string[] | null;
  birthday: string | null;
  employeePhoneNumber: string | null;
  employeeStreetAddress: string | null;
  employeeCity: string | null;
  employeeProvinceState: string | null;
  employeeCountry: string | null;
  employeePostalCode: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;
  driversLicenseNumber: string | null;
  driversLicenseExpiry: string | null;
  driversLicenseProvince: string | null;
  bankDocuments: string[] | null;
  driversLicenseDocuments: string[] | null;
  firstAidDocuments: string[] | null;
  irataDocuments: string[] | null;
  spratDocuments: string[] | null;
  specialMedicalConditions: string | null;
  createdAt: string;
  lastActivityAt: string | null;
  irataBaselineHours: string | null;
  hasPlusAccess: boolean;
  referralCount: number;
  isDisabled: boolean;
  disabledAt: string | null;
  disabledReason: string | null;
}

interface CompanyInfo {
  id: string;
  name: string;
  email: string;
  subscriptionTier: string | null;
  licenseVerified: boolean | null;
}

interface TechniciansResponse {
  technicians: Technician[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface TechnicianDetailResponse {
  technician: TechnicianDetail;
  company: CompanyInfo | null;
}

export default function SuperUserTechnicians() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [linkedFilter, setLinkedFilter] = useState<string>("all");
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const pageSize = 25;
  const { toast } = useToast();

  // Build the URL with query parameters
  const buildTechniciansUrl = () => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("pageSize", pageSize.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (linkedFilter === "linked") params.set("linkedOnly", "true");
    if (linkedFilter === "unlinked") params.set("linkedOnly", "false");
    return `/api/superuser/technicians?${params.toString()}`;
  };

  const techniciansUrl = buildTechniciansUrl();

  const { data: techniciansData, isLoading } = useQuery<TechniciansResponse>({
    queryKey: ["/api/superuser/technicians", currentPage, pageSize, searchQuery, linkedFilter],
    queryFn: async () => {
      const res = await fetch(techniciansUrl, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
  });

  const { data: technicianDetailData, isLoading: isLoadingDetail, error: detailError } = useQuery<TechnicianDetailResponse>({
    queryKey: ["/api/superuser/technicians", "detail", selectedTechnician],
    queryFn: async () => {
      const res = await fetch(`/api/superuser/technicians/${selectedTechnician}`, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
    enabled: !!selectedTechnician,
  });

  const togglePlusAccessMutation = useMutation({
    mutationFn: async ({ technicianId, hasPlusAccess }: { technicianId: string; hasPlusAccess: boolean }) => {
      const res = await fetch(`/api/superuser/technicians/${technicianId}/plus-access`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hasPlusAccess }),
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.hasPlusAccess ? "PLUS Access Granted" : "PLUS Access Revoked",
        description: `Successfully updated PLUS access for this technician.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/technicians"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleAccountStatusMutation = useMutation({
    mutationFn: async ({ userId, isDisabled, reason }: { userId: string; isDisabled: boolean; reason?: string }) => {
      const res = await fetch(`/api/superuser/accounts/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          isDisabled, 
          reason,
          confirmationCode: isDisabled ? 'CONFIRM-DISABLE' : 'CONFIRM-ENABLE'
        }),
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.isDisabled ? "Account Disabled" : "Account Re-enabled",
        description: variables.isDisabled 
          ? "This account has been suspended and cannot login." 
          : "This account has been re-activated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/technicians"] });
      setSuspendDialogOpen(false);
      setSuspendReason("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const technicians = techniciansData?.technicians || [];
  const total = techniciansData?.total || 0;
  const totalPages = techniciansData?.totalPages || 1;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const getStatusBadge = (tech: Technician) => {
    if (tech.terminatedDate) {
      return <Badge variant="destructive">Terminated</Badge>;
    }
    if (tech.companyId) {
      return <Badge variant="default" className="bg-green-600">Linked</Badge>;
    }
    return <Badge variant="secondary">Unlinked</Badge>;
  };

  const getCertificationBadges = (tech: Technician | TechnicianDetail) => {
    const badges = [];
    if (tech.irataLevel) {
      badges.push(
        <Badge 
          key="irata" 
          variant={tech.irataVerified ? "default" : "outline"}
          className={tech.irataVerified ? "bg-blue-600" : ""}
        >
          irata L{tech.irataLevel} {tech.irataVerified && "✓"}
        </Badge>
      );
    }
    if (tech.spratLevel) {
      badges.push(
        <Badge 
          key="sprat" 
          variant={tech.spratVerified ? "default" : "outline"}
          className={tech.spratVerified ? "bg-purple-600" : ""}
        >
          SPRAT L{tech.spratLevel} {tech.spratVerified && "✓"}
        </Badge>
      );
    }
    return badges;
  };

  return (
    <SuperUserLayout title="Technician Database">
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Technician Database</h2>
          <p className="text-muted-foreground">
            View all technicians registered on the platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-primary">engineering</span>
                  All Technicians
                </CardTitle>
                <CardDescription>
                  {total} technician{total !== 1 ? 's' : ''} registered
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={linkedFilter} onValueChange={(v) => { setLinkedFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[150px]" data-testid="select-linked-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="linked">Linked</SelectItem>
                    <SelectItem value="unlinked">Unlinked</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">search</span>
                  <Input
                    placeholder="Search by name, email, license..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9 w-full sm:w-[300px]"
                    data-testid="input-search-technicians"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <span className="material-icons animate-spin text-4xl text-muted-foreground">sync</span>
              </div>
            ) : technicians.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <span className="material-icons text-4xl mb-2 opacity-50">person_off</span>
                <p>No technicians found</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {technicians.map((tech) => (
                    <div
                      key={tech.id}
                      onClick={() => setSelectedTechnician(tech.id)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover-elevate active-elevate-2 cursor-pointer gap-3"
                      data-testid={`row-technician-${tech.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="material-icons text-muted-foreground">person</span>
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2 flex-wrap">
                            {tech.name}
                            {tech.hasPlusAccess && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs">PLUS</Badge>
                            )}
                            {getStatusBadge(tech)}
                          </div>
                          <div className="text-sm text-muted-foreground">{tech.email}</div>
                          {tech.employeeCity && (
                            <div className="text-xs text-muted-foreground">
                              {tech.employeeCity}{tech.employeeProvinceState ? `, ${tech.employeeProvinceState}` : ''}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex flex-wrap gap-1">
                          {getCertificationBadges(tech)}
                        </div>
                        {tech.companyName && (
                          <Badge variant="outline" className="gap-1">
                            <span className="material-icons text-xs">business</span>
                            {tech.companyName}
                          </Badge>
                        )}
                        {tech.referralCount > 0 && (
                          <Badge variant="secondary" className="gap-1" title={`Referred ${tech.referralCount} technician(s)`}>
                            <span className="material-icons text-xs">people</span>
                            {tech.referralCount}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground" title={tech.lastActivityAt ? `Last active: ${new Date(tech.lastActivityAt).toLocaleString()}` : 'Never active'}>
                          <span className="material-icons text-xs">schedule</span>
                          {formatRelativeTime(tech.lastActivityAt)}
                        </div>
                        <span className="material-icons text-muted-foreground text-sm">chevron_right</span>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        data-testid="button-prev-page"
                      >
                        <span className="material-icons text-sm">chevron_left</span>
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        data-testid="button-next-page"
                      >
                        Next
                        <span className="material-icons text-sm">chevron_right</span>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedTechnician} onOpenChange={() => setSelectedTechnician(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="material-icons text-primary">person</span>
                Technician Details
              </DialogTitle>
              <DialogDescription>
                Complete information about this technician
              </DialogDescription>
            </DialogHeader>
            
            {isLoadingDetail ? (
              <div className="flex items-center justify-center py-12">
                <span className="material-icons animate-spin text-4xl text-muted-foreground">sync</span>
              </div>
            ) : detailError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="material-icons text-4xl text-destructive mb-4">error</span>
                <p className="text-destructive font-medium">Failed to load technician details</p>
                <p className="text-sm text-muted-foreground mt-2">{(detailError as Error).message}</p>
              </div>
            ) : technicianDetailData?.technician ? (
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-6 pr-4">
                  {/* Basic Info */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-sm">badge</span>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                      <InfoItem label="Name" value={technicianDetailData.technician.name} />
                      <InfoItem label="Email" value={technicianDetailData.technician.email} />
                      <InfoItem label="Phone" value={technicianDetailData.technician.employeePhoneNumber} />
                      <InfoItem label="Birthday" value={formatDate(technicianDetailData.technician.birthday)} />
                      <InfoItem label="Registered" value={formatDate(technicianDetailData.technician.createdAt)} />
                      <InfoItem 
                        label="Last Activity" 
                        value={technicianDetailData.technician.lastActivityAt 
                          ? `${formatRelativeTime(technicianDetailData.technician.lastActivityAt)} (${formatDate(technicianDetailData.technician.lastActivityAt)})`
                          : "Never"
                        } 
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Employment Status */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-sm">work</span>
                      Employment Status
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                      {technicianDetailData.company ? (
                        <>
                          <div className="sm:col-span-2">
                            <Badge className="bg-green-600 mb-2">Currently Employed</Badge>
                          </div>
                          <InfoItem label="Company" value={technicianDetailData.company.name} />
                          <InfoItem label="Company Email" value={technicianDetailData.company.email} />
                          <InfoItem label="Subscription Tier" value={technicianDetailData.company.subscriptionTier || "None"} />
                          <InfoItem label="Start Date" value={formatDate(technicianDetailData.technician.startDate)} />
                          {technicianDetailData.technician.isSalary ? (
                            <InfoItem label="Salary" value={technicianDetailData.technician.salary ? `$${Number(technicianDetailData.technician.salary).toLocaleString()}/year` : "Not set"} />
                          ) : (
                            <InfoItem label="Hourly Rate" value={technicianDetailData.technician.hourlyRate ? `$${Number(technicianDetailData.technician.hourlyRate).toFixed(2)}/hr` : "Not set"} />
                          )}
                        </>
                      ) : (
                        <div className="sm:col-span-2">
                          <Badge variant="secondary">Not Currently Employed</Badge>
                          {technicianDetailData.technician.terminatedDate && (
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Terminated: {formatDate(technicianDetailData.technician.terminatedDate)}
                              </p>
                              {technicianDetailData.technician.terminationReason && (
                                <p className="text-sm text-muted-foreground">
                                  Reason: {technicianDetailData.technician.terminationReason}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Certifications */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-sm">verified</span>
                      Certifications
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                      {technicianDetailData.technician.irataLevel && (
                        <>
                          <InfoItem label="irata Level" value={`Level ${technicianDetailData.technician.irataLevel}`} />
                          <InfoItem label="irata License" value={technicianDetailData.technician.irataLicenseNumber} />
                          <InfoItem label="irata Expiry" value={formatDate(technicianDetailData.technician.irataExpiry)} />
                          <InfoItem 
                            label="irata Verified" 
                            value={
                              technicianDetailData.technician.irataVerified 
                                ? `Yes (${formatDate(technicianDetailData.technician.irataVerifiedAt)})` 
                                : "No"
                            } 
                          />
                          {technicianDetailData.technician.irataBaselineHours && (
                            <InfoItem label="irata Baseline Hours" value={technicianDetailData.technician.irataBaselineHours} />
                          )}
                        </>
                      )}
                      {technicianDetailData.technician.spratLevel && (
                        <>
                          <InfoItem label="SPRAT Level" value={`Level ${technicianDetailData.technician.spratLevel}`} />
                          <InfoItem label="SPRAT License" value={technicianDetailData.technician.spratLicenseNumber} />
                          <InfoItem label="SPRAT Expiry" value={formatDate(technicianDetailData.technician.spratExpiry)} />
                          <InfoItem 
                            label="SPRAT Verified" 
                            value={
                              technicianDetailData.technician.spratVerified 
                                ? `Yes (${formatDate(technicianDetailData.technician.spratVerifiedAt)})` 
                                : "No"
                            } 
                          />
                        </>
                      )}
                      {!technicianDetailData.technician.irataLevel && !technicianDetailData.technician.spratLevel && (
                        <p className="text-muted-foreground sm:col-span-2">No certifications on record</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Address */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-sm">location_on</span>
                      Address
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                      <InfoItem label="Street Address" value={technicianDetailData.technician.employeeStreetAddress} />
                      <InfoItem label="City" value={technicianDetailData.technician.employeeCity} />
                      <InfoItem label="Province/State" value={technicianDetailData.technician.employeeProvinceState} />
                      <InfoItem label="Country" value={technicianDetailData.technician.employeeCountry} />
                      <InfoItem label="Postal Code" value={technicianDetailData.technician.employeePostalCode} />
                    </div>
                  </div>

                  <Separator />

                  {/* Emergency Contact */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-sm">emergency</span>
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                      <InfoItem label="Name" value={technicianDetailData.technician.emergencyContactName} />
                      <InfoItem label="Phone" value={technicianDetailData.technician.emergencyContactPhone} />
                      <InfoItem label="Relationship" value={technicianDetailData.technician.emergencyContactRelationship} />
                    </div>
                  </div>

                  <Separator />

                  {/* Driver's License */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-sm">directions_car</span>
                      Driver's License
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                      <InfoItem label="License Number" value={technicianDetailData.technician.driversLicenseNumber} />
                      <InfoItem label="Province" value={technicianDetailData.technician.driversLicenseProvince} />
                      <InfoItem label="Expiry" value={formatDate(technicianDetailData.technician.driversLicenseExpiry)} />
                    </div>
                  </div>

                  {/* Medical Conditions */}
                  {technicianDetailData.technician.specialMedicalConditions && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-600">
                          <span className="material-icons text-sm">medical_information</span>
                          Medical Conditions
                        </h3>
                        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                          <p className="text-sm">{technicianDetailData.technician.specialMedicalConditions}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Documents */}
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-sm">folder</span>
                      Documents
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <DocumentCount label="Bank Docs" count={technicianDetailData.technician.bankDocuments?.length || 0} />
                      <DocumentCount label="License Docs" count={technicianDetailData.technician.driversLicenseDocuments?.length || 0} />
                      <DocumentCount label="First Aid" count={technicianDetailData.technician.firstAidDocuments?.length || 0} />
                      <DocumentCount label="irata Docs" count={technicianDetailData.technician.irataDocuments?.length || 0} />
                      <DocumentCount label="SPRAT Docs" count={technicianDetailData.technician.spratDocuments?.length || 0} />
                    </div>
                  </div>

                  {/* PLUS Access Management */}
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-icons text-sm text-amber-500">workspace_premium</span>
                      PLUS Access
                    </h3>
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Technician PLUS</p>
                            {technicianDetailData.technician.hasPlusAccess && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">PLUS</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {technicianDetailData.technician.hasPlusAccess 
                              ? "This technician has PLUS access with premium features." 
                              : "Grant PLUS access to unlock premium features."}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Referrals: {technicianDetailData.technician.referralCount || 0} technician(s) referred
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="plus-access"
                            checked={technicianDetailData.technician.hasPlusAccess}
                            onCheckedChange={(checked) => {
                              if (selectedTechnician) {
                                togglePlusAccessMutation.mutate({
                                  technicianId: selectedTechnician,
                                  hasPlusAccess: checked,
                                });
                              }
                            }}
                            disabled={togglePlusAccessMutation.isPending}
                            data-testid="switch-plus-access"
                          />
                          <Label htmlFor="plus-access" className="sr-only">
                            Toggle PLUS Access
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Status Management */}
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className={`material-icons text-sm ${technicianDetailData.technician.isDisabled ? 'text-red-500' : 'text-green-500'}`}>
                        {technicianDetailData.technician.isDisabled ? 'block' : 'check_circle'}
                      </span>
                      Account Status
                    </h3>
                    <div className={`p-4 rounded-lg border ${technicianDetailData.technician.isDisabled ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {technicianDetailData.technician.isDisabled ? 'Account Suspended' : 'Account Active'}
                            </p>
                            <Badge variant={technicianDetailData.technician.isDisabled ? "destructive" : "default"} className={!technicianDetailData.technician.isDisabled ? "bg-green-600" : ""}>
                              {technicianDetailData.technician.isDisabled ? 'Disabled' : 'Active'}
                            </Badge>
                          </div>
                          {technicianDetailData.technician.isDisabled ? (
                            <>
                              <p className="text-sm text-muted-foreground">
                                This account is suspended and cannot login.
                              </p>
                              {technicianDetailData.technician.disabledReason && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  Reason: {technicianDetailData.technician.disabledReason}
                                </p>
                              )}
                              {technicianDetailData.technician.disabledAt && (
                                <p className="text-xs text-muted-foreground">
                                  Suspended on: {formatDate(technicianDetailData.technician.disabledAt)}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              This account is active and can login normally.
                            </p>
                          )}
                        </div>
                        <div>
                          {technicianDetailData.technician.isDisabled ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                  <span className="material-icons text-sm">check_circle</span>
                                  Re-enable Account
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Re-enable Account?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will restore access for {technicianDetailData.technician.name}. They will be able to login again.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      if (selectedTechnician) {
                                        toggleAccountStatusMutation.mutate({
                                          userId: selectedTechnician,
                                          isDisabled: false,
                                        });
                                      }
                                    }}
                                    disabled={toggleAccountStatusMutation.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {toggleAccountStatusMutation.isPending ? 'Enabling...' : 'Re-enable Account'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="gap-2">
                                  <span className="material-icons text-sm">block</span>
                                  Suspend Account
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-red-600">Suspend Account?</AlertDialogTitle>
                                  <AlertDialogDescription className="space-y-4">
                                    <p>
                                      You are about to suspend the account for <strong>{technicianDetailData.technician.name}</strong>.
                                    </p>
                                    <p>
                                      They will not be able to login until you re-enable their account. No data will be deleted.
                                    </p>
                                    <div className="space-y-2">
                                      <Label htmlFor="suspend-reason" className="text-foreground font-medium">Reason for suspension (required):</Label>
                                      <Textarea
                                        id="suspend-reason"
                                        placeholder="Enter the reason for suspending this account (min 10 characters)..."
                                        value={suspendReason}
                                        onChange={(e) => setSuspendReason(e.target.value)}
                                        className="min-h-[80px]"
                                        data-testid="textarea-suspend-reason"
                                      />
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSuspendReason("")}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      if (selectedTechnician && suspendReason.trim().length >= 10) {
                                        toggleAccountStatusMutation.mutate({
                                          userId: selectedTechnician,
                                          isDisabled: true,
                                          reason: suspendReason,
                                        });
                                      }
                                    }}
                                    disabled={toggleAccountStatusMutation.isPending || suspendReason.trim().length < 10}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {toggleAccountStatusMutation.isPending ? 'Suspending...' : 'Confirm Suspension'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </SuperUserLayout>
  );
}

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "Not provided"}</p>
    </div>
  );
}

function DocumentCount({ label, count }: { label: string; count: number }) {
  return (
    <div className="text-center p-3 bg-muted/30 rounded-lg">
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

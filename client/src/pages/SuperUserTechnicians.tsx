import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  employeeCity: string | null;
  employeeProvinceState: string | null;
  employeeCountry: string | null;
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
  irataBaselineHours: string | null;
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
  const pageSize = 25;

  const { data: techniciansData, isLoading } = useQuery<TechniciansResponse>({
    queryKey: ["/api/superuser/technicians", { 
      page: currentPage, 
      pageSize, 
      search: searchQuery || undefined,
      linkedOnly: linkedFilter === "linked" ? "true" : linkedFilter === "unlinked" ? "false" : undefined
    }],
  });

  const { data: technicianDetailData, isLoading: isLoadingDetail } = useQuery<TechnicianDetailResponse>({
    queryKey: ["/api/superuser/technicians", selectedTechnician],
    enabled: !!selectedTechnician,
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
          IRATA L{tech.irataLevel} {tech.irataVerified && "✓"}
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">Technician Database</h2>
          <p className="text-gray-500 dark:text-gray-400">
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
                          <div className="font-medium flex items-center gap-2">
                            {tech.name}
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
                          <InfoItem label="IRATA Level" value={`Level ${technicianDetailData.technician.irataLevel}`} />
                          <InfoItem label="IRATA License" value={technicianDetailData.technician.irataLicenseNumber} />
                          <InfoItem label="IRATA Expiry" value={formatDate(technicianDetailData.technician.irataExpiry)} />
                          <InfoItem 
                            label="IRATA Verified" 
                            value={
                              technicianDetailData.technician.irataVerified 
                                ? `Yes (${formatDate(technicianDetailData.technician.irataVerifiedAt)})` 
                                : "No"
                            } 
                          />
                          {technicianDetailData.technician.irataBaselineHours && (
                            <InfoItem label="IRATA Baseline Hours" value={technicianDetailData.technician.irataBaselineHours} />
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
                      <DocumentCount label="IRATA Docs" count={technicianDetailData.technician.irataDocuments?.length || 0} />
                      <DocumentCount label="SPRAT Docs" count={technicianDetailData.technician.spratDocuments?.length || 0} />
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

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate } from "@/lib/dateUtils";
import { Loader2, Building2, ArrowLeft, Search, History, CheckCircle, RefreshCw, Key } from "lucide-react";

interface BuildingData {
  id: string;
  strataPlanNumber: string;
  buildingName: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  totalUnits: number | null;
  totalProjects: number;
  projectsCompleted: number;
  createdAt: string;
}

interface ProjectData {
  id: string;
  jobType: string;
  customJobType: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  companyId: string;
  createdAt: string;
}

interface CompanyData {
  id: string;
  name: string;
}

interface BuildingDetailsData {
  building: BuildingData;
  projects: ProjectData[];
  companies: CompanyData[];
}

export default function SuperUserBuildings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const { data: buildingsData, isLoading } = useQuery<{ buildings: BuildingData[] }>({
    queryKey: ["/api/superuser/buildings"],
  });

  const { data: buildingDetailsData, isLoading: isLoadingDetails } = useQuery<BuildingDetailsData>({
    queryKey: ["/api/superuser/buildings", selectedBuilding?.id],
    enabled: !!selectedBuilding?.id,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ buildingId, password }: { buildingId: string; password?: string }) => {
      return apiRequest("POST", `/api/superuser/buildings/${buildingId}/reset-password`, { password });
    },
    onSuccess: () => {
      toast({
        title: "Password Reset",
        description: newPassword 
          ? "Building password has been updated." 
          : "Password has been reset to the strata plan number.",
      });
      setResetPasswordOpen(false);
      setNewPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset password.",
        variant: "destructive",
      });
    },
  });

  const handleResetPassword = () => {
    if (!selectedBuilding) return;
    resetPasswordMutation.mutate({ 
      buildingId: selectedBuilding.id, 
      password: newPassword || undefined 
    });
  };

  const buildings = buildingsData?.buildings || [];
  const filteredBuildings = buildings.filter(building => {
    const search = searchTerm.toLowerCase();
    return (
      building.strataPlanNumber.toLowerCase().includes(search) ||
      building.buildingName?.toLowerCase().includes(search) ||
      building.address?.toLowerCase().includes(search) ||
      building.city?.toLowerCase().includes(search)
    );
  });

  const getJobTypeName = (jobType: string, customJobType: string | null) => {
    if (customJobType) return customJobType;
    const jobTypeNames: Record<string, string> = {
      window_cleaning: "Window Cleaning",
      facade_inspection: "Facade Inspection",
      painting: "Painting",
      caulking: "Caulking",
      pressure_washing: "Pressure Washing",
      building_maintenance: "Building Maintenance",
      gutter_cleaning: "Gutter Cleaning",
      light_replacement: "Light Replacement",
      signage_installation: "Signage Installation",
      other: "Other",
    };
    return jobTypeNames[jobType] || jobType;
  };

  if (selectedBuilding) {
    return (
      <div className="min-h-screen page-gradient p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSelectedBuilding(null)}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {selectedBuilding.buildingName || `Building ${selectedBuilding.strataPlanNumber}`}
              </h1>
              <p className="text-muted-foreground">Strata: {selectedBuilding.strataPlanNumber}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setResetPasswordOpen(true)}
              data-testid="button-reset-password"
            >
              <Key className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
          </div>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Building Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Strata Plan Number</p>
                    <p className="font-medium">{selectedBuilding.strataPlanNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Building Name</p>
                    <p className="font-medium">{selectedBuilding.buildingName || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {selectedBuilding.address ? (
                        `${selectedBuilding.address}, ${selectedBuilding.city || ""} ${selectedBuilding.province || ""} ${selectedBuilding.postalCode || ""}`.trim()
                      ) : (
                        "Not specified"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Units</p>
                    <p className="font-medium">{selectedBuilding.totalUnits || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="font-medium">{selectedBuilding.totalProjects}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Projects</p>
                    <p className="font-medium">{selectedBuilding.projectsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{formatLocalDate(selectedBuilding.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {buildingDetailsData?.companies && buildingDetailsData.companies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Companies That Have Worked Here</CardTitle>
                    <CardDescription>
                      {buildingDetailsData.companies.length} company(s) have performed maintenance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {buildingDetailsData.companies.map(company => (
                        <Badge key={company.id} variant="secondary" className="text-sm">
                          {company.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Project History
                  </CardTitle>
                  <CardDescription>
                    {buildingDetailsData?.projects?.length || 0} projects on record
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!buildingDetailsData?.projects?.length ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No projects recorded for this building yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {buildingDetailsData.projects.map((project, index) => (
                        <div key={project.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">
                                  {getJobTypeName(project.jobType, project.customJobType)}
                                </span>
                                <Badge variant={project.status === "completed" ? "secondary" : "outline"}>
                                  {project.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {project.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Company ID: {project.companyId}
                              </p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {project.startDate ? formatLocalDate(project.startDate) : formatLocalDate(project.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Building Password</DialogTitle>
                <DialogDescription>
                  Reset the password for building portal access. Leave blank to reset to the strata plan number.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Building: {selectedBuilding?.buildingName || selectedBuilding?.strataPlanNumber}
                  </p>
                  <Input
                    placeholder="New password (optional)"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    data-testid="input-new-password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    If left blank, password will be reset to: {selectedBuilding?.strataPlanNumber}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setResetPasswordOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleResetPassword}
                  disabled={resetPasswordMutation.isPending}
                  data-testid="button-confirm-reset"
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset Password
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setLocation('/superuser')}
              data-testid="button-back-to-dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Global Buildings Database</h1>
              <p className="text-muted-foreground">
                {buildings.length} building(s) in database
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by strata number, building name, address, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
            data-testid="input-search"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredBuildings.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm ? "No Buildings Found" : "No Buildings Yet"}
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {searchTerm 
                    ? "No buildings match your search criteria." 
                    : "Buildings are automatically added when projects are created with strata plan numbers."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBuildings.map(building => (
              <Card 
                key={building.id}
                className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setSelectedBuilding(building)}
                data-testid={`card-building-${building.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {building.buildingName || `Building ${building.strataPlanNumber}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {building.address ? (
                            `${building.address}, ${building.city || ""}`
                          ) : (
                            `Strata: ${building.strataPlanNumber}`
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium">{building.totalProjects}</p>
                        <p className="text-muted-foreground">Projects</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{building.projectsCompleted}</p>
                        <p className="text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

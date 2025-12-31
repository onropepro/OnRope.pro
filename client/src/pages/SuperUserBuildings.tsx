import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate } from "@/lib/dateUtils";
import { Loader2, Building2, ArrowLeft, Search, History, CheckCircle, RefreshCw, Key, Layers, MapPin, Compass, Map, List, Globe, DoorOpen, KeyRound, Phone, User, Wrench, Car, FileText } from "lucide-react";
import SuperUserLayout from "@/components/SuperUserLayout";
import { BackButton } from "@/components/BackButton";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface BuildingData {
  id: string;
  strataPlanNumber: string;
  buildingName: string | null;
  buildingAddress: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  floorCount: number | null;
  parkingStalls: number | null;
  totalUnits: number | null;
  dropsNorth: number | null;
  dropsEast: number | null;
  dropsSouth: number | null;
  dropsWest: number | null;
  yearBuilt: number | null;
  buildingType: string | null;
  notes: string | null;
  lastServiceDate: string | null;
  totalProjectsCompleted: number;
  createdAt: string;
  updatedAt: string;
}

const createBuildingIcon = (isSelected: boolean = false) => {
  return L.divIcon({
    className: 'custom-building-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--card))'};
        border: 2px solid ${isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: all 0.2s ease;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? 'white' : 'hsl(var(--foreground))'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
          <path d="M9 22v-4h6v4"/>
          <path d="M8 6h.01"/>
          <path d="M16 6h.01"/>
          <path d="M12 6h.01"/>
          <path d="M12 10h.01"/>
          <path d="M12 14h.01"/>
          <path d="M16 10h.01"/>
          <path d="M16 14h.01"/>
          <path d="M8 10h.01"/>
          <path d="M8 14h.01"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

function MapEventHandler({ 
  onBoundsChange,
  buildings,
  onBuildingClick,
  selectedBuildingId,
  hoveredBuildingId 
}: { 
  onBoundsChange: (bounds: MapBounds) => void;
  buildings: BuildingData[];
  onBuildingClick: (building: BuildingData) => void;
  selectedBuildingId: string | null;
  hoveredBuildingId: string | null;
}) {
  const map = useMap();
  const boundsRef = useRef<MapBounds | null>(null);

  const updateBounds = useCallback(() => {
    const bounds = map.getBounds();
    const newBounds = {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    };
    
    if (!boundsRef.current ||
        boundsRef.current.north !== newBounds.north ||
        boundsRef.current.south !== newBounds.south ||
        boundsRef.current.east !== newBounds.east ||
        boundsRef.current.west !== newBounds.west) {
      boundsRef.current = newBounds;
      onBoundsChange(newBounds);
    }
  }, [map, onBoundsChange]);

  useMapEvents({
    moveend: updateBounds,
  });

  useEffect(() => {
    updateBounds();
  }, []);

  return (
    <>
      {buildings.filter(b => b.latitude && b.longitude).map(building => (
        <Marker
          key={building.id}
          position={[parseFloat(building.latitude!), parseFloat(building.longitude!)]}
          icon={createBuildingIcon(building.id === selectedBuildingId || building.id === hoveredBuildingId)}
          eventHandlers={{
            click: () => onBuildingClick(building),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">{building.buildingName || `Building ${building.strataPlanNumber}`}</p>
              {building.buildingAddress && (
                <p className="text-muted-foreground">{building.buildingAddress}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function FlyToBuilding({ building }: { building: BuildingData | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (building?.latitude && building?.longitude) {
      map.flyTo([parseFloat(building.latitude), parseFloat(building.longitude)], 16, {
        duration: 0.5,
      });
    }
  }, [building, map]);

  return null;
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

interface BuildingInstructionsData {
  id: string;
  buildingId: string;
  buildingAccess: string | null;
  keysAndFob: string | null;
  roofAccess: string | null;
  buildingManagerName: string | null;
  buildingManagerPhone: string | null;
  conciergeNames: string | null;
  conciergePhone: string | null;
  conciergeHours: string | null;
  maintenanceName: string | null;
  maintenancePhone: string | null;
  tradeParkingSpots: number | null;
  tradeParkingInstructions: string | null;
  keysReturnPolicy: string | null;
  signageRequirements: string | null;
  specialRequests: string | null;
  updatedAt: string;
}

interface BuildingDetailsData {
  building: BuildingData;
  projects: ProjectData[];
  companies: CompanyData[];
  instructions: BuildingInstructionsData | null;
}

export default function SuperUserBuildings() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showMapView, setShowMapView] = useState(true);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [flyToBuilding, setFlyToBuilding] = useState<BuildingData | null>(null);

  const DEFAULT_CENTER: [number, number] = [49.2827, -123.1207];
  const DEFAULT_ZOOM = 11;

  const { data: buildingsData, isLoading } = useQuery<{ buildings: BuildingData[] }>({
    queryKey: ["/api/superuser/buildings"],
  });

  const { data: buildingDetailsData, isLoading: isLoadingDetails } = useQuery<BuildingDetailsData>({
    queryKey: ["/api/superuser/buildings", selectedBuilding?.id],
    enabled: !!selectedBuilding?.id,
  });

  const geocodeMutation = useMutation({
    mutationFn: async (buildingId: string) => {
      return apiRequest("POST", `/api/superuser/buildings/${buildingId}/geocode`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/buildings"] });
      toast({
        title: "Building Geocoded",
        description: "Building location has been updated on the map.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Geocoding Failed",
        description: error.message || "Could not find location for this address.",
        variant: "destructive",
      });
    },
  });

  const geocodeAllMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/superuser/buildings/geocode-all`, {});
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/buildings"] });
      toast({
        title: "Batch Geocoding Complete",
        description: data.message || "Buildings have been geocoded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Batch Geocoding Failed",
        description: error.message || "Failed to geocode buildings.",
        variant: "destructive",
      });
    },
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

  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setMapBounds(bounds);
  }, []);

  const buildings = buildingsData?.buildings || [];
  
  const filteredBuildings = buildings.filter(building => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      building.strataPlanNumber.toLowerCase().includes(search) ||
      building.buildingName?.toLowerCase().includes(search) ||
      building.buildingAddress?.toLowerCase().includes(search) ||
      building.city?.toLowerCase().includes(search)
    );
    
    if (!matchesSearch) return false;
    
    if (showMapView && mapBounds && building.latitude && building.longitude) {
      const lat = parseFloat(building.latitude);
      const lng = parseFloat(building.longitude);
      return (
        lat >= mapBounds.south &&
        lat <= mapBounds.north &&
        lng >= mapBounds.west &&
        lng <= mapBounds.east
      );
    }
    
    return true;
  });

  const buildingsWithCoords = buildings.filter(b => b.latitude && b.longitude).length;
  const buildingsWithoutCoords = buildings.length - buildingsWithCoords;

  const getTotalDrops = (building: BuildingData) => {
    return (building.dropsNorth || 0) + (building.dropsEast || 0) + 
           (building.dropsSouth || 0) + (building.dropsWest || 0);
  };

  const formatBuildingType = (type: string | null) => {
    if (!type) return null;
    const types: Record<string, string> = {
      residential: "Residential",
      commercial: "Commercial",
      mixed: "Mixed Use",
    };
    return types[type] || type;
  };

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
      <SuperUserLayout title={selectedBuilding.buildingName || `Building ${selectedBuilding.strataPlanNumber}`}>
        <div className="p-4 md:p-6">
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
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Building Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Strata Plan Number</p>
                      <p className="font-medium">{selectedBuilding.strataPlanNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Building Name</p>
                      <p className="font-medium">{selectedBuilding.buildingName || "Not specified"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {selectedBuilding.buildingAddress ? (
                          <>
                            {selectedBuilding.buildingAddress}
                            {(selectedBuilding.city || selectedBuilding.province || selectedBuilding.postalCode) && (
                              <>, {[selectedBuilding.city, selectedBuilding.province, selectedBuilding.postalCode].filter(Boolean).join(" ")}</>
                            )}
                          </>
                        ) : (
                          "Not specified"
                        )}
                      </p>
                    </div>
                    {formatBuildingType(selectedBuilding.buildingType) && (
                      <div>
                        <p className="text-sm text-muted-foreground">Building Type</p>
                        <p className="font-medium">{formatBuildingType(selectedBuilding.buildingType)}</p>
                      </div>
                    )}
                    {selectedBuilding.yearBuilt && (
                      <div>
                        <p className="text-sm text-muted-foreground">Year Built</p>
                        <p className="font-medium">{selectedBuilding.yearBuilt}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Building Specifications
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Floors</p>
                        <p className="font-medium text-lg">{selectedBuilding.floorCount || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Units</p>
                        <p className="font-medium text-lg">{selectedBuilding.totalUnits || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Parking Stalls</p>
                        <p className="font-medium text-lg">{selectedBuilding.parkingStalls || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Drops</p>
                        <p className="font-medium text-lg">{getTotalDrops(selectedBuilding) || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {getTotalDrops(selectedBuilding) > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Compass className="h-4 w-4" />
                          Drops by Elevation
                        </h4>
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div className="p-3 rounded-md bg-muted/50">
                            <p className="text-xs text-muted-foreground uppercase">North</p>
                            <p className="font-bold text-xl">{selectedBuilding.dropsNorth || 0}</p>
                          </div>
                          <div className="p-3 rounded-md bg-muted/50">
                            <p className="text-xs text-muted-foreground uppercase">East</p>
                            <p className="font-bold text-xl">{selectedBuilding.dropsEast || 0}</p>
                          </div>
                          <div className="p-3 rounded-md bg-muted/50">
                            <p className="text-xs text-muted-foreground uppercase">South</p>
                            <p className="font-bold text-xl">{selectedBuilding.dropsSouth || 0}</p>
                          </div>
                          <div className="p-3 rounded-md bg-muted/50">
                            <p className="text-xs text-muted-foreground uppercase">West</p>
                            <p className="font-bold text-xl">{selectedBuilding.dropsWest || 0}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Service Statistics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Projects Completed</p>
                        <p className="font-medium text-lg">{selectedBuilding.totalProjectsCompleted || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Service</p>
                        <p className="font-medium">{selectedBuilding.lastServiceDate ? formatLocalDate(selectedBuilding.lastServiceDate) : "Never"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Database Created</p>
                        <p className="font-medium">{formatLocalDate(selectedBuilding.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{formatLocalDate(selectedBuilding.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {selectedBuilding.notes && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedBuilding.notes}</p>
                      </div>
                    </>
                  )}
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

              {/* Building Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Building Instructions
                  </CardTitle>
                  <CardDescription>
                    Access information and special requirements for contractors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!buildingDetailsData?.instructions ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No building instructions have been added yet.</p>
                      <p className="text-sm mt-2">Building managers can add instructions via the Building Portal.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Access Information */}
                      {(buildingDetailsData.instructions.buildingAccess || 
                        buildingDetailsData.instructions.keysAndFob || 
                        buildingDetailsData.instructions.roofAccess ||
                        buildingDetailsData.instructions.keysReturnPolicy) && (
                        <div className="space-y-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <DoorOpen className="h-4 w-4" />
                            Access Information
                          </h4>
                          <div className="grid gap-3 pl-6">
                            {buildingDetailsData.instructions.buildingAccess && (
                              <div>
                                <p className="text-sm text-muted-foreground">Building Access</p>
                                <p className="text-sm">{buildingDetailsData.instructions.buildingAccess}</p>
                              </div>
                            )}
                            {buildingDetailsData.instructions.keysAndFob && (
                              <div>
                                <p className="text-sm text-muted-foreground">Keys & Fob Information</p>
                                <p className="text-sm">{buildingDetailsData.instructions.keysAndFob}</p>
                              </div>
                            )}
                            {buildingDetailsData.instructions.roofAccess && (
                              <div>
                                <p className="text-sm text-muted-foreground">Roof Access</p>
                                <p className="text-sm">{buildingDetailsData.instructions.roofAccess}</p>
                              </div>
                            )}
                            {buildingDetailsData.instructions.keysReturnPolicy && (
                              <div>
                                <p className="text-sm text-muted-foreground">Keys Return Policy</p>
                                <Badge variant="outline">{buildingDetailsData.instructions.keysReturnPolicy}</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Contact Information */}
                      {(buildingDetailsData.instructions.buildingManagerName || 
                        buildingDetailsData.instructions.buildingManagerPhone ||
                        buildingDetailsData.instructions.conciergeNames || 
                        buildingDetailsData.instructions.conciergePhone ||
                        buildingDetailsData.instructions.maintenanceName || 
                        buildingDetailsData.instructions.maintenancePhone) && (
                        <>
                          <Separator />
                          <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Contact Information
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 pl-6">
                              {(buildingDetailsData.instructions.buildingManagerName || buildingDetailsData.instructions.buildingManagerPhone) && (
                                <div className="flex items-start gap-2">
                                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Building Manager</p>
                                    {buildingDetailsData.instructions.buildingManagerName && (
                                      <p className="text-sm font-medium">{buildingDetailsData.instructions.buildingManagerName}</p>
                                    )}
                                    {buildingDetailsData.instructions.buildingManagerPhone && (
                                      <p className="text-sm">{buildingDetailsData.instructions.buildingManagerPhone}</p>
                                    )}
                                  </div>
                                </div>
                              )}
                              {(buildingDetailsData.instructions.conciergeNames || buildingDetailsData.instructions.conciergePhone) && (
                                <div className="flex items-start gap-2">
                                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Concierge</p>
                                    {buildingDetailsData.instructions.conciergeNames && (
                                      <p className="text-sm font-medium">{buildingDetailsData.instructions.conciergeNames}</p>
                                    )}
                                    {buildingDetailsData.instructions.conciergePhone && (
                                      <p className="text-sm">{buildingDetailsData.instructions.conciergePhone}</p>
                                    )}
                                    {buildingDetailsData.instructions.conciergeHours && (
                                      <p className="text-xs text-muted-foreground">Hours: {buildingDetailsData.instructions.conciergeHours}</p>
                                    )}
                                  </div>
                                </div>
                              )}
                              {(buildingDetailsData.instructions.maintenanceName || buildingDetailsData.instructions.maintenancePhone) && (
                                <div className="flex items-start gap-2">
                                  <Wrench className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Maintenance</p>
                                    {buildingDetailsData.instructions.maintenanceName && (
                                      <p className="text-sm font-medium">{buildingDetailsData.instructions.maintenanceName}</p>
                                    )}
                                    {buildingDetailsData.instructions.maintenancePhone && (
                                      <p className="text-sm">{buildingDetailsData.instructions.maintenancePhone}</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Parking */}
                      {(buildingDetailsData.instructions.tradeParkingSpots || buildingDetailsData.instructions.tradeParkingInstructions) && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              Trade Parking
                            </h4>
                            <div className="pl-6 space-y-2">
                              {buildingDetailsData.instructions.tradeParkingSpots !== null && (
                                <p className="text-sm">
                                  <span className="text-muted-foreground">Available spots: </span>
                                  <span className="font-medium">{buildingDetailsData.instructions.tradeParkingSpots}</span>
                                </p>
                              )}
                              {buildingDetailsData.instructions.tradeParkingInstructions && (
                                <p className="text-sm">{buildingDetailsData.instructions.tradeParkingInstructions}</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Special Requests */}
                      {(buildingDetailsData.instructions.signageRequirements || buildingDetailsData.instructions.specialRequests) && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Special Requirements
                            </h4>
                            <div className="pl-6 space-y-3">
                              {buildingDetailsData.instructions.signageRequirements && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Signage Requirements</p>
                                  <p className="text-sm">{buildingDetailsData.instructions.signageRequirements}</p>
                                </div>
                              )}
                              {buildingDetailsData.instructions.specialRequests && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Special Requests</p>
                                  <p className="text-sm whitespace-pre-wrap">{buildingDetailsData.instructions.specialRequests}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Last Updated */}
                      <div className="text-xs text-muted-foreground text-right">
                        Last updated: {formatLocalDate(buildingDetailsData.instructions.updatedAt)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                    placeholder={t('superuserBuildings.newPasswordPlaceholder', 'New password (optional)')}
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
      </SuperUserLayout>
    );
  }

  const BuildingListItem = ({ building }: { building: BuildingData }) => (
    <div 
      className="p-3 border-b border-border hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={() => setSelectedBuilding(building)}
      onMouseEnter={() => setHoveredBuildingId(building.id)}
      onMouseLeave={() => setHoveredBuildingId(null)}
      data-testid={`list-building-${building.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-sm truncate">
              {building.buildingName || `Building ${building.strataPlanNumber}`}
            </h3>
            {building.latitude && building.longitude && (
              <MapPin className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {building.buildingAddress ? (
              `${building.buildingAddress}${building.city ? `, ${building.city}` : ""}`
            ) : (
              `Strata: ${building.strataPlanNumber}`
            )}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>{getTotalDrops(building)} drops</span>
            <span>{building.floorCount || "—"} floors</span>
            <span>{building.totalProjectsCompleted || 0} completed</span>
          </div>
        </div>
        {building.latitude && building.longitude && showMapView && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setFlyToBuilding(building);
            }}
            data-testid={`button-fly-to-${building.id}`}
          >
            <Compass className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <SuperUserLayout title="Global Buildings Database">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <BackButton to="/superuser" label="Back to Dashboard" />
            <div className="flex items-center gap-2">
              <Button
                variant={showMapView ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMapView(true)}
                data-testid="button-map-view"
              >
                <Map className="mr-2 h-4 w-4" />
                Map
              </Button>
              <Button
                variant={!showMapView ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMapView(false)}
                data-testid="button-list-view"
              >
                <List className="mr-2 h-4 w-4" />
                List
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{buildings.length} buildings</span>
              {showMapView && (
                <>
                  <span className="text-muted-foreground/50">|</span>
                  <span>{buildingsWithCoords} on map</span>
                  {buildingsWithoutCoords > 0 && (
                    <>
                      <span className="text-muted-foreground/50">|</span>
                      <span className="text-amber-500 dark:text-amber-400">{buildingsWithoutCoords} missing location</span>
                    </>
                  )}
                </>
              )}
            </div>
            {buildingsWithoutCoords > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => geocodeAllMutation.mutate()}
                disabled={geocodeAllMutation.isPending}
                data-testid="button-geocode-all"
              >
                {geocodeAllMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Geocoding...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Geocode All
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('superuserBuildings.searchPlaceholder', 'Search by strata/job number, site name, address, or city...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : showMapView ? (
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            <div className="w-full md:w-2/5 border-r flex flex-col min-h-0">
              <div className="p-2 border-b bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  {filteredBuildings.length} building{filteredBuildings.length !== 1 ? "s" : ""} in view
                </p>
              </div>
              <ScrollArea className="flex-1">
                {filteredBuildings.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      {searchTerm 
                        ? "No buildings match your search." 
                        : "Move the map to see buildings in this area."
                      }
                    </p>
                  </div>
                ) : (
                  <div>
                    {filteredBuildings.map(building => (
                      <BuildingListItem key={building.id} building={building} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            <div className="w-full md:w-3/5 h-64 md:h-auto relative">
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEventHandler
                  onBoundsChange={handleBoundsChange}
                  buildings={buildings}
                  onBuildingClick={setSelectedBuilding}
                  selectedBuildingId={null}
                  hoveredBuildingId={hoveredBuildingId}
                />
                <FlyToBuilding building={flyToBuilding} />
              </MapContainer>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-auto">
            {filteredBuildings.length === 0 ? (
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
              <div className="max-w-4xl mx-auto space-y-4">
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
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {building.buildingName || `Building ${building.strataPlanNumber}`}
                              </h3>
                              {building.latitude && building.longitude && (
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {building.buildingAddress ? (
                                `${building.buildingAddress}, ${building.city || ""}`
                              ) : (
                                `Strata: ${building.strataPlanNumber}`
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium">{getTotalDrops(building)}</p>
                            <p className="text-muted-foreground">Total Drops</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{building.floorCount || "—"}</p>
                            <p className="text-muted-foreground">Floors</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{building.totalProjectsCompleted || 0}</p>
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
        )}
      </div>
    </SuperUserLayout>
  );
}

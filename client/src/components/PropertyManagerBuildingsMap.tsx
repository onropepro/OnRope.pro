import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, MapPin, Building2, Briefcase, Calendar } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatLocalDate } from "@/lib/dateUtils";

export interface MapBuildingData {
  projectId: string;
  strataPlanNumber: string;
  buildingName: string | null;
  buildingAddress: string;
  latitude: string | null;
  longitude: string | null;
  status: string;
  jobType: string;
  customJobType: string | null;
  startDate: string | null;
  endDate: string | null;
  vendorLinkId: string;
  vendorName: string;
  vendorLogo: string | null;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

const createBuildingIcon = (isSelected: boolean = false, status: string = 'active') => {
  const getStatusColor = () => {
    if (isSelected) return 'hsl(var(--primary))';
    switch (status) {
      case 'active': return '#22c55e';
      case 'scheduled': return '#3b82f6';
      case 'completed': return '#6b7280';
      default: return 'hsl(var(--card))';
    }
  };

  return L.divIcon({
    className: 'custom-building-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${getStatusColor()};
        border: 2px solid ${isSelected ? 'hsl(var(--primary))' : 'white'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: all 0.2s ease;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

function MapEventHandler({ 
  onBoundsChange,
  buildings,
  onBuildingClick,
  selectedBuildingId,
  hoveredBuildingId 
}: { 
  onBoundsChange: (bounds: MapBounds) => void;
  buildings: MapBuildingData[];
  onBuildingClick: (building: MapBuildingData) => void;
  selectedBuildingId: string | null;
  hoveredBuildingId: string | null;
}) {
  const map = useMap();

  const updateBounds = useCallback(() => {
    const bounds = map.getBounds();
    const newBounds = {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    };
    onBoundsChange(newBounds);
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
          key={building.projectId}
          position={[parseFloat(building.latitude!), parseFloat(building.longitude!)]}
          icon={createBuildingIcon(
            building.projectId === selectedBuildingId || building.projectId === hoveredBuildingId,
            building.status
          )}
          eventHandlers={{
            click: () => onBuildingClick(building),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">{building.buildingName || building.strataPlanNumber}</p>
              {building.buildingAddress && (
                <p className="text-muted-foreground text-xs">{building.buildingAddress}</p>
              )}
              <p className="text-xs mt-1">{building.jobType.replace(/_/g, ' ')}</p>
              <p className="text-xs text-muted-foreground">{building.vendorName}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function FlyToBuilding({ building }: { building: MapBuildingData | null }) {
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

interface PropertyManagerBuildingsMapProps {
  onBuildingSelect: (building: MapBuildingData) => void;
}

export function PropertyManagerBuildingsMap({ onBuildingSelect }: PropertyManagerBuildingsMapProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<MapBuildingData | null>(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [flyToBuilding, setFlyToBuilding] = useState<MapBuildingData | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  const DEFAULT_CENTER: [number, number] = [49.2827, -123.1207];
  const DEFAULT_ZOOM = 11;

  const { data: buildingsData, isLoading } = useQuery<{ buildings: MapBuildingData[] }>({
    queryKey: ["/api/property-managers/me/buildings-map"],
  });

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
      building.vendorName?.toLowerCase().includes(search) ||
      building.jobType?.toLowerCase().includes(search)
    );
    
    if (!matchesSearch) return false;
    
    if (mapBounds && building.latitude && building.longitude) {
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

  const handleBuildingClick = (building: MapBuildingData) => {
    setSelectedBuilding(building);
    setFlyToBuilding(building);
    onBuildingSelect(building);
  };

  const handleListItemClick = (building: MapBuildingData) => {
    setSelectedBuilding(building);
    setFlyToBuilding(building);
    onBuildingSelect(building);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: t('propertyManager.map.status.active', 'Active'), variant: "default" },
      scheduled: { label: t('propertyManager.map.status.scheduled', 'Scheduled'), variant: "secondary" },
      completed: { label: t('propertyManager.map.status.completed', 'Completed'), variant: "outline" },
    };
    const config = statusConfig[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (buildings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('propertyManager.map.noBuildings', 'No Buildings to Display')}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('propertyManager.map.noBuildingsDesc', 'Link to a vendor and set your strata numbers to see your buildings on the map.')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[600px]">
      <div className="lg:w-[60%] h-full rounded-lg overflow-hidden border">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventHandler
            onBoundsChange={handleBoundsChange}
            buildings={buildings}
            onBuildingClick={handleBuildingClick}
            selectedBuildingId={selectedBuilding?.projectId || null}
            hoveredBuildingId={hoveredBuildingId}
          />
          <FlyToBuilding building={flyToBuilding} />
        </MapContainer>
      </div>

      <div className="lg:w-[40%] flex flex-col gap-4">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {t('propertyManager.map.projectsOnMap', 'Projects on Map')}
              <Badge variant="secondary" className="ml-auto">{filteredBuildings.length}</Badge>
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('propertyManager.map.searchPlaceholder', 'Search buildings...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-map-search"
              />
            </div>
            {buildingsWithoutCoords > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {t('propertyManager.map.missingCoords', '{{count}} project(s) missing location data', { count: buildingsWithoutCoords })}
              </p>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-4 pb-4">
              <div className="space-y-2">
                {filteredBuildings.map((building) => (
                  <div
                    key={building.projectId}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover-elevate ${
                      selectedBuilding?.projectId === building.projectId
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => handleListItemClick(building)}
                    onMouseEnter={() => setHoveredBuildingId(building.projectId)}
                    onMouseLeave={() => setHoveredBuildingId(null)}
                    data-testid={`card-building-${building.projectId}`}
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-sm truncate">
                            {building.buildingName || building.strataPlanNumber}
                          </h4>
                          {getStatusBadge(building.status)}
                        </div>
                        {building.buildingAddress && (
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            <MapPin className="inline h-3 w-3 mr-1" />
                            {building.buildingAddress}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {building.customJobType || building.jobType.replace(/_/g, ' ')}
                      </span>
                      {building.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatLocalDate(new Date(building.startDate))}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {building.vendorName}
                    </p>
                  </div>
                ))}
                {filteredBuildings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('propertyManager.map.noResults', 'No buildings match your search')}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            {t('propertyManager.map.legend.active', 'Active')}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            {t('propertyManager.map.legend.scheduled', 'Scheduled')}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
            {t('propertyManager.map.legend.completed', 'Completed')}
          </div>
        </div>
      </div>
    </div>
  );
}

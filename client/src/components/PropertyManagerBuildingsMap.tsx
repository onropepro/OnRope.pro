import { useState, useEffect, useCallback, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, MapPin, Building2, Briefcase, Calendar, Sparkles } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents, Circle } from "react-leaflet";
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

// Inject custom CSS for animations
const injectCustomStyles = () => {
  const styleId = 'property-map-custom-styles';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes pulse-ring {
      0% {
        transform: scale(0.8);
        opacity: 0.8;
      }
      100% {
        transform: scale(2.5);
        opacity: 0;
      }
    }
    
    @keyframes bounce-marker {
      0%, 100% {
        transform: translateY(0);
      }
      25% {
        transform: translateY(-12px);
      }
      50% {
        transform: translateY(-6px);
      }
      75% {
        transform: translateY(-10px);
      }
    }
    
    @keyframes spotlight-glow {
      0%, 100% {
        opacity: 0.6;
        transform: scale(1);
      }
      50% {
        opacity: 0.9;
        transform: scale(1.1);
      }
    }
    
    @keyframes ripple-effect {
      0% {
        transform: scale(0.5);
        opacity: 0.8;
      }
      100% {
        transform: scale(3);
        opacity: 0;
      }
    }
    
    .marker-pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
    }
    
    .marker-bounce {
      animation: bounce-marker 0.6s ease-out;
    }
    
    .spotlight-ring {
      position: absolute;
      width: 200%;
      height: 200%;
      top: -50%;
      left: -50%;
      border-radius: 50%;
      animation: spotlight-glow 1.5s ease-in-out infinite;
      pointer-events: none;
    }
    
    .ripple-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: ripple-effect 1s ease-out forwards;
    }
    
    .custom-building-marker {
      background: transparent !important;
      border: none !important;
    }
    
    .leaflet-popup-content-wrapper {
      border-radius: 16px !important;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15) !important;
      padding: 0 !important;
      overflow: hidden;
      backdrop-filter: blur(8px);
    }
    
    .leaflet-popup-content {
      margin: 0 !important;
      min-width: 240px !important;
    }
    
    .leaflet-popup-tip {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
    }
    
    .dark .leaflet-popup-content-wrapper {
      background: hsl(var(--card)) !important;
      color: hsl(var(--card-foreground)) !important;
    }
    
    .dark .leaflet-popup-tip {
      background: hsl(var(--card)) !important;
    }
    
    .leaflet-container {
      font-family: inherit !important;
    }
    
    .leaflet-tooltip {
      background: rgba(15, 23, 42, 0.95) !important;
      border: none !important;
      border-radius: 8px !important;
      color: white !important;
      font-weight: 500 !important;
      padding: 8px 14px !important;
      font-size: 13px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25) !important;
      backdrop-filter: blur(4px);
    }
    
    .leaflet-tooltip-top:before {
      border-top-color: rgba(15, 23, 42, 0.95) !important;
    }
    
    .dark .leaflet-tooltip {
      background: rgba(30, 41, 59, 0.95) !important;
    }
    
    .dark .leaflet-tooltip-top:before {
      border-top-color: rgba(30, 41, 59, 0.95) !important;
    }
    
    .leaflet-control-zoom {
      border: none !important;
      border-radius: 12px !important;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
    }
    
    .leaflet-control-zoom a {
      background: rgba(255, 255, 255, 0.95) !important;
      color: #374151 !important;
      border: none !important;
      width: 36px !important;
      height: 36px !important;
      line-height: 36px !important;
      font-size: 18px !important;
      transition: all 0.2s ease !important;
    }
    
    .leaflet-control-zoom a:hover {
      background: #f3f4f6 !important;
    }
    
    .dark .leaflet-control-zoom a {
      background: rgba(30, 41, 59, 0.95) !important;
      color: #e2e8f0 !important;
    }
    
    .dark .leaflet-control-zoom a:hover {
      background: rgba(51, 65, 85, 0.95) !important;
    }
  `;
  document.head.appendChild(style);
};

const createBuildingIcon = (isSelected: boolean = false, isHovered: boolean = false, status: string = 'active') => {
  const getStatusColors = () => {
    switch (status) {
      case 'active': 
        return { 
          bg: '#10b981', 
          ring: '#34d399', 
          glow: 'rgba(16, 185, 129, 0.5)',
          spotlight: 'rgba(16, 185, 129, 0.3)'
        };
      case 'scheduled': 
        return { 
          bg: '#3b82f6', 
          ring: '#60a5fa', 
          glow: 'rgba(59, 130, 246, 0.5)',
          spotlight: 'rgba(59, 130, 246, 0.3)'
        };
      case 'completed': 
        return { 
          bg: '#6b7280', 
          ring: '#9ca3af', 
          glow: 'rgba(107, 114, 128, 0.4)',
          spotlight: 'rgba(107, 114, 128, 0.2)'
        };
      default: 
        return { 
          bg: '#6b7280', 
          ring: '#9ca3af', 
          glow: 'rgba(107, 114, 128, 0.4)',
          spotlight: 'rgba(107, 114, 128, 0.2)'
        };
    }
  };

  const colors = getStatusColors();
  const size = isSelected ? 52 : isHovered ? 44 : 38;
  const iconSize = isSelected ? 24 : isHovered ? 20 : 17;
  
  const pulseRing = status === 'active' ? `
    <div class="marker-pulse" style="background: ${colors.ring};"></div>
  ` : '';
  
  const spotlightRing = isSelected ? `
    <div class="spotlight-ring" style="
      background: radial-gradient(circle, ${colors.spotlight} 0%, transparent 70%);
      box-shadow: 0 0 40px 20px ${colors.spotlight};
    "></div>
  ` : '';
  
  const bounceClass = isSelected ? 'marker-bounce' : '';

  return L.divIcon({
    className: 'custom-building-marker',
    html: `
      <div class="${bounceClass}" style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${spotlightRing}
        ${pulseRing}
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          background: linear-gradient(145deg, ${colors.bg} 0%, ${colors.ring} 50%, ${colors.bg} 100%);
          border: ${isSelected ? '4px' : '3px'} solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 ${isSelected ? '8px 24px' : '4px 12px'} ${colors.glow}, 
            0 ${isSelected ? '4px 8px' : '2px 4px'} rgba(0,0,0,0.15),
            ${isSelected ? `0 0 0 4px ${colors.spotlight}` : 'none'},
            inset 0 2px 4px rgba(255,255,255,0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          ${isSelected ? 'transform: scale(1.15);' : isHovered ? 'transform: scale(1.08);' : ''}
        ">
          <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));">
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
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Utility to detect dark mode from document
const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  
  return isDark;
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

  const getPopupContent = (building: MapBuildingData) => {
    const statusColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
      active: { bg: '#dcfce7', text: '#166534', border: '#86efac', gradient: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' },
      scheduled: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' },
      completed: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db', gradient: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' },
    };
    const colors = statusColors[building.status] || statusColors.completed;
    
    const popupDark = document.documentElement.classList.contains('dark');
    const bgColor = popupDark ? 'hsl(var(--card))' : '#ffffff';
    const textColor = popupDark ? 'hsl(var(--card-foreground))' : '#1f2937';
    const mutedColor = popupDark ? 'hsl(var(--muted-foreground))' : '#6b7280';
    const accentBg = popupDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
    
    return `
      <div style="background: ${bgColor}; overflow: hidden;">
        <div style="
          padding: 16px 18px;
          background: ${accentBg};
          border-bottom: 1px solid ${popupDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
        ">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="
              font-weight: 700;
              font-size: 15px;
              color: ${textColor};
              letter-spacing: -0.02em;
            ">${building.buildingName || building.strataPlanNumber}</span>
            <span style="
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 600;
              background: ${colors.gradient};
              color: ${colors.text};
              border: 1px solid ${colors.border};
              text-transform: uppercase;
              letter-spacing: 0.05em;
            ">${building.status}</span>
          </div>
        </div>
        <div style="padding: 14px 18px;">
          ${building.buildingAddress ? `
            <p style="
              font-size: 13px;
              color: ${mutedColor};
              margin: 0 0 12px 0;
              display: flex;
              align-items: flex-start;
              gap: 8px;
              line-height: 1.5;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0; margin-top: 2px; opacity: 0.7;">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              ${building.buildingAddress}
            </p>
          ` : ''}
          <div style="
            display: flex;
            align-items: center;
            gap: 14px;
            font-size: 12px;
            color: ${mutedColor};
            padding: 10px 12px;
            background: ${accentBg};
            border-radius: 8px;
          ">
            <span style="display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.7;">
                <path d="M20 7h-9"/>
                <path d="M14 17H5"/>
                <circle cx="17" cy="17" r="3"/>
                <circle cx="7" cy="7" r="3"/>
              </svg>
              <span style="font-weight: 500;">${building.customJobType || building.jobType.replace(/_/g, ' ')}</span>
            </span>
          </div>
          <p style="
            font-size: 12px;
            color: ${mutedColor};
            margin: 12px 0 0 0;
            font-weight: 600;
            opacity: 0.8;
          ">${building.vendorName}</p>
        </div>
      </div>
    `;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10b981';
      case 'scheduled': return '#3b82f6';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <>
      {buildings.filter(b => b.latitude && b.longitude).map(building => {
        const isSelected = building.projectId === selectedBuildingId;
        const isHovered = building.projectId === hoveredBuildingId;
        const lat = parseFloat(building.latitude!);
        const lng = parseFloat(building.longitude!);
        
        return (
          <Fragment key={building.projectId}>
            {isSelected && (
              <Circle
                center={[lat, lng]}
                radius={150}
                pathOptions={{
                  color: getStatusColor(building.status),
                  fillColor: getStatusColor(building.status),
                  fillOpacity: 0.15,
                  weight: 2,
                  opacity: 0.6,
                  dashArray: '8, 8',
                }}
              />
            )}
            <Marker
              position={[lat, lng]}
              icon={createBuildingIcon(isSelected, isHovered, building.status)}
              eventHandlers={{
                click: () => onBuildingClick(building),
              }}
            >
              <Tooltip 
                direction="top" 
                offset={[0, -45]} 
                permanent={false}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: getStatusColor(building.status),
                    boxShadow: `0 0 6px ${getStatusColor(building.status)}`
                  }}></span>
                  {building.buildingName || building.strataPlanNumber}
                </span>
              </Tooltip>
              <Popup>
                <div dangerouslySetInnerHTML={{ __html: getPopupContent(building) }} />
              </Popup>
            </Marker>
          </Fragment>
        );
      })}
    </>
  );
}

function FlyToBuilding({ building }: { building: MapBuildingData | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (building?.latitude && building?.longitude) {
      map.flyTo([parseFloat(building.latitude), parseFloat(building.longitude)], 16, {
        duration: 1.2,
        easeLinearity: 0.1,
      });
    }
  }, [building, map]);

  return null;
}

// Auto-fit map to show all markers
function FitBounds({ buildings }: { buildings: MapBuildingData[] }) {
  const map = useMap();
  
  useEffect(() => {
    const validBuildings = buildings.filter(b => b.latitude && b.longitude);
    if (validBuildings.length === 0) return;
    
    if (validBuildings.length === 1) {
      const b = validBuildings[0];
      map.setView([parseFloat(b.latitude!), parseFloat(b.longitude!)], 14);
      return;
    }
    
    const bounds = L.latLngBounds(
      validBuildings.map(b => [parseFloat(b.latitude!), parseFloat(b.longitude!)] as [number, number])
    );
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
  }, [buildings.length]);
  
  return null;
}

interface PropertyManagerBuildingsMapProps {
  onBuildingSelect: (building: MapBuildingData) => void;
}

export function PropertyManagerBuildingsMap({ onBuildingSelect }: PropertyManagerBuildingsMapProps) {
  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<MapBuildingData | null>(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [flyToBuilding, setFlyToBuilding] = useState<MapBuildingData | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  const DEFAULT_CENTER: [number, number] = [49.2827, -123.1207];
  const DEFAULT_ZOOM = 11;

  // Inject custom styles on mount
  useEffect(() => {
    injectCustomStyles();
  }, []);

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
    const statusConfig: Record<string, { label: string; className: string }> = {
      active: { 
        label: t('propertyManager.map.status.active', 'Active'), 
        className: 'bg-emerald-500 text-white border-emerald-600' 
      },
      scheduled: { 
        label: t('propertyManager.map.status.scheduled', 'Scheduled'), 
        className: 'bg-blue-500 text-white border-blue-600' 
      },
      completed: { 
        label: t('propertyManager.map.status.completed', 'Completed'), 
        className: 'bg-gray-400 text-white border-gray-500' 
      },
    };
    const config = statusConfig[status] || { label: status, className: 'bg-gray-400 text-white' };
    return <Badge className={`text-xs ${config.className}`}>{config.label}</Badge>;
  };

  // Premium map tiles - Stadia Alidade Smooth style
  const tileUrl = isDarkMode 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png';
  
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

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
      <div className="lg:w-[60%] h-full rounded-2xl overflow-hidden border shadow-xl relative z-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution={tileAttribution}
            url={tileUrl}
          />
          <MapEventHandler
            onBoundsChange={handleBoundsChange}
            buildings={buildings}
            onBuildingClick={handleBuildingClick}
            selectedBuildingId={selectedBuilding?.projectId || null}
            hoveredBuildingId={hoveredBuildingId}
          />
          <FlyToBuilding building={flyToBuilding} />
          <FitBounds buildings={buildings} />
        </MapContainer>
      </div>

      <div className="lg:w-[40%] flex flex-col gap-4">
        <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-0 bg-gradient-to-br from-card to-card/95">
          <CardHeader className="pb-2 border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {t('propertyManager.map.projectsOnMap', 'Projects on Map')}
              <Badge variant="secondary" className="ml-auto font-semibold">{filteredBuildings.length}</Badge>
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
              <div className="space-y-2 pt-2">
                {filteredBuildings.map((building) => (
                  <div
                    key={building.projectId}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover-elevate ${
                      selectedBuilding?.projectId === building.projectId
                        ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20'
                        : 'border-transparent bg-muted/30 hover:bg-muted/50 hover:shadow-md'
                    }`}
                    onClick={() => handleListItemClick(building)}
                    onMouseEnter={() => setHoveredBuildingId(building.projectId)}
                    onMouseLeave={() => setHoveredBuildingId(null)}
                    data-testid={`card-building-${building.projectId}`}
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {selectedBuilding?.projectId === building.projectId && (
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                          )}
                          <h4 className="font-semibold text-sm truncate">
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
                          {formatLocalDate(building.startDate)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
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

        <div className="flex flex-wrap gap-4 text-xs bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-md rounded-xl p-4 border shadow-lg">
          <div className="flex items-center gap-2">
            <span className="relative">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
              <span className="relative w-3 h-3 rounded-full bg-emerald-500 block shadow-lg shadow-emerald-500/50"></span>
            </span>
            <span className="font-medium">{t('propertyManager.map.legend.active', 'Active')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></span>
            <span className="font-medium">{t('propertyManager.map.legend.scheduled', 'Scheduled')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400 shadow-lg shadow-gray-400/50"></span>
            <span className="font-medium">{t('propertyManager.map.legend.completed', 'Completed')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

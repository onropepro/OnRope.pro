import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSetHeaderConfig } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Color hash function for employee-specific colors
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 50%)`;
}

// Create custom marker icons for start/end locations
function createMarkerIcon(color: string, type: 'start' | 'end'): L.DivIcon {
  const isStart = type === 'start';
  return new L.DivIcon({
    html: `<div style="
      width: ${isStart ? '24px' : '16px'};
      height: ${isStart ? '24px' : '16px'};
      background-color: ${color};
      border: ${isStart ? '3px' : '2px'} solid white;
      border-radius: 50%;
      ${!isStart ? 'border-style: dashed;' : ''}
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      opacity: ${isStart ? '0.9' : '0.7'};
    "></div>`,
    className: '',
    iconSize: [isStart ? 24 : 16, isStart ? 24 : 16],
    iconAnchor: [isStart ? 12 : 8, isStart ? 12 : 8],
  });
}

// Component to fit map bounds to markers
function FitBounds({ markers }: { markers: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (markers.length === 0) return;
    
    const bounds = L.latLngBounds(markers.map(m => m.position));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [markers, map]);
  
  return null;
}

export default function ActiveWorkers() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [timeFilter, setTimeFilter] = useState<"today" | "week">("today");

  // Fetch all active work sessions
  const { data: activeWorkersData, isLoading: isLoadingActive } = useQuery<{ sessions: any[] }>({
    queryKey: ["/api/active-workers"],
  });

  // Fetch all work sessions for GPS tracking
  const { data: allSessionsData, isLoading: isLoadingAll } = useQuery<{ sessions: any[] }>({
    queryKey: ["/api/all-work-sessions"],
  });

  // Fetch harness inspections (for status badge)
  const { data: harnessInspectionsData } = useQuery<{ inspections: any[] }>({
    queryKey: ["/api/harness-inspections"],
  });

  const activeWorkers = activeWorkersData?.sessions || [];
  const allSessions = allSessionsData?.sessions || [];
  const harnessInspections = harnessInspectionsData?.inspections || [];
  
  const isLoading = isLoadingActive || isLoadingAll;

  // Helper function to check if employee submitted harness inspection for a given date
  const hasHarnessInspection = (employeeId: string, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return harnessInspections.some((inspection: any) => 
      inspection.workerId === employeeId && inspection.inspectionDate === dateStr
    );
  };

  // Filter sessions by time period (using startTime instead of workDate)
  const filteredSessions = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return allSessions.filter((session: any) => {
      // Use startTime for filtering (more reliable than workDate)
      if (!session.startTime) return false;
      
      const sessionDate = new Date(session.startTime);
      if (timeFilter === "today") {
        return sessionDate >= today;
      } else {
        return sessionDate >= weekAgo;
      }
    });
  }, [allSessions, timeFilter]);

  // Extract GPS markers from sessions
  const gpsMarkers = useMemo(() => {
    const markers: any[] = [];
    
    filteredSessions.forEach((session: any) => {
      // Use employeeName as primary source for color generation (consistent with legend)
      const colorKey = session.employeeName || `employee-${session.employeeId}`;
      const employeeColor = stringToColor(colorKey);
      
      // Add start location marker
      if (session.startLatitude && session.startLongitude) {
        markers.push({
          id: `${session.id}-start`,
          position: [parseFloat(session.startLatitude), parseFloat(session.startLongitude)],
          type: 'start',
          session,
          color: employeeColor,
        });
      }
      
      // Add end location marker (only if session is completed)
      if (session.endTime && session.endLatitude && session.endLongitude) {
        markers.push({
          id: `${session.id}-end`,
          position: [parseFloat(session.endLatitude), parseFloat(session.endLongitude)],
          type: 'end',
          session,
          color: employeeColor,
        });
      }
    });
    
    return markers;
  }, [filteredSessions]);

  // Get unique employees with their colors (MUST use same logic as markers!)
  const employeeColors = useMemo(() => {
    const uniqueEmployees = new Map<string, { name: string; color: string }>();
    
    filteredSessions.forEach((session: any) => {
      // Only show employees that have a name (skip sessions without employeeName)
      if (!session.employeeName) return;
      
      const employeeKey = session.employeeName;
      
      if (!uniqueEmployees.has(employeeKey)) {
        uniqueEmployees.set(employeeKey, {
          name: session.employeeName,
          color: stringToColor(session.employeeName), // Same as marker color generation
        });
      }
    });
    
    return Array.from(uniqueEmployees.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredSessions]);

  // Calculate map center and bounds
  const mapCenter = useMemo(() => {
    if (gpsMarkers.length === 0) return [49.2827, -123.1207]; // Default to Vancouver
    const avgLat = gpsMarkers.reduce((sum, m) => sum + m.position[0], 0) / gpsMarkers.length;
    const avgLng = gpsMarkers.reduce((sum, m) => sum + m.position[1], 0) / gpsMarkers.length;
    return [avgLat, avgLng];
  }, [gpsMarkers]);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg dot-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">{t('common.loading', 'Loading...')}</div>
        </div>
      </div>
    );
  }

  // Configure unified header with back button
  const handleBackClick = useCallback(() => {
    setLocation('/dashboard');
  }, [setLocation]);

  const activeCountBadge = useMemo(() => (
    <Badge variant="secondary" className="text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 flex-shrink-0">
      {activeWorkers.length} {t('activeWorkers.active', 'active')}
    </Badge>
  ), [activeWorkers.length, t]);

  useSetHeaderConfig({
    pageTitle: t('activeWorkers.title', 'Active Workers'),
    pageDescription: t('activeWorkers.subtitle', "Real-time view of who's working where"),
    onBackClick: handleBackClick,
    actionButtons: activeCountBadge,
    showSearch: false,
  }, [t, handleBackClick, activeCountBadge]);

  return (
    <div className="min-h-screen gradient-bg dot-pattern pb-6">
      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="workers" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="workers" data-testid="tab-workers">
              <span className="material-icons text-sm mr-2">people</span>
              {t('activeWorkers.workers', 'Workers')}
            </TabsTrigger>
            <TabsTrigger value="locations" data-testid="tab-locations">
              <span className="material-icons text-sm mr-2">map</span>
              {t('activeWorkers.gpsLocations', 'GPS Locations')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workers">
            {activeWorkers.length === 0 ? (
              <Card className="glass-card border-0 shadow-premium">
                <CardContent className="p-12 text-center">
                  <span className="material-icons text-6xl text-muted-foreground mb-4">
                    work_off
                  </span>
                  <h3 className="text-xl font-bold mb-2">{t('activeWorkers.noActiveWorkers', 'No Active Workers')}</h3>
                  <p className="text-muted-foreground">
                    {t('activeWorkers.noWorkersMessage', 'No one is currently clocked in on any projects')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeWorkers.map((session: any) => (
                  <Card
                    key={session.id}
                    className="glass-card border-0 shadow-premium hover-elevate cursor-pointer"
                    onClick={() => setLocation(`/projects/${session.projectId}`)}
                    data-testid={`active-worker-${session.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="material-icons text-primary">person</span>
                            {session.techName || t('activeWorkers.unknownWorker', 'Unknown Worker')}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {session.projectName || t('activeWorkers.unknownProject', 'Unknown Project')}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {/* Harness Inspection Status */}
                          {(() => {
                            const today = new Date();
                            const hasTodayInspection = hasHarnessInspection(session.employeeId, today);
                            return (
                              <Badge 
                                variant={hasTodayInspection ? "default" : "destructive"}
                                className="flex items-center gap-1"
                                title={hasTodayInspection ? t('activeWorkers.harnessCompleted', 'Harness inspection completed') : t('activeWorkers.harnessMissing', 'Harness inspection missing')}
                              >
                                <span className="material-icons text-xs">
                                  {hasTodayInspection ? 'verified' : 'warning'}
                                </span>
                                {hasTodayInspection ? t('activeWorkers.inspected', 'Inspected') : t('activeWorkers.notInspected', 'Not Inspected')}
                              </Badge>
                            );
                          })()}
                          <Badge variant="default" className="bg-primary">
                            <span className="material-icons text-xs mr-1">schedule</span>
                            {t('activeWorkers.activeStatus', 'Active')}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            {t('activeWorkers.startedAt', 'Started At')}
                          </div>
                          <div className="text-base font-medium flex items-center gap-1">
                            <span className="material-icons text-sm">login</span>
                            {session.startTime && format(new Date(session.startTime), 'h:mm a')}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            {t('activeWorkers.duration', 'Duration')}
                          </div>
                          <div className="text-base font-medium flex items-center gap-1">
                            <span className="material-icons text-sm">timer</span>
                            {session.startTime && (() => {
                              const start = new Date(session.startTime);
                              const now = new Date();
                              const diff = now.getTime() - start.getTime();
                              const hours = Math.floor(diff / (1000 * 60 * 60));
                              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                              return `${hours}h ${minutes}m`;
                            })()}
                          </div>
                        </div>
                      </div>
                      {session.strataPlanNumber && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="material-icons text-sm">apartment</span>
                            {session.strataPlanNumber}
                            <span className="mx-1">•</span>
                            <span className="capitalize">
                              {session.jobType?.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locations">
            <div className="space-y-4">
              {/* Time Filter */}
              <Card className="glass-card border-0 shadow-premium">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{t('activeWorkers.timePeriod', 'Time Period')}</div>
                    <div className="flex gap-2">
                      <Button
                        variant={timeFilter === "today" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeFilter("today")}
                        data-testid="filter-today"
                      >
                        <span className="material-icons text-sm mr-1">today</span>
                        {t('activeWorkers.filterToday', 'Today')}
                      </Button>
                      <Button
                        variant={timeFilter === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeFilter("week")}
                        data-testid="filter-week"
                      >
                        <span className="material-icons text-sm mr-1">date_range</span>
                        {t('activeWorkers.filterThisWeek', 'This Week')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GPS Map */}
              <Card className="glass-card border-0 shadow-premium overflow-hidden">
                <CardContent className="p-0">
                  {gpsMarkers.length === 0 ? (
                    <div className="p-12 text-center">
                      <span className="material-icons text-6xl text-muted-foreground mb-4">
                        location_off
                      </span>
                      <h3 className="text-xl font-bold mb-2">{t('activeWorkers.noGpsData', 'No GPS Data')}</h3>
                      <p className="text-muted-foreground">
                        {t('activeWorkers.noGpsMessage', 'No work sessions with GPS locations for the selected time period')}
                      </p>
                    </div>
                  ) : (
                    <div className="h-[600px] w-full">
                      <MapContainer
                        center={mapCenter as [number, number]}
                        zoom={12}
                        style={{ height: '100%', width: '100%' }}
                        data-testid="gps-map"
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <FitBounds markers={gpsMarkers} />
                        {gpsMarkers.map((marker) => (
                          <Marker
                            key={marker.id}
                            position={marker.position as [number, number]}
                            icon={createMarkerIcon(marker.color, marker.type)}
                          >
                            <Popup>
                              <div className="p-2 min-w-[200px]">
                                <div className="font-bold text-base mb-2 flex items-center gap-2">
                                  <span className="material-icons text-sm" style={{ color: marker.color }}>
                                    person
                                  </span>
                                  {marker.session.employeeName || t('activeWorkers.unknown', 'Unknown')}
                                </div>
                                <div className="text-sm space-y-1">
                                  <div className="flex items-center gap-1">
                                    <span className="material-icons text-xs">business</span>
                                    <span className="font-medium">{marker.session.projectName || t('activeWorkers.unknownProject', 'Unknown Project')}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="material-icons text-xs">{marker.type === 'start' ? 'play_arrow' : 'stop'}</span>
                                    <span>{marker.type === 'start' ? t('activeWorkers.started', 'Started') : t('activeWorkers.ended', 'Ended')}: {format(new Date(marker.type === 'start' ? marker.session.startTime : marker.session.endTime), 'MMM d, h:mm a')}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Badge variant={marker.session.endTime ? "secondary" : "default"} className="text-xs">
                                      {marker.session.endTime ? t('activeWorkers.completed', 'Completed') : t('activeWorkers.inProgressStatus', 'In Progress')}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Legend */}
              {gpsMarkers.length > 0 && (
                <Card className="glass-card border-0 shadow-premium">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Marker Type Legend */}
                      <div>
                        <div className="text-sm font-medium mb-3">{t('activeWorkers.legend', 'Legend')}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary opacity-60"></div>
                            <span>{t('activeWorkers.startLocation', 'Start Location (Solid)')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-dashed border-primary bg-primary opacity-30"></div>
                            <span>{t('activeWorkers.endLocation', 'End Location (Dashed)')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Employee Color Chart */}
                      {employeeColors.length > 0 && (
                        <div className="pt-4 border-t">
                          <div className="text-sm font-medium mb-3">{t('activeWorkers.employeeColors', 'Employee Colors')}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {employeeColors.map((employee) => (
                              <div 
                                key={employee.name} 
                                className="flex items-center gap-2 text-sm"
                                data-testid={`employee-color-${employee.name}`}
                              >
                                <div 
                                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                                  style={{ backgroundColor: employee.color }}
                                ></div>
                                <span className="truncate">{employee.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground pt-4 border-t">
                        {t('activeWorkers.sessionsSummary', '{{sessionCount}} {{sessionLabel}} shown from {{employeeCount}} {{employeeLabel}}.', {
                          sessionCount: filteredSessions.length,
                          sessionLabel: filteredSessions.length !== 1 ? t('activeWorkers.sessions', 'sessions') : t('activeWorkers.session', 'session'),
                          employeeCount: employeeColors.length,
                          employeeLabel: employeeColors.length !== 1 ? t('activeWorkers.employees', 'employees') : t('activeWorkers.employee', 'employee')
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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
  const [, setLocation] = useLocation();
  const [timeFilter, setTimeFilter] = useState<"today" | "week">("today");

  // Fetch all active work sessions
  const { data: activeWorkersData, isLoading: isLoadingActive } = useQuery({
    queryKey: ["/api/active-workers"],
  });

  // Fetch all work sessions for GPS tracking
  const { data: allSessionsData, isLoading: isLoadingAll } = useQuery({
    queryKey: ["/api/all-work-sessions"],
  });

  // Fetch harness inspections for today and past week
  const { data: harnessInspectionsData, isLoading: isLoadingInspections } = useQuery({
    queryKey: ["/api/harness-inspections"],
  });

  // Fetch all employees for inspection tracking
  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["/api/employees"],
  });

  const activeWorkers = activeWorkersData?.sessions || [];
  const allSessions = allSessionsData?.sessions || [];
  const harnessInspections = harnessInspectionsData?.inspections || [];
  const employees = employeesData?.employees || [];
  
  const isLoading = isLoadingActive || isLoadingAll || isLoadingInspections || isLoadingEmployees;

  // Helper function to check if employee submitted harness inspection for a given date
  const hasHarnessInspection = (employeeId: string, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return harnessInspections.some((inspection: any) => 
      inspection.workerId === employeeId && inspection.inspectionDate === dateStr
    );
  };

  // Get past 7 days for inspection tracking
  const past7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  }, []);

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
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg dot-pattern pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              className="h-12 gap-2"
              data-testid="button-back"
            >
              <span className="material-icons">arrow_back</span>
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Active Workers</h1>
              <p className="text-sm text-muted-foreground">
                Real-time view of who's working where
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {activeWorkers.length} active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="workers" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-6">
            <TabsTrigger value="workers" data-testid="tab-workers">
              <span className="material-icons text-sm mr-2">people</span>
              Workers
            </TabsTrigger>
            <TabsTrigger value="inspections" data-testid="tab-inspections">
              <span className="material-icons text-sm mr-2">verified</span>
              Inspections
            </TabsTrigger>
            <TabsTrigger value="locations" data-testid="tab-locations">
              <span className="material-icons text-sm mr-2">map</span>
              GPS Locations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workers">
            {activeWorkers.length === 0 ? (
              <Card className="glass-card border-0 shadow-premium">
                <CardContent className="p-12 text-center">
                  <span className="material-icons text-6xl text-muted-foreground mb-4">
                    work_off
                  </span>
                  <h3 className="text-xl font-bold mb-2">No Active Workers</h3>
                  <p className="text-muted-foreground">
                    No one is currently clocked in on any projects
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
                            {session.techName || 'Unknown Worker'}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {session.projectName || 'Unknown Project'}
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
                                title={hasTodayInspection ? "Harness inspection completed" : "Harness inspection missing"}
                              >
                                <span className="material-icons text-xs">
                                  {hasTodayInspection ? 'verified' : 'warning'}
                                </span>
                                {hasTodayInspection ? 'Inspected' : 'Not Inspected'}
                              </Badge>
                            );
                          })()}
                          <Badge variant="default" className="bg-primary">
                            <span className="material-icons text-xs mr-1">schedule</span>
                            Active
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Started At
                          </div>
                          <div className="text-base font-medium flex items-center gap-1">
                            <span className="material-icons text-sm">login</span>
                            {session.startTime && format(new Date(session.startTime), 'h:mm a')}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Duration
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

          <TabsContent value="inspections">
            <Card className="glass-card border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons">verified</span>
                  Harness Inspection Tracking - Past 7 Days
                </CardTitle>
                <CardDescription>
                  Daily harness inspection submissions for all employees
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-sm">Employee</th>
                      {past7Days.map((date, index) => (
                        <th key={index} className="text-center p-3 font-medium text-sm">
                          <div>{format(date, 'EEE')}</div>
                          <div className="text-xs text-muted-foreground">{format(date, 'MMM d')}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center p-8 text-muted-foreground">
                          No employees found
                        </td>
                      </tr>
                    ) : (
                      employees.map((employee: any) => (
                        <tr 
                          key={employee.id} 
                          className="border-b hover-elevate"
                          data-testid={`employee-inspection-row-${employee.id}`}
                        >
                          <td className="p-3">
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-muted-foreground">{employee.role?.replace(/_/g, ' ')}</div>
                          </td>
                          {past7Days.map((date, index) => {
                            const hasInspection = hasHarnessInspection(employee.id, date);
                            return (
                              <td key={index} className="text-center p-3">
                                {hasInspection ? (
                                  <span className="material-icons text-green-500" title="Inspection submitted">
                                    check_circle
                                  </span>
                                ) : (
                                  <span className="material-icons text-red-500" title="No inspection">
                                    cancel
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <div className="space-y-4">
              {/* Time Filter */}
              <Card className="glass-card border-0 shadow-premium">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Time Period</div>
                    <div className="flex gap-2">
                      <Button
                        variant={timeFilter === "today" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeFilter("today")}
                        data-testid="filter-today"
                      >
                        <span className="material-icons text-sm mr-1">today</span>
                        Today
                      </Button>
                      <Button
                        variant={timeFilter === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeFilter("week")}
                        data-testid="filter-week"
                      >
                        <span className="material-icons text-sm mr-1">date_range</span>
                        This Week
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
                      <h3 className="text-xl font-bold mb-2">No GPS Data</h3>
                      <p className="text-muted-foreground">
                        No work sessions with GPS locations for the selected time period
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
                                  {marker.session.employeeName || 'Unknown'}
                                </div>
                                <div className="text-sm space-y-1">
                                  <div className="flex items-center gap-1">
                                    <span className="material-icons text-xs">business</span>
                                    <span className="font-medium">{marker.session.projectName || 'Unknown Project'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="material-icons text-xs">{marker.type === 'start' ? 'play_arrow' : 'stop'}</span>
                                    <span>{marker.type === 'start' ? 'Started' : 'Ended'}: {format(new Date(marker.type === 'start' ? marker.session.startTime : marker.session.endTime), 'MMM d, h:mm a')}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Badge variant={marker.session.endTime ? "secondary" : "default"} className="text-xs">
                                      {marker.session.endTime ? 'Completed' : 'In Progress'}
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
                        <div className="text-sm font-medium mb-3">Legend</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary opacity-60"></div>
                            <span>Start Location (Solid)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-dashed border-primary bg-primary opacity-30"></div>
                            <span>End Location (Dashed)</span>
                          </div>
                        </div>
                      </div>

                      {/* Employee Color Chart */}
                      {employeeColors.length > 0 && (
                        <div className="pt-4 border-t">
                          <div className="text-sm font-medium mb-3">Employee Colors</div>
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
                        {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} shown from {employeeColors.length} employee{employeeColors.length !== 1 ? 's' : ''}.
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

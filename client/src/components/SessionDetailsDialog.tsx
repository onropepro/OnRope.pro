import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Clock, Calendar, User, FileText, Edit, Save, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Fix leaflet icon paths
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom icons for start/end markers
const startIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path fill="#22c55e" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="5"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});

const endIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path fill="#ef4444" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="5"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});

interface SessionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: any;
  employeeName?: string;
  projectName?: string;
  jobType?: string;
  hasFinancialPermission?: boolean;
}

export function SessionDetailsDialog({
  open,
  onOpenChange,
  session,
  employeeName,
  projectName,
  jobType,
  hasFinancialPermission = false,
}: SessionDetailsDialogProps) {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dropsNorth, setDropsNorth] = useState("");
  const [dropsEast, setDropsEast] = useState("");
  const [dropsSouth, setDropsSouth] = useState("");
  const [dropsWest, setDropsWest] = useState("");
  const [manualPercentage, setManualPercentage] = useState("");
  const [isBillable, setIsBillable] = useState(true);

  if (!session) return null;
  
  const isParkade = jobType === "parkade_pressure_cleaning";
  const isInSuite = jobType === "in_suite_dryer_vent_cleaning";
  const isHoursBased = jobType === "general_pressure_washing" || jobType === "ground_window_cleaning";

  const hasStartLocation = session.startLatitude && session.startLongitude;
  const hasEndLocation = session.endLatitude && session.endLongitude;
  const hasAnyLocation = hasStartLocation || hasEndLocation;

  // Calculate center point for map
  const centerLat = hasStartLocation && hasEndLocation
    ? (parseFloat(session.startLatitude) + parseFloat(session.endLatitude)) / 2
    : hasStartLocation
      ? parseFloat(session.startLatitude)
      : hasEndLocation
        ? parseFloat(session.endLatitude)
        : 49.2827; // Default to Vancouver

  const centerLng = hasStartLocation && hasEndLocation
    ? (parseFloat(session.startLongitude) + parseFloat(session.endLongitude)) / 2
    : hasStartLocation
      ? parseFloat(session.startLongitude)
      : hasEndLocation
        ? parseFloat(session.endLongitude)
        : -123.1207;

  // Calculate total hours
  const totalHours = session.endTime
    ? ((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60)).toFixed(2)
    : 'Ongoing';

  // Line path for map
  const linePath = hasStartLocation && hasEndLocation
    ? [
        [parseFloat(session.startLatitude), parseFloat(session.startLongitude)],
        [parseFloat(session.endLatitude), parseFloat(session.endLongitude)]
      ]
    : [];

  // Initialize form when entering edit mode
  const handleEditClick = () => {
    setStartTime(format(new Date(session.startTime), "yyyy-MM-dd'T'HH:mm"));
    setEndTime(session.endTime ? format(new Date(session.endTime), "yyyy-MM-dd'T'HH:mm") : "");
    setDropsNorth((session.dropsCompletedNorth || 0).toString());
    setDropsEast((session.dropsCompletedEast || 0).toString());
    setDropsSouth((session.dropsCompletedSouth || 0).toString());
    setDropsWest((session.dropsCompletedWest || 0).toString());
    setManualPercentage((session.manualCompletionPercentage || 0).toString());
    setIsBillable(session.isBillable !== false);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  // Update work session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async (updates: any) => {
      const result = await apiRequest(`/api/work-sessions/${session.id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Work session updated",
        description: "Changes have been saved successfully",
      });
      setIsEditMode(false);
      
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/all-work-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update work session",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const updates: any = {
      startTime,
      isBillable,
    };

    if (endTime) {
      updates.endTime = endTime;
    }

    if (isHoursBased) {
      updates.manualCompletionPercentage = parseInt(manualPercentage);
    } else {
      updates.dropsCompletedNorth = parseInt(dropsNorth);
      updates.dropsCompletedEast = parseInt(dropsEast);
      updates.dropsCompletedSouth = parseInt(dropsSouth);
      updates.dropsCompletedWest = parseInt(dropsWest);
    }

    updateSessionMutation.mutate(updates);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Work Session Details
            </DialogTitle>
            {hasFinancialPermission && !isEditMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                data-testid="button-edit-session"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Employee</span>
              </div>
              <div className="font-semibold">{employeeName || 'Unknown'}</div>
            </div>

            {projectName && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>Project</span>
                </div>
                <div className="font-semibold">{projectName}</div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <div className="font-semibold">
                {format(new Date(session.workDate), 'MMMM d, yyyy')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Total Hours</span>
              </div>
              <div className="font-semibold text-primary">{totalHours} hrs</div>
            </div>
          </div>

          {/* Billable Toggle (in edit mode) */}
          {isEditMode && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <Label htmlFor="billable-toggle" className="cursor-pointer">
                Billable Work Session
              </Label>
              <Switch
                id="billable-toggle"
                checked={isBillable}
                onCheckedChange={setIsBillable}
                data-testid="switch-billable"
              />
            </div>
          )}

          {/* Time Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <Label className="text-sm text-muted-foreground mb-1">Start Time</Label>
              {isEditMode ? (
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  data-testid="input-start-time"
                  className="mt-1"
                />
              ) : (
                <div className="font-mono text-lg">
                  {format(new Date(session.startTime), 'h:mm a')}
                </div>
              )}
              {hasStartLocation && !isEditMode && (
                <div className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
                  <MapPin className="w-3 h-3 mt-0.5 text-green-600" />
                  <span>
                    {parseFloat(session.startLatitude).toFixed(6)}, {parseFloat(session.startLongitude).toFixed(6)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-1">End Time</Label>
              {isEditMode ? (
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  data-testid="input-end-time"
                  className="mt-1"
                />
              ) : session.endTime ? (
                <>
                  <div className="font-mono text-lg">
                    {format(new Date(session.endTime), 'h:mm a')}
                  </div>
                  {hasEndLocation && (
                    <div className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 text-red-600" />
                      <span>
                        {parseFloat(session.endLatitude).toFixed(6)}, {parseFloat(session.endLongitude).toFixed(6)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Ongoing</div>
              )}
            </div>
          </div>

          {/* Map Display (only in view mode) */}
          {!isEditMode && hasAnyLocation && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location Tracking
              </h3>
              <div className="rounded-lg overflow-hidden border-2 border-border" style={{ height: '400px' }}>
                <MapContainer
                  center={[centerLat, centerLng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {hasStartLocation && (
                    <Marker
                      position={[parseFloat(session.startLatitude), parseFloat(session.startLongitude)]}
                      icon={startIcon}
                    >
                      <Popup>
                        <div className="text-sm">
                          <div className="font-bold text-green-600">Start Location</div>
                          <div className="text-xs mt-1">
                            {format(new Date(session.startTime), 'h:mm a')}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {parseFloat(session.startLatitude).toFixed(6)}, {parseFloat(session.startLongitude).toFixed(6)}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {hasEndLocation && (
                    <Marker
                      position={[parseFloat(session.endLatitude), parseFloat(session.endLongitude)]}
                      icon={endIcon}
                    >
                      <Popup>
                        <div className="text-sm">
                          <div className="font-bold text-red-600">End Location</div>
                          <div className="text-xs mt-1">
                            {format(new Date(session.endTime!), 'h:mm a')}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {parseFloat(session.endLatitude).toFixed(6)}, {parseFloat(session.endLongitude).toFixed(6)}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {linePath.length > 0 && (
                    <Polyline
                      positions={linePath as any}
                      color="#0ea5e9"
                      weight={3}
                      opacity={0.7}
                      dashArray="10, 10"
                    />
                  )}
                </MapContainer>
              </div>
            </div>
          )}

          {!isEditMode && !hasAnyLocation && (
            <div className="p-6 bg-muted rounded-lg text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No location data available for this session</p>
              <p className="text-sm mt-1">Location tracking was not enabled or unavailable</p>
            </div>
          )}

          {/* Work Completed - Hours-Based Projects (General Pressure Washing, Ground Window) */}
          {isHoursBased && (
            <div className="space-y-2">
              <h3 className="font-semibold">Completion Percentage</h3>
              {isEditMode ? (
                <div>
                  <Label>Completion (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={manualPercentage}
                    onChange={(e) => setManualPercentage(e.target.value)}
                    data-testid="input-manual-percentage"
                    className="mt-1"
                  />
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">
                    {session.manualCompletionPercentage || 0}%
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Work Completed - Elevation-Based Projects */}
          {!isHoursBased && session.dropsCompletedNorth !== undefined && (
            <div className="space-y-2">
              <h3 className="font-semibold">
                {isParkade ? "Parking Stalls Completed" : isInSuite ? "Suites Completed" : "Drops Completed"}
              </h3>
              {isEditMode ? (
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <Label>North</Label>
                    <Input
                      type="number"
                      min="0"
                      value={dropsNorth}
                      onChange={(e) => setDropsNorth(e.target.value)}
                      data-testid="input-drops-north"
                    />
                  </div>
                  <div>
                    <Label>East</Label>
                    <Input
                      type="number"
                      min="0"
                      value={dropsEast}
                      onChange={(e) => setDropsEast(e.target.value)}
                      data-testid="input-drops-east"
                    />
                  </div>
                  <div>
                    <Label>South</Label>
                    <Input
                      type="number"
                      min="0"
                      value={dropsSouth}
                      onChange={(e) => setDropsSouth(e.target.value)}
                      data-testid="input-drops-south"
                    />
                  </div>
                  <div>
                    <Label>West</Label>
                    <Input
                      type="number"
                      min="0"
                      value={dropsWest}
                      onChange={(e) => setDropsWest(e.target.value)}
                      data-testid="input-drops-west"
                    />
                  </div>
                </div>
              ) : isParkade || isInSuite ? (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">
                    {session.dropsCompletedNorth || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {isParkade ? "stalls" : "suites"}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  <Badge variant="outline" className="justify-center py-2">
                    North: {session.dropsCompletedNorth || 0}
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    East: {session.dropsCompletedEast || 0}
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    South: {session.dropsSouth || 0}
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    West: {session.dropsCompletedWest || 0}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Shortfall Reason */}
          {!isEditMode && session.shortfallReason && (
            <div className="space-y-2">
              <h3 className="font-semibold">Shortfall Reason</h3>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{session.shortfallReason}</p>
              </div>
            </div>
          )}

          {/* Description (for non-billable) */}
          {!isEditMode && session.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{session.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Mode Footer */}
        {isEditMode && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={updateSessionMutation.isPending}
              data-testid="button-cancel-edit"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateSessionMutation.isPending}
              data-testid="button-save-edit"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateSessionMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

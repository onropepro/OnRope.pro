import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Clock, Calendar, User, FileText } from "lucide-react";
import { format } from "date-fns";

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
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
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
}

export function SessionDetailsDialog({
  open,
  onOpenChange,
  session,
  employeeName,
  projectName,
}: SessionDetailsDialogProps) {
  if (!session) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Work Session Details
          </DialogTitle>
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

          {/* Time Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Start Time</div>
              <div className="font-mono text-lg">
                {format(new Date(session.startTime), 'h:mm a')}
              </div>
              {hasStartLocation && (
                <div className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
                  <MapPin className="w-3 h-3 mt-0.5 text-green-600" />
                  <span>
                    {parseFloat(session.startLatitude).toFixed(6)}, {parseFloat(session.startLongitude).toFixed(6)}
                  </span>
                </div>
              )}
            </div>

            {session.endTime && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">End Time</div>
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
              </div>
            )}
          </div>

          {/* Map Display */}
          {hasAnyLocation ? (
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
          ) : (
            <div className="p-6 bg-muted rounded-lg text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No location data available for this session</p>
              <p className="text-sm mt-1">Location tracking was not enabled or unavailable</p>
            </div>
          )}

          {/* Drop Logs (if applicable) */}
          {session.dropsCompletedNorth !== undefined && (
            <div className="space-y-2">
              <h3 className="font-semibold">Drops Completed</h3>
              <div className="grid grid-cols-4 gap-2">
                <Badge variant="outline" className="justify-center py-2">
                  North: {session.dropsCompletedNorth || 0}
                </Badge>
                <Badge variant="outline" className="justify-center py-2">
                  East: {session.dropsCompletedEast || 0}
                </Badge>
                <Badge variant="outline" className="justify-center py-2">
                  South: {session.dropsCompletedSouth || 0}
                </Badge>
                <Badge variant="outline" className="justify-center py-2">
                  West: {session.dropsCompletedWest || 0}
                </Badge>
              </div>
            </div>
          )}

          {/* Shortfall Reason */}
          {session.shortfallReason && (
            <div className="space-y-2">
              <h3 className="font-semibold">Shortfall Reason</h3>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{session.shortfallReason}</p>
              </div>
            </div>
          )}

          {/* Description (for non-billable) */}
          {session.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{session.description}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

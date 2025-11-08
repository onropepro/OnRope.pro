import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoUnitNumber, setPhotoUnitNumber] = useState("");
  const [photoComment, setPhotoComment] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;

  // Fetch work sessions for this project
  const { data: workSessionsData } = useQuery({
    queryKey: ["/api/projects", id, "work-sessions"],
    enabled: !!id,
  });

  // Fetch residents for this project (management only)
  const { data: residentsData } = useQuery({
    queryKey: ["/api/projects", id, "residents"],
    enabled: !!id && (currentUser?.role === "company" || currentUser?.role === "operations_manager" || currentUser?.role === "supervisor"),
  });

  // Fetch complaints for this project
  const { data: complaintsData } = useQuery({
    queryKey: ["/api/projects", id, "complaints"],
    enabled: !!id,
  });

  // Fetch photos for this project
  const { data: photosData } = useQuery({
    queryKey: ["/api/projects", id, "photos"],
    enabled: !!id,
  });

  // Fetch toolbox meetings for this project
  const { data: toolboxMeetingsData } = useQuery({
    queryKey: ["/api/projects", id, "toolbox-meetings"],
    enabled: !!id,
  });

  const project = projectData?.project as Project | undefined;
  const workSessions = workSessionsData?.sessions || [];
  const residents = residentsData?.residents || [];
  const complaints = complaintsData?.complaints || [];
  const photos = photosData?.photos || [];
  const toolboxMeetings = toolboxMeetingsData?.meetings || [];
  
  // Only company and operations_manager can delete projects
  const canDeleteProject = currentUser?.role === "company" || currentUser?.role === "operations_manager";
  
  // Check if user is management (show pie chart only for management)
  const isManagement = currentUser?.role === "company" || 
                       currentUser?.role === "operations_manager" || 
                       currentUser?.role === "supervisor";

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted successfully" });
      setLocation("/management");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handlePdfUpload = async (file: File) => {
    if (!id) return;
    
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/projects/${id}/rope-access-plan`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload PDF');
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "PDF uploaded successfully" });
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload PDF", 
        variant: "destructive" 
      });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setShowPhotoDialog(true);
  };

  const handlePhotoDialogSubmit = async () => {
    if (!id || !selectedFile) return;
    
    setUploadingImage(true);
    setShowPhotoDialog(false);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('unitNumber', photoUnitNumber);
      formData.append('comment', photoComment);
      
      const response = await fetch(`/api/projects/${id}/images`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload image');
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      toast({ title: "Photo uploaded successfully" });
      
      // Reset form
      setSelectedFile(null);
      setPhotoUnitNumber("");
      setPhotoComment("");
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload photo", 
        variant: "destructive" 
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePhotoDialogCancel = () => {
    setShowPhotoDialog(false);
    setSelectedFile(null);
    setPhotoUnitNumber("");
    setPhotoComment("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">Project not found</div>
        </div>
      </div>
    );
  }

  // Calculate total drops from elevation-specific fields
  const totalDrops = (project.totalDropsNorth ?? 0) + (project.totalDropsEast ?? 0) + 
                     (project.totalDropsSouth ?? 0) + (project.totalDropsWest ?? 0);

  // Calculate completed drops from work sessions (elevation-specific)
  const completedSessions = workSessions.filter((s: any) => s.endTime !== null);
  
  const completedDropsNorth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedNorth ?? 0), 0);
  const completedDropsEast = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedEast ?? 0), 0);
  const completedDropsSouth = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedSouth ?? 0), 0);
  const completedDropsWest = completedSessions.reduce((sum: number, s: any) => sum + (s.dropsCompletedWest ?? 0), 0);
  
  const completedDrops = completedDropsNorth + completedDropsEast + completedDropsSouth + completedDropsWest;
  
  const progressPercent = totalDrops > 0 
    ? Math.min(100, Math.round((completedDrops / totalDrops) * 100))
    : 0;

  // Calculate target met statistics (sum all elevation drops per session)
  const targetMetCount = completedSessions.filter((s: any) => {
    const totalSessionDrops = (s.dropsCompletedNorth ?? 0) + (s.dropsCompletedEast ?? 0) + 
                              (s.dropsCompletedSouth ?? 0) + (s.dropsCompletedWest ?? 0);
    return totalSessionDrops >= project.dailyDropTarget;
  }).length;
  
  const belowTargetCount = completedSessions.filter((s: any) => {
    const totalSessionDrops = (s.dropsCompletedNorth ?? 0) + (s.dropsCompletedEast ?? 0) + 
                              (s.dropsCompletedSouth ?? 0) + (s.dropsCompletedWest ?? 0);
    return totalSessionDrops < project.dailyDropTarget;
  }).length;
  
  const pieData = [
    { name: "Target Met", value: targetMetCount, color: "hsl(var(--primary))" },
    { name: "Below Target", value: belowTargetCount, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="min-h-screen gradient-bg dot-pattern p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/management")}
            className="h-12 gap-2"
            data-testid="button-back"
          >
            <span className="material-icons">arrow_back</span>
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{project.buildingName}</h1>
            <p className="text-sm text-gray-600">
              {project.strataPlanNumber} - {project.jobType.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="glass-card border-0 shadow-premium">
          <CardContent className="p-6 space-y-6">
            {/* Building Visualization */}
            <HighRiseBuilding
              floors={project.floorCount}
              totalDropsNorth={project.totalDropsNorth ?? Math.floor(project.totalDrops / 4) + (project.totalDrops % 4 > 0 ? 1 : 0)}
              totalDropsEast={project.totalDropsEast ?? Math.floor(project.totalDrops / 4) + (project.totalDrops % 4 > 1 ? 1 : 0)}
              totalDropsSouth={project.totalDropsSouth ?? Math.floor(project.totalDrops / 4) + (project.totalDrops % 4 > 2 ? 1 : 0)}
              totalDropsWest={project.totalDropsWest ?? Math.floor(project.totalDrops / 4)}
              completedDropsNorth={completedDropsNorth}
              completedDropsEast={completedDropsEast}
              completedDropsSouth={completedDropsSouth}
              completedDropsWest={completedDropsWest}
              className="mb-4"
            />

            {/* Progress Stats */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {completedDrops} of {totalDrops} drops completed
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{project.dailyDropTarget}</div>
                <div className="text-sm text-muted-foreground mt-1">Daily Target</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {completedDrops > 0 
                    ? Math.ceil((totalDrops - completedDrops) / project.dailyDropTarget) 
                    : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Days Remaining</div>
              </div>
            </div>

            <Separator />

            {/* PDF Upload/View Section */}
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Fall Protection Plan (PDF)</div>
              {project.ropeAccessPlanUrl ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 gap-2"
                    onClick={() => window.open(project.ropeAccessPlanUrl!, '_blank')}
                    data-testid="button-view-pdf"
                  >
                    <span className="material-icons text-lg">description</span>
                    View Current PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 gap-2"
                    onClick={() => document.getElementById('pdf-upload-input')?.click()}
                    disabled={uploadingPdf}
                    data-testid="button-replace-pdf"
                  >
                    <span className="material-icons text-lg">upload</span>
                    {uploadingPdf ? "Uploading..." : "Replace"}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-12 gap-2"
                  onClick={() => document.getElementById('pdf-upload-input')?.click()}
                  disabled={uploadingPdf}
                  data-testid="button-upload-pdf"
                >
                  <span className="material-icons text-lg">upload</span>
                  {uploadingPdf ? "Uploading..." : "Upload PDF"}
                </Button>
              )}
              <input
                id="pdf-upload-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handlePdfUpload(file);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            <Separator />

            {/* Project Photos Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Project Photos</div>
                <Badge variant="secondary" className="text-xs">
                  {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                </Badge>
              </div>
              
              {/* Image Gallery */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {photos.map((photo: any) => (
                    <div
                      key={photo.id}
                      className="aspect-square rounded-lg overflow-hidden border bg-card hover-elevate group relative"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.comment || `Project photo`}
                        className="w-full h-full object-cover"
                        data-testid={`project-image-${photo.id}`}
                      />
                      {(photo.unitNumber || photo.comment) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                          {photo.unitNumber && (
                            <div className="text-xs font-medium text-white">
                              Unit {photo.unitNumber}
                            </div>
                          )}
                          {photo.comment && (
                            <div className="text-xs text-white/90 line-clamp-2">
                              {photo.comment}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2"
                  onClick={() => document.getElementById('image-camera-input')?.click()}
                  disabled={uploadingImage}
                  data-testid="button-take-photo"
                >
                  <span className="material-icons text-lg">photo_camera</span>
                  {uploadingImage ? "Uploading..." : "Take Photo"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 gap-2"
                  onClick={() => document.getElementById('image-file-input')?.click()}
                  disabled={uploadingImage}
                  data-testid="button-upload-from-library"
                >
                  <span className="material-icons text-lg">photo_library</span>
                  {uploadingImage ? "Uploading..." : "From Library"}
                </Button>
              </div>
              
              {/* Camera input (mobile-first) */}
              <input
                id="image-camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelected(file);
                    e.target.value = '';
                  }
                }}
              />
              
              {/* File picker input */}
              <input
                id="image-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelected(file);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            <Separator />

            {/* Toolbox Meetings Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Toolbox Meetings</div>
                <Badge variant="secondary" className="text-xs">
                  {toolboxMeetings.length} {toolboxMeetings.length === 1 ? 'meeting' : 'meetings'}
                </Badge>
              </div>

              {/* Meeting List */}
              {toolboxMeetings.length > 0 && (
                <div className="space-y-2 mb-3">
                  {toolboxMeetings.slice(0, 3).map((meeting: any) => (
                    <Card
                      key={meeting.id}
                      className="hover-elevate cursor-pointer"
                      onClick={() => setSelectedMeeting(meeting)}
                      data-testid={`toolbox-meeting-${meeting.id}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              {format(new Date(meeting.meetingDate), 'MMMM d, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Conducted by: {meeting.conductedByName}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {meeting.attendees?.length || 0} attendees
                          </Badge>
                        </div>
                        {meeting.customTopic && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Custom: {meeting.customTopic}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Create Toolbox Meeting Button */}
              <Button
                variant="default"
                className="w-full h-12 gap-2"
                onClick={() => setLocation("/toolbox-meeting")}
                data-testid="button-create-toolbox-meeting"
              >
                <span className="material-icons text-lg">assignment</span>
                Conduct Toolbox Meeting
              </Button>
            </div>

            <Separator />

            {/* Resident Feedback Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Resident Feedback</div>
                <Badge variant="secondary" className="text-xs">
                  {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'}
                </Badge>
              </div>
              
              {complaints.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm border rounded-lg">
                  No feedback received yet
                </div>
              ) : (
                <div className="space-y-2">
                  {complaints.map((complaint: any) => {
                    const status = complaint.status;
                    const isViewed = complaint.viewedAt !== null;
                    
                    let statusBadge;
                    if (status === 'closed') {
                      statusBadge = <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 text-xs">Closed</Badge>;
                    } else if (isViewed) {
                      statusBadge = <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs">Viewed</Badge>;
                    } else {
                      statusBadge = <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 text-xs">New</Badge>;
                    }
                    
                    return (
                      <Card 
                        key={complaint.id}
                        className="hover-elevate cursor-pointer"
                        onClick={() => setLocation(`/complaints/${complaint.id}`)}
                        data-testid={`complaint-card-${complaint.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{complaint.residentName}</div>
                              <div className="text-xs text-muted-foreground">Unit {complaint.unitNumber}</div>
                            </div>
                            {statusBadge}
                          </div>
                          <p className="text-sm line-clamp-2 mb-2">{complaint.message}</p>
                          <div className="text-xs text-muted-foreground">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            <Separator />

            {/* Status & Actions */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Status</div>
                <Badge variant={project.status === "active" ? "default" : "secondary"} className="capitalize">
                  {project.status}
                </Badge>
              </div>

              {canDeleteProject && (
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full h-12"
                  data-testid="button-delete-project"
                >
                  <span className="material-icons mr-2">delete</span>
                  Delete Project
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Target Performance Chart - Management Only */}
        {isManagement && completedSessions.length > 0 && (
          <Card className="glass-card border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Target Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{targetMetCount}</div>
                    <div className="text-sm text-muted-foreground">Target Met</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{belowTargetCount}</div>
                    <div className="text-sm text-muted-foreground">Below Target</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Residents List - Management Only */}
        {isManagement && (
          <Card className="glass-card border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Residents linked to project {project?.strataPlanNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              {residents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No residents linked to this project
                </p>
              ) : (
                <div className="space-y-3">
                  {residents.map((resident: any) => (
                    <div
                      key={resident.id}
                      className="p-4 rounded-lg border bg-card"
                      data-testid={`resident-${resident.id}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-lg text-muted-foreground">person</span>
                          <p className="font-medium">{resident.name}</p>
                        </div>
                        {resident.unitNumber && (
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-lg text-muted-foreground">home</span>
                            <p className="text-sm text-muted-foreground">Unit {resident.unitNumber}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-lg text-muted-foreground">email</span>
                          <p className="text-sm text-muted-foreground">{resident.email}</p>
                        </div>
                        {resident.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-lg text-muted-foreground">phone</span>
                            <p className="text-sm text-muted-foreground">{resident.phoneNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Work Sessions List */}
        <Card className="glass-card border-0 shadow-premium">
          <CardHeader>
            <CardTitle>Work Session History</CardTitle>
          </CardHeader>
          <CardContent>
            {workSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No work sessions recorded yet
              </p>
            ) : (
              <div className="space-y-3">
                {workSessions.map((session: any) => {
                  const sessionDate = new Date(session.workDate);
                  const isCompleted = session.endTime !== null;
                  const sessionDrops = (session.dropsCompletedNorth ?? 0) + (session.dropsCompletedEast ?? 0) + 
                                       (session.dropsCompletedSouth ?? 0) + (session.dropsCompletedWest ?? 0);
                  const metTarget = sessionDrops >= project.dailyDropTarget;

                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover-elevate"
                      data-testid={`session-${session.id}`}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {format(sessionDate, "EEEE, MMM d, yyyy")}
                          </p>
                          {isCompleted ? (
                            <Badge variant={metTarget ? "default" : "destructive"} data-testid={`badge-${metTarget ? "met" : "below"}-target`}>
                              {metTarget ? "Target Met" : "Below Target"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">In Progress</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tech: {session.techName || "Unknown"}
                        </p>
                        {isCompleted && (
                          <>
                            <p className="text-sm">
                              Drops: {sessionDrops} / {project.dailyDropTarget} target
                            </p>
                            {session.shortfallReason && (
                              <p className="text-sm text-muted-foreground italic">
                                Note: {session.shortfallReason}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {isCompleted && (
                          <p>
                            {format(new Date(session.startTime), "h:mm a")} -{" "}
                            {format(new Date(session.endTime), "h:mm a")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This will permanently remove all associated work sessions, drop logs, and complaints. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-project">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProjectMutation.mutate(project.id)}
              data-testid="button-confirm-delete-project"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Photo Upload Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={(open) => !open && handlePhotoDialogCancel()}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-photo-upload">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>
              Add unit number and comment to help residents identify their work.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unitNumber">Unit Number (Optional)</Label>
              <Input
                id="unitNumber"
                placeholder="e.g., 301, 1205"
                value={photoUnitNumber}
                onChange={(e) => setPhotoUnitNumber(e.target.value)}
                data-testid="input-unit-number"
              />
              <p className="text-xs text-muted-foreground">
                Enter the unit number if this photo is specific to a resident's suite.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="e.g., Before cleaning, After cleaning, Window detail"
                value={photoComment}
                onChange={(e) => setPhotoComment(e.target.value)}
                rows={3}
                data-testid="input-photo-comment"
              />
              <p className="text-xs text-muted-foreground">
                Add a description or note about this photo.
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePhotoDialogCancel}
              data-testid="button-cancel-upload"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePhotoDialogSubmit}
              disabled={!selectedFile}
              data-testid="button-submit-upload"
            >
              Upload Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toolbox Meeting Details Dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">assignment</span>
              Toolbox Meeting Details
            </DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Date</div>
                  <div className="text-base">
                    {format(new Date(selectedMeeting.meetingDate), 'EEEE, MMMM d, yyyy')}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Conducted By</div>
                  <div className="text-base">{selectedMeeting.conductedByName}</div>
                </div>
              </div>

              {selectedMeeting.customTopic && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Custom Topic</div>
                  <div className="text-base bg-muted p-3 rounded-md">
                    {selectedMeeting.customTopic}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Topics Covered</div>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.topicFallProtection && <Badge>Fall Protection Systems</Badge>}
                  {selectedMeeting.topicAnchorPoints && <Badge>Anchor Point Selection</Badge>}
                  {selectedMeeting.topicRopeInspection && <Badge>Rope Inspection</Badge>}
                  {selectedMeeting.topicKnotTying && <Badge>Knot Tying Techniques</Badge>}
                  {selectedMeeting.topicPPECheck && <Badge>PPE Inspection</Badge>}
                  {selectedMeeting.topicWeatherConditions && <Badge>Weather Assessment</Badge>}
                  {selectedMeeting.topicCommunication && <Badge>Communication Protocols</Badge>}
                  {selectedMeeting.topicEmergencyEvacuation && <Badge>Emergency Procedures</Badge>}
                  {selectedMeeting.topicHazardAssessment && <Badge>Hazard Assessment</Badge>}
                  {selectedMeeting.topicLoadCalculations && <Badge>Load Calculations</Badge>}
                  {selectedMeeting.topicEquipmentCompatibility && <Badge>Equipment Compatibility</Badge>}
                  {selectedMeeting.topicDescenderAscender && <Badge>Descender/Ascender Use</Badge>}
                  {selectedMeeting.topicEdgeProtection && <Badge>Edge Protection</Badge>}
                  {selectedMeeting.topicSwingFall && <Badge>Swing Fall Hazards</Badge>}
                  {selectedMeeting.topicMedicalFitness && <Badge>Medical Fitness</Badge>}
                  {selectedMeeting.topicToolDropPrevention && <Badge>Tool Drop Prevention</Badge>}
                  {selectedMeeting.topicRegulations && <Badge>Working at Heights Regulations</Badge>}
                  {selectedMeeting.topicRescueProcedures && <Badge>Rescue Procedures</Badge>}
                  {selectedMeeting.topicSiteHazards && <Badge>Site-Specific Hazards</Badge>}
                  {selectedMeeting.topicBuddySystem && <Badge>Buddy System</Badge>}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Attendees ({selectedMeeting.attendees?.length || 0})
                </div>
                <div className="bg-muted p-3 rounded-md">
                  {selectedMeeting.attendees?.map((attendee: string, idx: number) => (
                    <div key={idx} className="py-1">
                      {idx + 1}. {attendee}
                    </div>
                  ))}
                </div>
              </div>

              {selectedMeeting.additionalNotes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Additional Notes</div>
                  <div className="text-base bg-muted p-3 rounded-md">
                    {selectedMeeting.additionalNotes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

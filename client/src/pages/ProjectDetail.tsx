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

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  // Fetch work sessions for this project
  const { data: workSessionsData } = useQuery({
    queryKey: ["/api/projects", id, "work-sessions"],
    enabled: !!id,
  });

  const project = projectData?.project as Project | undefined;
  const currentUser = userData?.user;
  const workSessions = workSessionsData?.sessions || [];
  
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

  const handleImageUpload = async (file: File) => {
    if (!id) return;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/projects/${id}/images`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload image');
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload image", 
        variant: "destructive" 
      });
    } finally {
      setUploadingImage(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
        <Card>
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
              <div className="text-sm text-muted-foreground">Project Photos</div>
              
              {/* Image Gallery */}
              {project.imageUrls && project.imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {project.imageUrls.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden border"
                    >
                      <img
                        src={imageUrl}
                        alt={`Project photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        data-testid={`project-image-${index}`}
                      />
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
                    handleImageUpload(file);
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
                    handleImageUpload(file);
                    e.target.value = '';
                  }
                }}
              />
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
          <Card>
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

        {/* Work Sessions List */}
        <Card>
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
    </div>
  );
}

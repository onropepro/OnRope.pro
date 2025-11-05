import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  const project = projectData?.project as Project | undefined;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-900">Project Details</h1>
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
              completedDrops={project.completedDrops || 0}
              totalDrops={project.totalDrops}
              className="mb-4"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{project.dailyDropTarget}</div>
                <div className="text-sm text-muted-foreground mt-1">Daily Target</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {project.completedDrops && project.completedDrops > 0 
                    ? Math.ceil((project.totalDrops - project.completedDrops) / project.dailyDropTarget) 
                    : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Days Remaining</div>
              </div>
            </div>

            <Separator />

            {/* Work Session History Button */}
            <Button
              variant="outline"
              className="w-full h-12 gap-2"
              onClick={() => setLocation(`/projects/${project.id}/work-sessions`)}
              data-testid="button-view-work-sessions"
            >
              <span className="material-icons text-lg">history</span>
              View Work Session History
            </Button>

            <Separator />

            {/* Status & Actions */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Status</div>
                <Badge variant={project.status === "active" ? "default" : "secondary"} className="capitalize">
                  {project.status}
                </Badge>
              </div>

              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
                className="w-full h-12"
                data-testid="button-delete-project"
              >
                <span className="material-icons mr-2">delete</span>
                Delete Project
              </Button>
            </div>
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

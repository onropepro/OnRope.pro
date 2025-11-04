import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const complaintSchema = z.object({
  residentName: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  message: z.string().min(10, "Please provide details about your concern"),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export default function ResidentDashboard() {
  const [activeTab, setActiveTab] = useState("building");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch projects (resident's building)
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Fetch progress for the project
  const project = projectsData?.projects?.[0];
  
  const { data: progressData } = useQuery({
    queryKey: ["/api/projects", project?.id, "progress"],
    enabled: !!project?.id,
  });

  const projectData = {
    strataPlanNumber: project?.strataPlanNumber || "",
    jobType: project?.jobType?.replace(/_/g, ' ') || "Window Cleaning",
    floorCount: project?.floorCount || 24,
    totalDrops: project?.totalDrops || 0,
    completedDrops: progressData?.completedDrops || 0,
    dailyDropTarget: project?.dailyDropTarget || 20,
    progressPercentage: progressData?.progressPercentage || 0,
  };

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      residentName: "",
      phoneNumber: "",
      unitNumber: "",
      message: "",
    },
  });

  const submitComplaintMutation = useMutation({
    mutationFn: async (data: ComplaintFormData) => {
      if (!project?.id) {
        throw new Error("Project not found");
      }

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          projectId: project.id,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit feedback");
      }

      return response.json();
    },
    onSuccess: () => {
      form.reset();
      toast({ title: "Feedback submitted successfully" });
      setActiveTab("building");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = async (data: ComplaintFormData) => {
    submitComplaintMutation.mutate(data);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setLocation("/");
    } catch (error) {
      toast({ title: "Error", description: "Failed to logout", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-8">
            <span className="material-icons text-6xl text-muted-foreground mb-4">apartment</span>
            <h2 className="text-xl font-bold mb-2">No Building Found</h2>
            <p className="text-muted-foreground">
              No active project found for your strata plan number.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-card-border shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold">Building Progress</h1>
          <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-logout" onClick={handleLogout}>
            <span className="material-icons">logout</span>
          </Button>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Building Info Card */}
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle data-testid="text-strata-number">{projectData.strataPlanNumber}</CardTitle>
                <CardDescription className="mt-1 capitalize">{projectData.jobType}</CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {projectData.floorCount} Floors
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="building" data-testid="tab-building">Progress</TabsTrigger>
            <TabsTrigger value="complaints" data-testid="tab-complaints">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="building">
            <Card>
              <CardContent className="pt-6">
                <HighRiseBuilding
                  floors={projectData.floorCount}
                  completedDrops={projectData.completedDrops}
                  totalDrops={projectData.totalDrops}
                  className="mb-6"
                />

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{projectData.dailyDropTarget}</div>
                    <div className="text-xs text-muted-foreground mt-1">Daily Target</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {projectData.completedDrops > 0 ? Math.ceil((projectData.totalDrops - projectData.completedDrops) / projectData.dailyDropTarget) : "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Days Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
                <CardDescription>Let us know if you have any concerns or questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="residentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-resident-name" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} data-testid="input-phone" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unitNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Number *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-unit" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Please describe your concern or question..."
                              data-testid="input-message"
                              className="min-h-32 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full h-12" data-testid="button-submit-complaint">
                      Submit Feedback
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

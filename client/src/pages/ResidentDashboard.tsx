import { useState, useEffect } from "react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const complaintSchema = z.object({
  residentName: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  message: z.string().min(10, "Please provide details about your concern"),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export default function ResidentDashboard() {
  const [activeTab, setActiveTab] = useState("building");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch current user
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;

  // Fetch projects (resident's building) with auto-refresh for real-time progress
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["/api/projects"],
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true,
  });

  // Separate active and completed projects
  const allProjects = projectsData?.projects || [];
  const activeProjects = allProjects.filter((p: any) => p.status === 'active');
  const completedProjects = allProjects.filter((p: any) => p.status === 'completed');
  const activeProject = activeProjects[0];
  
  const { data: progressData } = useQuery({
    queryKey: ["/api/projects", activeProject?.id, "progress"],
    enabled: !!activeProject?.id,
  });

  // Fetch company information for active project
  const { data: companyData } = useQuery({
    queryKey: ["/api/companies", activeProject?.companyId],
    enabled: !!activeProject?.companyId,
  });

  // Fetch resident's complaints
  const { data: complaintsData } = useQuery({
    queryKey: ["/api/complaints"],
    refetchInterval: 10000, // Refetch every 10 seconds for status updates
  });

  const projectData = {
    strataPlanNumber: activeProject?.strataPlanNumber || "",
    jobType: activeProject?.jobType?.replace(/_/g, ' ') || "Window Cleaning",
    floorCount: activeProject?.floorCount || 24,
    totalDrops: progressData?.totalDrops || activeProject?.totalDrops || 0,
    completedDrops: progressData?.completedDrops || 0,
    totalDropsNorth: progressData?.totalDropsNorth,
    totalDropsEast: progressData?.totalDropsEast,
    totalDropsSouth: progressData?.totalDropsSouth,
    totalDropsWest: progressData?.totalDropsWest,
    completedDropsNorth: progressData?.completedDropsNorth,
    completedDropsEast: progressData?.completedDropsEast,
    completedDropsSouth: progressData?.completedDropsSouth,
    completedDropsWest: progressData?.completedDropsWest,
    dailyDropTarget: activeProject?.dailyDropTarget || 20,
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

  // Update form values when user data loads
  useEffect(() => {
    if (currentUser) {
      form.setValue("residentName", currentUser.name || "");
      form.setValue("unitNumber", currentUser.unitNumber || "");
      form.setValue("phoneNumber", currentUser.phoneNumber || "");
    }
  }, [currentUser, form]);

  const submitComplaintMutation = useMutation({
    mutationFn: async (data: ComplaintFormData) => {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          projectId: activeProject?.id || null, // Allow null for general messages
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit message");
      }

      return response.json();
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      toast({ title: "Message submitted successfully" });
      setActiveTab("history");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = async (data: ComplaintFormData) => {
    submitComplaintMutation.mutate(data);
  };

  const confirmLogout = async () => {
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

  if (!activeProject && completedProjects.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <span className="material-icons text-2xl text-primary">apartment</span>
            <h1 className="text-xl font-semibold">Resident Portal</h1>
          </div>
          <Button variant="ghost" onClick={() => setShowLogoutDialog(true)} data-testid="button-logout">
            <span className="material-icons">logout</span>
          </Button>
        </header>

        <main className="flex-1 p-4 space-y-4">
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-6 text-center">
              <span className="material-icons text-6xl text-muted-foreground mb-3">info</span>
              <h2 className="text-xl font-bold mb-2">No Work Scheduled</h2>
              <p className="text-muted-foreground text-sm">
                No maintenance work has been scheduled for your building yet.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Have a question or concern? Send us a message and we'll get back to you.
              </CardDescription>
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
                            placeholder="Type your message here..."
                            data-testid="input-message" 
                            className="min-h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={submitComplaintMutation.isPending}
                    data-testid="button-submit-message"
                  >
                    {submitComplaintMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // If no active project but has completed projects, show message form with different message
  if (!activeProject && completedProjects.length > 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <span className="material-icons text-2xl text-primary">apartment</span>
            <h1 className="text-xl font-semibold">Resident Portal</h1>
          </div>
          <Button variant="ghost" onClick={() => setShowLogoutDialog(true)} data-testid="button-logout">
            <span className="material-icons">logout</span>
          </Button>
        </header>

        <main className="flex-1 p-4 space-y-4">
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-6 text-center">
              <span className="material-icons text-6xl text-green-600 mb-3">check_circle</span>
              <h2 className="text-xl font-bold mb-2">Work Completed</h2>
              <p className="text-muted-foreground text-sm">
                All scheduled maintenance for your building has been completed.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Have a question or concern? Send us a message and we'll get back to you.
              </CardDescription>
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
                            placeholder="Type your message here..."
                            data-testid="input-message" 
                            className="min-h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={submitComplaintMutation.isPending}
                    data-testid="button-submit-message"
                  >
                    {submitComplaintMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen gradient-bg dot-pattern pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] glass-card border-0 shadow-premium">
        <div className="px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">
              Building Progress{activeProject?.buildingName ? ` for ${activeProject.buildingName}` : ''}
            </h1>
            {companyData?.company?.companyName && (
              <p className="text-xs text-muted-foreground">
                {projectData.jobType} by {companyData.company.companyName}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-profile" onClick={() => setLocation("/profile")}>
              <span className="material-icons">person</span>
            </Button>
            <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-logout" onClick={() => setShowLogoutDialog(true)}>
              <span className="material-icons">logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Building Info Card */}
        <Card className="glass-card border-0 shadow-premium mb-4">
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
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="building" data-testid="tab-building">Progress</TabsTrigger>
            <TabsTrigger value="submit" data-testid="tab-submit">Submit</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">My Complaints</TabsTrigger>
          </TabsList>

          <TabsContent value="building">
            <Card className="glass-card border-0 shadow-premium">
              <CardContent className="pt-6">
                <HighRiseBuilding
                  floors={projectData.floorCount}
                  totalDropsNorth={projectData.totalDropsNorth ?? Math.floor(projectData.totalDrops / 4) + (projectData.totalDrops % 4 > 0 ? 1 : 0)}
                  totalDropsEast={projectData.totalDropsEast ?? Math.floor(projectData.totalDrops / 4) + (projectData.totalDrops % 4 > 1 ? 1 : 0)}
                  totalDropsSouth={projectData.totalDropsSouth ?? Math.floor(projectData.totalDrops / 4) + (projectData.totalDrops % 4 > 2 ? 1 : 0)}
                  totalDropsWest={projectData.totalDropsWest ?? Math.floor(projectData.totalDrops / 4)}
                  completedDropsNorth={projectData.completedDropsNorth ?? Math.floor(projectData.completedDrops / 4) + (projectData.completedDrops % 4 > 0 ? 1 : 0)}
                  completedDropsEast={projectData.completedDropsEast ?? Math.floor(projectData.completedDrops / 4) + (projectData.completedDrops % 4 > 1 ? 1 : 0)}
                  completedDropsSouth={projectData.completedDropsSouth ?? Math.floor(projectData.completedDrops / 4) + (projectData.completedDrops % 4 > 2 ? 1 : 0)}
                  completedDropsWest={projectData.completedDropsWest ?? Math.floor(projectData.completedDrops / 4)}
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

          <TabsContent value="submit">
            <Card className="glass-card border-0 shadow-premium">
              <CardHeader>
                <CardTitle>Submit Feedback/Comments/Request</CardTitle>
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

          <TabsContent value="history">
            <Card className="glass-card border-0 shadow-premium">
              <CardHeader>
                <CardTitle>My Complaint History</CardTitle>
                <CardDescription>View the status of your submitted feedback</CardDescription>
              </CardHeader>
              <CardContent>
                {!complaintsData?.complaints || complaintsData.complaints.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-icons text-6xl text-muted-foreground mb-3">feedback</span>
                    <p className="text-muted-foreground">No complaints submitted yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaintsData.complaints.map((complaint: any) => {
                      const status = complaint.status;
                      const isViewed = complaint.viewedAt !== null;
                      
                      let statusBadge;
                      let statusIcon;
                      if (status === 'closed') {
                        statusBadge = <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">Closed</Badge>;
                        statusIcon = <span className="material-icons text-green-600">check_circle</span>;
                      } else if (isViewed) {
                        statusBadge = <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">Viewed</Badge>;
                        statusIcon = <span className="material-icons text-blue-600">visibility</span>;
                      } else {
                        statusBadge = <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">Open</Badge>;
                        statusIcon = <span className="material-icons text-orange-600">pending</span>;
                      }
                      
                      return (
                        <div
                          key={complaint.id}
                          className="p-4 rounded-lg border bg-card space-y-3"
                          data-testid={`complaint-${complaint.id}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2 flex-1">
                              {statusIcon}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {complaint.message}
                                </p>
                              </div>
                            </div>
                            {statusBadge}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Unit {complaint.unitNumber}</span>
                            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-logout">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} data-testid="button-confirm-logout">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

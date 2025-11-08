import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
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
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
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
      const formData = new FormData();
      formData.append("residentName", data.residentName);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("unitNumber", data.unitNumber);
      formData.append("message", data.message);
      formData.append("projectId", activeProject?.id || "");
      
      if (selectedPhoto) {
        formData.append("photo", selectedPhoto);
      }
      
      const response = await fetch("/api/complaints", {
        method: "POST",
        body: formData,
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
      setSelectedPhoto(null);
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
  
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "Error", description: "Image size must be less than 10MB", variant: "destructive" });
        return;
      }
      setSelectedPhoto(file);
    }
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

                  <div>
                    <label className="text-sm font-medium mb-2 block">Attach Photo (Optional)</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      data-testid="input-complaint-photo"
                      className="h-12"
                    />
                    {selectedPhoto && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected: {selectedPhoto.name}
                      </p>
                    )}
                  </div>

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

                  <div>
                    <label className="text-sm font-medium mb-2 block">Attach Photo (Optional)</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      data-testid="input-complaint-photo"
                      className="h-12"
                    />
                    {selectedPhoto && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected: {selectedPhoto.name}
                      </p>
                    )}
                  </div>

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Modern Header */}
      <header className="sticky top-0 z-[100] bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-lg">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <span className="material-icons text-white text-2xl">domain</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight" data-testid="text-strata-number">
                  {projectData.strataPlanNumber}
                </h1>
                <p className="text-sm text-muted-foreground capitalize">
                  {projectData.jobType}
                  {companyData?.company?.companyName && ` • ${companyData.company.companyName}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-base px-4 py-2">
                <span className="material-icons text-sm mr-1.5">layers</span>
                {projectData.floorCount} Floors
              </Badge>
              <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-profile" onClick={() => setLocation("/profile")}>
                <span className="material-icons">person</span>
              </Button>
              <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-logout" onClick={() => setShowLogoutDialog(true)}>
                <span className="material-icons">logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <div className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="building" data-testid="tab-building">Progress</TabsTrigger>
            <TabsTrigger value="submit" data-testid="tab-submit">Submit</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">Complaints</TabsTrigger>
          </TabsList>

          <TabsContent value="building" className="mt-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6 sm:p-8">
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
                className="mb-8"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-1">{projectData.dailyDropTarget}</div>
                  <div className="text-sm text-muted-foreground">Daily Target</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {projectData.completedDrops > 0 ? Math.ceil((projectData.totalDrops - projectData.completedDrops) / projectData.dailyDropTarget) : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">Days Remaining</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{projectData.completedDrops}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-500/20">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{projectData.totalDrops - projectData.completedDrops}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="submit" className="mt-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Submit Feedback</h2>
                <p className="text-muted-foreground">Let us know if you have any concerns or questions about the work</p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

                    <div>
                      <label className="text-sm font-medium mb-2 block">Attach Photo (Optional)</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        data-testid="input-complaint-photo"
                        className="h-12"
                      />
                      {selectedPhoto && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Selected: {selectedPhoto.name}
                        </p>
                      )}
                    </div>

                  <Button type="submit" className="w-full h-12" data-testid="button-submit-complaint">
                    Submit Feedback
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">My Complaint History</h2>
                <p className="text-muted-foreground">View the status of your submitted feedback</p>
              </div>
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
                        <Link
                          key={complaint.id}
                          href={`/complaints/${complaint.id}`}
                        >
                          <div
                            className="p-4 rounded-lg border bg-card space-y-3 hover-elevate active-elevate-2 cursor-pointer"
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
                        </Link>
                      );
                    })}
                  </div>
                )}
            </div>
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

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { ParkadeView } from "@/components/ParkadeView";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { isReadOnly } from "@/lib/permissions";

const complaintSchema = z.object({
  residentName: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  message: z.string().optional(),
  projectId: z.string().optional(),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export default function ResidentDashboard() {
  const [activeTab, setActiveTab] = useState("building");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [lastPhotoViewTime, setLastPhotoViewTime] = useState<number>(() => {
    const stored = localStorage.getItem('lastPhotoViewTime');
    return stored ? parseInt(stored) : 0;
  });
  const [lastComplaintsViewTime, setLastComplaintsViewTime] = useState<number>(() => {
    const stored = localStorage.getItem('lastComplaintsViewTime');
    return stored ? parseInt(stored) : 0;
  });
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch current user
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;

  // Fetch projects (resident's building)
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Separate active and completed projects
  const allProjects = projectsData?.projects || [];
  const activeProjects = allProjects.filter((p: any) => p.status === 'active');
  const completedProjects = allProjects.filter((p: any) => p.status === 'completed');
  
  // Select active project: use selectedProjectId if set, otherwise first active project
  const activeProject = selectedProjectId 
    ? activeProjects.find((p: any) => p.id.toString() === selectedProjectId) 
    : activeProjects[0];
  
  // Auto-select first project on load if not already selected
  useEffect(() => {
    if (!selectedProjectId && activeProjects.length > 0) {
      setSelectedProjectId(activeProjects[0].id.toString());
    }
  }, [activeProjects, selectedProjectId]);
  
  const { data: progressData } = useQuery({
    queryKey: ["/api/projects", activeProject?.id, "progress"],
    enabled: !!activeProject?.id,
  });

  // Fetch company information for active project
  const { data: companyData } = useQuery({
    queryKey: ["/api/companies", activeProject?.companyId],
    enabled: !!activeProject?.companyId,
  });

  // Fetch company branding for white label support
  const { data: brandingData } = useQuery({
    queryKey: ["/api/company", activeProject?.companyId, "branding"],
    enabled: !!activeProject?.companyId,
  });

  const branding = brandingData || {};
  const hasCustomBranding = !!(branding.logoUrl || branding.primaryColor || branding.secondaryColor);

  // Fetch resident's complaints
  const { data: complaintsData } = useQuery({
    queryKey: ["/api/complaints"],
  });

  // Fetch photos tagged with resident's unit number
  const { data: unitPhotosData } = useQuery({
    queryKey: ["/api/my-unit-photos"],
    enabled: !!currentUser?.unitNumber,
  });

  // Calculate new photos count
  const newPhotosCount = unitPhotosData?.photos?.filter((photo: any) => {
    const photoTime = new Date(photo.createdAt).getTime();
    return photoTime > lastPhotoViewTime;
  }).length || 0;

  // Calculate complaints with new responses (notes visible to resident created after last view)
  const newResponsesCount = complaintsData?.complaints?.filter((complaint: any) => {
    // Check if complaint has any notes visible to resident
    if (!complaint.notes || complaint.notes.length === 0) return false;
    
    // Check if any visible-to-resident notes were created after last view time
    return complaint.notes.some((note: any) => {
      if (!note.visibleToResident) return false;
      const noteTime = new Date(note.createdAt).getTime();
      return noteTime > lastComplaintsViewTime;
    });
  }).length || 0;

  // Mark photos as viewed when user opens the tab
  const handlePhotoTabOpen = () => {
    const now = Date.now();
    setLastPhotoViewTime(now);
    localStorage.setItem('lastPhotoViewTime', now.toString());
  };

  // Mark complaints as viewed when user opens the tab
  const handleComplaintsTabOpen = () => {
    const now = Date.now();
    setLastComplaintsViewTime(now);
    localStorage.setItem('lastComplaintsViewTime', now.toString());
  };


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
    dailyDropTarget: activeProject?.dailyDropTarget || activeProject?.stallsPerDay || 20,
    progressPercentage: progressData?.progressPercentage || 0,
    totalStalls: progressData?.totalStalls || activeProject?.totalStalls || 0,
    completedStalls: progressData?.completedStalls || 0,
  };

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      residentName: "",
      phoneNumber: "",
      unitNumber: "",
      message: "",
      projectId: "",
    },
  });

  // Update form values when user data loads or when active/completed projects change
  useEffect(() => {
    if (currentUser) {
      form.setValue("residentName", currentUser.name || "");
      form.setValue("unitNumber", currentUser.unitNumber || "");
      form.setValue("phoneNumber", currentUser.phoneNumber || "");
    }
    
    // Auto-select project if there's only one project (active or completed)
    if (!form.getValues("projectId")) {
      if (activeProjects.length === 1) {
        form.setValue("projectId", activeProjects[0].id.toString());
      } else if (activeProjects.length === 0 && completedProjects.length === 1) {
        form.setValue("projectId", completedProjects[0].id.toString());
      }
    }
  }, [currentUser, form, activeProjects, completedProjects]);

  const submitComplaintMutation = useMutation({
    mutationFn: async (data: ComplaintFormData) => {
      const formData = new FormData();
      formData.append("residentName", data.residentName);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("unitNumber", data.unitNumber);
      formData.append("message", data.message);
      
      // Only append projectId if it's provided
      if (data.projectId) {
        formData.append("projectId", data.projectId);
      }
      
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
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      // Clear local storage
      localStorage.clear();
      
      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      toast({ title: "Error", description: "Failed to logout", variant: "destructive" });
      setShowLogoutDialog(false);
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
        <header 
          className="flex items-center justify-between p-4 border-b"
          style={hasCustomBranding && branding.primaryColor ? { borderColor: `${branding.primaryColor}20` } : {}}
        >
          <div className="flex items-center gap-3">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt={branding.companyName || 'Company logo'} 
                className="w-8 h-8 object-contain"
                data-testid="img-company-logo"
              />
            ) : (
              <span className="material-icons text-2xl text-primary">apartment</span>
            )}
            <h1 
              className="text-xl font-semibold"
              style={hasCustomBranding && branding.primaryColor ? { color: branding.primaryColor } : {}}
            >
              {branding.companyName || 'Resident Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-2">

            <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")} data-testid="button-profile">
              <span className="material-icons">person</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={confirmLogout} data-testid="button-logout">
              <span className="material-icons">logout</span>
            </Button>
          </div>
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

          {/* Company Code Linking */}
          {!currentUser?.companyId ? (
            <LinkCompanyCodeCard />
          ) : (
            <CompanyLinkedCard companyId={currentUser.companyId} />
          )}

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
                        <FormLabel>Message</FormLabel>
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
        <header 
          className="flex items-center justify-between p-4 border-b"
          style={hasCustomBranding && branding.primaryColor ? { borderColor: `${branding.primaryColor}20` } : {}}
        >
          <div className="flex items-center gap-3">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt={branding.companyName || 'Company logo'} 
                className="w-8 h-8 object-contain"
                data-testid="img-company-logo"
              />
            ) : (
              <span className="material-icons text-2xl text-primary">apartment</span>
            )}
            <h1 
              className="text-xl font-semibold"
              style={hasCustomBranding && branding.primaryColor ? { color: branding.primaryColor } : {}}
            >
              {branding.companyName || 'Resident Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-2">

            <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")} data-testid="button-profile">
              <span className="material-icons">person</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={confirmLogout} data-testid="button-logout">
              <span className="material-icons">logout</span>
            </Button>
          </div>
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

                  {completedProjects.length > 1 && (
                    <FormField
                      control={form.control}
                      name="projectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which Project? *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-project" className="h-12">
                                <SelectValue placeholder="Select the project this is about" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {completedProjects.map((project: any) => (
                                <SelectItem key={project.id} value={project.id.toString()}>
                                  {project.buildingName || `${project.strataPlanNumber}`} - {project.jobType?.replace(/_/g, ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
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
      <header 
        className="sticky top-0 z-[100] bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
        style={hasCustomBranding && branding.primaryColor ? { borderColor: `${branding.primaryColor}30` } : {}}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {branding.logoUrl ? (
                <div className="h-12 w-12 rounded-xl bg-white dark:bg-muted flex items-center justify-center shadow-lg p-1">
                  <img 
                    src={branding.logoUrl} 
                    alt={branding.companyName || 'Company logo'} 
                    className="w-full h-full object-contain"
                    data-testid="img-company-logo-header"
                  />
                </div>
              ) : (
                <div 
                  className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg"
                  style={hasCustomBranding && branding.primaryColor ? { 
                    background: `linear-gradient(to bottom right, ${branding.primaryColor}, ${branding.primaryColor}99)` 
                  } : {}}
                >
                  <span className="material-icons text-white text-2xl">domain</span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight" data-testid="text-strata-number">
                  {projectData.strataPlanNumber}
                </h1>
                <p className="text-sm text-muted-foreground capitalize">
                  {projectData.jobType}
                  {companyData?.company?.companyName && ` • ${companyData.company.companyName}`}
                  {companyData?.company?.residentCode && (
                    <span className="font-mono text-xs ml-2 text-primary">
                      ({companyData.company.residentCode})
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-base px-4 py-2">
                <span className="material-icons text-sm mr-1.5">layers</span>
                {activeProject?.jobType === 'in_suite_dryer_vent_cleaning' 
                  ? `${projectData.floorCount} Units`
                  : `${projectData.floorCount} Floors`}
              </Badge>
              <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-profile" onClick={() => setLocation("/profile")}>
                <span className="material-icons">person</span>
              </Button>
              <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-logout" onClick={confirmLogout}>
                <span className="material-icons">logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Read-Only Mode Banner */}
      {currentUser && isReadOnly(currentUser) && (
        <Alert className="mx-4 mt-4 border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <div className="flex-1">
            <AlertTitle className="text-yellow-700 dark:text-yellow-400">Read-Only Mode</AlertTitle>
            <AlertDescription className="text-yellow-600 dark:text-yellow-500">
              Your company is in read-only mode and must verify its license to submit feedback or make changes.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Main Content - Full Width */}
      <div className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Selector - Show if multiple active projects */}
        {activeProjects.length > 1 && (
          <Card className="mb-6 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <span className="material-icons text-primary">apartment</span>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Select Project to View</label>
                  <Select value={selectedProjectId || ''} onValueChange={setSelectedProjectId}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeProjects.map((project: any) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.buildingName || project.strataPlanNumber} - {project.jobType?.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          if (value === "photos") {
            handlePhotoTabOpen();
          }
          if (value === "history") {
            handleComplaintsTabOpen();
          }
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="building" data-testid="tab-building">Progress</TabsTrigger>
            <TabsTrigger 
              value="photos" 
              data-testid="tab-photos"
              className="relative"
            >
              My Photos
              {newPhotosCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 min-w-[16px] flex items-center justify-center px-1 text-[10px] font-bold"
                  data-testid="badge-new-photos"
                >
                  {newPhotosCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="submit" data-testid="tab-submit">Submit</TabsTrigger>
            <TabsTrigger 
              value="history" 
              data-testid="tab-history"
              className="relative"
            >
              Complaints
              {newResponsesCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 min-w-[16px] flex items-center justify-center px-1 text-[10px] font-bold"
                  data-testid="badge-new-responses"
                >
                  {newResponsesCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="building" className="mt-6">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6 sm:p-8">
              {activeProject?.jobType === 'parkade_pressure_cleaning' ? (
                /* Parkade View for Parking Stall Cleaning */
                <ParkadeView
                  totalStalls={projectData.totalStalls}
                  completedStalls={projectData.completedStalls}
                  className="mb-8"
                />
              ) : activeProject?.jobType === 'in_suite_dryer_vent_cleaning' ? (
                /* Floor/Unit Progress View for In-Suite Dryer Vent Cleaning */
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-5xl font-bold text-primary mb-2">
                      {Math.round(projectData.progressPercentage)}%
                    </h3>
                    <p className="text-muted-foreground">
                      Work in Progress
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
                      style={{ width: `${projectData.progressPercentage}%` }}
                    />
                  </div>
                </div>
              ) : (
                /* 4-Elevation Building View for other job types */
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
              )}

              {activeProject?.jobType !== 'parkade_pressure_cleaning' && (
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
              )}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <Card className="shadow-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons text-primary">photo_library</span>
                  My Unit Photos
                </CardTitle>
                <CardDescription>
                  Photos tagged for unit {currentUser?.unitNumber || "—"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!currentUser?.unitNumber ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <span className="material-icons text-5xl mb-3 opacity-50">image_not_supported</span>
                    <p>No unit number found in your profile.</p>
                  </div>
                ) : unitPhotosData?.photos?.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <span className="material-icons text-5xl mb-3 opacity-50">photo_library</span>
                    <p className="text-lg mb-2">No photos yet</p>
                    <p className="text-sm">Photos tagged for your unit will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unitPhotosData?.photos?.map((photo: any) => (
                      <div key={photo.id} className="bg-card rounded-lg overflow-hidden border hover-elevate group">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={photo.imageUrl}
                            alt={photo.comment || "Unit photo"}
                            className="w-full h-full object-cover"
                            data-testid={`unit-photo-${photo.id}`}
                          />
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              {photo.buildingName && (
                                <div className="text-sm font-medium truncate">
                                  {photo.buildingName}
                                </div>
                              )}
                              {photo.buildingAddress && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {photo.buildingAddress}
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-xs shrink-0">
                              Unit {photo.unitNumber || photo.missedUnitNumber}
                            </Badge>
                          </div>
                          {photo.comment && (
                            <div className="text-sm text-muted-foreground border-t pt-2">
                              {photo.comment}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground border-t pt-2">
                            {new Date(photo.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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

                    {activeProjects.length > 1 && (
                      <FormField
                        control={form.control}
                        name="projectId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Which Project? *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-project" className="h-12">
                                  <SelectValue placeholder="Select the project this is about" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {activeProjects.map((project: any) => (
                                  <SelectItem key={project.id} value={project.id.toString()}>
                                    {project.buildingName || `${project.strataPlanNumber}`} - {project.jobType?.replace(/_/g, ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

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

// Component for linking company code
function LinkCompanyCodeCard() {
  const { toast } = useToast();
  const [residentCode, setResidentCode] = useState("");
  
  const linkCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch("/api/link-resident-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residentCode: code }),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to link account");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Your account has been linked successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = residentCode.trim().toUpperCase();
    if (code.length !== 10) {
      toast({ title: "Invalid Code", description: "Company code must be 10 characters", variant: "destructive" });
      return;
    }
    linkCodeMutation.mutate(code);
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="material-icons text-primary">link</span>
          Link Your Account
        </CardTitle>
        <CardDescription>
          Enter the code provided by your building maintenance staff to link your account and view ongoing projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Company Code</label>
            <Input
              value={residentCode}
              onChange={(e) => setResidentCode(e.target.value.toUpperCase())}
              placeholder="Enter 10-character code"
              maxLength={10}
              className="h-12 text-lg font-mono"
              data-testid="input-resident-code"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12"
            disabled={linkCodeMutation.isPending || residentCode.length !== 10}
            data-testid="button-link-code"
          >
            {linkCodeMutation.isPending ? "Linking..." : "Link Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Component showing linked company
function CompanyLinkedCard({ companyId }: { companyId: string }) {
  const { data: companyData } = useQuery({
    queryKey: ["/api/companies", companyId],
    enabled: !!companyId,
  });

  if (!companyData?.company) return null;

  return (
    <Card className="shadow-lg border-success/20 bg-success/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
            <span className="material-icons text-success text-2xl">check_circle</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Linked to</p>
            <p className="text-lg font-semibold">{companyData.company.companyName}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

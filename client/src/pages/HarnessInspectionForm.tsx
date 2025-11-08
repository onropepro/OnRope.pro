import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CheckCircle2, XCircle, ClipboardCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const harnessInspectionSchema = z.object({
  inspectionDate: z.string().min(1, "Inspection date is required"),
  inspectorName: z.string().min(1, "Inspector name is required"),
  manufacturer: z.string().optional(),
  personalHarnessId: z.string().optional(),
  lanyardType: z.string().optional(),
  projectId: z.string().optional(),
  
  // Harness & Lanyard Components (false = NO/pass, true = YES/fail)
  frayedEdges: z.boolean(),
  brokenFibers: z.boolean(),
  pulledStitching: z.boolean(),
  cutsWear: z.boolean(),
  dRingsChemicalDamage: z.boolean(),
  dRingsPadsExcessiveWear: z.boolean(),
  dRingsBentDistorted: z.boolean(),
  dRingsCracksBreaks: z.boolean(),
  buckleMechanism: z.boolean(),
  tongueBucklesBentDistorted: z.boolean(),
  tongueBucklesSharpEdges: z.boolean(),
  tongueBucklesMoveFreely: z.boolean(),
  connectorsExcessiveWear: z.boolean(),
  connectorsLoose: z.boolean(),
  connectorsBrokenDistorted: z.boolean(),
  connectorsCracksHoles: z.boolean(),
  sharpRoughEdges: z.boolean(),
  
  // Lanyard Inspection (true = YES/pass)
  burnsTearsCracks: z.boolean(),
  chemicalDamage: z.boolean(),
  excessiveSoiling: z.boolean(),
  connectorsHooksWork: z.boolean(),
  lockingMechanismsWork: z.boolean(),
  shockAbsorberIntact: z.boolean(),
  excessiveWearSigns: z.boolean(),
  
  dateInService: z.string().optional(),
  comments: z.string().optional(),
});

type HarnessInspectionFormData = z.infer<typeof harnessInspectionSchema>;

export default function HarnessInspectionForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch projects for optional selection
  const { data: projectsData } = useQuery<{ projects: any[] }>({
    queryKey: ["/api/projects"],
  });

  const projects = projectsData?.projects || [];

  // Get today's date as default
  const today = new Date().toISOString().split('T')[0];

  const form = useForm<HarnessInspectionFormData>({
    resolver: zodResolver(harnessInspectionSchema),
    defaultValues: {
      inspectionDate: today,
      inspectorName: "",
      manufacturer: "",
      personalHarnessId: "",
      lanyardType: "not_specified",
      projectId: "",
      
      // Default all harness components to false (NO = pass)
      frayedEdges: false,
      brokenFibers: false,
      pulledStitching: false,
      cutsWear: false,
      dRingsChemicalDamage: false,
      dRingsPadsExcessiveWear: false,
      dRingsBentDistorted: false,
      dRingsCracksBreaks: false,
      buckleMechanism: false,
      tongueBucklesBentDistorted: false,
      tongueBucklesSharpEdges: false,
      tongueBucklesMoveFreely: true,
      connectorsExcessiveWear: false,
      connectorsLoose: false,
      connectorsBrokenDistorted: false,
      connectorsCracksHoles: false,
      sharpRoughEdges: false,
      
      // Default all lanyard checks to true (YES = pass)
      burnsTearsCracks: true,
      chemicalDamage: true,
      excessiveSoiling: true,
      connectorsHooksWork: true,
      lockingMechanismsWork: true,
      shockAbsorberIntact: true,
      excessiveWearSigns: true,
      
      dateInService: "",
      comments: "",
    },
  });

  const submitInspection = useMutation({
    mutationFn: async (data: HarnessInspectionFormData) => {
      return apiRequest("POST", "/api/harness-inspections", data);
    },
    onSuccess: () => {
      toast({ 
        title: "Inspection submitted", 
        description: "Your harness inspection has been recorded successfully." 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-harness-inspections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/harness-inspections"] });
      setLocation("/tech");
    },
    onError: (error: Error) => {
      toast({ 
        title: "Submission failed", 
        description: error.message, 
        variant: "destructive" 
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: HarnessInspectionFormData) => {
    setIsSubmitting(true);
    submitInspection.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/tech")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Pre-Use Safety Harness Inspection</h1>
              <p className="text-sm text-muted-foreground">Daily safety equipment inspection form</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Inspection details and equipment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="inspectionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspection Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-inspection-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="inspectorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspector Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your full name" data-testid="input-inspector-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Petzl" data-testid="input-manufacturer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personalHarnessId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Harness ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Harness serial/ID number" data-testid="input-harness-id" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lanyardType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Lanyard</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-lanyard-type">
                              <SelectValue placeholder="Select lanyard type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="not_specified">Not specified</SelectItem>
                            <SelectItem value="shock_absorber">Shock Absorber</SelectItem>
                            <SelectItem value="energy_absorber">Energy Absorber</SelectItem>
                            <SelectItem value="positioning">Positioning</SelectItem>
                            <SelectItem value="twin_tail">Twin Tail</SelectItem>
                            <SelectItem value="single_leg">Single Leg</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-project">
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No project</SelectItem>
                            {projects.map((project: any) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.buildingName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateInService"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Harness/Lanyard Placed in Service</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-date-in-service" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  Harness, Lanyard & Components
                </CardTitle>
                <CardDescription>
                  Check each item. Toggle ON if issue is present (NO = Pass, YES = Fail)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "frayedEdges", label: "Frayed Edges" },
                  { name: "brokenFibers", label: "Broken Fibers" },
                  { name: "pulledStitching", label: "Pulled Stitching" },
                  { name: "cutsWear", label: "Cuts / Wear" },
                  { name: "dRingsChemicalDamage", label: "D-Rings - Chemical Damage" },
                  { name: "dRingsPadsExcessiveWear", label: "D-Rings / Pads - Excessive Wear" },
                  { name: "dRingsBentDistorted", label: "D-Rings - Bent or Distorted" },
                  { name: "dRingsCracksBreaks", label: "D-Rings - Cracks / Breaks" },
                  { name: "buckleMechanism", label: "Buckle Mechanism Issues" },
                  { name: "tongueBucklesBentDistorted", label: "Tongue Buckles - Bent or Distorted" },
                  { name: "tongueBucklesSharpEdges", label: "Tongue Buckles - Sharp Edges" },
                  { name: "connectorsExcessiveWear", label: "Connectors - Excessive Wear" },
                  { name: "connectorsLoose", label: "Connectors - Loose" },
                  { name: "connectorsBrokenDistorted", label: "Connectors - Broken or Distorted" },
                  { name: "connectorsCracksHoles", label: "Connectors - Cracks / Holes" },
                  { name: "sharpRoughEdges", label: "Sharp / Rough Edges" },
                ].map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name as any}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border p-3 hover-elevate">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{item.label}</FormLabel>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${field.value ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {field.value ? 'YES' : 'NO'}
                            </span>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid={`switch-${item.name}`}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}

                <Separator className="my-4" />

                <FormField
                  control={form.control}
                  name="tongueBucklesMoveFreely"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3 hover-elevate bg-muted/30">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Tongue Buckles - Move Freely</FormLabel>
                        <FormDescription className="text-xs">This should normally be YES (ON)</FormDescription>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${field.value ? 'text-success' : 'text-muted-foreground'}`}>
                            {field.value ? 'YES' : 'NO'}
                          </span>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-tongueBucklesMoveFreely"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Lanyard Inspection
                </CardTitle>
                <CardDescription>
                  Check each item. Toggle OFF if issue is present (YES = Pass, NO = Fail)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "burnsTearsCracks", label: "Free from Burns, Tears, Rips, Cracks" },
                  { name: "chemicalDamage", label: "Free from Chemical Damage" },
                  { name: "excessiveSoiling", label: "Free from Excessive Soiling" },
                  { name: "connectorsHooksWork", label: "Connectors / Hooks Work Properly" },
                  { name: "lockingMechanismsWork", label: "Locking Mechanisms Work Properly" },
                  { name: "shockAbsorberIntact", label: "Shock Absorber Pack Intact" },
                  { name: "excessiveWearSigns", label: "Free from Signs of Excessive Wear" },
                ].map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name as any}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border p-3 hover-elevate">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{item.label}</FormLabel>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${field.value ? 'text-success' : 'text-destructive'}`}>
                              {field.value ? 'YES' : 'NO'}
                            </span>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid={`switch-${item.name}`}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Comments</CardTitle>
                <CardDescription>Any additional notes or observations</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter any additional comments or notes about the inspection..."
                          className="min-h-24"
                          data-testid="textarea-comments"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/tech")}
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
                data-testid="button-submit-inspection"
              >
                {isSubmitting ? "Submitting..." : "Submit Inspection"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

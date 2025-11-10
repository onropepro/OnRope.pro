import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, FileCheck } from "lucide-react";
import type { Project } from "@shared/schema";

const toolboxMeetingFormSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  meetingDate: z.string().min(1, "Date is required"),
  conductedByName: z.string().min(1, "Your name is required"),
  attendees: z.string().min(1, "At least one attendee is required"),
  
  // Topics
  topicFallProtection: z.boolean().default(false),
  topicAnchorPoints: z.boolean().default(false),
  topicRopeInspection: z.boolean().default(false),
  topicKnotTying: z.boolean().default(false),
  topicPPECheck: z.boolean().default(false),
  topicWeatherConditions: z.boolean().default(false),
  topicCommunication: z.boolean().default(false),
  topicEmergencyEvacuation: z.boolean().default(false),
  topicHazardAssessment: z.boolean().default(false),
  topicLoadCalculations: z.boolean().default(false),
  topicEquipmentCompatibility: z.boolean().default(false),
  topicDescenderAscender: z.boolean().default(false),
  topicEdgeProtection: z.boolean().default(false),
  topicSwingFall: z.boolean().default(false),
  topicMedicalFitness: z.boolean().default(false),
  topicToolDropPrevention: z.boolean().default(false),
  topicRegulations: z.boolean().default(false),
  topicRescueProcedures: z.boolean().default(false),
  topicSiteHazards: z.boolean().default(false),
  topicBuddySystem: z.boolean().default(false),
  
  customTopic: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type ToolboxMeetingFormValues = z.infer<typeof toolboxMeetingFormSchema>;

const topics = [
  { id: "topicFallProtection", label: "Fall Protection and Rescue Procedures" },
  { id: "topicAnchorPoints", label: "Anchor Point Selection and Inspection" },
  { id: "topicRopeInspection", label: "Rope Inspection and Maintenance" },
  { id: "topicKnotTying", label: "Knot Tying and Verification" },
  { id: "topicPPECheck", label: "Personal Protective Equipment (PPE) Check" },
  { id: "topicWeatherConditions", label: "Weather Conditions and Work Stoppage" },
  { id: "topicCommunication", label: "Communication Signals and Procedures" },
  { id: "topicEmergencyEvacuation", label: "Emergency Evacuation Procedures" },
  { id: "topicHazardAssessment", label: "Work Area Hazard Assessment" },
  { id: "topicLoadCalculations", label: "Load Calculations and Weight Limits" },
  { id: "topicEquipmentCompatibility", label: "Equipment Compatibility Check" },
  { id: "topicDescenderAscender", label: "Descender and Ascender Use" },
  { id: "topicEdgeProtection", label: "Edge Protection Requirements" },
  { id: "topicSwingFall", label: "Swing Fall Hazards" },
  { id: "topicMedicalFitness", label: "Medical Fitness and Fatigue Management" },
  { id: "topicToolDropPrevention", label: "Tool Drop Prevention" },
  { id: "topicRegulations", label: "Working at Heights Regulations" },
  { id: "topicRescueProcedures", label: "Rescue Procedures and Equipment" },
  { id: "topicSiteHazards", label: "Site-Specific Hazards" },
  { id: "topicBuddySystem", label: "Buddy System and Supervision" },
];

export default function ToolboxMeetingForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const { data: projectsData } = useQuery<{ projects: Project[] }>({
    queryKey: ["/api/projects"],
  });

  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
  });

  // Filter out terminated employees
  const employees = (employeesData?.employees || []).filter(emp => !emp.terminationDate);

  const form = useForm<ToolboxMeetingFormValues>({
    resolver: zodResolver(toolboxMeetingFormSchema),
    defaultValues: {
      projectId: "",
      meetingDate: new Date().toISOString().split("T")[0],
      conductedByName: "",
      attendees: "",
      topicFallProtection: false,
      topicAnchorPoints: false,
      topicRopeInspection: false,
      topicKnotTying: false,
      topicPPECheck: false,
      topicWeatherConditions: false,
      topicCommunication: false,
      topicEmergencyEvacuation: false,
      topicHazardAssessment: false,
      topicLoadCalculations: false,
      topicEquipmentCompatibility: false,
      topicDescenderAscender: false,
      topicEdgeProtection: false,
      topicSwingFall: false,
      topicMedicalFitness: false,
      topicToolDropPrevention: false,
      topicRegulations: false,
      topicRescueProcedures: false,
      topicSiteHazards: false,
      topicBuddySystem: false,
      customTopic: "",
      additionalNotes: "",
    },
  });

  const toggleEmployee = (employeeName: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeName)
        ? prev.filter(name => name !== employeeName)
        : [...prev, employeeName]
    );
  };

  const createMeetingMutation = useMutation({
    mutationFn: async (data: ToolboxMeetingFormValues) => {
      // Use selectedEmployees instead of parsing textarea
      const response = await apiRequest("POST", "/api/toolbox-meetings", {
        ...data,
        attendees: selectedEmployees,
      });
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Toolbox meeting recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/toolbox-meetings"] });
      navigate("/tech");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record toolbox meeting",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ToolboxMeetingFormValues) => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one attendee",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createMeetingMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/tech")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Daily Toolbox Meeting</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-project">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectsData?.projects.map((project) => (
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

                <FormField
                  control={form.control}
                  name="meetingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="text-base"
                          data-testid="input-meeting-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conductedByName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conducted By (Your Name) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your full name"
                          data-testid="input-conducted-by"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div>
                    <FormLabel>Attendees *</FormLabel>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tap employees to select attendees
                    </p>
                  </div>
                  
                  {selectedEmployees.length > 0 && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-sm font-medium mb-2">
                        Selected ({selectedEmployees.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployees.map((name, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary"
                            className="cursor-pointer hover-elevate"
                            onClick={() => toggleEmployee(name)}
                          >
                            {name} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {employees.map((employee) => (
                      <Card
                        key={employee.id}
                        className={`cursor-pointer hover-elevate transition-colors ${
                          selectedEmployees.includes(employee.name)
                            ? 'bg-primary/10 border-primary'
                            : ''
                        }`}
                        onClick={() => toggleEmployee(employee.name)}
                        data-testid={`employee-card-${employee.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                selectedEmployees.includes(employee.name)
                                  ? 'bg-primary border-primary'
                                  : 'border-muted-foreground'
                              }`}
                            >
                              {selectedEmployees.includes(employee.name) && (
                                <span className="material-icons text-primary-foreground text-sm">
                                  check
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {employee.name}
                              </div>
                              {employee.techLevel && (
                                <div className="text-xs text-muted-foreground">
                                  {employee.techLevel}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {selectedEmployees.length === 0 && (
                    <p className="text-sm text-destructive">
                      Please select at least one attendee
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Topics Discussed</h3>
                  <p className="text-sm text-muted-foreground">
                    Select all topics that were covered in this meeting
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {topics.map((topic) => (
                      <FormField
                        key={topic.id}
                        control={form.control}
                        name={topic.id as any}
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid={`checkbox-${topic.id}`}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {topic.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="customTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Topic (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter any additional topic discussed"
                          data-testid="input-custom-topic"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Any additional information or discussion points..."
                          className="min-h-24"
                          data-testid="input-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Recording..." : "Record Toolbox Meeting"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ClipboardCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ROPE_ACCESS_EQUIPMENT_CATEGORIES, ROPE_ACCESS_INSPECTION_ITEMS, type RopeAccessEquipmentCategory, type EquipmentFindings, type InspectionResult } from "@shared/schema";

const inspectionFormSchema = z.object({
  inspectionDate: z.string().min(1, "Inspection date is required"),
  inspectorName: z.string().min(1, "Inspector name is required"),
  manufacturer: z.string().optional(),
  equipmentId: z.string().optional(),
  projectId: z.string().optional(),
  dateInService: z.string().optional(),
  comments: z.string().optional(),
  equipmentFindings: z.record(z.any()).default({}),
});

type InspectionFormData = z.infer<typeof inspectionFormSchema>;

export default function HarnessInspectionForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize all equipment findings with default "pass" values
  const initializeFindings = (): EquipmentFindings => {
    const initialized: EquipmentFindings = {};
    (Object.keys(ROPE_ACCESS_EQUIPMENT_CATEGORIES) as RopeAccessEquipmentCategory[]).forEach((categoryKey) => {
      const items: Record<string, { result: InspectionResult; notes?: string }> = {};
      ROPE_ACCESS_INSPECTION_ITEMS[categoryKey].forEach((item) => {
        items[item.key] = { result: "pass" };
      });
      initialized[categoryKey] = {
        status: "pass",
        items,
      };
    });
    return initialized;
  };

  // State to manage inspection results for each category and item
  const [findings, setFindings] = useState<EquipmentFindings>(initializeFindings());

  // Fetch projects for optional selection
  const { data: projectsData } = useQuery<{ projects: any[] }>({
    queryKey: ["/api/projects"],
  });

  const projects = projectsData?.projects || [];

  // Get today's date as default
  const today = new Date().toISOString().split('T')[0];

  const form = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      inspectionDate: today,
      inspectorName: "",
      manufacturer: "",
      equipmentId: "",
      projectId: "",
      dateInService: "",
      comments: "",
      equipmentFindings: {},
    },
  });

  // Calculate overall status and failure summary
  const { overallStatus, failedCategories, failedItems } = useMemo(() => {
    const failed: Array<{ category: string; items: string[] }> = [];
    let hasFailures = false;

    Object.entries(findings).forEach(([categoryKey, categoryData]) => {
      if (categoryData) {
        const failedItemsInCategory: string[] = [];
        
        Object.entries(categoryData.items || {}).forEach(([itemKey, itemData]) => {
          if (itemData.result === "fail") {
            const itemLabel = ROPE_ACCESS_INSPECTION_ITEMS[categoryKey as RopeAccessEquipmentCategory]
              ?.find(item => item.key === itemKey)?.label || itemKey;
            failedItemsInCategory.push(itemLabel);
            hasFailures = true;
          }
        });

        if (failedItemsInCategory.length > 0) {
          failed.push({
            category: ROPE_ACCESS_EQUIPMENT_CATEGORIES[categoryKey as RopeAccessEquipmentCategory],
            items: failedItemsInCategory,
          });
        }
      }
    });

    return {
      overallStatus: hasFailures ? "fail" : "pass",
      failedCategories: failed,
      failedItems: failed.reduce((sum, cat) => sum + cat.items.length, 0),
    };
  }, [findings]);

  // Set item result
  const setItemResult = (category: RopeAccessEquipmentCategory, itemKey: string, result: InspectionResult) => {
    setFindings(prev => {
      const categoryData = prev[category] || { status: "pass", items: {} };
      const newCategoryData = {
        ...categoryData,
        items: {
          ...categoryData.items,
          [itemKey]: {
            ...categoryData.items[itemKey],
            result,
          },
        },
      };

      // Update category status based on items
      const hasFailures = Object.values(newCategoryData.items).some(item => item.result === "fail");
      newCategoryData.status = hasFailures ? "fail" : "pass";

      return {
        ...prev,
        [category]: newCategoryData,
      };
    });
  };

  // Set item notes
  const setItemNotes = (category: RopeAccessEquipmentCategory, itemKey: string, notes: string) => {
    setFindings(prev => {
      const categoryData = prev[category] || { status: "pass", items: {} };
      return {
        ...prev,
        [category]: {
          ...categoryData,
          items: {
            ...categoryData.items,
            [itemKey]: {
              ...categoryData.items[itemKey],
              result: categoryData.items[itemKey]?.result || "pass",
              notes,
            },
          },
        },
      };
    });
  };

  const submitInspection = useMutation({
    mutationFn: async (data: InspectionFormData) => {
      const payload = {
        ...data,
        equipmentFindings: findings,
        overallStatus,
      };
      return apiRequest("POST", "/api/harness-inspections", payload);
    },
    onSuccess: () => {
      toast({ 
        title: "Inspection submitted", 
        description: "Your rope access equipment inspection has been recorded successfully." 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-harness-inspections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/harness-inspections"] });
      setLocation("/dashboard");
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

  const onSubmit = async (data: InspectionFormData) => {
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
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Rope Access Equipment Inspection</h1>
              <p className="text-sm text-muted-foreground">Daily pre-work safety inspection</p>
            </div>
          </div>
        </div>

        {/* Failure Summary Banner */}
        {failedItems > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription>
              <div className="font-semibold mb-2">
                {failedItems} failed item{failedItems !== 1 ? 's' : ''} detected across {failedCategories.length} categor{failedCategories.length !== 1 ? 'ies' : 'y'}
              </div>
              <ul className="text-sm space-y-1">
                {failedCategories.map((cat, idx) => (
                  <li key={idx}>
                    <strong>{cat.category}:</strong> {cat.items.join(", ")}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

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
                        <FormLabel>Primary Manufacturer</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Petzl, Kong, CMC" data-testid="input-manufacturer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="equipmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment ID / Serial Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Serial or ID number" data-testid="input-equipment-id" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <FormField
                    control={form.control}
                    name="dateInService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Placed in Service</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-date-in-service" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Equipment Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Inspection</CardTitle>
                <CardDescription>
                  Inspect each equipment category. Mark items as Pass, Fail, or Not Applicable.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {(Object.keys(ROPE_ACCESS_EQUIPMENT_CATEGORIES) as RopeAccessEquipmentCategory[]).map((categoryKey) => {
                    const categoryName = ROPE_ACCESS_EQUIPMENT_CATEGORIES[categoryKey];
                    const items = ROPE_ACCESS_INSPECTION_ITEMS[categoryKey];
                    const categoryData = findings[categoryKey];
                    const categoryStatus = categoryData?.status || "pass";

                    return (
                      <AccordionItem key={categoryKey} value={categoryKey} data-testid={`accordion-${categoryKey}`}>
                        <AccordionTrigger className="hover-elevate px-4">
                          <div className="flex items-center gap-3 w-full">
                            {categoryStatus === "fail" ? (
                              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                            ) : (
                              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                            )}
                            <span className="text-left flex-1">{categoryName}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-4 space-y-4">
                          {items.map((item) => {
                            const itemData = categoryData?.items[item.key];
                            const result = itemData?.result || "pass";
                            const notes = itemData?.notes || "";

                            return (
                              <div key={item.key} className="border rounded-md p-4 space-y-3 hover-elevate">
                                <div className="font-medium">{item.label}</div>
                                
                                <RadioGroup
                                  value={result}
                                  onValueChange={(value) => setItemResult(categoryKey, item.key, value as InspectionResult)}
                                  data-testid={`radio-group-${categoryKey}-${item.key}`}
                                >
                                  <div className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="pass" id={`${categoryKey}-${item.key}-pass`} data-testid={`radio-${categoryKey}-${item.key}-pass`} />
                                      <label htmlFor={`${categoryKey}-${item.key}-pass`} className="text-sm font-medium cursor-pointer">
                                        Pass
                                      </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="fail" id={`${categoryKey}-${item.key}-fail`} data-testid={`radio-${categoryKey}-${item.key}-fail`} />
                                      <label htmlFor={`${categoryKey}-${item.key}-fail`} className="text-sm font-medium cursor-pointer text-destructive">
                                        Fail
                                      </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="not_applicable" id={`${categoryKey}-${item.key}-na`} data-testid={`radio-${categoryKey}-${item.key}-na`} />
                                      <label htmlFor={`${categoryKey}-${item.key}-na`} className="text-sm font-medium cursor-pointer text-muted-foreground">
                                        N/A
                                      </label>
                                    </div>
                                  </div>
                                </RadioGroup>

                                {result === "fail" && (
                                  <Textarea
                                    placeholder="Describe the issue..."
                                    value={notes}
                                    onChange={(e) => setItemNotes(categoryKey, item.key, e.target.value)}
                                    className="min-h-20"
                                    data-testid={`textarea-${categoryKey}-${item.key}-notes`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Comments</CardTitle>
                <CardDescription>Any additional notes or observations about the inspection</CardDescription>
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
                          placeholder="Enter any additional comments or notes..."
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
                onClick={() => setLocation("/dashboard")}
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

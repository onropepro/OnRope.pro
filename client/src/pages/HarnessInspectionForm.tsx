import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useSearch } from "wouter";
import { useTranslation } from "react-i18next";
import { trackHarnessInspection } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClipboardCheck, AlertTriangle, CheckCircle2, Package, Shield } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGearId, setSelectedGearId] = useState<string>("");
  const [showHarnessPicker, setShowHarnessPicker] = useState(false);
  
  // Bulk kit inspection mode - when true, all kit items will be inspected together
  const [isKitInspectionMode, setIsKitInspectionMode] = useState(false);
  const [selectedKitItems, setSelectedKitItems] = useState<any[]>([]);
  
  // Get project ID from URL params (when coming from project start day flow)
  const urlParams = new URLSearchParams(searchString);
  const projectIdFromUrl = urlParams.get('projectId');

  // Navigation helper - returns to project if opened from one
  const handleNavigateBack = () => {
    if (projectIdFromUrl) {
      setLocation(`/projects/${projectIdFromUrl}`);
    } else {
      setLocation("/safety-forms");
    }
  };

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

  // Fetch current user
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });
  
  const currentUser = userData?.user;

  // Fetch gear items
  const { data: gearData } = useQuery<{ items: any[] }>({
    queryKey: ["/api/gear-items"],
  });

  // Fetch user's personal kit (assigned gear)
  const { data: myKitData } = useQuery<{ kit: any[] }>({
    queryKey: ["/api/my-kit"],
  });

  const allGearItems = gearData?.items || [];
  const myKit = myKitData?.kit || [];
  
  // Show ALL items in user's kit (all equipment types, not just harnesses)
  const myKitItems = myKit.filter((item: any) => 
    item.inService !== false
  );

  // Show ALL company inventory items for selection from inventory
  const availableInventoryItems = allGearItems.filter((item: any) => 
    item.inService !== false
  );

  // Fetch projects for optional selection
  const { data: projectsData } = useQuery<{ projects: any[] }>({
    queryKey: ["/api/projects"],
  });

  const projects = projectsData?.projects || [];

  // Get today's date as default (using local timezone, not UTC)
  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

  const form = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      inspectionDate: today,
      inspectorName: currentUser?.name || "",
      manufacturer: "",
      equipmentId: "",
      projectId: projectIdFromUrl || "",
      dateInService: "",
      comments: "",
      equipmentFindings: {},
    },
  });
  
  // Auto-set project if coming from a project's start day flow
  useEffect(() => {
    if (projectIdFromUrl && projects.length > 0) {
      const projectExists = projects.some((p: any) => p.id === projectIdFromUrl);
      if (projectExists) {
        form.setValue("projectId", projectIdFromUrl);
      }
    }
  }, [projectIdFromUrl, projects, form]);

  // Handle gear selection and autofill
  const handleGearSelection = (gearItemId: string) => {
    setSelectedGearId(gearItemId);
    
    if (!gearItemId || gearItemId === "none") {
      // Clear autofilled fields
      form.setValue("equipmentId", "");
      form.setValue("manufacturer", "");
      form.setValue("dateInService", "");
      return;
    }

    const selectedGear = allGearItems.find((item: any) => item.id === gearItemId);
    
    if (selectedGear) {
      // Autofill equipment ID
      const serialNumber = selectedGear.serialNumbers && selectedGear.serialNumbers.length > 0 
        ? selectedGear.serialNumbers[0] 
        : selectedGear.equipmentType || "";
      form.setValue("equipmentId", serialNumber);
      
      // Autofill manufacturer
      if (selectedGear.brand) {
        form.setValue("manufacturer", `${selectedGear.brand}${selectedGear.model ? ` ${selectedGear.model}` : ""}`);
      }
      
      // Autofill date in service
      if (selectedGear.dateInService) {
        form.setValue("dateInService", selectedGear.dateInService);
      }
    }
  };

  // Handle harness selection from picker dialog
  const handleHarnessSelection = (harness: any) => {
    console.log('[Harness Picker] Selected harness:', harness);
    // Reset kit mode when selecting individual item
    setIsKitInspectionMode(false);
    setSelectedKitItems([]);
    handleGearSelection(harness.id);
    setShowHarnessPicker(false);
    toast({
      title: t('harnessInspection.toast.harnessSelected', 'Harness selected'),
      description: t('harnessInspection.toast.detailsLoaded', '{{type}} details loaded', { type: harness.equipmentType }),
    });
  };
  
  // Handle selecting entire kit for bulk inspection
  const handleSelectEntireKit = () => {
    if (myKitItems.length === 0) return;
    
    setIsKitInspectionMode(true);
    setSelectedKitItems(myKitItems);
    setSelectedGearId(""); // Clear single selection
    
    // Use first item's details as representative for form display
    const firstItem = myKitItems[0];
    form.setValue("equipmentId", `Kit: ${myKitItems.length} items`);
    form.setValue("manufacturer", "");
    form.setValue("dateInService", "");
    
    setShowHarnessPicker(false);
    toast({
      title: t('harnessInspection.toast.kitSelected', 'Entire Kit Selected'),
      description: t('harnessInspection.toast.kitSelectedDescription', 'Inspecting {{count}} items from your kit', { count: myKitItems.length }),
    });
  };

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
      // If in kit inspection mode, create inspections for all kit items
      if (isKitInspectionMode && selectedKitItems.length > 0) {
        const results = [];
        // Generate a unique kit inspection ID to link all items together
        const kitInspectionId = `kit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        for (const kitItem of selectedKitItems) {
          // Get serial number from item
          const serialNumber = kitItem.serialNumber || 
            (kitItem.serialNumbers && kitItem.serialNumbers.length > 0 ? kitItem.serialNumbers[0] : '');
          
          // Build manufacturer string
          const manufacturer = `${kitItem.brand || ''}${kitItem.model ? ` ${kitItem.model}` : ''}`.trim();
          
          // Create a fresh payload for each item with item-specific fields OVERRIDING shared data
          const payload = {
            inspectionDate: data.inspectionDate,
            inspectorName: data.inspectorName,
            projectId: data.projectId,
            comments: data.comments,
            // Item-specific fields
            equipmentId: serialNumber || kitItem.equipmentType,
            manufacturer: manufacturer || '',
            dateInService: kitItem.dateInService || '',
            // Shared inspection findings
            equipmentFindings: findings,
            overallStatus,
            gearItemId: kitItem.gearItemId || kitItem.id,
            // Kit inspection batch ID
            kitInspectionId,
          };
          const result = await apiRequest("POST", "/api/harness-inspections", payload);
          results.push(result);
        }
        return results;
      } else {
        // Single item inspection
        const payload = {
          ...data,
          equipmentFindings: findings,
          overallStatus,
          gearItemId: selectedGearId || undefined,
        };
        return apiRequest("POST", "/api/harness-inspections", payload);
      }
    },
    onSuccess: () => {
      // Track harness inspection completion
      trackHarnessInspection({
        employeeId: currentUser?.id || '',
        result: overallStatus === 'pass' ? 'pass' : 'fail',
      });
      
      const itemCount = isKitInspectionMode ? selectedKitItems.length : 1;
      toast({ 
        title: t('harnessInspection.toast.submitted', 'Inspection submitted'), 
        description: isKitInspectionMode 
          ? t('harnessInspection.toast.kitSubmittedDescription', '{{count}} equipment inspections have been recorded successfully.', { count: itemCount })
          : t('harnessInspection.toast.submittedDescription', 'Your rope access equipment inspection has been recorded successfully.') 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-harness-inspections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/harness-inspections"] });
      // Invalidate project-specific if opened from project
      if (projectIdFromUrl) {
        queryClient.invalidateQueries({ queryKey: ["/api/projects", projectIdFromUrl, "harness-inspections"] });
      }
      handleNavigateBack();
    },
    onError: (error: Error) => {
      toast({ 
        title: t('harnessInspection.toast.failed', 'Submission failed'), 
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
          <BackButton size="icon" to={projectIdFromUrl ? `/projects/${projectIdFromUrl}` : "/safety-forms"} />
          <MainMenuButton size="icon" />
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">{t('harnessInspection.title', 'Rope Access Equipment Inspection')}</h1>
              <p className="text-sm text-muted-foreground">{t('harnessInspection.subtitle', 'Daily pre-work safety inspection')}</p>
            </div>
          </div>
        </div>

        <Card className="mb-4 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{t('harnessInspection.icop.title', 'IRATA International Code of Practice (ICOP)')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('harnessInspection.icop.description', 'All rope access operations must comply with the IRATA International Code of Practice for Industrial Rope Access (TC-102ENG). This document outlines mandatory safety requirements, technical procedures, and best practices for rope access work.')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <a 
                  href="https://irata.org/downloads/2055" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary"
                  data-testid="link-irata-icop"
                >
                  {t('harnessInspection.icop.downloadDocument', 'Download Official ICOP Document')}
                </a>
              </Badge>
              <Badge variant="outline" className="text-xs">
                <a 
                  href="https://irata.org/page/international-code-of-practice" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary"
                  data-testid="link-irata-icop-info"
                >
                  {t('harnessInspection.icop.viewInfo', 'View IRATA ICOP Information')}
                </a>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Failure Summary Banner */}
        {failedItems > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription>
              <div className="font-semibold mb-2">
                {t('harnessInspection.failureSummary', '{{count}} failed item(s) detected across {{categories}} category(ies)', { count: failedItems, categories: failedCategories.length })}
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
                <CardTitle>{t('harnessInspection.basicInfo.title', 'Basic Information')}</CardTitle>
                <CardDescription>{t('harnessInspection.basicInfo.description', 'Inspection details and equipment information')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Gear Picker Button - Always Visible */}
                <Dialog open={showHarnessPicker} onOpenChange={setShowHarnessPicker}>
                  <DialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="default" 
                      className="w-full h-14"
                      data-testid="button-pick-harness"
                    >
                      <Package className="mr-2 h-5 w-5" />
                      {t('harnessInspection.pickEquipment', 'Pick Equipment from Inventory')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('harnessInspection.selectEquipment.title', 'Select Equipment')}</DialogTitle>
                      <DialogDescription>
                        {t('harnessInspection.selectEquipment.description', 'Choose equipment from your kit or inventory to auto-fill inspection details')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* My Kit Section */}
                      {myKitItems.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-primary">
                            <Shield className="h-5 w-5" />
                            <h3 className="font-semibold">{t('harnessInspection.myKit.title', 'My Kit')}</h3>
                            <Badge variant="secondary" className="ml-auto">{myKitItems.length}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t('harnessInspection.myKit.description', 'Your personal assigned equipment')}
                          </p>
                          
                          {/* Select Entire Kit Button */}
                          <Card 
                            className="hover-elevate active-elevate-2 cursor-pointer border-2 border-primary bg-primary/10"
                            onClick={handleSelectEntireKit}
                            data-testid="button-select-entire-kit"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                                  <span className="material-icons text-primary text-xl">select_all</span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-primary">
                                    {t('harnessInspection.selectEntireKit', 'Select Entire Kit')}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {t('harnessInspection.inspectAllItems', 'Inspect all {{count}} items at once', { count: myKitItems.length })}
                                  </div>
                                </div>
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Individual Kit Items */}
                          <div className="relative py-1">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-background px-2 text-muted-foreground">
                                {t('harnessInspection.orSelectIndividual', 'or select individual items')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid gap-2">
                            {myKitItems.map((item: any) => (
                              <Card 
                                key={`kit-${item.assignmentId}`}
                                className="hover-elevate active-elevate-2 cursor-pointer border-primary/30 bg-primary/5"
                                onClick={() => handleHarnessSelection({
                                  id: item.gearItemId,
                                  equipmentType: item.equipmentType,
                                  brand: item.brand,
                                  model: item.model,
                                  serialNumbers: item.serialNumbers,
                                  dateInService: item.dateInService,
                                })}
                                data-testid={`kit-item-${item.assignmentId}`}
                              >
                                <CardContent className="p-3">
                                  <div className="flex items-center gap-3">
                                    <span className="material-icons text-primary text-2xl">verified_user</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm">
                                        {item.equipmentType}
                                        {(item.brand || item.model) && (
                                          <span className="text-muted-foreground font-normal"> - {item.brand} {item.model}</span>
                                        )}
                                      </div>
                                      {item.serialNumber && (
                                        <div className="text-xs font-mono text-muted-foreground">
                                          {t('harnessInspection.serialNumber', 'S/N')}: {item.serialNumber}
                                        </div>
                                      )}
                                    </div>
                                    <Badge variant="outline" className="text-xs bg-primary/10">{t('harnessInspection.myKit.badge', 'My Kit')}</Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Divider if both sections have items */}
                      {myKitItems.length > 0 && availableInventoryItems.length > 0 && (
                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              {t('harnessInspection.orFromInventory', 'or select from inventory')}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Full Inventory Section */}
                      {availableInventoryItems.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-muted-foreground">{t('harnessInspection.inventory.title', 'Company Inventory')}</h3>
                            <Badge variant="outline" className="ml-auto">{availableInventoryItems.length}</Badge>
                          </div>
                          <div className="grid gap-2">
                            {availableInventoryItems.map((harness: any) => (
                              <Card 
                                key={harness.id}
                                className="hover-elevate active-elevate-2 cursor-pointer"
                                onClick={() => handleHarnessSelection(harness)}
                                data-testid={`harness-card-${harness.id}`}
                              >
                                <CardContent className="p-3">
                                  <div className="flex items-center gap-3">
                                    <span className="material-icons text-muted-foreground text-2xl">safety_check</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm">
                                        {harness.equipmentType}
                                        {(harness.brand || harness.model) && (
                                          <span className="text-muted-foreground font-normal"> - {harness.brand} {harness.model}</span>
                                        )}
                                      </div>
                                      {harness.serialNumbers && harness.serialNumbers.length > 0 && (
                                        <div className="text-xs font-mono text-muted-foreground">
                                          {t('harnessInspection.serialNumber', 'S/N')}: {harness.serialNumbers[0]}
                                        </div>
                                      )}
                                    </div>
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : myKitItems.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground">
                            {t('harnessInspection.noEquipment', 'No equipment in inventory yet.')}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('harnessInspection.addHarnesses', 'Add harnesses to your inventory to inspect them.')}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </DialogContent>
                </Dialog>
                
                {/* Kit Inspection Mode Indicator */}
                {isKitInspectionMode && selectedKitItems.length > 0 && (
                  <Card className="border-2 border-primary bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                          <span className="material-icons text-primary text-xl">select_all</span>
                        </div>
                        <div>
                          <div className="font-semibold text-primary">
                            {t('harnessInspection.kitMode.title', 'Kit Inspection Mode')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t('harnessInspection.kitMode.description', 'All {{count}} items will be inspected together', { count: selectedKitItems.length })}
                          </div>
                        </div>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          className="ml-auto"
                          onClick={() => {
                            setIsKitInspectionMode(false);
                            setSelectedKitItems([]);
                            form.setValue("equipmentId", "");
                          }}
                          data-testid="button-clear-kit-selection"
                        >
                          {t('common.clear', 'Clear')}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedKitItems.map((item: any, index: number) => (
                          <Badge key={`selected-${item.assignmentId || index}`} variant="secondary" className="text-xs">
                            {item.equipmentType}
                            {item.serialNumber && ` (${item.serialNumber})`}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Gear Selection Dropdown for Autofill */}
                {availableInventoryItems.length > 0 && !isKitInspectionMode && (
                  <div className="bg-primary/5 border border-primary/20 rounded-md p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="material-icons text-primary mt-0.5">auto_awesome</span>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{t('harnessInspection.quickFill.title', 'Quick Fill from Inventory')}</div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {t('harnessInspection.quickFill.description', 'Select equipment from inventory to auto-fill details')}
                        </p>
                        <Select onValueChange={handleGearSelection} value={selectedGearId}>
                          <SelectTrigger data-testid="select-my-gear" className="bg-background">
                            <SelectValue placeholder={t('harnessInspection.quickFill.placeholder', 'Choose gear to autofill...')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t('harnessInspection.quickFill.none', 'None (enter manually)')}</SelectItem>
                            {availableInventoryItems.map((item: any) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.equipmentType} {item.brand ? `- ${item.brand}` : ""} {item.model ? item.model : ""} 
                                {item.serialNumbers && item.serialNumbers.length > 0 ? ` (${item.serialNumbers[0]})` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="inspectionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('harnessInspection.fields.inspectionDate', 'Inspection Date')}</FormLabel>
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
                        <FormLabel>{t('harnessInspection.fields.inspectorName', 'Inspector Name')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('harnessInspection.placeholders.fullName', 'Enter your full name')} data-testid="input-inspector-name" readOnly className="bg-muted" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Manufacturer and Equipment ID - Hidden in Kit Inspection Mode */}
                {!isKitInspectionMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('harnessInspection.fields.manufacturer', 'Primary Manufacturer')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('harnessInspection.placeholders.manufacturer', 'e.g., Petzl, Kong, CMC')} data-testid="input-manufacturer" />
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
                          <FormLabel>{t('harnessInspection.fields.equipmentId', 'Equipment ID / Serial Number')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('harnessInspection.placeholders.serialNumber', 'Serial or ID number')} data-testid="input-equipment-id" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className={`grid gap-4 ${isKitInspectionMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('harnessInspection.fields.project', 'Project (Optional)')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-project">
                              <SelectValue placeholder={t('harnessInspection.placeholders.selectProject', 'Select project')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">{t('harnessInspection.noProject', 'No project')}</SelectItem>
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

                  {/* Date in Service - Hidden in Kit Inspection Mode */}
                  {!isKitInspectionMode && (
                    <FormField
                      control={form.control}
                      name="dateInService"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('harnessInspection.fields.dateInService', 'Date Placed in Service')}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-date-in-service" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Equipment Categories */}
            <Card>
              <CardHeader>
                <CardTitle>{t('harnessInspection.equipmentInspection.title', 'Equipment Inspection')}</CardTitle>
                <CardDescription>
                  {t('harnessInspection.equipmentInspection.description', 'Inspect each equipment category. Mark items as Pass, Fail, or Not Applicable.')}
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
                                        {t('harnessInspection.status.pass', 'Pass')}
                                      </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="fail" id={`${categoryKey}-${item.key}-fail`} data-testid={`radio-${categoryKey}-${item.key}-fail`} />
                                      <label htmlFor={`${categoryKey}-${item.key}-fail`} className="text-sm font-medium cursor-pointer text-destructive">
                                        {t('harnessInspection.status.fail', 'Fail')}
                                      </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="not_applicable" id={`${categoryKey}-${item.key}-na`} data-testid={`radio-${categoryKey}-${item.key}-na`} />
                                      <label htmlFor={`${categoryKey}-${item.key}-na`} className="text-sm font-medium cursor-pointer text-muted-foreground">
                                        {t('harnessInspection.status.notApplicable', 'N/A')}
                                      </label>
                                    </div>
                                  </div>
                                </RadioGroup>

                                {result === "fail" && (
                                  <Textarea
                                    placeholder={t('harnessInspection.placeholders.describeIssue', 'Describe the issue...')}
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
                <CardTitle>{t('harnessInspection.comments.title', 'General Comments')}</CardTitle>
                <CardDescription>{t('harnessInspection.comments.description', 'Any additional notes or observations about the inspection')}</CardDescription>
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
                          placeholder={t('harnessInspection.placeholders.comments', 'Enter any additional comments or notes...')}
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
                onClick={handleNavigateBack}
                className="flex-1"
                data-testid="button-cancel"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
                data-testid="button-submit-inspection"
              >
                {isSubmitting ? t('harnessInspection.submitting', 'Submitting...') : t('harnessInspection.submitInspection', 'Submit Inspection')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

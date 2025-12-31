import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate } from "@/lib/dateUtils";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { TechnicianHeader } from "@/components/TechnicianHeader";
import {
  ArrowLeft,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";
import { getTechnicianNavGroups } from "@/lib/technicianNavigation";
import { ROPE_ACCESS_EQUIPMENT_CATEGORIES, ROPE_ACCESS_INSPECTION_ITEMS, type RopeAccessEquipmentCategory, type EquipmentFindings, type InspectionResult } from "@shared/schema";

const inspectionFormSchema = z.object({
  inspectionDate: z.string().min(1, "Inspection date is required"),
  inspectorName: z.string().min(1, "Inspector name is required"),
  manufacturer: z.string().optional(),
  equipmentId: z.string().optional(),
  dateInService: z.string().optional(),
  comments: z.string().optional(),
});

type InspectionFormData = z.infer<typeof inspectionFormSchema>;

export default function PersonalSafetyDocuments() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Mobile sidebar state for external control
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const [findings, setFindings] = useState<EquipmentFindings>(initializeFindings());

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;

  const { data: inspectionsData, isLoading: inspectionsLoading } = useQuery<{ inspections: any[] }>({
    queryKey: ["/api/personal-harness-inspections"],
  });

  const personalInspections = inspectionsData?.inspections || [];

  const localDate = new Date();
  const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

  const form = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      inspectionDate: today,
      inspectorName: currentUser?.name || "",
      manufacturer: "",
      equipmentId: "",
      dateInService: "",
      comments: "",
    },
  });

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

      const hasFailures = Object.values(newCategoryData.items).some(item => item.result === "fail");
      newCategoryData.status = hasFailures ? "fail" : "pass";

      return {
        ...prev,
        [category]: newCategoryData,
      };
    });
  };

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
      return apiRequest("POST", "/api/personal-harness-inspections", payload);
    },
    onSuccess: () => {
      toast({ 
        title: "Inspection saved", 
        description: "Your personal equipment inspection has been recorded." 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/personal-harness-inspections"] });
      setShowForm(false);
      setFindings(initializeFindings());
      form.reset({
        inspectionDate: today,
        inspectorName: currentUser?.name || "",
        manufacturer: "",
        equipmentId: "",
        dateInService: "",
        comments: "",
      });
      setIsSubmitting(false);
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

  const deleteInspection = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/personal-harness-inspections/${id}`);
    },
    onSuccess: () => {
      toast({ title: t("personalSafetyDocuments.inspectionDeleted") });
      queryClient.invalidateQueries({ queryKey: ["/api/personal-harness-inspections"] });
    },
    onError: (error: Error) => {
      toast({ title: t("personalSafetyDocuments.deleteFailed"), description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = async (data: InspectionFormData) => {
    setIsSubmitting(true);
    submitInspection.mutate(data);
  };

  const downloadInspectionPDF = (inspection: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const bottomMargin = 25;
    let yPosition = 20;

    const checkPageBreak = (requiredSpace: number = 15): void => {
      if (yPosition > pageHeight - bottomMargin - requiredSpace) {
        doc.addPage();
        yPosition = 20;
      }
    };

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PERSONAL EQUIPMENT INSPECTION', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Personal Safety Record', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Inspection Details', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const addField = (label: string, value: string) => {
      checkPageBreak(8);
      doc.setTextColor(80, 80, 80);
      doc.text(`${label}:`, margin, yPosition);
      doc.setTextColor(30, 30, 30);
      doc.text(value || 'N/A', margin + 40, yPosition);
      yPosition += 6;
    };

    addField('Date', formatLocalDate(inspection.inspectionDate));
    addField('Inspector', inspection.inspectorName);
    addField('Equipment ID', inspection.equipmentId);
    addField('Manufacturer', inspection.manufacturer);
    addField('In Service', inspection.dateInService);
    yPosition += 5;

    doc.setFont('helvetica', 'bold');
    const statusText = inspection.overallStatus === 'pass' ? 'PASS' : 'FAIL';
    const statusColor = inspection.overallStatus === 'pass' ? [34, 197, 94] : [239, 68, 68];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`Overall Status: ${statusText}`, margin, yPosition);
    yPosition += 10;

    doc.setTextColor(30, 30, 30);
    if (inspection.equipmentFindings) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Inspection Findings', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      Object.entries(inspection.equipmentFindings).forEach(([categoryKey, categoryData]: [string, any]) => {
        checkPageBreak(15);

        const categoryName = ROPE_ACCESS_EQUIPMENT_CATEGORIES[categoryKey as RopeAccessEquipmentCategory] || categoryKey;
        doc.setFont('helvetica', 'bold');
        doc.text(categoryName, margin, yPosition);
        yPosition += 5;

        doc.setFont('helvetica', 'normal');
        Object.entries(categoryData.items || {}).forEach(([itemKey, itemData]: [string, any]) => {
          checkPageBreak(12);
          
          const itemDef = ROPE_ACCESS_INSPECTION_ITEMS[categoryKey as RopeAccessEquipmentCategory]?.find(i => i.key === itemKey);
          const itemLabel = itemDef?.label || itemKey;
          const result = itemData.result === 'pass' ? 'Pass' : itemData.result === 'fail' ? 'FAIL' : 'N/A';
          
          if (itemData.result === 'fail') {
            doc.setTextColor(239, 68, 68);
          } else {
            doc.setTextColor(30, 30, 30);
          }
          doc.text(`  - ${itemLabel}: ${result}`, margin + 5, yPosition);
          yPosition += 4;

          if (itemData.notes) {
            doc.setTextColor(100, 100, 100);
            const wrappedNotes = doc.splitTextToSize(`Notes: ${itemData.notes}`, pageWidth - margin * 2 - 15);
            wrappedNotes.forEach((line: string) => {
              checkPageBreak(5);
              doc.text(`    ${line}`, margin + 10, yPosition);
              yPosition += 4;
            });
          }
        });
        yPosition += 3;
      });
    }

    if (inspection.comments) {
      checkPageBreak(20);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text('Comments:', margin, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const splitComments = doc.splitTextToSize(inspection.comments, pageWidth - margin * 2);
      splitComments.forEach((line: string) => {
        checkPageBreak(5);
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
    }

    doc.save(`Personal_Inspection_${inspection.inspectionDate}.pdf`);
  };

  const { i18n } = useTranslation();
  const language = i18n.language as 'en' | 'fr' | 'es';

  const technicianNavGroups = getTechnicianNavGroups(language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Sidebar - Desktop fixed, Mobile hamburger menu */}
      <DashboardSidebar
        currentUser={currentUser}
        activeTab="personal-safety-docs"
        onTabChange={() => {}}
        variant="technician"
        customNavigationGroups={technicianNavGroups}
        showDashboardLink={false}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />
      
      <div className="lg:pl-60">
        <TechnicianHeader 
          language={language} 
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">

        <Card className="mb-4 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Personal Records Only</p>
                <p className="text-sm text-muted-foreground">
                  These inspections are for your personal records and are not linked to any employer. 
                  Use this to track your own equipment when working independently or for personal documentation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {!showForm ? (
          <>
            <Button
              onClick={() => setShowForm(true)}
              className="w-full mb-6 h-12"
              data-testid="button-new-inspection"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Equipment Inspection
            </Button>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your Inspections</h2>
              
              {inspectionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : personalInspections.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No personal inspections yet</p>
                    <p className="text-sm text-muted-foreground">Create your first equipment inspection above</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {personalInspections.map((inspection: any) => (
                    <Card key={inspection.id} className="hover-elevate">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{formatLocalDate(inspection.inspectionDate)}</p>
                              <Badge 
                                variant={inspection.overallStatus === 'pass' ? 'default' : 'destructive'}
                                className={inspection.overallStatus === 'pass' ? 'bg-green-500' : ''}
                              >
                                {inspection.overallStatus === 'pass' ? 'Pass' : 'Fail'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {inspection.manufacturer || 'No manufacturer'} - {inspection.equipmentId || 'No ID'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Inspector: {inspection.inspectorName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => downloadInspectionPDF(inspection)}
                              data-testid={`button-download-inspection-${inspection.id}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  data-testid={`button-delete-inspection-${inspection.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t('personalSafetyDocuments.deleteInspection', 'Delete Inspection?')}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t('personalSafetyDocuments.deleteConfirmMessage', 'This will permanently delete this inspection record.')} {t('common.cannotBeUndone', 'This action cannot be undone.')}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteInspection.mutate(inspection.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {t('common.delete', 'Delete')}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('personalSafetyDocuments.newInspection', 'New Inspection')}</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFindings(initializeFindings());
                }}
                data-testid="button-cancel-inspection"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
            </div>

            {failedItems > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-5 w-5" />
                <AlertDescription>
                  <div className="font-semibold mb-2">
                    {failedItems} failed item(s) detected across {failedCategories.length} category(ies)
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
                              <Input {...field} data-testid="input-inspector-name" />
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
                            <FormLabel>Manufacturer / Model</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Petzl Astro" {...field} data-testid="input-manufacturer" />
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
                            <FormLabel>Equipment ID / Serial</FormLabel>
                            <FormControl>
                              <Input placeholder="Serial number" {...field} data-testid="input-equipment-id" />
                            </FormControl>
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
                          <FormLabel>Date In Service</FormLabel>
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
                      <ClipboardCheck className="h-5 w-5" />
                      Equipment Inspection Checklist
                    </CardTitle>
                    <CardDescription>
                      Inspect each category and mark items as pass or fail
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full" defaultValue={Object.keys(ROPE_ACCESS_EQUIPMENT_CATEGORIES)}>
                      {(Object.keys(ROPE_ACCESS_EQUIPMENT_CATEGORIES) as RopeAccessEquipmentCategory[]).map((categoryKey) => {
                        const categoryName = ROPE_ACCESS_EQUIPMENT_CATEGORIES[categoryKey];
                        const items = ROPE_ACCESS_INSPECTION_ITEMS[categoryKey];
                        const categoryData = findings[categoryKey];
                        const hasFailures = categoryData?.status === "fail";

                        return (
                          <AccordionItem key={categoryKey} value={categoryKey}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3">
                                <span>{categoryName}</span>
                                {hasFailures ? (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Issues Found
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    OK
                                  </Badge>
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-2">
                                {items.map((item) => {
                                  const itemData = categoryData?.items?.[item.key];
                                  return (
                                    <div key={item.key} className="space-y-2 p-3 rounded-lg bg-muted/50">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                          <p className="font-medium text-sm">{item.label}</p>
                                        </div>
                                        <RadioGroup
                                          value={itemData?.result || "pass"}
                                          onValueChange={(value) => setItemResult(categoryKey, item.key, value as InspectionResult)}
                                          className="flex gap-3"
                                        >
                                          <div className="flex items-center space-x-1">
                                            <RadioGroupItem value="pass" id={`${categoryKey}-${item.key}-pass`} />
                                            <label 
                                              htmlFor={`${categoryKey}-${item.key}-pass`}
                                              className="text-sm text-green-600 cursor-pointer"
                                            >
                                              Pass
                                            </label>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <RadioGroupItem value="fail" id={`${categoryKey}-${item.key}-fail`} />
                                            <label 
                                              htmlFor={`${categoryKey}-${item.key}-fail`}
                                              className="text-sm text-destructive cursor-pointer"
                                            >
                                              Fail
                                            </label>
                                          </div>
                                        </RadioGroup>
                                      </div>
                                      {itemData?.result === "fail" && (
                                        <Input
                                          placeholder="Notes about the issue..."
                                          value={itemData?.notes || ""}
                                          onChange={(e) => setItemNotes(categoryKey, item.key, e.target.value)}
                                          className="text-sm"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Any additional notes or observations..."
                              {...field}
                              data-testid="input-comments"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {overallStatus === "pass" ? (
                      <>
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="font-semibold text-green-600">All Checks Passed</p>
                          <p className="text-sm text-muted-foreground">Equipment is safe for use</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                        <div>
                          <p className="font-semibold text-destructive">Issues Detected</p>
                          <p className="text-sm text-muted-foreground">{failedItems} item(s) require attention</p>
                        </div>
                      </>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    size="lg"
                    data-testid="button-submit-inspection"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ClipboardCheck className="w-4 h-4 mr-2" />
                        Save Inspection
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
          </div>
        </main>
      </div>
    </div>
  );
}

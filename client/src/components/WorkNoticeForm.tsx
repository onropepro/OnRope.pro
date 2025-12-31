import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { JOB_TYPES, getJobTypeConfig } from "@shared/jobTypes";
import type { Project, WorkNotice } from "@shared/schema";

interface WorkNoticeFormProps {
  project: Project;
  existingNotice?: WorkNotice;
  onClose: () => void;
  onSuccess?: () => void;
}

const workNoticeFormSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  noticeTitle: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  noticeDetails: z.string().min(1, "Notice details are required"),
  additionalInstructions: z.string().optional(),
  propertyManagerName: z.string().optional(),
  unitSchedule: z.array(z.object({
    date: z.string(),
    slots: z.array(z.object({
      startTime: z.string(),
      endTime: z.string(),
      units: z.string(), // comma-separated units or stalls
    })),
  })).optional(),
});

type WorkNoticeFormData = z.infer<typeof workNoticeFormSchema>;

// Schedule entry type for in-suite and parkade jobs
interface ScheduleSlot {
  startTime: string;
  endTime: string;
  units: string;
}

interface ScheduleDay {
  date: string;
  slots: ScheduleSlot[];
}

const NOTICE_TEMPLATES: Record<string, { title: string; details: string }[]> = {
  window_cleaning: [
    {
      title: "Window Cleaning Notice - Privacy Advisory",
      details: `Dear Residents,

Professional window cleaning services are scheduled for your building. Our certified rope access technicians will be working on suspended ropes cleaning the exterior glass surfaces of all windows.

PRIVACY NOTICE:
For your privacy and comfort, we strongly recommend closing your blinds, curtains, or window coverings during the scheduled work hours. Our technicians are trained professionals focused on their work, but you may prefer additional privacy.

SAFETY REQUIREMENTS:
- Please keep all windows closed and locked during work hours
- Keep balcony doors closed to prevent water or cleaning solution entry
- Secure any loose items on balconies

We appreciate your cooperation and understanding. If you have any concerns, please contact your property manager.`,
    },
    {
      title: "Exterior Window Maintenance",
      details: `Dear Residents,

Scheduled exterior window cleaning will be performed by our professional rope access team. Technicians secured by safety ropes will be working outside your windows.

RESIDENT PRIVACY:
We understand your privacy is important. Please close your blinds or curtains during work hours if you prefer not to be visible from outside. Our team will move efficiently to minimize time spent at each window.

IMPORTANT REMINDERS:
- All windows must remain closed during the work period
- Do not open balcony doors or attempt to speak with workers
- Remove or secure items from window sills and balconies
- Some water spotting on windows is normal immediately after cleaning

Thank you for your patience and cooperation.`,
    },
    {
      title: "High-Rise Window Cleaning - Rope Access Work",
      details: `Dear Residents,

Our building maintenance program includes professional exterior window cleaning using rope access methods. Trained technicians will descend the building facade on safety ropes to clean all exterior glass.

PRIVACY CONSIDERATIONS:
Technicians will be positioned outside your windows during cleaning. For your comfort, please consider closing window coverings during work hours. Workers are focused on their safety and cleaning tasks.

WHAT TO EXPECT:
- Technicians visible outside windows at various times
- Sound of equipment and water on glass
- Brief presence at each window (typically 2-5 minutes)
- Possible minor water spots that will clear

Please keep windows closed throughout the cleaning period. Contact the property manager with any questions.`,
    },
  ],
  dryer_vent_cleaning: [
    {
      title: "Exterior Dryer Vent Cleaning - Fire Prevention",
      details: `Dear Residents,

Professional exterior dryer vent cleaning services are scheduled for your building. This critical maintenance helps prevent dryer fires caused by lint buildup and improves your dryer's efficiency.

WHAT WE WILL BE DOING:
Our certified rope access technicians will clean the exterior dryer vent exhaust points on the building facade. This involves:
- Removing lint buildup from exterior vent covers
- Clearing any blockages in the exhaust outlet
- Inspecting vent condition and airflow

NO ACCESS TO YOUR UNIT IS REQUIRED. All work is performed from outside the building.

WHAT TO EXPECT:
- Technicians on ropes near balconies and vent locations
- Brief equipment noise during cleaning
- Some lint debris may fall during cleaning (will be cleaned up)

BENEFITS:
- Reduced fire risk from lint buildup
- Improved dryer efficiency and faster drying times
- Lower energy costs
- Extended dryer lifespan

No action is required from residents. Thank you for your cooperation.`,
    },
    {
      title: "Scheduled Dryer Vent Maintenance",
      details: `Dear Residents,

Your building's exterior dryer vents will be professionally cleaned on the scheduled dates. This routine maintenance is essential for fire safety and dryer performance.

OUR TECHNICIANS WILL:
- Access exterior vent locations using rope access equipment
- Remove accumulated lint from vent openings
- Ensure proper airflow from your dryer exhaust

RESIDENT INFORMATION:
- No unit access needed - all work is external
- You may notice technicians near your balcony or windows
- Brief noise from cleaning tools is expected
- Work typically takes a few minutes per vent

This maintenance helps prevent the leading cause of household fires. We appreciate your patience.`,
    },
  ],
  building_wash: [
    {
      title: "Building Pressure Washing - Privacy & Safety Notice",
      details: `Dear Residents,

Professional pressure washing services are scheduled to clean your building's exterior facade. Our rope access technicians will be working on suspended ropes with high-pressure cleaning equipment.

PRIVACY ADVISORY:
Technicians will be positioned outside windows and balconies during this work. For your privacy, we recommend closing blinds and curtains during the scheduled hours. Workers are professionals focused on their cleaning tasks.

MANDATORY REQUIREMENTS:
- Close and lock ALL windows tightly
- Close all balcony and patio doors completely
- Bring in or secure all balcony furniture, plants, and decorations
- Remove items from window sills
- Do not attempt to open doors or windows during work

WHAT TO EXPECT:
- High-pressure water noise
- Technicians visible outside your unit
- Possible overspray - keep windows sealed
- Some areas may be temporarily restricted

Failure to close windows may result in water damage to your unit.

We appreciate your full cooperation for this important building maintenance.`,
    },
    {
      title: "Facade Cleaning Notice",
      details: `Dear Residents,

Professional building washing services are scheduled. Workers will be on ropes cleaning the building exterior with pressure washing equipment.

IMPORTANT - PLEASE READ:
- Close ALL windows and balcony doors - water will spray near your unit
- Secure or remove all balcony items
- Close blinds for privacy as workers will be outside windows
- Do not open windows or doors during work hours

This cleaning maintains your building's appearance and prevents long-term damage. Thank you for your cooperation.`,
    },
    {
      title: "Exterior Building Wash - Rope Access Work",
      details: `Dear Residents,

Your building is scheduled for exterior cleaning. Our certified rope access team will pressure wash the facade, balconies, and common areas.

RESIDENT REQUIREMENTS:
1. Windows: Close and lock all windows before the start date
2. Balconies: Remove all personal items, furniture, and plants
3. Privacy: Close blinds/curtains as technicians work outside units
4. Doors: Keep all balcony doors closed and locked

HIGH-PRESSURE WATER WARNING:
Any open windows or doors will result in water entering your unit. Please verify all openings are sealed.

Contact property management if you need assistance securing your balcony items.

Thank you for helping maintain our building.`,
    },
  ],
  gutter_cleaning: [
    {
      title: "Gutter Cleaning Notice",
      details: `Dear Residents,

Our team will be on site to clean and inspect the building gutters. This helps prevent water damage and maintains proper drainage.

Workers may be visible from upper floor windows during this maintenance. No action is required from residents, but please be aware of activity near the roofline.

Thank you for your understanding.`,
    },
  ],
  in_suite_dryer_vent_cleaning: [
    {
      title: "In-Suite Dryer Vent Cleaning - Access Required",
      details: `Dear Residents,

Professional in-suite dryer vent cleaning has been scheduled for your building. Our certified technicians will need to enter your unit to clean the dryer vent from inside.

WHY THIS IS IMPORTANT:
Lint buildup inside dryer vents is a leading cause of household fires. Regular cleaning also improves your dryer's efficiency and reduces energy costs.

ACCESS REQUIREMENTS:
Our technicians will need access to:
- Your laundry area
- The dryer and the wall/ceiling vent connection
- The vent ductwork running through your unit

PLEASE PREPARE BY:
1. Ensuring clear access to your dryer (move any items blocking the area)
2. Pulling the dryer away from the wall if possible (technicians can assist)
3. Being home during your scheduled appointment OR arranging alternate access
4. Ensuring pets are secured

APPOINTMENT SCHEDULING:
You will receive a separate notice with your specific appointment date and time window. If the scheduled time does not work, please contact property management to reschedule.

WHAT TO EXPECT:
- The cleaning takes approximately 20-30 minutes per unit
- There may be brief noise from cleaning equipment
- Some lint and debris removal is normal

Thank you for your cooperation in this important fire safety maintenance.`,
    },
    {
      title: "Dryer Vent Cleaning - Unit Entry Notice",
      details: `Dear Residents,

Scheduled dryer vent cleaning will be performed inside all units. Technicians require entry to your suite to complete this service.

SERVICE DETAILS:
- Full cleaning of dryer vent ductwork from inside your unit
- Inspection of vent connections and condition
- Removal of lint buildup throughout the vent system

RESIDENT PREPARATION:
- Clear access path to your laundry area
- Secure pets in a separate room
- Be present or provide access authorization

You will receive your scheduled time slot in a separate notice. This maintenance is mandatory for fire safety compliance.`,
    },
    {
      title: "Annual Dryer Vent Service - Suite Access",
      details: `Dear Residents,

As part of our annual fire prevention program, professional dryer vent cleaning will be conducted in all units.

WHAT THE SERVICE INCLUDES:
- Complete lint removal from interior ductwork

YOUR RESPONSIBILITIES:
- Provide access to your unit at the scheduled time
- Clear the area around your dryer
- Ensure someone is home or arrange building access

This service helps protect you and your neighbors from dryer-related fires. Appointment times will be provided separately.`,
    },
  ],
  parkade_pressure_cleaning: [
    {
      title: "Parkade Cleaning Notice",
      details: `Dear Residents,

The parking garage will be pressure washed during the scheduled dates.

VEHICLE REMOVAL REQUIRED:
Please move your vehicle from the parkade during the cleaning period. Failure to move your vehicle may result in it being wet or splashed with cleaning solution.

Thank you for your cooperation.`,
    },
  ],
  painting: [
    {
      title: "Exterior Painting Notice - Rope Access Work",
      details: `Dear Residents,

Professional painters will be working on the exterior of your building using rope access methods.

PRIVACY NOTICE:
Painters will be positioned outside your windows while working. Close blinds or curtains for privacy if preferred.

IMPORTANT REQUIREMENTS:
- Keep all windows closed - paint fumes and overspray possible
- Do not touch or lean against freshly painted surfaces
- Keep balcony doors closed during work hours

There may be paint odors during and after work hours. Please ensure good ventilation inside your unit.

Thank you for your patience.`,
    },
  ],
  caulking: [
    {
      title: "Caulking and Sealing Notice",
      details: `Dear Residents,

Our team will be performing caulking and sealing work on the building exterior. This helps prevent water infiltration and improves energy efficiency.

Workers will be on ropes near windows and balconies. For your privacy, please close blinds or curtains during work hours.

Keep windows closed as workers may be applying sealants near openings.

Thank you for your cooperation.`,
    },
  ],
  inspection: [
    {
      title: "Building Inspection Notice",
      details: `Dear Residents,

A scheduled building inspection will take place. Our inspectors will be examining the building exterior and may be visible from your windows.

This is routine maintenance inspection. No action is required from residents.

Please close blinds if you prefer privacy during the inspection period.`,
    },
  ],
  general_pressure_washing: [
    {
      title: "Pressure Washing Notice - Privacy Advisory",
      details: `Dear Residents,

General pressure washing services are scheduled. Our rope access team will be cleaning exterior surfaces.

REQUIREMENTS:
- Close all windows and balcony doors
- Secure or remove outdoor items
- Close blinds for privacy as workers will be near windows

There may be water spray and noise during the work.

Thank you for your cooperation.`,
    },
  ],
  ground_window_cleaning: [
    {
      title: "Ground Level Window Cleaning",
      details: `Dear Residents,

Our team will be cleaning ground floor and accessible windows.

Please be aware of workers and cleaning equipment near entrances and ground-level units. Close blinds if you prefer privacy.

We appreciate your patience.`,
    },
  ],
  anchor_inspection: [
    {
      title: "Rope Access Anchor Inspection",
      details: `Dear Residents,

A scheduled inspection of the building's rope access anchor points will take place. Inspectors may be visible on the roof and exterior.

This is important safety maintenance ensuring our building meets all safety requirements. No action is required from residents.`,
    },
  ],
  balcony_pressure_washing: [
    {
      title: "Balcony Pressure Washing - Preparation Required",
      details: `Dear Residents,

Professional balcony pressure washing services are scheduled for your building. Our rope access technicians will be cleaning all balcony surfaces including floors, railings, and dividers.

MANDATORY PREPARATION - PLEASE COMPLETE BEFORE WORK BEGINS:
1. REMOVE all items from your balcony including:
   - Furniture (chairs, tables, loungers)
   - Plants and planters
   - BBQ/grills (if permitted)
   - Rugs, mats, and decorations
   - Storage containers and personal items

2. SECURE your balcony:
   - Close and lock balcony doors during work hours
   - Close blinds or curtains for privacy
   - Keep windows near balcony closed

WHAT TO EXPECT:
- High-pressure water will be used to clean balcony surfaces
- Technicians will be visible on ropes and may access your balcony
- Significant noise from pressure washing equipment
- Water may temporarily pool on balcony surfaces
- Work takes approximately 10-15 minutes per balcony

ITEMS LEFT ON BALCONIES:
Any items remaining on balconies may be damaged by high-pressure water or cleaning solutions. The building is not responsible for damage to items left on balconies.

After cleaning is complete, you may return items to your balcony once surfaces are dry (typically 1-2 hours).

Thank you for your cooperation.`,
    },
    {
      title: "Balcony Cleaning Notice - Clear Your Balcony",
      details: `Dear Residents,

Your building's balconies will be pressure washed by our professional cleaning team.

ACTION REQUIRED:
Please remove ALL items from your balcony before the scheduled start date:
- All furniture and seating
- Plants, pots, and garden items  
- Personal belongings and decorations
- Floor mats and rugs
- Any loose items

DURING THE WORK:
- Keep balcony doors closed and locked
- Close window coverings for privacy
- Technicians will be working outside your balcony

Items left on balconies will be moved and may be damaged. Please prepare your balcony in advance.`,
    },
    {
      title: "Exterior Balcony Maintenance",
      details: `Dear Residents,

Scheduled balcony pressure washing will be performed. This maintenance removes dirt, mildew, and debris to maintain your building's appearance and prevent surface damage.

RESIDENT REQUIREMENTS:
- Clear all personal items from balcony before work begins
- Keep balcony doors sealed during cleaning
- Allow 1-2 hours drying time before using balcony

Technicians will access balconies from ropes. Please close blinds if you prefer privacy.

We appreciate your cooperation in preparing your balcony.`,
    },
  ],
  other: [
    {
      title: "Scheduled Building Maintenance",
      details: `Dear Residents,

Professional maintenance work has been scheduled for your building. Our trained technicians will be on site during the scheduled dates.

WHAT TO EXPECT:
- Workers may be visible from windows and balconies
- Some noise from equipment is expected
- Work areas may be temporarily restricted

FOR YOUR PRIVACY:
Close blinds or curtains if you prefer not to be visible from outside during work hours.

GENERAL PRECAUTIONS:
- Keep windows closed during work unless advised otherwise
- Secure balcony items if work is being done on exterior surfaces
- Follow any specific instructions from property management

Thank you for your patience and cooperation during this maintenance work.`,
    },
    {
      title: "Building Maintenance Notice",
      details: `Dear Residents,

Maintenance work will be performed on your building. Our professional team will be on site during the scheduled period.

Workers may be visible near windows and common areas. Please close window coverings for privacy if preferred.

If you have questions, please contact your property manager.

We appreciate your understanding.`,
    },
    {
      title: "Exterior Work Notice",
      details: `Dear Residents,

Exterior maintenance work is scheduled for your building. Technicians will be working on the building facade during the scheduled dates.

RESIDENT GUIDELINES:
- Keep windows closed during work hours
- Close blinds for privacy as workers may be near windows
- Secure any loose balcony items

No unit access is required. Thank you for your cooperation.`,
    },
  ],
};

const DEFAULT_TEMPLATE = {
  title: "Scheduled Work Notice",
  details: "Professional maintenance work will be performed on your building. Our team will be on site during the scheduled dates. We appreciate your patience and cooperation.",
};

export function WorkNoticeForm({ project, existingNotice, onClose, onSuccess }: WorkNoticeFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [savedNoticeData, setSavedNoticeData] = useState<{ title: string; details: string } | null>(null);
  
  // Fetch clients to get property manager name for this project's strata plan
  const { data: clientsResponse } = useQuery<{ clients: any[] }>({
    queryKey: ["/api/clients"],
  });
  
  // Fetch custom notice templates
  const { data: customTemplatesData } = useQuery<{ templates: any[] }>({
    queryKey: ["/api/custom-notice-templates"],
  });
  
  // Find the client associated with this project's strata plan number
  const getPropertyManagerName = (): string => {
    if (existingNotice?.propertyManagerName) return existingNotice.propertyManagerName;
    if ((project as any).propertyManagerName) return (project as any).propertyManagerName;
    
    // Try to find from clients data
    const clients = clientsResponse?.clients || [];
    for (const client of clients) {
      const lmsNumbers = client.lmsNumbers || [];
      const hasMatchingStrata = lmsNumbers.some((lms: any) => 
        lms.number === project.strataPlanNumber
      );
      if (hasMatchingStrata) {
        return `${client.firstName || ''} ${client.lastName || ''}`.trim();
      }
    }
    return "";
  };
  
  // Check if this job type needs scheduling (unit/stall or elevation-based)
  const needsUnitSchedule = project.jobType === 'in_suite_dryer_vent_cleaning' || project.jobType === 'parkade_pressure_cleaning';
  const needsElevationSchedule = project.jobType === 'window_cleaning' || project.jobType === 'building_wash' || project.jobType === 'building_wash_pressure' || project.jobType === 'general_pressure_washing';
  const needsSchedule = needsUnitSchedule || needsElevationSchedule;
  
  // Determine label based on job type
  const getScheduleLabel = () => {
    if (project.jobType === 'parkade_pressure_cleaning') return 'Stall';
    if (needsElevationSchedule) return 'Elevation';
    return 'Unit';
  };
  const scheduleLabel = getScheduleLabel();
  
  // Schedule state for in-suite and parkade jobs
  const [schedule, setSchedule] = useState<ScheduleDay[]>(() => {
    if (existingNotice?.unitSchedule) {
      try {
        return existingNotice.unitSchedule as ScheduleDay[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const jobTypeConfig = getJobTypeConfig(project.jobType);
  const jobTypeName = project.customJobType || jobTypeConfig?.label || project.jobType;
  const templates = NOTICE_TEMPLATES[project.jobType] || NOTICE_TEMPLATES.other;
  
  // Get the property manager name (may update when clients data loads)
  const propertyManagerName = getPropertyManagerName();

  const form = useForm<WorkNoticeFormData>({
    resolver: zodResolver(workNoticeFormSchema),
    defaultValues: {
      startDate: existingNotice?.startDate || project.startDate || "",
      endDate: existingNotice?.endDate || project.endDate || "",
      noticeTitle: existingNotice?.noticeTitle || "",
      noticeDetails: existingNotice?.noticeDetails || "",
      additionalInstructions: existingNotice?.additionalInstructions || "",
      propertyManagerName: "",
    },
  });
  
  // Update property manager name when clients data loads
  useEffect(() => {
    if (propertyManagerName && !form.getValues("propertyManagerName")) {
      form.setValue("propertyManagerName", propertyManagerName);
    }
  }, [propertyManagerName, form]);

  const createNoticeMutation = useMutation({
    mutationFn: async (data: WorkNoticeFormData) => {
      return apiRequest("POST", `/api/projects/${project.id}/work-notices`, data);
    },
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id, "work-notices"] });
      toast({ title: t("workNotice.created"), description: t("workNotice.createdDescription") });
      onSuccess?.();
      
      // If no template was used, ask if they want to save as template
      if (!selectedTemplate && variables.noticeTitle && variables.noticeDetails) {
        setSavedNoticeData({ title: variables.noticeTitle, details: variables.noticeDetails });
        setShowSaveTemplateDialog(true);
      } else {
        onClose();
      }
    },
    onError: (error: Error) => {
      toast({ title: t("workNotice.error"), description: error.message, variant: "destructive" });
    },
  });
  
  const saveTemplateMutation = useMutation({
    mutationFn: async (data: { jobType: string; title: string; details: string }) => {
      return apiRequest("POST", "/api/custom-notice-templates", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/custom-notice-templates"] });
      toast({ title: t("workNotice.templateSaved"), description: t("workNotice.templateSavedDescription") });
      setShowSaveTemplateDialog(false);
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: t("workNotice.error"), description: error.message, variant: "destructive" });
    },
  });

  const updateNoticeMutation = useMutation({
    mutationFn: async (data: WorkNoticeFormData) => {
      return apiRequest("PATCH", `/api/work-notices/${existingNotice!.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id, "work-notices"] });
      toast({ title: t("workNotice.updated") });
      onSuccess?.();
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: t("workNotice.error"), description: error.message, variant: "destructive" });
    },
  });

  const handleTemplateSelect = (index: number) => {
    const template = templates[index];
    if (template) {
      form.setValue("noticeTitle", template.title);
      form.setValue("noticeDetails", template.details);
      setSelectedTemplate(`builtin-${index}`);
    }
  };
  
  const handleCustomTemplateSelect = (template: { id: string; title: string; details: string }) => {
    form.setValue("noticeTitle", template.title);
    form.setValue("noticeDetails", template.details);
    setSelectedTemplate(`custom-${template.id}`);
  };
  
  // Get custom templates for this job type
  const customTemplates = (customTemplatesData?.templates || []).filter(
    (t: any) => t.jobType === project.jobType
  );

  const onSubmit = (data: WorkNoticeFormData) => {
    // Include schedule data for in-suite and parkade jobs
    const submitData = needsSchedule ? { ...data, unitSchedule: schedule } : data;
    
    if (existingNotice) {
      updateNoticeMutation.mutate(submitData);
    } else {
      createNoticeMutation.mutate(submitData);
    }
  };
  
  // Schedule management functions
  const addScheduleDay = () => {
    const defaultSlot = needsElevationSchedule 
      ? { startTime: '', endTime: '', units: '' }
      : { startTime: '09:00', endTime: '12:00', units: '' };
    setSchedule([...schedule, { date: '', slots: [defaultSlot] }]);
  };
  
  const removeScheduleDay = (dayIndex: number) => {
    setSchedule(schedule.filter((_, i) => i !== dayIndex));
  };
  
  const updateScheduleDay = (dayIndex: number, date: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].date = date;
    setSchedule(newSchedule);
  };
  
  const addSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const newSlot = needsElevationSchedule 
      ? { startTime: '', endTime: '', units: '' }
      : { startTime: '09:00', endTime: '12:00', units: '' };
    newSchedule[dayIndex].slots.push(newSlot);
    setSchedule(newSchedule);
  };
  
  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots = newSchedule[dayIndex].slots.filter((_, i) => i !== slotIndex);
    setSchedule(newSchedule);
  };
  
  const updateSlot = (dayIndex: number, slotIndex: number, field: keyof ScheduleSlot, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[slotIndex][field] = value;
    setSchedule(newSchedule);
  };

  const isSubmitting = createNoticeMutation.isPending || updateNoticeMutation.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="material-icons text-muted-foreground">info</span>
            Project Information (Auto-filled)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-muted-foreground">Building:</span>
              <span className="ml-2 font-medium">{project.buildingName || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Strata:</span>
              <span className="ml-2 font-medium">{project.strataPlanNumber || "N/A"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Address:</span>
              <span className="ml-2 font-medium">{project.buildingAddress || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Job Type:</span>
              <span className="ml-2">
                <Badge variant="secondary">{jobTypeName}</Badge>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Label className="text-sm font-medium mb-3 block">Quick Templates</Label>
        <div className="flex flex-wrap gap-2">
          {templates.map((template, index) => (
            <Button
              key={`builtin-${index}`}
              type="button"
              variant={selectedTemplate === `builtin-${index}` ? "default" : "outline"}
              size="sm"
              onClick={() => handleTemplateSelect(index)}
              data-testid={`button-template-${index}`}
            >
              {template.title}
            </Button>
          ))}
          {customTemplates.map((template: any) => (
            <Button
              key={`custom-${template.id}`}
              type="button"
              variant={selectedTemplate === `custom-${template.id}` ? "default" : "outline"}
              size="sm"
              onClick={() => handleCustomTemplateSelect(template)}
              data-testid={`button-custom-template-${template.id}`}
              className="border-dashed"
            >
              <span className="material-icons text-xs mr-1">star</span>
              {template.title}
            </Button>
          ))}
        </div>
        {customTemplates.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            <span className="material-icons text-xs align-middle mr-1">star</span>
            Custom templates you've saved
          </p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="propertyManagerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Manager Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} className="h-12" data-testid="input-property-manager" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-12" data-testid="input-start-date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-12" data-testid="input-end-date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="noticeTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Title</FormLabel>
                <FormControl>
                  <Input placeholder="Window Cleaning Notice" {...field} className="h-12" data-testid="input-notice-title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="noticeDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter the notice details that will be shown to residents..."
                    className="min-h-32 resize-y"
                    {...field}
                    data-testid="textarea-notice-details"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Instructions (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional instructions for residents..."
                    className="min-h-20 resize-y"
                    {...field}
                    data-testid="textarea-additional-instructions"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {needsSchedule && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-primary">schedule</span>
                    {needsElevationSchedule ? 'Work Schedule by Elevation' : `${scheduleLabel} Schedule`}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addScheduleDay}
                    data-testid="button-add-schedule-day"
                  >
                    <span className="material-icons mr-1 text-sm">add</span>
                    Add Day
                  </Button>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {needsElevationSchedule 
                    ? 'Specify which elevations (North, South, East, West) will be worked on each day' 
                    : `Specify which ${scheduleLabel.toLowerCase()}s will be serviced on which days and times`}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedule.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border border-dashed rounded-md">
                    <span className="material-icons text-3xl mb-2 block">event_note</span>
                    <p>No schedule entries yet</p>
                    <p className="text-sm">Click "Add Day" to create a schedule for residents</p>
                  </div>
                ) : (
                  schedule.map((day, dayIndex) => (
                    <Card key={dayIndex} className="bg-muted/30">
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground">Date</Label>
                            <Input
                              type="date"
                              value={day.date}
                              onChange={(e) => updateScheduleDay(dayIndex, e.target.value)}
                              className="h-9"
                              data-testid={`input-schedule-date-${dayIndex}`}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeScheduleDay(dayIndex)}
                            className="mt-5"
                            data-testid={`button-remove-day-${dayIndex}`}
                          >
                            <span className="material-icons text-destructive">delete</span>
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">
                              {needsElevationSchedule ? 'Elevation Details' : 'Time Slots'}
                            </Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => addSlot(dayIndex)}
                              className="h-7 text-xs"
                              data-testid={`button-add-slot-${dayIndex}`}
                            >
                              <span className="material-icons text-sm mr-1">add</span>
                              {needsElevationSchedule ? 'Add Elevation' : 'Add Time Slot'}
                            </Button>
                          </div>
                          
                          {day.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex items-center gap-2 bg-background p-2 rounded-md">
                              {needsElevationSchedule ? (
                                <>
                                  <div className="flex-1">
                                    <Input
                                      placeholder="Elevation (e.g., North, South, East, West, Floors 1-5)"
                                      value={slot.units}
                                      onChange={(e) => updateSlot(dayIndex, slotIndex, 'units', e.target.value)}
                                      className="h-8"
                                      data-testid={`input-slot-elevation-${dayIndex}-${slotIndex}`}
                                    />
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Input
                                      type="time"
                                      value={slot.startTime}
                                      onChange={(e) => updateSlot(dayIndex, slotIndex, 'startTime', e.target.value)}
                                      className="h-8 w-24"
                                      placeholder="Start"
                                      data-testid={`input-slot-start-${dayIndex}-${slotIndex}`}
                                    />
                                    <span className="text-muted-foreground text-xs">to</span>
                                    <Input
                                      type="time"
                                      value={slot.endTime}
                                      onChange={(e) => updateSlot(dayIndex, slotIndex, 'endTime', e.target.value)}
                                      className="h-8 w-24"
                                      placeholder="End"
                                      data-testid={`input-slot-end-${dayIndex}-${slotIndex}`}
                                    />
                                    <span className="text-xs text-muted-foreground">(optional)</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Input
                                      type="time"
                                      value={slot.startTime}
                                      onChange={(e) => updateSlot(dayIndex, slotIndex, 'startTime', e.target.value)}
                                      className="h-8 w-24"
                                      data-testid={`input-slot-start-${dayIndex}-${slotIndex}`}
                                    />
                                    <span className="text-muted-foreground">-</span>
                                    <Input
                                      type="time"
                                      value={slot.endTime}
                                      onChange={(e) => updateSlot(dayIndex, slotIndex, 'endTime', e.target.value)}
                                      className="h-8 w-24"
                                      data-testid={`input-slot-end-${dayIndex}-${slotIndex}`}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Input
                                      placeholder={`${scheduleLabel}s (e.g., 4509, 3509, 2509)`}
                                      value={slot.units}
                                      onChange={(e) => updateSlot(dayIndex, slotIndex, 'units', e.target.value)}
                                      className="h-8"
                                      data-testid={`input-slot-units-${dayIndex}-${slotIndex}`}
                                    />
                                  </div>
                                </>
                              )}
                              {day.slots.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSlot(dayIndex, slotIndex)}
                                  className="h-8 w-8"
                                  data-testid={`button-remove-slot-${dayIndex}-${slotIndex}`}
                                >
                                  <span className="material-icons text-sm text-muted-foreground">close</span>
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <span className="material-icons text-primary">chat</span>
                <div>
                  <p className="text-sm font-medium">Resident Communication</p>
                  <p className="text-sm text-muted-foreground">
                    Residents can view this notice and submit questions or concerns through the app. 
                    You'll receive notifications when residents respond.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-notice">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} data-testid="button-save-notice">
              {isSubmitting ? (
                <>
                  <span className="material-icons animate-spin mr-2">refresh</span>
                  Saving...
                </>
              ) : existingNotice ? (
                "Update Notice"
              ) : (
                <>
                  <span className="material-icons mr-2">send</span>
                  Create Notice
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Save as Template Dialog */}
      <Dialog open={showSaveTemplateDialog} onOpenChange={(open) => {
        if (!open) {
          setShowSaveTemplateDialog(false);
          onClose();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">bookmark_add</span>
              Save as Template?
            </DialogTitle>
            <DialogDescription>
              Would you like to save this notice as a quick template for future use with {jobTypeName} projects?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {savedNoticeData && (
              <div className="bg-muted rounded-lg p-3 text-sm">
                <p className="font-medium">{savedNoticeData.title}</p>
                <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                  {savedNoticeData.details.substring(0, 100)}...
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSaveTemplateDialog(false);
                onClose();
              }}
              data-testid="button-skip-save-template"
            >
              No, thanks
            </Button>
            <Button 
              onClick={() => {
                if (savedNoticeData) {
                  saveTemplateMutation.mutate({
                    jobType: project.jobType,
                    title: savedNoticeData.title,
                    details: savedNoticeData.details,
                  });
                }
              }}
              disabled={saveTemplateMutation.isPending}
              data-testid="button-save-template"
            >
              {saveTemplateMutation.isPending ? (
                <>
                  <span className="material-icons animate-spin mr-2">refresh</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-icons mr-2">bookmark_add</span>
                  Save Template
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface WorkNoticeListProps {
  projectId: string;
  project: Project;
}

export function WorkNoticeList({ projectId, project }: WorkNoticeListProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<WorkNotice | null>(null);
  const [previewNotice, setPreviewNotice] = useState<WorkNotice | null>(null);

  const { data: noticesData, isLoading } = useQuery<{ notices: WorkNotice[] }>({
    queryKey: ["/api/projects", projectId, "work-notices"],
    enabled: !!projectId,
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async (noticeId: string) => {
      return apiRequest("DELETE", `/api/work-notices/${noticeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "work-notices"] });
      toast({ title: t("workNotice.deleted") });
    },
    onError: (error: Error) => {
      toast({ title: t("workNotice.error"), description: error.message, variant: "destructive" });
    },
  });

  const notices = noticesData?.notices || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="material-icons">campaign</span>
          {t("workNotice.title")}
        </h3>
        <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-work-notice">
          <span className="material-icons mr-2">add</span>
          {t("workNotice.createNotice")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <span className="material-icons animate-spin text-muted-foreground">refresh</span>
        </div>
      ) : notices.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <span className="material-icons text-4xl text-muted-foreground mb-2">campaign</span>
            <p className="text-muted-foreground">{t("workNotice.noNoticesYet")}</p>
            <p className="text-sm text-muted-foreground">{t("workNotice.noNoticesDescription")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <Card key={notice.id} className="hover-elevate" data-testid={`work-notice-card-${notice.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{notice.noticeTitle}</h4>
                      <Badge variant={notice.isPublished ? "default" : "secondary"}>
                        {notice.isPublished ? t("workNotice.published") : t("workNotice.draft")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {notice.noticeDetails}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-sm">event</span>
                        {notice.startDate} - {notice.endDate}
                      </span>
                      {notice.propertyManagerName && (
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-sm">person</span>
                          {notice.propertyManagerName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewNotice(notice)}
                      data-testid={`button-preview-notice-${notice.id}`}
                      title={t('workNotice.preview', 'Preview as Resident')}
                    >
                      <span className="material-icons">visibility</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingNotice(notice)}
                      data-testid={`button-edit-notice-${notice.id}`}
                    >
                      <span className="material-icons">edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNoticeMutation.mutate(notice.id)}
                      data-testid={`button-delete-notice-${notice.id}`}
                    >
                      <span className="material-icons text-destructive">delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">campaign</span>
              Create Work Notice
            </DialogTitle>
            <DialogDescription>
              Create a notice for residents about upcoming work at {project.buildingName || "this building"}.
            </DialogDescription>
          </DialogHeader>
          <WorkNoticeForm
            project={project}
            onClose={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingNotice} onOpenChange={(open) => !open && setEditingNotice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">edit</span>
              Edit Work Notice
            </DialogTitle>
            <DialogDescription>
              Update the notice for residents at {project.buildingName || "this building"}.
            </DialogDescription>
          </DialogHeader>
          {editingNotice && (
            <WorkNoticeForm
              project={project}
              existingNotice={editingNotice}
              onClose={() => setEditingNotice(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Notice Dialog - Shows how residents will see this notice */}
      <Dialog open={!!previewNotice} onOpenChange={(open) => !open && setPreviewNotice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">visibility</span>
              {t('workNotice.previewTitle', 'Resident View Preview')}
            </DialogTitle>
            <DialogDescription>
              {t('workNotice.previewDescription', 'This is how residents will see this notice in their portal.')}
            </DialogDescription>
          </DialogHeader>
          {previewNotice && (
            <div className="space-y-4">
              {/* Notice Card - Mimics Resident Portal View */}
              <Card className="border-2 border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-icons text-primary">campaign</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{previewNotice.noticeTitle}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={previewNotice.isPublished ? "default" : "secondary"}>
                          {previewNotice.isPublished ? t('workNotice.status.published', 'Published') : t('workNotice.status.draft', 'Draft')}
                        </Badge>
                        {!previewNotice.isPublished && (
                          <span className="text-xs text-muted-foreground">
                            {t('workNotice.draftNote', '(Residents cannot see draft notices)')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Building Info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="material-icons text-sm">apartment</span>
                    <span>{project.buildingName || t('workNotice.building', 'Building')}</span>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-icons text-sm text-muted-foreground">event</span>
                    <span className="font-medium">
                      {previewNotice.startDate ? format(new Date(previewNotice.startDate), "MMM d, yyyy") : t('workNotice.tbd', 'TBD')} 
                      {' - '}
                      {previewNotice.endDate ? format(new Date(previewNotice.endDate), "MMM d, yyyy") : t('workNotice.tbd', 'TBD')}
                    </span>
                  </div>

                  {/* Notice Content */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-sm">{t('workNotice.details', 'Notice Details')}</h4>
                    <p className="text-sm whitespace-pre-wrap">{previewNotice.noticeDetails}</p>
                  </div>

                  {/* Additional Instructions */}
                  {previewNotice.additionalInstructions && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-sm flex items-center gap-2 text-amber-800 dark:text-amber-200">
                        <span className="material-icons text-sm">info</span>
                        {t('workNotice.additionalInstructions', 'Additional Instructions')}
                      </h4>
                      <p className="text-sm whitespace-pre-wrap text-amber-900 dark:text-amber-100">{previewNotice.additionalInstructions}</p>
                    </div>
                  )}

                  {/* Unit Schedule if exists */}
                  {previewNotice.unitSchedule && Array.isArray(previewNotice.unitSchedule) && previewNotice.unitSchedule.length > 0 && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 text-sm flex items-center gap-2">
                        <span className="material-icons text-sm">schedule</span>
                        {t('workNotice.schedule', 'Schedule')}
                      </h4>
                      <div className="space-y-3">
                        {(previewNotice.unitSchedule as any[]).map((day: any, idx: number) => (
                          <div key={idx} className="border-l-2 border-primary pl-3">
                            <div className="font-medium text-sm">
                              {day.date ? format(new Date(day.date), "EEEE, MMMM d, yyyy") : t('workNotice.dateTbd', 'Date TBD')}
                            </div>
                            {day.slots && day.slots.map((slot: any, slotIdx: number) => (
                              <div key={slotIdx} className="text-sm text-muted-foreground mt-1">
                                {slot.startTime} - {slot.endTime}: {slot.units || t('workNotice.unitsTbd', 'Units TBD')}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Property Manager */}
                  {previewNotice.propertyManagerName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <span className="material-icons text-sm">person</span>
                      <span>{t('workNotice.propertyManager', 'Property Manager')}: {previewNotice.propertyManagerName}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setPreviewNotice(null)}>
                  {t('common.close', 'Close')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

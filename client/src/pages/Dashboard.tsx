// GPS Location Tracking - v2.0 - CACHE BUST
import { useState, useEffect, useLayoutEffect, useMemo, useRef, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { BrandingContext } from "@/App";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { PurchaseSeatsDialog } from "@/components/PurchaseSeatsDialog";
import { EmployerDocumentRequests } from "@/components/EmployerDocumentRequests";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Star, Calculator, ChevronLeft, ChevronRight, Plus, Search, FlaskConical, Download, Bell, Globe, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { HighRiseBuilding } from "@/components/HighRiseBuilding";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { useLocation, useSearch, Link } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Project, Client, InsertClient } from "@shared/schema";
import { normalizeStrataPlan } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
import { isManagement, hasFinancialAccess, canAccessQuotes, canManageEmployees, canViewPerformance, hasPermission, isReadOnly, canViewSchedule, canViewPastProjects } from "@/lib/permissions";
import { DocumentUploader } from "@/components/DocumentUploader";
import { CSRBadge } from "@/components/CSRBadge";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { SubscriptionRenewalBadge } from "@/components/SubscriptionRenewalBadge";
import { formatLocalDate, formatLocalDateLong, formatTimestampDate, formatTimestampDateShort, formatTimestampDateMedium, parseLocalDate, formatLocalDateMedium, formatDurationMs } from "@/lib/dateUtils";
import { QRCodeSVG } from 'qrcode.react';
import { trackLogout, trackWorkSessionStart, trackWorkSessionEnd, trackProjectCreated, trackClientAdded, trackBuildingAdded, trackEmployeeAdded } from "@/lib/analytics";
import { getDashboardUrl, parseDashboardTab, type DashboardTab } from "@/lib/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { ProgressPromptDialog } from "@/components/ProgressPromptDialog";
import { BusinessCardScanner } from "@/components/BusinessCardScanner";
import { ClientExcelImport } from "@/components/ClientExcelImport";
import { DoubleBookingWarningDialog } from "@/components/DoubleBookingWarningDialog";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { DashboardOverview } from "@/components/DashboardOverview";
import { DocumentReviews } from "@/components/DocumentReviews";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { useSetHeaderConfig } from "@/components/DashboardLayout";

import { JOB_CATEGORIES, JOB_TYPES, getJobTypesByCategory, getJobTypeConfig, getDefaultElevation, isElevationConfigurable, isDropBasedJobType, getAllJobTypeValues, getProgressType, getCategoryForJobType, type JobCategory } from "@shared/jobTypes";

// Use helper function to get all job type values for validation
const ALL_JOB_TYPE_VALUES = getAllJobTypeValues() as [string, ...string[]];

const projectSchema = z.object({
  strataPlanNumber: z.string().optional(),
  buildingName: z.string().optional(),
  buildingAddress: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  jobCategory: z.enum(['building_maintenance', 'ndt', 'rock_scaling', 'wind_turbine', 'oil_field']).default('building_maintenance'),
  jobType: z.enum(ALL_JOB_TYPE_VALUES, {
    errorMap: () => ({ message: "Please select a valid job type" })
  }),
  customJobType: z.string().optional(),
  requiresElevation: z.boolean().default(true),
  totalDropsNorth: z.string().optional(),
  totalDropsEast: z.string().optional(),
  totalDropsSouth: z.string().optional(),
  totalDropsWest: z.string().optional(),
  dailyDropTarget: z.string().optional(),
  floorCount: z.string().optional(),
  buildingHeight: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  targetCompletionDate: z.string().optional(),
  estimatedHours: z.string().optional(),
  calendarColor: z.string().default("#3b82f6"),
  ropeAccessPlan: z.any().optional(),
  suitesPerDay: z.string().optional(),
  totalFloors: z.string().optional(),
  floorsPerDay: z.string().optional(),
  totalStalls: z.string().optional(),
  stallsPerDay: z.string().optional(),
  totalAnchors: z.string().optional(),
  anchorsPerDay: z.string().optional(),
  assignedEmployees: z.array(z.string()).optional(),
  peaceWork: z.boolean().default(false),
  pricePerDrop: z.string().optional(),
}).refine((data) => {
  if (data.jobType === "other" || data.jobType === "ndt_other" || data.jobType === "rock_other" || data.jobType === "turbine_other" || data.jobType === "oil_other") {
    return data.customJobType && data.customJobType.trim().length > 0;
  }
  return true;
}, {
  message: "Custom job type is required when 'Other' is selected",
  path: ["customJobType"],
});

// Role definitions with icons - labels are translation keys
const ROLE_OPTIONS = [
  { value: "owner_ceo", labelKey: "dashboard.roles.owner_ceo", icon: "business_center", category: "management" },
  { value: "operations_manager", labelKey: "dashboard.roles.operations_manager", icon: "engineering", category: "management" },
  { value: "human_resources", labelKey: "dashboard.roles.human_resources", icon: "badge", category: "management" },
  { value: "accounting", labelKey: "dashboard.roles.accounting", icon: "account_balance", category: "management" },
  { value: "account_manager", labelKey: "dashboard.roles.account_manager", icon: "person_search", category: "management" },
  { value: "general_supervisor", labelKey: "dashboard.roles.general_supervisor", icon: "admin_panel_settings", category: "management" },
  { value: "rope_access_supervisor", labelKey: "dashboard.roles.rope_access_supervisor", icon: "height", category: "management" },
  { value: "manager", labelKey: "dashboard.roles.manager", icon: "manage_accounts", category: "management" },
  { value: "rope_access_tech", labelKey: "dashboard.roles.rope_access_tech", icon: "construction", category: "worker" },
  { value: "ground_crew_supervisor", labelKey: "dashboard.roles.ground_crew_supervisor", icon: "groups", category: "worker" },
  { value: "ground_crew", labelKey: "dashboard.roles.ground_crew", icon: "engineering", category: "worker" },
  { value: "labourer", labelKey: "dashboard.roles.labourer", icon: "handyman", category: "worker" },
] as const;

// Helper function to get translated role label
const getRoleLabel = (t: (key: string) => string, value: string): string => {
  const role = ROLE_OPTIONS.find(r => r.value === value);
  return role ? t(role.labelKey) : value;
};

// Available permissions for employees organized by category - using translation keys
const PERMISSION_CATEGORIES = [
  {
    nameKey: "dashboard.permissions.categories.projects",
    permissions: [
      { id: "view_projects", labelKey: "dashboard.permissions.viewProjects" },
      { id: "view_past_projects", labelKey: "dashboard.permissions.viewPastProjects" },
      { id: "create_projects", labelKey: "dashboard.permissions.createProjects" },
      { id: "edit_projects", labelKey: "dashboard.permissions.editProjects" },
      { id: "delete_projects", labelKey: "dashboard.permissions.deleteProjects" },
      { id: "log_drops", labelKey: "dashboard.permissions.logDrops" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.employees",
    permissions: [
      { id: "view_employees", labelKey: "dashboard.permissions.viewEmployees" },
      { id: "create_employees", labelKey: "dashboard.permissions.createEmployees" },
      { id: "edit_employees", labelKey: "dashboard.permissions.editEmployees" },
      { id: "delete_employees", labelKey: "dashboard.permissions.deleteEmployees" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.clients",
    permissions: [
      { id: "view_clients", labelKey: "dashboard.permissions.viewClients" },
      { id: "manage_clients", labelKey: "dashboard.permissions.manageClients" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.quotes",
    permissions: [
      { id: "view_quotes", labelKey: "dashboard.permissions.viewQuotes" },
      { id: "create_quotes", labelKey: "dashboard.permissions.createQuotes" },
      { id: "edit_quotes", labelKey: "dashboard.permissions.editQuotes" },
      { id: "delete_quotes", labelKey: "dashboard.permissions.deleteQuotes" },
      { id: "view_quote_financials", labelKey: "dashboard.permissions.viewQuoteFinancials" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.safetyCompliance",
    permissions: [
      { id: "view_csr", labelKey: "dashboard.permissions.viewCsr" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.documents",
    permissions: [
      { id: "view_sensitive_documents", labelKey: "dashboard.permissions.viewSensitiveDocuments" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.inventoryGear",
    permissions: [
      { id: "view_inventory", labelKey: "dashboard.permissions.viewInventory" },
      { id: "manage_inventory", labelKey: "dashboard.permissions.manageInventory" },
      { id: "assign_gear", labelKey: "dashboard.permissions.assignGear" },
      { id: "view_gear_assignments", labelKey: "dashboard.permissions.viewGearAssignments" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.workSessions",
    permissions: [
      { id: "view_work_sessions", labelKey: "dashboard.permissions.viewWorkSessions" },
      { id: "manage_work_sessions", labelKey: "dashboard.permissions.manageWorkSessions" },
      { id: "view_work_history", labelKey: "dashboard.permissions.viewWorkHistory" },
      { id: "view_active_workers", labelKey: "dashboard.permissions.viewActiveWorkers" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.feedback",
    permissions: [
      { id: "view_complaints", labelKey: "dashboard.permissions.viewFeedback" },
      { id: "manage_complaints", labelKey: "dashboard.permissions.manageFeedback" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.schedule",
    permissions: [
      { id: "view_full_schedule", labelKey: "dashboard.permissions.viewFullSchedule" },
      { id: "view_own_schedule", labelKey: "dashboard.permissions.viewOwnSchedule" },
      { id: "edit_schedule", labelKey: "dashboard.permissions.editSchedule" },
    ],
  },
  {
    nameKey: "dashboard.permissions.categories.analyticsFinancial",
    permissions: [
      { id: "view_analytics", labelKey: "dashboard.permissions.viewAnalytics" },
      { id: "view_financial_data", labelKey: "dashboard.permissions.viewFinancialData" },
    ],
  },
] as const;

// Helper function to get translated job type label
const getJobTypeLabel = (t: (key: string) => string, jobType: string): string => {
  // Normalize job type: convert spaces to underscores and lowercase for translation key lookup
  const normalizedJobType = jobType.toLowerCase().replace(/\s+/g, '_');
  const jobTypeKey = `dashboard.jobTypes.${normalizedJobType}`;
  const translated = t(jobTypeKey);
  // If translation returns the key itself (not found), fall back to formatted job type
  if (translated === jobTypeKey) {
    return jobType.replace(/_/g, ' ');
  }
  return translated;
};

// Flat list of all permissions for compatibility
const AVAILABLE_PERMISSIONS = PERMISSION_CATEGORIES.flatMap(cat => cat.permissions);

// Quote-related permissions that should auto-select view_clients
const QUOTE_PERMISSIONS = ['view_quotes', 'create_quotes', 'edit_quotes', 'delete_quotes', 'view_quote_financials'];

// Helper function to handle permission cascading (quotes -> clients)
const handlePermissionChange = (
  currentPermissions: string[],
  permissionId: string,
  checked: boolean
): string[] => {
  let newPermissions = checked
    ? [...currentPermissions, permissionId]
    : currentPermissions.filter((p) => p !== permissionId);

  // If a quote permission is being enabled, also enable view_clients
  if (checked && QUOTE_PERMISSIONS.includes(permissionId)) {
    if (!newPermissions.includes('view_clients')) {
      newPermissions = [...newPermissions, 'view_clients'];
    }
  }

  // If a quote permission is being disabled, check if any quote permissions remain
  if (!checked && QUOTE_PERMISSIONS.includes(permissionId)) {
    const hasRemainingQuotePermissions = newPermissions.some((p) => QUOTE_PERMISSIONS.includes(p));
    if (!hasRemainingQuotePermissions) {
      newPermissions = newPermissions.filter((p) => p !== 'view_clients');
    }
  }

  return newPermissions;
};

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["owner_ceo", "operations_manager", "human_resources", "accounting", "account_manager", "general_supervisor", "rope_access_supervisor", "manager", "rope_access_tech", "ground_crew_supervisor", "ground_crew", "labourer"]),
  hourlyRate: z.string().optional(),
  isSalary: z.boolean().default(false),
  salary: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  // New employee details
  startDate: z.string().optional(),
  birthday: z.string().optional(),
  socialInsuranceNumber: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseProvince: z.string().optional(),
  driversLicenseDocuments: z.array(z.string()).default([]),
  homeAddress: z.string().optional(),
  employeePhoneNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  specialMedicalConditions: z.string().optional(),
  // IRATA fields
  irataLevel: z.string().optional(),
  irataLicenseNumber: z.string().optional(),
  irataIssuedDate: z.string().optional(),
  irataExpirationDate: z.string().optional(),
  // First Aid fields
  hasFirstAid: z.boolean().default(false),
  firstAidType: z.string().optional(),
  firstAidExpiry: z.string().optional(),
  firstAidDocuments: z.array(z.string()).default([]),
});

const editEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["owner_ceo", "operations_manager", "human_resources", "accounting", "account_manager", "general_supervisor", "rope_access_supervisor", "manager", "rope_access_tech", "ground_crew_supervisor", "ground_crew", "labourer"]),
  hourlyRate: z.string().optional(),
  isSalary: z.boolean().default(false),
  salary: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  // New employee details
  startDate: z.string().optional(),
  birthday: z.string().optional(),
  socialInsuranceNumber: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseProvince: z.string().optional(),
  driversLicenseDocuments: z.array(z.string()).default([]),
  homeAddress: z.string().optional(),
  employeePhoneNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  specialMedicalConditions: z.string().optional(),
  // IRATA fields
  irataLevel: z.string().optional(),
  irataLicenseNumber: z.string().optional(),
  irataIssuedDate: z.string().optional(),
  irataExpirationDate: z.string().optional(),
  // sprat fields
  spratLevel: z.string().optional(),
  spratLicenseNumber: z.string().optional(),
  spratIssuedDate: z.string().optional(),
  spratExpirationDate: z.string().optional(),
  // First Aid fields
  hasFirstAid: z.boolean().default(false),
  firstAidType: z.string().optional(),
  firstAidExpiry: z.string().optional(),
  firstAidDocuments: z.array(z.string()).default([]),
  // Termination
  terminatedDate: z.string().optional(),
  terminationReason: z.string().optional(),
  terminationNotes: z.string().optional(),
});

const dropLogSchema = z.object({
  projectId: z.string().min(1, "Please select a project"),
  date: z.string().min(1, "Date is required"),
  dropsCompleted: z.string().min(1, "Number of drops is required"),
});

const endDaySchema = z.object({
  dropsNorth: z.string().default(""),
  dropsEast: z.string().default(""),
  dropsSouth: z.string().default(""),
  dropsWest: z.string().default(""),
  shortfallReason: z.string().optional(),
  logRopeAccessHours: z.boolean().default(false),
  ropeAccessTaskHours: z.string().default(""),
});

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  lmsNumbers: z.array(z.string()).default([]),
  billingAddress: z.string().optional(),
  sameAsAddress: z.boolean().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;
type EmployeeFormData = z.infer<typeof employeeSchema>;
type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;
type DropLogFormData = z.infer<typeof dropLogSchema>;
type EndDayFormData = z.infer<typeof endDaySchema>;
type ClientFormData = z.infer<typeof clientSchema>;

// Helper function to create tint from hex color - shared between card components
function createTintFromHex(hex: string, lightness: number = 90): string {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  
  if (max !== min) {
    const d = max - min;
    const l = (max + min) / 2;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${lightness}%)`;
}

// Helper function to get a visible icon color - increases saturation for light colors
function getVisibleIconColor(hex: string): string {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // If the color is too light (luminance > 0.65), shift to a more saturated/darker version
  if (luminance > 0.65) {
    // Use a gentler darkening - target 60% of original brightness, not 40%
    // This keeps the color recognizable while making it visible
    const darkenFactor = 0.6;
    const newR = Math.round(r * darkenFactor);
    const newG = Math.round(g * darkenFactor);
    const newB = Math.round(b * darkenFactor);
    return `rgb(${newR}, ${newG}, ${newB})`;
  }
  
  return hex.startsWith('#') ? hex : `#${hex}`;
}

// Static Card Component - for filtered views without drag-and-drop
function StaticCard({ card, colorIndex, brandColors }: { card: any; colorIndex: number; brandColors: string[] }) {
  const brandingActive = brandColors.length > 0;

  let activeColor = card.borderColor;
  let cardBackground: string | undefined = undefined;
  let iconColor = card.borderColor;

  if (brandingActive && brandColors.length > 0) {
    // Always use the first brand color for consistent appearance across all cards
    const brandColor = brandColors[0];
    activeColor = brandColor;
    cardBackground = createTintFromHex(brandColor, 90);
    iconColor = getVisibleIconColor(brandColor);
  }

  const style: React.CSSProperties = {
    borderLeft: `6px solid ${activeColor}`,
    ...(cardBackground && { background: cardBackground }),
  };

  return (
    <div
      style={style}
      className="bg-card rounded-xl border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group hover-scale"
      onClick={card.onClick}
      data-testid={card.testId}
    >
      <div className="p-4 flex flex-col items-center gap-3">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border-2 relative"
          style={{ 
            backgroundColor: `${iconColor}15`, 
            color: iconColor, 
            borderColor: `${iconColor}40` 
          }}
        >
          <span className="material-icons-outlined text-4xl">{card.icon}</span>
          {card.notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 min-w-[20px] h-[20px] flex items-center justify-center text-[10px] px-1.5 pointer-events-none"
              data-testid={`badge-notification-${card.id}`}
            >
              {card.notificationCount > 99 ? '99+' : card.notificationCount}
            </Badge>
          )}
        </div>
        <div className="text-center">
          <div className="text-base font-bold mb-0.5 text-foreground">
            {card.label}
          </div>
          <div className="text-xs text-muted-foreground">{card.description}</div>
        </div>
      </div>
    </div>
  );
}

// Sortable Card Component - uses brand colors when active, otherwise original multicolor
function SortableCard({ card, isRearranging, colorIndex, brandColors }: { card: any; isRearranging: boolean; colorIndex: number; brandColors: string[] }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, disabled: !isRearranging });

  const brandingActive = brandColors.length > 0;

  let activeColor = card.borderColor;
  let cardBackground: string | undefined = undefined;
  let iconColor = card.borderColor;

  if (brandingActive && brandColors.length > 0) {
    // Always use the first brand color for consistent appearance across all cards
    const brandColor = brandColors[0];
    activeColor = brandColor;
    cardBackground = createTintFromHex(brandColor, 90);
    iconColor = getVisibleIconColor(brandColor);
  }

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderLeft: `6px solid ${activeColor}`,
    ...(cardBackground && { background: cardBackground }),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card rounded-xl border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group hover-scale relative"
      onClick={isRearranging ? undefined : card.onClick}
      data-testid={card.testId}
      {...attributes}
    >
      <div className="p-4 flex flex-col items-center gap-3">
        {/* Drag Handle - only visible when rearranging */}
        {isRearranging && (
          <div
            {...listeners}
            className="absolute top-1 right-1 p-1.5 bg-background/80 rounded-lg cursor-grab active:cursor-grabbing shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-icons text-muted-foreground text-base">drag_indicator</span>
          </div>
        )}
        
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border-2 relative"
          style={{ 
            backgroundColor: `${iconColor}15`, 
            color: iconColor, 
            borderColor: `${iconColor}40` 
          }}
        >
          <span className="material-icons-outlined text-4xl">{card.icon}</span>
          {card.notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 min-w-[20px] h-[20px] flex items-center justify-center text-[10px] px-1.5 pointer-events-none"
              data-testid={`badge-notification-${card.id}`}
            >
              {card.notificationCount > 99 ? '99+' : card.notificationCount}
            </Badge>
          )}
        </div>
        <div className="text-center">
          <div className="text-base font-bold mb-0.5 text-foreground">
            {card.label}
          </div>
          <div className="text-xs text-muted-foreground">{card.description}</div>
        </div>
      </div>
    </div>
  );
}

// Helper function to group projects by date (year/month/day)
// Uses numeric keys for proper sorting, with locale-safe month names for display
function groupProjectsByDate(projects: Project[], dateField: 'updatedAt' | 'endDate' = 'updatedAt') {
  const grouped: Record<string, Record<string, { monthName: string; days: Record<string, Project[]> }>> = {};
  
  projects.forEach(project => {
    const date = project[dateField] ? new Date(project[dateField] as string | Date) : new Date();
    const year = date.getFullYear().toString();
    const monthNum = date.getMonth().toString().padStart(2, '0'); // 00-11 for proper sorting
    const monthName = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate().toString().padStart(2, '0'); // Pad for proper sorting
    
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][monthNum]) grouped[year][monthNum] = { monthName, days: {} };
    if (!grouped[year][monthNum].days[day]) grouped[year][monthNum].days[day] = [];
    
    grouped[year][monthNum].days[day].push(project);
  });
  
  return grouped;
}

// Deleted Projects Tab Component
function DeletedProjectsTab() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: deletedProjectsData, isLoading } = useQuery<{ projects: Project[] }>({
    queryKey: ["/api/projects/deleted/list"],
  });
  
  const deletedProjects = deletedProjectsData?.projects || [];
  
  // Filter projects based on search query
  const filteredProjects = deletedProjects.filter(project => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const buildingName = (project.buildingName || "").toLowerCase();
    const strata = (project.strataPlanNumber || "").toLowerCase();
    const deletedDate = project.updatedAt ? formatTimestampDate(project.updatedAt).toLowerCase() : "";
    return buildingName.includes(query) || strata.includes(query) || deletedDate.includes(query);
  });
  
  // Group filtered projects by date
  const groupedProjects = groupProjectsByDate(filteredProjects, 'updatedAt');
  const sortedYears = Object.keys(groupedProjects).sort((a, b) => parseInt(b) - parseInt(a));
  
  const restoreMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/restore`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/deleted/list"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: t('dashboard.deletedProjects.restored', 'Project restored successfully') });
    },
    onError: () => {
      toast({ title: t('dashboard.deletedProjects.restoreFailed', 'Failed to restore project'), variant: "destructive" });
    },
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">{t('common.loading', 'Loading...')}</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
        <Input
          placeholder={t('dashboard.deletedProjects.searchPlaceholder', 'Search by building name, strata number, or date...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-deleted-projects"
        />
      </div>
      
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <span className="material-icons text-4xl mb-2 opacity-50">delete</span>
            <div>{searchQuery ? t('dashboard.deletedProjects.noResults', 'No deleted projects match your search') : t('dashboard.deletedProjects.noDeleted', 'No deleted projects')}</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedYears.map(year => (
            <div key={year} className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="material-icons text-base">calendar_today</span>
                {year}
              </h3>
              {Object.keys(groupedProjects[year]).sort((a, b) => b.localeCompare(a)).map(monthNum => {
                const monthData = groupedProjects[year][monthNum];
                return (
                  <div key={monthNum} className="space-y-2 ml-4">
                    <h4 className="text-base font-semibold text-muted-foreground">{monthData.monthName}</h4>
                    {Object.keys(monthData.days).sort((a, b) => b.localeCompare(a)).map(day => {
                      const dayProjects = monthData.days[day];
                      return (
                        <Collapsible key={day} defaultOpen={true} className="ml-4">
                          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-1 hover-elevate rounded-md px-2 -ml-2">
                            <span className="material-icons text-xs transition-transform duration-200 group-data-[state=open]:rotate-90">chevron_right</span>
                            <span className="material-icons text-xs text-muted-foreground">event</span>
                            <span className="text-sm font-medium text-muted-foreground">
                              {monthData.monthName} {parseInt(day)}, {year}
                            </span>
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {dayProjects.length}
                            </Badge>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2 mt-2">
                            {dayProjects.map((project: Project) => (
                              <Card 
                                key={project.id} 
                                className="group shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 bg-gradient-to-br from-background to-destructive/5" 
                                data-testid={`deleted-project-${project.id}`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                      <div className="text-base font-bold mb-0.5 truncate">{project.buildingName}</div>
                                      <div className="text-sm text-muted-foreground mb-0.5">{project.strataPlanNumber}</div>
                                      <div className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                                        <span className="material-icons text-sm text-destructive">delete</span>
                                        {getJobTypeLabel(t, project.jobType)}
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                      <Badge variant="destructive" className="flex items-center gap-1">
                                        <span className="material-icons text-xs">delete</span>
                                        {t('dashboard.deletedProjects.deleted', 'Deleted')}
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => restoreMutation.mutate(project.id)}
                                        disabled={restoreMutation.isPending}
                                        data-testid={`button-restore-${project.id}`}
                                      >
                                        <span className="material-icons text-sm mr-1">restore</span>
                                        {t('dashboard.deletedProjects.restore', 'Restore')}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Completed Projects Tab Component
function CompletedProjectsTab() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: projectsData, isLoading } = useQuery<{ projects: Project[] }>({
    queryKey: ["/api/projects"],
  });
  
  const allProjects = projectsData?.projects || [];
  const completedProjects = allProjects.filter(p => p.status === "completed" && !p.deleted);
  
  // Filter projects based on search query
  const filteredProjects = completedProjects.filter(project => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const buildingName = (project.buildingName || "").toLowerCase();
    const strata = (project.strataPlanNumber || "").toLowerCase();
    const completedDate = project.endDate ? formatTimestampDate(project.endDate).toLowerCase() : "";
    const updatedDate = project.updatedAt ? formatTimestampDate(project.updatedAt).toLowerCase() : "";
    return buildingName.includes(query) || strata.includes(query) || completedDate.includes(query) || updatedDate.includes(query);
  });
  
  // Group filtered projects by date (using updatedAt as completion date)
  const groupedProjects = groupProjectsByDate(filteredProjects, 'updatedAt');
  const sortedYears = Object.keys(groupedProjects).sort((a, b) => parseInt(b) - parseInt(a));
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">{t('common.loading', 'Loading...')}</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
        <Input
          placeholder={t('dashboard.completedProjects.searchPlaceholder', 'Search by building name, strata number, or date...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-completed-projects"
        />
      </div>
      
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <span className="material-icons text-4xl mb-2 opacity-50">done_all</span>
            <div>{searchQuery ? t('dashboard.completedProjects.noResults', 'No completed projects match your search') : t('dashboard.projects.noCompletedProjects', 'No completed projects yet')}</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedYears.map(year => (
            <div key={year} className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="material-icons text-base">calendar_today</span>
                {year}
              </h3>
              {Object.keys(groupedProjects[year]).sort((a, b) => b.localeCompare(a)).map(monthNum => {
                const monthData = groupedProjects[year][monthNum];
                return (
                  <div key={monthNum} className="space-y-2 ml-4">
                    <h4 className="text-base font-semibold text-muted-foreground">{monthData.monthName}</h4>
                    {Object.keys(monthData.days).sort((a, b) => b.localeCompare(a)).map(day => {
                      const dayProjects = monthData.days[day];
                      return (
                        <Collapsible key={day} defaultOpen={true} className="ml-4">
                          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-1 hover-elevate rounded-md px-2 -ml-2">
                            <span className="material-icons text-xs transition-transform duration-200 group-data-[state=open]:rotate-90">chevron_right</span>
                            <span className="material-icons text-xs text-muted-foreground">event</span>
                            <span className="text-sm font-medium text-muted-foreground">
                              {monthData.monthName} {parseInt(day)}, {year}
                            </span>
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {dayProjects.length}
                            </Badge>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2 mt-2">
                            {dayProjects.map((project: Project) => (
                              <Card 
                                key={project.id} 
                                className="group shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer bg-gradient-to-br from-background to-success/5" 
                                data-testid={`completed-project-${project.id}`}
                                onClick={() => setLocation(`/projects/${project.id}`)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                      <div className="text-base font-bold mb-0.5 truncate">{project.buildingName}</div>
                                      <div className="text-sm text-muted-foreground mb-0.5">{project.strataPlanNumber}</div>
                                      <div className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                                        <span className="material-icons text-sm text-success">check_circle</span>
                                        {getJobTypeLabel(t, project.jobType)}
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="bg-success/10 text-success border-success/30 flex-shrink-0">
                                      <span className="material-icons text-xs mr-1">check_circle</span>
                                      {t('dashboard.projects.completed', 'Completed')}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Notification Bell Component for Company Owners
function NotificationBell() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch unread notification count
  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    refetchInterval: 30000,
  });

  // Fetch all notifications when dropdown opens
  const { data: notificationsData, isLoading } = useQuery<{ notifications: any[] }>({
    queryKey: ["/api/notifications"],
    enabled: isOpen,
  });

  // Mark notification as read mutation
  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/notifications/read-all", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const unreadCount = countData?.count || 0;
  const notifications = notificationsData?.notifications || [];

  const getNotificationMessage = (notification: any) => {
    if (notification.type === "job_offer_refused") {
      const payload = notification.payload as any;
      return t('notifications.jobOfferRefused', '{{name}} declined your offer for {{job}}', {
        name: payload?.technicianName || 'A technician',
        job: payload?.jobTitle || 'a position',
      });
    }
    return t('notifications.genericNotification', 'New notification');
  };

  const getNotificationIcon = (type: string) => {
    if (type === "job_offer_refused") return "person_off";
    return "notifications";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          data-testid="button-notifications"
        >
          <span className="material-icons text-xl sm:text-2xl">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold">{t('notifications.title', 'Notifications')}</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              data-testid="button-mark-all-read"
            >
              {t('notifications.markAllRead', 'Mark all read')}
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              {t('common.loading', 'Loading...')}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <span className="material-icons text-4xl text-muted-foreground mb-2">notifications_none</span>
              <p className="text-muted-foreground text-sm">
                {t('notifications.noNotifications', 'No notifications')}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`p-3 hover-elevate cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markReadMutation.mutate(notification.id);
                    }
                  }}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                      <span className="material-icons text-sm">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.createdAt && formatTimestampDateShort(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// License Expiry Warning Banner Component
function LicenseExpiryWarningBanner({ employees, onReviewClick }: { employees: any[]; onReviewClick: () => void }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate employees with expiring licenses (within 30 days)
  const expiringLicenses = useMemo(() => {
    // Normalize to start of day for accurate date comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const results: { employee: any; licenseType: string; expiryDate: string; daysRemaining: number }[] = [];
    
    employees.forEach((emp: any) => {
      // Skip terminated or suspended employees (both primary and secondary suspension)
      if (emp.terminatedDate || emp.suspendedAt || emp.connectionStatus === 'suspended') return;
      
      // Check IRATA expiration
      if (emp.irataExpirationDate) {
        const expiryDate = new Date(emp.irataExpirationDate);
        expiryDate.setHours(0, 0, 0, 0);
        if (expiryDate <= thirtyDaysFromNow && expiryDate >= today) {
          const daysRemaining = Math.round((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
          results.push({
            employee: emp,
            licenseType: 'IRATA Certification',
            expiryDate: emp.irataExpirationDate,
            daysRemaining
          });
        }
      }
      
      // Check SPRAT expiration
      if (emp.spratExpirationDate) {
        const expiryDate = new Date(emp.spratExpirationDate);
        expiryDate.setHours(0, 0, 0, 0);
        if (expiryDate <= thirtyDaysFromNow && expiryDate >= today) {
          const daysRemaining = Math.round((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
          results.push({
            employee: emp,
            licenseType: 'SPRAT Certification',
            expiryDate: emp.spratExpirationDate,
            daysRemaining
          });
        }
      }
      
      // Check Driver's License expiration
      if (emp.driversLicenseExpiry) {
        const expiryDate = new Date(emp.driversLicenseExpiry);
        expiryDate.setHours(0, 0, 0, 0);
        if (expiryDate <= thirtyDaysFromNow && expiryDate >= today) {
          const daysRemaining = Math.round((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
          results.push({
            employee: emp,
            licenseType: "Driver's License",
            expiryDate: emp.driversLicenseExpiry,
            daysRemaining
          });
        }
      }
    });
    
    // Sort by days remaining (most urgent first)
    return results.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [employees]);
  
  if (expiringLicenses.length === 0) return null;
  
  const uniqueEmployeeCount = new Set(expiringLicenses.map(l => l.employee.id)).size;
  
  return (
    <Popover open={isExpanded} onOpenChange={setIsExpanded}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 h-8 px-2 gap-1"
          data-testid="button-license-expiry-warning"
        >
          <span className="material-icons text-base">warning</span>
          <span className="hidden sm:inline text-xs font-medium">{t('dashboard.licenseExpiry.shortTitle', 'Licenses')}</span>
          <Badge variant="destructive" className="h-4 min-w-[16px] px-1 text-[10px]">
            {uniqueEmployeeCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b bg-red-50 dark:bg-red-950/40">
          <h4 className="font-semibold text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
            <span className="material-icons text-base">warning</span>
            {t('dashboard.licenseExpiry.title', 'License Expiration Warning')}
          </h4>
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">
            {t('dashboard.licenseExpiry.description', '{{count}} employee(s) have licenses expiring within 30 days', { count: uniqueEmployeeCount })}
          </p>
        </div>
        <ScrollArea className="max-h-[250px]">
          <div className="p-2 space-y-1">
            {expiringLicenses.map((item, index) => (
              <div 
                key={`${item.employee.id}-${item.licenseType}-${index}`}
                className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted/50"
                data-testid={`expiry-item-${item.employee.id}-${index}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{item.employee.name}</div>
                  <div className="text-xs text-muted-foreground">{item.licenseType}</div>
                </div>
                <Badge variant="destructive" className="text-[10px] ml-2 flex-shrink-0">
                  {item.daysRemaining === 0 
                    ? t('dashboard.licenseExpiry.expiresToday', 'Today')
                    : item.daysRemaining === 1
                      ? t('dashboard.licenseExpiry.expiresTomorrow', '1 day')
                      : t('dashboard.licenseExpiry.expiresInDays', '{{days}} days', { days: item.daysRemaining })}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t">
          <Button
            onClick={() => {
              setIsExpanded(false);
              onReviewClick();
            }}
            size="sm"
            className="w-full bg-red-600 hover:bg-red-700 text-white h-8"
            data-testid="button-review-licenses"
          >
            <span className="material-icons text-sm mr-1">people</span>
            {t('dashboard.licenseExpiry.reviewLicenses', 'Review Employees')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  
  // Use wouter's useSearch hook to track query parameter changes
  const searchString = useSearch();
  
  // Derive activeTab from the URL search params (single source of truth)
  const activeTab = useMemo(() => {
    return parseDashboardTab(searchString);
  }, [searchString]);
  
  const [projectsSubTab, setProjectsSubTab] = useState<"active" | "past">("active");
  
  const { brandColors: contextBrandColors, brandingActive } = useContext(BrandingContext);
  const defaultCalendarColor = brandingActive && contextBrandColors.length > 0 ? contextBrandColors[0] : "hsl(var(--primary))";

  // Scroll to top when changing tabs - navigate via URL using typed helpers
  const handleTabChange = (tab: DashboardTab | string) => {
    // Handle special cases that should go to base dashboard URL
    if (!tab || tab === '' || tab === 'home' || tab === 'overview') {
      setLocation(getDashboardUrl());
    } else {
      setLocation(getDashboardUrl(tab as DashboardTab));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToNav = () => {
    setLocation(getDashboardUrl());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showPurchaseSeatsDialog, setShowPurchaseSeatsDialog] = useState(false);
  const [showEditEmployeeDialog, setShowEditEmployeeDialog] = useState(false);
  const [showEmployeeDetailDialog, setShowEmployeeDetailDialog] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<any | null>(null);
  const [employeeToView, setEmployeeToView] = useState<any | null>(null);
  const [employeeToChangePassword, setEmployeeToChangePassword] = useState<any | null>(null);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showBusinessCardScanner, setShowBusinessCardScanner] = useState(false);
  const [showPMSearchDialog, setShowPMSearchDialog] = useState(false);
  const [pmSearchQuery, setPMSearchQuery] = useState("");
  const [pmSearchResults, setPMSearchResults] = useState<Array<{ id: string; email: string; name: string; pmCode: string | null; company: string | null; phone: string | null; isLinked: boolean }>>([]);
  const [pmSearchLoading, setPMSearchLoading] = useState(false);
  const [showEditClientDialog, setShowEditClientDialog] = useState(false);
  const [showDeleteClientDialog, setShowDeleteClientDialog] = useState(false);
  const [showClientDetailDialog, setShowClientDetailDialog] = useState(false);
  const [clientToView, setClientToView] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [lmsNumbers, setLmsNumbers] = useState<Array<{ number: string; buildingName?: string; address: string; stories?: number; units?: number; parkingStalls?: number; dailyDropTarget?: number; totalDropsNorth?: number; totalDropsEast?: number; totalDropsSouth?: number; totalDropsWest?: number }>>([{ number: "", address: "" }]);
  const [editLmsNumbers, setEditLmsNumbers] = useState<Array<{ number: string; buildingName?: string; address: string; stories?: number; units?: number; parkingStalls?: number; dailyDropTarget?: number; totalDropsNorth?: number; totalDropsEast?: number; totalDropsSouth?: number; totalDropsWest?: number }>>([{ number: "", address: "" }]);
  const [sameAsAddress, setSameAsAddress] = useState(false);
  const [editSameAsAddress, setEditSameAsAddress] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientForProject, setSelectedClientForProject] = useState<string>("");
  const [selectedStrataForProject, setSelectedStrataForProject] = useState<string>("");
  const isManualEntryRef = useRef(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [clientDropdownStep, setClientDropdownStep] = useState<"clients" | "buildings">("clients");
  const [selectedClientInDropdown, setSelectedClientInDropdown] = useState<string | null>(null);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [clientViewMode, setClientViewMode] = useState<"cards" | "table">("cards");
  const [clientSortField, setClientSortField] = useState<"name" | "company" | "email" | "phone">("name");
  const [clientSortDirection, setClientSortDirection] = useState<"asc" | "desc">("asc");
  const [projectsViewMode, setProjectsViewMode] = useState<"cards" | "list">("cards");
  const [employeesViewMode, setEmployeesViewMode] = useState<"cards" | "list">("cards");
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [employeeToSuspendSeat, setEmployeeToSuspendSeat] = useState<any | null>(null); // For seat removal/suspend
  const [showDeactivateInfoModal, setShowDeactivateInfoModal] = useState(false); // Info modal for deactivate function
  const [showUnlinkInfoModal, setShowUnlinkInfoModal] = useState(false); // Info modal for unlink function
  const [showDropDialog, setShowDropDialog] = useState(false);
  const [dropProject, setDropProject] = useState<any>(null);
  const [showInspectionCheckDialog, setShowInspectionCheckDialog] = useState(false);
  const [showStartDayDialog, setShowStartDayDialog] = useState(false);
  const [showEndDayDialog, setShowEndDayDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [uploadedPlanFile, setUploadedPlanFile] = useState<File | null>(null);
  const [isUploadingPlan, setIsUploadingPlan] = useState(false);
  const [uploadedAnchorCertFile, setUploadedAnchorCertFile] = useState<File | null>(null);
  const [isUploadingAnchorCert, setIsUploadingAnchorCert] = useState(false);
  
  // Project conflict detection state
  const [projectConflictDialogOpen, setProjectConflictDialogOpen] = useState(false);
  const [projectPendingConflicts, setProjectPendingConflicts] = useState<Array<{ employeeId: string; employeeName: string; conflictingJob: string; conflictType?: 'job' | 'time_off' }>>([]);
  const [pendingProjectData, setPendingProjectData] = useState<any>(null);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [employeeFormStep, setEmployeeFormStep] = useState<0 | 1 | 2>(0); // Track form step (0 = choose mode, 1 = info, 2 = permissions)
  const [addEmployeeMode, setAddEmployeeMode] = useState<'create' | 'onropepro' | null>(null); // Which mode user chose
  const [onRopeProSearchType, setOnRopeProSearchType] = useState<'irata' | 'sprat' | 'email'>('irata'); // Search type for OnRopePro
  const [onRopeProSearchValue, setOnRopeProSearchValue] = useState(''); // Search value for OnRopePro
  const [foundTechnician, setFoundTechnician] = useState<any>(null); // Found technician from search
  const [inviteDebugResponse, setInviteDebugResponse] = useState<any>(null); // Debug info from last invite
  const [technicianSearchWarning, setTechnicianSearchWarning] = useState<string | null>(null); // Warning from search
  const [technicianSearching, setTechnicianSearching] = useState(false); // Loading state for search
  const [technicianLinking, setTechnicianLinking] = useState(false); // Loading state for linking
  const [editEmployeeFormStep, setEditEmployeeFormStep] = useState<1 | 2>(1); // Track edit form step
  const [showTerminationConfirm, setShowTerminationConfirm] = useState(false); // Confirmation for termination
  const [showTerminationDialog, setShowTerminationDialog] = useState(false); // Dialog for termination details
  const [terminationData, setTerminationData] = useState<{ reason: string; notes: string }>({ reason: "", notes: "" });
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  const [isRearranging, setIsRearranging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showSaveAsClientDialog, setShowSaveAsClientDialog] = useState(false);
  const [projectDataForClient, setProjectDataForClient] = useState<any>(null);
  const [showOtherElevationFields, setShowOtherElevationFields] = useState(false);
  const [invitationToConvert, setInvitationToConvert] = useState<any>(null); // Invitation being converted to employee
  const [showInvitationEmployeeForm, setShowInvitationEmployeeForm] = useState(false); // Show employee form for invitation
  const [showLeaveCompanyDialog, setShowLeaveCompanyDialog] = useState(false); // For technicians to leave company
  const [showEmployerInfoDialog, setShowEmployerInfoDialog] = useState(false); // For technicians to view employer info
  const [progressPromptOpen, setProgressPromptOpen] = useState(false);
  const [progressPromptProjectId, setProgressPromptProjectId] = useState<string | null>(null);
  const [progressPromptCurrentValue, setProgressPromptCurrentValue] = useState(0);
  const { toast } = useToast();
  
  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Fetch all employees (including terminated) for management
  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ["/api/employees/all"],
  });

  // Fetch all clients
  const { data: clientsResponse, isLoading: clientsLoading } = useQuery<{ clients: Client[] }>({
    queryKey: ["/api/clients"],
  });
  const clientsData = clientsResponse?.clients || [];

  // Fetch custom job types
  const { data: customJobTypesData } = useQuery<{ customJobTypes: { id: string; jobTypeName: string }[] }>({
    queryKey: ["/api/custom-job-types"],
  });

  // Fetch today's drops for daily target
  const { data: myDropsData } = useQuery({
    queryKey: ["/api/my-drops-today"],
  });

  // Fetch current user to get company info
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  // Check if employee has pending required documents to sign (blocks dashboard access)
  const { data: pendingDocsData, isLoading: pendingDocsLoading } = useQuery<{ hasPendingDocuments: boolean; pendingCount: number }>({
    queryKey: ["/api/document-reviews/pending-check"],
    enabled: !!userData?.user && ['rope_access_tech', 'ground_crew'].includes(userData.user.role),
  });

  // Fetch unread feature request message count for company owners
  const { data: unreadMessageData } = useQuery<{ count: number }>({
    queryKey: ["/api/feature-requests/unread-count"],
    enabled: userData?.user?.role === 'company',
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch job application counts for company owners
  const { data: jobApplicationCountsData } = useQuery<{ counts: { jobPostingId: string; count: number }[] }>({
    queryKey: ["/api/job-applications/counts"],
    enabled: userData?.user?.role === 'company',
    refetchInterval: 60000, // Refresh every 60 seconds
  });

  const totalJobApplications = jobApplicationCountsData?.counts?.reduce((sum, item) => sum + item.count, 0) || 0;

  // Fetch user preferences
  const { data: preferencesData } = useQuery({
    queryKey: ["/api/user-preferences"],
    enabled: !!userData?.user,
  });

  // Extract user from userData for use throughout component
  const user = userData?.user;

  // Get employer ID from URL for PLUS technicians switching between employers
  const urlParams = new URLSearchParams(window.location.search);
  const urlEmployerId = urlParams.get('employerId');

  // Determine company ID for fetching data
  // For company users: use their own ID
  // For employees: use their companyId, OR the URL employerId if switching employers (PLUS)
  const companyIdForData = userData?.user?.role === 'company' 
    ? userData.user.id 
    : (urlEmployerId || userData?.user?.companyId);

  // For technicians, fetch employer connections to check access status
  const { data: employerConnectionsData } = useQuery<{
    connections: Array<{
      id: string;
      companyId: string;
      isPrimary: boolean;
      status: string;
      company: { id: string; name: string; companyName: string; } | null;
    }>;
  }>({
    queryKey: ["/api/my-employer-connections"],
    enabled: userData?.user?.role === 'employee' || userData?.user?.role === 'rope_access_tech',
  });

  // Check if technician is suspended from the employer they're trying to access
  useEffect(() => {
    if (!employerConnectionsData?.connections) return;
    
    const connections = employerConnectionsData.connections;
    const activeConnections = connections.filter(c => c.status === 'active' || c.status === 'accepted');
    
    // If technician has no active connections at all, redirect to portal
    if (connections.length > 0 && activeConnections.length === 0) {
      toast({
        title: t('dashboard.allAccessSuspended', 'Access Suspended'),
        description: t('dashboard.allAccessSuspendedDesc', 'All your employer connections have been suspended. Redirecting to your portal.'),
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation('/technician-portal');
      }, 2000);
      return;
    }
    
    // Check if the specific company they're accessing is suspended
    if (companyIdForData) {
      const currentConnection = connections.find(c => c.companyId === companyIdForData);
      
      // If we found the connection and it's suspended, redirect to portal
      if (currentConnection && currentConnection.status === 'suspended') {
        toast({
          title: t('dashboard.accessSuspended', 'Access Suspended'),
          description: t('dashboard.accessSuspendedDesc', `Your access to ${currentConnection.company?.companyName || 'this company'} has been suspended. Redirecting to your portal.`),
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation('/technician-portal');
        }, 2000);
      }
    }
  }, [employerConnectionsData, companyIdForData, toast, setLocation, t]);

  // Fetch company information
  const { data: companyData } = useQuery({
    queryKey: ["/api/companies", companyIdForData],
    enabled: !!companyIdForData,
  });

  // Fetch company branding for white label support  
  const { data: brandingData } = useQuery({
    queryKey: ["/api/company", companyIdForData, "branding"],
    queryFn: async () => {
      if (!companyIdForData) return null;
      const response = await fetch(`/api/company/${companyIdForData}/branding`);
      
      // 404 means no branding configured - that's okay
      if (response.status === 404) return null;
      
      // Other non-OK responses are actual errors
      if (!response.ok) {
        throw new Error(`Failed to fetch branding: ${response.status}`);
      }
      
      return response.json();
    },
    enabled: !!companyIdForData,
    retry: 1, // Only retry once for branding fetch
  });

  const branding = brandingData || {};
  const brandColors = (branding.subscriptionActive && branding.colors) ? branding.colors : [];
  const primaryBrandColor = brandColors[0] || null;
  const hasCustomBranding = !!(branding.subscriptionActive && (branding.logoUrl || (branding.colors && branding.colors.length > 0)));

  const projects = projectsData?.projects || [];

  // Fetch all work sessions across all projects for pie chart
  const { data: allWorkSessionsData } = useQuery({
    queryKey: ["/api/all-work-sessions"],
    enabled: projects.length > 0,
  });
  
  // Fetch all complaints for the company
  const { data: complaintsData, isLoading: complaintsLoading } = useQuery({
    queryKey: ["/api/complaints"],
  });

  // Fetch complaint metrics for average resolution time
  const { data: complaintMetricsData, isLoading: metricsLoading } = useQuery<{
    metrics: {
      totalClosed: number;
      averageResolutionMs: number | null;
    };
  }>({
    queryKey: ["/api/complaints/metrics", companyIdForData],
    enabled: !!companyIdForData,
  });

  // Fetch harness inspections
  const { data: harnessInspectionsData } = useQuery({
    queryKey: ["/api/harness-inspections"],
  });

  // Fetch toolbox meetings
  const { data: toolboxMeetingsData } = useQuery({
    queryKey: ["/api/toolbox-meetings"],
  });

  // Fetch FLHA forms
  const { data: flhaFormsData } = useQuery({
    queryKey: ["/api/flha-forms"],
  });

  // Fetch accepted team invitations (for owner notification)
  const { data: acceptedInvitationsData, refetch: refetchAcceptedInvitations } = useQuery<{
    invitations: Array<{
      id: string;
      respondedAt: string;
      technician: {
        id: string;
        name: string;
        email: string;
        employeePhoneNumber?: string;
        employeeStreetAddress?: string;
        employeeCity?: string;
        employeeProvinceState?: string;
        employeeCountry?: string;
        employeePostalCode?: string;
        homeAddress?: string;
        birthday?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
        emergencyContactRelationship?: string;
        specialMedicalConditions?: string;
        irataLevel?: string;
        irataLicenseNumber?: string;
        irataIssuedDate?: string;
        irataExpirationDate?: string;
        irataDocuments?: string[];
        irataVerifiedAt?: string;
        irataVerificationStatus?: string;
        spratLevel?: string;
        spratLicenseNumber?: string;
        spratIssuedDate?: string;
        spratExpirationDate?: string;
        spratDocuments?: string[];
        spratVerifiedAt?: string;
        spratVerificationStatus?: string;
        hasFirstAid?: boolean;
        firstAidType?: string;
        firstAidExpiry?: string;
        firstAidDocuments?: string[];
        driversLicenseNumber?: string;
        driversLicenseProvince?: string;
        driversLicenseIssuedDate?: string;
        driversLicenseExpiry?: string;
        driversLicenseDocuments?: string[];
        bankTransitNumber?: string;
        bankInstitutionNumber?: string;
        bankAccountNumber?: string;
        bankDocuments?: string[];
        socialInsuranceNumber?: string;
        photoUrl?: string;
      };
    }>;
  }>({
    queryKey: ["/api/accepted-invitations"],
    enabled: userData?.user?.role === 'owner' || userData?.user?.role === 'company' || userData?.user?.role === 'admin',
    refetchInterval: 10000, // Check every 10 seconds
  });

  const acceptedInvitations = acceptedInvitationsData?.invitations || [];

  // Fetch pending onboarding invitations (acknowledged but not yet converted)
  const { data: pendingOnboardingData, refetch: refetchPendingOnboarding } = useQuery<{
    invitations: Array<{
      id: string;
      respondedAt: string;
      acknowledgedAt: string;
      technician: {
        id: string;
        name: string;
        email: string;
        employeePhoneNumber?: string;
        employeeStreetAddress?: string;
        employeeCity?: string;
        employeeProvinceState?: string;
        employeeCountry?: string;
        employeePostalCode?: string;
        homeAddress?: string;
        birthday?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
        emergencyContactRelationship?: string;
        specialMedicalConditions?: string;
        irataLevel?: string;
        irataLicenseNumber?: string;
        irataIssuedDate?: string;
        irataExpirationDate?: string;
        irataDocuments?: string[];
        irataVerifiedAt?: string;
        irataVerificationStatus?: string;
        spratLevel?: string;
        spratLicenseNumber?: string;
        spratIssuedDate?: string;
        spratExpirationDate?: string;
        spratDocuments?: string[];
        spratVerifiedAt?: string;
        spratVerificationStatus?: string;
        hasFirstAid?: boolean;
        firstAidType?: string;
        firstAidExpiry?: string;
        firstAidDocuments?: string[];
        driversLicenseNumber?: string;
        driversLicenseProvince?: string;
        driversLicenseIssuedDate?: string;
        driversLicenseExpiry?: string;
        driversLicenseDocuments?: string[];
        bankTransitNumber?: string;
        bankInstitutionNumber?: string;
        bankAccountNumber?: string;
        bankDocuments?: string[];
        socialInsuranceNumber?: string;
        photoUrl?: string;
      };
    }>;
  }>({
    queryKey: ["/api/pending-onboarding-invitations"],
    enabled: userData?.user?.role === 'owner' || userData?.user?.role === 'company' || userData?.user?.role === 'admin',
  });

  const pendingOnboardingInvitations = pendingOnboardingData?.invitations || [];

  // Query for sent invitations (pending, not yet responded)
  const { data: sentInvitationsData } = useQuery<{
    invitations: Array<{
      id: string;
      createdAt: string;
      message?: string;
      technician: {
        id: string;
        name: string;
        email: string;
        employeePhoneNumber?: string;
        role: string;
      };
    }>;
  }>({
    queryKey: ["/api/sent-invitations"],
    enabled: userData?.user?.role === 'owner' || userData?.user?.role === 'company' || userData?.user?.role === 'admin' || userData?.user?.role === 'operations_manager',
  });

  const sentInvitations = sentInvitationsData?.invitations || [];

  // Mutation to cancel a sent invitation
  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await fetch(`/api/sent-invitations/${invitationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel invitation');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sent-invitations"] });
      toast({
        title: t('dashboard.invitations.cancelled', 'Invitation Cancelled'),
        description: t('dashboard.invitations.cancelledDesc', 'The invitation has been cancelled.'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation to acknowledge accepted invitation
  const acknowledgeInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await fetch(`/api/invitations/${invitationId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to acknowledge');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accepted-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pending-onboarding-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      toast({
        title: t('dashboard.invitations.acknowledged', 'Team Updated'),
        description: t('dashboard.invitations.acknowledgedDesc', 'New team member has been added to your roster.'),
      });
    },
  });

  // Mutation to convert accepted invitation to employee (with salary/permissions)
  const convertInvitationMutation = useMutation({
    mutationFn: async (payload: { 
      invitationId: string; 
      hourlyRate?: number; 
      isSalary?: boolean;
      salary?: number;
      permissions: string[];
      hasFirstAid?: boolean;
      firstAidType?: string;
      firstAidExpiry?: string;
      firstAidDocuments?: string[];
    }) => {
      const { invitationId, ...data } = payload;
      const response = await fetch(`/api/accepted-invitations/${invitationId}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to convert invitation');
      }
      return response.json();
    },
    onSuccess: async () => {
      // Close dialog and clear state first
      setShowInvitationEmployeeForm(false);
      setInvitationToConvert(null);
      setEmployeeFormStep(0);
      employeeForm.reset();
      
      // Then invalidate queries to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ["/api/accepted-invitations"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/pending-onboarding-invitations"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      
      toast({
        title: t('dashboard.invitations.employeeCreated', 'Employee Added'),
        description: t('dashboard.invitations.employeeCreatedDesc', 'The technician has been added to your team with the specified salary and permissions.'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error', 'Error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Fetch company documents
  const { data: companyDocumentsData } = useQuery({
    queryKey: ["/api/company-documents"],
  });
  
  const employees = employeesData?.employees || [];
  const todayDrops = myDropsData?.totalDropsToday || 0;
  const dailyTarget = projects[0]?.dailyDropTarget || 20;
  const companyName = companyData?.company?.companyName || "";
  const complaints = complaintsData?.complaints || [];
  const harnessInspections = harnessInspectionsData?.inspections || [];
  const toolboxMeetings = toolboxMeetingsData?.meetings || [];
  const flhaForms = flhaFormsData?.flhaForms || [];
  const companyDocuments = companyDocumentsData?.documents || [];
  
  // Check if specific company documents are uploaded
  const hasHealthSafetyManual = companyDocuments.some((doc: any) => doc.documentType === 'health_safety_manual');
  const hasCompanyPolicy = companyDocuments.some((doc: any) => doc.documentType === 'company_policy');

  // Calculate overall target met statistics across all projects
  const allWorkSessions = allWorkSessionsData?.sessions || [];
  const completedSessions = allWorkSessions.filter((s: any) => 
    s.endTime !== null && // Session is completed
    s.dailyDropTarget != null && // Has a drop target (excludes non-drop-based work)
    s.dailyDropTarget > 0 && // Target is meaningful
    s.employeeName // Has a valid employee name (API returns employeeName field)
  );
  const targetMetCount = completedSessions.filter((s: any) => s.dropsCompleted >= s.dailyDropTarget).length;
  // Valid reason sessions: below target but has a valid shortfall reason code
  const validReasonCount = completedSessions.filter((s: any) => 
    s.dropsCompleted < s.dailyDropTarget && s.validShortfallReasonCode
  ).length;
  // Below target without valid reason
  const belowTargetCount = completedSessions.filter((s: any) => 
    s.dropsCompleted < s.dailyDropTarget && !s.validShortfallReasonCode
  ).length;
  
  const performancePieData = [
    { name: t('dashboard.performance.targetMet', 'Target Met'), value: targetMetCount, color: "hsl(var(--primary))" },
    { name: t('dashboard.performance.validReason', 'Valid Reason'), value: validReasonCount, color: "hsl(var(--warning))" },
    { name: t('dashboard.performance.belowTarget', 'Below Target'), value: belowTargetCount, color: "hsl(var(--destructive))" },
  ];

  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      strataPlanNumber: "",
      buildingName: "",
      buildingAddress: "",
      latitude: null,
      longitude: null,
      jobCategory: "building_maintenance",
      jobType: "window_cleaning",
      customJobType: "",
      requiresElevation: true,
      totalDropsNorth: "",
      totalDropsEast: "",
      totalDropsSouth: "",
      totalDropsWest: "",
      dailyDropTarget: "",
      floorCount: "",
      buildingHeight: "",
      startDate: "",
      endDate: "",
      targetCompletionDate: "",
      estimatedHours: "",
      calendarColor: defaultCalendarColor,
      assignedEmployees: [],
      peaceWork: false,
      pricePerDrop: "",
    },
  });

  // Use useWatch for reactive updates to category and jobType
  const watchedCategory = useWatch({ control: projectForm.control, name: "jobCategory" });
  const watchedJobType = useWatch({ control: projectForm.control, name: "jobType" });
  
  // Track previous values to determine what changed and avoid double-firing
  const prevCategoryRef = useRef<string | undefined>(watchedCategory);
  const prevJobTypeRef = useRef<string | undefined>(watchedJobType);
  
  // Single unified effect handles both category and jobType changes
  useEffect(() => {
    const categoryChanged = watchedCategory !== prevCategoryRef.current;
    const jobTypeChanged = watchedJobType !== prevJobTypeRef.current;
    
    // Update refs immediately to track current values
    prevCategoryRef.current = watchedCategory;
    prevJobTypeRef.current = watchedJobType;
    
    if (categoryChanged && watchedCategory) {
      // Category changed - set jobType to first type in category and update elevation
      const types = getJobTypesByCategory(watchedCategory as JobCategory);
      if (types.length > 0) {
        const nextJobType = types[0].value;
        const elevationDefault = getDefaultElevation(nextJobType);
        
        // Update jobType if it doesn't match the expected first type
        if (nextJobType !== watchedJobType) {
          prevJobTypeRef.current = nextJobType; // Pre-update ref to prevent jobType branch from firing
          projectForm.setValue("jobType", nextJobType, { shouldDirty: true, shouldValidate: true });
        }
        
        // Always update elevation when category changes
        projectForm.setValue("requiresElevation", elevationDefault, { shouldDirty: true, shouldValidate: true });
        
        if (nextJobType !== "other" && nextJobType !== "ndt_other") {
          setShowOtherElevationFields(false);
        }
      }
    } else if (jobTypeChanged && watchedJobType && !categoryChanged) {
      // JobType changed directly (not from category change) - update elevation
      const elevationDefault = getDefaultElevation(watchedJobType);
      projectForm.setValue("requiresElevation", elevationDefault, { shouldDirty: true, shouldValidate: true });
      
      if (watchedJobType !== "other" && watchedJobType !== "ndt_other") {
        setShowOtherElevationFields(false);
      }
    }
  }, [watchedCategory, watchedJobType]);

  // Auto-set target completion date when end date is selected
  useEffect(() => {
    const subscription = projectForm.watch((value, { name }) => {
      if (name === "endDate" && value.endDate) {
        projectForm.setValue("targetCompletionDate", value.endDate);
      }
    });
    return () => subscription.unsubscribe();
  }, [projectForm]);

  const employeeForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "rope_access_tech",
      hourlyRate: "",
      isSalary: false,
      salary: "",
      permissions: [],
      startDate: "",
      birthday: "",
      socialInsuranceNumber: "",
      driversLicenseNumber: "",
      driversLicenseProvince: "",
      driversLicenseDocuments: [],
      homeAddress: "",
      employeePhoneNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      specialMedicalConditions: "",
      irataLevel: "",
      irataLicenseNumber: "",
      irataIssuedDate: "",
      irataExpirationDate: "",
      hasFirstAid: false,
      firstAidType: "",
      firstAidExpiry: "",
      firstAidDocuments: [],
    },
  });

  const editEmployeeForm = useForm<EditEmployeeFormData>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "rope_access_tech",
      hourlyRate: "",
      isSalary: false,
      salary: "",
      permissions: [],
      startDate: "",
      birthday: "",
      socialInsuranceNumber: "",
      driversLicenseNumber: "",
      driversLicenseProvince: "",
      driversLicenseDocuments: [],
      homeAddress: "",
      employeePhoneNumber: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      specialMedicalConditions: "",
      irataLevel: "",
      irataLicenseNumber: "",
      irataIssuedDate: "",
      irataExpirationDate: "",
      spratLevel: "",
      spratLicenseNumber: "",
      spratIssuedDate: "",
      spratExpirationDate: "",
      hasFirstAid: false,
      firstAidType: "",
      firstAidExpiry: "",
      firstAidDocuments: [],
      terminatedDate: "",
      terminationReason: "",
      terminationNotes: "",
    },
  });

  // Helper for local date formatting
  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const dropForm = useForm<DropLogFormData>({
    resolver: zodResolver(dropLogSchema),
    defaultValues: {
      projectId: "",
      date: getLocalDateString(),
      dropsCompleted: "",
    },
  });

  const endDayForm = useForm<EndDayFormData>({
    resolver: zodResolver(endDaySchema),
    defaultValues: {
      dropsNorth: "",
      dropsEast: "",
      dropsSouth: "",
      dropsWest: "",
      shortfallReason: "",
      ropeAccessTaskHours: "",
    },
  });

  const clientForm = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      phoneNumber: "",
      lmsNumbers: [""],
      billingAddress: "",
      sameAsAddress: false,
    },
  });

  const editClientForm = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      phoneNumber: "",
      lmsNumbers: [""],
      billingAddress: "",
      sameAsAddress: false,
    },
  });

  // Auto-select all permissions for Owner/CEO role when creating employee
  // Auto-select financial permissions for Accounting role when creating employee
  // Note: Permissions are intentionally preserved when switching roles to allow manual customization
  useEffect(() => {
    const subscription = employeeForm.watch((value, { name }) => {
      if (name === "role") {
        if (value.role === "owner_ceo") {
          const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
          employeeForm.setValue("permissions", allPermissionIds);
        } else if (value.role === "accounting") {
          const currentPermissions = employeeForm.getValues("permissions") || [];
          if (!currentPermissions.includes("view_financial_data")) {
            employeeForm.setValue("permissions", [...currentPermissions, "view_financial_data"]);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [employeeForm]);

  // Auto-select all permissions for Owner/CEO role when editing employee
  // Auto-select financial permissions for Accounting role when editing employee
  // Note: Permissions are intentionally preserved when switching roles to allow manual customization
  useEffect(() => {
    const subscription = editEmployeeForm.watch((value, { name }) => {
      if (name === "role") {
        if (value.role === "owner_ceo") {
          const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
          editEmployeeForm.setValue("permissions", allPermissionIds);
        } else if (value.role === "accounting") {
          const currentPermissions = editEmployeeForm.getValues("permissions") || [];
          if (!currentPermissions.includes("view_financial_data")) {
            editEmployeeForm.setValue("permissions", [...currentPermissions, "view_financial_data"]);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [editEmployeeForm]);

  // Poll for verification status updates when the invitation form is open
  // This checks if the technician has verified their irata/SPRAT license
  useEffect(() => {
    // Only poll if the invitation form is open and there's a technician to check
    if (!showInvitationEmployeeForm || !invitationToConvert?.technician) {
      return;
    }

    const tech = invitationToConvert.technician;
    const needsIrataCheck = tech.irataLicenseNumber && !tech.irataVerifiedAt;
    const needsSpratCheck = tech.spratLicenseNumber && !tech.spratVerifiedAt;

    // If both are already verified (or don't exist), no need to poll
    if (!needsIrataCheck && !needsSpratCheck) {
      return;
    }

    const pollVerificationStatus = async () => {
      try {
        const response = await fetch('/api/accepted-invitations', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const updatedInvitation = data.invitations?.find(
            (inv: any) => inv.id === invitationToConvert.id
          );
          if (updatedInvitation?.technician) {
            const updatedTech = updatedInvitation.technician;
            // Check if verification status has changed
            if (
              (needsIrataCheck && updatedTech.irataVerifiedAt) ||
              (needsSpratCheck && updatedTech.spratVerifiedAt)
            ) {
              // Update the invitation with new verification data
              setInvitationToConvert(updatedInvitation);
            }
          }
        }
      } catch (error) {
        console.error('Error polling verification status:', error);
      }
    };

    // Poll every 10 seconds
    const intervalId = setInterval(pollVerificationStatus, 10000);

    // Also do an initial check
    pollVerificationStatus();

    return () => clearInterval(intervalId);
  }, [showInvitationEmployeeForm, invitationToConvert?.id, invitationToConvert?.technician?.irataVerifiedAt, invitationToConvert?.technician?.spratVerifiedAt]);

  // Check for active session on component mount - only run once
  useEffect(() => {
    const checkActiveSession = async () => {
      if (projects.length > 0 && !activeSession) {
        try {
          // Check all projects for an active session
          for (const project of projects) {
            try {
              const response = await fetch(`/api/projects/${project.id}/my-work-sessions`, {
                credentials: "include",
                cache: "no-store", // Force fresh data
              });
              if (response.ok) {
                const data = await response.json();
                const active = data.sessions?.find((s: any) => !s.endTime);
                if (active) {
                  setActiveSession(active);
                  setSelectedProject(project);
                  return; // Found active session, stop searching
                }
              }
            } catch (fetchError) {
              // Continue to next project if this one fails
              continue;
            }
          }
        } catch (error) {
          console.error("Failed to check active session:", error);
        }
      }
    };
    checkActiveSession();
  }, [projects, activeSession]);

  // Handle quote-to-project conversion via URL parameters and sessionStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromQuote = urlParams.get('fromQuote');
    const action = urlParams.get('action');
    const tab = urlParams.get('tab');
    
    if (fromQuote === 'true' && action === 'create' && tab === 'projects') {
      // Read quote data from sessionStorage
      const quoteDataStr = sessionStorage.getItem('quoteToProject');
      if (quoteDataStr) {
        try {
          const quoteData = JSON.parse(quoteDataStr);
          
          // Switch to projects tab
          handleTabChange('projects');
          
          // Prefill the project form with quote data
          projectForm.reset({
            strataPlanNumber: quoteData.strataPlanNumber || "",
            buildingName: quoteData.buildingName || "",
            buildingAddress: quoteData.buildingAddress || "",
            floorCount: quoteData.floorCount || "",
            jobType: quoteData.jobType || "window_cleaning",
            customJobType: quoteData.customJobType || "",
            totalDropsNorth: quoteData.totalDropsNorth || "",
            totalDropsEast: quoteData.totalDropsEast || "",
            totalDropsSouth: quoteData.totalDropsSouth || "",
            totalDropsWest: quoteData.totalDropsWest || "",
            dailyDropTarget: quoteData.dailyDropTarget || "",
            startDate: "",
            endDate: "",
            targetCompletionDate: "",
            estimatedHours: "",
            calendarColor: defaultCalendarColor,
            assignedEmployees: [],
            peaceWork: false,
            pricePerDrop: "",
          });
          
          // Show elevation fields if the job type is "other"
          if (quoteData.jobType === "other") {
            setShowOtherElevationFields(true);
          }
          
          // Set the client selection from the quote if available
          if (quoteData.clientId && clientsData) {
            const client = clientsData.find(c => c.id === quoteData.clientId);
            if (client && client.lmsNumbers && client.lmsNumbers.length > 0) {
              // Find the matching strata by strata plan number from quote
              const strataIndex = client.lmsNumbers.findIndex(
                (s: any) => s.number === quoteData.strataPlanNumber
              );
              if (strataIndex >= 0) {
                // Set both client and strata for proper dropdown display
                setSelectedClientForProject(quoteData.clientId);
                setSelectedStrataForProject(`${quoteData.clientId}|${strataIndex}`);
              } else {
                // Client found but no matching strata - just set client
                setSelectedClientForProject(quoteData.clientId);
                // Use first strata as fallback
                setSelectedStrataForProject(`${quoteData.clientId}|0`);
              }
            } else {
              // Client found but no strata - just set client ID
              setSelectedClientForProject(quoteData.clientId);
            }
          }
          
          // Open the project creation dialog
          setShowProjectDialog(true);
          
          // Clear sessionStorage and URL params after reading
          sessionStorage.removeItem('quoteToProject');
          window.history.replaceState({}, '', '/dashboard');
          
          // Show toast notification
          toast({
            title: t('dashboard.quoteImport.success', 'Quote Data Imported'),
            description: t('dashboard.quoteImport.prefilled', 'Building details from quote #{{quoteNumber}} have been prefilled', { quoteNumber: quoteData.quoteNumber || '' }),
          });
        } catch (error) {
          console.error('Error parsing quote data:', error);
        }
      }
    }
  }, [projectForm, defaultCalendarColor, toast, t, clientsData]);

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData & { ropeAccessPlanUrl?: string | null; anchorInspectionCertificateUrl?: string | null; forceAssignment?: boolean }) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          jobCategory: data.jobCategory || 'building_maintenance',
          requiresElevation: data.requiresElevation ?? true,
          totalDropsNorth: data.totalDropsNorth ? parseInt(data.totalDropsNorth) : 0,
          totalDropsEast: data.totalDropsEast ? parseInt(data.totalDropsEast) : 0,
          totalDropsSouth: data.totalDropsSouth ? parseInt(data.totalDropsSouth) : 0,
          totalDropsWest: data.totalDropsWest ? parseInt(data.totalDropsWest) : 0,
          totalDrops: (data.totalDropsNorth ? parseInt(data.totalDropsNorth) : 0) + 
                     (data.totalDropsEast ? parseInt(data.totalDropsEast) : 0) + 
                     (data.totalDropsSouth ? parseInt(data.totalDropsSouth) : 0) + 
                     (data.totalDropsWest ? parseInt(data.totalDropsWest) : 0),
          dailyDropTarget: data.dailyDropTarget ? parseInt(data.dailyDropTarget) : undefined,
          floorCount: data.floorCount ? parseInt(data.floorCount) : undefined,
          buildingHeight: data.buildingHeight || undefined,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
          estimatedHours: data.estimatedHours ? parseInt(data.estimatedHours) : undefined,
          ropeAccessPlanUrl: data.ropeAccessPlanUrl || undefined,
          anchorInspectionCertificateUrl: data.anchorInspectionCertificateUrl || undefined,
          suitesPerDay: data.suitesPerDay ? parseInt(data.suitesPerDay) : undefined,
          totalFloors: data.totalFloors ? parseInt(data.totalFloors) : undefined,
          floorsPerDay: data.floorsPerDay ? parseInt(data.floorsPerDay) : undefined,
          totalStalls: data.totalStalls ? parseInt(data.totalStalls) : undefined,
          stallsPerDay: data.stallsPerDay ? parseInt(data.stallsPerDay) : undefined,
          totalAnchors: data.totalAnchors ? parseInt(data.totalAnchors) : undefined,
          anchorsPerDay: data.anchorsPerDay ? parseInt(data.anchorsPerDay) : undefined,
          assignedEmployees: data.assignedEmployees || [],
          peaceWork: data.peaceWork || false,
          pricePerDrop: data.pricePerDrop ? parseInt(data.pricePerDrop) : undefined,
          forceAssignment: data.forceAssignment || false,
          // Explicitly include coordinates for map display
          latitude: data.latitude !== null && data.latitude !== undefined ? String(data.latitude) : undefined,
          longitude: data.longitude !== null && data.longitude !== undefined ? String(data.longitude) : undefined,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check for conflict error (409)
        if (response.status === 409 && errorData.conflicts) {
          // Store data for potential force submit and show dialog
          setPendingProjectData(data);
          setProjectPendingConflicts(errorData.conflicts.map((c: any) => ({
            employeeId: c.employeeId,
            employeeName: c.employeeName,
            conflictingJob: c.conflictingJobTitle,
            conflictType: c.conflictType,
          })));
          setProjectConflictDialogOpen(true);
          throw new Error("CONFLICT_DETECTED");
        }
        throw new Error(errorData.message || "Failed to create project");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      // Store project data BEFORE resetting
      const formData = projectForm.getValues();
      
      // Track project creation
      trackProjectCreated({
        projectType: formData.jobType,
        clientId: selectedClientForProject || undefined,
      });
      
      // Check if this project was created from client database or manually
      // If selectedClientForProject is empty, it means manual entry
      const wasManualEntry = !selectedClientForProject;
      
      // Close dialog and reset everything
      setShowProjectDialog(false);
      projectForm.reset();
      setUploadedPlanFile(null);
      setUploadedAnchorCertFile(null);
      setSelectedClientForProject("");
      setSelectedStrataForProject("");
      setShowOtherElevationFields(false);
      isManualEntryRef.current = false;
      
      toast({ title: t('dashboard.toast.projectCreated', 'Project created successfully') });
      
      // If manual entry, show save dialog after a brief delay
      if (wasManualEntry) {
        setProjectDataForClient(formData);
        setTimeout(() => {
          setShowSaveAsClientDialog(true);
        }, 100);
      }
    },
    onError: (error: Error) => {
      // Don't show toast for conflict detection - dialog handles it
      if (error.message === "CONFLICT_DETECTED") return;
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });
  
  // Force create project (bypasses conflict check)
  const handleForceCreateProject = () => {
    if (pendingProjectData) {
      createProjectMutation.mutate({ ...pendingProjectData, forceAssignment: true });
      setProjectConflictDialogOpen(false);
      setProjectPendingConflicts([]);
      setPendingProjectData(null);
    }
  };

  const createEmployeeMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create employee");
      }

      return response.json();
    },
    onSuccess: () => {
      // Track employee creation
      const formData = employeeForm.getValues();
      trackEmployeeAdded({
        role: formData.role,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      setShowEmployeeDialog(false);
      setEmployeeFormStep(1); // Reset to step 1
      employeeForm.reset();
      toast({
        title: t('dashboard.toast.employeeCreated', 'Employee created successfully'),
      });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  // Search for OnRopePro technicians
  const searchOnRopeProTechnician = async () => {
    if (!onRopeProSearchValue.trim()) {
      toast({ title: "Search value required", description: "Please enter a value to search", variant: "destructive" });
      return;
    }
    
    setTechnicianSearching(true);
    setFoundTechnician(null);
    setTechnicianSearchWarning(null);
    
    try {
      const response = await fetch(`/api/technicians/search?searchType=${onRopeProSearchType}&searchValue=${encodeURIComponent(onRopeProSearchValue)}`, {
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Search failed");
      }
      
      if (data.found) {
        setFoundTechnician(data.technician);
        setTechnicianSearchWarning(data.warning || null);
      } else {
        toast({ 
          title: "No technician found", 
          description: data.message || "No unlinked technician found with that information",
          variant: "default" 
        });
      }
    } catch (error: any) {
      toast({ 
        title: "Search failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setTechnicianSearching(false);
    }
  };

  // Send invitation to OnRopePro technician to join company
  const inviteOnRopeProTechnician = async () => {
    if (!foundTechnician) return;
    
    setTechnicianLinking(true);
    
    try {
      const response = await fetch(`/api/technicians/${foundTechnician.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
      
      const data = await response.json();
      
      // Store debug response for visibility
      setInviteDebugResponse({
        timestamp: new Date().toISOString(),
        status: response.status,
        statusOk: response.ok,
        data
      });
      
      if (!response.ok) {
        throw new Error(data.message || "Invitation failed");
      }
      
      setShowEmployeeDialog(false);
      resetOnRopeProSearch();
      toast({ 
        title: t('dashboard.toast.invitationSent', 'Invitation Sent!'), 
        description: data.message || t('dashboard.toast.invitationSentDesc', `An invitation has been sent to ${foundTechnician.name}. They can accept or decline in their portal.`),
      });
    } catch (error: any) {
      setInviteDebugResponse({
        timestamp: new Date().toISOString(),
        error: error.message
      });
      toast({ 
        title: t('dashboard.toast.invitationFailed', 'Failed to send invitation'), 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setTechnicianLinking(false);
    }
  };

  // Reset OnRopePro search state
  const resetOnRopeProSearch = () => {
    setAddEmployeeMode(null);
    setEmployeeFormStep(0);
    setOnRopeProSearchType('irata');
    setOnRopeProSearchValue('');
    setFoundTechnician(null);
    employeeForm.reset();
  };

  const editEmployeeMutation = useMutation({
    mutationFn: async (data: EditEmployeeFormData & { id: string }) => {
      const response = await apiRequest("PATCH", `/api/employees/${data.id}`, {
        name: data.name,
        email: data.email,
        role: data.role,
        hourlyRate: data.hourlyRate,
        permissions: data.permissions,
        startDate: data.startDate,
        birthday: data.birthday,
        socialInsuranceNumber: data.socialInsuranceNumber,
        driversLicenseNumber: data.driversLicenseNumber,
        driversLicenseProvince: data.driversLicenseProvince,
        driversLicenseDocuments: data.driversLicenseDocuments,
        homeAddress: data.homeAddress,
        employeePhoneNumber: data.employeePhoneNumber,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        specialMedicalConditions: data.specialMedicalConditions,
        irataLevel: data.irataLevel,
        irataLicenseNumber: data.irataLicenseNumber,
        irataIssuedDate: data.irataIssuedDate,
        irataExpirationDate: data.irataExpirationDate,
        terminatedDate: data.terminatedDate,
        terminationReason: data.terminationReason,
        terminationNotes: data.terminationNotes,
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      // Invalidate all work sessions to refresh hourly rates
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          query.queryKey.length >= 3 && 
          query.queryKey[0] === "/api/projects" && 
          query.queryKey[2] === "work-sessions"
      });
      setShowEditEmployeeDialog(false);
      setEditEmployeeFormStep(1); // Reset to step 1
      setEmployeeToEdit(null);
      editEmployeeForm.reset();
      toast({
        title: t('dashboard.toast.employeeUpdated', 'Employee updated successfully'),
      });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const handleClientStrataSelection = (value: string) => {
    setSelectedStrataForProject(value);
    
    if (value === "manual") {
      // Set the ref to track manual entry
      isManualEntryRef.current = true;
      // Clear all form fields
      projectForm.reset();
      setSelectedClientForProject("");
      return;
    }
    
    // Not manual entry
    isManualEntryRef.current = false;

    // Parse the value (format: "clientId|strataNumber")
    const [clientId, strataIndex] = value.split("|");
    setSelectedClientForProject(clientId);
    
    // Find the client and strata details
    const client = clientsData?.find(c => c.id === clientId);
    if (client && client.lmsNumbers && client.lmsNumbers.length > 0) {
      const strataIdx = parseInt(strataIndex);
      const strata = client.lmsNumbers[strataIdx];
      
      if (strata) {
        // Autofill the form
        projectForm.setValue("strataPlanNumber", strata.number);
        projectForm.setValue("buildingAddress", strata.address || "");
        
        // Optionally set building name from client company or generate from strata
        projectForm.setValue("buildingName", `${strata.number} Building`);
        
        // Always populate all available building details
        // The form will show/hide fields based on selected job type
        if (strata.stories !== undefined && strata.stories !== null) {
          projectForm.setValue("floorCount", String(strata.stories));
        }
        
        // Populate Daily Drop Target if available
        if (strata.dailyDropTarget !== undefined && strata.dailyDropTarget !== null) {
          projectForm.setValue("dailyDropTarget", String(strata.dailyDropTarget));
        }
        
        // Populate Total Drops per Elevation if available
        if (strata.totalDropsNorth !== undefined && strata.totalDropsNorth !== null) {
          projectForm.setValue("totalDropsNorth", String(strata.totalDropsNorth));
        }
        if (strata.totalDropsEast !== undefined && strata.totalDropsEast !== null) {
          projectForm.setValue("totalDropsEast", String(strata.totalDropsEast));
        }
        if (strata.totalDropsSouth !== undefined && strata.totalDropsSouth !== null) {
          projectForm.setValue("totalDropsSouth", String(strata.totalDropsSouth));
        }
        if (strata.totalDropsWest !== undefined && strata.totalDropsWest !== null) {
          projectForm.setValue("totalDropsWest", String(strata.totalDropsWest));
        }
      }
    }
  };

  const handleSaveProjectAsClient = () => {
    if (!projectDataForClient) return;
    
    // Pre-fill the client form with building details from the project
    const lmsData = [{
      number: projectDataForClient.strataPlanNumber || "",
      buildingName: projectDataForClient.buildingName || "",
      address: projectDataForClient.buildingAddress || "",
      stories: projectDataForClient.floorCount ? parseInt(projectDataForClient.floorCount) : undefined,
      dailyDropTarget: projectDataForClient.dailyDropTarget ? parseInt(projectDataForClient.dailyDropTarget) : undefined,
      totalDropsNorth: projectDataForClient.totalDropsNorth ? parseInt(projectDataForClient.totalDropsNorth) : undefined,
      totalDropsEast: projectDataForClient.totalDropsEast ? parseInt(projectDataForClient.totalDropsEast) : undefined,
      totalDropsSouth: projectDataForClient.totalDropsSouth ? parseInt(projectDataForClient.totalDropsSouth) : undefined,
      totalDropsWest: projectDataForClient.totalDropsWest ? parseInt(projectDataForClient.totalDropsWest) : undefined,
    }];
    
    setLmsNumbers(lmsData);
    
    // Reset the client form with empty contact info
    clientForm.reset({
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      phoneNumber: "",
      billingAddress: "",
    });
    
    // Close the save dialog
    setShowSaveAsClientDialog(false);
    setProjectDataForClient(null);
    
    // Switch to Clients tab and open the client dialog
    setLocation(getDashboardUrl('clients'));
    setTimeout(() => {
      setShowClientDialog(true);
    }, 100);
  };

  const onProjectSubmit = async (data: ProjectFormData) => {
    // Normalize strata plan number (remove spaces, uppercase)
    const normalizedData = {
      ...data,
      strataPlanNumber: normalizeStrataPlan(data.strataPlanNumber),
    };
    
    let ropeAccessPlanUrl = null;
    let anchorInspectionCertificateUrl = null;
    
    // Upload rope access plan PDF if one was selected
    if (uploadedPlanFile) {
      setIsUploadingPlan(true);
      try {
        const formData = new FormData();
        formData.append('file', uploadedPlanFile);
        
        const uploadResponse = await fetch('/api/upload-rope-access-plan', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || 'Failed to upload fall protection plan');
        }
        
        ropeAccessPlanUrl = uploadResult.url;
      } catch (error) {
        setIsUploadingPlan(false);
        toast({ 
          title: "Upload failed", 
          description: error instanceof Error ? error.message : "Failed to upload PDF", 
          variant: "destructive" 
        });
        return;
      }
      setIsUploadingPlan(false);
    }
    
    // Upload anchor inspection certificate PDF if one was selected
    if (uploadedAnchorCertFile) {
      setIsUploadingAnchorCert(true);
      try {
        const formData = new FormData();
        formData.append('file', uploadedAnchorCertFile);
        
        const uploadResponse = await fetch('/api/upload-anchor-certificate', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || 'Failed to upload anchor inspection certificate');
        }
        
        anchorInspectionCertificateUrl = uploadResult.url;
      } catch (error) {
        setIsUploadingAnchorCert(false);
        toast({ 
          title: "Upload failed", 
          description: error instanceof Error ? error.message : "Failed to upload anchor inspection certificate", 
          variant: "destructive" 
        });
        return;
      }
      setIsUploadingAnchorCert(false);
    }
    
    createProjectMutation.mutate({
      ...normalizedData,
      ropeAccessPlanUrl,
      anchorInspectionCertificateUrl,
      // Include clientId if a client was selected (even if strata was changed to new one)
      clientId: selectedClientForProject && selectedClientForProject !== "manual" 
        ? (selectedClientForProject.includes('|') ? selectedClientForProject.split('|')[0] : selectedClientForProject)
        : undefined,
    });
    setUploadedPlanFile(null);
    setUploadedAnchorCertFile(null);
  };

  const onEmployeeSubmit = async (data: EmployeeFormData) => {
    createEmployeeMutation.mutate(data);
  };

  const handleEditEmployee = (employee: any) => {
    setEmployeeToEdit(employee);
    editEmployeeForm.reset({
      name: employee.name ?? "",
      email: employee.email ?? "",
      role: employee.role,
      hourlyRate: employee.hourlyRate != null ? String(employee.hourlyRate) : "",
      isSalary: employee.isSalary ?? false,
      salary: employee.salary != null ? String(employee.salary) : "",
      permissions: employee.permissions || [],
      startDate: employee.startDate ?? "",
      birthday: employee.birthday ?? "",
      socialInsuranceNumber: employee.socialInsuranceNumber ?? "",
      driversLicenseNumber: employee.driversLicenseNumber ?? "",
      driversLicenseProvince: employee.driversLicenseProvince ?? "",
      driversLicenseDocuments: employee.driversLicenseDocuments || [],
      homeAddress: employee.homeAddress ?? "",
      employeePhoneNumber: employee.employeePhoneNumber ?? "",
      emergencyContactName: employee.emergencyContactName ?? "",
      emergencyContactPhone: employee.emergencyContactPhone ?? "",
      specialMedicalConditions: employee.specialMedicalConditions ?? "",
      irataLevel: employee.irataLevel ?? "",
      irataLicenseNumber: employee.irataLicenseNumber ?? "",
      irataIssuedDate: employee.irataIssuedDate ?? "",
      irataExpirationDate: employee.irataExpirationDate ?? "",
      spratLevel: employee.spratLevel ?? "",
      spratLicenseNumber: employee.spratLicenseNumber ?? "",
      spratIssuedDate: employee.spratIssuedDate ?? "",
      spratExpirationDate: employee.spratExpirationDate ?? "",
      terminatedDate: employee.terminatedDate ?? "",
      terminationReason: employee.terminationReason ?? "",
      terminationNotes: employee.terminationNotes ?? "",
    });
    setEditEmployeeFormStep(1); // Reset to first step
    setShowEditEmployeeDialog(true);
  };
  
  // Watch for termination date changes
  const watchedTerminationDate = editEmployeeForm.watch("terminatedDate");
  useEffect(() => {
    // If a termination date is set and there's no termination reason yet, open dialog
    if (watchedTerminationDate && !editEmployeeForm.getValues("terminationReason") && employeeToEdit && !employeeToEdit.terminatedDate) {
      setShowTerminationDialog(true);
    }
  }, [watchedTerminationDate, employeeToEdit]);
  
  const handleTerminationSubmit = () => {
    editEmployeeForm.setValue("terminationReason", terminationData.reason);
    editEmployeeForm.setValue("terminationNotes", terminationData.notes);
    setShowTerminationDialog(false);
    setTerminationData({ reason: "", notes: "" });
  };
  
  const reactivateEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await apiRequest("POST", `/api/employees/${employeeId}/reactivate`, {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      toast({
        title: t('dashboard.toast.employeeReactivated', 'Employee reactivated successfully'),
      });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });
  
  const reactivateSuspendedMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await fetch(`/api/employees/${employeeId}/reactivate-suspended`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reactivate employee");
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t('dashboard.toast.employeeReactivated', 'Employee reactivated successfully'),
        description: data?.seatAdded 
          ? t('dashboard.toast.seatAddedForReactivation', 'A new seat was added to your subscription.')
          : t('dashboard.toast.employeeReactivatedDesc', 'The employee now has access to their account.'),
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: t('dashboard.toast.error', 'Error'), 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const onEditEmployeeSubmit = async (data: EditEmployeeFormData) => {
    if (!employeeToEdit) return;
    editEmployeeMutation.mutate({ ...data, id: employeeToEdit.id });
  };

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete employee");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      setEmployeeToDelete(null);
      toast({ title: t('dashboard.toast.employeeUnlinked', 'Employee unlinked successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  // Suspend employee and remove seat mutation
  const suspendSeatMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const response = await apiRequest("POST", "/api/stripe/remove-seats", {
        quantity: 1,
        employeeIds: [employeeId],
      });
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setEmployeeToSuspendSeat(null);
      const creditAmount = data.creditAmount || 0;
      toast({ 
        title: t('dashboard.toast.employeeInactive', 'Employee now inactive'),
        description: creditAmount > 0 
          ? t('dashboard.toast.seatRemovedWithCredit', `Seat removed. $${creditAmount.toFixed(2)} credit applied to your account.`)
          : t('dashboard.toast.seatRemoved', 'Seat removed from your subscription.')
      });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({ employeeId, newPassword }: { employeeId: string; newPassword: string }) => {
      const response = await apiRequest("PATCH", `/api/employees/${employeeId}/change-password`, {
        newPassword,
      });
      return response;
    },
    onSuccess: () => {
      setShowChangePasswordDialog(false);
      setEmployeeToChangePassword(null);
      setNewPassword("");
      toast({ title: t('dashboard.toast.passwordChanged', 'Password changed successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      const { sameAsAddress, ...clientData } = data;
      return await apiRequest("POST", "/api/clients", {
        ...clientData,
        companyId: currentUser?.id,
        lmsNumbers: lmsNumbers.filter(lms => lms.number.trim() !== ""),
      });
    },
    onSuccess: () => {
      // Track client creation
      trackClientAdded();
      
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setShowClientDialog(false);
      clientForm.reset();
      setLmsNumbers([{ number: "", address: "" }]);
      setSameAsAddress(false);
      toast({ title: t('dashboard.toast.clientCreated', 'Client created successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const editClientMutation = useMutation({
    mutationFn: async (data: { id: string } & ClientFormData) => {
      const { id, sameAsAddress, ...clientData } = data;
      return await apiRequest("PATCH", `/api/clients/${id}`, {
        ...clientData,
        lmsNumbers: editLmsNumbers.filter(lms => lms.number.trim() !== ""),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setShowEditClientDialog(false);
      setClientToEdit(null);
      editClientForm.reset();
      setEditLmsNumbers([{ number: "", address: "" }]);
      setEditSameAsAddress(false);
      toast({ title: t('dashboard.toast.clientUpdated', 'Client updated successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      return await apiRequest("DELETE", `/api/clients/${clientId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setShowDeleteClientDialog(false);
      setClientToDelete(null);
      toast({ title: t('dashboard.toast.clientDeleted', 'Client deleted successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteClientDialog(true);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      deleteClientMutation.mutate(clientToDelete.id);
    }
  };

  const onClientSubmit = async (data: ClientFormData) => {
    createClientMutation.mutate(data);
  };

  const onEditClientSubmit = async (data: ClientFormData) => {
    if (!clientToEdit) return;
    editClientMutation.mutate({ ...data, id: clientToEdit.id });
  };

  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    editClientForm.reset({
      firstName: client.firstName,
      lastName: client.lastName,
      company: client.company || "",
      email: client.email || "",
      address: client.address || "",
      phoneNumber: client.phoneNumber || "",
      billingAddress: client.billingAddress || "",
      sameAsAddress: false,
    });
    setEditLmsNumbers(client.lmsNumbers && client.lmsNumbers.length > 0 ? client.lmsNumbers : [{ number: "", address: "" }]);
    setEditSameAsAddress(client.address === client.billingAddress);
    setShowEditClientDialog(true);
  };

  const deleteInspectionMutation = useMutation({
    mutationFn: async (inspectionId: string) => {
      const response = await fetch(`/api/harness-inspections/${inspectionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete inspection");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/harness-inspections"] });
      setSelectedInspection(null);
      toast({ title: t('dashboard.toast.inspectionDeleted', 'Harness inspection deleted successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: async (meetingId: string) => {
      const response = await fetch(`/api/toolbox-meetings/${meetingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete meeting");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/toolbox-meetings"] });
      setSelectedMeeting(null);
      toast({ title: t('dashboard.toast.meetingDeleted', 'Toolbox meeting deleted successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const logDropsMutation = useMutation({
    mutationFn: async (data: DropLogFormData) => {
      const response = await fetch("/api/drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: data.projectId,
          date: data.date,
          dropsCompleted: parseInt(data.dropsCompleted),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to log drops");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      dropForm.reset({
        projectId: "",
        date: getLocalDateString(),
        dropsCompleted: "",
      });
      setShowDropDialog(false);
      setDropProject(null);
      toast({ title: t('dashboard.toast.dropsLogged', 'Drops logged successfully') });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  // Helper function to get current GPS location
  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser");
        toast({ 
          title: t('dashboard.workSession.locationNotAvailable', 'Location Not Available'), 
          description: t('dashboard.workSession.browserNotSupported', "Your browser doesn't support location tracking"),
          variant: "destructive" 
        });
        resolve(null);
        return;
      }

      console.log("Requesting location permission...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location captured:", position.coords.latitude, position.coords.longitude);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Failed to get location:", error.message);
          if (error.code === error.PERMISSION_DENIED) {
            toast({ 
              title: t('dashboard.workSession.locationPermissionDenied', 'Location Permission Denied'), 
              description: t('dashboard.workSession.locationOptional', 'Location tracking is optional but helps verify work site attendance'),
            });
          } else if (error.code === error.TIMEOUT) {
            toast({ 
              title: t('dashboard.workSession.locationTimeout', 'Location Timeout'), 
              description: t('dashboard.workSession.locationTimeoutDesc', 'Could not determine location in time. Session will continue without location data.'),
            });
          }
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const startDayMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const location = await getCurrentLocation();
      console.log("Starting work session with location:", location);
      
      // Get local date in YYYY-MM-DD format (user's timezone)
      const localDate = new Date();
      const localDateString = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      
      return apiRequest("POST", `/api/projects/${projectId}/work-sessions/start`, {
        startLatitude: location?.latitude,
        startLongitude: location?.longitude,
        workDate: localDateString, // Send client's local date
      });
    },
    onSuccess: (data) => {
      console.log("Start day response:", data);
      setActiveSession(data.session);
      setShowStartDayDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      const hasLocation = data.session?.startLatitude && data.session?.startLongitude;
      
      // Track work session start
      trackWorkSessionStart({
        projectId: data.session?.projectId,
        employeeId: data.session?.employeeId,
      });
      
      toast({ 
        title: t('dashboard.toast.workSessionStarted', 'Work session started'), 
        description: hasLocation 
          ? t('dashboard.toast.goodLuckLocation', 'Good luck today! Location recorded.') 
          : t('dashboard.toast.goodLuckNoLocation', 'Good luck today! (Location not recorded)')
      });
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const endDayMutation = useMutation({
    mutationFn: async (data: EndDayFormData & { sessionId: string; projectId: string }) => {
      const location = await getCurrentLocation();
      console.log("Ending work session with location:", location);
      return apiRequest("PATCH", `/api/projects/${data.projectId}/work-sessions/${data.sessionId}/end`, {
        dropsCompletedNorth: parseInt(data.dropsNorth) || 0,
        dropsCompletedEast: parseInt(data.dropsEast) || 0,
        dropsCompletedSouth: parseInt(data.dropsSouth) || 0,
        dropsCompletedWest: parseInt(data.dropsWest) || 0,
        shortfallReason: data.shortfallReason,
        endLatitude: location?.latitude,
        endLongitude: location?.longitude,
        ropeAccessTaskHours: data.ropeAccessTaskHours ? parseFloat(data.ropeAccessTaskHours) : null,
      });
    },
    onSuccess: (data: any) => {
      console.log("[END DAY] Response received:", JSON.stringify(data, null, 2));
      console.log("[END DAY] requiresProgressPrompt:", data?.requiresProgressPrompt);
      console.log("[END DAY] session.projectId:", data?.session?.projectId);
      
      setActiveSession(null);
      setShowEndDayDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-drops-today"] });
      endDayForm.reset();
      const hasLocation = data?.session?.endLatitude && data?.session?.endLongitude;
      
      // Track work session end
      trackWorkSessionEnd({
        projectId: data?.session?.projectId,
        employeeId: data?.session?.employeeId,
      });
      
      // Check if this is the "last one out" for a percentage-based job
      if (data?.requiresProgressPrompt && data?.session?.projectId) {
        console.log("[END DAY] Showing progress prompt dialog");
        setProgressPromptProjectId(data.session.projectId);
        setProgressPromptCurrentValue(data.currentOverallProgress || 0);
        setProgressPromptOpen(true);
      } else {
        console.log("[END DAY] Not showing progress prompt dialog");
        toast({ 
          title: t('dashboard.toast.workSessionEnded', 'Work session ended'), 
          description: hasLocation 
            ? t('dashboard.toast.greatWorkLocation', 'Great work today! Location recorded.') 
            : t('dashboard.toast.greatWorkNoLocation', 'Great work today! (Location not recorded)')
        });
      }
    },
    onError: (error: Error) => {
      toast({ title: t('dashboard.toast.error', 'Error'), description: error.message, variant: "destructive" });
    },
  });

  const leaveCompanyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/technician/leave-company");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t('dashboard.leaveCompany.success', 'Left Company'),
        description: t('dashboard.leaveCompany.successDesc', 'You have successfully left the company.'),
      });
      setShowLeaveCompanyDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: t('dashboard.leaveCompany.error', 'Error'),
        description: error.message || "Failed to leave company",
        variant: "destructive",
      });
    },
  });

  const confirmLogout = async () => {
    try {
      // Track logout event before clearing session
      trackLogout();
      // Remember the user's role before logging out
      const userRole = user?.role;
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      // Clear ALL query cache to prevent stale data from causing redirect issues
      queryClient.clear();
      // Use router navigation (instant) instead of full page reload
      // Redirect to role-appropriate landing pages
      if (userRole === 'rope_access_tech') {
        setLocation("/technician");
      } else if (userRole === 'ground_crew' || userRole === 'ground_crew_supervisor') {
        setLocation("/ground-crew");
      } else {
        // Employers/company owners go to main landing page
        setLocation("/");
      }
    } catch (error) {
      toast({ title: t('dashboard.toast.error', 'Error'), description: t('dashboard.toast.logoutFailed', 'Failed to logout'), variant: "destructive" });
    }
  };

  const handleStartDay = () => {
    if (projects.length > 0) {
      setSelectedProject(projects[0]);
      setShowInspectionCheckDialog(true);
    }
  };

  const handleInspectionComplete = () => {
    setShowInspectionCheckDialog(false);
    setShowStartDayDialog(true);
  };

  const handleGoToInspection = () => {
    setShowInspectionCheckDialog(false);
    setLocation("/harness-inspections/new");
  };

  const handleEndDay = () => {
    // Show the end day dialog for all job types
    // The dialog will show appropriate inputs based on job type (percentage for hours-based, drops/stalls/suites for others)
    const activeProject = projects.find(p => p.id === activeSession?.projectId);
    const isHoursBased = activeProject?.jobType === "general_pressure_washing" || activeProject?.jobType === "ground_window_cleaning";
    
    if (isHoursBased) {
      // Pre-fill with the last recorded percentage (or 0 if none)
      const lastPercentage = (activeProject as any)?.latestCompletionPercentage || 0;
      endDayForm.reset({
        dropsNorth: lastPercentage.toString(),
        dropsEast: "0",
        dropsSouth: "0",
        dropsWest: "0",
        shortfallReason: "",
        logRopeAccessHours: false,
        ropeAccessTaskHours: "",
      });
    } else {
      // Reset to defaults for drop-based projects
      endDayForm.reset({
        dropsNorth: "",
        dropsEast: "",
        dropsSouth: "",
        dropsWest: "",
        shortfallReason: "",
        logRopeAccessHours: false,
        ropeAccessTaskHours: "",
      });
    }
    
    setShowEndDayDialog(true);
  };

  const confirmStartDay = () => {
    if (selectedProject) {
      startDayMutation.mutate(selectedProject.id);
    }
  };

  const onEndDaySubmit = async (data: EndDayFormData) => {
    if (!activeSession) {
      toast({ title: "Error", description: "No active work session found", variant: "destructive" });
      return;
    }
    
    // Get the daily target from the active session's project
    const activeProject = projects.find(p => p.id === activeSession.projectId);
    const isHoursBased = activeProject?.jobType === "general_pressure_washing" || activeProject?.jobType === "ground_window_cleaning";
    
    // Validate rope access hours if user chose to log them
    let ropeAccessHoursValue: number | undefined = undefined;
    if (data.logRopeAccessHours) {
      // Require a value when toggle is on
      if (!data.ropeAccessTaskHours || data.ropeAccessTaskHours.trim() === "") {
        endDayForm.setError("ropeAccessTaskHours", {
          message: "Please enter your rope access hours"
        });
        return;
      }
      const hours = parseFloat(data.ropeAccessTaskHours);
      if (isNaN(hours) || hours < 0 || hours > 24) {
        endDayForm.setError("ropeAccessTaskHours", {
          message: "Please enter valid hours between 0 and 24"
        });
        return;
      }
      if ((hours * 4) % 1 !== 0) {
        endDayForm.setError("ropeAccessTaskHours", {
          message: "Hours must be in quarter-hour increments (0.25, 0.5, 0.75, etc.)"
        });
        return;
      }
      ropeAccessHoursValue = hours;
    }
    
    if (isHoursBased) {
      // For hours-based projects, use percentage-based tracking
      const completionPercentage = parseInt(data.dropsNorth) || 0;
      
      // Validate percentage is between 0-100
      if (completionPercentage < 0 || completionPercentage > 100) {
        endDayForm.setError("dropsNorth", {
          message: "Percentage must be between 0 and 100"
        });
        return;
      }
      
      endDayMutation.mutate({
        sessionId: activeSession.id,
        projectId: activeSession.projectId,
        dropsNorth: "0",
        dropsEast: "0",
        dropsSouth: "0",
        dropsWest: "0",
        manualCompletionPercentage: completionPercentage,
        ropeAccessTaskHours: ropeAccessHoursValue?.toString() || "",
      });
    } else {
      // For drop-based projects, use the existing logic
      const sessionDailyTarget = activeProject?.dailyDropTarget || 0;
      
      // Calculate total drops from all elevations being submitted
      const dropsNorth = parseInt(data.dropsNorth) || 0;
      const dropsEast = parseInt(data.dropsEast) || 0;
      const dropsSouth = parseInt(data.dropsSouth) || 0;
      const dropsWest = parseInt(data.dropsWest) || 0;
      const totalDropsBeingSubmitted = dropsNorth + dropsEast + dropsSouth + dropsWest;
      
      // Calculate total drops today: existing drops + new drops being submitted
      const totalDropsToday = todayDrops + totalDropsBeingSubmitted;
      
      // Validate shortfall reason is required when TOTAL drops < target
      if (totalDropsToday < sessionDailyTarget && !data.shortfallReason?.trim()) {
        endDayForm.setError("shortfallReason", {
          message: "Please explain why the daily target wasn't met"
        });
        return;
      }
      
      endDayMutation.mutate({
        ...data,
        sessionId: activeSession.id,
        projectId: activeSession.projectId,
        ropeAccessTaskHours: ropeAccessHoursValue?.toString() || "",
      });
    }
  };

  const selectedRole = employeeForm.watch("role");

  const filteredProjects = projects.filter((p: Project) => 
    p.strataPlanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.jobType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current user for permission checks
  const currentUser = userData?.user;
  const userIsReadOnly = isReadOnly(currentUser);

  // Category definitions for dashboard card filtering
  const cardCategories = [
    { id: "all", label: t('dashboard.categories.all', 'All'), icon: "apps" },
    { id: "operations", label: t('dashboard.categories.operations', 'Operations'), icon: "engineering" },
    { id: "safety", label: t('dashboard.categories.safety', 'Safety'), icon: "health_and_safety" },
    { id: "financial", label: t('dashboard.categories.financial', 'Financial'), icon: "payments" },
    { id: "team", label: t('dashboard.categories.team', 'Team'), icon: "groups" },
    { id: "communication", label: t('dashboard.categories.communication', 'Communication'), icon: "forum" },
  ];

  // Dashboard card configuration with permission filtering
  const dashboardCards = useMemo(() => [
    {
      id: "owner-profile",
      label: t('dashboard.cards.myProfile.label', 'My Profile'),
      description: t('dashboard.cards.myProfile.description', 'Hours & certifications'),
      icon: "person",
      onClick: () => setLocation("/technician-portal"),
      testId: "button-nav-owner-profile",
      isVisible: (user: any) => user?.role === 'company', // Company owners who work on buildings
      borderColor: "#8b5cf6",
      category: "team",
    },
    {
      id: "projects",
      label: t('dashboard.cards.projects.label', 'Projects'),
      description: t('dashboard.cards.projects.description', 'Active projects'),
      icon: "apartment",
      onClick: () => handleTabChange("projects"),
      testId: "button-nav-projects",
      isVisible: () => true, // Everyone
      borderColor: "#3b82f6",
      category: "operations",
    },
    {
      id: "non-billable-hours",
      label: t('dashboard.cards.nonBillableHours.label', 'Non-Billable Hours'),
      description: t('dashboard.cards.nonBillableHours.description', 'Errands & training'),
      icon: "schedule",
      onClick: () => setLocation("/non-billable-hours"),
      testId: "button-non-billable-hours",
      isVisible: () => true, // Everyone
      borderColor: "#06b6d4",
      category: "operations",
    },
    {
      id: "employees",
      label: t('dashboard.cards.employees.label', 'Employees'),
      description: t('dashboard.cards.employees.description', 'Manage team'),
      icon: "people",
      onClick: () => handleTabChange("employees"),
      testId: "button-nav-employees",
      isVisible: (user: any) => canManageEmployees(user), // Management only
      borderColor: "#a855f7",
      category: "team",
    },
    {
      id: "job-board",
      label: t('dashboard.cards.jobBoard.label', 'Job Board'),
      description: t('dashboard.cards.jobBoard.description', 'Jobs & talent'),
      icon: "work",
      onClick: () => setLocation("/job-board"),
      testId: "button-nav-job-board",
      isVisible: (user: any) => user?.role === 'company', // Company owners only
      borderColor: "#059669",
      category: "team",
      notificationCount: totalJobApplications,
    },
    {
      id: "clients",
      label: t('dashboard.cards.clients.label', 'Clients'),
      description: t('dashboard.cards.clients.description', 'Property managers'),
      icon: "business",
      onClick: () => handleTabChange("clients"),
      testId: "button-nav-clients",
      isVisible: (user: any) => hasPermission(user, "view_clients"), // Permission-based
      borderColor: "#10b981",
      category: "communication",
    },
    {
      id: "performance",
      label: t('dashboard.cards.performance.label', 'Performance'),
      description: t('dashboard.cards.performance.description', 'View analytics'),
      icon: "bar_chart",
      onClick: () => handleTabChange("performance"),
      testId: "button-nav-performance",
      isVisible: (user: any) => canViewPerformance(user), // Management only
      borderColor: "#f97316",
      category: "team",
    },
    {
      id: "complaints",
      label: t('dashboard.cards.feedback.label', 'Feedback'),
      description: t('dashboard.cards.feedback.description', 'Resident feedback'),
      icon: "feedback",
      onClick: () => handleTabChange("complaints"),
      testId: "button-nav-feedback",
      isVisible: () => true, // Everyone
      borderColor: "#ec4899",
      category: "communication",
    },
    {
      id: "inventory",
      label: t('dashboard.cards.inventory.label', 'Inventory & Inspections'),
      description: t('dashboard.cards.inventory.description', 'Gear & safety checks'),
      icon: "inventory_2",
      onClick: () => setLocation("/inventory"),
      testId: "button-inventory",
      isVisible: () => true, // Everyone can access (tabs handle different views)
      borderColor: "#d97706",
      category: "safety",
    },
    {
      id: "safety-forms",
      label: t('dashboard.cards.safetyForms.label', 'Safety Forms'),
      description: t('dashboard.cards.safetyForms.description', 'Safety meeting'),
      icon: "groups",
      onClick: () => setLocation("/safety-forms"),
      testId: "button-safety-forms",
      isVisible: () => true, // Everyone
      borderColor: "#f87171",
      category: "safety",
    },
    {
      id: "payroll",
      label: t('dashboard.cards.payroll.label', 'Payroll'),
      description: t('dashboard.cards.payroll.description', 'Employee hours'),
      icon: "payments",
      onClick: () => setLocation("/payroll"),
      testId: "button-payroll",
      isVisible: (user: any) => hasFinancialAccess(user), // Financial permission required
      borderColor: "#22c55e",
      category: "financial",
    },
    {
      id: "quotes",
      label: t('dashboard.cards.quotes.label', 'Quotes'),
      description: t('dashboard.cards.quotes.description', 'Service quotes'),
      icon: "request_quote",
      onClick: () => setLocation("/quotes"),
      testId: "button-quotes",
      isVisible: (user: any) => canAccessQuotes(user), // Any quote permission grants access
      borderColor: "#16a34a",
      category: "financial",
    },
    {
      id: "schedule",
      label: t('dashboard.cards.schedule.label', 'Job Schedule'),
      description: t('dashboard.cards.schedule.description', 'Team assignments'),
      icon: "calendar_today",
      onClick: () => setLocation("/schedule"),
      testId: "button-schedule",
      isVisible: () => true, // Visible for everyone
      borderColor: "#0ea5e9",
      category: "operations",
    },
    {
      id: "documents",
      label: t('dashboard.cards.documents.label', 'Documents and Training'),
      description: t('dashboard.cards.documents.description', 'All company files'),
      icon: "folder_open",
      onClick: () => setLocation("/documents"),
      testId: "button-documents",
      isVisible: () => true, // Everyone
      borderColor: "#14b8a6",
      category: "communication",
    },
    {
      id: "residents",
      label: t('dashboard.cards.residents.label', 'Residents'),
      description: t('dashboard.cards.residents.description', 'Building residents'),
      icon: "people",
      onClick: () => setLocation("/residents"),
      testId: "button-residents",
      isVisible: (user: any) => isManagement(user), // Management only
      borderColor: "#8b5cf6",
      category: "communication",
    },
    {
      id: "my-profile",
      label: t('dashboard.cards.myProfile.label', 'My Profile'),
      description: t('dashboard.cards.myProfile.description', 'Certifications & docs'),
      icon: "badge",
      onClick: () => setLocation("/technician-portal"),
      testId: "button-my-profile",
      isVisible: (user: any) => user?.role === 'rope_access_tech', // Technicians only
      borderColor: "#f59e0b",
      category: "team",
    },
    {
      id: "current-employer",
      label: t('dashboard.cards.currentEmployer.label', 'My Employer'),
      description: userData?.user?.companyName || t('dashboard.cards.currentEmployer.description', 'View details'),
      icon: "business",
      onClick: () => setShowEmployerInfoDialog(true),
      testId: "button-current-employer",
      isVisible: (user: any) => user?.role === 'rope_access_tech' && user?.companyId && !user?.terminatedDate,
      borderColor: "#0ea5e9",
      category: "team",
    },
  ].filter(card => {
    try {
      return card.isVisible(currentUser);
    } catch (e) {
      console.error('Error filtering card:', card.id, e);
      return false;
    }
  }), [currentUser, t]); // useMemo dependency - recreate when currentUser or language changes

  // Load saved card order from backend preferences
  useEffect(() => {
    if (preferencesData?.preferences?.dashboardCardOrder) {
      setCardOrder(preferencesData.preferences.dashboardCardOrder);
    } else {
      setCardOrder(dashboardCards.map(c => c.id));
    }
  }, [preferencesData, dashboardCards]); // Re-run when preferences or available cards change

  // Disable rearranging when switching away from "all" category
  useEffect(() => {
    if (selectedCategory !== "all") {
      setIsRearranging(false);
    }
  }, [selectedCategory]);

  // Sort cards based on saved order and filter by selected category
  const sortedDashboardCards = [...dashboardCards]
    .filter(card => selectedCategory === "all" || card.category === selectedCategory)
    .sort((a, b) => {
      const aIndex = cardOrder.indexOf(a.id);
      const bIndex = cardOrder.indexOf(b.id);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

  // Handle drag end
  // Mutation to save preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: { dashboardCardOrder?: string[], hoursAnalyticsCardOrder?: string[] }) => {
      const response = await apiRequest("POST", "/api/user-preferences", updates);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-preferences"] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    // Only allow rearranging when viewing all cards to prevent corrupting full order
    if (selectedCategory !== "all") {
      setIsRearranging(false); // Force disable rearranging on stale drag events
      return;
    }
    
    // Don't process if not in rearranging mode
    if (!isRearranging) return;
    
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;
      
      // Get canonical list of all dashboard card IDs
      const dashboardCardIds = new Set(dashboardCards.map(c => c.id));
      
      // Validate both IDs exist in current dashboardCards
      if (!dashboardCardIds.has(activeId) || !dashboardCardIds.has(overId)) {
        console.warn('Dashboard drag event ignored: stale card IDs not in dashboardCards');
        return;
      }
      
      // Validate both IDs exist in current cardOrder
      const oldIndex = cardOrder.indexOf(activeId);
      const newIndex = cardOrder.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) {
        console.warn('Dashboard drag event ignored: card IDs not in cardOrder');
        return;
      }
      
      // Perform the move on a copy of the full cardOrder
      const newOrder = arrayMove([...cardOrder], oldIndex, newIndex);
      
      // Final integrity check: newOrder must contain exactly the same IDs as dashboardCards
      const newOrderSet = new Set(newOrder);
      const hasAllCards = dashboardCardIds.size === newOrderSet.size && 
                          [...dashboardCardIds].every(id => newOrderSet.has(id));
      
      if (!hasAllCards || newOrder.length !== dashboardCards.length) {
        console.warn('Dashboard order corruption prevented: order integrity check failed');
        return;
      }
      
      setCardOrder(newOrder);
      updatePreferencesMutation.mutate({ dashboardCardOrder: newOrder });
    }
  };

  // Reset card order to default
  const resetCardOrder = () => {
    const defaultOrder = dashboardCards.map(c => c.id);
    setCardOrder(defaultOrder);
    
    // Save to backend
    updatePreferencesMutation.mutate({ dashboardCardOrder: defaultOrder });
    
    toast({ title: t('dashboard.layoutReset', 'Layout reset'), description: t('dashboard.layoutResetDesc', 'Dashboard cards restored to default order') });
  };

  // Get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case "": return t('dashboard.pageTitle.dashboard', 'Dashboard');
      case "projects": return t('dashboard.pageTitle.projects', 'Projects');
      case "past-projects": return t('dashboard.pageTitle.pastProjects', 'Past Projects');
      case "performance": return t('dashboard.pageTitle.performance', 'Performance & Live Activity');
      case "complaints": return t('dashboard.pageTitle.feedback', 'Feedback');
      case "employees": return t('dashboard.pageTitle.employees', 'Employees');
      case "documents": return t('dashboard.pageTitle.documents', 'Documents');
      case "clients": return t('dashboard.pageTitle.clients', 'Clients');
      default: return t('dashboard.pageTitle.dashboard', 'Dashboard');
    }
  };

  // Configure unified header - no page title for dashboard (shows search), no back button
  useSetHeaderConfig({
    showSearch: true,
    showNotifications: true,
    showLanguageDropdown: true,
    showProfile: true,
    showLogout: true,
  }, []);

  // Block dashboard access if employee has pending required documents to sign
  const isTechOrGroundCrew = ['rope_access_tech', 'ground_crew'].includes(user?.role || '');
  
  // While checking for pending documents, show loading for technicians/ground crew
  if (isTechOrGroundCrew && pendingDocsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">{t('common.loading', 'Loading...')}</div>
        </div>
      </div>
    );
  }
  
  // Block access if there are pending documents to sign
  if (pendingDocsData?.hasPendingDocuments && isTechOrGroundCrew) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('documents.requiredReviewTitle', 'Required Document Review')}
            </h1>
            <p className="text-muted-foreground">
              {t('documents.requiredReviewDesc', 'You must review and sign the following company safety documents before accessing the dashboard.')}
            </p>
          </div>
          <DocumentReviews companyDocuments={[]} />
        </div>
      </div>
    );
  }

  if (projectsLoading || employeesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">{t('common.loading', 'Loading...')}</div>
        </div>
      </div>
    );
  }

  const alertCounts = {
    jobApplications: totalJobApplications || 0,
  };

  return (
    <div className="min-h-screen w-full">
      {/* Main Content - sidebar and header are now provided by DashboardLayout wrapper */}
      <div className="flex-1 flex flex-col page-gradient min-h-screen">
      {/* Read-Only Mode Banner - Shows on all tabs */}
      {currentUser && isReadOnly(currentUser) && (
        <div 
          className="mx-4 mt-4 flex items-center justify-between gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
          data-testid="alert-license-verification"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                {t("dashboard.readOnlyMode.title", "Account in read-only mode")}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {t("dashboard.readOnlyMode.description", "Verify your license to enable editing. Your team cannot log hours until verified.")}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setLocation("/license-verification")}
            className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
            data-testid="button-verify-license"
          >
            {t("dashboard.readOnlyMode.verifyLicense", "Verify License")}
          </Button>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* Dashboard Overview - Customizable Card Grid */}
        {activeTab === "" && (
          <DashboardGrid
            currentUser={currentUser}
            projects={projects}
            employees={employees}
            harnessInspections={harnessInspections}
            onNavigate={handleTabChange}
            onRouteNavigate={setLocation}
            branding={branding}
          />
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            {/* Project Usage Information */}
            {projectsData?.projectInfo && (
              <Card data-testid="card-project-info">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-primary">apartment</span>
                      <div>
                        <div className="font-medium">{t('dashboard.projects.title', 'Projects')}</div>
                        <div className="text-sm text-muted-foreground">
                          {t('dashboard.projects.usageUnlimited', '{{used}} active projects', { used: projectsData.projectInfo.projectsUsed })}
                        </div>
                      </div>
                    </div>
                    {projectsData.projectInfo.tier && projectsData.projectInfo.tier !== 'none' && (
                      <div className="text-right">
                        <Badge variant="secondary" data-testid="badge-project-tier-status">
                          OnRopePro
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Search and Create */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-base">
                    search
                  </span>
                  <Input
                    placeholder={t('dashboard.projects.search.placeholder', 'Search by strata or job number...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-12 text-base shadow-sm border-2 focus-visible:ring-2"
                    data-testid="input-search-projects"
                  />
                </div>
                <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      className="h-14 px-6 gap-2 shadow-md hover:shadow-lg text-base font-semibold" 
                      data-testid="button-create-project"
                      disabled={userIsReadOnly}
                    >
                      <span className="material-icons text-xl text-primary-foreground">add_circle</span>
                      <span className="hidden sm:inline">{t('dashboard.projects.newProject', 'New Project')}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 max-h-[95vh] flex flex-col gap-0">
                    <div className="p-6 border-b bg-card">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{t('dashboard.projects.createTitle', 'Create New Project')}</DialogTitle>
                        <DialogDescription>{t('dashboard.projects.createDescription', 'Add a new building maintenance project')}</DialogDescription>
                      </DialogHeader>
                    </div>
                    <div className="overflow-y-auto flex-1 p-6">
                      <Form {...projectForm}>
                        {Object.keys(projectForm.formState.errors).length > 0 && (
                          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md">
                            <div className="font-semibold text-destructive mb-2">{t('dashboard.form.errors', 'Form Errors:')}</div>
                            <div className="text-sm space-y-1">
                              {Object.entries(projectForm.formState.errors).map(([key, error]: [string, any]) => (
                                <div key={key} className="text-destructive">
                                  • {key}: {error?.message || t('dashboard.form.invalid', 'Invalid')}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <form onSubmit={projectForm.handleSubmit(onProjectSubmit, (errors) => {
                          console.log("Form validation errors:", errors);
                          toast({ 
                            title: t('dashboard.form.validationFailed', 'Form validation failed'), 
                            description: t('dashboard.form.checkFields', 'Please check all required fields'), 
                            variant: "destructive" 
                          });
                        })} className="space-y-4">
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">{t('dashboard.projects.quickFill', 'Quick Fill from Client Database')}</label>
                          <Popover open={clientDropdownOpen} onOpenChange={(open) => {
                              setClientDropdownOpen(open);
                              if (!open) {
                                setClientDropdownStep("clients");
                                setSelectedClientInDropdown(null);
                              }
                            }}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={clientDropdownOpen}
                                className="w-full h-12 justify-between"
                                data-testid="button-client-strata-search"
                              >
                                {selectedStrataForProject && selectedStrataForProject !== "manual"
                                  ? (() => {
                                      const [clientId, strataIdx] = selectedStrataForProject.split("|");
                                      const client = clientsData?.find(c => c.id === clientId);
                                      if (strataIdx === "new") {
                                        return `${client?.firstName} ${client?.lastName} - ${t('dashboard.projects.newBuilding', 'New Building')}`;
                                      }
                                      const strata = client?.lmsNumbers?.[parseInt(strataIdx)];
                                      return strata ? `${strata.number} - ${client?.firstName} ${client?.lastName}` : t('dashboard.createProject.selectBuilding', 'Select a client');
                                    })()
                                  : selectedStrataForProject === "manual"
                                  ? t('dashboard.projects.enterManually', 'Enter Details Manually')
                                  : t('dashboard.createProject.selectBuilding', 'Select a client')}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                              <Command>
                                <CommandInput placeholder={clientDropdownStep === "clients" 
                                  ? t('dashboard.projects.searchClientsPlaceholder', 'Search clients...') 
                                  : t('dashboard.projects.searchBuildingsPlaceholder', 'Search buildings...')} 
                                />
                                <CommandList>
                                  {clientDropdownStep === "clients" ? (
                                    <>
                                      {(!clientsData || clientsData.length === 0) && (
                                        <div className="py-4 text-center text-sm text-muted-foreground">
                                          {t('dashboard.projects.noClientsAvailable', 'No clients in database. Enter details manually.')}
                                        </div>
                                      )}
                                      <CommandGroup heading={t('dashboard.projects.options', 'Options')}>
                                        <CommandItem
                                          value="manual"
                                          onSelect={() => {
                                            handleClientStrataSelection("manual");
                                            setClientDropdownOpen(false);
                                            setClientDropdownStep("clients");
                                          }}
                                          className="!bg-primary !text-primary-foreground font-medium hover:!bg-primary/90 rounded-xl mx-2 my-1"
                                        >
                                          <span className="material-icons mr-2 text-sm">edit</span>
                                          {t('dashboard.projects.enterManually', 'Enter Details Manually')}
                                        </CommandItem>
                                      </CommandGroup>
                                      <CommandGroup heading={t('dashboard.projects.selectClient', 'Select a Client')}>
                                        {clientsData && clientsData.length > 0 && clientsData.map((client) => (
                                          <CommandItem
                                            key={client.id}
                                            value={`${client.firstName} ${client.lastName} ${client.companyName || ""}`}
                                            onSelect={() => {
                                              setSelectedClientInDropdown(client.id);
                                              setClientDropdownStep("buildings");
                                            }}
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="material-icons text-muted-foreground">person</span>
                                              <div className="flex flex-col">
                                                <span className="font-medium">{client.firstName} {client.lastName}</span>
                                                {client.companyName && <span className="text-xs text-muted-foreground">{client.companyName}</span>}
                                                <span className="text-xs text-muted-foreground">
                                                  {client.lmsNumbers?.length || 0} {t('dashboard.projects.buildings', 'building(s)')}
                                                </span>
                                              </div>
                                            </div>
                                            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </>
                                  ) : (
                                    <>
                                      {(() => {
                                        const selectedClient = clientsData?.find(c => c.id === selectedClientInDropdown);
                                        return (
                                          <>
                                            <CommandGroup>
                                              <CommandItem
                                                value="back-to-clients"
                                                onSelect={() => {
                                                  setClientDropdownStep("clients");
                                                  setSelectedClientInDropdown(null);
                                                }}
                                                className="text-muted-foreground"
                                              >
                                                <ChevronLeft className="mr-2 h-4 w-4" />
                                                {t('dashboard.projects.backToClients', 'Back to Clients')}
                                              </CommandItem>
                                            </CommandGroup>
                                            <CommandGroup heading={selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : t('dashboard.projects.buildings', 'Buildings')}>
                                              <CommandItem
                                                value="add-new-building"
                                                onSelect={() => {
                                                  setSelectedClientForProject(selectedClientInDropdown || "");
                                                  setSelectedStrataForProject(`${selectedClientInDropdown}|new`);
                                                  isManualEntryRef.current = false;
                                                  projectForm.setValue("strataPlanNumber", "");
                                                  projectForm.setValue("buildingName", "");
                                                  projectForm.setValue("buildingAddress", "");
                                                  projectForm.setValue("floorCount", "");
                                                  projectForm.setValue("totalStalls", "");
                                                  projectForm.setValue("dailyDropTarget", "");
                                                  projectForm.setValue("totalDropsNorth", "");
                                                  projectForm.setValue("totalDropsEast", "");
                                                  projectForm.setValue("totalDropsSouth", "");
                                                  projectForm.setValue("totalDropsWest", "");
                                                  projectForm.setValue("latitude", null as any);
                                                  projectForm.setValue("longitude", null as any);
                                                  setClientDropdownOpen(false);
                                                  setClientDropdownStep("clients");
                                                }}
                                                className="!bg-accent font-medium rounded-xl mx-2 my-1"
                                              >
                                                <Plus className="mr-2 h-4 w-4" />
                                                {t('dashboard.projects.addNewBuilding', 'Add New Building for this Client')}
                                              </CommandItem>
                                              {selectedClient?.lmsNumbers?.map((strata, idx) => (
                                                <CommandItem
                                                  key={`${selectedClient.id}-${idx}`}
                                                  value={`${strata.number} ${strata.address || ""} ${strata.buildingName || ""}`}
                                                  onSelect={() => {
                                                    handleClientStrataSelection(`${selectedClient.id}|${idx}`);
                                                    setClientDropdownOpen(false);
                                                    setClientDropdownStep("clients");
                                                  }}
                                                >
                                                  <Check
                                                    className={`mr-2 h-4 w-4 ${selectedStrataForProject === `${selectedClient.id}|${idx}` ? "opacity-100" : "opacity-0"}`}
                                                  />
                                                  <div className="flex flex-col">
                                                    <span className="font-medium">{strata.number}</span>
                                                    {strata.buildingName && <span className="text-xs text-muted-foreground">{strata.buildingName}</span>}
                                                    {strata.address && <span className="text-xs text-muted-foreground">{strata.address}</span>}
                                                  </div>
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </>
                                        );
                                      })()}
                                    </>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('dashboard.createProject.autoFillDesc', 'Search and select from your client database to auto-fill details')}
                          </p>
                        </div>

                        <FormField
                          control={projectForm.control}
                          name="strataPlanNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.createProject.strataPlanNumber', 'Strata plan number / Job number')}</FormLabel>
                              <FormControl>
                                <Input placeholder="LMS2345" {...field} data-testid="input-strata-plan-number" className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="buildingName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.createProject.buildingName', 'Building Name')}</FormLabel>
                              <FormControl>
                                <Input placeholder={t('dashboard.createProject.buildingNamePlaceholder', 'Harbour View Towers')} {...field} data-testid="input-building-name" className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="buildingAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.createProject.buildingAddress', 'Building Address')}</FormLabel>
                              <FormControl>
                                <AddressAutocomplete
                                  data-testid="input-building-address"
                                  placeholder={t('dashboard.createProject.buildingAddressPlaceholder', 'Start typing address...')}
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  onSelect={(address) => {
                                    field.onChange(address.formatted);
                                    // Capture coordinates from geocoded address
                                    projectForm.setValue('latitude', address.latitude);
                                    projectForm.setValue('longitude', address.longitude);
                                  }}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                {t('dashboard.createProject.visibleToEmployees', 'Visible to all employees')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Job Category Selection */}
                        <FormField
                          control={projectForm.control}
                          name="jobCategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.createProject.jobCategory', 'Job Category')}</FormLabel>
                              <FormControl>
                                <div className="flex gap-2 flex-wrap">
                                  {JOB_CATEGORIES.map((category) => (
                                    <button
                                      key={category.value}
                                      type="button"
                                      onClick={() => field.onChange(category.value)}
                                      data-testid={`button-category-${category.value}`}
                                      className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                                        ${field.value === category.value 
                                          ? 'border-primary bg-primary/10 shadow-md' 
                                          : 'border-border bg-card hover:border-primary/50 hover:bg-muted'
                                        }
                                      `}
                                    >
                                      <span className="material-icons text-xl">{category.icon}</span>
                                      <span className="text-sm font-medium">{t(category.labelKey, category.label)}</span>
                                    </button>
                                  ))}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Job Type Selection - filtered by category */}
                        <FormField
                          control={projectForm.control}
                          name="jobType"
                          render={({ field }) => {
                            const selectedCategory = projectForm.watch("jobCategory") as JobCategory || 'building_maintenance';
                            const categoryJobTypes = getJobTypesByCategory(selectedCategory);
                            
                            return (
                              <FormItem>
                                <FormLabel>{t('dashboard.createProject.jobType', 'Job Type')}</FormLabel>
                                <FormControl>
                                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                    {categoryJobTypes.map((jobType) => (
                                      <button
                                        key={jobType.value}
                                        type="button"
                                        onClick={() => field.onChange(jobType.value)}
                                        data-testid={`button-job-type-${jobType.value}`}
                                        className={`
                                          flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                                          ${field.value === jobType.value 
                                            ? 'border-primary bg-primary/10 shadow-lg' 
                                            : 'border-border bg-card hover:border-primary/50 hover:bg-muted'
                                          }
                                        `}
                                      >
                                        <span className="material-icons text-3xl">{jobType.icon}</span>
                                        <span className="text-xs font-medium text-center leading-tight">{t(jobType.labelKey, jobType.label)}</span>
                                      </button>
                                    ))}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        {/* Elevation Toggle - shown for configurable job types, hidden for rock_scaling */}
                        {(() => {
                          const currentJobType = projectForm.watch("jobType");
                          const config = getJobTypeConfig(currentJobType);
                          // Get category from the job type configuration if not available from form
                          const formCategory = projectForm.watch("jobCategory");
                          const category = formCategory || (currentJobType ? getCategoryForJobType(currentJobType) : 'building_maintenance');
                          
                          // Rock scaling, wind turbine, and oil field: don't show elevation indicator at all
                          if (category === 'rock_scaling' || category === 'wind_turbine' || category === 'oil_field') {
                            return null;
                          }
                          
                          const isConfigurable = config?.elevationRequirement === 'configurable';
                          const isAlways = config?.elevationRequirement === 'always';
                          const isNever = config?.elevationRequirement === 'never';
                          
                          if (isConfigurable) {
                            return (
                              <FormField
                                control={projectForm.control}
                                name="requiresElevation"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base flex items-center gap-2">
                                        <span className="material-icons text-xl">height</span>
                                        {t('dashboard.createProject.workAtHeight', 'Work at Height (Rope Access)')}
                                      </FormLabel>
                                      <FormDescription>
                                        {t('dashboard.createProject.workAtHeightDesc', 'Enable for rope access work requiring elevation tracking')}
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        data-testid="switch-requires-elevation"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            );
                          } else if (isAlways || isNever) {
                            return (
                              <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50">
                                <div className="space-y-0.5">
                                  <p className="text-base font-medium flex items-center gap-2">
                                    <span className="material-icons text-xl">{isAlways ? 'height' : 'horizontal_rule'}</span>
                                    {isAlways 
                                      ? t('dashboard.createProject.elevationRequired', 'Elevation Work Required')
                                      : t('dashboard.createProject.groundLevel', 'Ground Level Work')
                                    }
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {isAlways 
                                      ? t('dashboard.createProject.elevationRequiredDesc', 'This job type always requires rope access at height')
                                      : t('dashboard.createProject.groundLevelDesc', 'This job type is performed at ground level')
                                    }
                                  </p>
                                </div>
                                <span className={`material-icons text-2xl ${isAlways ? 'text-primary' : 'text-muted-foreground'}`}>
                                  {isAlways ? 'check_circle' : 'cancel'}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {(projectForm.watch("jobType") === "other" || projectForm.watch("jobType") === "ndt_other" || projectForm.watch("jobType") === "rock_other") && (
                          <>
                            <FormField
                              control={projectForm.control}
                              name="customJobType"
                              render={({ field }) => {
                                const customJobTypes = customJobTypesData?.customJobTypes || [];
                                const savedTypes = customJobTypes.map(cjt => cjt.jobTypeName);
                                const isNewType = field.value && !savedTypes.includes(field.value);
                                
                                return (
                                  <FormItem>
                                    <FormLabel>{t('projects.jobTypes.custom', 'Custom Job Type')}</FormLabel>
                                    <FormControl>
                                      <div className="space-y-2">
                                        {savedTypes.length > 0 && (
                                          <Select 
                                            value={isNewType ? "" : field.value} 
                                            onValueChange={(value) => {
                                              if (value === "__new__") {
                                                field.onChange("");
                                              } else {
                                                field.onChange(value);
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="h-12" data-testid="select-custom-job-type">
                                              <SelectValue placeholder={t('dashboard.projectForm.selectSavedType', 'Select a saved type or enter new')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {savedTypes.map((typeName) => (
                                                <SelectItem key={typeName} value={typeName}>
                                                  {typeName}
                                                </SelectItem>
                                              ))}
                                              <SelectItem value="__new__">{t('dashboard.projectForm.enterNewCustomType', '+ Enter new custom type')}</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        )}
                                        {(savedTypes.length === 0 || isNewType || field.value === "") && (
                                          <Input 
                                            placeholder={t('dashboard.projectForm.enterCustomJobType', 'Enter custom job type')} 
                                            value={field.value} 
                                            onChange={(e) => field.onChange(e.target.value)}
                                            className="h-12" 
                                            data-testid="input-custom-job-type" 
                                          />
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                );
                              }}
                            />
                            
                            {!showOtherElevationFields && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowOtherElevationFields(true)}
                                className="w-full h-12"
                                data-testid="button-enter-elevation"
                              >
                                <span className="material-icons mr-2 text-primary">apartment</span>
                                {t('dashboard.projectForm.enterElevation', 'Enter Elevation')}
                              </Button>
                            )}
                          </>
                        )}

                        {projectForm.watch("jobType") === "in_suite_dryer_vent_cleaning" && (
                          <>
                            <FormField
                              control={projectForm.control}
                              name="suitesPerDay"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.projectForm.suitesPerDay', 'Expected completed suite per day')}</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="0" placeholder="e.g., 10" {...field} data-testid="input-suites-per-day" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={projectForm.control}
                              name="buildingFloors"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.projectForm.buildingFloors', 'Building Floors')}</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="1" placeholder={t('common.totalFloorsInBuilding', 'Total floors in building')} {...field} data-testid="input-building-floors" className="h-12" />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    {t('dashboard.projectForm.buildingFloorsDesc', 'How many floors does the building have?')}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        {projectForm.watch("jobType") === "parkade_pressure_cleaning" && (
                          <FormField
                            control={projectForm.control}
                            name="stallsPerDay"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.projectForm.stallsPerDay', 'Stalls per Day')}</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" placeholder="e.g., 20" {...field} data-testid="input-stalls-per-day" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {projectForm.watch("jobType") === "anchor_inspection" && (
                          <>
                            <FormField
                              control={projectForm.control}
                              name="totalAnchors"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.projectForm.totalAnchors', 'Total Anchors to Inspect')}</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="1" placeholder="e.g., 14" {...field} data-testid="input-total-anchors" className="h-12" />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    {t('dashboard.projectForm.totalAnchorsDesc', 'How many anchor points need to be inspected?')}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={projectForm.control}
                              name="anchorsPerDay"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.projectForm.anchorsPerDay', 'Target Anchors per Day')}</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="1" placeholder="e.g., 5" {...field} data-testid="input-anchors-per-day" className="h-12" />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    {t('dashboard.projectForm.anchorsPerDayDesc', 'Expected number of anchors to inspect per day')}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        {/* Hide Floor Count for General Pressure Washing, Ground Window, Rock Scaling (hours-based tracking), and Anchor Inspection (anchor-based) */}
                        {projectForm.watch("jobType") !== "general_pressure_washing" && 
                         projectForm.watch("jobType") !== "ground_window_cleaning" && 
                         projectForm.watch("jobType") !== "anchor_inspection" &&
                         projectForm.watch("jobCategory") !== "rock_scaling" && (
                          <FormField
                            control={projectForm.control}
                            name="floorCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {projectForm.watch("jobType") === "parkade_pressure_cleaning" 
                                    ? t('dashboard.projectForm.stallCount', 'Stall Count') 
                                    : projectForm.watch("jobType") === "in_suite_dryer_vent_cleaning"
                                    ? t('dashboard.projectForm.unitCount', 'Unit Count')
                                    : t('dashboard.projectForm.floorCount', 'Floor Count')}
                                </FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} data-testid="input-floor-count" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Show drop tracking fields (N/E/S/W drops) ONLY for building_maintenance with drops-based jobs */}
                        {(() => {
                          const currentJobType = projectForm.watch("jobType");
                          const currentJobCategory = projectForm.watch("jobCategory");
                          const requiresElevation = projectForm.watch("requiresElevation");
                          const jobConfig = getJobTypeConfig(currentJobType);
                          
                          // Drop tracking is ONLY for building_maintenance category with drops-based progress
                          // NDT and Rock Scaling use hours-based tracking, not drops
                          if (currentJobCategory !== 'building_maintenance') return false;
                          
                          // Check if job uses drops-based progress
                          if (jobConfig?.progressType !== 'drops') return false;
                          
                          // For configurable elevation, check the toggle
                          if (jobConfig?.elevationRequirement === 'never') return false;
                          if (jobConfig?.elevationRequirement === 'always') return true;
                          if (requiresElevation) return true;
                          if (currentJobType === "other" && showOtherElevationFields) return true;
                          return false;
                        })() && (
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">{t('dashboard.projectForm.totalDropsPerElevation', 'Total Drops per Elevation')}</label>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={projectForm.control}
                                  name="totalDropsNorth"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t('dashboard.projectForm.north', 'North')}</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} data-testid="input-total-drops-north" className="h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={projectForm.control}
                                  name="totalDropsEast"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t('dashboard.projectForm.east', 'East')}</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} data-testid="input-total-drops-east" className="h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={projectForm.control}
                                  name="totalDropsSouth"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t('dashboard.projectForm.south', 'South')}</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} data-testid="input-total-drops-south" className="h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={projectForm.control}
                                  name="totalDropsWest"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t('dashboard.projectForm.west', 'West')}</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} data-testid="input-total-drops-west" className="h-12" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <FormField
                              control={projectForm.control}
                              name="dailyDropTarget"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.projectForm.dailyDropTarget', 'Daily Drop Target')}</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="1" {...field} data-testid="input-daily-target" className="h-12" />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    {t('dashboard.projectForm.dailyDropTargetDesc', 'Visible to rope access techs')}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={projectForm.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.projectForm.startDate', 'Start Date')}</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} data-testid="input-start-date" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={projectForm.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.projectForm.endDate', 'End Date')}</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} data-testid="input-end-date" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t('dashboard.projectForm.dateCalendarHint', 'Add dates to display this project on the calendar')}
                          </p>
                        </div>

                        <FormField
                          control={projectForm.control}
                          name="targetCompletionDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.projectForm.targetCompletionDate', 'Target Completion Date')}</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-target-date" className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="estimatedHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.projectForm.estimatedHours', 'Estimated Hours')}</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" placeholder={t('dashboard.projectForm.estimatedHoursPlaceholder', 'Total estimated hours for entire building')} {...field} data-testid="input-estimated-hours" className="h-12" />
                              </FormControl>
                              <FormDescription className="text-xs">
                                {t('dashboard.projectForm.estimatedHoursDesc', 'Total hours estimated for the entire project')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="buildingHeight"
                          render={({ field }) => {
                            const floorCount = projectForm.watch("floorCount");
                            const currentJobCategory = projectForm.watch("jobCategory");
                            const isRockScaling = currentJobCategory === "rock_scaling";
                            const heightValue = field.value || "";
                            
                            const calculateFromFloors = () => {
                              const floors = parseInt(floorCount);
                              if (floors && floors > 0) {
                                const feet = floors * 9;
                                const meters = Math.round(feet * 0.3048);
                                field.onChange(`${feet}ft (${meters}m)`);
                              }
                            };
                            
                            const getConversion = () => {
                              if (!heightValue) return null;
                              const metersMatch = heightValue.match(/^(\d+(?:\.\d+)?)\s*m$/i);
                              const feetMatch = heightValue.match(/^(\d+(?:\.\d+)?)\s*ft$/i);
                              if (metersMatch) {
                                const meters = parseFloat(metersMatch[1]);
                                const feet = Math.round(meters / 0.3048);
                                return `= ${feet}ft`;
                              }
                              if (feetMatch) {
                                const feet = parseFloat(feetMatch[1]);
                                const meters = Math.round(feet * 0.3048);
                                return `= ${meters}m`;
                              }
                              return null;
                            };
                            
                            const conversion = getConversion();
                            
                            return (
                              <FormItem>
                                <FormLabel>
                                  {isRockScaling 
                                    ? t('dashboard.projectForm.siteMaxHeight', 'Site Max Height')
                                    : t('dashboard.projectForm.buildingHeight', 'Building Height')
                                  }
                                </FormLabel>
                                <div className="space-y-2">
                                  <div className="flex gap-2">
                                    <FormControl>
                                      <Input 
                                        type="text" 
                                        placeholder={t('dashboard.projectForm.buildingHeightPlaceholder', 'e.g., 100m or 300ft')} 
                                        {...field} 
                                        data-testid="input-building-height" 
                                        className="h-12" 
                                      />
                                    </FormControl>
                                    {!isRockScaling && floorCount && parseInt(floorCount) > 0 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={calculateFromFloors}
                                        className="whitespace-nowrap"
                                        data-testid="button-calculate-height"
                                      >
                                        <Calculator className="w-4 h-4 mr-1" />
                                        {t('dashboard.projectForm.calculateHeight', 'Calculate')}
                                      </Button>
                                    )}
                                  </div>
                                  {conversion && (
                                    <p className="text-sm text-muted-foreground font-medium">{conversion}</p>
                                  )}
                                </div>
                                <FormDescription className="text-xs mt-2">
                                  <span className="font-medium text-foreground">{t('dashboard.projectForm.buildingHeightImportant', 'Important for technicians:')}</span>{' '}
                                  {isRockScaling
                                    ? t('dashboard.projectForm.siteHeightExplain', 'Site height is required for IRATA logbook entries. Technicians need this to track work at height for certification progression.')
                                    : t('dashboard.projectForm.buildingHeightExplain', 'Building height is required for IRATA logbook entries. Technicians need this to track work at height for certification progression.')
                                  }
                                </FormDescription>
                                {!isRockScaling && floorCount && parseInt(floorCount) > 0 && (
                                  <FormDescription className="text-xs">
                                    {t('dashboard.projectForm.buildingHeightCalcHint', 'Click Calculate to estimate height from floor count (floors × 9ft)')}
                                  </FormDescription>
                                )}
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        <FormField
                          control={projectForm.control}
                          name="calendarColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.projectForm.calendarColor', 'Calendar Color')}</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-3">
                                  <Input 
                                    type="color" 
                                    {...field} 
                                    data-testid="input-calendar-color"
                                    className="h-12 w-20 cursor-pointer"
                                  />
                                  <span className="text-sm text-muted-foreground">{field.value}</span>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                {t('dashboard.projectForm.calendarColorDesc', 'Choose the color this project appears on the calendar')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="peaceWork"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  {t('dashboard.projectForm.peaceWork', 'Piece Work')}
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  {t('dashboard.projectForm.peaceWorkDesc', 'Enable piece work mode for this project')}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-peace-work"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {projectForm.watch("peaceWork") && (
                          <FormField
                            control={projectForm.control}
                            name="pricePerDrop"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.projectForm.pricePerDrop', 'Price Per Drop')}</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    placeholder={t('dashboard.projectForm.pricePerDropPlaceholder', 'Enter price per drop')} 
                                    {...field} 
                                    data-testid="input-price-per-drop" 
                                    className="h-12" 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={projectForm.control}
                          name="assignedEmployees"
                          render={() => (
                            <FormItem>
                              <FormLabel>{t('dashboard.projectForm.assignEmployees', 'Assign Employees')}</FormLabel>
                              <FormDescription className="text-xs mb-3">
                                {t('dashboard.projectForm.assignEmployeesDesc', 'Select employees to assign to this project for calendar display')}
                              </FormDescription>
                              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                                {employees.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">{t('dashboard.projectForm.noEmployeesAvailable', 'No employees available')}</p>
                                ) : (
                                  employees.map((employee: any) => (
                                    <FormField
                                      key={employee.id}
                                      control={projectForm.control}
                                      name="assignedEmployees"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={employee.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(employee.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...(field.value || []), employee.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value: string) => value !== employee.id
                                                        )
                                                      )
                                                }}
                                                data-testid={`checkbox-assign-employee-${employee.id}`}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                              {employee.name}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('dashboard.projectForm.fallProtectionPlan', 'Fall Protection Plan (PDF)')}</label>
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.type !== 'application/pdf') {
                                  toast({ title: t('common.invalidFile', 'Invalid file'), description: t('common.selectPdfFile', 'Please select a PDF file'), variant: "destructive" });
                                  e.target.value = '';
                                  return;
                                }
                                setUploadedPlanFile(file);
                              }
                            }}
                            data-testid="input-rope-access-plan"
                            className="h-12"
                          />
                          {uploadedPlanFile && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="material-icons text-base">description</span>
                              <span>{uploadedPlanFile.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto"
                                onClick={() => setUploadedPlanFile(null)}
                              >
                                <span className="material-icons text-base">close</span>
                              </Button>
                            </div>
                          )}
                          <FormDescription className="text-xs">
                            {t('dashboard.projectForm.fallProtectionPlanDesc', 'Optional: Upload the rope access/fall protection plan PDF')}
                          </FormDescription>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('dashboard.projectForm.anchorInspectionCert', 'Anchor Inspection Certificate (PDF)')}</label>
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.type !== 'application/pdf') {
                                  toast({ title: t('common.invalidFile', 'Invalid file'), description: t('common.selectPdfFile', 'Please select a PDF file'), variant: "destructive" });
                                  e.target.value = '';
                                  return;
                                }
                                setUploadedAnchorCertFile(file);
                              }
                            }}
                            data-testid="input-anchor-certificate"
                            className="h-12"
                          />
                          {uploadedAnchorCertFile && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="material-icons text-base">description</span>
                              <span>{uploadedAnchorCertFile.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto"
                                onClick={() => setUploadedAnchorCertFile(null)}
                              >
                                <span className="material-icons text-base">close</span>
                              </Button>
                            </div>
                          )}
                          <FormDescription className="text-xs">
                            {t('dashboard.projectForm.anchorInspectionCertDesc', 'Optional: Upload the anchor inspection certificate PDF')}
                          </FormDescription>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full h-12" 
                          data-testid="button-submit-project"
                          disabled={isUploadingPlan || isUploadingAnchorCert}
                        >
                          {isUploadingPlan || isUploadingAnchorCert ? t('common.uploading', 'Uploading...') : t('projects.createProject', 'Create Project')}
                        </Button>
                      </form>
                    </Form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Projects with Active/Past Tabs */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-primary rounded-full"></div>
                    <h2 className="text-xl font-bold">{t('dashboard.projects.title', 'Projects')}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={projectsViewMode === "cards" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setProjectsViewMode("cards")}
                        data-testid="button-projects-view-cards"
                      >
                        <span className="material-icons text-sm">grid_view</span>
                      </Button>
                      <Button
                        variant={projectsViewMode === "list" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setProjectsViewMode("list")}
                        data-testid="button-projects-view-list"
                      >
                        <span className="material-icons text-sm">view_list</span>
                      </Button>
                    </div>
                    {canViewPastProjects(currentUser) && (
                      <Tabs value={projectsSubTab} onValueChange={(v) => setProjectsSubTab(v as "active" | "past")}>
                        <TabsList className="bg-muted/80 p-1 h-auto">
                          <TabsTrigger 
                            value="active" 
                            data-testid="tab-active-projects"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 gap-2"
                          >
                            <span className="material-icons text-base">play_circle</span>
                            {t('dashboard.projects.activeProjects', 'Active Projects')}
                          </TabsTrigger>
                          <TabsTrigger 
                            value="past" 
                            data-testid="tab-past-projects"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 gap-2"
                          >
                            <span className="material-icons text-base">history</span>
                            {t('dashboard.projects.pastProjects', 'Past Projects')}
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    )}
                  </div>
                </div>

                {/* Active Projects */}
                {projectsSubTab === "active" && (
                <div>
                  {filteredProjects.filter((p: Project) => p.status === "active").length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        <span className="material-icons text-4xl mb-2 opacity-50">apartment</span>
                        <div>{t('dashboard.projects.noActiveProjects', 'No active projects yet')}</div>
                      </CardContent>
                    </Card>
                  ) : projectsViewMode === "list" ? (
                    /* List View - Table format */
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t('dashboard.projects.building', 'Building')}</TableHead>
                              <TableHead>{t('dashboard.projects.strataNumber', 'Strata #')}</TableHead>
                              <TableHead className="hidden md:table-cell">{t('dashboard.projects.jobType', 'Job Type')}</TableHead>
                              <TableHead className="hidden lg:table-cell">{t('dashboard.projects.created', 'Created')}</TableHead>
                              <TableHead>{t('dashboard.projects.progress', 'Progress')}</TableHead>
                              <TableHead className="hidden xl:table-cell">{t('dashboard.projects.team', 'Team')}</TableHead>
                              <TableHead className="text-right">{t('dashboard.projects.actions', 'Actions')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredProjects.filter((p: Project) => p.status === "active").map((project: Project) => {
                              const progressType = getProgressType(project.jobType);
                              const isHoursBased = progressType === 'hours';
                              const isInSuite = project.jobType === "in_suite_dryer_vent_cleaning";
                              const isParkade = project.jobType === "parkade_pressure_cleaning";
                              const isAnchorInspection = project.jobType === "anchor_inspection";
                              
                              let progressPercent: number;
                              if (isHoursBased) {
                                const projectSessions = allWorkSessions.filter((s: any) => s.projectId === project.id && s.endTime);
                                const totalHoursWorked = projectSessions.reduce((sum: number, s: any) => {
                                  const regular = parseFloat(s.regularHours) || 0;
                                  const overtime = parseFloat(s.overtimeHours) || 0;
                                  const doubleTime = parseFloat(s.doubleTimeHours) || 0;
                                  return sum + regular + overtime + doubleTime;
                                }, 0);
                                if ((project as any).overallCompletionPercentage !== null && (project as any).overallCompletionPercentage !== undefined) {
                                  progressPercent = (project as any).overallCompletionPercentage;
                                } else if (project.estimatedHours && project.estimatedHours > 0) {
                                  progressPercent = Math.min((totalHoursWorked / project.estimatedHours) * 100, 100);
                                } else {
                                  progressPercent = 0;
                                }
                              } else if (isInSuite) {
                                const completed = project.completedDrops || 0;
                                const total = project.floorCount || 0;
                                progressPercent = total > 0 ? (completed / total) * 100 : 0;
                              } else if (isParkade) {
                                const completed = project.completedDrops || 0;
                                const total = project.totalStalls || project.floorCount || 0;
                                progressPercent = total > 0 ? (completed / total) * 100 : 0;
                              } else if (isAnchorInspection) {
                                const anchorSessions = allWorkSessions.filter((s: any) => s.projectId === project.id && s.endTime);
                                const totalAnchorsInspected = anchorSessions.reduce((sum: number, s: any) => sum + (s.anchorsInspected || 0), 0);
                                const total = project.totalAnchors || 0;
                                progressPercent = total > 0 ? (totalAnchorsInspected / total) * 100 : 0;
                              } else {
                                const completed = project.completedDrops || 0;
                                const total = project.totalDrops || 0;
                                progressPercent = total > 0 ? (completed / total) * 100 : 0;
                              }

                              return (
                                <TableRow 
                                  key={project.id}
                                  className="cursor-pointer"
                                  onClick={() => setLocation(`/projects/${project.id}`)}
                                  data-testid={`project-row-${project.id}`}
                                >
                                  <TableCell className="font-medium">{project.buildingName}</TableCell>
                                  <TableCell className="text-muted-foreground">{project.strataPlanNumber}</TableCell>
                                  <TableCell className="text-muted-foreground hidden md:table-cell">{getJobTypeLabel(t, project.jobType)}</TableCell>
                                  <TableCell className="text-muted-foreground hidden lg:table-cell">
                                    {project.createdAt ? formatTimestampDateShort(project.createdAt) : '-'}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Progress value={progressPercent} className="h-2 w-16" />
                                      <span className="text-sm font-medium">{Math.round(progressPercent)}%</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden xl:table-cell">
                                    {project.assignedTechnicians && project.assignedTechnicians.length > 0 ? (
                                      <div className="flex items-center -space-x-1">
                                        {project.assignedTechnicians.slice(0, 3).map((tech: any) => (
                                          <Avatar key={tech.id} className="w-6 h-6 border border-background">
                                            {tech.photoUrl ? <AvatarImage src={tech.photoUrl} alt={tech.name} /> : null}
                                            <AvatarFallback className="text-xs bg-muted">
                                              {tech.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                        {project.assignedTechnicians.length > 3 && (
                                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border border-background">
                                            +{project.assignedTechnicians.length - 3}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => { e.stopPropagation(); setLocation(`/projects/${project.id}`); }}
                                      data-testid={`button-view-project-${project.id}`}
                                    >
                                      <span className="material-icons text-sm">arrow_forward</span>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ) : (
                    /* Cards View - Multi-column grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProjects.filter((p: Project) => p.status === "active").map((project: Project) => {
                      const isInSuite = project.jobType === "in_suite_dryer_vent_cleaning";
                      const isParkade = project.jobType === "parkade_pressure_cleaning";
                      const isAnchorInspection = project.jobType === "anchor_inspection";
                      // Use getProgressType to correctly identify hours-based jobs (NDT, Rock Scaling, etc.)
                      const progressType = getProgressType(project.jobType);
                      const isHoursBased = progressType === 'hours';
                      
                      let completed: number, total: number, progressPercent: number, unitLabel: string;
                      
                      // Calculate total hours worked for hours-based projects
                      const projectSessions = allWorkSessions.filter((s: any) => s.projectId === project.id && s.endTime);
                      const totalHoursWorked = projectSessions.reduce((sum: number, s: any) => {
                        const regular = parseFloat(s.regularHours) || 0;
                        const overtime = parseFloat(s.overtimeHours) || 0;
                        const doubleTime = parseFloat(s.doubleTimeHours) || 0;
                        return sum + regular + overtime + doubleTime;
                      }, 0);
                      
                      if (isHoursBased) {
                        // Hours-based tracking for NDT, Rock Scaling, General Pressure Washing, Ground Window
                        // Priority: overallCompletionPercentage > estimatedHours > session-based percentage
                        if ((project as any).overallCompletionPercentage !== null && (project as any).overallCompletionPercentage !== undefined) {
                          // Use project-level overall completion percentage (set by "last one out" technician)
                          progressPercent = (project as any).overallCompletionPercentage;
                          completed = progressPercent;
                          total = 100;
                          unitLabel = "%";
                        } else if (project.estimatedHours && project.estimatedHours > 0) {
                          // Fall back to hours-based progress if no overall percentage set
                          completed = Math.round(totalHoursWorked * 10) / 10;
                          total = project.estimatedHours;
                          progressPercent = Math.min((totalHoursWorked / project.estimatedHours) * 100, 100);
                          unitLabel = t('dashboard.projects.hours', 'hrs');
                        } else {
                          // Legacy: Fall back to session-based calculation
                          const sessionsWithPercentage = allWorkSessions.filter((s: any) => 
                            s.projectId === project.id && s.endTime && s.manualCompletionPercentage !== null
                          );
                          const latestSession = sessionsWithPercentage.sort((a: any, b: any) => 
                            new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
                          )[0];
                          progressPercent = latestSession?.manualCompletionPercentage || 0;
                          completed = progressPercent;
                          total = 100;
                          unitLabel = "%";
                        }
                      } else if (isInSuite) {
                        // Suite-based tracking (In-Suite Dryer Vent)
                        completed = project.completedDrops || 0;
                        total = project.floorCount || 0;
                        progressPercent = total > 0 ? (completed / total) * 100 : 0;
                        unitLabel = t('dashboard.projects.suites', 'suites');
                      } else if (isParkade) {
                        // Stall-based tracking (Parkade)
                        completed = project.completedDrops || 0;
                        total = project.totalStalls || project.floorCount || 0;
                        progressPercent = total > 0 ? (completed / total) * 100 : 0;
                        unitLabel = t('dashboard.projects.stalls', 'stalls');
                      } else if (isAnchorInspection) {
                        // Anchor-based tracking (Anchor Inspection)
                        // completedAnchors comes from summed work session anchorsInspected
                        const anchorSessions = allWorkSessions.filter((s: any) => s.projectId === project.id && s.endTime);
                        const totalAnchorsInspected = anchorSessions.reduce((sum: number, s: any) => sum + (s.anchorsInspected || 0), 0);
                        completed = totalAnchorsInspected;
                        total = project.totalAnchors || 0;
                        progressPercent = total > 0 ? (completed / total) * 100 : 0;
                        unitLabel = t('dashboard.projects.anchors', 'anchors');
                      } else {
                        // Drop-based tracking (Window Cleaning, Building Wash, etc.)
                        completed = project.completedDrops || 0;
                        total = project.totalDrops || 0;
                        progressPercent = total > 0 ? (completed / total) * 100 : 0;
                        unitLabel = t('dashboard.projects.drops', 'drops');
                      }

                      return (
                        <Card 
                          key={project.id} 
                          className="group relative shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer" 
                          data-testid={`project-card-${project.id}`}
                          onClick={() => setLocation(`/projects/${project.id}`)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="text-xl font-bold mb-1">{project.buildingName}</div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">{project.strataPlanNumber}</div>
                                <div className="text-sm text-muted-foreground capitalize flex items-center gap-2">
                                  <span className="material-icons text-base text-primary">business</span>
                                  {getJobTypeLabel(t, project.jobType)}
                                </div>
                                {project.createdAt && (
                                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <span className="material-icons text-xs text-primary/70">event</span>
                                    {t('dashboard.projects.created', 'Created')} {formatTimestampDate(project.createdAt)}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {/* Hide floor count badge for hours-based projects, suite/stall/anchor-based projects */}
                                {!isHoursBased && !isInSuite && !isParkade && !isAnchorInspection && project.floorCount && (
                                  <Badge variant="secondary" className="text-sm px-3 py-1">
                                    <span className="material-icons text-xs mr-1">layers</span>
                                    {project.floorCount}
                                  </Badge>
                                )}
                                
                                {/* Safety Documents Status - Stacked Vertically */}
                                <div className="flex flex-col items-end gap-0.5">
                                  {/* Anchor Inspection Certificate - Only for elevation work */}
                                  {project.requiresElevation && (
                                    <div className="flex items-center gap-1.5" title={project.anchorInspectionCertificateUrl ? t('dashboard.projects.anchorInspectionUploaded', 'Anchor inspection uploaded') : t('dashboard.projects.anchorInspectionMissing', 'Anchor inspection missing')}>
                                      <span className={`material-icons text-lg ${project.anchorInspectionCertificateUrl ? 'text-green-500' : 'text-red-500'}`}>
                                        {project.anchorInspectionCertificateUrl ? 'check_circle' : 'cancel'}
                                      </span>
                                      <span className="text-base text-muted-foreground">{t('dashboard.projects.anchorInspection', 'Anchor Inspection')}</span>
                                    </div>
                                  )}
                                  
                                  {/* Rope Access Plan - Only for elevation work */}
                                  {project.requiresElevation && (
                                    <div className="flex items-center gap-1.5" title={project.ropeAccessPlanUrl ? t('dashboard.projects.ropeAccessPlanUploaded', 'Rope access plan uploaded') : t('dashboard.projects.ropeAccessPlanMissing', 'Rope access plan missing')}>
                                      <span className={`material-icons text-lg ${project.ropeAccessPlanUrl ? 'text-green-500' : 'text-red-500'}`}>
                                        {project.ropeAccessPlanUrl ? 'check_circle' : 'cancel'}
                                      </span>
                                      <span className="text-base text-muted-foreground">{t('dashboard.projects.ropeAccessPlan', 'Rope Access Plan')}</span>
                                    </div>
                                  )}
                                  
                                  {/* Toolbox Meetings */}
                                  {(() => {
                                    const projectMeetings = toolboxMeetings.filter((m: any) => m.projectId === project.id);
                                    const hasMeetings = projectMeetings.length > 0;
                                    return (
                                      <div className="flex items-center gap-1.5" title={hasMeetings ? `${projectMeetings.length} ${t('dashboard.projects.toolboxMeetings', 'toolbox meeting(s)')}` : t('dashboard.projects.noToolboxMeetings', 'No toolbox meetings')}>
                                        <span className={`material-icons text-lg ${hasMeetings ? 'text-green-500' : 'text-red-500'}`}>
                                          {hasMeetings ? 'check_circle' : 'cancel'}
                                        </span>
                                        <span className="text-base text-muted-foreground">{t('dashboard.projects.toolboxMeeting', 'Toolbox Meeting')}</span>
                                      </div>
                                    );
                                  })()}
                                  
                                  {/* FLHA Forms */}
                                  {(() => {
                                    const projectFLHAs = flhaForms.filter((f: any) => f.projectId === project.id);
                                    const hasFLHAs = projectFLHAs.length > 0;
                                    return (
                                      <div className="flex items-center gap-1.5" title={hasFLHAs ? `${projectFLHAs.length} ${t('dashboard.projects.flhaForms', 'FLHA form(s)')}` : t('dashboard.projects.noFlhaForms', 'No FLHA forms')}>
                                        <span className={`material-icons text-lg ${hasFLHAs ? 'text-green-500' : 'text-red-500'}`}>
                                          {hasFLHAs ? 'check_circle' : 'cancel'}
                                        </span>
                                        <span className="text-base text-muted-foreground">{t('dashboard.projects.flha', 'FLHA')}</span>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{t('dashboard.projects.progress', 'Progress')}</span>
                                <span className="text-2xl font-bold">{Math.round(progressPercent)}%</span>
                              </div>
                              <Progress value={progressPercent} className="h-3" />
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{completed} / {total} {unitLabel}</span>
                                <span className="material-icons text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                              </div>
                              
                              {/* Assigned Technicians */}
                              {project.assignedTechnicians && project.assignedTechnicians.length > 0 && (
                                <div className="flex items-center gap-2 pt-2 border-t">
                                  <span className="material-icons text-sm text-muted-foreground">people</span>
                                  <div className="flex items-center -space-x-2">
                                    {project.assignedTechnicians.slice(0, 5).map((tech: any, idx: number) => (
                                      <Tooltip key={tech.id}>
                                        <TooltipTrigger asChild>
                                          <Avatar 
                                            className={`w-7 h-7 border-2 border-background ${tech.isActive ? 'ring-2 ring-green-500 ring-offset-1' : ''}`}
                                            data-testid={`avatar-technician-${tech.id}`}
                                          >
                                            {tech.photoUrl ? (
                                              <AvatarImage src={tech.photoUrl} alt={tech.name} />
                                            ) : null}
                                            <AvatarFallback className="text-xs bg-muted">
                                              {tech.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                                            </AvatarFallback>
                                          </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div className="flex items-center gap-1">
                                            {tech.name}
                                            {tech.isActive && (
                                              <span className="text-green-500 text-xs">(Active)</span>
                                            )}
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    ))}
                                    {project.assignedTechnicians.length > 5 && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                                            +{project.assignedTechnicians.length - 5}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {project.assignedTechnicians.slice(5).map((tech: any) => tech.name).join(', ')}
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                  {project.assignedTechnicians.some((t: any) => t.isActive) && (
                                    <Badge variant="outline" className="ml-auto text-xs bg-green-500/10 text-green-600 border-green-500/30">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                                      {t('dashboard.projects.activeNow', 'Active')}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    </div>
                  )}
                </div>
                )}

                {/* Past Projects */}
                {projectsSubTab === "past" && (
                  <Tabs defaultValue="completed" className="space-y-4">
                    <TabsList className="mb-4">
                      <TabsTrigger value="completed" data-testid="tab-completed-projects">
                        <span className="material-icons text-sm mr-1">done_all</span>
                        {t('dashboard.projects.completed', 'Completed')}
                      </TabsTrigger>
                      <TabsTrigger value="deleted" data-testid="tab-deleted-projects">
                        <span className="material-icons text-sm mr-1">delete</span>
                        {t('dashboard.projects.deleted', 'Deleted')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="completed" className="space-y-4">
                      <CompletedProjectsTab />
                    </TabsContent>

                    <TabsContent value="deleted" className="space-y-4">
                      <DeletedProjectsTab />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
        )}

        {/* Remove old standalone past-projects tab - now integrated into projects tab */}
        {false && activeTab === "past-projects" && (
          <div>
            <Tabs defaultValue="completed" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-success rounded-full"></div>
                  <h2 className="text-xl font-bold">{t('dashboard.projects.pastProjects', 'Past Projects')}</h2>
                </div>
                <TabsList>
                  <TabsTrigger value="completed" data-testid="tab-completed-projects">
                    <span className="material-icons text-sm mr-1">done_all</span>
                    {t('dashboard.projects.completed', 'Completed')}
                  </TabsTrigger>
                  <TabsTrigger value="deleted" data-testid="tab-deleted-projects">
                    <span className="material-icons text-sm mr-1">delete</span>
                    {t('dashboard.projects.deleted', 'Deleted')}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="completed" className="space-y-4">
              {filteredProjects.filter((p: Project) => p.status === "completed").length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <span className="material-icons text-4xl mb-2 opacity-50">done_all</span>
                    <div>{t('dashboard.projects.noCompletedProjects', 'No completed projects yet')}</div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.filter((p: Project) => p.status === "completed").map((project: Project) => (
                    <Card 
                      key={project.id} 
                      className="group border-l-4 border-l-success shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer bg-gradient-to-br from-background to-success/5" 
                      data-testid={`completed-project-${project.id}`}
                      onClick={() => setLocation(`/projects/${project.id}`)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-lg font-bold mb-1">{project.buildingName}</div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">{project.strataPlanNumber}</div>
                            <div className="text-sm text-muted-foreground capitalize flex items-center gap-2">
                              <span className="material-icons text-base text-success">check_circle</span>
                              {getJobTypeLabel(t, project.jobType)}
                            </div>
                            {project.createdAt && (
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <span className="material-icons text-xs">event</span>
                                {t('dashboard.projects.created', 'Created')} {formatTimestampDate(project.createdAt)}
                              </div>
                            )}
                          </div>
                          <Badge variant="default" className="bg-success hover:bg-success text-white">
                            <span className="material-icons text-xs mr-1">done_all</span>
                            {t('dashboard.projects.complete', 'Complete')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              </TabsContent>

              <TabsContent value="deleted">
                <DeletedProjectsTab />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === "performance" && (
          <div>
            <div className="space-y-4">
              {/* Active Workers Quick Access */}
              <Card className="hover-elevate active-elevate-2 cursor-pointer border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent" onClick={() => setLocation("/active-workers")} data-testid="card-active-workers">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl">
                      <span className="material-icons text-indigo-500">work_history</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{t('dashboard.cards.activeWorkers.label', 'Active Workers')}</CardTitle>
                      <CardDescription>{t('dashboard.cards.activeWorkers.description', "Who's working")}</CardDescription>
                    </div>
                    <span className="material-icons text-muted-foreground">chevron_right</span>
                  </div>
                </CardHeader>
              </Card>

              {completedSessions.length > 0 ? (
                <>
                  {/* Overall Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('dashboard.performance.overallTargetPerformance', 'Overall Target Performance')}</CardTitle>
                      <CardDescription>{t('dashboard.performance.acrossAllProjects', 'Across all projects and work sessions')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={performancePieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value, percent }) => 
                                value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : null
                              }
                              outerRadius={70}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {performancePieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-3 gap-4 mt-2 w-full max-w-md">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary" data-testid="performance-target-met">{targetMetCount}</div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.performance.targetMet', 'Target Met')}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400" data-testid="performance-valid-reason">{validReasonCount}</div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.performance.validReason', 'Valid Reason')}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-destructive" data-testid="performance-below-target">{belowTargetCount}</div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.performance.belowTarget', 'Below Target')}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Per-Employee Performance */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('dashboard.performance.performanceByEmployee', 'Performance by Employee')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        // Group sessions by employee
                        const sessionsByEmployee = completedSessions.reduce((acc: any, session: any) => {
                          const name = session.employeeName || 'Unknown';
                          if (!acc[name]) {
                            acc[name] = [];
                          }
                          acc[name].push(session);
                          return acc;
                        }, {});

                        return Object.entries(sessionsByEmployee).map(([employeeName, sessions]: [string, any]) => {
                          const employeeTargetMet = sessions.filter((s: any) => s.dropsCompleted >= s.dailyDropTarget).length;
                          const employeeValidReason = sessions.filter((s: any) => 
                            s.dropsCompleted < s.dailyDropTarget && s.validShortfallReasonCode
                          ).length;
                          const employeeBelowTarget = sessions.filter((s: any) => 
                            s.dropsCompleted < s.dailyDropTarget && !s.validShortfallReasonCode
                          ).length;
                          
                          const employeePieData = [
                            { name: t('dashboard.performance.targetMet', 'Target Met'), value: employeeTargetMet, color: "hsl(var(--primary))" },
                            { name: t('dashboard.performance.validReason', 'Valid Reason'), value: employeeValidReason, color: "hsl(var(--warning))" },
                            { name: t('dashboard.performance.belowTarget', 'Below Target'), value: employeeBelowTarget, color: "hsl(var(--destructive))" },
                          ];

                          return (
                            <Card key={employeeName}>
                              <CardHeader>
                                <CardTitle className="text-base">{employeeName}</CardTitle>
                                <CardDescription className="text-xs">{sessions.length} {t('dashboard.performance.workSessions', 'work sessions')}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-col items-center">
                                  <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                      <Pie
                                        data={employeePieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value, percent }) => 
                                          value > 0 ? `${value} (${(percent * 100).toFixed(0)}%)` : null
                                        }
                                        outerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        {employeePieData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                      </Pie>
                                      <RechartsTooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                  <div className="grid grid-cols-3 gap-2 mt-2 w-full text-center">
                                    <div>
                                      <div className="text-lg font-bold text-primary">{employeeTargetMet}</div>
                                      <div className="text-xs text-muted-foreground">{t('dashboard.performance.met', 'Met')}</div>
                                    </div>
                                    <div>
                                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{employeeValidReason}</div>
                                      <div className="text-xs text-muted-foreground">{t('dashboard.performance.valid', 'Valid')}</div>
                                    </div>
                                    <div>
                                      <div className="text-lg font-bold text-destructive">{employeeBelowTarget}</div>
                                      <div className="text-xs text-muted-foreground">{t('dashboard.performance.below', 'Below')}</div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Hours Analytics Card */}
                  <Card 
                    className="hover-elevate active-elevate-2 cursor-pointer"
                    onClick={() => setLocation("/hours-analytics")}
                    data-testid="card-hours-analytics"
                  >
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">{t('dashboard.performance.hoursAnalytics', 'Hours Analytics')}</CardTitle>
                        <CardDescription className="text-sm">
                          {t('dashboard.performance.hoursAnalyticsDesc', 'View billable vs non-billable hours breakdown')}
                        </CardDescription>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-icons text-primary text-2xl">pie_chart</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {t('dashboard.performance.analyzeTimeAllocation', 'Analyze time allocation across all projects')}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Job Schedule Card - Visible for everyone */}
                  <Card 
                    className="hover-elevate active-elevate-2 cursor-pointer"
                    onClick={() => setLocation("/schedule")}
                    data-testid="card-schedule"
                  >
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">{t('dashboard.performance.jobSchedule', 'Job Schedule')}</CardTitle>
                        <CardDescription className="text-sm">
                          {t('dashboard.performance.jobScheduleDesc', 'Manage team assignments and job scheduling')}
                        </CardDescription>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-icons text-primary text-2xl">event</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {t('dashboard.performance.scheduleJobs', 'Schedule jobs and assign employees to tasks')}
                      </p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <span className="material-icons text-4xl mb-2 opacity-50">analytics</span>
                    <div>{t('dashboard.performance.noCompletedSessions', 'No completed work sessions yet')}</div>
                    <div className="text-sm mt-1">{t('dashboard.performance.performanceDataAppear', 'Performance data will appear after completing work sessions')}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}


        {activeTab === "complaints" && (
          <div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle>{t('dashboard.feedback.allFeedback', 'All Feedback')}</CardTitle>
                      <CardDescription>
                        {t('dashboard.feedback.viewManageFeedback', 'View and manage resident feedback across all projects')}
                      </CardDescription>
                    </div>
                    {complaintMetricsData?.metrics?.averageResolutionMs && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1.5 px-3 py-1.5" data-testid="badge-avg-resolution-time">
                          <span className="material-icons text-sm">schedule</span>
                          <span className="text-sm font-semibold">
                            {t('dashboard.feedback.avgResolution', 'Avg Resolution')}: {formatDurationMs(complaintMetricsData.metrics.averageResolutionMs)}
                          </span>
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {complaintsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">{t('dashboard.feedback.loadingFeedback', 'Loading feedback...')}</div>
                  ) : complaints.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">{t('dashboard.feedback.noFeedback', 'No feedback yet')}</div>
                  ) : (() => {
                    // Group complaints by strata plan number
                    const groupedComplaints = complaints.reduce((acc: any, complaint: any) => {
                      const key = complaint.strataPlanNumber || 'Unknown';
                      if (!acc[key]) {
                        acc[key] = {
                          strataPlanNumber: key,
                          buildingName: complaint.buildingName || t('common.unknownBuilding', 'Unknown Building'),
                          complaints: []
                        };
                      }
                      acc[key].complaints.push(complaint);
                      return acc;
                    }, {});

                    const buildings = Object.values(groupedComplaints);

                    return (
                      <Accordion type="single" collapsible className="w-full space-y-2">
                        {buildings.map((building: any) => {
                          const openCount = building.complaints.filter((c: any) => c.status === 'open').length;
                          
                          return (
                            <AccordionItem 
                              key={building.strataPlanNumber} 
                              value={building.strataPlanNumber}
                              className="border rounded-lg px-4"
                            >
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <div className="flex-1 text-left">
                                    <div className="font-semibold text-base">{building.buildingName}</div>
                                    <div className="text-sm text-muted-foreground">LMS {building.strataPlanNumber}</div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {openCount > 0 && (
                                      <Badge variant="default" className="text-xs">
                                        {openCount} {t('dashboard.feedback.open', 'open')}
                                      </Badge>
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      {building.complaints.length} {t('dashboard.feedback.total', 'total')}
                                    </Badge>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 pt-2">
                                  {building.complaints.map((complaint: any) => (
                                    <Card 
                                      key={complaint.id} 
                                      className="shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                                      onClick={() => setLocation(`/complaints/${complaint.id}`)}
                                      data-testid={`feedback-card-${complaint.id}`}
                                    >
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="font-medium">{complaint.residentName}</span>
                                              <Badge variant={complaint.status === 'open' ? 'default' : 'secondary'} className="text-xs">
                                                {complaint.status}
                                              </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground mb-1">
                                              Unit {complaint.unitNumber} • {complaint.phoneNumber}
                                            </div>
                                            <p className="text-sm line-clamp-2">{complaint.message}</p>
                                            <div className="text-xs text-muted-foreground mt-2">
                                              {formatTimestampDate(complaint.createdAt)}
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div>
            <div className="space-y-4">
              {/* Debug Panel for Invite Response */}
              {inviteDebugResponse && (
                <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20" data-testid="card-invite-debug">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 py-2 px-4">
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-amber-600">bug_report</span>
                      <span className="font-medium text-amber-800 dark:text-amber-200">Invite Debug Response</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInviteDebugResponse(null)}
                      data-testid="button-clear-debug"
                    >
                      <span className="material-icons">close</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <pre className="text-xs bg-background p-3 rounded overflow-auto max-h-64 border">
                      {JSON.stringify(inviteDebugResponse, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
              {/* Seat Usage Information */}
              {employeesData?.seatInfo && (
                <Card data-testid="card-seat-info">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="material-icons text-primary">groups</span>
                        <div>
                          <div className="font-medium">{t('dashboard.employeeSeats.title', 'Employee Seats')}</div>
                          <div className="text-sm text-muted-foreground">
                            {employeesData.seatInfo.tier && employeesData.seatInfo.tier !== 'none'
                              ? (() => {
                                  const seatsRemaining = employeesData.seatInfo.seatLimit === -1 
                                    ? '∞' 
                                    : Math.max(0, employeesData.seatInfo.seatLimit - employeesData.seatInfo.seatsUsed);
                                  const paidSeats = employeesData.seatInfo.paidSeats || 0;
                                  const giftedSeats = employeesData.seatInfo.giftedSeats || 0;
                                  const totalAdditional = employeesData.seatInfo.additionalSeats || 0;
                                  
                                  let additionalInfo = '';
                                  if (totalAdditional > 0) {
                                    if (paidSeats > 0 && giftedSeats > 0) {
                                      additionalInfo = ` (${employeesData.seatInfo.baseSeatLimit} base + ${paidSeats} paid + ${giftedSeats} gifted)`;
                                    } else if (giftedSeats > 0) {
                                      additionalInfo = ` (${employeesData.seatInfo.baseSeatLimit} base + ${giftedSeats} gifted)`;
                                    } else if (paidSeats > 0) {
                                      additionalInfo = ` (${employeesData.seatInfo.baseSeatLimit} base + ${paidSeats} paid)`;
                                    }
                                  }
                                  
                                  // Calculate total allocated seats (gifted + paid)
                                  const seatsUsed = employeesData.seatInfo.seatsUsed;
                                  const isUnlimited = employeesData.seatInfo.seatLimit === -1;
                                  const totalAllocated = isUnlimited 
                                    ? giftedSeats + paidSeats 
                                    : employeesData.seatInfo.seatLimit;
                                  const seatsRemainingCount = Math.max(0, totalAllocated - seatsUsed);
                                  
                                  // Build display parts dynamically
                                  const parts: string[] = [];
                                  
                                  if (totalAllocated > 0) {
                                    parts.push(`${seatsUsed} of ${totalAllocated} seats used`);
                                    parts.push(`${seatsRemainingCount} remaining`);
                                  } else {
                                    parts.push(`${seatsUsed} seats used`);
                                  }
                                  
                                  if (isUnlimited) {
                                    parts.push('Unlimited trial');
                                  }
                                  
                                  if (giftedSeats > 0) {
                                    parts.push(`${giftedSeats} gifted`);
                                  }
                                  
                                  if (paidSeats > 0) {
                                    parts.push(`${paidSeats} paid`);
                                  }
                                  
                                  return parts.join(' • ');
                                })()
                              : t('dashboard.employeeSeats.manageCapacity', 'Manage your employee capacity')
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {employeesData.seatInfo.atSeatLimit && (
                      <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <div className="flex items-start gap-2">
                          <span className="material-icons text-destructive text-sm mt-0.5">warning</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-destructive">{t('dashboard.employeeSeats.seatLimitReached', 'Seat Limit Reached')}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {t('dashboard.employeeSeats.seatLimitReachedDesc', "You've reached your {{limit}}-employee limit. Click 'Add New Employee' below to purchase additional seats.", { limit: employeesData.seatInfo.seatLimit })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Employee Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  className="flex-1 h-12 gap-2" 
                  data-testid="button-create-employee"
                  disabled={userIsReadOnly}
                  onClick={() => {
                    if (employeesData?.seatInfo?.atSeatLimit) {
                      setShowPurchaseSeatsDialog(true);
                    } else {
                      setShowEmployeeDialog(true);
                    }
                  }}
                >
                  <span className="material-icons">person_add</span>
                  {t('dashboard.employeeSeats.addNewEmployee', 'Add New Employee')}
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-1 h-12 gap-2" 
                  data-testid="button-get-more-seats"
                  disabled={userIsReadOnly}
                  onClick={() => setShowPurchaseSeatsDialog(true)}
                >
                  <span className="material-icons">add_circle</span>
                  {t('dashboard.employeeSeats.getMoreSeats', 'Get More Seats')}
                </Button>
              </div>
              
              {/* Purchase Seats Dialog - shown when no seats available */}
              <PurchaseSeatsDialog
                open={showPurchaseSeatsDialog}
                onOpenChange={setShowPurchaseSeatsDialog}
                currentSeats={employeesData?.seatInfo?.seatLimit || 0}
                onPurchaseSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/employees/all"] });
                  queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
                  queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
                }}
                isTrialing={currentUser?.subscriptionStatus === 'trialing'}
                seatsUsed={employeesData?.seatInfo?.seatsUsed || 0}
                baseSeatLimit={employeesData?.seatInfo?.baseSeatLimit || 2}
                paidSeats={employeesData?.seatInfo?.paidSeats || 0}
                giftedSeats={employeesData?.seatInfo?.giftedSeats || 0}
                hasWhitelabelBranding={currentUser?.whitelabelBrandingActive || false}
              />
              
              {/* Employee Dialog */}
              <Dialog open={showEmployeeDialog} onOpenChange={(open) => { setShowEmployeeDialog(open); if (!open) resetOnRopeProSearch(); }}>
                <DialogContent className="max-w-2xl p-0 max-h-[95vh] flex flex-col">
                  <div className="p-6 border-b">
                    <DialogHeader>
                      <DialogTitle>
                        {employeeFormStep === 0 ? 'Add Employee' : 
                         employeeFormStep === 1 ? t('dashboard.employeeForm.title', 'Employee Information') : 
                         addEmployeeMode === 'onropepro' ? 'Add from OnRopePro' :
                         t('dashboard.employeeForm.permissionsTitle', 'Permissions')}
                      </DialogTitle>
                      <DialogDescription>
                        {employeeFormStep === 0 ? 'Choose how you want to add an employee' :
                         employeeFormStep === 1 ? t('dashboard.employeeForm.step1', 'Step 1 of 2: Enter employee details') : 
                         addEmployeeMode === 'onropepro' ? 'Search for a technician who registered on OnRopePro' :
                         t('dashboard.employeeForm.step2', 'Step 2 of 2: Configure access permissions')}
                      </DialogDescription>
                    </DialogHeader>
                    
                    {/* Trial Billing Warning - calculates billable seats (seats above baseSeatLimit are charged) */}
                    {currentUser?.subscriptionStatus === 'trialing' && (() => {
                      const seatsUsed = employeesData?.seatInfo?.seatsUsed || 0;
                      const baseSeatLimit = employeesData?.seatInfo?.baseSeatLimit || 2;
                      // Current billable seats = seats used minus the free base seats
                      const currentBillableSeats = Math.max(0, seatsUsed - baseSeatLimit);
                      // After adding this new employee, billable seats increases by 1
                      const newBillableSeats = currentBillableSeats + 1;
                      
                      return (
                        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div className="flex items-start gap-3">
                            <span className="material-icons text-amber-600 dark:text-amber-400 text-xl mt-0.5">warning</span>
                            <div className="flex-1">
                              <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                Free Trial - Billing Notice
                              </p>
                              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                                You're currently on a <strong>30-day free trial</strong>. You have {baseSeatLimit} gifted seats. Each additional seat is billed at <strong>$34.95/month</strong> when your trial ends.
                              </p>
                              <div className="bg-white dark:bg-amber-900 rounded-md p-3 border border-amber-200 dark:border-amber-700">
                                <div className="flex justify-between items-center text-sm mb-2">
                                  <span className="text-amber-700 dark:text-amber-300">Base subscription:</span>
                                  <span className="font-medium text-amber-900 dark:text-amber-100">$99.00/mo</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                  <span className="text-amber-700 dark:text-amber-300">
                                    Gifted seats (free):
                                  </span>
                                  <span className="font-medium text-amber-900 dark:text-amber-100">
                                    {baseSeatLimit} seats
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                  <span className="text-amber-700 dark:text-amber-300">
                                    Additional paid seats after adding:
                                  </span>
                                  <span className="font-medium text-amber-900 dark:text-amber-100">
                                    {newBillableSeats} x $34.95 = ${(newBillableSeats * 34.95).toFixed(2)}/mo
                                  </span>
                                </div>
                                <div className="border-t border-amber-200 dark:border-amber-700 pt-2 mt-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-amber-900 dark:text-amber-100">
                                      Projected monthly cost after trial:
                                    </span>
                                    <span className="font-bold text-lg text-amber-900 dark:text-amber-100">
                                      ${(99 + newBillableSeats * 34.95).toFixed(2)}/mo
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="overflow-y-auto flex-1 p-6">
                    {/* Step 0: Choose mode */}
                    {employeeFormStep === 0 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Create New Employee Option */}
                          <div 
                            className="border-2 rounded-lg p-6 cursor-pointer hover-elevate active-elevate-2 transition-all text-center"
                            onClick={() => { setAddEmployeeMode('create'); setEmployeeFormStep(1); }}
                            data-testid="button-add-employee-create-new"
                          >
                            <span className="material-icons text-4xl text-primary mb-3">person_add</span>
                            <h3 className="font-semibold text-lg mb-2">Create New Employee</h3>
                            <p className="text-sm text-muted-foreground">
                              Manually enter all employee details and create a new account
                            </p>
                          </div>
                          
                          {/* Add from OnRopePro Option */}
                          <div 
                            className="border-2 rounded-lg p-6 cursor-pointer hover-elevate active-elevate-2 transition-all text-center border-primary/30 bg-primary/5"
                            onClick={() => { setAddEmployeeMode('onropepro'); setEmployeeFormStep(2); }}
                            data-testid="button-add-employee-from-onropepro"
                          >
                            <span className="material-icons text-4xl text-primary mb-3">search</span>
                            <h3 className="font-semibold text-lg mb-2">Add from OnRopePro</h3>
                            <p className="text-sm text-muted-foreground">
                              Find a technician who already registered on OnRopePro
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                            <span className="material-icons text-primary text-lg mt-0.5">info</span>
                            <div className="text-sm text-muted-foreground">
                              <p className="font-medium text-foreground mb-1">What is OnRopePro?</p>
                              <p>Technicians can self-register at the technician login page. Once they register, you can add them to your company by searching for their license number or email.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2 (when mode is onropepro): Search for technician */}
                    {employeeFormStep === 2 && addEmployeeMode === 'onropepro' && (
                      <div className="space-y-6">
                        {/* Search Type Selection */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Search by</label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { value: 'irata', label: 'IRATA License', icon: 'badge' },
                              { value: 'sprat', label: 'SPRAT License', icon: 'verified' },
                              { value: 'email', label: 'Email', icon: 'email' },
                            ].map((option) => (
                              <div
                                key={option.value}
                                className={`border-2 rounded-lg p-3 cursor-pointer text-center transition-all ${
                                  onRopeProSearchType === option.value
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted hover-elevate'
                                }`}
                                onClick={() => { setOnRopeProSearchType(option.value as any); setFoundTechnician(null); setOnRopeProSearchValue(''); }}
                                data-testid={`button-search-type-${option.value}`}
                              >
                                <span className="material-icons text-xl text-primary mb-1">{option.icon}</span>
                                <div className="text-xs font-medium">{option.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Search Input */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {onRopeProSearchType === 'irata' ? 'IRATA License Number' :
                             onRopeProSearchType === 'sprat' ? 'SPRAT License Number' :
                             'Email Address'}
                          </label>
                          <div className="flex gap-2">
                            <Input
                              placeholder={
                                onRopeProSearchType === 'irata' ? 'e.g., 123456' :
                                onRopeProSearchType === 'sprat' ? 'e.g., SP-12345' :
                                'e.g., technician@email.com'
                              }
                              value={onRopeProSearchValue}
                              onChange={(e) => { setOnRopeProSearchValue(e.target.value); setFoundTechnician(null); }}
                              className="h-12 flex-1"
                              data-testid="input-onropepro-search"
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchOnRopeProTechnician(); }}}
                            />
                            <Button 
                              type="button"
                              onClick={searchOnRopeProTechnician}
                              disabled={technicianSearching || !onRopeProSearchValue.trim()}
                              className="h-12 px-6"
                              data-testid="button-search-onropepro"
                            >
                              {technicianSearching ? (
                                <span className="material-icons animate-spin">sync</span>
                              ) : (
                                <span className="material-icons">search</span>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {/* Found Technician Result */}
                        {foundTechnician && (
                          <div className="border-2 border-green-500/30 bg-green-500/5 rounded-lg p-4 space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-icons text-primary text-2xl">person</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{foundTechnician.name}</h3>
                                <p className="text-sm text-muted-foreground">{foundTechnician.email}</p>
                              </div>
                              <span className="material-icons text-green-500 text-2xl">check_circle</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                              {foundTechnician.irataLevel && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">IRATA:</span>
                                  <span className="ml-2 font-medium">{foundTechnician.irataLevel}</span>
                                  {foundTechnician.irataLicenseNumber && (
                                    <span className="text-muted-foreground ml-1">({foundTechnician.irataLicenseNumber})</span>
                                  )}
                                </div>
                              )}
                              {foundTechnician.spratLevel && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">SPRAT:</span>
                                  <span className="ml-2 font-medium">{foundTechnician.spratLevel}</span>
                                  {foundTechnician.spratLicenseNumber && (
                                    <span className="text-muted-foreground ml-1">({foundTechnician.spratLicenseNumber})</span>
                                  )}
                                </div>
                              )}
                              {(foundTechnician.employeeCity || foundTechnician.employeeProvinceState) && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Location:</span>
                                  <span className="ml-2 font-medium">
                                    {[foundTechnician.employeeCity, foundTechnician.employeeProvinceState].filter(Boolean).join(', ')}
                                  </span>
                                </div>
                              )}
                              {foundTechnician.hasFirstAid && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">First Aid:</span>
                                  <span className="ml-2 font-medium text-green-600">{foundTechnician.firstAidType || 'Yes'}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Warning if technician is employed and has visibility on */}
                            {technicianSearchWarning && (
                              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                <span className="material-icons text-amber-500 text-lg mt-0.5">warning</span>
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                  {technicianSearchWarning}
                                </p>
                              </div>
                            )}
                            
                            <Button 
                              type="button"
                              className="w-full h-12"
                              onClick={inviteOnRopeProTechnician}
                              disabled={technicianLinking}
                              data-testid="button-invite-technician"
                            >
                              {technicianLinking ? (
                                <>
                                  <span className="material-icons animate-spin mr-2">sync</span>
                                  {t('dashboard.employeeForm.sendingInvitation', 'Sending Invitation...')}
                                </>
                              ) : (
                                <>
                                  <span className="material-icons mr-2">mail</span>
                                  {t('dashboard.employeeForm.sendInvitation', 'Send Team Invitation to')} {foundTechnician.name}
                                </>
                              )}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                              {t('dashboard.employeeForm.invitationNote', 'They will receive a notification in their portal to accept or decline.')}
                            </p>
                          </div>
                        )}
                        
                        {/* Back button */}
                        <div className="pt-4 border-t flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setEmployeeFormStep(0); setAddEmployeeMode(null); setFoundTechnician(null); setOnRopeProSearchValue(''); }}
                            data-testid="button-back-to-mode-select"
                          >
                            <span className="material-icons mr-2">arrow_back</span>
                            Back
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Original form for creating new employee */}
                    {addEmployeeMode === 'create' && (
                    <Form {...employeeForm}>
                      <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4">
                      {employeeFormStep === 1 && (
                        <>
                      <FormField
                        control={employeeForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.employeeForm.fullName', 'Full Name')}</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} data-testid="input-employee-name" className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={employeeForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.employeeForm.emailAddress', 'Email Address')}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="employee@company.com" {...field} data-testid="input-employee-email" className="h-12" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              {t('dashboard.employeeForm.emailDescription', 'Will be used as username')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={employeeForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.employeeForm.temporaryPassword', 'Temporary Password')}</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Enter temporary password" {...field} data-testid="input-employee-password" className="h-12" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              {t('dashboard.employeeForm.passwordDescription', 'Give this password to the employee')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={employeeForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>{t('dashboard.employeeForm.role', 'Role')}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-3"
                              >
                                {ROLE_OPTIONS.map((role) => (
                                  <FormItem key={role.value}>
                                    <FormControl>
                                      <div className="relative">
                                        <RadioGroupItem
                                          value={role.value}
                                          id={`role-${role.value}`}
                                          className="peer sr-only"
                                          data-testid={`radio-role-${role.value}`}
                                        />
                                        <FormLabel
                                          htmlFor={`role-${role.value}`}
                                          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-background p-3 hover-elevate active-elevate-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                        >
                                          <span className="material-icons text-2xl text-primary">
                                            {role.icon}
                                          </span>
                                          <span className="text-xs font-medium text-center leading-tight">
                                            {t(role.labelKey, role.label)}
                                          </span>
                                        </FormLabel>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={employeeForm.control}
                        name="isSalary"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">{t('dashboard.employeeForm.isSalary', 'Salary Employee')}</FormLabel>
                              <FormDescription className="text-xs">
                                {t('dashboard.employeeForm.isSalaryDescription', 'Toggle on for salaried employees instead of hourly')}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-employee-is-salary"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {employeeForm.watch("isSalary") ? (
                        <FormField
                          control={employeeForm.control}
                          name="salary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.employeeForm.salary', 'Annual Salary ($)')}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="1" 
                                  min="0" 
                                  placeholder="50000" 
                                  {...field} 
                                  data-testid="input-employee-salary" 
                                  className="h-12" 
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                {t('dashboard.employeeForm.salaryDescription', 'Annual salary amount')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <FormField
                          control={employeeForm.control}
                          name="hourlyRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.employeeForm.hourlyRate', 'Hourly Rate ($/hr)')}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  min="0" 
                                  placeholder="25.00" 
                                  {...field} 
                                  data-testid="input-employee-hourly-rate" 
                                  className="h-12" 
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                {t('dashboard.employeeForm.hourlyRateDescription', 'Optional - for labor cost calculations')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <div className="border-t pt-4 mt-6">
                        <h3 className="text-sm font-medium mb-4">{t('dashboard.employeeForm.personalDetails', 'Personal Details (Optional)')}</h3>
                        
                        <div className="space-y-4">
                          <FormField
                            control={employeeForm.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.startDate', 'Start Date')}</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} data-testid="input-employee-start-date" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="birthday"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.birthday', 'Birthday')}</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} data-testid="input-employee-birthday" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="socialInsuranceNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.socialInsuranceNumber', 'Social Insurance Number')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="XXX-XXX-XXX" {...field} data-testid="input-employee-sin" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="driversLicenseNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.driversLicenseNumber', "Driver's License Number")}</FormLabel>
                                <FormControl>
                                  <Input placeholder="License number" {...field} data-testid="input-employee-dl-number" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="driversLicenseProvince"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.driversLicenseProvince', "Driver's License Province/State")}</FormLabel>
                                <FormControl>
                                  <Input placeholder="BC, AB, etc." {...field} data-testid="input-employee-dl-province" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <DocumentUploader
                            documents={employeeForm.watch("driversLicenseDocuments") || []}
                            onDocumentsChange={(docs) => employeeForm.setValue("driversLicenseDocuments", docs)}
                            maxDocuments={5}
                            label={t('dashboard.employeeForm.driversLicenseDocuments', "Driver's License Documents")}
                            description={t('dashboard.employeeForm.driversLicenseDocsDescription', 'Upload driver\'s license photos, abstracts, or related documents')}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="homeAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.homeAddress', 'Home Address')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Street address" {...field} data-testid="input-employee-address" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="employeePhoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.phoneNumber', 'Phone Number')}</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="(604) 555-1234" {...field} data-testid="input-employee-phone" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="emergencyContactName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.emergencyContactName', 'Emergency Contact Name')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Contact name" {...field} data-testid="input-employee-emergency-name" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="emergencyContactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.emergencyContactPhone', 'Emergency Contact Phone')}</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="(604) 555-1234" {...field} data-testid="input-employee-emergency-phone" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={employeeForm.control}
                            name="specialMedicalConditions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('dashboard.employeeForm.specialMedicalConditions', 'Special Medical Conditions')}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Medical conditions to be aware of" {...field} data-testid="input-employee-medical" className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-medium mb-4">{t('dashboard.employeeForm.irataCertification', 'IRATA Certification (Optional)')}</h4>
                            <div className="space-y-4">
                              <FormField
                                control={employeeForm.control}
                                name="irataLevel"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('dashboard.employeeForm.irataLevel', 'IRATA Level')}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="h-12" data-testid="select-irata-level">
                                          <SelectValue placeholder={t('dashboard.employeeForm.selectLevel', 'Select level')} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Level 1">Level 1</SelectItem>
                                        <SelectItem value="Level 2">Level 2</SelectItem>
                                        <SelectItem value="Level 3">Level 3</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {employeeForm.watch("irataLevel") && (
                                <>
                                  <FormField
                                    control={employeeForm.control}
                                    name="irataLicenseNumber"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t('dashboard.employeeForm.irataLicenseNumber', 'IRATA License Number')}</FormLabel>
                                        <FormControl>
                                          <Input placeholder="License number" {...field} data-testid="input-irata-license" className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={employeeForm.control}
                                    name="irataIssuedDate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t('dashboard.employeeForm.irataIssuedDate', 'IRATA Issued Date')}</FormLabel>
                                        <FormControl>
                                          <Input type="date" {...field} data-testid="input-irata-issued" className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={employeeForm.control}
                                    name="irataExpirationDate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t('dashboard.employeeForm.irataExpirationDate', 'IRATA Expiration Date')}</FormLabel>
                                        <FormControl>
                                          <Input type="date" {...field} data-testid="input-irata-expiration" className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-medium mb-4">{t('dashboard.employeeForm.firstAidCertification', 'First Aid Certification (Optional)')}</h4>
                            <div className="space-y-4">
                              <FormField
                                control={employeeForm.control}
                                name="hasFirstAid"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>{t('dashboard.employeeForm.hasFirstAidCert', 'Has First Aid Certification')}</FormLabel>
                                      <FormDescription className="text-xs">
                                        {t('dashboard.employeeForm.hasFirstAidDesc', 'Toggle if employee has a valid first aid certification')}
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        data-testid="switch-has-first-aid"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              {employeeForm.watch("hasFirstAid") && (
                                <>
                                  <FormField
                                    control={employeeForm.control}
                                    name="firstAidType"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t('dashboard.employeeForm.firstAidType', 'First Aid Type')}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                          <FormControl>
                                            <SelectTrigger className="h-12" data-testid="select-first-aid-type">
                                              <SelectValue placeholder={t('dashboard.employeeForm.selectFirstAidType', 'Select certification type')} />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="Standard First Aid">{t('dashboard.employeeForm.firstAidTypes.standard', 'Standard First Aid')}</SelectItem>
                                            <SelectItem value="Emergency First Aid">{t('dashboard.employeeForm.firstAidTypes.emergency', 'Emergency First Aid')}</SelectItem>
                                            <SelectItem value="CPR/AED">{t('dashboard.employeeForm.firstAidTypes.cprAed', 'CPR/AED')}</SelectItem>
                                            <SelectItem value="OFA Level 1">{t('dashboard.employeeForm.firstAidTypes.ofaLevel1', 'OFA Level 1')}</SelectItem>
                                            <SelectItem value="OFA Level 2">{t('dashboard.employeeForm.firstAidTypes.ofaLevel2', 'OFA Level 2')}</SelectItem>
                                            <SelectItem value="OFA Level 3">{t('dashboard.employeeForm.firstAidTypes.ofaLevel3', 'OFA Level 3')}</SelectItem>
                                            <SelectItem value="Wilderness First Aid">{t('dashboard.employeeForm.firstAidTypes.wilderness', 'Wilderness First Aid')}</SelectItem>
                                            <SelectItem value="Other">{t('dashboard.employeeForm.firstAidTypes.other', 'Other')}</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={employeeForm.control}
                                    name="firstAidExpiry"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>{t('dashboard.employeeForm.firstAidExpiry', 'First Aid Expiry Date')}</FormLabel>
                                        <FormControl>
                                          <Input type="date" {...field} data-testid="input-first-aid-expiry" className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <DocumentUploader
                                    documents={employeeForm.watch("firstAidDocuments") || []}
                                    onDocumentsChange={(docs) => employeeForm.setValue("firstAidDocuments", docs)}
                                    maxDocuments={3}
                                    label={t('dashboard.employeeForm.firstAidDocuments', 'First Aid Documents')}
                                    description={t('dashboard.employeeForm.firstAidDocsDescription', 'Upload first aid certification documents')}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="button" 
                        className="w-full h-12" 
                        onClick={() => setEmployeeFormStep(2)}
                        data-testid="button-continue-to-permissions"
                      >
                        {t('dashboard.employeeForm.continueToPermissions', 'Continue to Permissions')}
                      </Button>
                      </>
                      )}

                      {employeeFormStep === 2 && (
                        <>
                      <FormField
                        control={employeeForm.control}
                        name="permissions"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <FormLabel className="text-base">{t('dashboard.employeeForm.accessPermissions', 'Access Permissions')}</FormLabel>
                                  <FormDescription className="text-xs">
                                    {t('dashboard.employeeForm.selectPermissions', 'Select the permissions this employee should have')}
                                  </FormDescription>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
                                    employeeForm.setValue("permissions", allPermissionIds);
                                  }}
                                  data-testid="button-select-all-permissions"
                                >
                                  {t('dashboard.employeeForm.selectAll', 'Select All')}
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {PERMISSION_CATEGORIES.map((category) => (
                                <div key={category.nameKey} className="border rounded-lg p-4 bg-muted/20">
                                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 pb-2 border-b">{t(category.nameKey, category.nameKey)}</h4>
                                  <div className="space-y-2">
                                    {category.permissions.map((permission) => (
                                      <FormField
                                        key={permission.id}
                                        control={employeeForm.control}
                                        name="permissions"
                                        render={({ field }) => {
                                          return (
                                            <FormItem
                                              key={permission.id}
                                              className="flex flex-row items-center space-x-2 space-y-0"
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value?.includes(permission.id)}
                                                  onCheckedChange={(checked) => {
                                                    const newPermissions = handlePermissionChange(
                                                      field.value || [],
                                                      permission.id,
                                                      !!checked
                                                    );
                                                    field.onChange(newPermissions);
                                                  }}
                                                  data-testid={`checkbox-permission-${permission.id}`}
                                                />
                                              </FormControl>
                                              <FormLabel className="text-sm font-normal cursor-pointer">
                                                {t(permission.labelKey, permission.label)}
                                              </FormLabel>
                                            </FormItem>
                                          )
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-full h-12" 
                          onClick={() => setEmployeeFormStep(1)}
                          data-testid="button-back-to-info"
                        >
                          {t('dashboard.employeeForm.back', 'Back')}
                        </Button>
                        <Button type="submit" className="w-full h-12" data-testid="button-submit-employee" disabled={createEmployeeMutation.isPending}>
                          {createEmployeeMutation.isPending ? t('dashboard.employees.creating', 'Creating...') : t('dashboard.employees.createEmployee', 'Create Employee')}
                        </Button>
                      </div>
                      </>
                      )}
                    </form>
                  </Form>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Employee List */}
              <div className="space-y-6">
                {/* Pending Onboarding Section */}
                {pendingOnboardingInvitations.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">{t('dashboard.employees.pendingOnboarding', 'Pending Onboarding')}</h3>
                      <Badge variant="secondary" data-testid="badge-pending-onboarding-count">
                        {pendingOnboardingInvitations.length}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('dashboard.employees.pendingOnboardingDesc', 'These technicians have accepted your invitation but need salary and permissions set up.')}
                    </p>
                    <div className="space-y-2">
                      {pendingOnboardingInvitations.map((inv) => (
                        <Card 
                          key={inv.id} 
                          data-testid={`pending-onboarding-card-${inv.id}`}
                          className="border-dashed border-2 border-primary/30 bg-primary/5"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{inv.technician.name}</div>
                                <div className="text-sm text-muted-foreground">{inv.technician.email}</div>
                                {inv.technician.irataLevel && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    IRATA {inv.technician.irataLevel}
                                  </Badge>
                                )}
                                {inv.technician.spratLevel && !inv.technician.irataLevel && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    SPRAT {inv.technician.spratLevel}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                onClick={() => {
                                  const tech = inv.technician;
                                  employeeForm.reset({
                                    name: tech.name || "",
                                    email: tech.email || "",
                                    password: "",
                                    role: "rope_access_tech",
                                    hourlyRate: "",
                                    isSalary: false,
                                    salary: "",
                                    permissions: [],
                                    startDate: "",
                                    birthday: tech.birthday || "",
                                    socialInsuranceNumber: tech.socialInsuranceNumber || "",
                                    driversLicenseNumber: tech.driversLicenseNumber || "",
                                    driversLicenseProvince: tech.driversLicenseProvince || "",
                                    driversLicenseDocuments: tech.driversLicenseDocuments || [],
                                    homeAddress: tech.homeAddress || "",
                                    employeePhoneNumber: tech.employeePhoneNumber || "",
                                    emergencyContactName: tech.emergencyContactName || "",
                                    emergencyContactPhone: tech.emergencyContactPhone || "",
                                    specialMedicalConditions: tech.specialMedicalConditions || "",
                                    irataLevel: tech.irataLevel || "",
                                    irataLicenseNumber: tech.irataLicenseNumber || "",
                                    irataIssuedDate: tech.irataIssuedDate || "",
                                    irataExpirationDate: tech.irataExpirationDate || "",
                                    hasFirstAid: tech.hasFirstAid || false,
                                    firstAidType: tech.firstAidType || "",
                                    firstAidExpiry: tech.firstAidExpiry || "",
                                    firstAidDocuments: tech.firstAidDocuments || [],
                                  });
                                  setInvitationToConvert(inv);
                                  setEmployeeFormStep(1);
                                  setShowInvitationEmployeeForm(true);
                                }}
                                data-testid={`button-complete-onboarding-${inv.id}`}
                              >
                                <span className="material-icons mr-2 text-sm">person_add</span>
                                {t('dashboard.employees.completeOnboarding', 'Complete Onboarding')}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Sent Invitations */}
                {sentInvitations.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <span className="material-icons text-amber-500">mail_outline</span>
                      {t('dashboard.employees.pendingSentInvitations', 'Pending Invitations')}
                      <Badge variant="secondary" className="ml-2">{sentInvitations.length}</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('dashboard.employees.pendingSentInvitationsDesc', 'Invitations sent that are awaiting response')}
                    </p>
                    <div className="grid gap-3">
                      {sentInvitations.map((inv) => (
                        <Card key={inv.id} className="border-amber-200 dark:border-amber-800" data-testid={`sent-invitation-${inv.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium">{inv.technician.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {inv.technician.role === 'ground_crew' ? t('dashboard.employees.groundCrew', 'Ground Crew') : t('dashboard.employees.ropeAccessTech', 'Rope Access Tech')}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  <span className="material-icons text-xs mr-1 align-middle">email</span>
                                  {inv.technician.email}
                                </div>
                                {inv.technician.employeePhoneNumber && (
                                  <div className="text-sm text-muted-foreground">
                                    <span className="material-icons text-xs mr-1 align-middle">phone</span>
                                    {inv.technician.employeePhoneNumber}
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground mt-2">
                                  {t('dashboard.employees.sentOn', 'Sent')} {new Date(inv.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelInvitationMutation.mutate(inv.id)}
                                disabled={cancelInvitationMutation.isPending}
                                className="text-destructive hover:text-destructive"
                                data-testid={`button-cancel-invitation-${inv.id}`}
                              >
                                <span className="material-icons text-sm mr-1">close</span>
                                {t('dashboard.employees.cancelInvitation', 'Cancel')}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Employees */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className="material-icons text-primary">people</span>
                          {t('dashboard.employees.activeEmployees', 'Active Employees')}
                        </CardTitle>
                        <CardDescription>{t('dashboard.employees.activeEmployeesDescription', 'Team members currently active in your company')}</CardDescription>
                        <div className="flex items-center gap-4 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDeactivateInfoModal(true)}
                            className="text-muted-foreground h-auto py-1 px-2"
                            data-testid="button-deactivate-info"
                          >
                            <span className="material-icons text-sm mr-1">info</span>
                            {t('dashboard.employees.whatIsDeactivate', "What is 'Deactivate'?")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowUnlinkInfoModal(true)}
                            className="text-muted-foreground h-auto py-1 px-2"
                            data-testid="button-unlink-info"
                          >
                            <span className="material-icons text-sm mr-1">info</span>
                            {t('dashboard.employees.whatIsUnlink', "What is 'Unlink'?")}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={employeesViewMode === "cards" ? "default" : "outline"}
                          size="icon"
                          onClick={() => setEmployeesViewMode("cards")}
                          data-testid="button-employees-view-cards"
                        >
                          <span className="material-icons text-sm">grid_view</span>
                        </Button>
                        <Button
                          variant={employeesViewMode === "list" ? "default" : "outline"}
                          size="icon"
                          onClick={() => setEmployeesViewMode("list")}
                          data-testid="button-employees-view-list"
                        >
                          <span className="material-icons text-sm">view_list</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                  {(() => {
                    // Exclude both primary suspended (suspendedAt) and secondary suspended (connectionStatus)
                    const activeEmployees = employees.filter((emp: any) => 
                      !emp.terminatedDate && !emp.suspendedAt && emp.connectionStatus !== 'suspended'
                    );
                    
                    if (activeEmployees.length === 0) {
                      return (
                        <div className="p-8 text-center text-muted-foreground">
                          <span className="material-icons text-4xl mb-2 opacity-50">people</span>
                          <div>{t('dashboard.employees.noActiveEmployees', 'No active employees yet')}</div>
                        </div>
                      );
                    }

                    // Table/List view
                    if (employeesViewMode === "list") {
                      return (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t('dashboard.employees.name', 'Name')}</TableHead>
                              <TableHead>{t('dashboard.employees.role', 'Role')}</TableHead>
                              <TableHead className="hidden md:table-cell">{t('dashboard.employees.email', 'Email')}</TableHead>
                              <TableHead className="hidden lg:table-cell">{t('dashboard.employees.phone', 'Phone')}</TableHead>
                              <TableHead className="hidden xl:table-cell">{t('dashboard.employees.certification', 'Certification')}</TableHead>
                              <TableHead className="text-right">{t('dashboard.employees.actions', 'Actions')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeEmployees.map((employee: any) => (
                              <TableRow 
                                key={employee.id} 
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => {
                                  setEmployeeToView(employee);
                                  setShowEmployeeDetailDialog(true);
                                }}
                                data-testid={`employee-row-${employee.id}`}
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{employee.name || employee.companyName || employee.email}</span>
                                    {employee.role === 'rope_access_tech' && employee.hasPlusAccess && (
                                      <Badge 
                                        variant="default" 
                                        className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-1.5 py-0 h-4 font-bold border-0"
                                      >
                                        <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                                        PLUS
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="text-xs capitalize">
                                    {employee.role?.replace(/_/g, ' ') || 'Employee'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                                <TableCell className="hidden lg:table-cell">{employee.employeePhoneNumber || '-'}</TableCell>
                                <TableCell className="hidden xl:table-cell">
                                  {employee.irataLevel ? (
                                    <Badge variant="outline" className="text-xs">IRATA {employee.irataLevel}</Badge>
                                  ) : employee.spratLevel ? (
                                    <Badge variant="outline" className="text-xs">SPRAT {employee.spratLevel}</Badge>
                                  ) : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditEmployee(employee);
                                      }}
                                      data-testid={`button-edit-employee-row-${employee.id}`}
                                      disabled={userIsReadOnly}
                                    >
                                      <span className="material-icons text-sm">edit</span>
                                    </Button>
                                    {user?.role === "company" && employee.id !== user?.id && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEmployeeToSuspendSeat(employee);
                                        }}
                                        data-testid={`button-deactivate-row-${employee.id}`}
                                        className="text-amber-600 hover:text-amber-700"
                                        disabled={userIsReadOnly}
                                        title={t('dashboard.employees.deactivate', 'Deactivate')}
                                      >
                                        <span className="material-icons text-sm">person_remove</span>
                                      </Button>
                                    )}
                                    {employee.id !== user?.id && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEmployeeToDelete(employee.id);
                                        }}
                                        data-testid={`button-unlink-employee-row-${employee.id}`}
                                        className="text-amber-600 hover:text-amber-700"
                                        disabled={userIsReadOnly}
                                        title={t('dashboard.employees.unlink', 'Unlink')}
                                      >
                                        <span className="material-icons text-sm">link_off</span>
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      );
                    }
                    
                    // Cards view
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {activeEmployees.map((employee: any) => {
                      // Check IRATA license expiration status using timezone-safe date parsing
                      const irataStatus = employee.irataExpirationDate ? (() => {
                        const expirationDate = parseLocalDate(employee.irataExpirationDate);
                        if (!expirationDate) return null;
                        
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const thirtyDaysFromNow = new Date();
                        thirtyDaysFromNow.setHours(0, 0, 0, 0);
                        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                        
                        if (expirationDate < today) {
                          return 'expired';
                        } else if (expirationDate <= thirtyDaysFromNow) {
                          return 'expiring-soon';
                        }
                        return null;
                      })() : null;

                      // Check SPRAT license expiration status
                      const spratStatus = employee.spratExpirationDate ? (() => {
                        const expirationDate = parseLocalDate(employee.spratExpirationDate);
                        if (!expirationDate) return null;
                        
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const thirtyDaysFromNow = new Date();
                        thirtyDaysFromNow.setHours(0, 0, 0, 0);
                        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                        
                        if (expirationDate < today) {
                          return 'expired';
                        } else if (expirationDate <= thirtyDaysFromNow) {
                          return 'expiring-soon';
                        }
                        return null;
                      })() : null;

                      // Check Driver's License expiration status
                      const driversLicenseStatus = employee.driversLicenseExpiry ? (() => {
                        const expirationDate = parseLocalDate(employee.driversLicenseExpiry);
                        if (!expirationDate) return null;
                        
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const thirtyDaysFromNow = new Date();
                        thirtyDaysFromNow.setHours(0, 0, 0, 0);
                        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                        
                        if (expirationDate < today) {
                          return 'expired';
                        } else if (expirationDate <= thirtyDaysFromNow) {
                          return 'expiring-soon';
                        }
                        return null;
                      })() : null;

                      return (
                      <Card 
                        key={employee.id} 
                        data-testid={`employee-card-${employee.id}`} 
                        className="shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                        onClick={() => {
                          setEmployeeToView(employee);
                          setShowEmployeeDetailDialog(true);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Header - Name and Actions */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-lg">{employee.name || employee.companyName || employee.email}</div>
                                  {/* PLUS Badge - Only shown for rope_access_tech with hasPlusAccess */}
                                  {employee.role === 'rope_access_tech' && employee.hasPlusAccess && (
                                    <Badge 
                                      variant="default" 
                                      className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-1.5 py-0 h-4 font-bold border-0" 
                                      data-testid={`badge-plus-${employee.id}`}
                                    >
                                      <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                                      PLUS
                                    </Badge>
                                  )}
                                  {irataStatus === 'expired' && (
                                    <Badge variant="destructive" className="text-xs flex items-center gap-1" data-testid={`badge-irata-expired-${employee.id}`}>
                                      <span className="material-icons text-xs">error</span>
                                      {t('dashboard.employees.irataExpired', 'IRATA Expired')}
                                    </Badge>
                                  )}
                                  {irataStatus === 'expiring-soon' && (
                                    <Badge variant="outline" className="text-xs flex items-center gap-1 bg-red-500/10 border-red-500 text-red-700 dark:text-red-400" data-testid={`badge-irata-warning-${employee.id}`}>
                                      <span className="material-icons text-xs">warning</span>
                                      {t('dashboard.employees.irataExpiringSoon', 'IRATA Expiring Soon')}
                                    </Badge>
                                  )}
                                  {spratStatus === 'expired' && (
                                    <Badge variant="destructive" className="text-xs flex items-center gap-1" data-testid={`badge-sprat-expired-${employee.id}`}>
                                      <span className="material-icons text-xs">error</span>
                                      {t('dashboard.employees.spratExpired', 'SPRAT Expired')}
                                    </Badge>
                                  )}
                                  {spratStatus === 'expiring-soon' && (
                                    <Badge variant="outline" className="text-xs flex items-center gap-1 bg-red-500/10 border-red-500 text-red-700 dark:text-red-400" data-testid={`badge-sprat-warning-${employee.id}`}>
                                      <span className="material-icons text-xs">warning</span>
                                      {t('dashboard.employees.spratExpiringSoon', 'SPRAT Expiring Soon')}
                                    </Badge>
                                  )}
                                  {driversLicenseStatus === 'expired' && (
                                    <Badge variant="destructive" className="text-xs flex items-center gap-1" data-testid={`badge-license-expired-${employee.id}`}>
                                      <span className="material-icons text-xs">error</span>
                                      {t('dashboard.employees.licenseExpired', "Driver's License Expired")}
                                    </Badge>
                                  )}
                                  {driversLicenseStatus === 'expiring-soon' && (
                                    <Badge variant="outline" className="text-xs flex items-center gap-1 bg-red-500/10 border-red-500 text-red-700 dark:text-red-400" data-testid={`badge-license-warning-${employee.id}`}>
                                      <span className="material-icons text-xs">warning</span>
                                      {t('dashboard.employees.licenseExpiringSoon', "Driver's License Expiring Soon")}
                                    </Badge>
                                  )}
                                </div>
                                <Badge variant="secondary" className="text-xs capitalize mt-1">
                                  {employee.role.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 flex-wrap justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditEmployee(employee);
                                  }}
                                  data-testid={`button-edit-employee-${employee.id}`}
                                  disabled={userIsReadOnly}
                                >
                                  <span className="material-icons text-sm">edit</span>
                                </Button>
                                {/* Password change only for company-created employees, NOT rope access technicians who own their own accounts */}
                                {user?.role === "company" && employee.role !== "rope_access_tech" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEmployeeToChangePassword(employee);
                                      setShowChangePasswordDialog(true);
                                    }}
                                    data-testid={`button-change-password-${employee.id}`}
                                    disabled={userIsReadOnly}
                                  >
                                    <span className="material-icons text-sm">lock_reset</span>
                                  </Button>
                                )}
                                {/* Deactivate button - only for employees, not company owner */}
                                {user?.role === "company" && employee.id !== user?.id && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEmployeeToSuspendSeat(employee);
                                    }}
                                    data-testid={`button-deactivate-${employee.id}`}
                                    className="text-amber-600 hover:text-amber-700"
                                    disabled={userIsReadOnly}
                                    title={t('dashboard.employees.deactivate', 'Deactivate')}
                                  >
                                    <span className="material-icons text-sm">person_remove</span>
                                  </Button>
                                )}
                                {/* Unlink button - only for employees, not company owner (can't unlink yourself) */}
                                {employee.id !== user?.id && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEmployeeToDelete(employee.id);
                                    }}
                                    data-testid={`button-unlink-employee-${employee.id}`}
                                    className="text-amber-600 hover:text-amber-700"
                                    disabled={userIsReadOnly}
                                    title={t('dashboard.employees.unlink', 'Unlink')}
                                  >
                                    <span className="material-icons text-sm">link_off</span>
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="material-icons text-base">email</span>
                                {employee.email}
                              </div>
                              {employee.employeePhoneNumber && (
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span className="material-icons text-base">phone</span>
                                  {employee.employeePhoneNumber}
                                </div>
                              )}
                            </div>

                            {/* Employment Details */}
                            <div className="flex flex-wrap gap-2">
                              {employee.startDate && (
                                <Badge variant="outline" className="text-xs">
                                  {t('dashboard.employees.started', 'Started:')} {formatLocalDate(employee.startDate)}
                                </Badge>
                              )}
                              {hasFinancialAccess(user) && (employee.isSalary ? (
                                employee.salary && (
                                  <Badge variant="outline" className="text-xs">
                                    ${Number(employee.salary).toLocaleString()}/{t('dashboard.employees.year', 'yr')}
                                  </Badge>
                                )
                              ) : (
                                employee.hourlyRate && (
                                  <Badge variant="outline" className="text-xs">
                                    ${employee.hourlyRate}/{t('dashboard.employees.hour', 'hr')}
                                  </Badge>
                                )
                              ))}
                              {employee.techLevel && (
                                <Badge variant="outline" className="text-xs">
                                  IRATA {employee.techLevel}
                                </Badge>
                              )}
                            </div>

                            {/* IRATA Details */}
                            {employee.irataLevel && (
                              <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <span className="material-icons text-sm">workspace_premium</span>
                                  <span>{t('dashboard.employees.irataLevel', 'IRATA Level')} {employee.irataLevel}</span>
                                </div>
                                {employee.irataLicenseNumber && (
                                  <div className="ml-6">{t('dashboard.employees.license', 'License:')} {employee.irataLicenseNumber}</div>
                                )}
                                {employee.irataExpirationDate && (
                                  <div className="ml-6">
                                    {t('dashboard.employees.expires', 'Expires:')} {formatLocalDate(employee.irataExpirationDate)}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Driver's License */}
                            {(employee.driversLicenseNumber || employee.driversLicenseProvince) && (
                              <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <span className="material-icons text-sm">badge</span>
                                  <span>
                                    {t('dashboard.employees.driversLicense', "Driver's License")}: {employee.driversLicenseNumber || 'N/A'}
                                    {employee.driversLicenseProvince && ` (${employee.driversLicenseProvince})`}
                                  </span>
                                </div>
                                {employee.driversLicenseDocuments && employee.driversLicenseDocuments.length > 0 && (
                                  <div className="ml-6">
                                    {t('dashboard.employees.documentsOnFile', '{{count}} document(s) on file', { count: employee.driversLicenseDocuments.length })}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Emergency Contact */}
                            {employee.emergencyContactName && (
                              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <span className="material-icons text-sm">contact_emergency</span>
                                  <span>{t('dashboard.employees.emergency', 'Emergency:')} {employee.emergencyContactName}</span>
                                </div>
                                {employee.emergencyContactPhone && (
                                  <div className="ml-6">{employee.emergencyContactPhone}</div>
                                )}
                              </div>
                            )}

                            {/* Permissions - show for non-company roles */}
                            {employee.role !== "company" && (
                              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                                <div className="flex items-center gap-2 justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="material-icons text-sm">security</span>
                                    <span className="font-medium">{t('employees.permissions', 'Permissions')}</span>
                                  </div>
                                  {user?.role === "company" && employee.id !== user?.id && !userIsReadOnly && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 text-xs px-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEmployeeToEdit(employee);
                                        editEmployeeForm.reset({
                                          name: employee.name ?? "",
                                          email: employee.email ?? "",
                                          role: employee.role,
                                          hourlyRate: employee.hourlyRate != null ? String(employee.hourlyRate) : "",
                                          isSalary: employee.isSalary ?? false,
                                          salary: employee.salary != null ? String(employee.salary) : "",
                                          permissions: employee.permissions || [],
                                          startDate: employee.startDate ?? "",
                                          birthday: employee.birthday ?? "",
                                          socialInsuranceNumber: employee.socialInsuranceNumber ?? "",
                                          driversLicenseNumber: employee.driversLicenseNumber ?? "",
                                          driversLicenseProvince: employee.driversLicenseProvince ?? "",
                                          driversLicenseDocuments: employee.driversLicenseDocuments || [],
                                          homeAddress: employee.homeAddress ?? "",
                                          employeePhoneNumber: employee.employeePhoneNumber ?? "",
                                          emergencyContactName: employee.emergencyContactName ?? "",
                                          emergencyContactPhone: employee.emergencyContactPhone ?? "",
                                          specialMedicalConditions: employee.specialMedicalConditions ?? "",
                                          irataLevel: employee.irataLevel ?? "",
                                          irataLicenseNumber: employee.irataLicenseNumber ?? "",
                                          irataIssuedDate: employee.irataIssuedDate ?? "",
                                          irataExpirationDate: employee.irataExpirationDate ?? "",
                                          spratLevel: employee.spratLevel ?? "",
                                          spratLicenseNumber: employee.spratLicenseNumber ?? "",
                                          spratIssuedDate: employee.spratIssuedDate ?? "",
                                          spratExpirationDate: employee.spratExpirationDate ?? "",
                                          terminatedDate: employee.terminatedDate ?? "",
                                          terminationReason: employee.terminationReason ?? "",
                                          terminationNotes: employee.terminationNotes ?? "",
                                        });
                                        setEditEmployeeFormStep(2);
                                        setShowEditEmployeeDialog(true);
                                      }}
                                      data-testid={`button-update-permissions-${employee.id}`}
                                    >
                                      <span className="material-icons text-xs mr-1">edit</span>
                                      {t('dashboard.employees.updatePermissions', 'Update')}
                                    </Button>
                                  )}
                                </div>
                                {employee.permissions && employee.permissions.length > 0 ? (
                                  <div className="ml-6 flex flex-wrap gap-1 mt-1">
                                    {employee.permissions.map((permId: string) => {
                                      const perm = AVAILABLE_PERMISSIONS.find(p => p.id === permId);
                                      return perm ? (
                                        <Badge 
                                          key={permId} 
                                          variant="outline" 
                                          className="text-[10px] py-0 px-1.5"
                                          data-testid={`badge-permission-${employee.id}-${permId}`}
                                        >
                                          {perm.label}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                ) : (
                                  <div className="ml-6 text-muted-foreground/60 italic">{t('dashboard.employees.noPermissions', 'No permissions assigned')}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })}
                      </div>
                    );
                  })()}
                  </CardContent>
                </Card>

                {/* Inactive Employees - Seat removed but can be reactivated */}
                {(() => {
                  // Check both primary (suspendedAt) and secondary (connectionStatus) suspensions
                  const inactiveEmployees = employees.filter((emp: any) => 
                    (emp.suspendedAt || emp.connectionStatus === 'suspended') && !emp.terminatedDate
                  );
                  
                  if (inactiveEmployees.length > 0) {
                    return (
                      <div className="space-y-2 mt-6">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-amber-600 dark:text-amber-400">
                            {t('dashboard.employees.inactiveEmployees', 'Inactive Employees')}
                          </h3>
                          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                            {inactiveEmployees.length}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('dashboard.employees.inactiveDesc', 'These employees had their seats removed. Purchase a new seat to reactivate them.')}
                        </p>
                        {inactiveEmployees.map((employee: any) => (
                          <Card key={employee.id} data-testid={`inactive-employee-card-${employee.id}`} className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                                    <span className="material-icons text-amber-600 dark:text-amber-400">pause_circle</span>
                                  </div>
                                  <div>
                                    <div className="font-medium">{employee.name || employee.email}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs capitalize">
                                        {employee.role?.replace(/_/g, ' ') || 'Employee'}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {t('dashboard.employees.inactiveSince', 'Inactive since:')} {formatTimestampDate(employee.suspendedAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => reactivateSuspendedMutation.mutate(employee.id)}
                                  disabled={reactivateSuspendedMutation.isPending}
                                  data-testid={`button-reactivate-inactive-${employee.id}`}
                                >
                                  {reactivateSuspendedMutation.isPending ? (
                                    <>
                                      <span className="material-icons text-sm mr-1 animate-spin">sync</span>
                                      {t('dashboard.employees.reactivating', 'Reactivating...')}
                                    </>
                                  ) : (
                                    <>
                                      <span className="material-icons text-sm mr-1">person_add</span>
                                      {t('dashboard.employees.reactivate', 'Reactivate')}
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Terminated Employees */}
                {(() => {
                  const terminatedEmployees = employees.filter((emp: any) => emp.terminatedDate);
                  
                  if (terminatedEmployees.length > 0) {
                    return (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-muted-foreground">{t('dashboard.employees.terminatedEmployees', 'Terminated Employees')}</h3>
                        {terminatedEmployees.map((employee: any) => (
                          <Card key={employee.id} data-testid={`terminated-employee-card-${employee.id}`} className="opacity-60">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Header - Name and Actions */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="font-medium text-lg">{employee.name || employee.companyName || employee.email}</div>
                                    <Badge variant="outline" className="text-xs capitalize mt-1">
                                      {employee.role.replace(/_/g, ' ')}
                                    </Badge>
                                    {employee.terminatedDate && (
                                      <div className="text-xs text-destructive mt-2">
                                        {t('dashboard.employees.terminated', 'Terminated:')} {formatLocalDate(employee.terminatedDate)}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {/* Hide Reactivate and Edit buttons for self-resigned technicians */}
                                    {employee.terminationReason !== "Self-resigned" && (
                                      <>
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={() => reactivateEmployeeMutation.mutate(employee.id)}
                                          data-testid={`button-reactivate-employee-${employee.id}`}
                                          className="h-9"
                                          disabled={userIsReadOnly}
                                        >
                                          <span className="material-icons text-sm mr-1">refresh</span>
                                          {t('dashboard.employees.reactivate', 'Reactivate')}
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleEditEmployee(employee)}
                                          data-testid={`button-edit-terminated-employee-${employee.id}`}
                                          className="h-9 w-9"
                                          disabled={userIsReadOnly}
                                        >
                                          <span className="material-icons text-sm">edit</span>
                                        </Button>
                                      </>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setEmployeeToDelete(employee.id)}
                                      data-testid={`button-unlink-terminated-employee-${employee.id}`}
                                      className="h-9 w-9 text-amber-600 hover:text-amber-700"
                                      disabled={userIsReadOnly}
                                    >
                                      <span className="material-icons text-sm">link_off</span>
                                    </Button>
                                  </div>
                                </div>

                                {/* Termination Details */}
                                {employee.terminationReason && (
                                  <div className="text-xs text-muted-foreground pt-2 border-t">
                                    <div className="font-medium">{t('dashboard.employees.terminationReason', 'Termination Reason:')} {employee.terminationReason}</div>
                                    {employee.terminationNotes && (
                                      <div className="mt-1">{employee.terminationNotes}</div>
                                    )}
                                  </div>
                                )}

                                {/* Contact Info */}
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span className="material-icons text-base">email</span>
                                    {employee.email}
                                  </div>
                                  {employee.employeePhoneNumber && (
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                      <span className="material-icons text-base">phone</span>
                                      {employee.employeePhoneNumber}
                                    </div>
                                  )}
                                </div>

                                {/* Employment Details */}
                                <div className="flex flex-wrap gap-2">
                                  {employee.startDate && (
                                    <Badge variant="outline" className="text-xs">
                                      {t('dashboard.employees.started', 'Started:')} {formatLocalDate(employee.startDate)}
                                    </Badge>
                                  )}
                                  {hasFinancialAccess(user) && (employee.isSalary ? (
                                    employee.salary && (
                                      <Badge variant="outline" className="text-xs">
                                        ${Number(employee.salary).toLocaleString()}/{t('dashboard.employees.year', 'yr')}
                                      </Badge>
                                    )
                                  ) : (
                                    employee.hourlyRate && (
                                      <Badge variant="outline" className="text-xs">
                                        ${employee.hourlyRate}/{t('dashboard.employees.hour', 'hr')}
                                      </Badge>
                                    )
                                  ))}
                                  {employee.techLevel && (
                                    <Badge variant="outline" className="text-xs">
                                      IRATA {employee.techLevel}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-6">
            {/* Harness Inspections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons">verified_user</span>
                  {t('dashboard.documents.harnessInspections', 'Harness Safety Inspections')}
                </CardTitle>
                <CardDescription>
                  {t('dashboard.documents.inspectionRecords', 'Daily harness inspection records - {{count}} total', { count: harnessInspections.length })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {harnessInspections.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <span className="material-icons text-5xl mb-4 opacity-50">folder_open</span>
                    <div className="text-lg mb-2">{t('dashboard.documents.noInspections', 'No Inspections Yet')}</div>
                    <div className="text-sm">
                      {t('dashboard.documents.inspectionsAppear', 'Harness inspections will appear here once submitted')}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {harnessInspections.map((inspection: any) => (
                      <Card 
                        key={inspection.id} 
                        className="shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                        onClick={() => setSelectedInspection(inspection)}
                        data-testid={`inspection-card-${inspection.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{inspection.inspectorName}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatLocalDate(inspection.inspectionDate, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                              {inspection.manufacturer && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {t('dashboard.documents.manufacturer', 'Manufacturer:')} {inspection.manufacturer}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {inspection.lanyardType || 'Standard'}
                              </Badge>
                              <span className="material-icons text-muted-foreground">chevron_right</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Toolbox Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons">assignment</span>
                  {t('dashboard.documents.toolboxMeetings', 'Toolbox Meetings')}
                </CardTitle>
                <CardDescription>
                  {t('dashboard.documents.meetingRecords', 'Safety meeting records - {{count}} total', { count: toolboxMeetings.length })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {toolboxMeetings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <span className="material-icons text-5xl mb-4 opacity-50">folder_open</span>
                    <div className="text-lg mb-2">{t('dashboard.documents.noMeetings', 'No Meetings Yet')}</div>
                    <div className="text-sm">
                      {t('dashboard.documents.meetingsAppear', 'Toolbox meeting records will appear here once submitted')}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {toolboxMeetings.map((meeting: any) => (
                      <Card 
                        key={meeting.id} 
                        className="shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                        onClick={() => setSelectedMeeting(meeting)}
                        data-testid={`meeting-card-${meeting.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">
                                {formatLocalDate(meeting.meetingDate, { 
                                  weekday: 'short', 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {t('dashboard.documents.conductedBy', 'Conducted by:')} {meeting.conductedByName}
                              </div>
                              {meeting.customTopic && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {t('dashboard.documents.customTopic', 'Custom Topic:')} {meeting.customTopic}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {t('dashboard.documents.attendeesCount', '{{count}} attendees', { count: meeting.attendees?.length || 0 })}
                              </Badge>
                              <span className="material-icons text-muted-foreground">chevron_right</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "clients" && (
          <div>
            <div className="space-y-4">
              {/* Add Client Buttons */}
              <div className="flex gap-2">
                <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex-1 h-12 gap-2" 
                      data-testid="button-create-client"
                      disabled={userIsReadOnly || !hasPermission(currentUser, "manage_clients")}
                    >
                      <span className="material-icons">business</span>
                      {t('dashboard.clientDatabase.addNewClient', 'Add New Client')}
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="dialog-add-client">
                  <DialogHeader className="pb-4">
                    <DialogTitle>{t('dashboard.clientDatabase.addNewClient', 'Add New Client')}</DialogTitle>
                    <DialogDescription>{t('dashboard.clientDatabase.clientDescription', 'Enter property manager or building owner details')}</DialogDescription>
                  </DialogHeader>
                  <Form {...clientForm}>
                    <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4">
                      <FormField
                        control={clientForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.clientForm.firstName', 'First Name')}</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} className="h-12" data-testid="input-client-firstname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clientForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.clientForm.lastName', 'Last Name')}</FormLabel>
                            <FormControl>
                              <Input placeholder="Smith" {...field} className="h-12" data-testid="input-client-lastname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clientForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.clientForm.companyOptional', 'Company (Optional)')}</FormLabel>
                            <FormControl>
                              <Input placeholder="ABC Property Management" {...field} className="h-12" data-testid="input-client-company" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clientForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.clientForm.phoneOptional', 'Phone Number (Optional)')}</FormLabel>
                            <FormControl>
                              <Input placeholder="(604) 555-1234" {...field} className="h-12" data-testid="input-client-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clientForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.clientForm.emailOptional', 'Email (Optional)')}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} className="h-12" data-testid="input-client-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clientForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.clientForm.addressOptional', 'Address (Optional)')}</FormLabel>
                            <FormControl>
                              <AddressAutocomplete
                                placeholder="123 Main St, Vancouver, BC"
                                value={field.value || ""}
                                data-testid="input-client-address"
                                onChange={(value) => {
                                  field.onChange(value);
                                  if (sameAsAddress) {
                                    clientForm.setValue("billingAddress", value);
                                  }
                                }}
                                onSelect={(address) => {
                                  field.onChange(address.formatted);
                                  if (sameAsAddress) {
                                    clientForm.setValue("billingAddress", address.formatted);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <label className="text-sm font-medium">{t('dashboard.clientForm.strataPlanNumbers', 'Strata Plan Numbers & Addresses')}</label>
                        {lmsNumbers.map((lms, index) => (
                          <Card key={index} className="p-3">
                            <div className="space-y-3">
                              <div className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.strataNumber', 'Strata Number')}</label>
                                  <Input
                                    placeholder="LMS1234 or VR5678"
                                    value={lms.number}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, number: e.target.value };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-number-${index}`}
                                  />
                                </div>
                                {lmsNumbers.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="mt-5"
                                    onClick={() => {
                                      const newLmsNumbers = lmsNumbers.filter((_, i) => i !== index);
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    data-testid={`button-remove-lms-${index}`}
                                  >
                                    <span className="material-icons">delete</span>
                                  </Button>
                                )}
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.buildingName', 'Building Name (Optional)')}</label>
                                <Input
                                  placeholder="Harbour View Towers"
                                  value={lms.buildingName || ""}
                                  onChange={(e) => {
                                    const newLmsNumbers = [...lmsNumbers];
                                    newLmsNumbers[index] = { ...lms, buildingName: e.target.value };
                                    setLmsNumbers(newLmsNumbers);
                                  }}
                                  className="h-12"
                                  data-testid={`input-client-lms-building-name-${index}`}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.buildingAddress', 'Building Address')}</label>
                                <AddressAutocomplete
                                  placeholder="123 Main St, Vancouver, BC"
                                  value={lms.address}
                                  data-testid={`input-client-lms-address-${index}`}
                                  onChange={(value) => {
                                    const newLmsNumbers = [...lmsNumbers];
                                    newLmsNumbers[index] = { ...lms, address: value };
                                    setLmsNumbers(newLmsNumbers);
                                  }}
                                  onSelect={(address) => {
                                    const newLmsNumbers = [...lmsNumbers];
                                    newLmsNumbers[index] = { ...lms, address: address.formatted };
                                    setLmsNumbers(newLmsNumbers);
                                  }}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.stories', 'Stories')}</label>
                                  <Input
                                    type="number"
                                    placeholder="20"
                                    value={lms.stories || ""}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, stories: e.target.value ? parseInt(e.target.value) : undefined };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-stories-${index}`}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.units', 'Units')}</label>
                                  <Input
                                    type="number"
                                    placeholder="150"
                                    value={lms.units || ""}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, units: e.target.value ? parseInt(e.target.value) : undefined };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-units-${index}`}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.parkingStalls', 'Parking Stalls')}</label>
                                  <Input
                                    type="number"
                                    placeholder="80"
                                    value={lms.parkingStalls || ""}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, parkingStalls: e.target.value ? parseInt(e.target.value) : undefined };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-parking-${index}`}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.dailyDropTarget', 'Daily Drop Target')}</label>
                                  <Input
                                    type="number"
                                    placeholder="40"
                                    value={lms.dailyDropTarget || ""}
                                    onChange={(e) => {
                                      const newLmsNumbers = [...lmsNumbers];
                                      newLmsNumbers[index] = { ...lms, dailyDropTarget: e.target.value ? parseInt(e.target.value) : undefined };
                                      setLmsNumbers(newLmsNumbers);
                                    }}
                                    className="h-12"
                                    data-testid={`input-client-lms-daily-drop-target-${index}`}
                                  />
                                </div>
                              </div>
                              <div className="mt-3">
                                <label className="text-xs text-muted-foreground mb-2 block">{t('dashboard.clientForm.totalDropsPerElevation', 'Total Drops per Elevation')}</label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.north', 'North')}</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={lms.totalDropsNorth || ""}
                                      onChange={(e) => {
                                        const newLmsNumbers = [...lmsNumbers];
                                        newLmsNumbers[index] = { ...lms, totalDropsNorth: e.target.value ? parseInt(e.target.value) : undefined };
                                        setLmsNumbers(newLmsNumbers);
                                      }}
                                      className="h-12"
                                      data-testid={`input-client-lms-drops-north-${index}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.east', 'East')}</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={lms.totalDropsEast || ""}
                                      onChange={(e) => {
                                        const newLmsNumbers = [...lmsNumbers];
                                        newLmsNumbers[index] = { ...lms, totalDropsEast: e.target.value ? parseInt(e.target.value) : undefined };
                                        setLmsNumbers(newLmsNumbers);
                                      }}
                                      className="h-12"
                                      data-testid={`input-client-lms-drops-east-${index}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.south', 'South')}</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={lms.totalDropsSouth || ""}
                                      onChange={(e) => {
                                        const newLmsNumbers = [...lmsNumbers];
                                        newLmsNumbers[index] = { ...lms, totalDropsSouth: e.target.value ? parseInt(e.target.value) : undefined };
                                        setLmsNumbers(newLmsNumbers);
                                      }}
                                      className="h-12"
                                      data-testid={`input-client-lms-drops-south-${index}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.west', 'West')}</label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      value={lms.totalDropsWest || ""}
                                      onChange={(e) => {
                                        const newLmsNumbers = [...lmsNumbers];
                                        newLmsNumbers[index] = { ...lms, totalDropsWest: e.target.value ? parseInt(e.target.value) : undefined };
                                        setLmsNumbers(newLmsNumbers);
                                      }}
                                      className="h-12"
                                      data-testid={`input-client-lms-drops-west-${index}`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newEntry = { number: "", buildingName: "", address: "", stories: undefined, units: undefined, parkingStalls: undefined, dailyDropTarget: undefined, totalDropsNorth: undefined, totalDropsEast: undefined, totalDropsSouth: undefined, totalDropsWest: undefined };
                            setLmsNumbers(prev => [...prev, newEntry]);
                            setTimeout(() => {
                              const dialog = document.querySelector('[data-testid="dialog-add-client"]');
                              if (dialog) {
                                dialog.scrollTop = dialog.scrollHeight;
                              }
                            }, 100);
                          }}
                          className="w-full"
                          data-testid="button-add-lms"
                        >
                          <span className="material-icons text-sm mr-1">add</span>
                          {t('dashboard.clientForm.addAnotherStrata', 'Add Another Strata Number')} ({lmsNumbers.length})
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sameAsAddress"
                            checked={sameAsAddress}
                            onCheckedChange={(checked) => {
                              setSameAsAddress(checked as boolean);
                              if (checked) {
                                clientForm.setValue("billingAddress", clientForm.getValues("address") || "");
                              } else {
                                clientForm.setValue("billingAddress", "");
                              }
                            }}
                            data-testid="checkbox-same-as-address"
                          />
                          <label
                            htmlFor="sameAsAddress"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t('dashboard.clientForm.billingSameAsAddress', 'Billing address same as address')}
                          </label>
                        </div>

                        <FormField
                          control={clientForm.control}
                          name="billingAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.clientForm.billingAddressOptional', 'Billing Address (Optional)')}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="456 Billing Ave, Vancouver, BC" 
                                  {...field} 
                                  disabled={sameAsAddress}
                                  data-testid="input-client-billing-address"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full h-12" disabled={createClientMutation.isPending} data-testid="button-submit-client">
                        {createClientMutation.isPending ? t('dashboard.clientForm.creating', 'Creating...') : t('dashboard.clientForm.createClient', 'Create Client')}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
                </Dialog>
                
                {/* Scan Business Card Button - Company owners only */}
                {currentUser?.role === "company" && (
                  <Button 
                    variant="outline"
                    className="h-12 gap-2" 
                    onClick={() => setShowBusinessCardScanner(true)}
                    data-testid="button-scan-business-card"
                    disabled={userIsReadOnly || !hasPermission(currentUser, "manage_clients")}
                  >
                    <span className="material-icons">photo_camera</span>
                    {t('dashboard.clientDatabase.scanCard', 'Scan Business Card')}
                  </Button>
                )}
                
                {/* Excel Import Button */}
                {currentUser?.role === "company" && (
                  <ClientExcelImport
                    disabled={userIsReadOnly || !hasPermission(currentUser, "manage_clients")}
                    onImportComplete={() => queryClient.invalidateQueries({ queryKey: ["/api/clients"] })}
                  />
                )}

                {/* Search Property Manager Button */}
                {(currentUser?.role === "company" || currentUser?.role === "employee") && (
                  <Button 
                    variant="outline"
                    className="h-12 gap-2" 
                    onClick={() => {
                      setPMSearchQuery("");
                      setPMSearchResults([]);
                      setShowPMSearchDialog(true);
                    }}
                    data-testid="button-search-pm"
                    disabled={userIsReadOnly || !hasPermission(currentUser, "manage_clients")}
                  >
                    <span className="material-icons">person_search</span>
                    {t('dashboard.clientDatabase.searchPM', 'Find Property Manager')}
                  </Button>
                )}
              </div>

              {/* Business Card Scanner Dialog */}
              <BusinessCardScanner 
                open={showBusinessCardScanner}
                onOpenChange={setShowBusinessCardScanner}
                onScanComplete={(data) => {
                  // Pre-populate the client form with scanned data
                  clientForm.reset({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    company: data.company || "",
                    email: data.email || "",
                    phoneNumber: data.phone || data.mobile || "",
                    address: data.address || "",
                    billingAddress: "",
                  });
                  // Open the client dialog with pre-filled data
                  setShowClientDialog(true);
                }}
              />

              {/* Property Manager Search Dialog */}
              <Dialog open={showPMSearchDialog} onOpenChange={setShowPMSearchDialog}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <span className="material-icons text-primary">person_search</span>
                      {t('dashboard.pmSearch.title', 'Find Property Manager')}
                    </DialogTitle>
                    <DialogDescription>
                      {t('dashboard.pmSearch.description', 'Search by PM code, name, or email to link them to your company')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        search
                      </span>
                      <Input
                        placeholder={t('dashboard.pmSearch.placeholder', 'Enter PM code, name, or email...')}
                        value={pmSearchQuery}
                        onChange={async (e) => {
                          const query = e.target.value;
                          setPMSearchQuery(query);
                          
                          if (query.trim().length < 2) {
                            setPMSearchResults([]);
                            return;
                          }
                          
                          setPMSearchLoading(true);
                          try {
                            const response = await fetch(`/api/property-managers/search?q=${encodeURIComponent(query)}`);
                            if (response.ok) {
                              const data = await response.json();
                              setPMSearchResults(data.results || []);
                            }
                          } catch (error) {
                            console.error("PM search error:", error);
                          } finally {
                            setPMSearchLoading(false);
                          }
                        }}
                        className="h-10 pl-10"
                        data-testid="input-search-pm"
                      />
                    </div>
                    
                    {pmSearchLoading && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        {t('dashboard.pmSearch.searching', 'Searching...')}
                      </div>
                    )}
                    
                    {!pmSearchLoading && pmSearchQuery.length >= 2 && pmSearchResults.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <span className="material-icons text-3xl mb-2 block">search_off</span>
                        <p className="text-sm">{t('dashboard.pmSearch.noResults', 'No property managers found')}</p>
                      </div>
                    )}
                    
                    {pmSearchResults.length > 0 && (
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {pmSearchResults.map((pm) => (
                          <div 
                            key={pm.id} 
                            className="p-3 border rounded-md hover-elevate"
                            data-testid={`pm-result-${pm.id}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{pm.name || pm.email}</p>
                                {pm.company && (
                                  <p className="text-sm text-muted-foreground truncate">{pm.company}</p>
                                )}
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {pm.pmCode && (
                                    <Badge variant="outline" className="font-mono text-xs">
                                      {pm.pmCode}
                                    </Badge>
                                  )}
                                  {pm.email && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <span className="material-icons text-xs">mail</span>
                                      {pm.email}
                                    </span>
                                  )}
                                  {pm.phone && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <span className="material-icons text-xs">phone</span>
                                      {pm.phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {pm.isLinked ? (
                                <Badge variant="secondary" className="shrink-0">
                                  <span className="material-icons text-xs mr-1">check_circle</span>
                                  {t('dashboard.pmSearch.linked', 'Linked')}
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      const response = await apiRequest("POST", `/api/property-managers/${pm.id}/link`);
                                      if (response.ok) {
                                        toast({
                                          title: t('dashboard.pmSearch.linkSuccess', 'Property Manager Linked'),
                                          description: t('dashboard.pmSearch.linkSuccessDesc', '{{name}} has been linked and added to your client database', { name: pm.name || pm.email }),
                                        });
                                        // Invalidate clients query to refresh the list
                                        queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
                                        // Update local state to show as linked
                                        setPMSearchResults(prev => 
                                          prev.map(p => p.id === pm.id ? { ...p, isLinked: true } : p)
                                        );
                                      } else {
                                        const error = await response.json();
                                        toast({
                                          title: t('dashboard.pmSearch.linkError', 'Link Failed'),
                                          description: error.message || t('dashboard.pmSearch.linkErrorDesc', 'Could not link property manager'),
                                          variant: "destructive",
                                        });
                                      }
                                    } catch (error) {
                                      console.error("Link PM error:", error);
                                      toast({
                                        title: t('dashboard.pmSearch.linkError', 'Link Failed'),
                                        description: t('dashboard.pmSearch.linkErrorDesc', 'Could not link property manager'),
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  data-testid={`button-link-pm-${pm.id}`}
                                >
                                  <span className="material-icons text-sm mr-1">link</span>
                                  {t('dashboard.pmSearch.link', 'Link')}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Clients List */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="material-icons text-primary">business</span>
                        {t('dashboard.clientDatabase.title', 'Client Database')}
                      </CardTitle>
                      <CardDescription>{t('dashboard.clientDatabase.description', 'Property managers and building contacts')}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={clientViewMode === "cards" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setClientViewMode("cards")}
                        data-testid="button-view-cards"
                      >
                        <span className="material-icons text-sm">grid_view</span>
                      </Button>
                      <Button
                        variant={clientViewMode === "table" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setClientViewMode("table")}
                        data-testid="button-view-table"
                      >
                        <span className="material-icons text-sm">view_list</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        search
                      </span>
                      <Input
                        placeholder={t('dashboard.clientDatabase.searchPlaceholder', 'Search by name, company, strata number, or address...')}
                        value={clientSearchQuery}
                        onChange={(e) => setClientSearchQuery(e.target.value)}
                        className="h-10 pl-10"
                        data-testid="input-search-clients"
                      />
                    </div>
                    <Select value={clientSortField} onValueChange={(v) => setClientSortField(v as any)}>
                      <SelectTrigger className="w-full sm:w-40" data-testid="select-sort-field">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">{t('dashboard.clientDatabase.sortName', 'Name')}</SelectItem>
                        <SelectItem value="company">{t('dashboard.clientDatabase.sortCompany', 'Company')}</SelectItem>
                        <SelectItem value="email">{t('dashboard.clientDatabase.sortEmail', 'Email')}</SelectItem>
                        <SelectItem value="phone">{t('dashboard.clientDatabase.sortPhone', 'Phone')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setClientSortDirection(d => d === "asc" ? "desc" : "asc")}
                      data-testid="button-toggle-sort-direction"
                    >
                      <span className="material-icons text-sm">
                        {clientSortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                      </span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {clientsLoading ? (
                    <p className="text-sm text-muted-foreground">{t('dashboard.clientDatabase.loading', 'Loading clients...')}</p>
                  ) : !clientsData || clientsData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('dashboard.clientDatabase.noClients', 'No clients yet. Add your first client to get started.')}</p>
                  ) : (
                    <>
                      {/* Table View */}
                      {clientViewMode === "table" && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead 
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => {
                                  if (clientSortField === "name") {
                                    setClientSortDirection(d => d === "asc" ? "desc" : "asc");
                                  } else {
                                    setClientSortField("name");
                                    setClientSortDirection("asc");
                                  }
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  {t('dashboard.clientDatabase.columnName', 'Name')}
                                  {clientSortField === "name" && (
                                    <span className="material-icons text-xs">
                                      {clientSortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                                    </span>
                                  )}
                                </div>
                              </TableHead>
                              <TableHead 
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => {
                                  if (clientSortField === "company") {
                                    setClientSortDirection(d => d === "asc" ? "desc" : "asc");
                                  } else {
                                    setClientSortField("company");
                                    setClientSortDirection("asc");
                                  }
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  {t('dashboard.clientDatabase.columnCompany', 'Company')}
                                  {clientSortField === "company" && (
                                    <span className="material-icons text-xs">
                                      {clientSortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                                    </span>
                                  )}
                                </div>
                              </TableHead>
                              <TableHead 
                                className="cursor-pointer hover:bg-muted/50 hidden md:table-cell"
                                onClick={() => {
                                  if (clientSortField === "email") {
                                    setClientSortDirection(d => d === "asc" ? "desc" : "asc");
                                  } else {
                                    setClientSortField("email");
                                    setClientSortDirection("asc");
                                  }
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  {t('dashboard.clientDatabase.columnEmail', 'Email')}
                                  {clientSortField === "email" && (
                                    <span className="material-icons text-xs">
                                      {clientSortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                                    </span>
                                  )}
                                </div>
                              </TableHead>
                              <TableHead 
                                className="cursor-pointer hover:bg-muted/50 hidden lg:table-cell"
                                onClick={() => {
                                  if (clientSortField === "phone") {
                                    setClientSortDirection(d => d === "asc" ? "desc" : "asc");
                                  } else {
                                    setClientSortField("phone");
                                    setClientSortDirection("asc");
                                  }
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  {t('dashboard.clientDatabase.columnPhone', 'Phone')}
                                  {clientSortField === "phone" && (
                                    <span className="material-icons text-xs">
                                      {clientSortDirection === "asc" ? "arrow_upward" : "arrow_downward"}
                                    </span>
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="hidden xl:table-cell">{t('dashboard.clientDatabase.columnBuildings', 'Buildings')}</TableHead>
                              <TableHead className="text-right">{t('dashboard.clientDatabase.columnActions', 'Actions')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {clientsData
                              .filter(client => {
                                if (!clientSearchQuery) return true;
                                const query = clientSearchQuery.toLowerCase();
                                return (
                                  client.firstName.toLowerCase().includes(query) ||
                                  client.lastName.toLowerCase().includes(query) ||
                                  client.company?.toLowerCase().includes(query) ||
                                  client.lmsNumbers?.some(lms => 
                                    lms.number.toLowerCase().includes(query) ||
                                    lms.address?.toLowerCase().includes(query)
                                  )
                                );
                              })
                              .sort((a, b) => {
                                let aVal = "";
                                let bVal = "";
                                switch (clientSortField) {
                                  case "name":
                                    aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
                                    bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
                                    break;
                                  case "company":
                                    aVal = (a.company || "").toLowerCase();
                                    bVal = (b.company || "").toLowerCase();
                                    break;
                                  case "email":
                                    aVal = (a.email || "").toLowerCase();
                                    bVal = (b.email || "").toLowerCase();
                                    break;
                                  case "phone":
                                    aVal = (a.phoneNumber || "").toLowerCase();
                                    bVal = (b.phoneNumber || "").toLowerCase();
                                    break;
                                }
                                if (clientSortDirection === "asc") {
                                  return aVal.localeCompare(bVal);
                                } else {
                                  return bVal.localeCompare(aVal);
                                }
                              })
                              .map((client) => (
                              <TableRow 
                                key={client.id} 
                                className="cursor-pointer"
                                onClick={() => {
                                  setClientToView(client);
                                  setShowClientDetailDialog(true);
                                }}
                                data-testid={`table-row-client-${client.id}`}
                              >
                                <TableCell className="font-medium">
                                  {client.firstName} {client.lastName}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {client.company || "-"}
                                </TableCell>
                                <TableCell className="text-muted-foreground hidden md:table-cell">
                                  {client.email || "-"}
                                </TableCell>
                                <TableCell className="text-muted-foreground hidden lg:table-cell">
                                  {client.phoneNumber || "-"}
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                  {client.lmsNumbers && client.lmsNumbers.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {client.lmsNumbers.slice(0, 2).map((lms, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {lms.number}
                                        </Badge>
                                      ))}
                                      {client.lmsNumbers.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{client.lmsNumbers.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {hasPermission(currentUser, "manage_clients") && !userIsReadOnly && (
                                    <div className="flex justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.stopPropagation(); handleEditClient(client); }}
                                        data-testid={`button-edit-client-${client.id}`}
                                      >
                                        <span className="material-icons text-sm">edit</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteClient(client); }}
                                        data-testid={`button-delete-client-${client.id}`}
                                      >
                                        <span className="material-icons text-destructive text-sm">delete</span>
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}

                      {/* Cards View */}
                      {clientViewMode === "cards" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {clientsData
                            .filter(client => {
                              if (!clientSearchQuery) return true;
                              const query = clientSearchQuery.toLowerCase();
                              return (
                                client.firstName.toLowerCase().includes(query) ||
                                client.lastName.toLowerCase().includes(query) ||
                                client.company?.toLowerCase().includes(query) ||
                                client.lmsNumbers?.some(lms => 
                                  lms.number.toLowerCase().includes(query) ||
                                  lms.address?.toLowerCase().includes(query)
                                )
                              );
                            })
                            .sort((a, b) => {
                              let aVal = "";
                              let bVal = "";
                              switch (clientSortField) {
                                case "name":
                                  aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
                                  bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
                                  break;
                                case "company":
                                  aVal = (a.company || "").toLowerCase();
                                  bVal = (b.company || "").toLowerCase();
                                  break;
                                case "email":
                                  aVal = (a.email || "").toLowerCase();
                                  bVal = (b.email || "").toLowerCase();
                                  break;
                                case "phone":
                                  aVal = (a.phoneNumber || "").toLowerCase();
                                  bVal = (b.phoneNumber || "").toLowerCase();
                                  break;
                              }
                              if (clientSortDirection === "asc") {
                                return aVal.localeCompare(bVal);
                              } else {
                                return bVal.localeCompare(aVal);
                              }
                            })
                            .map((client) => (
                            <Card 
                              key={client.id} 
                              className="shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer" 
                              data-testid={`client-card-${client.id}`}
                              onClick={() => {
                                setClientToView(client);
                                setShowClientDetailDialog(true);
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-base mb-1 truncate">
                                      {client.firstName} {client.lastName}
                                    </div>
                                    {client.company && (
                                      <div className="text-sm text-muted-foreground mb-1 truncate">
                                        {client.company}
                                      </div>
                                    )}
                                    {client.phoneNumber && (
                                      <div className="text-sm text-muted-foreground mb-1">
                                        {client.phoneNumber}
                                      </div>
                                    )}
                                    {client.email && (
                                      <div className="text-sm text-muted-foreground mb-1 truncate">
                                        {client.email}
                                      </div>
                                    )}
                                    {client.lmsNumbers && client.lmsNumbers.length > 0 && (
                                      <div className="space-y-2 mt-2">
                                        {client.lmsNumbers.slice(0, 2).map((lms, idx) => (
                                          <div key={idx} className="text-sm">
                                            {lms.buildingName && (
                                              <div className="text-sm font-medium mb-1 truncate">{lms.buildingName}</div>
                                            )}
                                            <Badge variant="secondary" className="text-xs mr-2">
                                              {lms.number}
                                            </Badge>
                                            {lms.address && (
                                              <span className="text-muted-foreground text-sm">{lms.address}</span>
                                            )}
                                          </div>
                                        ))}
                                        {client.lmsNumbers.length > 2 && (
                                          <Badge variant="outline" className="text-xs">
                                            +{client.lmsNumbers.length - 2} more
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {hasPermission(currentUser, "manage_clients") && !userIsReadOnly && (
                                    <div className="flex gap-1 ml-2 flex-shrink-0">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.stopPropagation(); handleEditClient(client); }}
                                        data-testid={`button-edit-client-card-${client.id}`}
                                      >
                                        <span className="material-icons">edit</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteClient(client); }}
                                        data-testid={`button-delete-client-card-${client.id}`}
                                      >
                                        <span className="material-icons text-destructive">delete</span>
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={showEditClientDialog} onOpenChange={setShowEditClientDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="dialog-edit-client">
          <DialogHeader className="pb-4">
            <DialogTitle>{t('dashboard.clientForm.editClient', 'Edit Client')}</DialogTitle>
            <DialogDescription>{t('dashboard.clientForm.editClientDescription', 'Update property manager or building owner details')}</DialogDescription>
          </DialogHeader>
          <Form {...editClientForm}>
            <form onSubmit={editClientForm.handleSubmit(onEditClientSubmit)} className="space-y-4">
              <FormField
                control={editClientForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.clientForm.firstName', 'First Name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} className="h-12" data-testid="input-edit-client-firstname" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editClientForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.clientForm.lastName', 'Last Name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Smith" {...field} className="h-12" data-testid="input-edit-client-lastname" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editClientForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.clientForm.companyOptional', 'Company (Optional)')}</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC Property Management" {...field} className="h-12" data-testid="input-edit-client-company" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editClientForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.clientForm.phoneOptional', 'Phone Number (Optional)')}</FormLabel>
                    <FormControl>
                      <Input placeholder="(604) 555-1234" {...field} className="h-12" data-testid="input-edit-client-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editClientForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.clientForm.emailOptional', 'Email (Optional)')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} className="h-12" data-testid="input-edit-client-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editClientForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.clientForm.addressOptional', 'Address (Optional)')}</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        placeholder="123 Main St, Vancouver, BC"
                        value={field.value || ""}
                        data-testid="input-edit-client-address"
                        onChange={(value) => {
                          field.onChange(value);
                          if (editSameAsAddress) {
                            editClientForm.setValue("billingAddress", value);
                          }
                        }}
                        onSelect={(address) => {
                          field.onChange(address.formatted);
                          if (editSameAsAddress) {
                            editClientForm.setValue("billingAddress", address.formatted);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <label className="text-sm font-medium">{t('dashboard.clientForm.strataPlanNumbers', 'Strata Plan Numbers & Addresses')}</label>
                {editLmsNumbers.map((lms, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-3">
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.strataNumber', 'Strata Number')}</label>
                          <Input
                            placeholder="LMS1234 or VR5678"
                            value={lms.number}
                            onChange={(e) => {
                              const newLmsNumbers = [...editLmsNumbers];
                              newLmsNumbers[index] = { ...lms, number: e.target.value };
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            className="h-12"
                            data-testid={`input-edit-client-lms-number-${index}`}
                          />
                        </div>
                        {editLmsNumbers.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="mt-5"
                            onClick={() => {
                              const newLmsNumbers = editLmsNumbers.filter((_, i) => i !== index);
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            data-testid={`button-edit-remove-lms-${index}`}
                          >
                            <span className="material-icons">delete</span>
                          </Button>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.buildingNameOptional', 'Building Name (Optional)')}</label>
                        <Input
                          placeholder="Harbour View Towers"
                          value={lms.buildingName || ""}
                          onChange={(e) => {
                            const newLmsNumbers = [...editLmsNumbers];
                            newLmsNumbers[index] = { ...lms, buildingName: e.target.value };
                            setEditLmsNumbers(newLmsNumbers);
                          }}
                          className="h-12"
                          data-testid={`input-edit-client-lms-building-name-${index}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.buildingAddress', 'Building Address')}</label>
                        <AddressAutocomplete
                          placeholder="123 Main St, Vancouver, BC"
                          value={lms.address}
                          data-testid={`input-edit-client-lms-address-${index}`}
                          onChange={(value) => {
                            const newLmsNumbers = [...editLmsNumbers];
                            newLmsNumbers[index] = { ...lms, address: value };
                            setEditLmsNumbers(newLmsNumbers);
                          }}
                          onSelect={(address) => {
                            const newLmsNumbers = [...editLmsNumbers];
                            newLmsNumbers[index] = { ...lms, address: address.formatted };
                            setEditLmsNumbers(newLmsNumbers);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.stories', 'Stories')}</label>
                          <Input
                            type="number"
                            placeholder="20"
                            value={lms.stories || ""}
                            onChange={(e) => {
                              const newLmsNumbers = [...editLmsNumbers];
                              newLmsNumbers[index] = { ...lms, stories: e.target.value ? parseInt(e.target.value) : undefined };
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            className="h-12"
                            data-testid={`input-edit-client-lms-stories-${index}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.units', 'Units')}</label>
                          <Input
                            type="number"
                            placeholder="150"
                            value={lms.units || ""}
                            onChange={(e) => {
                              const newLmsNumbers = [...editLmsNumbers];
                              newLmsNumbers[index] = { ...lms, units: e.target.value ? parseInt(e.target.value) : undefined };
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            className="h-12"
                            data-testid={`input-edit-client-lms-units-${index}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.parkingStalls', 'Parking Stalls')}</label>
                          <Input
                            type="number"
                            placeholder="80"
                            value={lms.parkingStalls || ""}
                            onChange={(e) => {
                              const newLmsNumbers = [...editLmsNumbers];
                              newLmsNumbers[index] = { ...lms, parkingStalls: e.target.value ? parseInt(e.target.value) : undefined };
                              setEditLmsNumbers(newLmsNumbers);
                            }}
                            className="h-12"
                            data-testid={`input-edit-client-lms-parking-${index}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.dailyDropTarget', 'Daily Drop Target')}</label>
                        <Input
                          type="number"
                          placeholder="40"
                          value={lms.dailyDropTarget || ""}
                          onChange={(e) => {
                            const newLmsNumbers = [...editLmsNumbers];
                            newLmsNumbers[index] = { ...lms, dailyDropTarget: e.target.value ? parseInt(e.target.value) : undefined };
                            setEditLmsNumbers(newLmsNumbers);
                          }}
                          className="h-12"
                          data-testid={`input-edit-client-lms-daily-drop-target-${index}`}
                        />
                      </div>
                      <div className="mt-3">
                        <label className="text-xs text-muted-foreground mb-2 block">{t('dashboard.clientForm.totalDropsPerElevation', 'Total Drops per Elevation')}</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.north', 'North')}</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={lms.totalDropsNorth || ""}
                              onChange={(e) => {
                                const newLmsNumbers = [...editLmsNumbers];
                                newLmsNumbers[index] = { ...lms, totalDropsNorth: e.target.value ? parseInt(e.target.value) : undefined };
                                setEditLmsNumbers(newLmsNumbers);
                              }}
                              className="h-12"
                              data-testid={`input-edit-client-lms-drops-north-${index}`}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.east', 'East')}</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={lms.totalDropsEast || ""}
                              onChange={(e) => {
                                const newLmsNumbers = [...editLmsNumbers];
                                newLmsNumbers[index] = { ...lms, totalDropsEast: e.target.value ? parseInt(e.target.value) : undefined };
                                setEditLmsNumbers(newLmsNumbers);
                              }}
                              className="h-12"
                              data-testid={`input-edit-client-lms-drops-east-${index}`}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.south', 'South')}</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={lms.totalDropsSouth || ""}
                              onChange={(e) => {
                                const newLmsNumbers = [...editLmsNumbers];
                                newLmsNumbers[index] = { ...lms, totalDropsSouth: e.target.value ? parseInt(e.target.value) : undefined };
                                setEditLmsNumbers(newLmsNumbers);
                              }}
                              className="h-12"
                              data-testid={`input-edit-client-lms-drops-south-${index}`}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">{t('dashboard.clientForm.west', 'West')}</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={lms.totalDropsWest || ""}
                              onChange={(e) => {
                                const newLmsNumbers = [...editLmsNumbers];
                                newLmsNumbers[index] = { ...lms, totalDropsWest: e.target.value ? parseInt(e.target.value) : undefined };
                                setEditLmsNumbers(newLmsNumbers);
                              }}
                              className="h-12"
                              data-testid={`input-edit-client-lms-drops-west-${index}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newEntry = { number: "", buildingName: "", address: "", stories: undefined, units: undefined, parkingStalls: undefined, dailyDropTarget: undefined, totalDropsNorth: undefined, totalDropsEast: undefined, totalDropsSouth: undefined, totalDropsWest: undefined };
                    setEditLmsNumbers(prev => [...prev, newEntry]);
                    setTimeout(() => {
                      const dialog = document.querySelector('[data-testid="dialog-edit-client"]');
                      if (dialog) {
                        dialog.scrollTop = dialog.scrollHeight;
                      }
                    }, 100);
                  }}
                  className="w-full"
                  data-testid="button-edit-add-lms"
                >
                  <span className="material-icons text-sm mr-1">add</span>
                  {t('dashboard.clientForm.addAnotherStrata', 'Add Another Strata Number')} ({editLmsNumbers.length})
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editSameAsAddress"
                    checked={editSameAsAddress}
                    onCheckedChange={(checked) => {
                      setEditSameAsAddress(checked as boolean);
                      if (checked) {
                        editClientForm.setValue("billingAddress", editClientForm.getValues("address") || "");
                      } else {
                        editClientForm.setValue("billingAddress", "");
                      }
                    }}
                    data-testid="checkbox-edit-same-as-address"
                  />
                  <label
                    htmlFor="editSameAsAddress"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('dashboard.clientForm.billingSameAsAddress', 'Billing address same as address')}
                  </label>
                </div>

                <FormField
                  control={editClientForm.control}
                  name="billingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.clientForm.billingAddressOptional', 'Billing Address (Optional)')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="456 Billing Ave, Vancouver, BC" 
                          {...field} 
                          disabled={editSameAsAddress}
                          data-testid="input-edit-client-billing-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full h-12" disabled={editClientMutation.isPending} data-testid="button-submit-edit-client">
                {editClientMutation.isPending ? t('common.updating', 'Updating...') : t('dashboard.clientForm.updateClient', 'Update Client')}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Client Detail Dialog */}
      <Dialog open={showClientDetailDialog} onOpenChange={setShowClientDetailDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" data-testid="dialog-client-detail">
          <DialogHeader className="pb-4">
            <DialogTitle>{clientToView?.firstName} {clientToView?.lastName}</DialogTitle>
            <DialogDescription>{clientToView?.company || t('dashboard.clientDetail.noCompany', 'No company specified')}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Contact Information */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">{t('dashboard.clientDetail.contactInfo', 'Contact Information')}</h4>
              {clientToView?.email && (
                <div className="flex items-center gap-2">
                  <span className="material-icons text-muted-foreground text-sm">email</span>
                  <a href={`mailto:${clientToView.email}`} className="text-sm text-primary hover:underline">{clientToView.email}</a>
                </div>
              )}
              {clientToView?.phoneNumber && (
                <div className="flex items-center gap-2">
                  <span className="material-icons text-muted-foreground text-sm">phone</span>
                  <a href={`tel:${clientToView.phoneNumber}`} className="text-sm text-primary hover:underline">{clientToView.phoneNumber}</a>
                </div>
              )}
              {clientToView?.address && (
                <div className="flex items-start gap-2">
                  <span className="material-icons text-muted-foreground text-sm">location_on</span>
                  <span className="text-sm">{clientToView.address}</span>
                </div>
              )}
              {clientToView?.billingAddress && clientToView.billingAddress !== clientToView.address && (
                <div className="flex items-start gap-2">
                  <span className="material-icons text-muted-foreground text-sm">receipt</span>
                  <div>
                    <span className="text-xs text-muted-foreground">{t('dashboard.clientDetail.billingAddress', 'Billing:')}</span>
                    <span className="text-sm ml-1">{clientToView.billingAddress}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Buildings / Strata Numbers */}
            {clientToView?.lmsNumbers && clientToView.lmsNumbers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">{t('dashboard.clientDetail.buildings', 'Buildings')}</h4>
                <div className="space-y-3">
                  {clientToView.lmsNumbers.map((lms, idx) => (
                    <Card key={idx} className="p-3">
                      <div className="space-y-1">
                        {lms.buildingName && (
                          <div className="font-medium text-sm">{lms.buildingName}</div>
                        )}
                        <Badge variant="secondary" className="text-xs">{lms.number}</Badge>
                        {lms.address && (
                          <div className="text-sm text-muted-foreground">{lms.address}</div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {lms.stories && (
                            <span className="text-sm text-muted-foreground">{lms.stories} {t('dashboard.clientDetail.floors', 'floors')}</span>
                          )}
                          {lms.units && (
                            <span className="text-sm text-muted-foreground">{lms.units} {t('dashboard.clientDetail.units', 'units')}</span>
                          )}
                          {lms.parkingStalls && (
                            <span className="text-sm text-muted-foreground">{lms.parkingStalls} {t('dashboard.clientDetail.parkingStalls', 'parking stalls')}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {hasPermission(currentUser, "manage_clients") && !userIsReadOnly && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowClientDetailDialog(false);
                    if (clientToView) handleEditClient(clientToView);
                  }}
                  data-testid="button-detail-edit-client"
                >
                  <span className="material-icons text-sm mr-1">edit</span>
                  {t('common.edit', 'Edit')}
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => {
                    setShowClientDetailDialog(false);
                    if (clientToView) handleDeleteClient(clientToView);
                  }}
                  data-testid="button-detail-delete-client"
                >
                  <span className="material-icons text-sm mr-1">delete</span>
                  {t('common.delete', 'Delete')}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Client Confirmation Dialog */}
      <AlertDialog open={showDeleteClientDialog} onOpenChange={setShowDeleteClientDialog}>
        <AlertDialogContent data-testid="dialog-delete-client">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.clientForm.deleteClient', 'Delete Client')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.clientForm.deleteConfirmation', 'Are you sure you want to delete {{firstName}} {{lastName}}? This action cannot be undone.', { firstName: clientToDelete?.firstName, lastName: clientToDelete?.lastName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-client">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-client"
            >
              {deleteClientMutation.isPending ? t('common.deleting', 'Deleting...') : t('common.delete', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditEmployeeDialog} onOpenChange={(open) => { setShowEditEmployeeDialog(open); if (!open) setEditEmployeeFormStep(1); }}>
        <DialogContent className="max-w-2xl p-0 max-h-[95vh] flex flex-col">
          <div className="p-6 border-b">
            <DialogHeader>
              <DialogTitle>
                {editEmployeeFormStep === 1 ? t('dashboard.employeeForm.title', 'Employee Information') : t('dashboard.employeeForm.permissionsTitle', 'Permissions')}
              </DialogTitle>
              <DialogDescription>
                {editEmployeeFormStep === 1 ? t('dashboard.employeeForm.step1Edit', 'Step 1 of 2: Update employee details') : t('dashboard.employeeForm.step2', 'Step 2 of 2: Configure access permissions')}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="overflow-y-auto flex-1 p-6">
            <Form {...editEmployeeForm}>
              <form id="edit-employee-form" onSubmit={editEmployeeForm.handleSubmit(onEditEmployeeSubmit)} className="space-y-4">
              <div className={editEmployeeFormStep === 1 ? "block" : "hidden pointer-events-none"}>
                <FormField
                  control={editEmployeeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.employeeForm.fullName', 'Full Name')}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="h-12" data-testid="input-edit-employee-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editEmployeeForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.employeeForm.emailAddress', 'Email Address')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} className="h-12" data-testid="input-edit-employee-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editEmployeeForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t('dashboard.employeeForm.role', 'Role')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-3"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <FormItem key={role.value}>
                              <FormControl>
                                <div className="relative">
                                  <RadioGroupItem
                                    value={role.value}
                                    id={`edit-role-${role.value}`}
                                    className="peer sr-only"
                                    data-testid={`radio-edit-role-${role.value}`}
                                  />
                                  <FormLabel
                                    htmlFor={`edit-role-${role.value}`}
                                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-background p-3 hover-elevate active-elevate-2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                  >
                                    <span className="material-icons text-2xl text-primary">
                                      {role.icon}
                                    </span>
                                    <span className="text-xs font-medium text-center leading-tight">
                                      {t(role.labelKey, role.label)}
                                    </span>
                                  </FormLabel>
                                </div>
                              </FormControl>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {editEmployeeForm.watch("role") === "rope_access_tech" && (
                  <FormField
                    control={editEmployeeForm.control}
                    name="techLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dashboard.employeeForm.irataLevel', 'IRATA Level')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12" data-testid="select-edit-tech-level">
                              <SelectValue placeholder={t('dashboard.employeeForm.selectLevel', 'Select level')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Level 1">{t('employees.irataLevels.level1Short', 'Level 1')}</SelectItem>
                            <SelectItem value="Level 2">{t('employees.irataLevels.level2Short', 'Level 2')}</SelectItem>
                            <SelectItem value="Level 3">{t('employees.irataLevels.level3Short', 'Level 3')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={editEmployeeForm.control}
                  name="isSalary"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{t('dashboard.employeeForm.isSalary', 'Salary Employee')}</FormLabel>
                        <FormDescription className="text-xs">
                          {t('dashboard.employeeForm.isSalaryDescription', 'Toggle on for salaried employees instead of hourly')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-edit-employee-is-salary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {editEmployeeForm.watch("isSalary") ? (
                  <FormField
                    control={editEmployeeForm.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dashboard.employeeForm.salary', 'Annual Salary ($)')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="1" 
                            min="0" 
                            placeholder="50000" 
                            {...field} 
                            data-testid="input-edit-employee-salary" 
                            className="h-12" 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {t('dashboard.employeeForm.salaryDescription', 'Annual salary amount')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={editEmployeeForm.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dashboard.employeeForm.hourlyRate', 'Hourly Rate ($/hr)')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="25.00" 
                            {...field} 
                            data-testid="input-edit-employee-hourly-rate" 
                            className="h-12" 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {t('dashboard.employeeForm.hourlyRateDescription', 'Optional - for labor cost calculations')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="border-t pt-4 mt-6">
                  <h3 className="text-sm font-medium mb-4">{t('dashboard.employeeForm.personalDetails', 'Personal Details (Optional)')}</h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={editEmployeeForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.startDate', 'Start Date')}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-edit-employee-start-date" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="birthday"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.birthday', 'Birthday')}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-edit-employee-birthday" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="socialInsuranceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.socialInsuranceNumber', 'Social Insurance Number')}</FormLabel>
                          <FormControl>
                            <Input placeholder="XXX-XXX-XXX" {...field} data-testid="input-edit-employee-sin" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="driversLicenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.driversLicenseNumber', "Driver's License Number")}</FormLabel>
                          <FormControl>
                            <Input placeholder="License number" {...field} data-testid="input-edit-employee-dl-number" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="driversLicenseProvince"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.driversLicenseProvince', "Driver's License Province/State")}</FormLabel>
                          <FormControl>
                            <Input placeholder="BC, AB, etc." {...field} data-testid="input-edit-employee-dl-province" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DocumentUploader
                      documents={editEmployeeForm.watch("driversLicenseDocuments") || []}
                      onDocumentsChange={(docs) => editEmployeeForm.setValue("driversLicenseDocuments", docs)}
                      maxDocuments={5}
                      label={t('dashboard.employeeForm.driversLicenseDocuments', "Driver's License Documents")}
                      description={t('dashboard.employeeForm.driversLicenseDocsDescription', 'Upload driver\'s license photos, abstracts, or related documents')}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="homeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.homeAddress', 'Home Address')}</FormLabel>
                          <FormControl>
                            <Input placeholder="Street address" {...field} data-testid="input-edit-employee-address" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="employeePhoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.phoneNumber', 'Phone Number')}</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(604) 555-1234" {...field} data-testid="input-edit-employee-phone" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.emergencyContactName', 'Emergency Contact Name')}</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact name" {...field} data-testid="input-edit-employee-emergency-name" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="emergencyContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.emergencyContactPhone', 'Emergency Contact Phone')}</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(604) 555-1234" {...field} data-testid="input-edit-employee-emergency-phone" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editEmployeeForm.control}
                      name="specialMedicalConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.employeeForm.specialMedicalConditions', 'Special Medical Conditions')}</FormLabel>
                          <FormControl>
                            <Input placeholder="Medical conditions to be aware of" {...field} data-testid="input-edit-employee-medical" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-medium mb-4">{t('dashboard.employeeForm.irataCertification', 'IRATA Certification (Optional)')}</h4>
                      <div className="space-y-4">
                        <FormField
                          control={editEmployeeForm.control}
                          name="irataLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.employeeForm.irataLevel', 'IRATA Level')}</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12" data-testid="select-edit-irata-level">
                                    <SelectValue placeholder={t('dashboard.employeeForm.selectLevel', 'Select level')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Level 1">Level 1</SelectItem>
                                  <SelectItem value="Level 2">Level 2</SelectItem>
                                  <SelectItem value="Level 3">Level 3</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {editEmployeeForm.watch("irataLevel") && (
                          <>
                            <FormField
                              control={editEmployeeForm.control}
                              name="irataLicenseNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.employeeForm.irataLicenseNumber', 'IRATA License Number')}</FormLabel>
                                  <FormControl>
                                    <Input placeholder="License number" {...field} data-testid="input-edit-irata-license" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={editEmployeeForm.control}
                              name="irataIssuedDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.employeeForm.irataIssuedDate', 'IRATA Issued Date')}</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} data-testid="input-edit-irata-issued" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={editEmployeeForm.control}
                              name="irataExpirationDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.employeeForm.irataExpirationDate', 'IRATA Expiration Date')}</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} data-testid="input-edit-irata-expiration" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-medium mb-4">{t('dashboard.employeeForm.spratCertification', 'SPRAT Certification (Optional)')}</h4>
                      <div className="space-y-4">
                        <FormField
                          control={editEmployeeForm.control}
                          name="spratLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.employeeForm.spratLevel', 'SPRAT Level')}</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12" data-testid="select-edit-sprat-level">
                                    <SelectValue placeholder={t('dashboard.employeeForm.selectLevel', 'Select level')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Level 1">Level 1</SelectItem>
                                  <SelectItem value="Level 2">Level 2</SelectItem>
                                  <SelectItem value="Level 3">Level 3</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {editEmployeeForm.watch("spratLevel") && (
                          <>
                            <FormField
                              control={editEmployeeForm.control}
                              name="spratLicenseNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.employeeForm.spratLicenseNumber', 'SPRAT License Number')}</FormLabel>
                                  <FormControl>
                                    <Input placeholder="License number" {...field} data-testid="input-edit-sprat-license" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={editEmployeeForm.control}
                              name="spratIssuedDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.employeeForm.spratIssuedDate', 'SPRAT Issued Date')}</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} data-testid="input-edit-sprat-issued" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={editEmployeeForm.control}
                              name="spratExpirationDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('dashboard.employeeForm.spratExpirationDate', 'SPRAT Expiration Date')}</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} data-testid="input-edit-sprat-expiration" className="h-12" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <FormField
                        control={editEmployeeForm.control}
                        name="terminatedDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.employeeForm.terminationDate', 'Termination Date')}</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-edit-employee-terminated-date" className="h-12" />
                            </FormControl>
                            <FormDescription className="text-xs text-destructive">
                              {t('dashboard.employeeForm.terminationDateDesc', 'Setting a termination date will move this employee to terminated status')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="button" 
                  className="w-full h-12" 
                  onClick={() => setEditEmployeeFormStep(2)}
                  data-testid="button-edit-continue-to-permissions"
                >
                  {t('dashboard.employeeForm.continueToPermissions', 'Continue to Permissions')}
                </Button>
                </div>

                <div className={editEmployeeFormStep === 2 ? "block" : "hidden pointer-events-none"}>
                <FormField
                  control={editEmployeeForm.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <FormLabel className="text-base">{t('dashboard.employeeForm.accessPermissions', 'Access Permissions')}</FormLabel>
                            <FormDescription className="text-xs">
                              {t('dashboard.employeeForm.selectPermissions', 'Select the permissions this employee should have')}
                            </FormDescription>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
                              editEmployeeForm.setValue("permissions", allPermissionIds);
                            }}
                            data-testid="button-edit-select-all-permissions"
                          >
                            {t('dashboard.employeeForm.selectAll', 'Select All')}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {PERMISSION_CATEGORIES.map((category) => (
                          <div key={category.nameKey} className="border rounded-lg p-4 bg-muted/20">
                            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 pb-2 border-b">{t(category.nameKey, category.name)}</h4>
                            <div className="space-y-2">
                              {category.permissions.map((permission) => (
                                <FormField
                                  key={permission.id}
                                  control={editEmployeeForm.control}
                                  name="permissions"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={permission.id}
                                        className="flex flex-row items-center space-x-2 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(permission.id)}
                                            onCheckedChange={(checked) => {
                                              const newPermissions = handlePermissionChange(
                                                field.value || [],
                                                permission.id,
                                                !!checked
                                              );
                                              field.onChange(newPermissions);
                                            }}
                                            data-testid={`checkbox-edit-permission-${permission.id}`}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {t(permission.labelKey, permission.label)}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full h-12" 
                    onClick={() => setEditEmployeeFormStep(1)}
                    data-testid="button-edit-back-to-info"
                  >
                    {t('dashboard.employeeForm.back', 'Back')}
                  </Button>
                  <Button 
                    type="button" 
                    className="w-full h-12" 
                    data-testid="button-submit-edit-employee" 
                    disabled={editEmployeeMutation.isPending}
                    onClick={() => {
                      const data = editEmployeeForm.getValues();
                      onEditEmployeeSubmit(data);
                    }}
                  >
                    {editEmployeeMutation.isPending ? t('common.updating', 'Updating...') : t('dashboard.employeeForm.updateEmployee', 'Update Employee')}
                  </Button>
                </div>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Detail Dialog */}
      <Dialog open={showEmployeeDetailDialog} onOpenChange={setShowEmployeeDetailDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
          {employeeToView && (
            <>
              <DialogHeader className="p-6 border-b flex-shrink-0">
                <DialogTitle>{t('dashboard.employeeDetails.title', 'Employee Details')}</DialogTitle>
                <DialogDescription>
                  {t('dashboard.employeeDetails.subtitle', 'View complete employee information, documents, and certifications')}
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-y-auto flex-1 min-h-0">

                <div className="p-6 space-y-6">
                  {/* Profile Photo & Basic Info */}
                  <div className="flex items-start gap-4">
                    {employeeToView.photoUrl ? (
                      <img 
                        src={employeeToView.photoUrl} 
                        alt={employeeToView.name || 'Employee'} 
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border">
                        <span className="material-icons text-4xl text-muted-foreground">person</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{employeeToView.name || employeeToView.email}</h3>
                      <Badge variant="secondary" className="mt-1 capitalize">
                        {employeeToView.role?.replace(/_/g, ' ')}
                      </Badge>
                      {employeeToView.terminatedDate && (
                        <Badge variant="destructive" className="mt-1 ml-2">
                          {t('dashboard.employeeDetails.terminated', 'Terminated')}: {formatLocalDate(employeeToView.terminatedDate)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="material-icons text-lg">contact_mail</span>
                        {t('dashboard.employeeDetails.contactInfo', 'Contact Information')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-sm text-muted-foreground">email</span>
                        <span className="text-sm">{employeeToView.email}</span>
                      </div>
                      {employeeToView.employeePhoneNumber && (
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-sm text-muted-foreground">phone</span>
                          <span className="text-sm">{employeeToView.employeePhoneNumber}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Address */}
                  {(employeeToView.employeeStreetAddress || employeeToView.employeeCity || employeeToView.employeeProvinceState || employeeToView.employeeCountry || employeeToView.employeePostalCode) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="material-icons text-lg">home</span>
                          {t('dashboard.employeeDetails.address', 'Address')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1">
                        {employeeToView.employeeStreetAddress && (
                          <div className="text-sm">{employeeToView.employeeStreetAddress}</div>
                        )}
                        <div className="text-sm">
                          {[
                            employeeToView.employeeCity,
                            employeeToView.employeeProvinceState,
                            employeeToView.employeePostalCode
                          ].filter(Boolean).join(', ')}
                        </div>
                        {employeeToView.employeeCountry && (
                          <div className="text-sm">{employeeToView.employeeCountry}</div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Employment Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="material-icons text-lg">work</span>
                        {t('dashboard.employeeDetails.employmentDetails', 'Employment Details')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {employeeToView.startDate && (
                        <div>
                          <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.startDate', 'Start Date')}</div>
                          <div className="text-sm font-medium">{formatLocalDate(employeeToView.startDate)}</div>
                        </div>
                      )}
                      {hasFinancialAccess(user) && (employeeToView.isSalary ? (
                        employeeToView.salary && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.salary', 'Annual Salary')}</div>
                            <div className="text-sm font-medium">${Number(employeeToView.salary).toLocaleString()}/{t('dashboard.employees.year', 'yr')}</div>
                          </div>
                        )
                      ) : (
                        employeeToView.hourlyRate && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.hourlyRate', 'Hourly Rate')}</div>
                            <div className="text-sm font-medium">${employeeToView.hourlyRate}/{t('dashboard.employees.hour', 'hr')}</div>
                          </div>
                        )
                      ))}
                      {employeeToView.techLevel && (
                        <div>
                          <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.techLevel', 'Tech Level')}</div>
                          <div className="text-sm font-medium">IRATA {employeeToView.techLevel}</div>
                        </div>
                      )}
                      {employeeToView.ropeAccessStartDate && (
                        <div>
                          <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.ropeAccessExperience', 'Rope Access Experience')}</div>
                          <div className="text-sm font-medium">
                            {(() => {
                              const startDate = parseLocalDate(employeeToView.ropeAccessStartDate);
                              const now = new Date();
                              // Calculate years and months using proper date math
                              let years = now.getFullYear() - startDate.getFullYear();
                              let months = now.getMonth() - startDate.getMonth();
                              if (months < 0 || (months === 0 && now.getDate() < startDate.getDate())) {
                                years--;
                                months += 12;
                              }
                              if (now.getDate() < startDate.getDate()) {
                                months--;
                                if (months < 0) months += 12;
                              }
                              
                              if (years === 0 && months === 0) return t('dashboard.employeeDetails.lessThanMonth', 'Less than a month');
                              // Use interpolation pattern for localization
                              const yearsMonthsTemplate = t('dashboard.employeeDetails.yearsMonths', '{years} year(s), {months} month(s)');
                              const yearsOnlyTemplate = t('dashboard.employeeDetails.yearsOnly', '{years} year(s)');
                              const monthsOnlyTemplate = t('dashboard.employeeDetails.monthsOnly', '{months} month(s)');
                              
                              if (years === 0) return monthsOnlyTemplate.replace('{months}', months.toString());
                              if (months === 0) return yearsOnlyTemplate.replace('{years}', years.toString());
                              return yearsMonthsTemplate.replace('{years}', years.toString()).replace('{months}', months.toString());
                            })()}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {t('dashboard.employeeDetails.startedOn', 'Started')}: {formatLocalDate(employeeToView.ropeAccessStartDate)}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* IRATA Certification */}
                  {(employeeToView.irataLevel || employeeToView.irataLicenseNumber || employeeToView.irataExpirationDate || (employeeToView.irataDocuments?.length > 0)) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-lg">workspace_premium</span>
                            {t('dashboard.employeeDetails.irataCertification', 'IRATA Certification')}
                          </div>
                          {employeeToView.irataVerifiedAt ? (
                            <Badge variant="default" className="bg-green-600">
                              <span className="material-icons text-xs mr-1">verified</span>
                              {t('dashboard.employeeDetails.verified', 'Verified')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              {t('dashboard.employeeDetails.notVerified', 'Not Verified')}
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {employeeToView.irataLevel && (
                        <div>
                          <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.level', 'Level')}</div>
                          <div className="text-sm font-medium">{employeeToView.irataLevel}</div>
                        </div>
                        )}
                        {employeeToView.irataLicenseNumber && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.licenseNumber', 'License Number')}</div>
                            <div className="text-sm font-medium">{employeeToView.irataLicenseNumber}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.expirationDate', 'Expiration Date')}</div>
                          {employeeToView.irataExpirationDate ? (
                            <div className="text-sm font-medium">
                              {formatLocalDate(employeeToView.irataExpirationDate)}
                              {(() => {
                                const expirationDate = parseLocalDate(employeeToView.irataExpirationDate);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (expirationDate < today) {
                                  return <Badge variant="destructive" className="ml-2">{t('dashboard.employeeDetails.expired', 'Expired')}</Badge>;
                                }
                                const thirtyDaysFromNow = new Date();
                                thirtyDaysFromNow.setDate(today.getDate() + 30);
                                if (expirationDate <= thirtyDaysFromNow) {
                                  return <Badge variant="outline" className="ml-2 bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400">{t('dashboard.employeeDetails.expiringSoon', 'Expiring Soon')}</Badge>;
                                }
                                return null;
                              })()}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground italic">{t('dashboard.employeeDetails.notSet', 'Not set')}</div>
                          )}
                        </div>
                        {employeeToView.irataVerifiedAt && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.verifiedOn', 'Verified On')}</div>
                            <div className="text-sm font-medium">{formatLocalDate(employeeToView.irataVerifiedAt)}</div>
                            <div className="mt-2 p-2 rounded bg-green-500/10 border border-green-500/20">
                              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <span className="material-icons text-green-600 text-sm flex-shrink-0">info</span>
                                <span>{t('dashboard.employeeDetails.verifiedExplanation', 'Verified means we have confirmed this certification by reviewing the uploaded certification card using AI-powered document verification. The license details have been validated against the uploaded document.')}</span>
                              </p>
                            </div>
                          </div>
                        )}
                        {employeeToView.irataDocuments && employeeToView.irataDocuments.length > 0 && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-2">{t('dashboard.employeeDetails.documents', 'Documents')}</div>
                            <div className="space-y-1">
                              {employeeToView.irataDocuments.map((doc: string, idx: number) => (
                                <a 
                                  key={idx} 
                                  href={doc} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <span className="material-icons text-sm">description</span>
                                  {t('dashboard.employeeDetails.document', 'Document')} {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* SPRAT Certification */}
                  {(employeeToView.spratLevel || employeeToView.spratLicenseNumber || employeeToView.spratExpirationDate || (employeeToView.spratDocuments?.length > 0)) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-icons text-lg">verified</span>
                            {t('dashboard.employeeDetails.spratCertification', 'SPRAT Certification')}
                          </div>
                          {employeeToView.spratVerifiedAt ? (
                            <Badge variant="default" className="bg-green-600">
                              <span className="material-icons text-xs mr-1">verified</span>
                              {t('dashboard.employeeDetails.verified', 'Verified')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              {t('dashboard.employeeDetails.notVerified', 'Not Verified')}
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {employeeToView.spratLevel && (
                        <div>
                          <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.level', 'Level')}</div>
                          <div className="text-sm font-medium">{employeeToView.spratLevel}</div>
                        </div>
                        )}
                        {employeeToView.spratLicenseNumber && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.licenseNumber', 'License Number')}</div>
                            <div className="text-sm font-medium">{employeeToView.spratLicenseNumber}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.expirationDate', 'Expiration Date')}</div>
                          {employeeToView.spratExpirationDate ? (
                            <div className="text-sm font-medium">
                              {formatLocalDate(employeeToView.spratExpirationDate)}
                              {(() => {
                                const expirationDate = parseLocalDate(employeeToView.spratExpirationDate);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (expirationDate < today) {
                                  return <Badge variant="destructive" className="ml-2">{t('dashboard.employeeDetails.expired', 'Expired')}</Badge>;
                                }
                                const thirtyDaysFromNow = new Date();
                                thirtyDaysFromNow.setDate(today.getDate() + 30);
                                if (expirationDate <= thirtyDaysFromNow) {
                                  return <Badge variant="outline" className="ml-2 bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400">{t('dashboard.employeeDetails.expiringSoon', 'Expiring Soon')}</Badge>;
                                }
                                return null;
                              })()}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground italic">{t('dashboard.employeeDetails.notSet', 'Not set')}</div>
                          )}
                        </div>
                        {employeeToView.spratVerifiedAt && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.verifiedOn', 'Verified On')}</div>
                            <div className="text-sm font-medium">{formatLocalDate(employeeToView.spratVerifiedAt)}</div>
                            <div className="mt-2 p-2 rounded bg-green-500/10 border border-green-500/20">
                              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <span className="material-icons text-green-600 text-sm flex-shrink-0">info</span>
                                <span>{t('dashboard.employeeDetails.verifiedExplanation', 'Verified means we have confirmed this certification by reviewing the uploaded certification card using AI-powered document verification. The license details have been validated against the uploaded document.')}</span>
                              </p>
                            </div>
                          </div>
                        )}
                        {employeeToView.spratDocuments && employeeToView.spratDocuments.length > 0 && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-2">{t('dashboard.employeeDetails.documents', 'Documents')}</div>
                            <div className="space-y-1">
                              {employeeToView.spratDocuments.map((doc: string, idx: number) => (
                                <a 
                                  key={idx} 
                                  href={doc} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <span className="material-icons text-sm">description</span>
                                  {t('dashboard.employeeDetails.document', 'Document')} {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* First Aid Certification */}
                  {employeeToView.hasFirstAid && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="material-icons text-lg">medical_services</span>
                          {t('dashboard.employeeDetails.firstAidCertification', 'First Aid Certification')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {employeeToView.firstAidType && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.certType', 'Certification Type')}</div>
                            <div className="text-sm font-medium">{employeeToView.firstAidType}</div>
                          </div>
                        )}
                        {employeeToView.firstAidExpiry && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.expirationDate', 'Expiration Date')}</div>
                            <div className="text-sm font-medium">
                              {formatLocalDate(employeeToView.firstAidExpiry)}
                              {(() => {
                                const expirationDate = parseLocalDate(employeeToView.firstAidExpiry);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (expirationDate < today) {
                                  return <Badge variant="destructive" className="ml-2">{t('dashboard.employeeDetails.expired', 'Expired')}</Badge>;
                                }
                                const thirtyDaysFromNow = new Date();
                                thirtyDaysFromNow.setDate(today.getDate() + 30);
                                if (expirationDate <= thirtyDaysFromNow) {
                                  return <Badge variant="outline" className="ml-2 bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400">{t('dashboard.employeeDetails.expiringSoon', 'Expiring Soon')}</Badge>;
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        )}
                        {employeeToView.firstAidDocuments && employeeToView.firstAidDocuments.length > 0 && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-2">{t('dashboard.employeeDetails.documents', 'Documents')}</div>
                            <div className="space-y-1">
                              {employeeToView.firstAidDocuments.map((doc: string, idx: number) => (
                                <a 
                                  key={idx} 
                                  href={doc} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <span className="material-icons text-sm">description</span>
                                  {t('dashboard.employeeDetails.document', 'Document')} {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Driver's License */}
                  {(employeeToView.driversLicenseNumber || employeeToView.driversLicenseProvince || employeeToView.driversLicenseIssuedDate || employeeToView.driversLicenseExpiry || (employeeToView.driversLicenseDocuments?.length > 0)) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="material-icons text-lg">badge</span>
                          {t('dashboard.employeeDetails.driversLicense', "Driver's License")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {employeeToView.driversLicenseNumber && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.licenseNumber', 'License Number')}</div>
                            <div className="text-sm font-medium">{employeeToView.driversLicenseNumber}</div>
                          </div>
                        )}
                        {employeeToView.driversLicenseProvince && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.provinceState', 'Province/State')}</div>
                            <div className="text-sm font-medium">{employeeToView.driversLicenseProvince}</div>
                          </div>
                        )}
                        {employeeToView.driversLicenseIssuedDate && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.issuedDate', 'Issued Date')}</div>
                            <div className="text-sm font-medium">{formatLocalDate(employeeToView.driversLicenseIssuedDate)}</div>
                          </div>
                        )}
                        {employeeToView.driversLicenseExpiry && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.expiry', 'Expiry')}</div>
                            <div className="text-sm font-medium">{formatLocalDate(employeeToView.driversLicenseExpiry)}</div>
                          </div>
                        )}
                        {employeeToView.driversLicenseDocuments && employeeToView.driversLicenseDocuments.length > 0 && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-2">{t('dashboard.employeeDetails.documents', 'Documents')}</div>
                            <div className="space-y-2">
                              {employeeToView.driversLicenseDocuments.map((doc: string, idx: number) => {
                                const lowerUrl = doc.toLowerCase();
                                const isPdf = lowerUrl.endsWith('.pdf');
                                const isAbstract = lowerUrl.includes('abstract');
                                const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                              lowerUrl.includes('image') || 
                                              (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                                const documentLabel = isAbstract 
                                  ? t('dashboard.employeeDetails.driversAbstract', "Driver's Abstract")
                                  : t('dashboard.employeeDetails.licensePhoto', 'License Photo');
                                
                                return (
                                  <div key={idx} className="space-y-1">
                                    <div className="text-xs font-medium text-muted-foreground">{documentLabel}</div>
                                    <a 
                                      href={doc} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="block border rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                                    >
                                      {isPdf ? (
                                        <div className="flex items-center justify-center py-4 bg-muted gap-2">
                                          <span className="material-icons text-muted-foreground">picture_as_pdf</span>
                                          <span className="text-sm text-muted-foreground">{t('dashboard.employeeDetails.viewPdf', 'View PDF')}</span>
                                        </div>
                                      ) : isImage ? (
                                        <img 
                                          src={doc} 
                                          alt={documentLabel}
                                          className="w-full object-contain"
                                          style={{ maxHeight: '200px', minHeight: '60px' }}
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center py-4 bg-muted gap-2">
                                          <span className="material-icons text-muted-foreground">description</span>
                                          <span className="text-sm text-muted-foreground">{t('dashboard.employeeDetails.viewDocument', 'View Document')}</span>
                                        </div>
                                      )}
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Emergency Contact */}
                  {employeeToView.emergencyContactName && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="material-icons text-lg">contact_emergency</span>
                          {t('dashboard.employeeDetails.emergencyContact', 'Emergency Contact')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.name', 'Name')}</div>
                          <div className="text-sm font-medium">{employeeToView.emergencyContactName}</div>
                        </div>
                        {employeeToView.emergencyContactPhone && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.phone', 'Phone')}</div>
                            <div className="text-sm font-medium">{employeeToView.emergencyContactPhone}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Personal Information - Birthday, SIN, Medical Conditions */}
                  {(employeeToView.birthday || employeeToView.socialInsuranceNumber || employeeToView.specialMedicalConditions) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="material-icons text-lg">person</span>
                          {t('dashboard.employeeDetails.personalInfo', 'Personal Information')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {employeeToView.birthday && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.birthday', 'Birthday')}</div>
                            <div className="text-sm font-medium">{formatLocalDate(employeeToView.birthday)}</div>
                          </div>
                        )}
                        {employeeToView.socialInsuranceNumber && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.sin', 'Social Insurance Number')}</div>
                            <div className="text-sm font-medium font-mono">{employeeToView.socialInsuranceNumber}</div>
                          </div>
                        )}
                        {employeeToView.specialMedicalConditions && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.medicalConditions', 'Medical Conditions')}</div>
                            <div className="text-sm font-medium">{employeeToView.specialMedicalConditions}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Banking Information */}
                  {(employeeToView.bankTransitNumber || employeeToView.bankInstitutionNumber || employeeToView.bankAccountNumber || (employeeToView.bankDocuments && employeeToView.bankDocuments.length > 0)) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="material-icons text-lg">account_balance</span>
                          {t('dashboard.employeeDetails.bankingInfo', 'Banking Information')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {employeeToView.bankTransitNumber && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.transitNumber', 'Transit Number')}</div>
                            <div className="text-sm font-medium font-mono">{employeeToView.bankTransitNumber}</div>
                          </div>
                        )}
                        {employeeToView.bankInstitutionNumber && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.institutionNumber', 'Institution Number')}</div>
                            <div className="text-sm font-medium font-mono">{employeeToView.bankInstitutionNumber}</div>
                          </div>
                        )}
                        {employeeToView.bankAccountNumber && (
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.employeeDetails.accountNumber', 'Account Number')}</div>
                            <div className="text-sm font-medium font-mono">{employeeToView.bankAccountNumber}</div>
                          </div>
                        )}
                        {employeeToView.bankDocuments && employeeToView.bankDocuments.length > 0 && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-2">{t('dashboard.employeeDetails.voidCheque', 'Void Cheque')}</div>
                            <div className="space-y-1">
                              {employeeToView.bankDocuments.map((doc: string, idx: number) => (
                                <a 
                                  key={idx} 
                                  href={doc} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <span className="material-icons text-sm">description</span>
                                  {t('dashboard.employeeDetails.document', 'Document')} {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Permissions - Only show granted permissions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="material-icons text-lg">admin_panel_settings</span>
                        {t('dashboard.employeeDetails.permissions', 'Permissions')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Normalize permissions array (handle string, array, or null)
                        let perms: string[] = [];
                        if (Array.isArray(employeeToView.permissions)) {
                          perms = employeeToView.permissions;
                        } else if (typeof employeeToView.permissions === 'string') {
                          if (employeeToView.permissions.startsWith('[')) {
                            try { perms = JSON.parse(employeeToView.permissions); } catch { perms = []; }
                          } else if (employeeToView.permissions.startsWith('{') && employeeToView.permissions.endsWith('}')) {
                            perms = employeeToView.permissions.slice(1, -1).split(',').map((s: string) => s.trim()).filter(Boolean);
                          }
                        }

                        if (perms.length === 0) {
                          return (
                            <div className="text-sm text-muted-foreground">
                              {t('dashboard.employeeDetails.noPermissions', 'No permissions assigned')}
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-2 gap-2">
                            {perms.map((permId: string, index: number) => {
                              // Find the permission label from AVAILABLE_PERMISSIONS
                              const perm = AVAILABLE_PERMISSIONS.find((p: any) => p.id === permId);
                              const label = perm ? t(perm.labelKey, permId.replace(/_/g, ' ')) : permId.replace(/_/g, ' ');
                              return (
                                <div key={index} className="flex items-center gap-2">
                                  <span className="material-icons text-sm text-green-600">check_circle</span>
                                  <span className="text-sm capitalize">{label}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  {/* Document Requests - Only for company owners viewing rope access technicians */}
                  {user?.role === 'company' && employeeToView.role === 'rope_access_tech' && companyIdForData && (
                    <EmployerDocumentRequests
                      technicianId={employeeToView.id}
                      technicianName={employeeToView.name || employeeToView.email}
                      companyId={companyIdForData}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Unlink Employee Confirmation Dialog */}
      <AlertDialog open={employeeToDelete !== null} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.unlinkEmployee.title', 'Unlink Employee')}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                {t('dashboard.unlinkEmployee.description', 'This will disconnect this employee from your company. They will lose access to your company dashboard.')}
              </span>
              <span className="block text-muted-foreground">
                {t('dashboard.unlinkEmployee.reassurance', 'Their personal account, certifications, and work history remain intact. They can still work for other employers.')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-unlink">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => employeeToDelete && deleteEmployeeMutation.mutate(employeeToDelete)}
              data-testid="button-confirm-unlink"
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              <span className="material-icons text-sm mr-1">link_off</span>
              {t('common.unlink', 'Unlink')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate / Make Inactive Confirmation Dialog */}
      <AlertDialog open={employeeToSuspendSeat !== null} onOpenChange={(open) => !open && setEmployeeToSuspendSeat(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.deactivate.title', 'Deactivate Employee')}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                {t('dashboard.deactivate.description', 'Are you sure you want to deactivate')} <strong>{employeeToSuspendSeat?.name || employeeToSuspendSeat?.email}</strong>?
              </span>
              <span className="block text-amber-600 dark:text-amber-400">
                {t('dashboard.deactivate.warning', 'This will remove one seat from your subscription. The employee will become inactive but can be reactivated later.')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-deactivate">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => employeeToSuspendSeat && suspendSeatMutation.mutate(employeeToSuspendSeat.id)}
              data-testid="button-confirm-deactivate"
              className="bg-amber-600 text-white hover:bg-amber-700"
              disabled={suspendSeatMutation.isPending}
            >
              {suspendSeatMutation.isPending ? (
                <span className="material-icons animate-spin text-sm">refresh</span>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1">person_remove</span>
                  {t('dashboard.deactivate.confirm', 'Deactivate')}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Info Modal */}
      <Dialog open={showDeactivateInfoModal} onOpenChange={setShowDeactivateInfoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-amber-600">person_remove</span>
              {t('dashboard.deactivateInfo.title', 'About Deactivate')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-1">{t('dashboard.deactivateInfo.whenToUse', 'When to use')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.deactivateInfo.whenDescription', 'Use this when an employee is temporarily laid off, during slow periods, or when you need to pause their access without permanently removing them from your roster.')}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">{t('dashboard.deactivateInfo.whatHappens', 'What happens')}</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>{t('dashboard.deactivateInfo.bullet1', 'Employee remains on your roster but becomes inactive')}</li>
                <li>{t('dashboard.deactivateInfo.bullet2', 'They lose access to your company dashboard')}</li>
                <li>{t('dashboard.deactivateInfo.bullet3', 'The $34.95/month payment for this seat is paused until reactivated')}</li>
                <li>{t('dashboard.deactivateInfo.bullet4', 'You can easily reactivate them when work picks up again')}</li>
              </ul>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>{t('dashboard.deactivateInfo.tip', 'Tip:')}</strong> {t('dashboard.deactivateInfo.tipDescription', 'This is ideal for seasonal workers or during temporary slowdowns. The employee can be brought back with a single click.')}
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setShowDeactivateInfoModal(false)} data-testid="button-close-deactivate-info">
              {t('common.gotIt', 'Got it')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unlink Info Modal */}
      <Dialog open={showUnlinkInfoModal} onOpenChange={setShowUnlinkInfoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-amber-600">link_off</span>
              {t('dashboard.unlinkInfo.title', 'About Unlink')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-1">{t('dashboard.unlinkInfo.whenToUse', 'When to use')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.unlinkInfo.whenDescription', 'Use this when an employee has been fired, quit, or is permanently leaving your company. This is for final separations where you do not expect them to return.')}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">{t('dashboard.unlinkInfo.whatHappens', 'What happens')}</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>{t('dashboard.unlinkInfo.bullet1', 'Employee is completely removed from your roster')}</li>
                <li>{t('dashboard.unlinkInfo.bullet2', 'They lose all access to your company dashboard')}</li>
                <li>{t('dashboard.unlinkInfo.bullet3', 'The $34.95/month payment for this seat stops immediately')}</li>
                <li>{t('dashboard.unlinkInfo.bullet4', 'If you hire them back later, a new connection will need to be established')}</li>
              </ul>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive dark:text-destructive">
                <strong>{t('dashboard.unlinkInfo.note', 'Note:')}</strong> {t('dashboard.unlinkInfo.noteDescription', 'Their personal OnRopePro account and certifications remain intact. They can still work for other employers.')}
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setShowUnlinkInfoModal(false)} data-testid="button-close-unlink-info">
              {t('common.gotIt', 'Got it')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePasswordDialog} onOpenChange={(open) => {
        setShowChangePasswordDialog(open);
        if (!open) {
          setEmployeeToChangePassword(null);
          setNewPassword("");
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboard.changePassword.title', 'Change Employee Password')}</DialogTitle>
            <DialogDescription>
              {t('dashboard.changePassword.description', 'Set a new password for')} {employeeToChangePassword?.name || employeeToChangePassword?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium">
                {t('dashboard.changePassword.newPassword', 'New Password')}
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder={t('dashboard.changePassword.placeholder', 'Enter new password (min 6 characters)')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                data-testid="input-new-password"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                {t('dashboard.changePassword.hint', 'Give this password to the employee. They can change it later from their profile.')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowChangePasswordDialog(false);
                setEmployeeToChangePassword(null);
                setNewPassword("");
              }}
              className="flex-1"
              data-testid="button-cancel-password-change"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={() => {
                if (!employeeToChangePassword) return;
                if (!newPassword || newPassword.length < 6) {
                  toast({ 
                    title: t('dashboard.changePassword.invalidPassword', 'Invalid Password'), 
                    description: t('dashboard.changePassword.minLength', 'Password must be at least 6 characters long'),
                    variant: "destructive" 
                  });
                  return;
                }
                changePasswordMutation.mutate({
                  employeeId: employeeToChangePassword.id,
                  newPassword,
                });
              }}
              className="flex-1"
              disabled={changePasswordMutation.isPending || !newPassword || newPassword.length < 6}
              data-testid="button-confirm-password-change"
            >
              {changePasswordMutation.isPending ? t('dashboard.changePassword.changing', 'Changing...') : t('dashboard.changePassword.changePassword', 'Change Password')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Harness Inspection Check Dialog */}
      <AlertDialog open={showInspectionCheckDialog} onOpenChange={setShowInspectionCheckDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.inspectionCheck.title', 'Have you completed your harness inspection?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.inspectionCheck.description', 'Before starting your work day, you must complete a daily rope access equipment inspection to ensure all gear is safe and ready for use.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleGoToInspection} data-testid="button-no-inspection">
              {t('dashboard.inspectionCheck.noTakeMe', 'No, take me to inspection')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleInspectionComplete} data-testid="button-yes-inspection">
              {t('dashboard.inspectionCheck.yesContinue', 'Yes, continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Start Day Confirmation Dialog */}
      <AlertDialog open={showStartDayDialog} onOpenChange={setShowStartDayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.startDay.title', 'Start Work Session?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.startDay.description', 'This will begin tracking your work session for today. You can log drops throughout the day and end your session when finished.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-start-day">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStartDay}
              data-testid="button-confirm-start-day"
              disabled={startDayMutation.isPending}
            >
              {startDayMutation.isPending ? t('dashboard.startDay.starting', 'Starting...') : t('dashboard.startDay.startSession', 'Start Work Session')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Day Dialog with Drop Count */}
      <Dialog open={showEndDayDialog} onOpenChange={setShowEndDayDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('dashboard.endDay.title', 'End Your Work Day')}</DialogTitle>
            <DialogDescription>
              {(() => {
                const activeProject = projects.find(p => p.id === activeSession?.projectId);
                const progressType = activeProject?.jobType ? getProgressType(activeProject.jobType) : 'drops';
                const isHoursBased = progressType === 'hours';
                if (isHoursBased) {
                  return t('dashboard.endDay.completionPercentage', 'Enter how much of the job YOU completed today. This will be added to the total project progress.');
                } else if (activeProject?.jobType === "parkade_pressure_cleaning") {
                  return t('dashboard.endDay.parkingStalls', 'Enter the number of parking stalls you completed today.');
                } else if (activeProject?.jobType === "in_suite_dryer_vent_cleaning") {
                  return t('dashboard.endDay.suites', 'Enter the number of suites you completed today.');
                } else {
                  return t('dashboard.endDay.drops', 'Enter the number of drops you completed today for each elevation.');
                }
              })()}
            </DialogDescription>
          </DialogHeader>

          <Form {...endDayForm}>
            <form onSubmit={endDayForm.handleSubmit(onEndDaySubmit)} className="space-y-4">
              {(() => {
                const activeProject = projects.find(p => p.id === activeSession?.projectId);
                const progressType = activeProject?.jobType ? getProgressType(activeProject.jobType) : 'drops';
                const isHoursBased = progressType === 'hours';
                const isParkade = activeProject?.jobType === "parkade_pressure_cleaning";
                const isInSuite = activeProject?.jobType === "in_suite_dryer_vent_cleaning";
                
                if (isHoursBased) {
                  return (
                    <FormField
                      control={endDayForm.control}
                      name="dropsNorth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.endDay.projectCompletionLabel', 'Your Contribution Today (%)')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              placeholder="0"
                              {...field}
                              data-testid="input-completion-percentage"
                              className="h-12 text-xl"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            {t('dashboard.endDay.completionHint', 'How much did YOU complete today? This adds to the total progress.')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                } else if (isParkade) {
                  return (
                    <FormField
                      control={endDayForm.control}
                      name="dropsNorth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.endDay.parkingStallsLabel', 'Parking Stalls Completed')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              data-testid="input-stalls-completed"
                              className="h-12 text-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                } else if (isInSuite) {
                  return (
                    <FormField
                      control={endDayForm.control}
                      name="dropsNorth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.endDay.suitesLabel', 'Suites Completed')}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              data-testid="input-suites-completed"
                              className="h-12 text-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                } else {
                  return (
                    <>
                      {/* North Elevation */}
                      <FormField
                        control={endDayForm.control}
                        name="dropsNorth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.endDay.northElevation', 'North Elevation')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                data-testid="input-drops-north"
                                className="h-12 text-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* East Elevation */}
                      <FormField
                        control={endDayForm.control}
                        name="dropsEast"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.endDay.eastElevation', 'East Elevation')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                data-testid="input-drops-east"
                                className="h-12 text-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* South Elevation */}
                      <FormField
                        control={endDayForm.control}
                        name="dropsSouth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.endDay.southElevation', 'South Elevation')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                data-testid="input-drops-south"
                                className="h-12 text-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* West Elevation */}
                      <FormField
                        control={endDayForm.control}
                        name="dropsWest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.endDay.westElevation', 'West Elevation')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...field}
                                data-testid="input-drops-west"
                                className="h-12 text-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  );
                }
              })()}

              {activeSession && (() => {
                const dropsNorth = parseInt(endDayForm.watch("dropsNorth")) || 0;
                const dropsEast = parseInt(endDayForm.watch("dropsEast")) || 0;
                const dropsSouth = parseInt(endDayForm.watch("dropsSouth")) || 0;
                const dropsWest = parseInt(endDayForm.watch("dropsWest")) || 0;
                const totalDrops = dropsNorth + dropsEast + dropsSouth + dropsWest;
                const totalWithExisting = todayDrops + totalDrops;
                return totalWithExisting < dailyTarget && totalDrops > 0;
              })() && (
                <FormField
                  control={endDayForm.control}
                  name="shortfallReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('dashboard.endDay.shortfallReason', 'Shortfall Reason (Required)')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('dashboard.endDay.shortfallPlaceholder', "Explain why the daily target wasn't met...")}
                          {...field}
                          data-testid="input-shortfall-reason"
                          className="min-h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Rope Access Hours Toggle and Input */}
              <div className="border-t pt-4 mt-4">
                <FormField
                  control={endDayForm.control}
                  name="logRopeAccessHours"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{t('dashboard.endDay.logRopeAccessHours', 'Log rope access hours for your logbook?')}</FormLabel>
                        <FormDescription className="text-xs">
                          {t('dashboard.endDay.logRopeAccessHoursDesc', 'Track actual time on ropes for IRATA/SPRAT certification')}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-log-rope-access-hours"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {endDayForm.watch("logRopeAccessHours") && (
                  <FormField
                    control={endDayForm.control}
                    name="ropeAccessTaskHours"
                    render={({ field }) => (
                      <FormItem className="mt-3">
                        <FormLabel>{t('dashboard.endDay.ropeAccessHoursLabel', 'Rope Access Task Hours')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="24"
                            step="0.25"
                            placeholder="e.g., 6.5"
                            {...field}
                            data-testid="input-rope-access-hours"
                            className="h-12 text-xl"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {t('dashboard.endDay.ropeAccessHoursHint', 'Enter in quarter-hour increments. Excludes lunch, breaks, and downtime.')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => {
                    setShowEndDayDialog(false);
                    endDayForm.reset();
                  }}
                  data-testid="button-cancel-end-day"
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="flex-1 h-12"
                  data-testid="button-confirm-end-day"
                  disabled={endDayMutation.isPending}
                >
                  <span className="material-icons mr-2">stop_circle</span>
                  {endDayMutation.isPending ? t('dashboard.endDay.ending', 'Ending...') : t('dashboard.endDay.endDay', 'End Day')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Last One Out - Progress Prompt Dialog */}
      <ProgressPromptDialog
        open={progressPromptOpen}
        onClose={() => {
          setProgressPromptOpen(false);
          setProgressPromptProjectId(null);
        }}
        projectId={progressPromptProjectId}
        currentProgress={progressPromptCurrentValue}
      />

      {/* Harness Inspection Details Dialog */}
      <Dialog open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-icons">verified_user</span>
                {t('dashboard.inspection.title', 'Rope Access Equipment Inspection')}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!selectedInspection) return;
                  
                  const printWindow = window.open('', '', 'width=210mm,height=297mm');
                  if (!printWindow) return;
                  
                  const doc = printWindow.document;
                  doc.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Equipment Inspection Report - ${selectedInspection.equipmentId || 'N/A'}</title>
  <meta charset="utf-8">
  <style>
    @page {
      size: A4;
      margin: 0.75in;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', 'Segoe UI', 'Roboto', system-ui, -apple-system, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1e293b;
      background: white;
      padding: 0;
    }
    
    .report-container {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
    }
    
    .report-header {
      border-bottom: 4px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .report-title {
      font-size: 20pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    
    .report-subtitle {
      font-size: 10pt;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
    }
    
    .metadata-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
      padding: 20px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
    }
    
    .metadata-field {
      margin-bottom: 12px;
    }
    
    .metadata-label {
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .metadata-value {
      font-size: 11pt;
      color: #0f172a;
      font-weight: 500;
    }
    
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .status-pass {
      background: #10b981;
      color: white;
    }
    
    .status-fail {
      background: #ef4444;
      color: white;
    }
    
    .section-header {
      font-size: 14pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 30px;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    
    .category-block {
      margin-bottom: 25px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    
    .category-header {
      background: #f1f5f9;
      padding: 12px 16px;
      border-left: 4px solid #0ea5e9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .category-header.fail {
      border-left-color: #ef4444;
      background: #fef2f2;
    }
    
    .category-title {
      font-size: 11pt;
      font-weight: 700;
      color: #0f172a;
    }
    
    .category-status {
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .category-status.pass {
      color: #10b981;
    }
    
    .category-status.fail {
      color: #ef4444;
    }
    
    .inspection-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .inspection-table th {
      background: #f8fafc;
      padding: 10px 16px;
      text-align: left;
      font-size: 9pt;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .inspection-table td {
      padding: 10px 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 10pt;
      color: #334155;
    }
    
    .inspection-table tr:nth-child(even) {
      background: #fafbfc;
    }
    
    .inspection-table tr:last-child td {
      border-bottom: none;
    }
    
    .item-name {
      font-weight: 500;
      color: #1e293b;
    }
    
    .item-status {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 9pt;
      letter-spacing: 0.03em;
    }
    
    .item-status.pass {
      color: #10b981;
    }
    
    .item-status.fail {
      color: #ef4444;
    }
    
    .item-status.na {
      color: #94a3b8;
    }
    
    .item-notes {
      font-size: 9pt;
      color: #64748b;
      font-style: italic;
      margin-top: 4px;
    }
    
    .notes-section {
      margin-top: 30px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      page-break-inside: avoid;
    }
    
    .notes-title {
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #475569;
      margin-bottom: 8px;
    }
    
    .notes-content {
      font-size: 10pt;
      color: #334155;
      white-space: pre-wrap;
      line-height: 1.6;
    }
    
    .signature-section {
      margin-top: 40px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      page-break-inside: avoid;
    }
    
    .signature-block {
      border-top: 2px solid #0f172a;
      padding-top: 8px;
    }
    
    .signature-label {
      font-size: 9pt;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 8pt;
      color: #94a3b8;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .category-block {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <div class="report-title">ROPE ACCESS EQUIPMENT INSPECTION REPORT</div>
      <div class="report-subtitle">IRATA Compliant Documentation</div>
    </div>
    
    <div class="metadata-grid">
      <div>
        <div class="metadata-field">
          <div class="metadata-label">Inspector</div>
          <div class="metadata-value">${selectedInspection.inspectorName || 'N/A'}</div>
        </div>
        <div class="metadata-field">
          <div class="metadata-label">Equipment ID</div>
          <div class="metadata-value">${selectedInspection.equipmentId || selectedInspection.personalHarnessId || 'N/A'}</div>
        </div>
        ${selectedInspection.manufacturer ? `
        <div class="metadata-field">
          <div class="metadata-label">Manufacturer</div>
          <div class="metadata-value">${selectedInspection.manufacturer}</div>
        </div>
        ` : ''}
        ${selectedInspection.model ? `
        <div class="metadata-field">
          <div class="metadata-label">Model</div>
          <div class="metadata-value">${selectedInspection.model}</div>
        </div>
        ` : ''}
      </div>
      <div>
        <div class="metadata-field">
          <div class="metadata-label">Inspection Date</div>
          <div class="metadata-value">${formatLocalDateMedium(selectedInspection.inspectionDate)}</div>
        </div>
        ${selectedInspection.dateInService ? `
        <div class="metadata-field">
          <div class="metadata-label">Date In Service</div>
          <div class="metadata-value">${formatLocalDateMedium(selectedInspection.dateInService)}</div>
        </div>
        ` : ''}
        <div class="metadata-field">
          <div class="metadata-label">Overall Status</div>
          <div class="metadata-value">
            <span class="status-badge status-${selectedInspection.overallStatus || 'pass'}">${(selectedInspection.overallStatus || 'pass').toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="section-header">Equipment Inspection Results</div>
    
    ${selectedInspection.equipmentFindings ? Object.entries(selectedInspection.equipmentFindings).map(([categoryKey, categoryData]: [string, any]) => `
      <div class="category-block">
        <div class="category-header ${categoryData.status === 'fail' ? 'fail' : ''}">
          <div class="category-title">${categoryKey.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</div>
          <div class="category-status ${categoryData.status}">${categoryData.status?.toUpperCase() || 'N/A'}</div>
        </div>
        <table class="inspection-table">
          <thead>
            <tr>
              <th style="width: 50%;">Inspection Item</th>
              <th style="width: 15%;">Status</th>
              <th style="width: 35%;">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${categoryData.items ? Object.entries(categoryData.items).map(([itemKey, itemData]: [string, any]) => `
              <tr>
                <td>
                  <div class="item-name">${itemKey.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</div>
                </td>
                <td>
                  <span class="item-status ${itemData.result || 'na'}">${(itemData.result || 'N/A').toUpperCase()}</span>
                </td>
                <td>
                  ${itemData.notes ? `<div class="item-notes">${itemData.notes}</div>` : '—'}
                </td>
              </tr>
            `).join('') : ''}
          </tbody>
        </table>
      </div>
    `).join('') : '<p>No inspection data available.</p>'}
    
    ${selectedInspection.comments ? `
      <div class="notes-section">
        <div class="notes-title">Additional Notes</div>
        <div class="notes-content">${selectedInspection.comments}</div>
      </div>
    ` : ''}
    
    <div class="signature-section">
      <div class="signature-block">
        <div class="signature-label">Inspector Signature</div>
      </div>
      <div class="signature-block">
        <div class="signature-label">Date</div>
      </div>
    </div>
    
    <div class="footer">
      This inspection report was generated in accordance with IRATA International Code of Practice.<br>
      Document generated on ${formatLocalDateLong(new Date().toISOString())}
    </div>
  </div>
</body>
</html>
                  `);
                  doc.close();
                  
                  setTimeout(() => {
                    printWindow.print();
                  }, 250);
                }}
                data-testid="button-download-pdf"
              >
                <span className="material-icons text-sm mr-1">download</span>
                Download PDF
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedInspection && (
            <div className="space-y-4" id="inspection-print-content">
              <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '10px'}}>Rope Access Equipment Inspection Report</h1>
              
              <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Inspector</div>
                  <div className="text-base font-semibold">{selectedInspection.inspectorName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Inspection Date</div>
                  <div className="text-base font-semibold">
                    {formatLocalDateLong(selectedInspection.inspectionDate)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Equipment ID</div>
                  <div className="text-base">{selectedInspection.equipmentId || selectedInspection.personalHarnessId || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Overall Status</div>
                  <div className="text-base">
                    <Badge variant={selectedInspection.overallStatus === 'pass' ? 'default' : 'destructive'}>
                      {selectedInspection.overallStatus === 'pass' ? 'PASS' : 'FAIL'}
                    </Badge>
                  </div>
                </div>
                {selectedInspection.manufacturer && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Manufacturer</div>
                    <div className="text-base">{selectedInspection.manufacturer}</div>
                  </div>
                )}
                {selectedInspection.model && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Model</div>
                    <div className="text-base">{selectedInspection.model}</div>
                  </div>
                )}
                {selectedInspection.dateInService && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Date In Service</div>
                    <div className="text-base">
                      {formatLocalDateMedium(selectedInspection.dateInService)}
                    </div>
                  </div>
                )}
              </div>

              {selectedInspection.equipmentFindings && Object.keys(selectedInspection.equipmentFindings).length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Equipment Inspection Results</h2>
                  {Object.entries(selectedInspection.equipmentFindings).map(([categoryKey, categoryData]: [string, any]) => (
                    <Card key={categoryKey} className="border-l-4" style={{borderLeftColor: categoryData.status === 'pass' ? '#22c55e' : '#ef4444'}}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </CardTitle>
                          <Badge variant={categoryData.status === 'pass' ? 'default' : 'destructive'}>
                            {categoryData.status === 'pass' ? 'PASS' : 'FAIL'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {categoryData.items && Object.entries(categoryData.items).map(([itemKey, itemData]: [string, any]) => (
                            <div key={itemKey} className="flex items-start justify-between p-2 rounded bg-muted/30">
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {itemKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </div>
                                {itemData.notes && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Note: {itemData.notes}
                                  </div>
                                )}
                              </div>
                              <Badge 
                                variant={itemData.result === 'pass' ? 'outline' : itemData.result === 'fail' ? 'destructive' : 'secondary'}
                                className="ml-2"
                              >
                                {itemData.result?.toUpperCase() || 'N/A'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {selectedInspection.comments && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">{t('dashboard.inspection.additionalNotes', 'Additional Notes')}</div>
                  <div className="text-base bg-muted p-4 rounded-md whitespace-pre-wrap">
                    {selectedInspection.comments}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Toolbox Meeting Details Dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">assignment</span>
              {t('dashboard.toolboxMeeting.title', 'Toolbox Meeting Details')}
            </DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{t('dashboard.toolboxMeeting.date', 'Date')}</div>
                  <div className="text-base">
                    {formatLocalDate(selectedMeeting.meetingDate, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{t('dashboard.toolboxMeeting.conductedBy', 'Conducted By')}</div>
                  <div className="text-base">{selectedMeeting.conductedByName}</div>
                </div>
              </div>

              {selectedMeeting.customTopic && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">{t('dashboard.toolboxMeeting.customTopic', 'Custom Topic')}</div>
                  <div className="text-base bg-muted p-3 rounded-md">
                    {selectedMeeting.customTopic}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">{t('dashboard.toolboxMeeting.topicsCovered', 'Topics Covered')}</div>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.topicFallProtection && <Badge>Fall Protection Systems</Badge>}
                  {selectedMeeting.topicAnchorPoints && <Badge>Anchor Point Selection</Badge>}
                  {selectedMeeting.topicRopeInspection && <Badge>Rope Inspection</Badge>}
                  {selectedMeeting.topicKnotTying && <Badge>Knot Tying Techniques</Badge>}
                  {selectedMeeting.topicPPECheck && <Badge>PPE Inspection</Badge>}
                  {selectedMeeting.topicWeatherConditions && <Badge>Weather Assessment</Badge>}
                  {selectedMeeting.topicCommunication && <Badge>Communication Protocols</Badge>}
                  {selectedMeeting.topicEmergencyEvacuation && <Badge>Emergency Procedures</Badge>}
                  {selectedMeeting.topicHazardAssessment && <Badge>Hazard Assessment</Badge>}
                  {selectedMeeting.topicLoadCalculations && <Badge>Load Calculations</Badge>}
                  {selectedMeeting.topicEquipmentCompatibility && <Badge>Equipment Compatibility</Badge>}
                  {selectedMeeting.topicDescenderAscender && <Badge>Descender/Ascender Use</Badge>}
                  {selectedMeeting.topicEdgeProtection && <Badge>Edge Protection</Badge>}
                  {selectedMeeting.topicSwingFall && <Badge>Swing Fall Hazards</Badge>}
                  {selectedMeeting.topicMedicalFitness && <Badge>Medical Fitness</Badge>}
                  {selectedMeeting.topicToolDropPrevention && <Badge>Tool Drop Prevention</Badge>}
                  {selectedMeeting.topicRegulations && <Badge>Working at Heights Regulations</Badge>}
                  {selectedMeeting.topicRescueProcedures && <Badge>Rescue Procedures</Badge>}
                  {selectedMeeting.topicSiteHazards && <Badge>Site-Specific Hazards</Badge>}
                  {selectedMeeting.topicBuddySystem && <Badge>Buddy System</Badge>}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {t('dashboard.toolboxMeeting.attendees', 'Attendees')} ({selectedMeeting.attendees?.length || 0})
                </div>
                <div className="bg-muted p-3 rounded-md">
                  {selectedMeeting.attendees?.map((attendee: string, idx: number) => (
                    <div key={idx} className="py-1">
                      {idx + 1}. {attendee}
                    </div>
                  ))}
                </div>
              </div>

              {selectedMeeting.additionalNotes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">{t('dashboard.toolboxMeeting.additionalNotes', 'Additional Notes')}</div>
                  <div className="text-base bg-muted p-3 rounded-md">
                    {selectedMeeting.additionalNotes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.logout.title', 'Confirm Logout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.logout.description', 'Are you sure you want to logout?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-logout">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} data-testid="button-confirm-logout">
              {t('dashboard.logout.logout', 'Logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Termination Details Dialog */}
      <Dialog open={showTerminationDialog} onOpenChange={(open) => {
        if (!open) {
          // If closing without submitting, clear the termination date
          editEmployeeForm.setValue("terminatedDate", "");
          setTerminationData({ reason: "", notes: "" });
        }
        setShowTerminationDialog(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.termination.title', 'Termination Details')}</DialogTitle>
            <DialogDescription>
              {t('dashboard.termination.description', 'Please provide the reason for termination and any additional notes.')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t('dashboard.termination.reasonLabel', 'Reason for Termination *')}</label>
              <Input
                value={terminationData.reason}
                onChange={(e) => setTerminationData({ ...terminationData, reason: e.target.value })}
                placeholder={t('dashboard.termination.reasonPlaceholder', 'e.g., Voluntary resignation, Performance issues, etc.')}
                className="mt-1"
                data-testid="input-termination-reason"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('dashboard.termination.notesLabel', 'Additional Notes')}</label>
              <Textarea
                value={terminationData.notes}
                onChange={(e) => setTerminationData({ ...terminationData, notes: e.target.value })}
                placeholder={t('dashboard.termination.notesPlaceholder', 'Any additional information about the termination...')}
                className="mt-1"
                rows={4}
                data-testid="input-termination-notes"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                editEmployeeForm.setValue("terminatedDate", "");
                setTerminationData({ reason: "", notes: "" });
                setShowTerminationDialog(false);
              }}
              data-testid="button-cancel-termination"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleTerminationSubmit}
              disabled={!terminationData.reason.trim()}
              data-testid="button-submit-termination"
            >
              {t('common.continue', 'Continue')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Project as Client Dialog */}
      <AlertDialog open={showSaveAsClientDialog} onOpenChange={setShowSaveAsClientDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.saveAsClient.title', 'Save as Client?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.saveAsClient.description', 'Would you like to save this information in your client database? This will make it easier to create future projects for this site.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowSaveAsClientDialog(false);
                setProjectDataForClient(null);
              }}
              data-testid="button-cancel-save-client"
            >
              {t('dashboard.saveAsClient.noThanks', 'No, Thanks')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveProjectAsClient}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-confirm-save-client"
            >
              <span className="material-icons mr-2 text-sm">person_add</span>
              {t('dashboard.saveAsClient.yesAdd', 'Yes, Add to Clients')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Project Double Booking Warning Dialog */}
      <DoubleBookingWarningDialog
        open={projectConflictDialogOpen}
        onClose={() => {
          setProjectConflictDialogOpen(false);
          setProjectPendingConflicts([]);
          setPendingProjectData(null);
        }}
        onProceed={handleForceCreateProject}
        conflicts={projectPendingConflicts}
        isPending={createProjectMutation.isPending}
      />

      {/* Accepted Team Invitation Notification Dialog */}
      <Dialog open={acceptedInvitations.length > 0 && !showInvitationEmployeeForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">celebration</span>
              {t('dashboard.invitations.newMemberTitle', 'New Team Member Joined!')}
            </DialogTitle>
            <DialogDescription>
              {t('dashboard.invitations.newMemberDesc', 'A technician has accepted your team invitation.')}
            </DialogDescription>
          </DialogHeader>
          {acceptedInvitations.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg" data-testid={`accepted-invitation-${acceptedInvitations[0]?.id}`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <span className="material-icons text-primary">person</span>
                  </div>
                  <div>
                    <p className="font-semibold text-lg" data-testid="text-accepted-tech-name">
                      {acceptedInvitations[0]?.technician?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {acceptedInvitations[0]?.technician?.email}
                    </p>
                    {(acceptedInvitations[0]?.technician?.irataLevel || acceptedInvitations[0]?.technician?.spratLevel) && (
                      <div className="flex items-center gap-2 mt-1">
                        {acceptedInvitations[0]?.technician?.irataLevel && (
                          <Badge variant="secondary" className="text-xs">
                            IRATA {acceptedInvitations[0]?.technician?.irataLevel}
                          </Badge>
                        )}
                        {acceptedInvitations[0]?.technician?.spratLevel && (
                          <Badge variant="secondary" className="text-xs">
                            SPRAT {acceptedInvitations[0]?.technician?.spratLevel}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {t('dashboard.invitations.setSalaryPermissions', 'Set their salary and permissions to complete the onboarding process.')}
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full h-12"
                  onClick={() => {
                    const inv = acceptedInvitations[0];
                    if (inv?.id && inv?.technician) {
                      const tech = inv.technician;
                      // Pre-populate the employee form with technician data
                      // Only set fields that exist in employeeSchema
                      employeeForm.reset({
                        name: tech.name || "",
                        email: tech.email || "",
                        password: "", // Empty - not needed for invitation conversion
                        role: "rope_access_tech", // Default role for technicians
                        hourlyRate: "",
                        isSalary: false,
                        salary: "", // String type as per schema
                        permissions: [],
                        startDate: "",
                        birthday: tech.birthday || "",
                        socialInsuranceNumber: tech.socialInsuranceNumber || "",
                        driversLicenseNumber: tech.driversLicenseNumber || "",
                        driversLicenseProvince: tech.driversLicenseProvince || "",
                        driversLicenseDocuments: tech.driversLicenseDocuments || [],
                        homeAddress: tech.homeAddress || "",
                        employeePhoneNumber: tech.employeePhoneNumber || "",
                        emergencyContactName: tech.emergencyContactName || "",
                        emergencyContactPhone: tech.emergencyContactPhone || "",
                        specialMedicalConditions: tech.specialMedicalConditions || "",
                        irataLevel: tech.irataLevel || "",
                        irataLicenseNumber: tech.irataLicenseNumber || "",
                        irataIssuedDate: tech.irataIssuedDate || "",
                        irataExpirationDate: tech.irataExpirationDate || "",
                        hasFirstAid: tech.hasFirstAid || false,
                        firstAidType: tech.firstAidType || "",
                        firstAidExpiry: tech.firstAidExpiry || "",
                        firstAidDocuments: tech.firstAidDocuments || [],
                      });
                      setInvitationToConvert(inv);
                      setEmployeeFormStep(1); // Start at info step
                      setShowInvitationEmployeeForm(true);
                    }
                  }}
                  data-testid="button-save-new-employee"
                >
                  <span className="material-icons mr-2">person_add</span>
                  {t('dashboard.invitations.completeNow', 'Complete Onboarding Now')}
                  {acceptedInvitations.length > 1 && (
                    <Badge variant="secondary" className="ml-2">
                      +{acceptedInvitations.length - 1} {t('dashboard.invitations.more', 'more')}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const inv = acceptedInvitations[0];
                    if (inv?.id) {
                      // Just acknowledge the invitation without opening the form
                      acknowledgeInvitationMutation.mutate(inv.id);
                    }
                  }}
                  data-testid="button-do-later"
                >
                  <span className="material-icons mr-2 text-sm">schedule</span>
                  {t('dashboard.invitations.doLater', 'Do it Later')}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {t('dashboard.invitations.doLaterHint', 'You can complete the onboarding from the Employees section')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invitation Employee Form Dialog - for setting salary and permissions */}
      <Dialog open={showInvitationEmployeeForm} onOpenChange={(open) => {
        if (!open) {
          setShowInvitationEmployeeForm(false);
          setInvitationToConvert(null);
          employeeForm.reset();
          setEmployeeFormStep(0);
        }
      }}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">person_add</span>
              {t('dashboard.invitations.completeOnboarding', 'Complete Employee Onboarding')}
            </DialogTitle>
            <DialogDescription>
              {t('dashboard.invitations.reviewAndSet', 'Review the technician information and set their salary and permissions.')}
            </DialogDescription>
          </DialogHeader>
          <Form {...employeeForm}>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = employeeForm.getValues();
              
              // Validate hourly rate is provided
              const hourlyRateValue = typeof formData.salary === 'number' 
                ? formData.salary 
                : parseFloat(String(formData.salary));
              
              if (isNaN(hourlyRateValue) || hourlyRateValue <= 0) {
                toast({
                  title: t('common.error', 'Error'),
                  description: t('dashboard.invitations.hourlyRateRequired', 'Please enter a valid hourly rate'),
                  variant: 'destructive',
                });
                return;
              }
              
              if (invitationToConvert?.id) {
                // Build minimal payload - only send hourlyRate and permissions
                // First aid data already exists on technician record, don't overwrite
                const payload = {
                  invitationId: invitationToConvert.id,
                  hourlyRate: hourlyRateValue,
                  permissions: formData.permissions || [],
                };
                
                convertInvitationMutation.mutate(payload);
              }
            }} className="space-y-6">
              {employeeFormStep === 1 && (
                <>
                  {/* Read-only technician info summary */}
                  <div className="p-4 bg-muted rounded-lg space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="p-2 rounded-full bg-primary/10">
                        <span className="material-icons text-primary">person</span>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{employeeForm.watch("name")}</p>
                        <p className="text-sm text-muted-foreground">{employeeForm.watch("email")}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {employeeForm.watch("employeePhoneNumber") && (
                        <div>
                          <span className="text-muted-foreground">{t('dashboard.employeeForm.phone', 'Phone')}:</span>
                          <span className="ml-2">{employeeForm.watch("employeePhoneNumber")}</span>
                        </div>
                      )}
                      {employeeForm.watch("birthday") && (
                        <div>
                          <span className="text-muted-foreground">{t('dashboard.employeeForm.birthday', 'Birthday')}:</span>
                          <span className="ml-2">{employeeForm.watch("birthday")}</span>
                        </div>
                      )}
                      {employeeForm.watch("irataLevel") && (
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="text-muted-foreground">{t('dashboard.employeeForm.certifications', 'Certifications')}:</span>
                          <Badge variant="secondary">IRATA Level {employeeForm.watch("irataLevel")}</Badge>
                        </div>
                      )}
                      {employeeForm.watch("hasFirstAid") && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">{t('dashboard.employeeForm.firstAid', 'First Aid')}:</span>
                          <Badge variant="outline" className="ml-2">{employeeForm.watch("firstAidType")}</Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents & Certifications Section */}
                  <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="material-icons text-primary text-lg">folder_open</span>
                      {t('dashboard.invitations.documentsAndCertifications', 'Documents & Certifications')}
                    </h4>
                    
                    <div className="space-y-3">
                      {/* IRATA License */}
                      {(invitationToConvert?.technician?.irataLicenseNumber || invitationToConvert?.technician?.irataDocuments?.length > 0) && (
                        <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-orange-500">badge</span>
                            <div>
                              <p className="font-medium text-sm">{t('dashboard.invitations.irataLicense', 'IRATA License')}</p>
                              {invitationToConvert?.technician?.irataLicenseNumber && (
                                <p className="text-xs text-muted-foreground">
                                  {t('dashboard.invitations.licenseNumber', 'License #')}: {invitationToConvert.technician.irataLicenseNumber}
                                </p>
                              )}
                              {invitationToConvert?.technician?.irataExpirationDate && (
                                <p className="text-xs text-muted-foreground">
                                  {t('dashboard.invitations.expiryDate', 'Expiry')}: {invitationToConvert.technician.irataExpirationDate}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {invitationToConvert?.technician?.irataVerifiedAt ? (
                              <Badge variant="default" className="bg-green-600">
                                <span className="material-icons text-xs mr-1">verified</span>
                                {t('dashboard.invitations.verified', 'Verified')}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-amber-500 text-amber-600">
                                <span className="material-icons text-xs mr-1">pending</span>
                                {t('dashboard.invitations.notVerified', 'Not Verified')}
                              </Badge>
                            )}
                            {invitationToConvert?.technician?.irataDocuments?.map((doc: string, idx: number) => (
                              <Button key={idx} variant="ghost" size="icon" asChild>
                                <a href={doc} target="_blank" rel="noopener noreferrer" title={t('dashboard.invitations.viewDocument', 'View Document')}>
                                  <span className="material-icons text-sm">open_in_new</span>
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SPRAT License */}
                      {(invitationToConvert?.technician?.spratLicenseNumber || invitationToConvert?.technician?.spratDocuments?.length > 0) && (
                        <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-blue-500">badge</span>
                            <div>
                              <p className="font-medium text-sm">{t('dashboard.invitations.spratLicense', 'SPRAT License')}</p>
                              {invitationToConvert?.technician?.spratLicenseNumber && (
                                <p className="text-xs text-muted-foreground">
                                  {t('dashboard.invitations.licenseNumber', 'License #')}: {invitationToConvert.technician.spratLicenseNumber}
                                </p>
                              )}
                              {invitationToConvert?.technician?.spratExpirationDate && (
                                <p className="text-xs text-muted-foreground">
                                  {t('dashboard.invitations.expiryDate', 'Expiry')}: {invitationToConvert.technician.spratExpirationDate}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {invitationToConvert?.technician?.spratVerifiedAt ? (
                              <Badge variant="default" className="bg-green-600">
                                <span className="material-icons text-xs mr-1">verified</span>
                                {t('dashboard.invitations.verified', 'Verified')}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-amber-500 text-amber-600">
                                <span className="material-icons text-xs mr-1">pending</span>
                                {t('dashboard.invitations.notVerified', 'Not Verified')}
                              </Badge>
                            )}
                            {invitationToConvert?.technician?.spratDocuments?.map((doc: string, idx: number) => (
                              <Button key={idx} variant="ghost" size="icon" asChild>
                                <a href={doc} target="_blank" rel="noopener noreferrer" title={t('dashboard.invitations.viewDocument', 'View Document')}>
                                  <span className="material-icons text-sm">open_in_new</span>
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Driver's License */}
                      {(invitationToConvert?.technician?.driversLicenseNumber || invitationToConvert?.technician?.driversLicenseDocuments?.length > 0) && (
                        <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-purple-500">credit_card</span>
                            <div>
                              <p className="font-medium text-sm">{t('dashboard.invitations.driversLicense', "Driver's License")}</p>
                              {invitationToConvert?.technician?.driversLicenseNumber && (
                                <p className="text-xs text-muted-foreground">
                                  {t('dashboard.invitations.licenseNumber', 'License #')}: {invitationToConvert.technician.driversLicenseNumber}
                                </p>
                              )}
                              {invitationToConvert?.technician?.driversLicenseExpiry && (
                                <p className="text-xs text-muted-foreground">
                                  {t('dashboard.invitations.expiryDate', 'Expiry')}: {invitationToConvert.technician.driversLicenseExpiry}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {invitationToConvert?.technician?.driversLicenseDocuments?.map((doc: string, idx: number) => (
                              <Button key={idx} variant="ghost" size="icon" asChild>
                                <a href={doc} target="_blank" rel="noopener noreferrer" title={t('dashboard.invitations.viewDocument', 'View Document')}>
                                  <span className="material-icons text-sm">open_in_new</span>
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bank Documents */}
                      {invitationToConvert?.technician?.bankDocuments?.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-green-500">account_balance</span>
                            <div>
                              <p className="font-medium text-sm">{t('dashboard.invitations.bankDocuments', 'Bank Documents')}</p>
                              <p className="text-xs text-muted-foreground">
                                {invitationToConvert.technician.bankDocuments.length} {invitationToConvert.technician.bankDocuments.length === 1 ? 'document' : 'documents'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {invitationToConvert?.technician?.bankDocuments?.map((doc: string, idx: number) => (
                              <Button key={idx} variant="ghost" size="icon" asChild>
                                <a href={doc} target="_blank" rel="noopener noreferrer" title={t('dashboard.invitations.viewDocument', 'View Document')}>
                                  <span className="material-icons text-sm">open_in_new</span>
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* First Aid Certificate */}
                      {(invitationToConvert?.technician?.hasFirstAid || invitationToConvert?.technician?.firstAidDocuments?.length > 0) && (
                        <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                          <div className="flex items-center gap-3">
                            <span className="material-icons text-red-500">medical_services</span>
                            <div>
                              <p className="font-medium text-sm">{t('dashboard.invitations.firstAidCertificate', 'First Aid Certificate')}</p>
                              {invitationToConvert?.technician?.firstAidType && (
                                <p className="text-xs text-muted-foreground">
                                  {invitationToConvert.technician.firstAidType}
                                </p>
                              )}
                              {invitationToConvert?.technician?.firstAidExpiry && (
                                <p className="text-xs text-muted-foreground">
                                  {t('dashboard.invitations.expiryDate', 'Expiry')}: {invitationToConvert.technician.firstAidExpiry}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {invitationToConvert?.technician?.firstAidDocuments?.map((doc: string, idx: number) => (
                              <Button key={idx} variant="ghost" size="icon" asChild>
                                <a href={doc} target="_blank" rel="noopener noreferrer" title={t('dashboard.invitations.viewDocument', 'View Document')}>
                                  <span className="material-icons text-sm">open_in_new</span>
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No documents message */}
                      {!invitationToConvert?.technician?.irataLicenseNumber && 
                       !invitationToConvert?.technician?.irataDocuments?.length &&
                       !invitationToConvert?.technician?.spratLicenseNumber &&
                       !invitationToConvert?.technician?.spratDocuments?.length &&
                       !invitationToConvert?.technician?.driversLicenseNumber &&
                       !invitationToConvert?.technician?.driversLicenseDocuments?.length &&
                       !invitationToConvert?.technician?.bankDocuments?.length &&
                       !invitationToConvert?.technician?.hasFirstAid &&
                       !invitationToConvert?.technician?.firstAidDocuments?.length && (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          <span className="material-icons text-2xl mb-2 block">description</span>
                          {t('dashboard.invitations.noDocumentsUploaded', 'No documents uploaded')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Salary field - required */}
                  <FormField
                    control={employeeForm.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dashboard.employeeForm.hourlyRate', 'Hourly Rate')} *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            data-testid="input-invitation-salary" 
                            className="h-12" 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {t('dashboard.employeeForm.salaryDescription', 'Enter the hourly rate for this employee')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button" 
                    className="w-full h-12" 
                    onClick={() => setEmployeeFormStep(2)}
                    data-testid="button-invitation-continue-permissions"
                  >
                    {t('dashboard.employeeForm.continueToPermissions', 'Continue to Permissions')}
                  </Button>
                </>
              )}

              {employeeFormStep === 2 && (
                <>
                  <FormField
                    control={employeeForm.control}
                    name="permissions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <FormLabel className="text-base">{t('dashboard.employeeForm.accessPermissions', 'Access Permissions')}</FormLabel>
                              <FormDescription className="text-xs">
                                {t('dashboard.employeeForm.selectPermissions', 'Select the permissions this employee should have')}
                              </FormDescription>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
                                employeeForm.setValue("permissions", allPermissionIds);
                              }}
                              data-testid="button-invitation-select-all"
                            >
                              {t('dashboard.employeeForm.selectAll', 'Select All')}
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {PERMISSION_CATEGORIES.map((category) => (
                            <div key={category.nameKey} className="border rounded-lg p-4 bg-muted/20">
                              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 pb-2 border-b">{t(category.nameKey, category.nameKey)}</h4>
                              <div className="space-y-2">
                                {category.permissions.map((permission) => (
                                  <FormField
                                    key={permission.id}
                                    control={employeeForm.control}
                                    name="permissions"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={permission.id}
                                          className="flex flex-row items-center space-x-2 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(permission.id)}
                                              onCheckedChange={(checked) => {
                                                const newPermissions = handlePermissionChange(
                                                  field.value || [],
                                                  permission.id,
                                                  !!checked
                                                );
                                                field.onChange(newPermissions);
                                              }}
                                              data-testid={`checkbox-invitation-permission-${permission.id}`}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal cursor-pointer">
                                            {t(permission.labelKey, permission.label)}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="flex-1 h-12" 
                      onClick={() => setEmployeeFormStep(1)}
                      data-testid="button-invitation-back"
                    >
                      <span className="material-icons mr-2">arrow_back</span>
                      {t('common.back', 'Back')}
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12" 
                      disabled={convertInvitationMutation.isPending}
                      data-testid="button-invitation-save-employee"
                    >
                      {convertInvitationMutation.isPending ? (
                        <>
                          <span className="material-icons animate-spin mr-2">sync</span>
                          {t('common.saving', 'Saving...')}
                        </>
                      ) : (
                        <>
                          <span className="material-icons mr-2">check</span>
                          {t('dashboard.invitations.saveEmployee', 'Save Employee')}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Employer Info Dialog for Technicians */}
      <Dialog open={showEmployerInfoDialog} onOpenChange={setShowEmployerInfoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">business</span>
              {t('dashboard.employerInfo.title', 'My Employer')}
            </DialogTitle>
            <DialogDescription>
              {t('dashboard.employerInfo.description', 'Your current employment details')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Company Name */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <span className="material-icons text-muted-foreground">apartment</span>
              <div>
                <div className="text-xs text-muted-foreground">{t('dashboard.employerInfo.companyName', 'Company')}</div>
                <div className="font-medium">{userData?.user?.companyName || t('common.unknown', 'Unknown')}</div>
              </div>
            </div>
            
            {/* Start Date */}
            {user?.startDate && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="material-icons text-muted-foreground">event</span>
                <div>
                  <div className="text-xs text-muted-foreground">{t('dashboard.employerInfo.startDate', 'Date of Hire')}</div>
                  <div className="font-medium">{formatLocalDate(user.startDate)}</div>
                </div>
              </div>
            )}
            
            {/* Duration Worked */}
            {user?.startDate && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="material-icons text-muted-foreground">schedule</span>
                <div>
                  <div className="text-xs text-muted-foreground">{t('dashboard.employerInfo.duration', 'Time with Company')}</div>
                  <div className="font-medium">
                    {(() => {
                      const start = new Date(user.startDate);
                      const now = new Date();
                      const diffMs = now.getTime() - start.getTime();
                      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                      const years = Math.floor(diffDays / 365);
                      const months = Math.floor((diffDays % 365) / 30);
                      const days = diffDays % 30;
                      
                      const parts = [];
                      if (years > 0) parts.push(`${years} ${years === 1 ? t('common.year', 'year') : t('common.years', 'years')}`);
                      if (months > 0) parts.push(`${months} ${months === 1 ? t('common.month', 'month') : t('common.months', 'months')}`);
                      if (years === 0 && days > 0) parts.push(`${days} ${days === 1 ? t('common.day', 'day') : t('common.days', 'days')}`);
                      
                      return parts.length > 0 ? parts.join(', ') : t('common.today', 'Started today');
                    })()}
                  </div>
                </div>
              </div>
            )}
            
            {/* Hourly Rate or Salary */}
            {(user?.hourlyRate || user?.salary) && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="material-icons text-muted-foreground">payments</span>
                <div>
                  <div className="text-xs text-muted-foreground">
                    {user?.isSalary 
                      ? t('dashboard.employerInfo.salary', 'Annual Salary') 
                      : t('dashboard.employerInfo.hourlyRate', 'Hourly Rate')}
                  </div>
                  <div className="font-medium">
                    {user?.isSalary 
                      ? `$${parseFloat(user.salary || '0').toLocaleString()}/year`
                      : `$${parseFloat(user.hourlyRate || '0').toFixed(2)}/hr`}
                  </div>
                </div>
              </div>
            )}
            
            {/* Role */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <span className="material-icons text-muted-foreground">badge</span>
              <div>
                <div className="text-xs text-muted-foreground">{t('dashboard.employerInfo.role', 'Role')}</div>
                <div className="font-medium capitalize">{user?.role?.replace(/_/g, ' ') || t('common.technician', 'Technician')}</div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button 
              variant="outline" 
              onClick={() => setShowEmployerInfoDialog(false)}
              className="w-full sm:w-auto"
              data-testid="button-close-employer-info"
            >
              {t('common.close', 'Close')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setShowEmployerInfoDialog(false);
                setShowLeaveCompanyDialog(true);
              }}
              className="w-full sm:w-auto"
              data-testid="button-leave-company"
            >
              <span className="material-icons text-sm mr-1">exit_to_app</span>
              {t('dashboard.employerInfo.leaveCompany', 'Leave Company')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Company Dialog for Technicians */}
      <AlertDialog open={showLeaveCompanyDialog} onOpenChange={setShowLeaveCompanyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.leaveCompany.title', 'Leave')} {userData?.user?.companyName || 'Company'}?</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.leaveCompany.warning', 'This will remove you from their active roster. You can still be invited by other companies.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-leave-company">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => leaveCompanyMutation.mutate()}
              disabled={leaveCompanyMutation.isPending}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-leave-company"
            >
              {leaveCompanyMutation.isPending 
                ? t('dashboard.leaveCompany.leaving', 'Leaving...') 
                : t('dashboard.leaveCompany.confirm', 'Yes, Leave Company')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { hasFinancialAccess } from "@/lib/permissions";
import { UnifiedDashboardHeader } from "@/components/UnifiedDashboardHeader";
import { GuidedFormTour, TourStep } from "@/components/GuidedFormTour";
import { HelpCircle } from "lucide-react";

const gearFormSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  dateOfManufacture: z.string().optional(),
  dateInService: z.string().optional(),
  dateOutOfService: z.string().optional(),
  inService: z.boolean().default(true),
  quantity: z.string().optional(),
  itemPrice: z.string().optional(),
});

type GearFormData = z.infer<typeof gearFormSchema>;

export default function GearInventory() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  const canViewPrice = hasFinancialAccess(currentUser);

  const equipmentTypes = [
    { id: "harness", name: t('gearInventory.harness.name', 'Harness'), icon: "settings_accessibility", description: t('gearInventory.harness.description', 'Full body harness') },
    { id: "descender", name: t('gearInventory.descender.name', 'Descender'), icon: "arrow_downward", description: t('gearInventory.descender.description', 'Descending device') },
    { id: "ascender", name: t('gearInventory.ascender.name', 'Ascender'), icon: "arrow_upward", description: t('gearInventory.ascender.description', 'Ascending device') },
    { id: "steel_carabiner", name: t('gearInventory.steelCarabiner.name', 'Steel Carabiner'), icon: "link", description: t('gearInventory.steelCarabiner.description', 'Steel locking carabiner') },
    { id: "aluminum_carabiner", name: t('gearInventory.aluminumCarabiner.name', 'Aluminum Carabiner'), icon: "link", description: t('gearInventory.aluminumCarabiner.description', 'Aluminum locking carabiner') },
  ];

  // Tour steps based on gear-inventory.md documentation
  const gearTourSteps: TourStep[] = [
    {
      fieldSelector: '[data-testid="input-brand"]',
      title: t('gearTour.brand.title', 'Brand / Manufacturer'),
      explanation: t('gearTour.brand.explanation', 'Enter the manufacturer name (e.g., Petzl, CMC, Rock Exotica, Skylotec, ISC, Kong). The system includes pre-populated models from major rope access equipment manufacturers.'),
      appContext: t('gearTour.brand.context', 'Accurate brand info helps with warranty claims, parts ordering, and manufacturer recall tracking.')
    },
    {
      fieldSelector: '[data-testid="input-model"]',
      title: t('gearTour.model.title', 'Model Name'),
      explanation: t('gearTour.model.explanation', 'Specify the exact model (e.g., Avao Bod, I\'D S, Rig). If your model isn\'t listed, use "Other" to add custom gear to the shared equipment database.'),
      appContext: t('gearTour.model.context', 'All companies benefit from the expanded catalog when you add new models.')
    },
    {
      fieldSelector: '[data-testid="input-serial"]',
      title: t('gearTour.serial.title', 'Serial Number'),
      explanation: t('gearTour.serial.explanation', 'Optional metadata for tracking individual units. Serial numbers are useful for warranty claims, inspection history, and identifying specific items.'),
      appContext: t('gearTour.serial.context', 'The Golden Rule: Serial numbers have NO effect on availability. Availability = Quantity - Assigned.')
    },
    {
      fieldSelector: '[data-testid="input-date-of-manufacture"]',
      title: t('gearTour.manufacture.title', 'Date of Manufacture'),
      explanation: t('gearTour.manufacture.explanation', 'Found on the equipment label. This date is critical for calculating service life. Typical service life: 5 years for hard gear, 10 years for soft gear (harnesses, ropes).'),
      appContext: t('gearTour.manufacture.context', 'Service life calculations are guidelines only. Actual replacement depends on usage intensity, conditions, and inspection results.')
    },
    {
      fieldSelector: '[data-testid="input-date-in-service"]',
      title: t('gearTour.inServiceDate.title', 'Date In Service'),
      explanation: t('gearTour.inServiceDate.explanation', 'When this equipment was first put into active use. For new gear, this is when it was issued. For used gear, enter the original in-service date if known.'),
      appContext: t('gearTour.inServiceDate.context', 'IRATA/SPRAT and manufacturer requirements often reference in-service date for inspection intervals.')
    },
    {
      fieldSelector: '[data-testid="input-date-out-of-service"]',
      title: t('gearTour.outOfService.title', 'Date Out of Service'),
      explanation: t('gearTour.outOfService.explanation', 'Leave blank for active equipment. Set this date when retiring gear due to age, damage, or inspection failure. Equipment with this date set will be marked as retired.'),
      appContext: t('gearTour.outOfService.context', 'Retired equipment stays in records for audit trail and proof of proper disposal.')
    },
    {
      fieldSelector: '[data-testid="checkbox-in-service"]',
      title: t('gearTour.inService.title', 'In Service Status'),
      explanation: t('gearTour.inService.explanation', 'Toggle this to quickly mark equipment as active or inactive. Unchecking removes the item from available inventory without deleting the record.'),
      appContext: t('gearTour.inService.context', 'Use this for temporary removal (e.g., sent for inspection/repair) without losing history.')
    },
    {
      fieldSelector: '[data-testid="input-quantity"]',
      title: t('gearTour.quantity.title', 'Total Quantity Owned'),
      explanation: t('gearTour.quantity.explanation', 'How many of this exact item your company owns. This is the key to the slot-based availability system: Available = Quantity - Assigned.'),
      appContext: t('gearTour.quantity.context', 'Example: 10 harnesses owned, 4 assigned to employees = 6 available for new assignments.')
    },
    ...(canViewPrice ? [{
      fieldSelector: '[data-testid="input-item-price"]',
      title: t('gearTour.price.title', 'Unit Price'),
      explanation: t('gearTour.price.explanation', 'Purchase price per unit. This field is only visible to users with financial access permissions. Used for asset valuation and replacement budgeting.'),
      appContext: t('gearTour.price.context', 'Track equipment costs for insurance documentation and capital planning.')
    }] : [])
  ];

  const form = useForm<GearFormData>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      serialNumber: "",
      dateOfManufacture: "",
      dateInService: "",
      dateOutOfService: "",
      inService: true,
      quantity: "1",
      itemPrice: "",
    },
  });

  const handleEquipmentClick = (equipmentId: string) => {
    setSelectedEquipment(equipmentId);
    setIsDialogOpen(true);
    form.reset({
      brand: "",
      model: "",
      serialNumber: "",
      dateOfManufacture: "",
      dateInService: "",
      dateOutOfService: "",
      inService: true,
      quantity: "1",
      itemPrice: "",
    });
  };

  const onSubmit = (data: GearFormData) => {
    console.log("Submitting gear item:", { equipmentType: selectedEquipment, ...data });
    setIsDialogOpen(false);
  };

  const selectedEquipmentData = equipmentTypes.find(e => e.id === selectedEquipment);

  return (
    <div className="min-h-screen bg-background pb-20">
      <UnifiedDashboardHeader
        variant="employer"
        currentUser={currentUser}
        pageTitle={t('gearInventory.title', 'Build my Kit')}
        pageDescription={t('gearInventory.subtitle', 'Manage your equipment inventory')}
        showSearch={false}
      />

      {/* Content */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentTypes.map((equipment) => (
            <Card
              key={equipment.id}
              className="hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => handleEquipmentClick(equipment.id)}
              data-testid={`card-equipment-${equipment.id}`}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{equipment.name}</CardTitle>
                  <CardDescription className="text-sm truncate">
                    {equipment.description}
                  </CardDescription>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-icons text-primary text-2xl">
                      {equipment.icon}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('gearInventory.tapToAdd', 'Tap to add or view details')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Equipment Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setIsTourActive(false);
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" ref={dialogContentRef}>
          <DialogHeader>
            <div className="flex items-center justify-between gap-2">
              <DialogTitle>{selectedEquipmentData?.name}</DialogTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsTourActive(!isTourActive)}
                className={isTourActive ? "text-primary" : "text-muted-foreground"}
                data-testid="button-toggle-gear-tour"
                title={t('common.toggleHelpGuide', 'Toggle help guide')}
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
            <DialogDescription>
              {t('gearInventory.dialog.description', 'Enter equipment details (all fields are optional)')}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gearInventory.dialog.brand', 'Brand')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('gearInventory.dialog.brandPlaceholder', 'e.g., Petzl')} {...field} data-testid="input-brand" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gearInventory.dialog.model', 'Model')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('gearInventory.dialog.modelPlaceholder', 'e.g., Avao Bod')} {...field} data-testid="input-model" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gearInventory.dialog.serialNumber', 'Serial Number')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('gearInventory.dialog.serialPlaceholder', 'e.g., SN123456')} {...field} data-testid="input-serial" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfManufacture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gearInventory.dialog.dateOfManufacture', 'Date of Manufacture')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-date-of-manufacture" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateInService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gearInventory.dialog.dateInService', 'Date In Service')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-date-in-service" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOutOfService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gearInventory.dialog.dateOutOfService', 'Date Out of Service')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-date-out-of-service" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inService"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-in-service"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t('gearInventory.dialog.inService', 'In Service')}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gearInventory.dialog.quantity', 'Quantity')}</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="1" {...field} data-testid="input-quantity" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {canViewPrice && (
                <FormField
                  control={form.control}
                  name="itemPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('gearInventory.dialog.itemPrice', 'Item Price')}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} data-testid="input-item-price" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                  data-testid="button-cancel"
                >
                  {t('gearInventory.dialog.cancel', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  data-testid="button-save"
                >
                  {t('gearInventory.dialog.save', 'Save')}
                </Button>
              </div>
            </form>
          </Form>

          {/* Guided Tour */}
          <GuidedFormTour
            steps={gearTourSteps}
            isActive={isTourActive}
            onClose={() => setIsTourActive(false)}
            containerRef={dialogContentRef}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
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

const gearFormSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  dateInService: z.string().optional(),
  dateOutOfService: z.string().optional(),
  inService: z.boolean().default(true),
  quantity: z.string().optional(),
  itemPrice: z.string().optional(),
});

type GearFormData = z.infer<typeof gearFormSchema>;

export default function GearInventory() {
  const [, setLocation] = useLocation();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  const canViewPrice = hasFinancialAccess(currentUser);

  const equipmentTypes = [
    { id: "harness", name: "Harness", icon: "settings_accessibility", description: "Full body harness" },
    { id: "descender", name: "Descender", icon: "arrow_downward", description: "Descending device" },
    { id: "ascender", name: "Ascender", icon: "arrow_upward", description: "Ascending device" },
    { id: "steel_carabiner", name: "Steel Carabiner", icon: "link", description: "Steel locking carabiner" },
    { id: "aluminum_carabiner", name: "Aluminum Carabiner", icon: "link", description: "Aluminum locking carabiner" },
  ];

  const form = useForm<GearFormData>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      serialNumber: "",
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
      dateInService: "",
      dateOutOfService: "",
      inService: true,
      quantity: "1",
      itemPrice: "",
    });
  };

  const onSubmit = (data: GearFormData) => {
    console.log("Submitting gear item:", { equipmentType: selectedEquipment, ...data });
    // TODO: Connect to backend API
    setIsDialogOpen(false);
  };

  const selectedEquipmentData = equipmentTypes.find(e => e.id === selectedEquipment);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b shadow-md">
        <div className="px-4 h-20 flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Build my Kit</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your equipment inventory
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="min-w-11 min-h-11"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
          >
            <span className="material-icons">arrow_back</span>
          </Button>
        </div>
      </header>

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
                  Tap to add or view details
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Equipment Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEquipmentData?.name}</DialogTitle>
            <DialogDescription>
              Enter equipment details (all fields are optional)
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Petzl" {...field} data-testid="input-brand" />
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
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Avao Bod" {...field} data-testid="input-model" />
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
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SN123456" {...field} data-testid="input-serial" />
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
                    <FormLabel>Date In Service</FormLabel>
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
                    <FormLabel>Date Out of Service</FormLabel>
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
                        In Service
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
                    <FormLabel>Quantity</FormLabel>
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
                      <FormLabel>Item Price</FormLabel>
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  data-testid="button-save"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

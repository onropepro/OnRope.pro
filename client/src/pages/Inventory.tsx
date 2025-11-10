import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGearItemSchema, type InsertGearItem, type GearItem } from "@shared/schema";
import { ArrowLeft, Plus } from "lucide-react";
import { hasFinancialAccess } from "@/lib/permissions";

const gearTypes = [
  "Harness",
  "Rope",
  "Carabiner",
  "Descender",
  "Ascender",
  "Helmet",
  "Gloves",
  "Other"
];

export default function Inventory() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Fetch current user
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  const canViewFinancials = hasFinancialAccess(currentUser);

  // Fetch all gear items
  const { data: gearData, isLoading } = useQuery<{ items: GearItem[] }>({
    queryKey: ["/api/gear-items"],
  });

  const form = useForm<InsertGearItem>({
    resolver: zodResolver(insertGearItemSchema.omit({ id: true, employeeId: true, companyId: true, createdAt: true, updatedAt: true })),
    defaultValues: {
      equipmentType: "",
      brand: "",
      model: "",
      itemPrice: "",
      possessionOf: "",
      notes: "",
      serialNumber: "",
      dateInService: "",
      dateOutOfService: "",
      inService: true,
      quantity: 1,
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: InsertGearItem) => {
      return apiRequest("/api/gear-items", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: "Item Added",
        description: "The gear item has been added to inventory.",
      });
      setShowAddDialog(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = (data: InsertGearItem) => {
    addItemMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b shadow-md">
        <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">Inventory Management</h1>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto space-y-4">
        {/* Add Item Card */}
        <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => setShowAddDialog(true)} data-testid="card-add-item">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Add Item to Inventory</CardTitle>
                <CardDescription>Add new gear to the inventory system</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* View Inventory Section */}
        <Card>
          <CardHeader>
            <CardTitle>All Inventory Items</CardTitle>
            <CardDescription>View all gear items in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading inventory...</div>
            ) : !gearData?.items || gearData.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items in inventory yet. Click "Add Item to Inventory" to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {gearData.items.map((item) => (
                  <Card key={item.id} className="bg-muted/30" data-testid={`item-${item.id}`}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="font-semibold mb-1">{item.equipmentType || "Gear Item"}</div>
                          {item.brand && (
                            <div className="text-sm text-muted-foreground">Brand: {item.brand}</div>
                          )}
                          {item.model && (
                            <div className="text-sm text-muted-foreground">Model: {item.model}</div>
                          )}
                          {item.possessionOf && (
                            <div className="text-sm text-muted-foreground">
                              Possession of: {item.possessionOf}
                            </div>
                          )}
                          {item.quantity && item.quantity > 1 && (
                            <div className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </div>
                          )}
                        </div>
                        <div>
                          {canViewFinancials && item.itemPrice && (
                            <div className="text-sm font-semibold text-primary mb-1">
                              ${parseFloat(item.itemPrice).toFixed(2)}
                            </div>
                          )}
                          {item.notes && (
                            <div className="text-sm text-muted-foreground">
                              Notes: {item.notes}
                            </div>
                          )}
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

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent data-testid="dialog-add-item">
          <DialogHeader>
            <DialogTitle>Add Item to Inventory</DialogTitle>
            <DialogDescription>All fields are optional. Fill in what you know.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
              <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-item-type">
                          <SelectValue placeholder="Select gear type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gearTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                      <Input placeholder="e.g., I'D S" {...field} data-testid="input-model" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {canViewFinancials && (
                <FormField
                  control={form.control}
                  name="itemPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          data-testid="input-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="possessionOf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Possession of</FormLabel>
                    <FormControl>
                      <Input placeholder="Who has this item?" {...field} data-testid="input-possession" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional information..." {...field} data-testid="textarea-notes" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addItemMutation.isPending} data-testid="button-submit">
                  {addItemMutation.isPending ? "Adding..." : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
import { ArrowLeft, Plus, Pencil, X } from "lucide-react";
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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  const [serialNumbers, setSerialNumbers] = useState<string[]>([""]);

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

  const form = useForm<Partial<InsertGearItem>>({
    defaultValues: {
      equipmentType: undefined,
      brand: undefined,
      model: undefined,
      itemPrice: undefined,
      possessionOf: undefined,
      notes: undefined,
      quantity: 1,
      serialNumbers: undefined,
      dateInService: undefined,
      dateOutOfService: undefined,
      inService: true,
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: Partial<InsertGearItem>) => {
      return apiRequest("POST", "/api/gear-items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: "Item Added",
        description: "The gear item has been added to inventory.",
      });
      setShowAddDialog(false);
      form.reset();
      setSerialNumbers([""]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item",
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertGearItem> }) => {
      return apiRequest("PATCH", `/api/gear-items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: "Item Updated",
        description: "The gear item has been updated.",
      });
      setShowEditDialog(false);
      setEditingItem(null);
      form.reset();
      setSerialNumbers([""]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = (data: Partial<InsertGearItem>) => {
    const filteredSerials = serialNumbers.filter(sn => sn.trim() !== "");
    const finalData = {
      ...data,
      serialNumbers: filteredSerials.length > 0 ? filteredSerials : undefined,
    };
    addItemMutation.mutate(finalData);
  };

  const handleEditItem = (data: Partial<InsertGearItem>) => {
    if (editingItem) {
      const filteredSerials = serialNumbers.filter(sn => sn.trim() !== "");
      const finalData = {
        ...data,
        serialNumbers: filteredSerials.length > 0 ? filteredSerials : undefined,
      };
      updateItemMutation.mutate({ id: editingItem.id, data: finalData });
    }
  };

  const addSerialNumberField = () => {
    const quantity = form.getValues("quantity") || 1;
    if (serialNumbers.length < quantity) {
      setSerialNumbers([...serialNumbers, ""]);
    } else {
      toast({
        title: "Limit Reached",
        description: `Cannot add more than ${quantity} serial numbers.`,
        variant: "destructive",
      });
    }
  };

  const removeSerialNumberField = (index: number) => {
    if (serialNumbers.length > 1) {
      setSerialNumbers(serialNumbers.filter((_, i) => i !== index));
    }
  };

  const updateSerialNumber = (index: number, value: string) => {
    const updated = [...serialNumbers];
    updated[index] = value;
    setSerialNumbers(updated);
  };

  const openEditDialog = (item: GearItem) => {
    setEditingItem(item);
    form.reset({
      equipmentType: item.equipmentType || undefined,
      brand: item.brand || undefined,
      model: item.model || undefined,
      itemPrice: item.itemPrice || undefined,
      possessionOf: item.possessionOf || undefined,
      notes: item.notes || undefined,
      quantity: item.quantity || 1,
      serialNumbers: item.serialNumbers || undefined,
      dateInService: item.dateInService || undefined,
      dateOutOfService: item.dateOutOfService || undefined,
      inService: item.inService,
    });
    setSerialNumbers(item.serialNumbers && item.serialNumbers.length > 0 ? item.serialNumbers : [""]);
    setShowEditDialog(true);
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
                <CardTitle>Add Inventory Item</CardTitle>
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
                      <div className="flex items-start justify-between gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          <div>
                            <div className="font-semibold mb-1">{item.equipmentType || "Gear Item"}</div>
                            {item.brand && (
                              <div className="text-sm text-muted-foreground">Brand: {item.brand}</div>
                            )}
                            {item.model && (
                              <div className="text-sm text-muted-foreground">Model: {item.model}</div>
                            )}
                            <div className="text-sm font-medium text-foreground mt-1">
                              Quantity: {item.quantity || 1}
                            </div>
                            {item.serialNumbers && item.serialNumbers.length > 0 && (
                              <div className="text-sm text-muted-foreground space-y-0.5">
                                <div className="font-medium">Serial Numbers:</div>
                                {item.serialNumbers.map((sn, idx) => (
                                  <div key={idx} className="pl-2">• {sn}</div>
                                ))}
                              </div>
                            )}
                            {item.possessionOf && (
                              <div className="text-sm text-muted-foreground">
                                Possession of: {item.possessionOf}
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
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditDialog(item)}
                          data-testid={`button-edit-${item.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
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
            <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
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
                      <Input placeholder="e.g., Petzl" {...field} value={field.value || ""} data-testid="input-brand" />
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
                      <Input placeholder="e.g., I'D S" {...field} value={field.value || ""} data-testid="input-model" />
                    </FormControl>
                    <FormMessage />
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
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        {...field}
                        value={field.value || 1}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-quantity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Serial Numbers Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Serial Numbers (Optional)</FormLabel>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addSerialNumberField}
                    disabled={serialNumbers.length >= (form.watch("quantity") || 1)}
                    data-testid="button-add-serial-field"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Serial #
                  </Button>
                </div>
                <div className="space-y-2">
                  {serialNumbers.map((sn, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Serial number ${index + 1}`}
                        value={sn}
                        onChange={(e) => updateSerialNumber(index, e.target.value)}
                        data-testid={`input-serial-${index}`}
                      />
                      {serialNumbers.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSerialNumberField(index)}
                          data-testid={`button-remove-serial-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="possessionOf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Possession of</FormLabel>
                    <FormControl>
                      <Input placeholder="Who has this item?" {...field} value={field.value || ""} data-testid="input-possession" />
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
                      <Textarea placeholder="Additional information..." {...field} value={field.value || ""} data-testid="textarea-notes" />
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
                          value={field.value || ""}
                          data-testid="input-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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

      {/* Edit Item Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent data-testid="dialog-edit-item">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>Update the item details.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditItem)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-item-type-edit">
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
                      <Input placeholder="e.g., Petzl" {...field} value={field.value || ""} data-testid="input-brand-edit" />
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
                      <Input placeholder="e.g., I'D S" {...field} value={field.value || ""} data-testid="input-model-edit" />
                    </FormControl>
                    <FormMessage />
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
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        {...field}
                        value={field.value || 1}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-quantity-edit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Serial Numbers Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Serial Numbers (Optional)</FormLabel>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addSerialNumberField}
                    disabled={serialNumbers.length >= (form.watch("quantity") || 1)}
                    data-testid="button-add-serial-field-edit"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Serial #
                  </Button>
                </div>
                <div className="space-y-2">
                  {serialNumbers.map((sn, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Serial number ${index + 1}`}
                        value={sn}
                        onChange={(e) => updateSerialNumber(index, e.target.value)}
                        data-testid={`input-serial-edit-${index}`}
                      />
                      {serialNumbers.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSerialNumberField(index)}
                          data-testid={`button-remove-serial-edit-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="possessionOf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Possession of</FormLabel>
                    <FormControl>
                      <Input placeholder="Who has this item?" {...field} value={field.value || ""} data-testid="input-possession-edit" />
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
                      <Textarea placeholder="Additional information..." {...field} value={field.value || ""} data-testid="textarea-notes-edit" />
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
                          value={field.value || ""}
                          data-testid="input-price-edit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingItem(null);
                    form.reset();
                  }}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateItemMutation.isPending} data-testid="button-submit-edit">
                  {updateItemMutation.isPending ? "Updating..." : "Update Item"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

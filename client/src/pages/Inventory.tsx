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
import { ArrowLeft, Plus, Pencil, X, Trash2, Shield, Cable, Link2, Gauge, TrendingUp, HardHat, Hand, Fuel, Scissors, PaintBucket, Droplets, CircleDot, Lock, Anchor, MoreHorizontal } from "lucide-react";
import { hasFinancialAccess } from "@/lib/permissions";

const gearTypes = [
  { name: "Harness", icon: Shield },
  { name: "Rope", icon: Cable },
  { name: "Carabiner", icon: Link2 },
  { name: "Descender", icon: Gauge },
  { name: "Ascender", icon: TrendingUp },
  { name: "Helmet", icon: HardHat },
  { name: "Gloves", icon: Hand },
  { name: "Work positioning device", icon: Shield },
  { name: "Gas powered equipment", icon: Fuel },
  { name: "Squeegee rubbers", icon: Scissors },
  { name: "Applicators", icon: PaintBucket },
  { name: "Soap", icon: Droplets },
  { name: "Suction cup", icon: CircleDot },
  { name: "Back up device", icon: Lock },
  { name: "Lanyard", icon: Anchor },
  { name: "Other", icon: MoreHorizontal }
];

export default function Inventory() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const [currentSerialNumber, setCurrentSerialNumber] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GearItem | null>(null);
  const [customType, setCustomType] = useState("");
  const [addItemStep, setAddItemStep] = useState(1);

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

  // Fetch active employees for dropdown
  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
  });
  
  // Filter for active employees only
  const activeEmployees = (employeesData?.employees || []).filter((emp: any) => !emp.terminatedDate);

  const form = useForm<Partial<InsertGearItem>>({
    defaultValues: {
      equipmentType: undefined,
      brand: undefined,
      model: undefined,
      itemPrice: undefined,
      assignedTo: "Not in use",
      notes: undefined,
      quantity: undefined,
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
      setSerialNumbers([]);
      setCurrentSerialNumber("");
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
      setSerialNumbers([]);
      setCurrentSerialNumber("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/gear-items/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      toast({
        title: "Item Deleted",
        description: "The gear item has been removed from inventory.",
      });
      setShowDeleteDialog(false);
      setItemToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = (data: Partial<InsertGearItem>) => {
    const finalData = {
      ...data,
      equipmentType: customType || data.equipmentType, // Use custom type if provided
      assignedTo: data.assignedTo?.trim() || "Not in use",
      serialNumbers: serialNumbers.length > 0 ? serialNumbers : undefined,
    };
    addItemMutation.mutate(finalData);
  };

  const handleEditItem = (data: Partial<InsertGearItem>) => {
    if (editingItem) {
      const finalData = {
        ...data,
        equipmentType: customType || data.equipmentType, // Use custom type if provided
        assignedTo: data.assignedTo?.trim() || "Not in use",
        serialNumbers: serialNumbers.length > 0 ? serialNumbers : undefined,
      };
      updateItemMutation.mutate({ id: editingItem.id, data: finalData });
    }
  };

  const handleAddSerialNumber = () => {
    const quantity = form.getValues("quantity");
    const maxSerials = quantity !== undefined ? quantity : 1;
    
    if (!currentSerialNumber.trim()) {
      toast({
        title: "Empty Serial Number",
        description: "Please enter a serial number before adding.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicate serial number
    if (serialNumbers.includes(currentSerialNumber.trim())) {
      toast({
        title: "Duplicate Serial Number",
        description: "This serial number has already been added.",
        variant: "destructive",
      });
      return;
    }
    
    if (maxSerials === 0) {
      toast({
        title: "No Stock",
        description: "Quantity is 0. Cannot add serial numbers.",
        variant: "destructive",
      });
      return;
    }
    
    if (serialNumbers.length >= maxSerials) {
      toast({
        title: "Limit Reached",
        description: `Cannot add more than ${maxSerials} serial numbers.`,
        variant: "destructive",
      });
      return;
    }
    
    // Add the serial number to the list
    setSerialNumbers([...serialNumbers, currentSerialNumber.trim()]);
    
    // Clear the field for next entry
    setCurrentSerialNumber("");
    
    toast({
      title: "Serial Number Added",
      description: `Added: ${currentSerialNumber.trim()}. Enter another or save the item.`,
    });
  };

  const removeSerialNumber = (index: number) => {
    setSerialNumbers(serialNumbers.filter((_, i) => i !== index));
  };

  const openAddDialog = () => {
    setEditingItem(null);
    form.reset({
      equipmentType: "",
      brand: "",
      model: "",
      itemPrice: "",
      assignedTo: "Not in use",
      notes: "",
      quantity: undefined,
      serialNumbers: [],
      dateInService: "",
      dateOutOfService: "",
      inService: true,
    });
    setSerialNumbers([]);
    setCurrentSerialNumber("");
    setCustomType("");
    setAddItemStep(1);
    setShowAddDialog(true);
  };

  const openEditDialog = (item: GearItem) => {
    setEditingItem(item);
    form.reset({
      equipmentType: item.equipmentType || undefined,
      brand: item.brand || undefined,
      model: item.model || undefined,
      itemPrice: item.itemPrice || undefined,
      assignedTo: item.assignedTo || "Not in use",
      notes: item.notes || undefined,
      quantity: item.quantity || 1,
      serialNumbers: item.serialNumbers || undefined,
      dateInService: item.dateInService || undefined,
      dateOutOfService: item.dateOutOfService || undefined,
      inService: item.inService,
    });
    setSerialNumbers(item.serialNumbers || []);
    setCurrentSerialNumber("");
    // Check if type is a custom type (not in predefined list)
    const gearTypeNames = gearTypes.map(t => t.name);
    if (item.equipmentType && !gearTypeNames.includes(item.equipmentType)) {
      setCustomType(item.equipmentType);
      form.setValue("equipmentType", "Other");
    } else {
      setCustomType("");
    }
    setShowEditDialog(true);
  };

  const openDeleteDialog = (item: GearItem) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      deleteItemMutation.mutate(itemToDelete.id);
    }
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
        <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={openAddDialog} data-testid="card-add-item">
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
                            <div className="text-sm text-muted-foreground">
                              Assigned to: {item.assignedTo || "Not in use"}
                            </div>
                          </div>
                          <div>
                            {canViewFinancials && item.itemPrice && (
                              <div className="space-y-0.5 mb-1">
                                <div className="text-sm font-semibold text-primary">
                                  ${parseFloat(item.itemPrice).toFixed(2)} each
                                </div>
                                {item.quantity && item.quantity > 1 && (
                                  <div className="text-sm font-medium text-primary/80">
                                    Total: ${(parseFloat(item.itemPrice) * item.quantity).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            )}
                            {item.notes && (
                              <div className="text-sm text-muted-foreground">
                                Notes: {item.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditDialog(item)}
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openDeleteDialog(item)}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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
        <DialogContent data-testid="dialog-add-item" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{addItemStep === 1 ? "Select Item Type" : "Add Item Details"}</DialogTitle>
            <DialogDescription>
              {addItemStep === 1 ? "Choose the type of gear you're adding" : "Fill in the item information"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
              
              {addItemStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="equipmentType"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-1">
                          {gearTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                              <Card
                                key={type.name}
                                className={`cursor-pointer hover-elevate active-elevate-2 transition-all ${
                                  field.value === type.name ? "bg-primary/10 border-primary border-2" : ""
                                }`}
                                onClick={() => {
                                  field.onChange(type.name);
                                  if (type.name !== "Other") {
                                    setCustomType("");
                                  }
                                }}
                                data-testid={`card-type-${type.name.toLowerCase().replace(/\s+/g, "-")}`}
                              >
                                <CardContent className="p-4 flex flex-col items-center gap-2">
                                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                    field.value === type.name ? "bg-primary text-primary-foreground" : "bg-muted"
                                  }`}>
                                    <IconComponent className="h-5 w-5" />
                                  </div>
                                  <div className="text-xs text-center font-medium leading-tight">{type.name}</div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(form.watch("equipmentType") === "Other" || customType) && (
                    <div className="space-y-2">
                      <FormLabel>Custom Type Name</FormLabel>
                      <Input
                        placeholder="Enter custom gear type"
                        value={customType}
                        onChange={(e) => {
                          setCustomType(e.target.value);
                        }}
                        data-testid="input-custom-type"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                      className="flex-1"
                      data-testid="button-cancel-step1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!form.getValues("equipmentType")) {
                          toast({
                            title: "Type Required",
                            description: "Please select a gear type to continue.",
                            variant: "destructive",
                          });
                          return;
                        }
                        setAddItemStep(2);
                      }}
                      className="flex-1"
                      data-testid="button-continue-step1"
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}

              {addItemStep === 2 && (
                <>
                  <div className="max-h-[60vh] overflow-y-auto px-1 space-y-4">

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
                        min="0"
                        placeholder="Enter quantity"
                        {...field}
                        value={field.value !== undefined && field.value !== null ? field.value : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                          field.onChange(val === undefined || isNaN(val) ? undefined : val);
                        }}
                        data-testid="input-quantity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assigned To Field */}
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "Not in use"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-assigned-to">
                          <SelectValue placeholder="Select employee or Not in use" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not in use">Not in use</SelectItem>
                        {activeEmployees.map((emp: any) => (
                          <SelectItem key={emp.id} value={emp.name}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Serial Number Entry */}
              <div className="space-y-3">
                <FormLabel>Serial Numbers (Optional)</FormLabel>
                
                {/* Current Serial Number Input */}
                <div className="space-y-2">
                  <Input
                    placeholder="Enter serial number"
                    value={currentSerialNumber}
                    onChange={(e) => setCurrentSerialNumber(e.target.value)}
                    data-testid="input-current-serial"
                  />
                  
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleAddSerialNumber}
                    disabled={serialNumbers.length >= (form.watch("quantity") || 1)}
                    data-testid="button-add-serial"
                    className="w-full"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Serial Number ({serialNumbers.length}/{form.watch("quantity") || 1})
                  </Button>
                </div>

                {/* Added Serial Numbers List */}
                {serialNumbers.length > 0 && (
                  <div className="space-y-1 bg-muted/30 p-3 rounded-md">
                    <div className="text-sm font-medium">Added Serial Numbers:</div>
                    {serialNumbers.map((sn, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>• {sn}</span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSerialNumber(index)}
                          data-testid={`button-remove-serial-${index}`}
                          className="h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddItemStep(1)}
                      data-testid="button-back-step2"
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={addItemMutation.isPending} data-testid="button-submit" className="flex-1">
                      {addItemMutation.isPending ? "Adding..." : "Add Item"}
                    </Button>
                  </div>
                </>
              )}
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
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== "Other") {
                          setCustomType("");
                        }
                      }} 
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-item-type-edit">
                          <SelectValue placeholder="Select gear type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gearTypes.map((type) => (
                          <SelectItem key={type.name} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(form.watch("equipmentType") === "Other" || customType) && (
                <div className="space-y-2">
                  <FormLabel>Custom Type Name</FormLabel>
                  <Input
                    placeholder="Enter custom gear type"
                    value={customType}
                    onChange={(e) => {
                      setCustomType(e.target.value);
                    }}
                    data-testid="input-custom-type-edit"
                  />
                </div>
              )}

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
                        min="0"
                        placeholder="0"
                        {...field}
                        value={field.value !== undefined && field.value !== null ? field.value : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                        data-testid="input-quantity-edit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assigned To Field */}
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "Not in use"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-assigned-to-edit">
                          <SelectValue placeholder="Select employee or Not in use" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not in use">Not in use</SelectItem>
                        {activeEmployees.map((emp: any) => (
                          <SelectItem key={emp.id} value={emp.name}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Serial Number Entry */}
              <div className="space-y-3">
                <FormLabel>Serial Numbers (Optional)</FormLabel>
                
                {/* Current Serial Number Input */}
                <div className="space-y-2">
                  <Input
                    placeholder="Enter serial number"
                    value={currentSerialNumber}
                    onChange={(e) => setCurrentSerialNumber(e.target.value)}
                    data-testid="input-current-serial-edit"
                  />
                  
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleAddSerialNumber}
                    disabled={serialNumbers.length >= (form.watch("quantity") || 1)}
                    data-testid="button-add-serial-edit"
                    className="w-full"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Serial Number ({serialNumbers.length}/{form.watch("quantity") || 1})
                  </Button>
                </div>

                {/* Added Serial Numbers List */}
                {serialNumbers.length > 0 && (
                  <div className="space-y-1 bg-muted/30 p-3 rounded-md">
                    <div className="text-sm font-medium">Added Serial Numbers:</div>
                    {serialNumbers.map((sn, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>• {sn}</span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSerialNumber(index)}
                          data-testid={`button-remove-serial-edit-${index}`}
                          className="h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent data-testid="dialog-delete-item">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item from inventory? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {itemToDelete && (
            <div className="py-4">
              <div className="space-y-1">
                <div className="font-medium">{itemToDelete.equipmentType || "Gear Item"}</div>
                {itemToDelete.brand && <div className="text-sm text-muted-foreground">Brand: {itemToDelete.brand}</div>}
                {itemToDelete.model && <div className="text-sm text-muted-foreground">Model: {itemToDelete.model}</div>}
                <div className="text-sm text-muted-foreground">Quantity: {itemToDelete.quantity || 1}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setItemToDelete(null);
              }}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
              disabled={deleteItemMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteItemMutation.isPending ? "Deleting..." : "Delete Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

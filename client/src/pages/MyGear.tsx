import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { hasFinancialAccess } from "@/lib/permissions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

const EQUIPMENT_ICONS: Record<string, string> = {
  Harness: "security",
  Rope: "architecture",
  Carabiner: "link",
  Descender: "arrow_downward",
  Ascender: "arrow_upward",
  Helmet: "sports_mma",
  Gloves: "back_hand",
  "Gas powered equipment": "power",
  "Squeegee rubbers": "cleaning_services",
  Applicators: "brush",
  Soap: "soap",
  "Suction cup": "panorama_fish_eye",
  "Back up device": "shield",
  Lanyard: "cable",
  "Work positioning device": "swap_vert",
  Other: "category",
};

export default function MyGear() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAddGearDialog, setShowAddGearDialog] = useState(false);
  const [selectedGearItem, setSelectedGearItem] = useState<any>(null);
  const [assignQuantity, setAssignQuantity] = useState(1);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: gearData, isLoading } = useQuery<{ items: any[] }>({
    queryKey: ["/api/gear-items"],
  });

  const currentUser = userData?.user;
  const canSeeFinancials = hasFinancialAccess(currentUser);
  const allGearItems = gearData?.items || [];

  // Filter gear items assigned to current user
  const myGear = allGearItems.filter((item: any) => item.assignedTo === currentUser?.name);

  // Available gear items (inventory items that can be assigned)
  // For items with serial numbers, availableQuantity is set by backend (count of unassigned serials)
  // For bulk items, calculate available: total quantity minus assigned quantity
  const availableGear = allGearItems.filter((item: any) => {
    if (item.inService === false) return false;
    // If backend provided availableQuantity (for serial-tracked items), use that
    if (item.availableQuantity !== undefined) {
      return item.availableQuantity > 0;
    }
    // Otherwise calculate for bulk items
    const totalQty = item.quantity || 0;
    const assignedQty = item.assignedQuantity || 0;
    const availableQty = totalQty - assignedQty;
    return availableQty > 0;
  });

  // Filter available gear based on search
  const filteredAvailableGear = availableGear.filter((item: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.equipmentType?.toLowerCase().includes(searchLower) ||
      item.brand?.toLowerCase().includes(searchLower) ||
      item.model?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate totals
  const totalItems = myGear.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const totalValue = myGear.reduce((sum: number, item: any) => {
    const price = parseFloat(item.itemPrice || "0");
    const qty = item.quantity || 0;
    return sum + (price * qty);
  }, 0);

  // Self-assign gear mutation
  const assignGearMutation = useMutation({
    mutationFn: async (data: { gearItemId: string; quantity: number }) => {
      return apiRequest("POST", "/api/gear-assignments/self", data);
    },
    onSuccess: () => {
      toast({
        title: t('myGear.gearAdded', 'Gear Added'),
        description: t('myGear.gearAddedDesc', 'Equipment has been added to your gear.'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
      setShowAddGearDialog(false);
      setSelectedGearItem(null);
      setAssignQuantity(1);
    },
    onError: (error: any) => {
      toast({
        title: t('myGear.error', 'Error'),
        description: error.message || t('myGear.failedToAddGear', 'Failed to add gear'),
        variant: "destructive",
      });
    },
  });

  // Remove self-assigned gear mutation
  const removeGearMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      return apiRequest("DELETE", `/api/gear-assignments/self/${assignmentId}`, {});
    },
    onSuccess: () => {
      toast({
        title: t('myGear.gearRemoved', 'Gear Removed'),
        description: t('myGear.gearRemovedDesc', 'Equipment has been removed from your gear.'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gear-assignments"] });
    },
    onError: (error: any) => {
      toast({
        title: t('myGear.error', 'Error'),
        description: error.message || t('myGear.failedToRemoveGear', 'Failed to remove gear'),
        variant: "destructive",
      });
    },
  });

  const handleAssignGear = () => {
    if (!selectedGearItem) return;
    // If item has serials and one is selected, use that; otherwise use quantity
    const hasSerials = selectedGearItem.serialNumbers && selectedGearItem.serialNumbers.length > 0;
    assignGearMutation.mutate({
      gearItemId: selectedGearItem.id,
      quantity: hasSerials && selectedSerialNumber ? 1 : assignQuantity,
      serialNumber: selectedSerialNumber || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">{t('myGear.loading', 'Loading your gear...')}</div>
        </div>
      </div>
    );
  }

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
              <span className="material-icons">arrow_back</span>
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('myGear.title', 'My Gear')}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('myGear.subtitle', "{{name}}'s assigned equipment", { name: currentUser?.name })}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddGearDialog(true)}
            data-testid="button-add-gear"
          >
            <span className="material-icons text-sm mr-1">add</span>
            {t('myGear.addGear', 'Add Gear')}
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="material-icons text-lg">inventory_2</span>
                {t('myGear.totalItems', 'Total Items')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('myGear.across', 'Across')} {myGear.length} {myGear.length === 1 ? t('myGear.category', 'category') : t('myGear.categories', 'categories')}
              </p>
            </CardContent>
          </Card>

          {canSeeFinancials && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="material-icons text-lg">attach_money</span>
                  {t('myGear.totalValue', 'Total Value')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('myGear.equipmentValue', 'Equipment value')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {myGear.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <span className="material-icons text-5xl text-muted-foreground">inventory_2</span>
                <div>
                  <div className="font-semibold text-lg">{t('myGear.noGearAssigned', 'No Gear Assigned')}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('myGear.noEquipmentYet', "You don't have any equipment assigned yet.")}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setShowAddGearDialog(true)}
                    data-testid="button-add-gear-empty"
                  >
                    <span className="material-icons text-sm mr-1">add</span>
                    {t('myGear.addGearFromInventory', 'Add Gear from Inventory')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myGear.map((item: any) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-icons text-primary text-2xl">
                        {EQUIPMENT_ICONS[item.equipmentType] || "category"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="font-semibold text-base flex items-center gap-2">
                            {item.equipmentType}
                            {item.inService === false && (
                              <Badge variant="destructive" className="text-xs">
                                {t('myGear.outOfService', 'Out of Service')}
                              </Badge>
                            )}
                          </div>
                          {(item.brand || item.model) && (
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {[item.brand, item.model].filter(Boolean).join(" - ")}
                            </div>
                          )}
                        </div>
                        <div className="text-right flex items-start gap-2">
                          <div>
                            <div className="font-semibold text-lg">
                              {item.quantity} {item.quantity === 1 ? t('myGear.item', 'item') : t('myGear.items', 'items')}
                            </div>
                            {canSeeFinancials && item.itemPrice && (
                              <div className="text-sm text-muted-foreground">
                                ${parseFloat(item.itemPrice).toFixed(2)} {t('myGear.each', 'each')}
                              </div>
                            )}
                          </div>
                          {item.assignmentId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removeGearMutation.mutate(item.assignmentId)}
                              disabled={removeGearMutation.isPending}
                              data-testid={`button-remove-gear-${item.id}`}
                            >
                              <span className="material-icons text-sm">close</span>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {item.dateOfManufacture && (
                          <div>
                            <span className="text-muted-foreground">{t('myGear.manufactured', 'Manufactured:')}</span>
                            <div className="font-medium mt-0.5">
                              {new Date(item.dateOfManufacture).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                        {item.dateInService && (
                          <div>
                            <span className="text-muted-foreground">{t('myGear.inService', 'In Service:')}</span>
                            <div className="font-medium mt-0.5">
                              {new Date(item.dateInService).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                        {item.dateOutOfService && (
                          <div>
                            <span className="text-muted-foreground">{t('myGear.outOfServiceDate', 'Out of Service:')}</span>
                            <div className="font-medium mt-0.5">
                              {new Date(item.dateOutOfService).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Serial Numbers */}
                      {item.serialNumbers && item.serialNumbers.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-muted-foreground mb-2">{t('myGear.serialNumbers', 'Serial Numbers:')}</div>
                          <div className="flex flex-wrap gap-2">
                            {item.serialNumbers.map((serial: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs font-mono">
                                {serial}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-muted-foreground mb-1">{t('myGear.notes', 'Notes:')}</div>
                          <div className="text-sm">{item.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Gear Dialog */}
      <Dialog open={showAddGearDialog} onOpenChange={setShowAddGearDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('myGear.addGearTitle', 'Add Gear to My Equipment')}</DialogTitle>
            <DialogDescription>
              {t('myGear.addGearDesc', 'Select equipment from the company inventory to add to your gear.')}
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">search</span>
            <Input
              placeholder={t('myGear.searchEquipment', 'Search equipment...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-gear"
            />
          </div>

          {/* Gear List */}
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {filteredAvailableGear.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <span className="material-icons text-4xl mb-2 opacity-50">inventory_2</span>
                <div>{t('myGear.noEquipmentAvailable', 'No equipment available')}</div>
              </div>
            ) : (
              filteredAvailableGear.map((item: any) => (
                <div
                  key={item.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover-elevate ${
                    selectedGearItem?.id === item.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => setSelectedGearItem(item)}
                  data-testid={`gear-item-${item.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="material-icons text-muted-foreground">
                        {EQUIPMENT_ICONS[item.equipmentType] || "category"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.equipmentType}</div>
                      {(item.brand || item.model) && (
                        <div className="text-sm text-muted-foreground">
                          {[item.brand, item.model].filter(Boolean).join(" - ")}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">
                        {item.availableQuantity !== undefined 
                          ? item.availableQuantity 
                          : ((item.quantity || 0) - (item.assignedQuantity || 0))
                        } {t('myGear.available', 'available')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quantity and Confirm */}
          {selectedGearItem && (
            <div className="pt-4 border-t space-y-4">
              {selectedGearItem.serialNumbers && selectedGearItem.serialNumbers.length > 0 ? (
                <div className="space-y-3">
                  <div>
                    <Label>{t('myGear.selectSerialNumber', 'Select Serial Number')}</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {selectedGearItem.serialNumbers.map((serial: string) => (
                        <div
                          key={serial}
                          className={`p-2 border rounded cursor-pointer transition-colors ${
                            selectedSerialNumber === serial
                              ? "border-primary bg-primary/10"
                              : "border-border hover:bg-muted"
                          }`}
                          onClick={() => setSelectedSerialNumber(serial)}
                          data-testid={`serial-option-${serial}`}
                        >
                          {serial}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium">{selectedGearItem.equipmentType}</div>
                    <div>{selectedGearItem.availableQuantity} {t('myGear.availableInInventory', 'available in inventory')}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="quantity">{t('myGear.quantityToAssign', 'Quantity to assign')}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      max={(selectedGearItem.quantity || 0) - (selectedGearItem.assignedQuantity || 0)}
                      value={assignQuantity}
                      onChange={(e) => setAssignQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="mt-1"
                      data-testid="input-assign-quantity"
                    />
                  </div>
                  <div className="flex-1 text-sm text-muted-foreground">
                    <div className="font-medium">{selectedGearItem.equipmentType}</div>
                    <div>{(selectedGearItem.quantity || 0) - (selectedGearItem.assignedQuantity || 0)} {t('myGear.availableInInventory', 'available in inventory')}</div>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedGearItem(null);
                    setShowAddGearDialog(false);
                    setSelectedSerialNumber("");
                    setAssignQuantity(1);
                  }}
                  data-testid="button-cancel-add-gear"
                >
                  {t('myGear.cancel', 'Cancel')}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAssignGear}
                  disabled={assignGearMutation.isPending}
                  data-testid="button-confirm-add-gear"
                >
                  {assignGearMutation.isPending ? t('myGear.adding', 'Adding...') : t('myGear.addToMyGear', 'Add to My Gear')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { hasFinancialAccess } from "@/lib/permissions";

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
  const [, setLocation] = useLocation();

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: gearData, isLoading } = useQuery({
    queryKey: ["/api/gear-items"],
  });

  const currentUser = userData?.user;
  const canSeeFinancials = hasFinancialAccess(currentUser);
  const allGearItems = gearData?.items || [];

  // Filter gear items assigned to current user
  const myGear = allGearItems.filter((item: any) => item.assignedTo === currentUser?.name);

  // Calculate totals
  const totalItems = myGear.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const totalValue = myGear.reduce((sum: number, item: any) => {
    const price = parseFloat(item.itemPrice || "0");
    const qty = item.quantity || 0;
    return sum + (price * qty);
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading your gear...</div>
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
              <h1 className="text-xl font-bold tracking-tight">My Gear</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentUser?.name}'s assigned equipment
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="material-icons text-lg">inventory_2</span>
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {myGear.length} {myGear.length === 1 ? 'category' : 'categories'}
              </p>
            </CardContent>
          </Card>

          {canSeeFinancials && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="material-icons text-lg">attach_money</span>
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${totalValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Equipment value
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
                  <div className="font-semibold text-lg">No Gear Assigned</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    You don't have any equipment assigned yet.
                  </p>
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
                                Out of Service
                              </Badge>
                            )}
                          </div>
                          {(item.brand || item.model) && (
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {[item.brand, item.model].filter(Boolean).join(" - ")}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                          </div>
                          {canSeeFinancials && item.itemPrice && (
                            <div className="text-sm text-muted-foreground">
                              ${parseFloat(item.itemPrice).toFixed(2)} each
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {item.dateInService && (
                          <div>
                            <span className="text-muted-foreground">In Service:</span>
                            <div className="font-medium mt-0.5">
                              {new Date(item.dateInService).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                        {item.dateOutOfService && (
                          <div>
                            <span className="text-muted-foreground">Out of Service:</span>
                            <div className="font-medium mt-0.5">
                              {new Date(item.dateOutOfService).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Serial Numbers */}
                      {item.serialNumbers && item.serialNumbers.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-muted-foreground mb-2">Serial Numbers:</div>
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
                          <div className="text-xs text-muted-foreground mb-1">Notes:</div>
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
    </div>
  );
}

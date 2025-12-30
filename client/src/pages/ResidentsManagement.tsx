import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLocation } from "wouter";
import { useSetHeaderConfig } from "@/components/DashboardLayout";

interface Resident {
  id: string;
  name: string;
  email: string;
  phone?: string;
  unit?: string;
  parkingStall?: string;
  strataPlan?: string;
  buildingName?: string;
  buildingId?: string;
  companyId: string;
}

export default function ResidentsManagement() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [expandedStrataPlans, setExpandedStrataPlans] = useState<Set<string>>(new Set());

  const { data: residents = [], isLoading } = useQuery<Resident[]>({
    queryKey: ["/api/residents"],
  });

  const filteredResidents = residents.filter((resident: Resident) => 
    resident.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.unit?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group residents by strata plan number
  const residentsByStrata = filteredResidents.reduce((acc, resident) => {
    const strataPlan = resident.strataPlan || "Unknown";
    if (!acc[strataPlan]) {
      acc[strataPlan] = [];
    }
    acc[strataPlan].push(resident);
    return acc;
  }, {} as Record<string, Resident[]>);

  // Sort strata plans alphabetically
  const sortedStrataPlans = Object.keys(residentsByStrata).sort();

  const toggleStrataPlan = (strataPlan: string) => {
    const newExpanded = new Set(expandedStrataPlans);
    if (newExpanded.has(strataPlan)) {
      newExpanded.delete(strataPlan);
    } else {
      newExpanded.add(strataPlan);
    }
    setExpandedStrataPlans(newExpanded);
  };

  // Configure unified header with back button
  const handleBackClick = useCallback(() => {
    setLocation('/dashboard');
  }, [setLocation]);

  useSetHeaderConfig({
    pageTitle: t('residentsManagement.title', 'Residents'),
    pageDescription: t('residentsManagement.subtitle', 'Manage building residents'),
    onBackClick: handleBackClick,
    showSearch: false,
  }, [t, handleBackClick]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Resident Seats Management */}
        <Card className="shadow-lg" data-testid="card-resident-seats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="material-icons text-primary">groups</span>
                <div>
                  <div className="font-medium">{t('residentsManagement.residentSeats', 'Resident Seats')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('residentsManagement.residentSeatsDesc', 'Manage capacity for building residents')}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" data-testid="button-add-resident-seats">
                <span className="material-icons text-sm mr-1">add_shopping_cart</span>
                {t('residentsManagement.addMoreSeats', 'Add more seats')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search bar */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                search
              </span>
              <Input
                type="text"
                placeholder={t('residentsManagement.searchPlaceholder', 'Search residents by name, email, or unit...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
                data-testid="input-search-residents"
              />
            </div>
          </CardContent>
        </Card>

        {/* Residents list grouped by strata plan */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">{t('residentsManagement.loading', 'Loading residents...')}</p>
          </div>
        ) : filteredResidents.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <span className="material-icons text-6xl text-muted-foreground mb-4">
                person_off
              </span>
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? t('residentsManagement.noResidentsFound', 'No residents found') : t('residentsManagement.noResidentsYet', 'No residents yet')}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? t('residentsManagement.adjustSearch', 'Try adjusting your search criteria') 
                  : t('residentsManagement.residentsWillAppear', 'Residents will appear here once they register')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedStrataPlans.map((strataPlan) => {
              const strataPlanResidents = residentsByStrata[strataPlan];
              const isExpanded = expandedStrataPlans.has(strataPlan);
              
              return (
                <Card key={strataPlan} className="shadow-lg">
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={() => toggleStrataPlan(strataPlan)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover-elevate active-elevate-2" data-testid={`button-strata-${strataPlan}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="material-icons text-2xl text-primary">apartment</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {strataPlanResidents[0]?.buildingName || `${t('residentsManagement.strataPlan', 'Strata Plan')} ${strataPlan}`}
                              </CardTitle>
                              <CardDescription>
                                {strataPlanResidents[0]?.buildingName && (
                                  <span className="text-xs">{t('residentsManagement.strataPlan', 'Strata Plan')} {strataPlan} • </span>
                                )}
                                {strataPlanResidents.length} {strataPlanResidents.length !== 1 ? t('residentsManagement.residents', 'residents') : t('residentsManagement.resident', 'resident')}
                              </CardDescription>
                            </div>
                          </div>
                          <span className="material-icons text-2xl text-muted-foreground">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {strataPlanResidents.map((resident) => (
                            <Card 
                              key={resident.id} 
                              className="hover-elevate active-elevate-2 cursor-pointer" 
                              onClick={() => setSelectedResident(resident)}
                              data-testid={`card-resident-${resident.id}`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-icons text-xl text-primary">person</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base truncate">{resident.name}</CardTitle>
                                    <CardDescription className="text-xs truncate">{resident.email}</CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-1 pt-0">
                                {resident.unit && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="material-icons text-sm text-muted-foreground">home</span>
                                    <span className="text-muted-foreground">{t('residentsManagement.unit', 'Unit')} {resident.unit}</span>
                                  </div>
                                )}
                                {resident.phone && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="material-icons text-sm text-muted-foreground">phone</span>
                                    <span className="text-muted-foreground">{resident.phone}</span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        )}

        {/* Stats card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('residentsManagement.statistics', 'Resident Statistics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{residents.length}</div>
                <div className="text-sm text-muted-foreground">{t('residentsManagement.totalResidents', 'Total Residents')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {residents.filter(r => r.unit).length}
                </div>
                <div className="text-sm text-muted-foreground">{t('residentsManagement.withUnitInfo', 'With Unit Info')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {residents.filter(r => r.phone).length}
                </div>
                <div className="text-sm text-muted-foreground">{t('residentsManagement.withPhone', 'With Phone')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {new Set(residents.map(r => r.buildingId).filter(Boolean)).size}
                </div>
                <div className="text-sm text-muted-foreground">{t('residentsManagement.buildings', 'Buildings')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Resident Details Dialog */}
      <Dialog open={!!selectedResident} onOpenChange={() => setSelectedResident(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-2xl text-primary">person</span>
              </div>
              <div>
                <div className="text-xl font-bold">{selectedResident?.name}</div>
                <div className="text-sm text-muted-foreground font-normal">{selectedResident?.email}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedResident && (
            <div className="space-y-6 pt-4">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t('residentsManagement.contactInformation', 'Contact Information')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <span className="material-icons text-muted-foreground">email</span>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">{t('residentsManagement.email', 'Email')}</div>
                      <div className="font-medium">{selectedResident.email}</div>
                    </div>
                  </div>
                  {selectedResident.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="material-icons text-muted-foreground">phone</span>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">{t('residentsManagement.phoneNumber', 'Phone Number')}</div>
                        <div className="font-medium">{selectedResident.phone}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Information */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t('residentsManagement.propertyInformation', 'Property Information')}</h3>
                <div className="space-y-3">
                  {selectedResident.buildingName && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="material-icons text-muted-foreground">business</span>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">{t('residentsManagement.buildingName', 'Building Name')}</div>
                        <div className="font-medium">{selectedResident.buildingName}</div>
                      </div>
                    </div>
                  )}
                  {selectedResident.strataPlan && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="material-icons text-muted-foreground">apartment</span>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">{t('residentsManagement.strataPlanNumber', 'Strata Plan Number')}</div>
                        <div className="font-medium">{selectedResident.strataPlan}</div>
                      </div>
                    </div>
                  )}
                  {selectedResident.unit && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="material-icons text-muted-foreground">home</span>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">{t('residentsManagement.unitNumber', 'Unit Number')}</div>
                        <div className="font-medium">{selectedResident.unit}</div>
                      </div>
                    </div>
                  )}
                  {selectedResident.parkingStall && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="material-icons text-muted-foreground">local_parking</span>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">{t('residentsManagement.parkingStall', 'Parking Stall')}</div>
                        <div className="font-medium">{selectedResident.parkingStall}</div>
                      </div>
                    </div>
                  )}
                  {!selectedResident.buildingName && !selectedResident.parkingStall && !selectedResident.unit && !selectedResident.strataPlan && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      {t('residentsManagement.noPropertyInfo', 'No property information available')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

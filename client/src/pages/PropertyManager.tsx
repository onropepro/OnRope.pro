import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Mail, Phone, FileText, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

type VendorSummary = {
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  logo: string | null;
  activeProjectsCount: number;
  residentCode: string | null;
  propertyManagerCode: string | null;
};

export default function PropertyManager() {
  const { toast } = useToast();
  const [addCodeOpen, setAddCodeOpen] = useState(false);
  const [companyCode, setCompanyCode] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<VendorSummary | null>(null);

  const { data: vendorsData, isLoading } = useQuery<{ vendors: VendorSummary[] }>({
    queryKey: ["/api/property-managers/me/vendors"],
  });

  const addVendorMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest("/api/property-managers/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyCode: code }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-managers/me/vendors"] });
      toast({
        title: "Vendor Added",
        description: "The company has been successfully added to your vendors list.",
      });
      setCompanyCode("");
      setAddCodeOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Vendor",
        description: error.message || "Invalid company code. Please check with the rope access company.",
        variant: "destructive",
      });
    },
  });

  const handleAddVendor = () => {
    if (companyCode.trim().length !== 10) {
      toast({
        title: "Invalid Code",
        description: "Company code must be exactly 10 characters.",
        variant: "destructive",
      });
      return;
    }
    addVendorMutation.mutate(companyCode.trim());
  };

  const vendors = vendorsData?.vendors || [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">My Vendors</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Manage your connected rope access companies and view their information
          </p>
        </div>

        <Card className="mb-6" data-testid="card-my-vendors">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle data-testid="text-vendors-title">Connected Vendors</CardTitle>
              <CardDescription data-testid="text-vendors-description">
                {vendors.length === 0 
                  ? "No vendors connected yet. Add a company code to get started." 
                  : `You have access to ${vendors.length} rope access ${vendors.length === 1 ? 'company' : 'companies'}`}
              </CardDescription>
            </div>
            <Button 
              onClick={() => setAddCodeOpen(true)}
              data-testid="button-add-vendor"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="text-loading">
                Loading vendors...
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2" data-testid="text-no-vendors">No Vendors Yet</p>
                <p className="text-sm text-muted-foreground mb-4" data-testid="text-no-vendors-description">
                  Request a company code from your rope access company and add it above
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendors.map((vendor) => (
                  <Card 
                    key={vendor.id} 
                    className="hover-elevate cursor-pointer"
                    onClick={() => setSelectedVendor(vendor)}
                    data-testid={`card-vendor-${vendor.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={vendor.logo || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {vendor.companyName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 truncate" data-testid={`text-vendor-name-${vendor.id}`}>
                            {vendor.companyName}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate" data-testid={`text-vendor-email-${vendor.id}`}>
                                {vendor.email}
                              </span>
                            </div>
                            {vendor.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                <span data-testid={`text-vendor-phone-${vendor.id}`}>{vendor.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 flex-shrink-0" />
                              <span data-testid={`text-vendor-projects-${vendor.id}`}>
                                {vendor.activeProjectsCount} active {vendor.activeProjectsCount === 1 ? 'project' : 'projects'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={addCodeOpen} onOpenChange={setAddCodeOpen}>
          <DialogContent data-testid="dialog-add-vendor">
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">Add Vendor Company</DialogTitle>
              <DialogDescription data-testid="text-dialog-description">
                Enter the 10-character company code provided by your rope access company
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="companyCode">Company Code</Label>
                <Input
                  id="companyCode"
                  placeholder="Enter 10-character code"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  data-testid="input-company-code"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddCodeOpen(false);
                    setCompanyCode("");
                  }}
                  data-testid="button-cancel-add-vendor"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddVendor}
                  disabled={companyCode.trim().length !== 10 || addVendorMutation.isPending}
                  data-testid="button-submit-add-vendor"
                >
                  {addVendorMutation.isPending ? "Adding..." : "Add Vendor"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={selectedVendor !== null} onOpenChange={(open) => !open && setSelectedVendor(null)}>
          <DialogContent className="max-w-2xl" data-testid="dialog-vendor-details">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3" data-testid="text-vendor-details-title">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedVendor?.logo || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedVendor?.companyName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {selectedVendor?.companyName}
              </DialogTitle>
              <DialogDescription data-testid="text-vendor-details-description">
                Vendor company information
              </DialogDescription>
            </DialogHeader>
            {selectedVendor && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Company Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="text-vendor-detail-email">{selectedVendor.email}</span>
                    </div>
                  </div>
                  {selectedVendor.phone && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone Number</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span data-testid="text-vendor-detail-phone">{selectedVendor.phone}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Active Projects</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span data-testid="text-vendor-detail-projects">
                      {selectedVendor.activeProjectsCount} active {selectedVendor.activeProjectsCount === 1 ? 'project' : 'projects'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVendor.residentCode && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Resident Access Code</Label>
                      <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md mt-1" data-testid="text-vendor-detail-resident-code">
                        {selectedVendor.residentCode}
                      </div>
                    </div>
                  )}
                  {selectedVendor.propertyManagerCode && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Property Manager Code</Label>
                      <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md mt-1" data-testid="text-vendor-detail-pm-code">
                        {selectedVendor.propertyManagerCode}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVendor(null)}
                    data-testid="button-close-vendor-details"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Building2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CompanyLink {
  id: string;
  companyCode: string;
  companyId: string;
  companyName: string;
  addedAt: string;
}

export default function PropertyManagerSettings() {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCompanyCode, setNewCompanyCode] = useState("");
  const { toast } = useToast();

  // Fetch company links
  const { data: linksData, isLoading, error, refetch } = useQuery<{ links: CompanyLink[] }>({
    queryKey: ["/api/property-manager/company-links"],
  });

  // Add company link mutation
  const addCompanyLinkMutation = useMutation({
    mutationFn: async (companyCode: string) => {
      return await apiRequest("/api/property-manager/company-links", "POST", { companyCode });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-manager/company-links"] });
      setIsAddDialogOpen(false);
      setNewCompanyCode("");
      toast({
        title: t('propertyManagerSettings.successTitle', 'Success'),
        description: t('propertyManagerSettings.companyAdded', 'Company link added successfully'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('propertyManagerSettings.errorTitle', 'Error'),
        description: error.message || t('propertyManagerSettings.failedToAddLink', 'Failed to add company link'),
        variant: "destructive",
      });
    },
  });

  // Remove company link mutation
  const removeCompanyLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      return await apiRequest(`/api/property-manager/company-links/${linkId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/property-manager/company-links"] });
      toast({
        title: t('propertyManagerSettings.successTitle', 'Success'),
        description: t('propertyManagerSettings.companyRemoved', 'Company link removed successfully'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('propertyManagerSettings.errorTitle', 'Error'),
        description: error.message || t('propertyManagerSettings.failedToRemoveLink', 'Failed to remove company link'),
        variant: "destructive",
      });
    },
  });

  const handleAddCompanyCode = () => {
    if (!newCompanyCode || newCompanyCode.length !== 10) {
      toast({
        title: t('propertyManagerSettings.invalidCodeTitle', 'Invalid Code'),
        description: t('propertyManagerSettings.invalidCodeMessage', 'Company code must be exactly 10 characters'),
        variant: "destructive",
      });
      return;
    }

    addCompanyLinkMutation.mutate(newCompanyCode);
  };

  const handleRemoveCompanyLink = (linkId: string, companyName: string) => {
    if (window.confirm(t('propertyManagerSettings.confirmRemove', 'Are you sure you want to remove access to {{companyName}}?', { companyName }))) {
      removeCompanyLinkMutation.mutate(linkId);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('propertyManagerSettings.title', 'Company Access')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('propertyManagerSettings.subtitle', 'Manage your access to rope access companies')}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <div>
            <CardTitle>{t('propertyManagerSettings.linkedCompanies', 'Linked Companies')}</CardTitle>
            <CardDescription>
              {t('propertyManagerSettings.linkedCompaniesDesc', 'View buildings and projects from these companies')}
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-company">
                <Plus className="h-4 w-4 mr-2" />
                {t('propertyManagerSettings.addCompany', 'Add Company')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('propertyManagerSettings.addCompanyAccess', 'Add Company Access')}</DialogTitle>
                <DialogDescription>
                  {t('propertyManagerSettings.addCompanyDesc', 'Enter the 10-character company code provided by the rope access company')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="company-code">{t('propertyManagerSettings.companyCode', 'Company Code')}</Label>
                  <Input
                    id="company-code"
                    placeholder={t('propertyManagerSettings.companyCodePlaceholder', 'ABC1234567')}
                    value={newCompanyCode}
                    onChange={(e) => setNewCompanyCode(e.target.value.toUpperCase())}
                    maxLength={10}
                    className="h-12"
                    data-testid="input-add-company-code"
                  />
                </div>
                <Button
                  onClick={handleAddCompanyCode}
                  disabled={addCompanyLinkMutation.isPending}
                  className="w-full"
                  data-testid="button-submit-company-code"
                >
                  {addCompanyLinkMutation.isPending ? t('propertyManagerSettings.adding', 'Adding...') : t('propertyManagerSettings.addCompany', 'Add Company')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">{t('propertyManagerSettings.loading', 'Loading...')}</div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-4">
                {t('propertyManagerSettings.failedToLoad', 'Failed to load company links')}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {error instanceof Error ? error.message : t('propertyManagerSettings.unexpectedError', 'An unexpected error occurred')}
              </p>
              <Button onClick={() => refetch()} variant="outline" data-testid="button-retry">
                {t('propertyManagerSettings.retry', 'Retry')}
              </Button>
            </div>
          ) : !linksData?.links || linksData.links.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('propertyManagerSettings.noCompaniesLinked', 'No companies linked yet')}</p>
              <p className="text-sm mt-2">{t('propertyManagerSettings.addCompanyCodeHint', 'Add a company code to view their buildings and projects')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {linksData.links.map((link) => (
                <Card key={link.id} className="hover-elevate" data-testid={`company-link-${link.id}`}>
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium" data-testid={`text-company-name-${link.id}`}>
                          {link.companyName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t('propertyManagerSettings.codePrefix', 'Code:')} {link.companyCode}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCompanyLink(link.id, link.companyName)}
                      disabled={removeCompanyLinkMutation.isPending}
                      data-testid={`button-remove-${link.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

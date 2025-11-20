import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshButton } from "@/components/RefreshButton";
import { useLocation } from "wouter";

interface BrandedHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backPath?: string;
  children?: React.ReactNode;
}

export function BrandedHeader({ title, subtitle, showBackButton, backPath = "/dashboard", children }: BrandedHeaderProps) {
  const [, setLocation] = useLocation();

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  // Determine company ID to fetch branding for
  const companyIdForBranding = userData?.user?.role === 'company' 
    ? userData.user.id 
    : userData?.user?.companyId;

  const { data: brandingData } = useQuery({
    queryKey: ["/api/company", companyIdForBranding, "branding"],
    queryFn: async () => {
      if (!companyIdForBranding) return null;
      const response = await fetch(`/api/company/${companyIdForBranding}/branding`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Failed to fetch branding: ${response.status}`);
      return response.json();
    },
    enabled: !!companyIdForBranding && userData?.user?.role !== 'resident' && userData?.user?.role !== 'superuser',
    retry: 1,
  });

  const branding = brandingData || {};
  const hasLogo = !!(branding.subscriptionActive && branding.logoUrl);

  return (
    <header className="sticky top-0 z-[100] glass backdrop-blur-xl border-b shadow-premium border-border/50">
      <div className="px-6 h-20 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation(backPath)}
              data-testid="button-back"
              className="hover-elevate"
            >
              <span className="material-icons">arrow_back</span>
            </Button>
          )}
          {hasLogo && (
            <img 
              src={branding.logoUrl} 
              alt="Company Logo" 
              className="h-12 w-auto object-contain"
              data-testid="img-company-logo"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground font-medium mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {children}
          <RefreshButton />
          <Button 
            variant="ghost" 
            size="icon" 
            data-testid="button-profile" 
            onClick={() => setLocation("/profile")} 
            className="hover-elevate w-12 h-12"
          >
            <span className="material-icons text-2xl">person</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

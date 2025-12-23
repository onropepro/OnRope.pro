import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthPortal, UserType } from "@/hooks/use-auth-portal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { PropertyManagerRegistration } from "@/components/PropertyManagerRegistration";
import { TechnicianRegistration } from "@/components/TechnicianRegistration";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { HardHat, Building2, Home, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const userTypeConfig: Record<UserType, { label: string; icon: typeof HardHat; description: string }> = {
  technician: {
    label: "Technician",
    icon: HardHat,
    description: "Rope access professionals",
  },
  property_manager: {
    label: "Property Manager",
    icon: Building2,
    description: "Property management companies",
  },
  building_manager: {
    label: "Building Manager",
    icon: Home,
    description: "Strata councils & managers",
  },
  resident: {
    label: "Resident",
    icon: Users,
    description: "Building residents",
  },
  company: {
    label: "Company",
    icon: Briefcase,
    description: "Rope access employers",
  },
};

type RegistrationModalType = UserType | null;

export function AuthPortalModal() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { isOpen, closeAuthPortal, mode, setMode, userType, setUserType, redirectAfterAuth } = useAuthPortal();
  const [activeRegistrationModal, setActiveRegistrationModal] = useState<RegistrationModalType>(null);

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    retry: false,
    staleTime: 30000,
  });

  useEffect(() => {
    if (userData?.user && isOpen) {
      closeAuthPortal();
      handleRedirectAfterAuth(userData.user.role);
    }
  }, [userData, isOpen]);

  const handleRedirectAfterAuth = (role: string) => {
    if (redirectAfterAuth) {
      setLocation(redirectAfterAuth);
      return;
    }

    switch (role) {
      case "resident":
        setLocation("/resident-dashboard");
        break;
      case "property_manager":
        setLocation("/property-manager");
        break;
      case "superuser":
        setLocation("/superuser");
        break;
      case "building_manager":
        setLocation("/building-portal");
        break;
      case "rope_access_tech":
        setLocation("/technician-portal");
        break;
      default:
        setLocation("/dashboard");
    }
  };

  const handleAuthSuccess = (user: any) => {
    setActiveRegistrationModal(null);
    closeAuthPortal();
    handleRedirectAfterAuth(user.role);
  };

  const handleUserTypeClick = (type: UserType) => {
    closeAuthPortal();
    setActiveRegistrationModal(type);
  };

  const handleCloseRegistrationModal = () => {
    setActiveRegistrationModal(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeAuthPortal()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img
                src={onRopeProLogo}
                alt="OnRopePro"
                className="h-8 w-auto brightness-0 dark:invert opacity-80"
              />
            </div>
            <DialogTitle className="text-xl font-semibold">
              {mode === "login" ? t("auth.signIn", "Sign In") : t("auth.createAccount", "Create Account")}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" data-testid="tab-login">
                {t("auth.signIn", "Sign In")}
              </TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">
                {t("auth.register", "Register")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm onSuccess={handleAuthSuccess} />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                {t("auth.iAmA", "I am a...")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(userTypeConfig) as UserType[]).map((type) => {
                  const config = userTypeConfig[type];
                  const Icon = config.icon;

                  return (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserTypeClick(type)}
                      className="flex flex-col items-center gap-1 h-auto py-3 px-2"
                      data-testid={`button-usertype-${type}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-medium">{config.label}</span>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <TechnicianRegistration 
        open={activeRegistrationModal === "technician"} 
        onOpenChange={(open) => !open && handleCloseRegistrationModal()} 
      />

      <PropertyManagerRegistration 
        open={activeRegistrationModal === "property_manager"} 
        onOpenChange={(open) => !open && handleCloseRegistrationModal()} 
      />

      <EmployerRegistration 
        open={activeRegistrationModal === "company"} 
        onOpenChange={(open) => !open && handleCloseRegistrationModal()} 
      />

      <Dialog 
        open={activeRegistrationModal === "building_manager"} 
        onOpenChange={(open) => !open && handleCloseRegistrationModal()}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img
                src={onRopeProLogo}
                alt="OnRopePro"
                className="h-8 w-auto brightness-0 dark:invert opacity-80"
              />
            </div>
            <DialogTitle className="text-xl font-semibold">
              {t("auth.buildingManagerRegistration", "Building Manager Registration")}
            </DialogTitle>
            <DialogDescription>
              {t("auth.buildingManagerDescription", "Create your building manager account")}
            </DialogDescription>
          </DialogHeader>
          <RegisterForm userType="building_manager" onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={activeRegistrationModal === "resident"} 
        onOpenChange={(open) => !open && handleCloseRegistrationModal()}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img
                src={onRopeProLogo}
                alt="OnRopePro"
                className="h-8 w-auto brightness-0 dark:invert opacity-80"
              />
            </div>
            <DialogTitle className="text-xl font-semibold">
              {t("auth.residentRegistration", "Resident Registration")}
            </DialogTitle>
            <DialogDescription>
              {t("auth.residentDescription", "Create your resident account to access building services")}
            </DialogDescription>
          </DialogHeader>
          <RegisterForm userType="resident" onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}

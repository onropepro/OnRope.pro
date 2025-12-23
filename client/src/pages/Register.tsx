import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HardHat, Building2, Home, Users, Briefcase } from "lucide-react";
import { Link } from "wouter";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { useAuthPortal, UserType } from "@/hooks/use-auth-portal";
import { PropertyManagerRegistration } from "@/components/PropertyManagerRegistration";

const accountTypes = [
  {
    id: "technician" as UserType,
    title: "Technician",
    titleKey: "register.accountTypes.technician",
    description: "Rope access technician with IRATA/SPRAT certification",
    descriptionKey: "register.accountTypes.technicianDesc",
    icon: HardHat,
  },
  {
    id: "property_manager" as UserType,
    title: "Property Manager",
    titleKey: "register.accountTypes.propertyManager",
    description: "Manage buildings and vendor relationships",
    descriptionKey: "register.accountTypes.propertyManagerDesc",
    icon: Building2,
    customFlow: true,
  },
  {
    id: "building_manager" as UserType,
    title: "Building Manager",
    titleKey: "register.accountTypes.buildingManager",
    description: "On-site building management and oversight",
    descriptionKey: "register.accountTypes.buildingManagerDesc",
    icon: Users,
  },
  {
    id: "resident" as UserType,
    title: "Resident",
    titleKey: "register.accountTypes.resident",
    description: "Building resident with feedback access",
    descriptionKey: "register.accountTypes.residentDesc",
    icon: Home,
  },
  {
    id: "company" as UserType,
    title: "Company",
    titleKey: "register.accountTypes.company",
    description: "Rope access company registration",
    descriptionKey: "register.accountTypes.companyDesc",
    icon: Briefcase,
  },
];

export default function Register() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { openAuthPortal } = useAuthPortal();
  const [showPropertyManagerModal, setShowPropertyManagerModal] = useState(false);

  const { data: userData, isLoading } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  useEffect(() => {
    if (!isLoading && userData?.user) {
      if (userData.user.role === "resident") {
        setLocation("/resident-dashboard");
      } else if (userData.user.role === "property_manager") {
        setLocation("/property-manager-dashboard");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [userData, isLoading, setLocation]);

  const handleAccountTypeClick = (accountType: typeof accountTypes[0]) => {
    if (accountType.customFlow) {
      setShowPropertyManagerModal(true);
    } else {
      openAuthPortal({ mode: "register", initialUserType: accountType.id });
    }
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <LanguageDropdown />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t('register.title', 'Create Account')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('register.subtitle', 'Choose your account type to get started')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {accountTypes.map((accountType) => {
              const Icon = accountType.icon;
              return (
                <button
                  key={accountType.id}
                  onClick={() => handleAccountTypeClick(accountType)}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover-elevate text-left transition-colors"
                  data-testid={`button-register-${accountType.id}`}
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      {t(accountType.titleKey, accountType.title)}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {t(accountType.descriptionKey, accountType.description)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t('register.haveAccount', 'Already have an account?')}{" "}
            <button
              onClick={() => openAuthPortal({ mode: "login" })}
              className="text-primary font-medium hover:underline"
              data-testid="link-login"
            >
              {t('register.signIn', 'Sign in')}
            </button>
          </div>
        </CardContent>
      </Card>

      <PropertyManagerRegistration 
        open={showPropertyManagerModal} 
        onOpenChange={setShowPropertyManagerModal} 
      />
    </div>
  );
}

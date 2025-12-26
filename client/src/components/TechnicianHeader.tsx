import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { Crown, LogOut, Home } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TechnicianHeaderProps {
  language?: "en" | "es" | "fr";
  onProfileClick?: () => void;
}

export function TechnicianHeader({ language = "en", onProfileClick }: TechnicianHeaderProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user;

  const translations = {
    en: {
      technician: "Technician",
      proBadge: "PLUS",
      proBadgeTooltip: "You have PLUS access through referrals",
      dashboard: "Dashboard",
      logoutSuccess: "Logged out successfully",
    },
    es: {
      technician: "Tecnico",
      proBadge: "PLUS",
      proBadgeTooltip: "Tienes acceso PLUS a traves de referencias",
      dashboard: "Panel",
      logoutSuccess: "Cierre de sesion exitoso",
    },
    fr: {
      technician: "Technicien",
      proBadge: "PLUS",
      proBadgeTooltip: "Vous avez un acces PLUS grace aux parrainages",
      dashboard: "Tableau de bord",
      logoutSuccess: "Deconnexion reussie",
    },
  };

  const t = translations[language] || translations.en;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t.logoutSuccess,
      });
      setLocation("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      setLocation("/technician-portal?tab=profile");
    }
  };

  if (!user) return null;

  const userInitials = user?.name 
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() 
    : 'U';

  return (
    <header className="sticky top-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6">
      <div className="h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/technician-portal')}
            className="lg:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            data-testid="button-back-home"
          >
            <Home className="w-5 h-5" />
          </Button>
          <div className="hidden md:flex flex-1 max-w-xl">
            <DashboardSearch />
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {user.role === 'rope_access_tech' && user.hasPlusAccess && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="default" 
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs px-2 py-0.5 font-bold border-0 cursor-help" 
                  data-testid="badge-plus"
                >
                  <Crown className="w-3 h-3 mr-1 fill-current" />
                  {t.proBadge}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t.proBadgeTooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {user.role === 'company' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setLocation('/dashboard')}
              className="gap-1.5"
              data-testid="button-return-dashboard"
            >
              <span className="material-icons text-base">dashboard</span>
              <span className="hidden sm:inline">{t.dashboard}</span>
            </Button>
          )}
          
          <LanguageDropdown />
          
          <button 
            onClick={handleProfileClick}
            className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
            data-testid="link-user-profile"
          >
            <Avatar className="w-8 h-8 bg-[#AB4521]">
              <AvatarImage src={user?.photoUrl || undefined} />
              <AvatarFallback className="bg-[#AB4521] text-white text-xs font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 leading-tight">{t.technician}</p>
            </div>
          </button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            data-testid="button-logout" 
            onClick={handleLogout} 
            className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

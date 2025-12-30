import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { NotificationBell } from "@/components/NotificationBell";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { Menu, MoreVertical, LogOut, Crown } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface TechnicianDashboardHeaderProps {
  onMobileMenuClick: () => void;
  currentUser?: any;
}

export function TechnicianDashboardHeader({ 
  onMobileMenuClick,
  currentUser 
}: TechnicianDashboardHeaderProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t("common.logoutSuccess", "Logged out successfully"),
      });
      setLocation("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleProfileClick = () => {
    // Route to appropriate portal based on user role
    if (currentUser?.role === 'property_manager') {
      setLocation("/property-manager-dashboard");
    } else if (currentUser?.role === 'resident') {
      setLocation("/resident-dashboard");
    } else if (currentUser?.role === 'building_manager') {
      setLocation("/building-manager-dashboard");
    } else if (currentUser?.role === 'ground_crew') {
      setLocation("/ground-crew-portal?tab=profile");
    } else {
      // Default to technician portal
      setLocation("/technician-portal?tab=profile");
    }
  };

  const userInitials = currentUser?.name 
    ? currentUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() 
    : 'U';

  return (
    <header className="sticky top-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6">
      <div className="h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuClick}
            className="lg:hidden text-slate-600 dark:text-slate-300"
            data-testid="button-sidebar-toggle"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex flex-1 max-w-xl">
            <DashboardSearch />
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {currentUser?.role === 'rope_access_tech' && currentUser?.hasPlusAccess && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="default" 
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs px-2 py-0.5 font-bold border-0 cursor-help" 
                  data-testid="badge-plus"
                >
                  <Crown className="w-3 h-3 mr-1 fill-current" />
                  {t("technician.proBadge", "PLUS")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("technician.proBadgeTooltip", "You have PLUS access through referrals")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <InstallPWAButton />
          
          <NotificationBell />
          
          <LanguageDropdown iconOnly />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-300"
                data-testid="button-utility-menu"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={handleProfileClick}
                className="flex items-center gap-2 cursor-pointer"
                data-testid="menu-item-profile"
              >
                <Avatar className="w-6 h-6 bg-[#5C7A84]">
                  <AvatarImage src={currentUser?.photoUrl || undefined} />
                  <AvatarFallback className="bg-[#5C7A84] text-white text-xs font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{currentUser?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">{t("technician.profile", "Profile")}</span>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                data-testid="menu-item-logout"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("common.logout", "Log out")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

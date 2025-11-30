import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface NavigationHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showMainMenu?: boolean;
  backLabel?: string;
  mainMenuLabel?: string;
  backTo?: string;
  mainMenuTo?: string;
  fallbackTo?: string;
  className?: string;
  children?: React.ReactNode;
}

export function NavigationHeader({
  title,
  subtitle,
  showBack = true,
  showMainMenu = true,
  backLabel,
  mainMenuLabel,
  backTo,
  mainMenuTo = "/dashboard",
  fallbackTo = "/dashboard",
  className = "",
  children
}: NavigationHeaderProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const displayBackLabel = backLabel || t('navigation.back', 'Back');
  const displayMainMenuLabel = mainMenuLabel || t('navigation.mainMenu', 'Main Menu');

  const handleBack = () => {
    if (backTo) {
      setLocation(backTo);
      return;
    }
    
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation(fallbackTo);
    }
  };

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-1"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{displayBackLabel}</span>
          </Button>
        )}
        {showMainMenu && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation(mainMenuTo)}
            className="gap-1"
            data-testid="button-main-menu"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{displayMainMenuLabel}</span>
          </Button>
        )}
        {title && (
          <div className="ml-2">
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

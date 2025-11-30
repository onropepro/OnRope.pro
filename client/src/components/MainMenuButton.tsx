import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface MainMenuButtonProps {
  to?: string;
  label?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function MainMenuButton({ 
  to = "/dashboard", 
  label, 
  className = "",
  variant = "outline",
  size = "default"
}: MainMenuButtonProps) {
  const { t } = useTranslation();
  
  const displayLabel = label || t('navigation.mainMenu', 'Main Menu');

  return (
    <Link href={to}>
      <Button
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
        data-testid="button-main-menu"
      >
        <Home className="w-4 h-4" />
        {size !== "icon" && displayLabel}
      </Button>
    </Link>
  );
}

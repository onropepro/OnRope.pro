import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
  useHistoryBack?: boolean;
  fallbackTo?: string;
}

export function BackButton({ 
  to, 
  label, 
  onClick, 
  className = "",
  useHistoryBack = true,
  fallbackTo = "/dashboard"
}: BackButtonProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  
  const displayLabel = label || t('navigation.back', 'Back');
  
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    
    if (to) {
      setLocation(to);
      return;
    }
    
    if (useHistoryBack && window.history.length > 1) {
      window.history.back();
    } else {
      setLocation(fallbackTo);
    }
  };

  if (to && !onClick && !useHistoryBack) {
    return (
      <Link href={to}>
        <Button
          variant="ghost"
          className={`gap-2 ${className}`}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" />
          {displayLabel}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={`gap-2 ${className}`}
      data-testid="button-back"
    >
      <ArrowLeft className="w-4 h-4" />
      {displayLabel}
    </Button>
  );
}

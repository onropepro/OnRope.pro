import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function BackButton({ to = "/dashboard", label, onClick, className = "" }: BackButtonProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  
  const displayLabel = label || t('common.back', 'Back');
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      setLocation(to);
    }
  };

  if (to && !onClick) {
    return (
      <Link href={to}>
        <Button
          variant="ghost"
          className={`mb-4 gap-2 ${className}`}
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
      className={`mb-4 gap-2 ${className}`}
      data-testid="button-back"
    >
      <ArrowLeft className="w-4 h-4" />
      {displayLabel}
    </Button>
  );
}

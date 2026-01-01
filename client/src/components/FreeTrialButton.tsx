import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

interface FreeTrialButtonProps {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
  showArrow?: boolean;
  href?: string;
  onClick?: () => void;
  testId?: string;
}

export function FreeTrialButton({
  variant = "default",
  size = "lg",
  className = "",
  showArrow = true,
  href,
  onClick,
  testId = "button-free-trial",
}: FreeTrialButtonProps) {
  const { t } = useTranslation();
  
  const buttonContent = (
    <>
      {t('common.startFreeTrial', 'Start Your Free 30-Day Trial')}
      {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
    </>
  );
  
  if (onClick) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={onClick}
        data-testid={testId}
      >
        {buttonContent}
      </Button>
    );
  }
  
  return (
    <Link href={href || "/get-license"}>
      <Button
        variant={variant}
        size={size}
        className={className}
        data-testid={testId}
      >
        {buttonContent}
      </Button>
    </Link>
  );
}

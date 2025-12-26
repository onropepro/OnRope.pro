import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface LanguageDropdownProps {
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
  iconOnly?: boolean;
  align?: "start" | "center" | "end";
  stakeholderColor?: string | null;
  useDarkText?: boolean;
}

export function LanguageDropdown({ 
  variant = "ghost", 
  size = "sm",
  className = "",
  showLabel = true,
  iconOnly = false,
  align = "end",
  stakeholderColor = null,
  useDarkText = false,
}: LanguageDropdownProps) {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);
  const displayName = currentLang?.nativeName || 'English';

  // Determine text styling based on background color contrast
  const textColorClass = useDarkText ? "text-slate-900" : "text-white";
  const hoverBgClass = useDarkText ? "hover:bg-black/10" : "hover:bg-white/10";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant}
          size={iconOnly ? "icon" : size}
          className={cn(
            stakeholderColor ? `${textColorClass} ${hoverBgClass}` : "",
            className
          )}
          data-testid="button-language-dropdown"
        >
          <Globe className="w-4 h-4" />
          {showLabel && !iconOnly && (
            <>
              <span className="ml-1">{displayName}</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="z-[200]" sideOffset={5}>
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(
              "flex items-center justify-between gap-2",
              currentLanguage === lang.code ? 'bg-accent' : ''
            )}
            data-testid={`menu-item-language-${lang.code}`}
          >
            <span>{lang.nativeName}</span>
            {currentLanguage === lang.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

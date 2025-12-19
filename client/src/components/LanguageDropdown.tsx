import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

interface LanguageDropdownProps {
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LanguageDropdown({ 
  variant = "ghost", 
  size = "sm",
  className = ""
}: LanguageDropdownProps) {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'fr' | 'es'>(() => {
    const lang = i18n.language;
    if (lang?.startsWith('fr')) return 'fr';
    if (lang?.startsWith('es')) return 'es';
    return 'en';
  });

  useEffect(() => {
    const lang = i18n.language;
    if (lang?.startsWith('fr')) setCurrentLanguage('fr');
    else if (lang?.startsWith('es')) setCurrentLanguage('es');
    else setCurrentLanguage('en');
  }, [i18n.language]);

  const changeLanguage = (lang: 'en' | 'fr' | 'es') => {
    setCurrentLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    i18n.changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant}
          size={size}
          className={className}
          data-testid="button-language-dropdown"
        >
          <Globe className="w-4 h-4 mr-1" />
          {t('navigation.language', 'Language')}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[200]" sideOffset={5}>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={currentLanguage === 'en' ? 'bg-accent' : ''}
          data-testid="menu-item-language-en"
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('fr')}
          className={currentLanguage === 'fr' ? 'bg-accent' : ''}
          data-testid="menu-item-language-fr"
        >
          Français
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('es')}
          className={currentLanguage === 'es' ? 'bg-accent' : ''}
          data-testid="menu-item-language-es"
        >
          Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/use-language";

interface InstallPWAButtonProps {
  stakeholderColor?: string | null;
  useDarkText?: boolean;
  className?: string;
  showAsMenuItem?: boolean;
}

export function InstallPWAButton({ stakeholderColor, useDarkText = false, className, showAsMenuItem = false }: InstallPWAButtonProps) {
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);

  // Determine text/border styling based on background color contrast
  const textColorClass = useDarkText ? "text-slate-900" : "text-white";
  const borderColorClass = useDarkText ? "border-black/20" : "border-white/30";
  const hoverBgClass = useDarkText ? "hover:bg-black/10" : "hover:bg-white/10";

  // Menu item rendering for mobile dropdown
  if (showAsMenuItem) {
    return (
      <>
        <button
          onClick={() => setShowDialog(true)}
          className={`w-full flex items-center gap-2 text-sm text-foreground hover-elevate text-left ${className || ""}`}
          data-testid="button-install-app-mobile"
        >
          <Download className="h-4 w-4" />
          {t('pwa.installApp', 'Install App')}
        </button>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                {t('pwa.title', 'Install OnRopePro')}
              </DialogTitle>
              <DialogDescription>
                {t('pwa.description', 'Install this app on your device for quick access')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">{t('pwa.ios.title', 'On iPhone / iPad:')}</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>{t('pwa.ios.step1', 'Tap the Share button (square with arrow)')}</li>
                  <li>{t('pwa.ios.step2', 'Scroll down and tap "Add to Home Screen"')}</li>
                  <li>{t('pwa.ios.step3', 'Tap "Add" to confirm')}</li>
                </ol>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">{t('pwa.android.title', 'On Android:')}</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>{t('pwa.android.step1', 'Tap the menu (three dots in top right)')}</li>
                  <li>{t('pwa.android.step2', 'Tap "Add to Home screen" or "Install app"')}</li>
                  <li>{t('pwa.android.step3', 'Tap "Install" or "Add" to confirm')}</li>
                </ol>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">{t('pwa.desktop.title', 'On Desktop (Chrome/Edge):')}</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>{t('pwa.desktop.step1', 'Look for the install icon in the address bar')}</li>
                  <li>{t('pwa.desktop.step2', 'Or open browser menu and select "Install OnRopePro"')}</li>
                  <li>{t('pwa.desktop.step3', 'Click "Install" to confirm')}</li>
                </ol>
              </div>
            </div>

            <Button onClick={() => setShowDialog(false)} className="w-full">
              {t('pwa.gotIt', 'Got it')}
            </Button>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        size="sm"
        className={stakeholderColor ? `gap-2 ${textColorClass} ${borderColorClass} ${hoverBgClass} ${className || ""}` : `gap-2 ${className || ""}`}
        data-testid="button-install-app"
      >
        <Download className="h-4 w-4" />
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t('pwa.title', 'Install OnRopePro')}
            </DialogTitle>
            <DialogDescription>
              {t('pwa.description', 'Install this app on your device for quick access')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">{t('pwa.ios.title', 'On iPhone / iPad:')}</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>{t('pwa.ios.step1', 'Tap the Share button (square with arrow)')}</li>
                <li>{t('pwa.ios.step2', 'Scroll down and tap "Add to Home Screen"')}</li>
                <li>{t('pwa.ios.step3', 'Tap "Add" to confirm')}</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">{t('pwa.android.title', 'On Android:')}</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>{t('pwa.android.step1', 'Tap the menu (three dots in top right)')}</li>
                <li>{t('pwa.android.step2', 'Tap "Add to Home screen" or "Install app"')}</li>
                <li>{t('pwa.android.step3', 'Tap "Install" or "Add" to confirm')}</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">{t('pwa.desktop.title', 'On Desktop (Chrome/Edge):')}</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>{t('pwa.desktop.step1', 'Look for the install icon in the address bar')}</li>
                <li>{t('pwa.desktop.step2', 'Or open browser menu and select "Install OnRopePro"')}</li>
                <li>{t('pwa.desktop.step3', 'Click "Install" to confirm')}</li>
              </ol>
            </div>
          </div>

          <Button onClick={() => setShowDialog(false)} className="w-full">
            {t('pwa.gotIt', 'Got it')}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

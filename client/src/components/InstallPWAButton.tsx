import { useState } from "react";
import { Download, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function InstallPWAButton() {
  const { canInstall, isInstalled, isIOS, isMobile, promptInstall } = usePWAInstall();
  const [showIOSDialog, setShowIOSDialog] = useState(false);
  const [showAndroidDialog, setShowAndroidDialog] = useState(false);
  const [showDesktopDialog, setShowDesktopDialog] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSDialog(true);
    } else if (canInstall) {
      await promptInstall();
    } else if (isMobile) {
      // Android but beforeinstallprompt hasn't fired - show instructions
      setShowAndroidDialog(true);
    } else {
      // Desktop without native install support - show instructions
      setShowDesktopDialog(true);
    }
  };

  // Always show the install button (removed the guard that hid it on desktop)

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className="gap-2"
        data-testid="button-install-app"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Install App</span>
      </Button>

      <Dialog open={showIOSDialog} onOpenChange={setShowIOSDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Install OnRopePro
            </DialogTitle>
            <DialogDescription>
              To install this app on your iPhone or iPad:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium">Tap the Share button</p>
                <p className="text-sm text-muted-foreground">
                  Look for the square with an arrow pointing up at the bottom of Safari
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium">Scroll down and tap "Add to Home Screen"</p>
                <p className="text-sm text-muted-foreground">
                  This will add OnRopePro to your home screen
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Tap "Add"</p>
                <p className="text-sm text-muted-foreground">
                  Confirm to install the app on your device
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowIOSDialog(false)} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showAndroidDialog} onOpenChange={setShowAndroidDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Install OnRopePro
            </DialogTitle>
            <DialogDescription>
              To install this app on your Android device:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium">Tap the menu button</p>
                <p className="text-sm text-muted-foreground">
                  Look for the three dots in the top right corner of Chrome
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium">Tap "Add to Home screen" or "Install app"</p>
                <p className="text-sm text-muted-foreground">
                  This will add OnRopePro to your home screen
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Tap "Install" or "Add"</p>
                <p className="text-sm text-muted-foreground">
                  Confirm to install the app on your device
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowAndroidDialog(false)} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showDesktopDialog} onOpenChange={setShowDesktopDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Install OnRopePro
            </DialogTitle>
            <DialogDescription>
              To install this app on your computer:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium">Use Chrome or Edge browser</p>
                <p className="text-sm text-muted-foreground">
                  PWA installation works best in Chrome or Microsoft Edge
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium">Look for the install icon</p>
                <p className="text-sm text-muted-foreground">
                  Click the install icon in the address bar (right side) or use the browser menu
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Click "Install"</p>
                <p className="text-sm text-muted-foreground">
                  Confirm to install the app on your desktop
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowDesktopDialog(false)} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

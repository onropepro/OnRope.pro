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

interface InstallPWAButtonProps {
  stakeholderColor?: string | null;
  useDarkText?: boolean;
}

export function InstallPWAButton({ stakeholderColor, useDarkText = false }: InstallPWAButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  // Determine text/border styling based on background color contrast
  const textColorClass = useDarkText ? "text-slate-900" : "text-white";
  const borderColorClass = useDarkText ? "border-black/20" : "border-white/30";
  const hoverBgClass = useDarkText ? "hover:bg-black/10" : "hover:bg-white/10";

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        size="sm"
        className={stakeholderColor ? `gap-2 ${textColorClass} ${borderColorClass} ${hoverBgClass}` : "gap-2"}
        data-testid="button-install-app"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Install App</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Install OnRopePro
            </DialogTitle>
            <DialogDescription>
              Install this app on your device for quick access
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">On iPhone / iPad:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Tap the <strong>Share</strong> button (square with arrow)</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                <li>Tap <strong>"Add"</strong> to confirm</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">On Android:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Tap the <strong>menu</strong> (three dots in top right)</li>
                <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                <li>Tap <strong>"Install"</strong> or <strong>"Add"</strong> to confirm</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">On Desktop (Chrome/Edge):</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Look for the <strong>install icon</strong> in the address bar</li>
                <li>Or open browser menu and select <strong>"Install OnRopePro"</strong></li>
                <li>Click <strong>"Install"</strong> to confirm</li>
              </ol>
            </div>
          </div>

          <Button onClick={() => setShowDialog(false)} className="w-full">
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

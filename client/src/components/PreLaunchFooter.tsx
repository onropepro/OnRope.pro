import { useState } from "react";
import { Input } from "@/components/ui/input";
import { usePreLaunch } from "@/contexts/PreLaunchContext";
import { useToast } from "@/hooks/use-toast";
import onRopeProLogo from "@assets/OnRopePro-logo-white_1767469623033.png";

export function PreLaunchFooter() {
  const { attemptBypass } = usePreLaunch();
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const currentYear = new Date().getFullYear();

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setPin(numericValue);

    if (numericValue.length === 4) {
      const success = attemptBypass(numericValue);
      if (success) {
        toast({
          title: "Access granted",
          description: "You now have full access to the site.",
        });
        window.location.reload();
      } else {
        setPin("");
      }
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 w-auto" />
          </div>

          <div className="text-center">
            <p className="text-base text-muted-foreground">
              © {currentYear} OnRopePro. Built in Vancouver, BC.
            </p>
            <p className="text-base text-muted-foreground">
              Questions?{" "}
              <a href="mailto:hello@onrope.pro" className="underline hover:text-foreground">
                hello@onrope.pro
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="PIN"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              className="w-16 text-center text-base"
              data-testid="input-bypass-pin"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

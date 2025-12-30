import { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface EmbeddedCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: string;
  currency?: string;
  billingFrequency?: 'monthly' | 'annual';
  isNewCustomer?: boolean;
  onComplete?: () => void;
}

export function EmbeddedCheckoutDialog({
  open,
  onOpenChange,
  tier,
  currency = "usd",
  billingFrequency = "monthly",
  isNewCustomer = false,
  onComplete,
}: EmbeddedCheckoutDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useCallback(async () => {
    try {
      setError(null);
      const endpoint = isNewCustomer
        ? "/api/stripe/create-embedded-license-checkout"
        : "/api/stripe/create-embedded-checkout";

      const response = await apiRequest("POST", endpoint, { tier, currency, billingFrequency });
      const data = await response.json();

      if (!data.clientSecret) {
        throw new Error("Failed to create checkout session");
      }

      return data.clientSecret;
    } catch (err: any) {
      setError(err.message || "Failed to initialize checkout");
      throw err;
    }
  }, [tier, currency, billingFrequency, isNewCustomer]);

  const options = {
    fetchClientSecret,
    onComplete: () => {
      onOpenChange(false);
      if (onComplete) {
        onComplete();
      }
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Subscription</DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="p-4 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div id="checkout" className="min-h-[400px]">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface InlineEmbeddedCheckoutProps {
  tier: string;
  currency?: string;
  billingFrequency?: 'monthly' | 'annual';
  isNewCustomer?: boolean;
  onComplete?: () => void;
}

export function InlineEmbeddedCheckout({
  tier,
  currency = "usd",
  billingFrequency = "monthly",
  isNewCustomer = false,
  onComplete,
}: InlineEmbeddedCheckoutProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClientSecret = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const endpoint = isNewCustomer
        ? "/api/stripe/create-embedded-license-checkout"
        : "/api/stripe/create-embedded-checkout";

      const response = await apiRequest("POST", endpoint, { tier, currency, billingFrequency });
      const data = await response.json();

      if (!data.clientSecret) {
        throw new Error("Failed to create checkout session");
      }

      setLoading(false);
      return data.clientSecret;
    } catch (err: any) {
      setError(err.message || "Failed to initialize checkout");
      setLoading(false);
      throw err;
    }
  }, [tier, currency, billingFrequency, isNewCustomer]);

  const options = {
    fetchClientSecret,
    onComplete: () => {
      if (onComplete) {
        onComplete();
      }
    },
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div id="checkout" className="min-h-[400px]">
      {loading && (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

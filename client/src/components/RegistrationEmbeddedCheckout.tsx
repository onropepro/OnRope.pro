import { useState, useCallback, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import type { BillingFrequency } from "@shared/stripe-config";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface RegistrationCheckoutProps {
  companyName: string;
  ownerName: string;
  email: string;
  password: string;
  billingFrequency: BillingFrequency;
  onComplete?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

export function RegistrationEmbeddedCheckout({
  companyName,
  ownerName,
  email,
  password,
  billingFrequency,
  onComplete,
  onError,
}: RegistrationCheckoutProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionIdRef = useRef<string | null>(null);

  const fetchClientSecret = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await fetch("/api/stripe/create-registration-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          ownerName,
          email,
          password,
          billingFrequency,
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create checkout session");
      }

      sessionIdRef.current = data.sessionId;
      setLoading(false);
      return data.clientSecret;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to initialize checkout";
      setError(errorMessage);
      setLoading(false);
      if (onError) {
        onError(errorMessage);
      }
      throw err;
    }
  }, [companyName, ownerName, email, password, billingFrequency, onError]);

  const options = {
    fetchClientSecret,
    onComplete: () => {
      if (onComplete && sessionIdRef.current) {
        onComplete(sessionIdRef.current);
      }
    },
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div id="registration-checkout" className="min-h-[400px]">
      {loading && (
        <div className="flex flex-col items-center justify-center h-[400px] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Setting up secure checkout...</p>
        </div>
      )}
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionData {
  licenseKey: string;
  tier: string;
  tierName: string;
  currency: string;
  maxProjects: number;
  maxSeats: number;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  trialEnd: number | null;
}

export default function CompleteRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Get session_id from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      toast({
        title: "Missing Session ID",
        description: "No checkout session found. Redirecting to license purchase...",
        variant: "destructive",
      });
      setTimeout(() => setLocation('/get-license'), 3000);
      return;
    }

    // Fetch session data
    fetchSessionData(sessionId);
  }, []);

  const fetchSessionData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/checkout-session/${sessionId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve session');
      }

      const data = await response.json();
      setSessionData(data);
      setLoading(false);
    } catch (error: any) {
      console.error('[CompleteRegistration] Failed to fetch session:', error);
      toast({
        title: "Error",
        description: "Failed to retrieve checkout session. Please contact support.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCopyLicenseKey = () => {
    if (sessionData?.licenseKey) {
      navigator.clipboard.writeText(sessionData.licenseKey);
      setCopiedKey(true);
      toast({
        title: "Copied!",
        description: "License key copied to clipboard",
      });
      setTimeout(() => setCopiedKey(false), 3000);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionData) {
      toast({
        title: "Error",
        description: "Session data not available",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (!companyName || !email || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      setRegistering(true);

      const response = await fetch('/api/register-with-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          companyName,
          email,
          password,
          licenseKey: sessionData.licenseKey,
          stripeCustomerId: sessionData.stripeCustomerId,
          stripeSubscriptionId: sessionData.stripeSubscriptionId,
          tier: sessionData.tier,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      toast({
        title: "Success!",
        description: "Your account has been created. Redirecting to dashboard...",
      });

      // Redirect to dashboard after successful registration
      setTimeout(() => setLocation('/dashboard'), 2000);
    } catch (error: any) {
      console.error('[CompleteRegistration] Registration error:', error);
      toast({
        title: "Registration Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <span className="material-icons text-6xl text-destructive">error</span>
              <h2 className="text-2xl font-bold">Session Not Found</h2>
              <p className="text-muted-foreground">
                Unable to retrieve checkout session. Please contact support.
              </p>
              <Button onClick={() => setLocation('/get-license')}>
                Back to License Purchase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const trialEndDate = sessionData.trialEnd 
    ? new Date(sessionData.trialEnd * 1000).toLocaleDateString() 
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-icons text-2xl text-primary">apartment</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Rope Access Pro</h1>
              <p className="text-sm text-muted-foreground">Complete Your Registration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6">
          {/* Success Message */}
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary text-2xl">check_circle</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Payment Successful!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your {sessionData.tierName} subscription has been activated with a 30-day free trial.
                    {trialEndDate && ` Your trial ends on ${trialEndDate}.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Key Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="material-icons text-primary">vpn_key</span>
                Your License Key
              </CardTitle>
              <CardDescription>
                Save this key securely. You'll need it to verify your account in the future.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <code className="flex-1 text-lg font-mono font-bold tracking-wider">
                  {sessionData.licenseKey}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLicenseKey}
                  data-testid="button-copy-license"
                >
                  <span className="material-icons">
                    {copiedKey ? 'check' : 'content_copy'}
                  </span>
                </Button>
              </div>

              {/* Subscription Details */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Subscription Tier</Label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-sm">
                      {sessionData.tierName}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Projects</Label>
                  <p className="text-sm font-semibold mt-1">
                    {sessionData.maxProjects === -1 ? 'Unlimited' : sessionData.maxProjects}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Seats</Label>
                  <p className="text-sm font-semibold mt-1">
                    {sessionData.maxSeats === -1 ? 'Unlimited' : sessionData.maxSeats}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Trial Status</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      30-Day Free Trial
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Company Account</CardTitle>
              <CardDescription>
                Complete your registration to access your rope access management platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    required
                    data-testid="input-company-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    data-testid="input-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    data-testid="input-confirm-password"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={registering}
                    data-testid="button-complete-registration"
                  >
                    {registering ? (
                      <>
                        <span className="material-icons mr-2 animate-spin">sync</span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">check_circle</span>
                        Complete Registration
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

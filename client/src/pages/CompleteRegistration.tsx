import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { trackSignUp, trackSubscriptionPurchase } from "@/lib/analytics";
import { formatTimestampDate } from "@/lib/dateUtils";

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

interface EmbeddedRegistrationData {
  flow: 'embedded';
  success: boolean;
  alreadyProcessed?: boolean;
  companyName: string;
  email?: string;
  trialEnd: number | null;
  message: string;
}

export default function CompleteRegistration() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [embeddedData, setEmbeddedData] = useState<EmbeddedRegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [flowType, setFlowType] = useState<'embedded' | 'legacy' | null>(null);

  // Form state (for legacy flow only)
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Get session_id from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) {
      setLoading(false);
      toast({
        title: t('completeRegistration.missingSessionTitle', 'Missing Session ID'),
        description: t('completeRegistration.missingSessionDesc', 'No checkout session found. Redirecting to license purchase...'),
        variant: "destructive",
      });
      setTimeout(() => setLocation('/get-license'), 3000);
      return;
    }

    // Try the new embedded registration flow first
    tryEmbeddedRegistration(sessionId);
  }, [toast, setLocation]);

  // Try the new embedded registration endpoint first
  const tryEmbeddedRegistration = async (sessionId: string) => {
    try {
      console.log('[CompleteRegistration] Trying embedded registration flow...');
      const response = await fetch(`/api/stripe/complete-registration/${sessionId}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.flow === 'embedded' && data.success) {
        // New embedded flow succeeded - account created automatically
        console.log('[CompleteRegistration] Embedded registration successful:', data);
        setEmbeddedData(data);
        setFlowType('embedded');
        setLoading(false);

        // Track analytics
        trackSignUp('embedded');
        trackSubscriptionPurchase({
          planTier: 'base',
          planPrice: 0,
          currency: 'USD',
          billingPeriod: 'monthly',
          transactionId: sessionId,
        });

        // Show success toast
        toast({
          title: t('completeRegistration.successTitle', 'Success!'),
          description: data.alreadyProcessed 
            ? t('completeRegistration.alreadyComplete', 'Your registration was already completed.')
            : t('completeRegistration.accountCreated', 'Your account has been created!'),
        });

        // Auto-redirect to employer dashboard after 5 seconds (longer to let welcome message sink in)
        setTimeout(() => setLocation('/employer'), 5000);
        return;
      }

      // If not an embedded checkout, fall back to legacy flow
      console.log('[CompleteRegistration] Not an embedded checkout, trying legacy flow...');
      await fetchSessionData(sessionId);
    } catch (error: any) {
      console.log('[CompleteRegistration] Embedded flow failed, trying legacy:', error.message);
      // Fall back to legacy flow on any error
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      if (sessionId) {
        await fetchSessionData(sessionId);
      }
    }
  };

  // Legacy flow: fetch session data for manual registration
  const fetchSessionData = async (sessionId: string) => {
    try {
      setFlowType('legacy');
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
        title: t('completeRegistration.errorTitle', 'Error'),
        description: t('completeRegistration.failedToRetrieve', 'Failed to retrieve checkout session. Please contact support.'),
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
        title: t('completeRegistration.copied', 'Copied!'),
        description: t('completeRegistration.copiedDesc', 'License key copied to clipboard'),
      });
      setTimeout(() => setCopiedKey(false), 3000);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionData) {
      toast({
        title: t('completeRegistration.errorTitle', 'Error'),
        description: t('completeRegistration.sessionDataError', 'Session data not available'),
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (!companyName || !email || !password || !confirmPassword) {
      toast({
        title: t('completeRegistration.validationError', 'Validation Error'),
        description: t('completeRegistration.fillAllFields', 'Please fill in all fields'),
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: t('completeRegistration.validationError', 'Validation Error'),
        description: t('completeRegistration.passwordsNoMatch', 'Passwords do not match'),
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: t('completeRegistration.validationError', 'Validation Error'),
        description: t('completeRegistration.passwordMinLength', 'Password must be at least 8 characters'),
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
        title: t('completeRegistration.successTitle', 'Success!'),
        description: t('completeRegistration.accountCreated', 'Your account has been created. Redirecting to your profile...'),
      });

      // Track sign up and subscription purchase
      trackSignUp('email');
      trackSubscriptionPurchase({
        planTier: sessionData.tier,
        planPrice: 0,
        currency: sessionData.currency || 'USD',
        billingPeriod: 'monthly',
        transactionId: sessionData.stripeSubscriptionId,
      });

      // Redirect to profile page to complete account details
      setTimeout(() => setLocation('/profile'), 2000);
    } catch (error: any) {
      console.error('[CompleteRegistration] Registration error:', error);
      toast({
        title: t('completeRegistration.registrationError', 'Registration Error'),
        description: error.message || t('completeRegistration.registrationFailed', 'Failed to create account. Please try again.'),
        variant: "destructive",
      });
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="material-icons text-3xl text-primary animate-spin">sync</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {t('completeRegistration.settingUp', 'Setting up your account...')}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {t('completeRegistration.justAMoment', 'Just a moment while we finalize everything.')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Embedded flow success view
  if (flowType === 'embedded' && embeddedData) {
    const trialEndDate = embeddedData.trialEnd 
      ? formatTimestampDate(new Date(embeddedData.trialEnd * 1000)) 
      : null;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <span className="material-icons text-4xl text-green-600 dark:text-green-400">check_circle</span>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {t('completeRegistration.welcomeTitle', 'Welcome to OnRopePro!')}
                </h2>
                <p className="text-muted-foreground">
                  {t('completeRegistration.accountReady', 'Your account for {{companyName}} is ready.', { companyName: embeddedData.companyName })}
                </p>
              </div>

              {trialEndDate && (
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <p className="text-muted-foreground">
                    {t('completeRegistration.trialInfo', 'Your 30-day free trial has started. You won\'t be charged until {{date}}.', { date: trialEndDate })}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => setLocation('/employer')}
                  data-testid="button-go-to-dashboard"
                >
                  <span className="material-icons mr-2">dashboard</span>
                  {t('completeRegistration.goToDashboard', 'Go to Dashboard')}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {t('completeRegistration.autoRedirect', 'Redirecting automatically in a few seconds...')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Legacy flow: no session data
  if (flowType === 'legacy' && !sessionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <span className="material-icons text-6xl text-destructive">error</span>
              <h2 className="text-2xl font-bold">{t('completeRegistration.sessionNotFound', 'Session Not Found')}</h2>
              <p className="text-muted-foreground">
                {t('completeRegistration.sessionNotFoundDesc', 'Unable to retrieve checkout session. Please contact support.')}
              </p>
              <Button onClick={() => setLocation('/get-license')}>
                {t('completeRegistration.backToLicensePurchase', 'Back to License Purchase')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Legacy flow requires sessionData
  if (!sessionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <span className="material-icons text-6xl text-destructive">error</span>
              <h2 className="text-2xl font-bold">{t('completeRegistration.sessionNotFound', 'Session Not Found')}</h2>
              <p className="text-muted-foreground">
                {t('completeRegistration.sessionNotFoundDesc', 'Unable to retrieve checkout session. Please contact support.')}
              </p>
              <Button onClick={() => setLocation('/get-license')}>
                {t('completeRegistration.backToLicensePurchase', 'Back to License Purchase')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const trialEndDate = sessionData.trialEnd 
    ? formatTimestampDate(new Date(sessionData.trialEnd * 1000)) 
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
              <h1 className="text-2xl font-bold">{t('completeRegistration.header.title', 'Rope Access Pro')}</h1>
              <p className="text-sm text-muted-foreground">{t('completeRegistration.header.subtitle', 'Complete Your Registration')}</p>
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
                  <h3 className="font-semibold text-lg mb-2">{t('completeRegistration.paymentSuccessTitle', 'Payment Successful!')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('completeRegistration.paymentSuccessDesc', 'Your {{tierName}} subscription has been activated with a 30-day free trial.', { tierName: sessionData.tierName })}
                    {trialEndDate && ` ${t('completeRegistration.trialEnds', 'Your trial ends on {{date}}.', { date: trialEndDate })}`}
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
                {t('completeRegistration.licenseKey', 'Your License Key')}
              </CardTitle>
              <CardDescription>
                {t('completeRegistration.licenseKeyDesc', "Save this key securely. You'll need it to verify your account in the future.")}
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
                  <Label className="text-xs text-muted-foreground">{t('completeRegistration.subscriptionTier', 'Subscription Tier')}</Label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-sm">
                      {sessionData.tierName}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('completeRegistration.maxProjects', 'Max Projects')}</Label>
                  <p className="text-sm font-semibold mt-1">
                    {sessionData.maxProjects === -1 ? t('completeRegistration.unlimited', 'Unlimited') : sessionData.maxProjects}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('completeRegistration.maxSeats', 'Max Seats')}</Label>
                  <p className="text-sm font-semibold mt-1">
                    {sessionData.maxSeats === -1 ? t('completeRegistration.unlimited', 'Unlimited') : sessionData.maxSeats}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('completeRegistration.currency', 'Currency')}</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      {sessionData.currency?.toUpperCase() || 'USD'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('completeRegistration.createAccountTitle', 'Create Your Account')}</CardTitle>
              <CardDescription>
                {t('completeRegistration.createAccountDesc', 'Complete the form below to set up your company account')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">{t('completeRegistration.companyName', 'Company Name')}</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={t('completeRegistration.companyNamePlaceholder', 'Your Company Name')}
                    required
                    data-testid="input-company-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('completeRegistration.ownerEmail', 'Owner Email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('completeRegistration.ownerEmailPlaceholder', 'owner@company.com')}
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('completeRegistration.password', 'Password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('completeRegistration.passwordPlaceholder', 'Minimum 8 characters')}
                    required
                    data-testid="input-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('completeRegistration.confirmPassword', 'Confirm Password')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('completeRegistration.confirmPasswordPlaceholder', 'Re-enter your password')}
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
                        {t('completeRegistration.creatingAccount', 'Creating Account...')}
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">check_circle</span>
                        {t('completeRegistration.createAccountButton', 'Create Account')}
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

import { Lock, Star, Gift, CheckCircle2, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PlusRequiredGateProps {
  referralCode?: string | null;
  language?: 'en' | 'fr' | 'es';
}

const translations = {
  en: {
    plusRequired: "PLUS Required",
    description: "This feature is available exclusively to PLUS members. Upgrade for free by referring a fellow technician!",
    howToUnlock: "How to Unlock PLUS (Free)",
    step1: "Share your unique referral code with a technician colleague",
    step2: "When they sign up using your code, you both get PLUS access",
    step3: "Enjoy all PLUS features immediately after verification",
    plusBenefits: "PLUS Benefits",
    benefits: [
      "Browse job opportunities from verified employers",
      "Be visible to employers looking to hire",
      "Upload and share your resume/CV",
      "Track and manage your job applications",
      "30-day license expiry alerts",
    ],
    yourReferralCode: "Your Referral Code",
    copyCode: "Copy Code",
    codeCopied: "Code copied to clipboard!",
    shareWithColleagues: "Share this code with fellow technicians to unlock PLUS for both of you",
  },
  fr: {
    plusRequired: "PLUS Requis",
    description: "Cette fonctionnalité est réservée aux membres PLUS. Passez gratuitement en parrainant un collègue technicien!",
    howToUnlock: "Comment Débloquer PLUS (Gratuit)",
    step1: "Partagez votre code de parrainage unique avec un collègue technicien",
    step2: "Lorsqu'il s'inscrit avec votre code, vous obtenez tous les deux l'accès PLUS",
    step3: "Profitez de toutes les fonctionnalités PLUS immédiatement après vérification",
    plusBenefits: "Avantages PLUS",
    benefits: [
      "Parcourir les opportunités d'emploi d'employeurs vérifiés",
      "Être visible pour les employeurs qui recrutent",
      "Télécharger et partager votre CV",
      "Suivre et gérer vos candidatures",
      "Alertes d'expiration de licence à 30 jours",
    ],
    yourReferralCode: "Votre Code de Parrainage",
    copyCode: "Copier",
    codeCopied: "Code copié dans le presse-papiers!",
    shareWithColleagues: "Partagez ce code avec vos collègues techniciens pour débloquer PLUS pour vous deux",
  },
  es: {
    plusRequired: "PLUS Requerido",
    description: "Esta función está disponible exclusivamente para miembros PLUS. ¡Actualiza gratis refiriendo a un compañero técnico!",
    howToUnlock: "Cómo Desbloquear PLUS (Gratis)",
    step1: "Comparte tu código de referido único con un colega técnico",
    step2: "Cuando se registre usando tu código, ambos obtienen acceso PLUS",
    step3: "Disfruta de todas las funciones PLUS inmediatamente después de la verificación",
    plusBenefits: "Beneficios PLUS",
    benefits: [
      "Explorar oportunidades de empleo de empleadores verificados",
      "Ser visible para empleadores que buscan contratar",
      "Subir y compartir tu currículum/CV",
      "Rastrear y gestionar tus solicitudes de empleo",
      "Alertas de vencimiento de licencia a 30 días",
    ],
    yourReferralCode: "Tu Código de Referido",
    copyCode: "Copiar",
    codeCopied: "¡Código copiado al portapapeles!",
    shareWithColleagues: "Comparte este código con compañeros técnicos para desbloquear PLUS para ambos",
  },
};

export function PlusRequiredGate({ referralCode, language = 'en' }: PlusRequiredGateProps) {
  const { toast } = useToast();
  const t = translations[language] || translations.en;

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast({ title: t.codeCopied });
    }
  };

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 dark:from-amber-950/30 dark:via-background dark:to-amber-950/20">
      <CardContent className="pt-8 pb-8">
        <div className="flex flex-col items-center text-center space-y-6 max-w-lg mx-auto">
          <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900/40">
            <Lock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              {t.plusRequired}
            </h2>
            <p className="text-muted-foreground">{t.description}</p>
          </div>

          <div className="bg-muted/60 dark:bg-muted/30 rounded-xl p-5 w-full text-left">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-base">
              <Gift className="w-5 h-5 text-primary" />
              {t.howToUnlock}
            </h3>
            <ol className="text-sm space-y-3 list-decimal list-inside text-muted-foreground">
              <li className="leading-relaxed">{t.step1}</li>
              <li className="leading-relaxed">{t.step2}</li>
              <li className="leading-relaxed">{t.step3}</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-card rounded-xl p-5 w-full border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-base">
              <Star className="w-5 h-5 text-amber-500" />
              {t.plusBenefits}
            </h3>
            <ul className="text-sm text-left space-y-2.5">
              {t.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {referralCode && (
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-5 w-full">
              <h4 className="font-semibold mb-3">{t.yourReferralCode}</h4>
              <div className="flex items-center gap-2">
                <code 
                  className="flex-1 bg-white dark:bg-card px-4 py-3 rounded-lg font-mono text-lg tracking-widest text-center border"
                  data-testid="text-referral-code"
                >
                  {referralCode}
                </code>
                <Button
                  variant="default"
                  size="default"
                  onClick={handleCopyCode}
                  className="gap-2"
                  data-testid="button-copy-referral-code"
                >
                  <Copy className="w-4 h-4" />
                  {t.copyCode}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{t.shareWithColleagues}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

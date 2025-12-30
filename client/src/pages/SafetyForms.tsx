import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileCheck, ClipboardList, Shield, AlertTriangle, FileWarning, BookOpen, FileText } from "lucide-react";

export default function SafetyForms() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const safetyFormCards = [
    {
      id: "toolbox-meeting",
      title: t('safetyForms.toolboxMeeting.title', 'Toolbox Meeting'),
      description: t('safetyForms.toolboxMeeting.description', 'Daily safety briefing and hazard assessment'),
      icon: FileCheck,
      onClick: () => navigate("/toolbox-meeting"),
      iconColor: "text-red-500",
      borderColor: "border-l-red-500",
      testId: "card-toolbox-meeting",
    },
    {
      id: "flha-form",
      title: t('safetyForms.flha.title', 'Field Level Hazard Assessment'),
      description: t('safetyForms.flha.description', 'Comprehensive FLHA for rope access operations'),
      icon: AlertTriangle,
      onClick: () => navigate("/flha-form"),
      iconColor: "text-orange-500",
      borderColor: "border-l-orange-500",
      testId: "card-flha-form",
    },
    {
      id: "harness-inspection",
      title: t('safetyForms.harnessInspection.title', 'Harness Inspection'),
      description: t('safetyForms.harnessInspection.description', 'Daily harness and PPE safety inspection'),
      icon: ClipboardList,
      onClick: () => navigate("/harness-inspection"),
      iconColor: "text-primary",
      borderColor: "border-l-blue-500",
      testId: "card-harness-inspection",
    },
    {
      id: "irata-icop",
      title: t('safetyForms.irataIcop.title', 'IRATA ICOP'),
      description: t('safetyForms.irataIcop.description', 'International Code of Practice (TC-102ENG)'),
      icon: BookOpen,
      onClick: () => window.open("https://irata.org/downloads/2055", "_blank", "noopener,noreferrer"),
      iconColor: "text-primary",
      borderColor: "border-l-primary",
      testId: "card-irata-icop",
    },
    {
      id: "incident-report",
      title: t('safetyForms.incidentReport.title', 'Incident Report'),
      description: t('safetyForms.incidentReport.description', 'Document workplace incidents and injuries'),
      icon: FileWarning,
      onClick: () => navigate("/incident-report"),
      iconColor: "text-destructive",
      borderColor: "border-l-destructive",
      testId: "card-incident-report",
    },
    {
      id: "method-statement",
      title: t('safetyForms.methodStatement.title', 'Method Statement'),
      description: t('safetyForms.methodStatement.description', 'Safe work procedures and risk controls'),
      icon: FileText,
      onClick: () => navigate("/method-statement"),
      iconColor: "text-green-500",
      borderColor: "border-l-green-500",
      testId: "card-method-statement",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold truncate">{t('safetyForms.title', 'Safety Forms')}</h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          {t('safetyForms.subtitle', 'Select a safety form to complete or view records')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyFormCards.map((formCard) => {
            const IconComponent = formCard.icon;
            const accentColorClass = formCard.borderColor.replace('border-l-', 'bg-');
            return (
              <Card
                key={formCard.id}
                className="cursor-pointer hover-elevate active-elevate-2 overflow-hidden"
                onClick={formCard.onClick}
                data-testid={formCard.testId}
              >
                <div className="flex">
                  <div className={`w-1 flex-shrink-0 ${accentColorClass}`} />
                  <CardHeader className="flex-1">
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${formCard.iconColor}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span>{formCard.title}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {formCard.description}
                    </CardDescription>
                  </CardHeader>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('safetyForms.compliance.title', 'Safety Compliance')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('safetyForms.compliance.description', 'All safety forms are digitally recorded and can be exported as PDF documents for compliance and auditing purposes.')}
          </p>
        </div>
      </div>
    </div>
  );
}

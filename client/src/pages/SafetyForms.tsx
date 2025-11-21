import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileCheck, ClipboardList, Shield } from "lucide-react";

export default function SafetyForms() {
  const [, navigate] = useLocation();

  const safetyFormCards = [
    {
      id: "toolbox-meeting",
      title: "Toolbox Meeting",
      description: "Daily safety briefing and hazard assessment",
      icon: FileCheck,
      onClick: () => navigate("/toolbox-meeting"),
      iconColor: "text-red-500",
      borderColor: "border-l-red-500",
      testId: "card-toolbox-meeting",
    },
    // Future safety forms can be added here
    // {
    //   id: "incident-report",
    //   title: "Incident Report",
    //   description: "Report workplace incidents and near-misses",
    //   icon: ClipboardList,
    //   onClick: () => navigate("/incident-report"),
    //   iconColor: "text-orange-500",
    //   borderColor: "border-l-orange-500",
    //   testId: "card-incident-report",
    // },
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Safety Forms</h1>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">
          Select a safety form to complete or view records
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyFormCards.map((formCard) => {
            const IconComponent = formCard.icon;
            return (
              <Card
                key={formCard.id}
                className={`cursor-pointer hover-elevate active-elevate-2 border-l-4 ${formCard.borderColor}`}
                onClick={formCard.onClick}
                data-testid={formCard.testId}
              >
                <CardHeader>
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
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Safety Compliance
          </h2>
          <p className="text-sm text-muted-foreground">
            All safety forms are digitally recorded and can be exported as PDF documents for compliance and auditing purposes.
          </p>
        </div>
      </div>
    </div>
  );
}

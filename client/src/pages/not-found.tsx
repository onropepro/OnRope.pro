import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-8">
          <div className="mb-6">
            <span className="material-icons text-6xl text-muted-foreground">engineering</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {t('notFound.title', 'Working On It')}
          </h1>
          <p className="text-muted-foreground mb-2">
            {t('notFound.description', "We're aware of this issue and are working to resolve it as fast as we can.")}
          </p>
          <p className="text-muted-foreground mb-6 text-sm">
            {t('notFound.comeback', "Please come back in a few minutes.")}
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('notFound.refresh', 'Refresh Page')}
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
              data-testid="button-home"
            >
              {t('notFound.goHome', 'Go Home')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

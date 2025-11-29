import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-8">
          <div className="mb-6">
            <span className="material-icons text-6xl text-muted-foreground">construction</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{t('notFound.title', 'Page Not Found')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('notFound.description', "The page you're looking for doesn't exist.")}
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="h-12"
            data-testid="button-home"
          >
            {t('notFound.goHome', 'Go Home')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

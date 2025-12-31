import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";
import { CARD_REGISTRY } from "@shared/dashboardCards";
import { useLanguage } from "@/hooks/use-language";

interface PlaceholderCardProps {
  cardId: string;
}

export function PlaceholderCard({ cardId }: PlaceholderCardProps) {
  const { t } = useLanguage();
  const cardDef = CARD_REGISTRY.find((c) => c.id === cardId);
  
  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-muted-foreground" />
          {cardDef?.name || cardId}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-base">{cardDef?.description || t("common.comingSoon", "Coming soon")}</p>
          <p className="text-sm mt-2">{t("common.underDevelopment", "This card is under development")}</p>
        </div>
      </CardContent>
    </div>
  );
}

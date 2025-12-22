import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";
import { CARD_REGISTRY } from "@shared/dashboardCards";

interface PlaceholderCardProps {
  cardId: string;
}

export function PlaceholderCard({ cardId }: PlaceholderCardProps) {
  const cardDef = CARD_REGISTRY.find((c) => c.id === cardId);
  
  return (
    <>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-muted-foreground" />
          {cardDef?.name || cardId}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-base">{cardDef?.description || "Coming soon"}</p>
          <p className="text-sm mt-2">This card is under development</p>
        </div>
      </CardContent>
    </>
  );
}

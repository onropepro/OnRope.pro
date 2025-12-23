import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

interface DashboardCardProps {
  cardId: string;
  isEditMode: boolean;
  onRemove: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
  size?: 'single' | 'double';
  children: React.ReactNode;
}

const CARD_HEIGHT = {
  single: 'h-[200px]',
  double: 'h-[416px]', // 200 * 2 + 16px gap
};

export function DashboardCard({
  cardId,
  isEditMode,
  onRemove,
  dragHandleProps,
  isDragging,
  size = 'single',
  children,
}: DashboardCardProps) {
  return (
    <Card
      className={`relative rounded-2xl shadow-md transition-all duration-200 flex flex-col ${CARD_HEIGHT[size]} ${
        isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
      } ${isEditMode ? "ring-1 ring-dashed ring-muted-foreground/30" : ""}`}
      data-testid={`card-${cardId}`}
    >
      {isEditMode && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-0.5 bg-background/95 backdrop-blur-sm rounded-md border border-border shadow-sm px-1 py-0.5">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
            data-testid={`drag-handle-${cardId}`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
            data-testid={`button-remove-card-${cardId}`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {children}
      </div>
    </Card>
  );
}

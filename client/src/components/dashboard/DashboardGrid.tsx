import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, X, Settings, Check, RotateCcw, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { getCardById, type CardDefinition } from "@shared/dashboardCards";
import { DashboardCard } from "./DashboardCard";
import { CardSkeleton } from "./CardSkeleton";
import { getCardComponent } from "./cardRegistry";
import { ActiveSessionBadge } from "@/components/ActiveSessionBadge";

interface DashboardGridProps {
  currentUser: any;
  projects: any[];
  employees: any[];
  harnessInspections: any[];
  onNavigate: (tab: string) => void;
  onRouteNavigate: (path: string) => void;
  branding?: any;
}

interface LayoutCard {
  id: string;
  position: number;
}

interface LayoutResponse {
  cards: LayoutCard[];
  isDefault: boolean;
}

interface AvailableCardsResponse {
  cards: { id: string; name: string; category: string }[];
  grouped: Record<string, { id: string; name: string; description: string; category: string }[]>;
}

export function DashboardGrid({
  currentUser,
  projects,
  employees,
  harnessInspections,
  onNavigate,
  onRouteNavigate,
  branding,
}: DashboardGridProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: layoutData, isLoading: isLayoutLoading } = useQuery<LayoutResponse>({
    queryKey: ["/api/dashboard/layout"],
    enabled: !!currentUser,
  });

  const { data: availableCardsData } = useQuery<AvailableCardsResponse>({
    queryKey: ["/api/dashboard/available-cards"],
    enabled: !!currentUser,
  });

  const saveLayoutMutation = useMutation({
    mutationFn: async (cards: string[]) => {
      return apiRequest("PUT", "/api/dashboard/layout", { cards });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/layout"] });
      toast({
        title: t("dashboardGrid.dashboardSaved"),
        description: t("dashboardGrid.dashboardSavedDescription"),
      });
      setHasChanges(false);
      setIsEditMode(false);
    },
    onError: (error: any) => {
      toast({
        title: t("dashboardGrid.failedToSave"),
        description: error.message || t("dashboardGrid.failedToSaveDescription"),
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (layoutData?.cards) {
      setCardOrder(layoutData.cards.map((c) => c.id));
    }
  }, [layoutData]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(cardOrder);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    setCardOrder(items);
    setHasChanges(true);
  }, [cardOrder]);

  const handleRemoveCard = useCallback((cardId: string) => {
    setCardOrder((prev) => prev.filter((id) => id !== cardId));
    setHasChanges(true);
  }, []);

  const handleAddCard = useCallback((cardId: string) => {
    if (!cardOrder.includes(cardId)) {
      setCardOrder((prev) => [...prev, cardId]);
      setHasChanges(true);
    }
  }, [cardOrder]);

  const handleSave = useCallback(() => {
    saveLayoutMutation.mutate(cardOrder);
  }, [cardOrder, saveLayoutMutation]);

  const handleCancel = useCallback(() => {
    if (layoutData?.cards) {
      setCardOrder(layoutData.cards.map((c) => c.id));
    }
    setHasChanges(false);
    setIsEditMode(false);
  }, [layoutData]);

  const handleReset = useCallback(() => {
    saveLayoutMutation.mutate([]);
    toast({
      title: "Reset to default",
      description: "Your dashboard will reload with default cards.",
    });
  }, [saveLayoutMutation, toast]);

  if (isLayoutLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const availableToAdd =
    availableCardsData?.grouped
      ? Object.entries(availableCardsData.grouped)
          .flatMap(([category, cards]) =>
            cards
              .filter((c) => !cardOrder.includes(c.id))
              .map((c) => ({ ...c, category }))
          )
      : [];

  const groupedAvailable = availableToAdd.reduce((acc, card) => {
    if (!acc[card.category]) acc[card.category] = [];
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, typeof availableToAdd>);

  const categoryLabels: Record<string, string> = {
    OPERATIONS: "Operations",
    FINANCIAL: "Financial",
    SAFETY: "Safety",
    SCHEDULING: "Scheduling",
    TEAM: "Team",
    FEEDBACK: "Feedback",
    PERFORMANCE: "Performance",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {isEditMode && (
            <>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">
                <Settings className="w-3 h-3 mr-1" />
                Edit Mode
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={availableToAdd.length === 0}
                    data-testid="button-add-card"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Card
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
                  {Object.entries(groupedAvailable).map(([category, cards]) => (
                    <div key={category}>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        {categoryLabels[category] || category}
                      </DropdownMenuLabel>
                      {cards.map((card) => (
                        <DropdownMenuItem
                          key={card.id}
                          onClick={() => handleAddCard(card.id)}
                          data-testid={`menu-add-card-${card.id}`}
                        >
                          <div className="flex flex-col">
                            <span className="text-base">{card.name}</span>
                            <span className="text-xs text-muted-foreground">{card.description}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </div>
                  ))}
                  {availableToAdd.length === 0 && (
                    <DropdownMenuItem disabled>
                      All available cards added
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isEditMode ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                data-testid="button-reset-layout"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges || saveLayoutMutation.isPending}
                data-testid="button-save-layout"
              >
                <Check className="w-4 h-4 mr-1" />
                {saveLayoutMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <>
              {currentUser?.role === 'company' && (currentUser?.residentCode || currentUser?.propertyManagerCode) && (
                <div className="hidden lg:flex items-center gap-3 text-xs">
                  {currentUser?.residentCode && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground font-medium">Resident:</span>
                      <Badge 
                        variant="outline" 
                        className="font-mono text-xs px-2 py-0.5 cursor-pointer hover-elevate" 
                        data-testid="badge-resident-code"
                        onClick={() => {
                          navigator.clipboard.writeText(currentUser.residentCode);
                          toast({ title: t("dashboardGrid.copied"), description: t("dashboardGrid.residentCodeCopied") });
                        }}
                      >
                        {currentUser.residentCode}
                        <Copy className="w-3 h-3 ml-1.5 text-muted-foreground" />
                      </Badge>
                    </div>
                  )}
                  {currentUser?.propertyManagerCode && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground font-medium">Property Mgr:</span>
                      <Badge 
                        variant="outline" 
                        className="font-mono text-xs px-2 py-0.5 cursor-pointer hover-elevate" 
                        data-testid="badge-property-manager-code"
                        onClick={() => {
                          navigator.clipboard.writeText(currentUser.propertyManagerCode);
                          toast({ title: t("dashboardGrid.copied"), description: t("dashboardGrid.propertyManagerCodeCopied") });
                        }}
                      >
                        {currentUser.propertyManagerCode}
                        <Copy className="w-3 h-3 ml-1.5 text-muted-foreground" />
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              <ActiveSessionBadge />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditMode(true)}
                data-testid="button-customize-dashboard"
              >
                <Settings className="w-4 h-4 mr-1" />
                Customize
              </Button>
            </>
          )}
        </div>
      </div>

      {cardOrder.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-base mb-4">No cards on your dashboard yet.</p>
          {isEditMode ? (
            <p className="text-sm">Use the "Add Card" button above to add cards.</p>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditMode(true)}
              data-testid="button-start-customizing"
            >
              <Plus className="w-4 h-4 mr-1" />
              Start Customizing
            </Button>
          )}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard-grid" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {cardOrder.map((cardId, index) => {
                  const cardDef = getCardById(cardId);
                  return (
                    <Draggable
                      key={cardId}
                      draggableId={cardId}
                      index={index}
                      isDragDisabled={!isEditMode}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? "z-50" : ""}`}
                        >
                          <DashboardCard
                            cardId={cardId}
                            isEditMode={isEditMode}
                            onRemove={() => handleRemoveCard(cardId)}
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            size={cardDef?.size || 'single'}
                          >
                            {getCardComponent(cardId, {
                              currentUser,
                              projects,
                              employees,
                              harnessInspections,
                              onNavigate,
                              onRouteNavigate,
                              branding,
                            })}
                          </DashboardCard>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

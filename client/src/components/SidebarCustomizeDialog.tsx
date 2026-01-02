import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GripVertical, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NavGroup, NavItem, DashboardVariant } from "./DashboardSidebar";
import type { User } from "@/lib/permissions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarCustomizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: DashboardVariant;
  navigationGroups: NavGroup[];
  currentUser: User | null | undefined;
}

interface SidebarPreferencesResponse {
  preferences: Record<string, { itemId: string; position: number }[]>;
  groupOrder?: string[];
  variant: string;
  isDefault: boolean;
}

export function SidebarCustomizeDialog({
  open,
  onOpenChange,
  variant,
  navigationGroups,
  currentUser,
}: SidebarCustomizeDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [editableGroups, setEditableGroups] = useState<NavGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const { data: preferences, isLoading, isError } = useQuery<SidebarPreferencesResponse>({
    queryKey: ["/api/sidebar/preferences", variant],
    queryFn: async () => {
      const response = await fetch(`/api/sidebar/preferences?variant=${variant}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sidebar preferences");
      }
      return response.json();
    },
    enabled: open,
    retry: false,
  });

  useEffect(() => {
    if (!open) return;

    const filteredGroups = navigationGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.isVisible(currentUser)),
      }))
      .filter((group) => group.items.length > 0);

    if (preferences && !preferences.isDefault) {
      let orderedGroups = [...filteredGroups];

      if (preferences.groupOrder && Array.isArray(preferences.groupOrder)) {
        orderedGroups.sort((a, b) => {
          const aIndex = preferences.groupOrder!.indexOf(a.id);
          const bIndex = preferences.groupOrder!.indexOf(b.id);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
      }

      if (preferences.preferences) {
        orderedGroups = orderedGroups.map((group) => {
          const savedOrder = preferences.preferences[group.id];
          if (!savedOrder || !Array.isArray(savedOrder)) return group;

          const itemMap = new Map(group.items.map((item) => [item.id, item]));
          const orderedItems: NavItem[] = [];

          savedOrder
            .sort((a, b) => a.position - b.position)
            .forEach(({ itemId }) => {
              const item = itemMap.get(itemId);
              if (item) {
                orderedItems.push(item);
                itemMap.delete(itemId);
              }
            });

          itemMap.forEach((item) => orderedItems.push(item));

          return { ...group, items: orderedItems };
        });
      }

      setEditableGroups(orderedGroups);
    } else {
      setEditableGroups(filteredGroups);
    }

    setExpandedGroups(new Set(filteredGroups.map(g => g.id)));
  }, [open, navigationGroups, preferences, currentUser]);

  const saveMutation = useMutation({
    mutationFn: async (groups: NavGroup[]) => {
      const groupsData: Record<string, { itemId: string; position: number }[]> = {};
      const groupOrder: string[] = [];
      
      groups.forEach((group) => {
        groupOrder.push(group.id);
        groupsData[group.id] = group.items.map((item, index) => ({
          itemId: item.id,
          position: index,
        }));
      });

      return apiRequest("PUT", "/api/sidebar/preferences", {
        variant,
        groups: groupsData,
        groupOrder,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/sidebar/preferences", variant] });
      toast({
        title: t("sidebar.customize.saved", "Layout saved"),
        description: t("sidebar.customize.savedDesc", "Your sidebar order has been updated."),
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: t("common.error", "Error"),
        description: error.message || t("sidebar.customize.saveError", "Failed to save layout"),
        variant: "destructive",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/sidebar/preferences?variant=${variant}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/sidebar/preferences", variant] });
      const filteredGroups = navigationGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.isVisible(currentUser)),
        }))
        .filter((group) => group.items.length > 0);
      setEditableGroups(filteredGroups);
      toast({
        title: t("sidebar.customize.reset", "Layout reset"),
        description: t("sidebar.customize.resetDesc", "Sidebar order has been reset to default."),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("common.error", "Error"),
        description: error.message || t("sidebar.customize.resetError", "Failed to reset layout"),
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "GROUP") {
      const newGroups = [...editableGroups];
      const [removed] = newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, removed);
      setEditableGroups(newGroups);
      return;
    }

    if (source.droppableId !== destination.droppableId) return;

    const groupId = source.droppableId;
    const groupIndex = editableGroups.findIndex((g) => g.id === groupId);
    if (groupIndex === -1) return;

    const newGroups = [...editableGroups];
    const group = { ...newGroups[groupIndex] };
    const items = [...group.items];

    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);

    group.items = items;
    newGroups[groupIndex] = group;
    setEditableGroups(newGroups);
  };

  const handleSave = () => {
    saveMutation.mutate(editableGroups);
  };

  const handleReset = () => {
    resetMutation.mutate();
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle data-testid="text-sidebar-customize-title">
            {t("sidebar.customize.title", "Customize Sidebar")}
          </DialogTitle>
          <DialogDescription>
            {t("sidebar.customize.descriptionFull", "Drag categories to reorder sections, or expand a category to reorder items within it.")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="groups" type="GROUP">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 ${snapshot.isDraggingOver ? "bg-muted/30 rounded-lg p-1" : ""}`}
                  >
                    {editableGroups.map((group, groupIndex) => (
                      <Draggable key={group.id} draggableId={`group-${group.id}`} index={groupIndex}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`rounded-lg border transition-colors ${
                              snapshot.isDragging
                                ? "shadow-lg border-primary bg-background"
                                : "border-border bg-muted/30"
                            }`}
                          >
                            <div 
                              className="flex items-center gap-2 px-3 py-2"
                              data-testid={`draggable-sidebar-group-${group.id}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-muted-foreground"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex-1">
                                {group.label}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleGroup(group.id)}
                                data-testid={`button-toggle-group-${group.id}`}
                              >
                                {expandedGroups.has(group.id) ? (
                                  <ChevronUp className="h-3 w-3" />
                                ) : (
                                  <ChevronDown className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            
                            {expandedGroups.has(group.id) && (
                              <div className="px-2 pb-2">
                                <Droppable droppableId={group.id} type="ITEM">
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={`space-y-1 rounded-md p-1 transition-colors ${
                                        snapshot.isDraggingOver ? "bg-muted/50" : ""
                                      }`}
                                    >
                                      {group.items.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className={`flex items-center gap-2 px-3 py-2 rounded-md bg-background border transition-colors ${
                                                snapshot.isDragging
                                                  ? "shadow-lg border-primary"
                                                  : "border-border"
                                              }`}
                                              data-testid={`draggable-sidebar-item-${item.id}`}
                                            >
                                              <div
                                                {...provided.dragHandleProps}
                                                className="cursor-grab active:cursor-grabbing text-muted-foreground"
                                              >
                                                <GripVertical className="h-4 w-4" />
                                              </div>
                                              <item.icon className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm flex-1">{item.label}</span>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={resetMutation.isPending || saveMutation.isPending}
            data-testid="button-reset-sidebar-order"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t("sidebar.customize.resetButton", "Reset to Default")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            data-testid="button-save-sidebar-order"
          >
            {saveMutation.isPending
              ? t("common.saving", "Saving...")
              : t("common.save", "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

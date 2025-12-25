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
import { GripVertical, RotateCcw } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NavGroup, NavItem, DashboardVariant } from "./DashboardSidebar";
import type { User } from "@/lib/permissions";

interface SidebarCustomizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: DashboardVariant;
  navigationGroups: NavGroup[];
  currentUser: User | null | undefined;
}

interface SidebarPreferencesResponse {
  preferences: Record<string, { itemId: string; position: number }[]>;
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

  // Local state for editing - groups with items in their current order
  const [editableGroups, setEditableGroups] = useState<NavGroup[]>([]);

  // Fetch current preferences
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

  // Initialize editable groups when dialog opens
  useEffect(() => {
    if (!open) return;

    // Filter groups to only show visible items for current user
    const filteredGroups = navigationGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.isVisible(currentUser)),
      }))
      .filter((group) => group.items.length > 0);

    // Apply saved preferences if any (with defensive guards)
    if (preferences && !preferences.isDefault && preferences.preferences) {
      const orderedGroups = filteredGroups.map((group) => {
        const savedOrder = preferences.preferences[group.id];
        if (!savedOrder || !Array.isArray(savedOrder)) return group;

        // Sort items based on saved positions
        const itemMap = new Map(group.items.map((item) => [item.id, item]));
        const orderedItems: NavItem[] = [];

        // First add items in saved order
        savedOrder
          .sort((a, b) => a.position - b.position)
          .forEach(({ itemId }) => {
            const item = itemMap.get(itemId);
            if (item) {
              orderedItems.push(item);
              itemMap.delete(itemId);
            }
          });

        // Then add any remaining items that weren't in saved preferences
        itemMap.forEach((item) => orderedItems.push(item));

        return { ...group, items: orderedItems };
      });

      setEditableGroups(orderedGroups);
    } else {
      setEditableGroups(filteredGroups);
    }
  }, [open, navigationGroups, preferences, currentUser]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (groups: NavGroup[]) => {
      const groupsData: Record<string, { itemId: string; position: number }[]> = {};
      
      groups.forEach((group) => {
        groupsData[group.id] = group.items.map((item, index) => ({
          itemId: item.id,
          position: index,
        }));
      });

      return apiRequest("PUT", "/api/sidebar/preferences", {
        variant,
        groups: groupsData,
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

  // Reset mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/sidebar/preferences?variant=${variant}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/sidebar/preferences", variant] });
      // Reset to default order
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
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId !== destination.droppableId) return; // Only allow reordering within same group
    if (source.index === destination.index) return;

    const groupId = source.droppableId;
    const groupIndex = editableGroups.findIndex((g) => g.id === groupId);
    if (groupIndex === -1) return;

    const newGroups = [...editableGroups];
    const group = { ...newGroups[groupIndex] };
    const items = [...group.items];

    // Remove from source and insert at destination
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle data-testid="text-sidebar-customize-title">
            {t("sidebar.customize.title", "Customize Sidebar")}
          </DialogTitle>
          <DialogDescription>
            {t("sidebar.customize.description", "Drag items to reorder them within each section.")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              {editableGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    {group.label}
                  </h4>
                  <Droppable droppableId={group.id}>
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
              ))}
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

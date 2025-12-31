import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { FutureIdea } from "@shared/schema";

const CATEGORIES = [
  { value: "feature", label: "New Feature", icon: "add_circle" },
  { value: "improvement", label: "Improvement", icon: "trending_up" },
  { value: "integration", label: "Integration", icon: "extension" },
  { value: "design", label: "Design/UX", icon: "palette" },
  { value: "performance", label: "Performance", icon: "speed" },
  { value: "other", label: "Other", icon: "more_horiz" },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-slate-500" },
  { value: "medium", label: "Medium", color: "bg-amber-500" },
  { value: "high", label: "High", color: "bg-red-500" },
];

const STATUSES = [
  { value: "idea", label: "Idea", color: "bg-purple-500" },
  { value: "planned", label: "Planned", color: "bg-blue-500" },
  { value: "in_progress", label: "In Progress", color: "bg-amber-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
  { value: "archived", label: "Archived", color: "bg-slate-400" },
];

export default function SuperUserFutureIdeas() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingIdea, setEditingIdea] = useState<FutureIdea | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "feature",
    priority: "medium",
    status: "idea",
  });

  const { data: ideas = [], isLoading } = useQuery<FutureIdea[]>({
    queryKey: ["/api/superuser/future-ideas"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/superuser/future-ideas", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/future-ideas"] });
      setShowAddDialog(false);
      resetForm();
      toast({ title: t("superUserFutureIdeas.ideaAdded") });
    },
    onError: () => {
      toast({ title: t("superUserFutureIdeas.addFailed"), variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      return await apiRequest("PATCH", `/api/superuser/future-ideas/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/future-ideas"] });
      setEditingIdea(null);
      resetForm();
      toast({ title: t("superUserFutureIdeas.ideaUpdated") });
    },
    onError: () => {
      toast({ title: t("superUserFutureIdeas.updateFailed"), variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/superuser/future-ideas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/future-ideas"] });
      toast({ title: t("superUserFutureIdeas.ideaDeleted") });
    },
    onError: () => {
      toast({ title: t("superUserFutureIdeas.deleteFailed"), variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "feature",
      priority: "medium",
      status: "idea",
    });
  };

  const openEditDialog = (idea: FutureIdea) => {
    setFormData({
      title: idea.title,
      description: idea.description || "",
      category: idea.category || "feature",
      priority: idea.priority || "medium",
      status: idea.status || "idea",
    });
    setEditingIdea(idea);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({ title: t("superUserFutureIdeas.enterTitle"), variant: "destructive" });
      return;
    }
    if (editingIdea) {
      updateMutation.mutate({ id: editingIdea.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (filterStatus !== "all" && idea.status !== filterStatus) return false;
    if (filterCategory !== "all" && idea.category !== filterCategory) return false;
    return true;
  });

  const getCategoryIcon = (category: string | null) => {
    return CATEGORIES.find((c) => c.value === category)?.icon || "lightbulb";
  };

  const getPriorityBadge = (priority: string | null) => {
    const p = PRIORITIES.find((pr) => pr.value === priority);
    return p ? <Badge className={`${p.color} text-white`}>{p.label}</Badge> : null;
  };

  const getStatusBadge = (status: string | null) => {
    const s = STATUSES.find((st) => st.value === status);
    return s ? <Badge className={`${s.color} text-white`}>{s.label}</Badge> : null;
  };

  return (
    <SuperUserLayout title="Future Ideas">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-icons text-primary">auto_awesome</span>
              Future Ideas
            </h1>
            <p className="text-muted-foreground mt-1">
              Track ideas for future platform development
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-idea">
            <span className="material-icons mr-2">add</span>
            Add Idea
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]" data-testid="select-filter-status">
              <SelectValue placeholder={t('common.status', 'Status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[150px]" data-testid="select-filter-category">
              <SelectValue placeholder={t('common.category', 'Category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading ideas...</div>
        ) : filteredIdeas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <span className="material-icons text-4xl text-muted-foreground mb-3">lightbulb</span>
              <p className="text-muted-foreground">No ideas yet. Add your first idea to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="hover-elevate" data-testid={`card-idea-${idea.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-icons text-primary">{getCategoryIcon(idea.category)}</span>
                        <h3 className="font-semibold text-lg">{idea.title}</h3>
                      </div>
                      {idea.description && (
                        <p className="text-muted-foreground text-sm mb-3">{idea.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(idea.status)}
                        {getPriorityBadge(idea.priority)}
                        <Badge variant="outline" className="capitalize">
                          {idea.category || "Uncategorized"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(idea)}
                        data-testid={`button-edit-idea-${idea.id}`}
                      >
                        <span className="material-icons text-sm">edit</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(idea.id)}
                        data-testid={`button-delete-idea-${idea.id}`}
                      >
                        <span className="material-icons text-sm">delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showAddDialog || !!editingIdea} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingIdea(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-lg" data-testid="dialog-add-idea">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">auto_awesome</span>
              {editingIdea ? "Edit Idea" : "Add New Idea"}
            </DialogTitle>
            <DialogDescription>
              {editingIdea ? "Update the details of this idea" : "Capture a new idea for future development"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input
                placeholder={t('superuserFutureIdeas.enterTitle', 'Enter idea title')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-idea-title"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                placeholder={t('superuserFutureIdeas.describeIdea', 'Describe the idea in more detail...')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                data-testid="input-idea-description"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category</label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger data-testid="select-idea-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Priority</label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger data-testid="select-idea-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Status</label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger data-testid="select-idea-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setEditingIdea(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-submit-idea"
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : editingIdea ? "Update" : "Add Idea"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperUserLayout>
  );
}

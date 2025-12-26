import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate } from "@/lib/dateUtils";
import SuperUserLayout from "@/components/SuperUserLayout";
import { BackButton } from "@/components/BackButton";
import { 
  Plus, 
  Calendar, 
  MessageCircle, 
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Clock,
  Send,
  Trash2,
  GripVertical,
  Filter,
  Paperclip,
  Upload,
  FileText,
  File,
  Download,
  X
} from "lucide-react";

interface TaskComment {
  id: string;
  taskId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  contentType: string;
  storagePath: string;
  uploadedBy: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  section: string;
  status: string;
  assignee: string;
  dueDate: string | null;
  priority: string;
  createdBy: string;
  completedAt: string | null;
  completedBy: string | null;
  createdAt: string;
  updatedAt: string;
  comments: TaskComment[];
}

const ASSIGNEES = ["Tommy", "Glenn", "Kara"];

const SECTIONS = [
  "User Access & Authentication",
  "Project Management",
  "Work Session & Time Tracking",
  "IRATA / SPRAT Task Logging",
  "Safety & Compliance",
  "Company Safety Rating (CSR)",
  "Document Management",
  "Employee Management",
  "Technician Self-Registration",
  "Scheduling & Calendar",
  "Gear Inventory",
  "Payroll & Financial",
  "Quoting & Sales Pipeline",
  "Client Relationship Management (CRM)",
  "Resident Portal",
  "Property Manager Interface",
  "Pricing",
  "White-Label Branding",
  "SuperUser Administration",
  "Analytics & Reporting",
  "Language & Localization",
  "Mobile-First Design",
  "GPS & Location Services",
  "Job Board Ecosystem",
  "Infrastructure",
  "Platform Metrics",
  "Goals & KPIs",
];

const ASSIGNEE_COLORS: Record<string, string> = {
  Tommy: "bg-blue-500",
  Glenn: "bg-emerald-500",
  Kara: "bg-purple-500",
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  low: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400" },
  medium: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  high: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400" },
};

export default function SuperUserTasks() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<string>("Tommy"); // Default current user
  
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    section: "",
    assignee: "",
    dueDate: "",
    priority: "medium",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { data: tasksData, isLoading } = useQuery<{ tasks: Task[] }>({
    queryKey: ["/api/superuser/tasks"],
  });

  const { data: attachmentsData, refetch: refetchAttachments } = useQuery<{ attachments: TaskAttachment[] }>({
    queryKey: ["/api/superuser/tasks", selectedTask?.id, "attachments"],
    enabled: !!selectedTask,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: typeof taskForm & { createdBy: string }) => {
      const response = await apiRequest("POST", "/api/superuser/tasks", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/tasks"] });
      setAddTaskOpen(false);
      setTaskForm({ title: "", description: "", section: "", assignee: "", dueDate: "", priority: "medium" });
      toast({ title: "Task created", description: "New task has been added" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create task", variant: "destructive" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: any }) => {
      const response = await apiRequest("PATCH", `/api/superuser/tasks/${id}`, data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update task");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/tasks"] });
      if (selectedTask) {
        setSelectedTask(data.task);
      }
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/superuser/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/tasks"] });
      setSelectedTask(null);
      toast({ title: "Task deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete task", variant: "destructive" });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ taskId, authorName, content }: { taskId: string; authorName: string; content: string }) => {
      const response = await apiRequest("POST", `/api/superuser/tasks/${taskId}/comments`, { authorName, content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superuser/tasks"] });
      setNewComment("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add comment", variant: "destructive" });
    },
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: async ({ taskId, attachmentId }: { taskId: string; attachmentId: string }) => {
      const response = await apiRequest("DELETE", `/api/superuser/tasks/${taskId}/attachments/${attachmentId}`);
      if (!response.ok) throw new Error("Failed to delete attachment");
      return response.json();
    },
    onSuccess: () => {
      refetchAttachments();
      toast({ title: "Attachment deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete attachment", variant: "destructive" });
    },
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedTask) return;
    
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploaderName", currentUser);
        
        const response = await fetch(`/api/superuser/tasks/${selectedTask.id}/attachments`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to upload file");
        }
      }
      
      refetchAttachments();
      toast({ title: "File uploaded", description: `${files.length} file(s) uploaded successfully` });
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload file", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (contentType: string, fileName: string) => {
    if (contentType.startsWith("image/")) return File;
    if (fileName.endsWith(".md") || contentType === "text/markdown") return FileText;
    if (contentType === "application/pdf") return FileText;
    return File;
  };

  const tasks = tasksData?.tasks || [];
  const attachments = attachmentsData?.attachments || [];

  const filteredTasks = tasks.filter((task) => {
    // Hide completed tasks unless explicitly viewing "completed" filter
    if (statusFilter === "all" && task.status === "completed") return false;
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    // Filter by assignee dropdown
    if (assigneeFilter !== "all" && task.assignee !== assigneeFilter) return false;
    // Filter by current user (Working as) - skip if "Everyone" is selected
    if (currentUser !== "Everyone" && task.assignee !== currentUser) return false;
    return true;
  });

  const groupedTasks = filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!acc[task.section]) {
      acc[task.section] = [];
    }
    acc[task.section].push(task);
    return acc;
  }, {});

  const stats = {
    active: tasks.filter((t) => t.status !== "completed").length, // All non-completed tasks
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const handleToggleComplete = (task: Task) => {
    // Only the assignee can complete or uncomplete a task
    if (task.assignee !== currentUser) {
      toast({ title: "Not allowed", description: "Only the assignee can complete this task", variant: "destructive" });
      return;
    }
    const newStatus = task.status === "completed" ? "todo" : "completed";
    updateTaskMutation.mutate({
      id: task.id,
      status: newStatus,
      completedBy: newStatus === "completed" ? currentUser : null,
      currentUser, // Pass current user for backend verification
    });
  };

  const handleAddComment = (taskId: string, authorName: string) => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ taskId, authorName, content: newComment.trim() });
  };

  const formatCommentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatLocalDate(dateStr);
  };

  return (
    <SuperUserLayout title="Task List">
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <BackButton to="/superuser" label="Back to Dashboard" />

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Working as:</span>
              <Select value={currentUser} onValueChange={setCurrentUser}>
                <SelectTrigger className="w-[140px]" data-testid="select-current-user">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Everyone">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                      Everyone
                    </div>
                  </SelectItem>
                  {ASSIGNEES.map((name) => (
                    <SelectItem key={name} value={name}>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${ASSIGNEE_COLORS[name]}`} />
                        {name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setAddTaskOpen(true)} data-testid="button-add-task">
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </div>
          
          {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  data-testid="filter-all"
                >
                  Active
                  <Badge variant="secondary" className="ml-2">{stats.active}</Badge>
                </Button>
                <Button
                  variant={statusFilter === "todo" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("todo")}
                  data-testid="filter-todo"
                >
                  To do
                  <Badge variant="secondary" className="ml-2">{stats.todo}</Badge>
                </Button>
                <Button
                  variant={statusFilter === "in_progress" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("in_progress")}
                  data-testid="filter-in-progress"
                >
                  In Progress
                  <Badge variant="secondary" className="ml-2">{stats.in_progress}</Badge>
                </Button>
                <Button
                  variant={statusFilter === "completed" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("completed")}
                  data-testid="filter-completed"
                >
                  Completed
                  <Badge variant="secondary" className="ml-2">{stats.completed}</Badge>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="filter-assignee">
                    <SelectValue placeholder="All assignees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All assignees</SelectItem>
                    {ASSIGNEES.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>
        ) : Object.keys(groupedTasks).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No tasks found</p>
              <Button onClick={() => setAddTaskOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTasks).map(([section, sectionTasks]) => (
              <div key={section}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {section}
                    <Badge variant="outline" className="text-xs">{sectionTasks.length}</Badge>
                  </h2>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <Card>
                  <div className="divide-y">
                    {sectionTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-4 hover-elevate cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                        data-testid={`task-row-${task.id}`}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(task);
                          }}
                          className={`flex-shrink-0 ${task.assignee !== currentUser ? "opacity-50 cursor-not-allowed" : ""}`}
                          title={task.assignee !== currentUser ? `Only ${task.assignee} can complete this task` : undefined}
                        >
                          <Checkbox
                            checked={task.status === "completed"}
                            className="h-5 w-5"
                            disabled={task.assignee !== currentUser}
                            data-testid={`checkbox-task-${task.id}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-[15px] ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}
                            style={{ fontFamily: "Outfit, sans-serif" }}
                          >
                            {task.title}
                          </p>
                        </div>
                        {task.priority !== "medium" && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${PRIORITY_STYLES[task.priority]?.bg} ${PRIORITY_STYLES[task.priority]?.text}`}
                          >
                            {task.priority}
                          </Badge>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatLocalDate(task.dueDate)}
                          </div>
                        )}
                        {task.comments.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {task.comments.length}
                          </div>
                        )}
                        <Avatar className="h-7 w-7 flex-shrink-0">
                          <AvatarFallback className={`text-xs text-white ${ASSIGNEE_COLORS[task.assignee] || "bg-gray-500"}`}>
                            {task.assignee.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}

      <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Outfit, sans-serif" }}>Add New Task</DialogTitle>
            <DialogDescription>Create a new task for the team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                data-testid="input-task-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more details..."
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                data-testid="input-task-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={taskForm.section} onValueChange={(v) => setTaskForm({ ...taskForm, section: v })}>
                  <SelectTrigger data-testid="select-section">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((section) => (
                      <SelectItem key={section} value={section}>{section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={taskForm.assignee} onValueChange={(v) => setTaskForm({ ...taskForm, assignee: v })}>
                  <SelectTrigger data-testid="select-assignee">
                    <SelectValue placeholder="Assign to" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSIGNEES.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date (optional)</Label>
                <Input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  data-testid="input-due-date"
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={taskForm.priority} onValueChange={(v) => setTaskForm({ ...taskForm, priority: v })}>
                  <SelectTrigger data-testid="select-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTaskOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!taskForm.title || !taskForm.section || !taskForm.assignee) {
                  toast({ title: "Missing fields", description: "Please fill in title, section, and assignee", variant: "destructive" });
                  return;
                }
                createTaskMutation.mutate({ ...taskForm, createdBy: taskForm.assignee });
              }}
              disabled={createTaskMutation.isPending}
              data-testid="button-create-task"
            >
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedTask && (
            <>
              <SheetHeader className="text-left pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      onClick={() => handleToggleComplete(selectedTask)}
                      className="mt-1 cursor-pointer"
                    >
                      {selectedTask.status === "completed" ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      ) : selectedTask.status === "in_progress" ? (
                        <Clock className="h-6 w-6 text-blue-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <SheetTitle
                        className={`text-lg ${selectedTask.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                        style={{ fontFamily: "Outfit, sans-serif" }}
                      >
                        {selectedTask.title}
                      </SheetTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{selectedTask.section}</Badge>
                        {selectedTask.priority !== "medium" && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${PRIORITY_STYLES[selectedTask.priority]?.bg} ${PRIORITY_STYLES[selectedTask.priority]?.text}`}
                          >
                            {selectedTask.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Delete this task?")) {
                        deleteTaskMutation.mutate(selectedTask.id);
                      }
                    }}
                    data-testid="button-delete-task"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {selectedTask.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Assignee</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className={`text-xs text-white ${ASSIGNEE_COLORS[selectedTask.assignee] || "bg-gray-500"}`}>
                          {selectedTask.assignee.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedTask.assignee}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Status</h4>
                    <Select
                      value={selectedTask.status}
                      onValueChange={(status) => {
                        // Check if changing to/from completed and not assignee
                        if ((status === "completed" || selectedTask.status === "completed") && selectedTask.assignee !== currentUser) {
                          toast({ title: "Not allowed", description: "Only the assignee can complete or uncomplete this task", variant: "destructive" });
                          return;
                        }
                        updateTaskMutation.mutate({
                          id: selectedTask.id,
                          status,
                          completedBy: status === "completed" ? currentUser : null,
                          currentUser, // Pass current user for backend verification
                        });
                      }}
                    >
                      <SelectTrigger className="h-8" data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed" disabled={selectedTask.assignee !== currentUser && selectedTask.status !== "completed"}>
                          Completed {selectedTask.assignee !== currentUser ? `(${selectedTask.assignee} only)` : ""}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedTask.dueDate && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Due Date</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatLocalDate(selectedTask.dueDate)}
                    </div>
                  </div>
                )}

                {selectedTask.completedAt && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Completed</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatLocalDate(selectedTask.completedAt)} by {selectedTask.completedBy}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Attachments Section */}
                <div>
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments
                    {attachments.length > 0 && (
                      <Badge variant="secondary" className="text-xs">{attachments.length}</Badge>
                    )}
                  </h4>

                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-md p-4 mb-4 text-center transition-colors ${
                      isDragging 
                        ? "border-primary bg-primary/5" 
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop files here, or click to select
                        </p>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          multiple
                          accept=".md,.txt,.pdf,.doc,.docx,.xls,.xlsx,.json,.csv,.png,.jpg,.jpeg,.gif,.webp"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          data-testid="input-file-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          data-testid="button-select-files"
                        >
                          Select Files
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Supported: .md, .txt, .pdf, .doc, .docx, .xls, .xlsx, .json, .csv, images
                        </p>
                      </>
                    )}
                  </div>

                  {/* Attachments List */}
                  {attachments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">No attachments yet</p>
                  ) : (
                    <div className="space-y-2">
                      {attachments.map((attachment) => {
                        const FileIcon = getFileIcon(attachment.contentType, attachment.originalName);
                        return (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-3 p-2 rounded-md bg-muted/50 group"
                          >
                            <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{attachment.originalName}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(attachment.fileSize)} - Uploaded by {attachment.uploadedBy}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  window.open(`/api/superuser/tasks/${selectedTask.id}/attachments/${attachment.id}/download`, "_blank");
                                }}
                                data-testid={`button-download-${attachment.id}`}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => {
                                  if (confirm("Delete this attachment?")) {
                                    deleteAttachmentMutation.mutate({
                                      taskId: selectedTask.id,
                                      attachmentId: attachment.id,
                                    });
                                  }
                                }}
                                data-testid={`button-delete-attachment-${attachment.id}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Comments
                    {selectedTask.comments.length > 0 && (
                      <Badge variant="secondary" className="text-xs">{selectedTask.comments.length}</Badge>
                    )}
                  </h4>

                  <div className="space-y-4 mb-4">
                    {selectedTask.comments.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
                    ) : (
                      selectedTask.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className={`text-xs text-white ${ASSIGNEE_COLORS[comment.authorName] || "bg-gray-500"}`}>
                              {comment.authorName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{comment.authorName}</span>
                              <span className="text-xs text-muted-foreground">{formatCommentDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className={`text-xs text-white ${ASSIGNEE_COLORS[currentUser] || "bg-gray-500"}`}>
                          {currentUser.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{currentUser}</span>
                    </div>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(selectedTask.id, currentUser);
                          }
                        }}
                        data-testid="input-comment"
                      />
                      <Button
                        size="icon"
                        onClick={() => handleAddComment(selectedTask.id, currentUser)}
                        disabled={!newComment.trim() || addCommentMutation.isPending}
                        data-testid="button-send-comment"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
        </div>
      </div>
    </SuperUserLayout>
  );
}

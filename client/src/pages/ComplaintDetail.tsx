import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const noteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty"),
});

type NoteFormData = z.infer<typeof noteSchema>;

type ComplaintNote = {
  id: string;
  userName: string;
  note: string;
  createdAt: string;
};

export default function ComplaintDetail() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const complaintId = window.location.pathname.split("/complaints/")[1];
  const [userRole, setUserRole] = useState<string>("");

  // Fetch current user to check role
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  // Fetch complaint details
  const { data: complaintData, isLoading } = useQuery({
    queryKey: ["/api/complaints", complaintId],
  });

  // Fetch notes only if user is staff (not resident)
  const isStaff = userData?.user?.role !== "resident";
  const { data: notesData } = useQuery({
    queryKey: ["/api/complaints", complaintId, "notes"],
    enabled: !!complaintId && isStaff,
  });

  const complaint = complaintData?.complaint;
  const notes: ComplaintNote[] = notesData?.notes || [];

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: "",
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (data: NoteFormData) => {
      const response = await fetch(`/api/complaints/${complaintId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add note");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints", complaintId, "notes"] });
      form.reset();
      toast({ title: "Note added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (status: "open" | "closed") => {
      const response = await fetch(`/api/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints", complaintId] });
      toast({ title: "Status updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = async (data: NoteFormData) => {
    addNoteMutation.mutate(data);
  };

  const toggleStatus = () => {
    const newStatus = complaint?.status === "open" ? "closed" : "open";
    toggleStatusMutation.mutate(newStatus);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-8">
            <span className="material-icons text-6xl text-muted-foreground mb-4">feedback</span>
            <h2 className="text-xl font-bold mb-2">Feedback Not Found</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-card-border shadow-sm">
        <div className="px-4 h-16 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="min-w-11 min-h-11" 
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <span className="material-icons">arrow_back</span>
          </Button>
          <h1 className="text-lg font-bold flex-1">Feedback Details</h1>
          <Badge variant={complaint.status === "open" ? "default" : "secondary"} data-testid="badge-status">
            {complaint.status}
          </Badge>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Complaint Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div>
                <CardTitle className="text-base">Feedback Details</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  Submitted: {new Date(complaint.createdAt).toLocaleDateString()} at{" "}
                  {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {complaint.viewedAt && (
                  <div className="text-sm text-status-closed mt-1">
                    ✓ Viewed by staff: {new Date(complaint.viewedAt).toLocaleDateString()} at{" "}
                    {new Date(complaint.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                {!complaint.viewedAt && userData?.user?.role === "resident" && (
                  <div className="text-sm text-muted-foreground mt-1">
                    ⏱ Pending review by staff
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Resident</div>
                <div className="font-medium" data-testid="text-resident-name">{complaint.residentName}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Unit</div>
                <div className="font-medium" data-testid="text-unit-number">{complaint.unitNumber}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Phone</div>
              <div className="font-medium" data-testid="text-phone-number">{complaint.phoneNumber}</div>
            </div>

            <Separator />

            <div>
              <div className="text-xs text-muted-foreground mb-2">Message</div>
              <p className="text-sm" data-testid="text-message">{complaint.message}</p>
            </div>
          </CardContent>
        </Card>

        {/* Notes - Only visible to staff */}
        {isStaff && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-muted/50 rounded-lg p-3" data-testid={`note-${note.id}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-sm">{note.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm">{note.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <span className="material-icons text-4xl mb-2 opacity-50">note_add</span>
                  <div>No notes yet</div>
                </div>
              )}

              <Separator />

              {/* Add Note Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Add Note</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter your notes about this feedback..."
                            data-testid="input-note"
                            className="min-h-24 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12" data-testid="button-add-note" disabled={addNoteMutation.isPending}>
                    <span className="material-icons mr-2">add_comment</span>
                    {addNoteMutation.isPending ? "Adding..." : "Add Note"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isStaff ? (
            <Button
              variant={complaint.status === "open" ? "default" : "outline"}
              className="flex-1 h-12"
              onClick={toggleStatus}
              data-testid="button-toggle-status"
              disabled={toggleStatusMutation.isPending}
            >
              <span className="material-icons mr-2">
                {complaint.status === "open" ? "check_circle" : "replay"}
              </span>
              {toggleStatusMutation.isPending ? "Updating..." : (complaint.status === "open" ? "Mark as Closed" : "Reopen")}
            </Button>
          ) : (
            complaint.status === "closed" && (
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={toggleStatus}
                data-testid="button-reopen"
                disabled={toggleStatusMutation.isPending}
              >
                <span className="material-icons mr-2">replay</span>
                {toggleStatusMutation.isPending ? "Reopening..." : "Reopen Feedback"}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

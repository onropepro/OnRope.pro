import { useState } from "react";
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
  const [complaintStatus, setComplaintStatus] = useState<"open" | "closed">("open");

  // Mock data - will be replaced with real data from API
  const initialNotes: ComplaintNote[] = [
    {
      id: "1",
      userName: "Jane Tech",
      note: "Inspected unit 302. Will schedule a re-clean for tomorrow morning.",
      createdAt: "2024-01-15T14:20:00",
    },
  ];

  const [notes, setNotes] = useState<ComplaintNote[]>(initialNotes);

  const complaint = {
    id: "1",
    strataPlanNumber: "LMS2345",
    residentName: "John Smith",
    phoneNumber: "+1 (555) 123-4567",
    unitNumber: "302",
    message: "I noticed water spots on my windows after the cleaning crew finished yesterday. Could someone please come back to check on this? The windows on the north side of the unit seem to have the most spots.",
    status: "open" as "open" | "closed",
    createdAt: "2024-01-15T10:30:00",
  };

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = async (data: NoteFormData) => {
    // Create new note with current user (mock) and timestamp
    const newNote: ComplaintNote = {
      id: `note-${Date.now()}`,
      userName: "Current User", // Will be replaced with actual user from auth context
      note: data.note,
      createdAt: new Date().toISOString(),
    };

    // Add note to local state immediately
    setNotes([...notes, newNote]);

    // Reset form
    form.reset();

    // Will be connected to API in integration phase
    console.log("Add note:", data);
  };

  const toggleStatus = () => {
    const newStatus = complaintStatus === "open" ? "closed" : "open";
    setComplaintStatus(newStatus);
    console.log("Toggle complaint status:", newStatus);
    // Will be connected to API in integration phase
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b border-card-border shadow-sm">
        <div className="px-4 h-16 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-back">
            <span className="material-icons">arrow_back</span>
          </Button>
          <h1 className="text-lg font-bold flex-1">Feedback Details</h1>
          <Badge variant={complaintStatus === "open" ? "default" : "secondary"} data-testid="badge-status">
            {complaintStatus}
          </Badge>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Complaint Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div>
                <CardTitle className="text-base">{complaint.strataPlanNumber}</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(complaint.createdAt).toLocaleDateString()} at{" "}
                  {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
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

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
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
                <Button type="submit" className="w-full h-12" data-testid="button-add-note">
                  <span className="material-icons mr-2">add_comment</span>
                  Add Note
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant={complaintStatus === "open" ? "default" : "outline"}
            className="flex-1 h-12"
            onClick={toggleStatus}
            data-testid="button-toggle-status"
          >
            <span className="material-icons mr-2">
              {complaintStatus === "open" ? "check_circle" : "replay"}
            </span>
            {complaintStatus === "open" ? "Mark as Closed" : "Reopen"}
          </Button>
        </div>
      </div>
    </div>
  );
}

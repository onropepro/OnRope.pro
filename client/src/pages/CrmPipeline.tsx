import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { CrmContact } from "@shared/schema";

type ContactWithCompany = CrmContact & { companyName?: string | null };

type PipelineData = {
  pipeline: Record<string, ContactWithCompany[]>;
};

const PIPELINE_STAGES = [
  { key: "lead_captured", label: "Lead Captured", color: "border-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950/30" },
  { key: "contacted", label: "Contacted", color: "border-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950/30" },
  { key: "demo_scheduled", label: "Demo Scheduled", color: "border-violet-500", bgColor: "bg-violet-50 dark:bg-violet-950/30" },
  { key: "trial", label: "Trial", color: "border-cyan-500", bgColor: "bg-cyan-50 dark:bg-cyan-950/30" },
  { key: "paid_subscriber", label: "Paid", color: "border-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-950/30" },
];

const INACTIVE_STAGES = [
  { key: "churned", label: "Churned", color: "border-gray-500", bgColor: "bg-gray-50 dark:bg-gray-950/30" },
  { key: "lost", label: "Lost", color: "border-red-500", bgColor: "bg-red-50 dark:bg-red-950/30" },
];

function ContactCard({ contact, index }: { contact: ContactWithCompany; index: number }) {
  return (
    <Draggable draggableId={String(contact.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 ${snapshot.isDragging ? "opacity-70" : ""}`}
        >
          <Link href={`/superuser/crm/contacts/${contact.id}`}>
            <Card
              className={`shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                snapshot.isDragging ? "ring-2 ring-primary" : ""
              }`}
              data-testid={`card-contact-${contact.id}`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {contact.firstName?.[0] || "?"}
                      {contact.lastName?.[0] || ""}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    {contact.companyName && (
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.companyName}
                      </p>
                    )}
                    {contact.email && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {contact.email}
                      </p>
                    )}
                  </div>
                </div>
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {contact.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {contact.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{contact.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </Draggable>
  );
}

function PipelineColumn({
  stage,
  contacts,
}: {
  stage: { key: string; label: string; color: string; bgColor: string };
  contacts: ContactWithCompany[];
}) {
  return (
    <div className="flex-shrink-0 w-72">
      <div className={`rounded-lg border-t-4 ${stage.color} ${stage.bgColor} h-full`}>
        <div className="p-3 border-b">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{stage.label}</h3>
            <Badge variant="secondary" className="text-xs">
              {contacts.length}
            </Badge>
          </div>
        </div>
        <Droppable droppableId={stage.key}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`p-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto ${
                snapshot.isDraggingOver ? "bg-muted/50" : ""
              }`}
            >
              {contacts.map((contact, index) => (
                <ContactCard key={contact.id} contact={contact} index={index} />
              ))}
              {provided.placeholder}
              {contacts.length === 0 && !snapshot.isDraggingOver && (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No contacts in this stage
                </p>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}

export default function CrmPipeline() {
  const { toast } = useToast();
  const [showInactive, setShowInactive] = useState(false);

  const { data, isLoading, error } = useQuery<PipelineData>({
    queryKey: ["/api/crm/contacts/pipeline"],
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ contactId, stage }: { contactId: number; stage: string }) => {
      return apiRequest("PATCH", `/api/crm/contacts/${contactId}`, { stage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/contacts/pipeline"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/dashboard/stats"] });
      toast({
        title: "Contact moved",
        description: "Contact stage updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update contact stage.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/contacts/pipeline"] });
    },
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.droppableId === result.destination.droppableId) return;

    const contactId = parseInt(result.draggableId);
    const newStage = result.destination.droppableId;

    updateStageMutation.mutate({ contactId, stage: newStage });
  };

  const allStages = showInactive ? [...PIPELINE_STAGES, ...INACTIVE_STAGES] : PIPELINE_STAGES;

  return (
    <SuperUserLayout title="Pipeline">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Sales Pipeline</h1>
            <p className="text-muted-foreground">
              Drag and drop contacts to move them through stages
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={showInactive ? "default" : "outline"}
              size="sm"
              onClick={() => setShowInactive(!showInactive)}
              data-testid="button-toggle-inactive"
            >
              <span className="material-icons text-lg mr-2">visibility</span>
              {showInactive ? "Hide" : "Show"} Inactive
            </Button>
            <Link href="/superuser/crm/contacts">
              <Button data-testid="button-add-contact">
                <span className="material-icons text-lg mr-2">person_add</span>
                Add Contact
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {PIPELINE_STAGES.map((stage) => (
              <Skeleton key={stage.key} className="h-96 w-72 flex-shrink-0 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center text-destructive">
              Failed to load pipeline data. Please try again.
            </CardContent>
          </Card>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {allStages.map((stage) => (
                <PipelineColumn
                  key={stage.key}
                  stage={stage}
                  contacts={data?.pipeline[stage.key] || []}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </SuperUserLayout>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CrmContact, CrmCompany } from "@shared/schema";

type ContactsResponse = {
  contacts: CrmContact[];
  total: number;
  page: number;
  totalPages: number;
};

type CompaniesResponse = {
  companies: CrmCompany[];
};

const STAGE_COLORS: Record<string, string> = {
  lead_captured: "bg-blue-500",
  contacted: "bg-orange-500",
  demo_scheduled: "bg-violet-500",
  trial: "bg-cyan-500",
  paid_subscriber: "bg-emerald-500",
  churned: "bg-gray-500",
  lost: "bg-red-500",
};

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  companyId: z.number().optional(),
  stage: z.string().default("lead_captured"),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

function ContactCard({ contact }: { contact: CrmContact }) {
  return (
    <Link href={`/superuser/crm/contacts/${contact.id}`}>
      <Card
        className="shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer"
        data-testid={`card-contact-${contact.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-primary">
                {contact.firstName?.[0] || "?"}
                {contact.lastName?.[0] || ""}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {contact.firstName} {contact.lastName}
                  </p>
                  {contact.jobTitle && (
                    <p className="text-sm text-muted-foreground truncate">{contact.jobTitle}</p>
                  )}
                </div>
                <Badge className={`${STAGE_COLORS[contact.stage]} text-white flex-shrink-0`}>
                  {contact.stage.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="mt-2 space-y-1">
                {contact.email && (
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    <span className="material-icons text-sm">email</span>
                    {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    <span className="material-icons text-sm">phone</span>
                    {contact.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function AddContactDialog({ companies }: { companies: CrmCompany[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      stage: "lead_captured",
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return apiRequest("POST", "/api/crm/contacts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/dashboard/stats"] });
      toast({ title: "Contact created successfully" });
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create contact",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    createMutation.mutate({
      ...data,
      email: data.email || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-contact">
          <span className="material-icons text-lg mr-2">person_add</span>
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-first-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-last-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-job-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(v) => field.onChange(v ? parseInt(v) : undefined)}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-company">
                        <SelectValue placeholder="Select company..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-stage">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lead_captured">Lead Captured</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="demo_scheduled">Demo Scheduled</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="paid_subscriber">Paid Subscriber</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
                {createMutation.isPending ? "Creating..." : "Create Contact"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ContactRow({ contact }: { contact: CrmContact }) {
  return (
    <Link href={`/superuser/crm/contacts/${contact.id}`}>
      <div
        className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer"
        data-testid={`row-contact-${contact.id}`}
      >
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-semibold text-primary">
            {contact.firstName?.[0] || "?"}
            {contact.lastName?.[0] || ""}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            {contact.firstName} {contact.lastName}
          </p>
          {contact.jobTitle && (
            <p className="text-sm text-muted-foreground truncate">{contact.jobTitle}</p>
          )}
        </div>
        <div className="hidden md:block text-sm text-muted-foreground truncate max-w-[200px]">
          {contact.email}
        </div>
        <div className="hidden lg:block text-sm text-muted-foreground truncate max-w-[150px]">
          {contact.phone}
        </div>
        <Badge className={`${STAGE_COLORS[contact.stage]} text-white flex-shrink-0`}>
          {contact.stage.replace(/_/g, " ")}
        </Badge>
      </div>
    </Link>
  );
}

export default function CrmContacts() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  const { data, isLoading, error } = useQuery<ContactsResponse>({
    queryKey: ["/api/crm/contacts", { search, stage: stage === "all" ? "" : stage, page }],
  });

  const { data: companiesData } = useQuery<CompaniesResponse>({
    queryKey: ["/api/crm/companies", { limit: "1000" }],
  });

  return (
    <SuperUserLayout title="Contacts">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">CRM Contacts</h1>
            <p className="text-muted-foreground">
              {data?.total || 0} total contacts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("cards")}
                data-testid="button-view-cards"
              >
                <span className="material-icons">grid_view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                data-testid="button-view-list"
              >
                <span className="material-icons">view_list</span>
              </Button>
            </div>
            <AddContactDialog companies={companiesData?.companies || []} />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              search
            </span>
            <Input
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Select
            value={stage}
            onValueChange={(v) => {
              setStage(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48" data-testid="select-filter-stage">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="lead_captured">Lead Captured</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="demo_scheduled">Demo Scheduled</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="paid_subscriber">Paid Subscriber</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center text-destructive">
              Failed to load contacts. Please try again.
            </CardContent>
          </Card>
        ) : data?.contacts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <span className="material-icons text-5xl text-muted-foreground mb-4">
                contacts
              </span>
              <p className="text-lg font-medium mb-2">No contacts found</p>
              <p className="text-muted-foreground mb-4">
                {search || stage !== "all" ? "Try adjusting your filters" : "Add your first contact to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.contacts.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            ) : (
              <Card>
                <div className="divide-y">
                  {data?.contacts.map((contact) => (
                    <ContactRow key={contact.id} contact={contact} />
                  ))}
                </div>
              </Card>
            )}

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.totalPages}
                  data-testid="button-next-page"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </SuperUserLayout>
  );
}

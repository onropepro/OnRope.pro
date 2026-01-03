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
import type { CrmCompany } from "@shared/schema";

type CompaniesResponse = {
  companies: CrmCompany[];
  total: number;
  page: number;
  totalPages: number;
};

const SOURCE_COLORS: Record<string, string> = {
  brightdata_scrape: "bg-blue-500",
  sprat_directory: "bg-violet-500",
  irata_directory: "bg-cyan-500",
  website_signup: "bg-emerald-500",
  referral: "bg-orange-500",
  manual: "bg-gray-500",
  linkedin: "bg-blue-600",
  cold_outreach: "bg-amber-500",
  inbound_inquiry: "bg-green-500",
  conference: "bg-purple-500",
};

const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  country: z.string().default("CA"),
  serviceType: z.string().optional(),
  notes: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

function CompanyCard({ company }: { company: CrmCompany }) {
  return (
    <Link href={`/superuser/crm/companies/${company.id}`}>
      <Card
        className="shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer"
        data-testid={`card-company-${company.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-2xl text-primary">domain</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{company.name}</p>
                  {company.city && (
                    <p className="text-sm text-muted-foreground">
                      {company.city}, {company.stateProvince || company.country}
                    </p>
                  )}
                </div>
                <Badge className={`${SOURCE_COLORS[company.source || "manual"]} text-white flex-shrink-0`}>
                  {(company.source || "manual").replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="mt-2 space-y-1">
                {company.serviceType && (
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    <span className="material-icons text-sm">construction</span>
                    {company.serviceType}
                  </p>
                )}
                {company.website && (
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    <span className="material-icons text-sm">language</span>
                    {company.website.replace(/https?:\/\//, "")}
                  </p>
                )}
                {company.phone && (
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    <span className="material-icons text-sm">phone</span>
                    {company.phone}
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

function AddCompanyDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      website: "",
      phone: "",
      email: "",
      city: "",
      stateProvince: "BC",
      country: "CA",
      serviceType: "",
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CompanyFormValues) => {
      return apiRequest("POST", "/api/crm/companies", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/dashboard/stats"] });
      toast({ title: "Company created successfully" });
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create company",
      });
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    createMutation.mutate({
      ...data,
      email: data.email || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-company">
          <span className="material-icons text-lg mr-2">domain_add</span>
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-company-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stateProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province/State</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-province" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." data-testid="input-website" />
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
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Window Cleaning, Rope Access" data-testid="input-service-type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
                {createMutation.isPending ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function CrmCompanies() {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<CompaniesResponse>({
    queryKey: ["/api/crm/companies", { search, source: source === "all" ? "" : source, country: country === "all" ? "" : country, page }],
  });

  return (
    <SuperUserLayout title="Companies">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">CRM Companies</h1>
            <p className="text-muted-foreground">
              {data?.total || 0} total companies
            </p>
          </div>
          <AddCompanyDialog />
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              search
            </span>
            <Input
              placeholder="Search companies..."
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
            value={source}
            onValueChange={(v) => {
              setSource(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48" data-testid="select-filter-source">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="brightdata_scrape">BrightData Scrape</SelectItem>
              <SelectItem value="sprat_directory">SPRAT Directory</SelectItem>
              <SelectItem value="irata_directory">IRATA Directory</SelectItem>
              <SelectItem value="website_signup">Website Signup</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={country}
            onValueChange={(v) => {
              setCountry(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40" data-testid="select-filter-country">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
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
              Failed to load companies. Please try again.
            </CardContent>
          </Card>
        ) : data?.companies.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <span className="material-icons text-5xl text-muted-foreground mb-4">
                domain
              </span>
              <p className="text-lg font-medium mb-2">No companies found</p>
              <p className="text-muted-foreground mb-4">
                {search || source !== "all" || country !== "all" ? "Try adjusting your filters" : "Add your first company to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

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

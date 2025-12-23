import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, Calendar, DollarSign, FileText } from "lucide-react";

interface QuoteService {
  id: string;
  serviceType: string;
  description: string | null;
  totalCost: number | string | null;
}

interface QuoteDetail {
  id: string;
  quoteNumber: string | null;
  buildingName: string;
  strataPlanNumber: string;
  buildingAddress: string;
  floorCount: number;
  status: string;
  pipelineStage: string;
  createdAt: string | null;
  companyName: string;
  services: QuoteService[];
  grandTotal: number;
}

const serviceNames: Record<string, string> = {
  window_cleaning: "Window Cleaning",
  dryer_vent_cleaning: "Exterior Dryer Vent Cleaning",
  building_wash: "Building Wash - Pressure Washing",
  general_pressure_washing: "General Pressure Washing",
  gutter_cleaning: "Gutter Cleaning",
  parkade: "Parkade Cleaning",
  ground_windows: "Ground Windows",
  in_suite: "In-Suite Dryer Vent",
  painting: "Painting",
  custom: "Custom Service"
};

export default function PropertyManagerQuoteDetail() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useQuery<{ quote: QuoteDetail }>({
    queryKey: [`/api/property-managers/quotes/${quoteId}`],
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data?.quote) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation('/property-manager')}
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Quote Details</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">Quote Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This quote may have been removed or you don't have access to view it.
            </p>
            <Button onClick={() => setLocation('/property-manager')} data-testid="button-go-to-dashboard">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quote = data.quote;
  const formattedDate = quote.createdAt 
    ? new Date(quote.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'N/A';

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation('/property-manager')}
          data-testid="button-back-to-dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold" data-testid="text-quote-title">
          Quote {quote.quoteNumber || quote.strataPlanNumber}
        </h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {quote.buildingName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{quote.buildingAddress}</p>
          </div>
          <Badge variant="secondary" data-testid="badge-quote-status">
            {quote.pipelineStage.charAt(0).toUpperCase() + quote.pipelineStage.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span data-testid="text-quote-date">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Floors:</span>
              <span data-testid="text-floor-count">{quote.floorCount}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">From:</span>
              <span data-testid="text-company-name">{quote.companyName}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Services</h3>
            <div className="space-y-3">
              {quote.services.map((service) => (
                <div 
                  key={service.id} 
                  className="flex justify-between items-start p-3 bg-muted/50 rounded-md"
                  data-testid={`service-item-${service.id}`}
                >
                  <div>
                    <p className="font-medium">
                      {serviceNames[service.serviceType] || service.serviceType}
                    </p>
                    {service.description && (
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    )}
                  </div>
                  <span className="font-semibold">
                    ${Number(service.totalCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary" data-testid="text-grand-total">
              <DollarSign className="h-5 w-5 inline" />
              {quote.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border-t pt-4 text-center text-sm text-muted-foreground">
            <p>The full quote PDF was sent to your email. Please check your inbox for the complete details.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

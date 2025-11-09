import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { insertQuoteSchema, type Quote } from "@shared/schema";

// Form schema with auto-calculated fields optional
const quoteFormSchema = insertQuoteSchema.omit({ 
  companyId: true,
  totalHours: true,
  totalCost: true,
  parkadeTotal: true,
  groundWindowTotal: true,
}).extend({
  totalHours: z.string().optional(),
  totalCost: z.string().optional(),
  parkadeTotal: z.string().optional(),
  groundWindowTotal: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

export default function Quotes() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all quotes
  const { data: quotesData, isLoading } = useQuery<{ quotes: Quote[] }>({
    queryKey: ["/api/quotes"],
  });

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      buildingName: "",
      strataPlanNumber: "",
      buildingAddress: "",
      floorCount: 1,
      dropsNorth: 0,
      dropsEast: 0,
      dropsSouth: 0,
      dropsWest: 0,
      dropsPerDay: 1,
      pricePerHour: "0",
      hasParkade: false,
      hasGroundWindows: false,
      status: "draft",
    },
  });

  // Watch relevant fields for auto-calculations
  const dropsNorth = form.watch("dropsNorth");
  const dropsEast = form.watch("dropsEast");
  const dropsSouth = form.watch("dropsSouth");
  const dropsWest = form.watch("dropsWest");
  const dropsPerDay = form.watch("dropsPerDay");
  const pricePerHour = form.watch("pricePerHour");
  const hasParkade = form.watch("hasParkade");
  const parkadeStalls = form.watch("parkadeStalls");
  const pricePerStall = form.watch("pricePerStall");
  const hasGroundWindows = form.watch("hasGroundWindows");
  const groundWindowHours = form.watch("groundWindowHours");

  // Auto-calculate total hours: (total drops from all elevations) ÷ drops per day × 8 hours
  useEffect(() => {
    const totalDrops = (dropsNorth || 0) + (dropsEast || 0) + (dropsSouth || 0) + (dropsWest || 0);
    if (totalDrops > 0 && dropsPerDay > 0) {
      const daysNeeded = totalDrops / dropsPerDay;
      const calculatedHours = daysNeeded * 8;
      form.setValue("totalHours", calculatedHours.toFixed(2));
    }
  }, [dropsNorth, dropsEast, dropsSouth, dropsWest, dropsPerDay, form]);

  // Auto-calculate total cost
  useEffect(() => {
    const hours = parseFloat(form.getValues("totalHours") || "0");
    const hourlyRate = parseFloat(pricePerHour || "0");
    if (hours > 0 && hourlyRate > 0) {
      const calculatedCost = hours * hourlyRate;
      form.setValue("totalCost", calculatedCost.toFixed(2));
    }
  }, [form.watch("totalHours"), pricePerHour, form]);

  // Auto-calculate parkade total
  useEffect(() => {
    if (hasParkade && parkadeStalls && pricePerStall) {
      const stalls = parseInt(parkadeStalls.toString());
      const priceStall = parseFloat(pricePerStall.toString());
      const calculatedTotal = stalls * priceStall;
      form.setValue("parkadeTotal", calculatedTotal.toFixed(2));
    } else {
      form.setValue("parkadeTotal", undefined);
    }
  }, [hasParkade, parkadeStalls, pricePerStall, form]);

  // Auto-calculate ground window total
  useEffect(() => {
    if (hasGroundWindows && groundWindowHours) {
      const hours = parseFloat(groundWindowHours.toString());
      const hourlyRate = parseFloat(pricePerHour || "0");
      const calculatedTotal = hours * hourlyRate;
      form.setValue("groundWindowTotal", calculatedTotal.toFixed(2));
    } else {
      form.setValue("groundWindowTotal", undefined);
    }
  }, [hasGroundWindows, groundWindowHours, pricePerHour, form]);

  const createQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const response = await apiRequest("POST", "/api/quotes", data);
      return await response.json();
    },
    onSuccess: async (data) => {
      // Upload photo if selected
      if (selectedPhoto && data.quote.id) {
        const formData = new FormData();
        formData.append("photo", selectedPhoto);
        
        await fetch(`/api/quotes/${data.quote.id}/photo`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Quote created",
        description: "The quote has been created successfully.",
      });
      form.reset();
      setSelectedPhoto(null);
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create quote",
      });
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/quotes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Quote deleted",
        description: "The quote has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete quote",
      });
    },
  });

  const onSubmit = (data: QuoteFormData) => {
    createQuoteMutation.mutate(data);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPhoto(e.target.files[0]);
    }
  };

  const quotes = quotesData?.quotes || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b shadow-md">
        <div className="px-4 h-20 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="min-w-11 min-h-11" data-testid="button-back" onClick={() => setLocation("/management")}>
              <span className="material-icons">arrow_back</span>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Quotes</h1>
          </div>
          <Button 
            variant="default" 
            onClick={() => setShowForm(!showForm)}
            data-testid="button-new-quote"
          >
            <span className="material-icons mr-2">add</span>
            {showForm ? "Cancel" : "New Quote"}
          </Button>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Quote Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Quote</CardTitle>
              <CardDescription>Fill in the details to generate a quote for building maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Building Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Building Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="buildingName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Building Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-building-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="strataPlanNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strata Plan Number</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-strata-plan" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="buildingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="input-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="floorCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Floors</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              data-testid="input-floor-count"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Work Calculation */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Work Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="dropsNorth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Drops - North</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="input-drops-north"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dropsEast"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Drops - East</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="input-drops-east"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dropsSouth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Drops - South</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="input-drops-south"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dropsWest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Drops - West</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="input-drops-west"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="dropsPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Drops Per Day</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              data-testid="input-drops-per-day"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Hours (Auto-calculated)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              readOnly 
                              className="bg-muted"
                              data-testid="input-total-hours"
                            />
                          </FormControl>
                          <FormDescription>
                            Calculated as: (total drops from all elevations) ÷ drops per day × 8 hours
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricePerHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Per Hour ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field}
                              data-testid="input-price-per-hour"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="totalCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Cost (Auto-calculated)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              readOnly 
                              className="bg-muted"
                              data-testid="input-total-cost"
                            />
                          </FormControl>
                          <FormDescription>
                            Calculated as: total hours × price per hour
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Parkade Section */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasParkade"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Parkade</FormLabel>
                            <FormDescription>
                              Does this quote include parkade work?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-parkade"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {hasParkade && (
                      <>
                        <FormField
                          control={form.control}
                          name="parkadeStalls"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Parkade Stalls</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-parkade-stalls"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pricePerStall"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Per Stall ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  data-testid="input-price-per-stall"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="parkadeTotal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parkade Total (Auto-calculated)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  readOnly 
                                  className="bg-muted"
                                  data-testid="input-parkade-total"
                                />
                              </FormControl>
                              <FormDescription>
                                Calculated as: number of stalls × price per stall
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>

                  {/* Ground Windows Section */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasGroundWindows"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Ground Windows</FormLabel>
                            <FormDescription>
                              Does this quote include ground window cleaning?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-ground-windows"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {hasGroundWindows && (
                      <>
                        <FormField
                          control={form.control}
                          name="groundWindowHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hours Required for Ground Windows</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  data-testid="input-ground-window-hours"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="groundWindowTotal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ground Windows Total (Auto-calculated)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  readOnly 
                                  className="bg-muted"
                                  data-testid="input-ground-window-total"
                                />
                              </FormControl>
                              <FormDescription>
                                Calculated as: hours × hourly rate
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Attachment</h3>
                    <div>
                      <FormLabel>Photo (Optional)</FormLabel>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="mt-2"
                        data-testid="input-photo"
                      />
                      {selectedPhoto && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {selectedPhoto.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createQuoteMutation.isPending}
                    data-testid="button-submit-quote"
                  >
                    {createQuoteMutation.isPending ? "Creating..." : "Create Quote"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Quotes List */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading quotes...</p>
          </div>
        ) : quotes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No quotes yet. Create your first quote to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Quotes</h2>
            {quotes.map((quote) => (
              <Card key={quote.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{quote.buildingName}</CardTitle>
                      <CardDescription>
                        {quote.strataPlanNumber} • {quote.buildingAddress}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteQuoteMutation.mutate(quote.id)}
                        data-testid={`button-delete-${quote.id}`}
                      >
                        <span className="material-icons text-destructive">delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Floors</p>
                      <p className="font-medium">{quote.floorCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Hours</p>
                      <p className="font-medium">{quote.totalHours}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price/Hour</p>
                      <p className="font-medium">${quote.pricePerHour}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Cost</p>
                      <p className="font-medium text-lg">${quote.totalCost}</p>
                    </div>
                    {quote.hasParkade && (
                      <>
                        <div>
                          <p className="text-muted-foreground">Parkade Stalls</p>
                          <p className="font-medium">{quote.parkadeStalls}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Parkade Total</p>
                          <p className="font-medium">${quote.parkadeTotal}</p>
                        </div>
                      </>
                    )}
                    {quote.hasGroundWindows && (
                      <>
                        <div>
                          <p className="text-muted-foreground">Ground Window Hours</p>
                          <p className="font-medium">{quote.groundWindowHours}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Ground Windows Total</p>
                          <p className="font-medium">${quote.groundWindowTotal}</p>
                        </div>
                      </>
                    )}
                  </div>
                  {quote.photoUrl && (
                    <div className="mt-4">
                      <img 
                        src={quote.photoUrl} 
                        alt="Quote attachment" 
                        className="rounded-md max-h-64 object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

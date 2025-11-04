import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const dropLogSchema = z.object({
  projectId: z.string().min(1, "Please select a project"),
  date: z.string().min(1, "Date is required"),
  dropsCompleted: z.string().min(1, "Number of drops is required"),
});

type DropLogFormData = z.infer<typeof dropLogSchema>;

export default function TechDashboard() {
  const [activeTab, setActiveTab] = useState("log-drops");

  // Mock data - will be replaced with real data from API
  const dailyTarget = 20;
  const mockProjects = [
    { id: "1", strataPlanNumber: "LMS2345", jobType: "Window Cleaning", address: "123 Main St" },
    { id: "2", strataPlanNumber: "LMS6789", jobType: "Pressure Washing", address: "456 Oak Ave" },
  ];

  const mockComplaints = [
    {
      id: "1",
      strataPlanNumber: "LMS2345",
      residentName: "John Smith",
      unitNumber: "302",
      message: "Water spots on windows after cleaning",
      status: "open",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      strataPlanNumber: "LMS6789",
      residentName: "Jane Doe",
      unitNumber: "105",
      message: "Requesting update on completion date",
      status: "open",
      createdAt: "2024-01-14",
    },
  ];

  const form = useForm<DropLogFormData>({
    resolver: zodResolver(dropLogSchema),
    defaultValues: {
      projectId: "",
      date: new Date().toISOString().split('T')[0],
      dropsCompleted: "",
    },
  });

  const onSubmit = async (data: DropLogFormData) => {
    console.log("Drop log:", data);
    // Will be connected to API in integration phase
    form.reset({
      projectId: "",
      date: new Date().toISOString().split('T')[0],
      dropsCompleted: "",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Daily Target */}
      <header className="sticky top-0 z-[100] bg-primary text-primary-foreground shadow-md">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-icons text-2xl">construction</span>
            <div>
              <div className="text-xs opacity-90">Daily Target</div>
              <div className="text-lg font-bold">{dailyTarget} Drops</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-primary-foreground min-w-11 min-h-11" data-testid="button-menu">
            <span className="material-icons">menu</span>
          </Button>
        </div>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="log-drops" data-testid="tab-log-drops">
              <span className="material-icons text-sm mr-2">add_circle</span>
              Log Drops
            </TabsTrigger>
            <TabsTrigger value="complaints" data-testid="tab-complaints">
              <span className="material-icons text-sm mr-2">feedback</span>
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log-drops">
            <Card>
              <CardHeader>
                <CardTitle>Record Daily Drops</CardTitle>
                <CardDescription>Log your completed drops for today or a previous date</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="projectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12" data-testid="select-project">
                                <SelectValue placeholder="Select a project" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.strataPlanNumber} - {project.jobType}
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
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-date" className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dropsCompleted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Drops Completed</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="0" 
                              {...field} 
                              data-testid="input-drops" 
                              className="h-12 text-2xl font-bold text-center" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full h-12" data-testid="button-submit-drops">
                      <span className="material-icons mr-2">check_circle</span>
                      Log Drops
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <div className="space-y-4">
              {mockProjects.map((project) => {
                const projectComplaints = mockComplaints.filter(c => c.strataPlanNumber === project.strataPlanNumber);
                
                if (projectComplaints.length === 0) return null;

                return (
                  <div key={project.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-icons text-muted-foreground text-sm">apartment</span>
                      <span className="text-sm font-medium">{project.strataPlanNumber}</span>
                      <Badge variant="secondary" className="text-xs">{projectComplaints.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {projectComplaints.map((complaint) => (
                        <Card key={complaint.id} className="hover-elevate active-elevate-2 cursor-pointer" data-testid={`complaint-card-${complaint.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{complaint.residentName}</div>
                                <div className="text-xs text-muted-foreground">Unit {complaint.unitNumber}</div>
                              </div>
                              <Badge variant={complaint.status === "open" ? "default" : "secondary"} className="text-xs">
                                {complaint.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {complaint.message}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Separator className="my-6" />
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

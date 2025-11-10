import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function GearInventory() {
  const [, setLocation] = useLocation();

  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });

  const equipmentTypes = [
    { id: "harness", name: "Harness", icon: "settings_accessibility", description: "Full body harness" },
    { id: "rope", name: "Rope", icon: "timeline", description: "Work rope" },
    { id: "descender", name: "Descender", icon: "arrow_downward", description: "Descending device" },
    { id: "ascender", name: "Ascender", icon: "arrow_upward", description: "Ascending device" },
    { id: "helmet", name: "Helmet", icon: "sports_mma", description: "Safety helmet" },
    { id: "carabiner", name: "Carabiner", icon: "link", description: "Locking carabiners" },
    { id: "lanyard", name: "Lanyard", icon: "height", description: "Work positioning lanyard" },
    { id: "other", name: "Other", icon: "category", description: "Other equipment" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-card border-b shadow-md">
        <div className="px-4 h-20 flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Build my Kit</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your equipment inventory
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="min-w-11 min-h-11"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
          >
            <span className="material-icons">arrow_back</span>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentTypes.map((equipment) => (
            <Card
              key={equipment.id}
              className="hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => {
                // Will open equipment detail form
                console.log("Opening equipment:", equipment.id);
              }}
              data-testid={`card-equipment-${equipment.id}`}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{equipment.name}</CardTitle>
                  <CardDescription className="text-sm truncate">
                    {equipment.description}
                  </CardDescription>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-icons text-primary text-2xl">
                      {equipment.icon}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tap to add or view details
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

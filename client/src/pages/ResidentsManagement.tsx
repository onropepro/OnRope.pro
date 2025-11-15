import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface Resident {
  id: number;
  name: string;
  email: string;
  phone?: string;
  unit?: string;
  buildingId?: number;
  companyId: number;
}

export default function ResidentsManagement() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: residents = [], isLoading } = useQuery<Resident[]>({
    queryKey: ["/api/residents"],
  });

  const filteredResidents = residents.filter((resident: Resident) => 
    resident.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.unit?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
            className="hover-elevate"
          >
            <span className="material-icons text-2xl">arrow_back</span>
          </Button>
          <div className="flex items-center gap-3">
            <span className="material-icons text-3xl text-primary">people</span>
            <div>
              <h1 className="text-2xl font-bold">Residents</h1>
              <p className="text-sm text-muted-foreground">Manage building residents</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search bar */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                search
              </span>
              <Input
                type="text"
                placeholder="Search residents by name, email, or unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
                data-testid="input-search-residents"
              />
            </div>
          </CardContent>
        </Card>

        {/* Residents list */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading residents...</p>
          </div>
        ) : filteredResidents.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <span className="material-icons text-6xl text-muted-foreground mb-4">
                person_off
              </span>
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "No residents found" : "No residents yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search criteria" 
                  : "Residents will appear here once they register"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredResidents.map((resident) => (
              <Card key={resident.id} className="shadow-lg hover-elevate" data-testid={`card-resident-${resident.id}`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-icons text-2xl text-primary">person</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{resident.name}</CardTitle>
                      <CardDescription className="truncate">{resident.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {resident.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-icons text-base text-muted-foreground">phone</span>
                      <span className="text-muted-foreground">{resident.phone}</span>
                    </div>
                  )}
                  {resident.unit && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-icons text-base text-muted-foreground">home</span>
                      <span className="text-muted-foreground">Unit {resident.unit}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Resident Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{residents.length}</div>
                <div className="text-sm text-muted-foreground">Total Residents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {residents.filter(r => r.unit).length}
                </div>
                <div className="text-sm text-muted-foreground">With Unit Info</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {residents.filter(r => r.phone).length}
                </div>
                <div className="text-sm text-muted-foreground">With Phone</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {new Set(residents.map(r => r.buildingId).filter(Boolean)).size}
                </div>
                <div className="text-sm text-muted-foreground">Buildings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

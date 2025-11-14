import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function SuperUser() {
  const [, setLocation] = useLocation();
  
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });
  
  // Redirect if not superuser
  if (userData?.user?.role !== 'superuser') {
    setLocation('/');
    return null;
  }
  
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setLocation('/');
  };
  
  return (
    <div className="min-h-screen page-gradient p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold gradient-text">Super User Dashboard</h1>
          <Button 
            onClick={handleLogout}
            variant="outline"
            data-testid="button-logout"
          >
            <span className="material-icons mr-2">logout</span>
            Logout
          </Button>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="hover-elevate active-elevate-2 cursor-pointer transition-all"
            onClick={() => setLocation('/superuser/companies')}
            data-testid="card-view-companies"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-icons text-primary text-2xl">business</span>
                </div>
                <div>
                  <CardTitle className="text-xl">View All Companies</CardTitle>
                  <CardDescription>View all registered companies on the platform</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access complete list of companies, their details, and license status
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen page-gradient flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold gradient-text">Welcome to Super User</h1>
        <Button 
          onClick={handleLogout}
          size="lg"
          data-testid="button-logout"
        >
          <span className="material-icons mr-2">logout</span>
          Logout
        </Button>
      </div>
    </div>
  );
}

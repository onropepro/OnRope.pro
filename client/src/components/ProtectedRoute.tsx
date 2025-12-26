import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const { data: userData, isLoading, error } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    // Global defaults in queryClient.ts handle refetching for security
  });

  const user = userData?.user;

  // Handle redirects in useEffect to avoid setState during render
  useEffect(() => {
    if (isLoading) return;

    // If there's an auth error (401/403), redirect to login
    if (error && (error.message?.includes("401") || error.message?.includes("403"))) {
      console.log("❌ Auth error detected, redirecting to login");
      setLocation("/");
      return;
    }
    
    // No user found - redirect to login
    if (!user) {
      console.log("❌ No user found, redirecting to login");
      setLocation("/");
      return;
    }
    
    // User role not allowed for this route
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      console.log("⛔ User role not allowed, redirecting to appropriate dashboard");
      if (user.role === "resident") {
        setLocation("/resident-dashboard");
      } else if (user.role === "superuser") {
        setLocation("/superuser");
      } else if (user.role === "staff") {
        setLocation("/superuser");
      } else if (user.role === "property_manager") {
        setLocation("/property-manager");
      } else if (user.role === "building_manager") {
        setLocation("/building-portal");
      } else if (user.role === "rope_access_tech") {
        setLocation("/technician-portal");
      } else if (user.role === "ground_crew") {
        setLocation("/ground-crew-portal");
      } else {
        setLocation("/dashboard");
      }
      return;
    }
    
    console.log("✅ ProtectedRoute: Access granted!");
  }, [user, isLoading, error, allowedRoles, setLocation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Block render if no user or role mismatch (useEffect will redirect)
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}

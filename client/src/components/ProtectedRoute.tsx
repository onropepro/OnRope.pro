import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    // Global defaults in queryClient.ts handle refetching for security
  });

  const user = userData?.user;

  useEffect(() => {
    // If there's an auth error (401/403), log out immediately
    // Network errors will be retried automatically by queryClient
    if (error && (error.message?.includes("401") || error.message?.includes("403"))) {
      setLocation("/");
      return;
    }
    
    if (!isLoading && !user) {
      setLocation("/");
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "resident") {
        setLocation("/resident");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [user, isLoading, error, allowedRoles, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}

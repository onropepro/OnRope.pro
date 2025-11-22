import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["/api/user"],
    // Global defaults in queryClient.ts handle refetching for security
  });

  const user = userData?.user;

  useEffect(() => {
    console.log("🔒 ProtectedRoute check:", {
      currentPath: location,
      isLoading,
      hasUser: !!user,
      userRole: user?.role,
      allowedRoles,
      hasError: !!error
    });
    
    // If there's an auth error (401/403), log out immediately
    // Network errors will be retried automatically by queryClient
    if (error && (error.message?.includes("401") || error.message?.includes("403"))) {
      console.log("❌ Auth error detected, redirecting to login");
      setLocation("/");
      return;
    }
    
    if (!isLoading && !user) {
      console.log("❌ No user found after loading, redirecting to login");
      setLocation("/");
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      console.log("⛔ User role not allowed for this route, redirecting to appropriate dashboard");
      // Redirect to appropriate dashboard based on role
      if (user.role === "resident") {
        setLocation("/resident");
      } else {
        setLocation("/dashboard");
      }
    } else if (!isLoading && user) {
      console.log("✅ ProtectedRoute: Access granted!");
    }
  }, [user, isLoading, error, allowedRoles, setLocation, location]);

  if (isLoading) {
    console.log("⏳ ProtectedRoute: Showing loading screen");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    console.log("🚫 ProtectedRoute: Returning null (no user or role mismatch)");
    return null;
  }

  console.log("✨ ProtectedRoute: Rendering protected content!");
  return <>{children}</>;
}

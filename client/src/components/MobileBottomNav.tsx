import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { hasPermission, isManagement } from "@/lib/permissions";

export function MobileBottomNav() {
  const [location] = useLocation();
  
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });
  
  const user = userData?.user;
  const role = user?.role;
  
  if (!user || role === "resident") {
    return null;
  }
  
  const canManageSchedule = hasPermission(user, "can_manage_schedule") || isManagement(user);
  const isManagementUser = isManagement(user);
  
  const navItems = [
    {
      path: "/dashboard",
      icon: "dashboard",
      label: "Dashboard",
      show: true,
    },
    {
      path: "/schedule",
      icon: "event",
      label: "Schedule",
      show: canManageSchedule,
    },
    {
      path: "/hours-analytics",
      icon: "bar_chart",
      label: "Analytics",
      show: isManagementUser,
    },
    {
      path: "/inventory",
      icon: "inventory_2",
      label: "Inventory",
      show: true,
    },
    {
      path: "/profile",
      icon: "person",
      label: "Profile",
      show: true,
    },
  ].filter(item => item.show);
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 glass-dark backdrop-blur-xl border-t shadow-xl z-50 pb-safe">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <div className="relative">
                  <span className="material-icons text-xl">{item.icon}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

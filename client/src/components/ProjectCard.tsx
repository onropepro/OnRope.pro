import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ReactNode } from "react";

interface ProjectCardProps {
  title: string;
  subtitle?: string;
  status?: "active" | "completed";
  progress?: number;
  icon?: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export function ProjectCard({
  title,
  subtitle,
  status,
  progress,
  icon,
  onClick,
  children,
  className = ""
}: ProjectCardProps) {
  return (
    <div 
      className={`premium-card hover-scale cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground truncate mb-2">{title}</h3>
            {subtitle && (
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <span className="material-icons text-base text-primary">business</span>
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {status && (
              <div 
                className={`px-4 py-1.5 rounded-full font-semibold text-sm shadow-md text-white ${
                  status === "completed" ? "bg-success" : "bg-primary"
                }`}
              >
                {status === "completed" ? "✓ Completed" : "• Active"}
              </div>
            )}
            {icon && (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center shadow-lg">
                <div className="text-primary text-2xl">
                  {icon}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {(progress !== undefined || children) && (
          <div className="space-y-4">
            {progress !== undefined && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Progress</span>
                  <span className="text-2xl font-bold gradient-text">{progress}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-500 rounded-full shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

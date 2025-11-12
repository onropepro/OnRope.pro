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
    <Card 
      className={`hover-elevate transition-all duration-200 cursor-pointer border-border/50 ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">{title}</CardTitle>
            {subtitle && (
              <CardDescription className="text-sm mt-1">{subtitle}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {status && (
              <Badge 
                variant={status === "completed" ? "default" : "secondary"}
                className={status === "completed" ? "bg-success hover:bg-success" : "bg-warning hover:bg-warning"}
              >
                {status === "completed" ? "Completed" : "Active"}
              </Badge>
            )}
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {icon}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      {(progress !== undefined || children) && (
        <CardContent className="pt-0">
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  );
}

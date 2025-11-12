import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className = "" }: StatsCardProps) {
  return (
    <div className={`premium-card hover-scale transition-premium ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold gradient-text mb-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20 w-fit">
              <span className={`text-sm font-bold ${trend.positive ? 'text-success' : 'text-destructive'}`}>
                {trend.value}
              </span>
              <span className="text-xs font-medium text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center shadow-lg">
            <div className="text-primary text-2xl">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

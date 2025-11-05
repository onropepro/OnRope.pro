import { useMemo } from "react";

interface HighRiseBuildingProps {
  floors: number;
  completedDrops: number;
  totalDrops: number;
  className?: string;
}

export function HighRiseBuilding({ floors, completedDrops, totalDrops, className = "" }: HighRiseBuildingProps) {
  const progressPercentage = totalDrops > 0 ? (completedDrops / totalDrops) * 100 : 0;
  
  // Building acts as a vertical progress bar - continuous fill from bottom to top
  const buildingFloors = useMemo(() => {
    return Array.from({ length: floors }, (_, index) => {
      const floorNumber = floors - index; // Top to bottom (floor 25, 24, 23...)
      return { floorNumber };
    });
  }, [floors]);

  return (
    <div className={`flex flex-col items-center ${className}`} data-testid="highrise-building">
      {/* Building Title */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-foreground" data-testid="progress-percentage">
          {Math.round(progressPercentage)}%
        </div>
        <div className="text-sm text-muted-foreground mt-1" data-testid="drops-progress">
          {completedDrops} / {totalDrops} Drops
        </div>
      </div>

      {/* Building Structure */}
      <div className="relative">
        {/* Building Main Body */}
        <div className="w-48 md:w-56 bg-card border-2 border-card-border rounded-t-sm shadow-xl">
          {/* Roof */}
          <div className="h-3 bg-muted border-b border-card-border"></div>
          
          {/* Floors Container - Progress Bar Style */}
          <div className="flex flex-col">
            {buildingFloors.map(({ floorNumber, isLit }) => (
              <div
                key={floorNumber}
                className={`relative border-b border-card-border last:border-b-0 transition-all duration-500 ${
                  isLit 
                    ? 'bg-warning/90 border-warning' 
                    : 'bg-muted/10 border-muted'
                }`}
                style={{ height: '16px' }}
                data-testid={`floor-${floorNumber}`}
              >
                {/* Floor Number */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono w-8 text-right">
                  {floorNumber}
                </div>
              </div>
            ))}
          </div>

          {/* Ground Floor / Base */}
          <div className="h-4 bg-muted border-t-2 border-card-border"></div>
        </div>

        {/* Building Shadow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-52 md:w-60 h-2 bg-gradient-to-r from-transparent via-muted/40 to-transparent blur-sm"></div>
      </div>

      {/* Progress Info */}
      <div className="mt-6 text-center">
        <div className="text-xs text-muted-foreground">
          {completedDrops} of {totalDrops} drops completed
        </div>
      </div>
    </div>
  );
}

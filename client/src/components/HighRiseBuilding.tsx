import { useMemo } from "react";

interface HighRiseBuildingProps {
  floors: number;
  totalDropsNorth: number;
  totalDropsEast: number;
  totalDropsSouth: number;
  totalDropsWest: number;
  completedDropsNorth: number;
  completedDropsEast: number;
  completedDropsSouth: number;
  completedDropsWest: number;
  className?: string;
}

export function HighRiseBuilding({ 
  floors, 
  totalDropsNorth,
  totalDropsEast,
  totalDropsSouth,
  totalDropsWest,
  completedDropsNorth,
  completedDropsEast,
  completedDropsSouth,
  completedDropsWest,
  className = "" 
}: HighRiseBuildingProps) {
  // Calculate progress for each elevation
  const northProgress = totalDropsNorth > 0 ? Math.min(100, (completedDropsNorth / totalDropsNorth) * 100) : 0;
  const eastProgress = totalDropsEast > 0 ? Math.min(100, (completedDropsEast / totalDropsEast) * 100) : 0;
  const southProgress = totalDropsSouth > 0 ? Math.min(100, (completedDropsSouth / totalDropsSouth) * 100) : 0;
  const westProgress = totalDropsWest > 0 ? Math.min(100, (completedDropsWest / totalDropsWest) * 100) : 0;
  
  const totalDrops = totalDropsNorth + totalDropsEast + totalDropsSouth + totalDropsWest;
  const completedDrops = completedDropsNorth + completedDropsEast + completedDropsSouth + completedDropsWest;
  const overallProgress = totalDrops > 0 ? Math.min(100, (completedDrops / totalDrops) * 100) : 0;
  
  // Building acts as a vertical progress bar - continuous fill from bottom to top
  const buildingFloors = useMemo(() => {
    return Array.from({ length: floors }, (_, index) => {
      const floorNumber = floors - index; // Top to bottom (floor 25, 24, 23...)
      return { floorNumber };
    });
  }, [floors]);

  const elevations = [
    { name: "North", progress: northProgress, completed: completedDropsNorth, total: totalDropsNorth },
    { name: "East", progress: eastProgress, completed: completedDropsEast, total: totalDropsEast },
    { name: "South", progress: southProgress, completed: completedDropsSouth, total: totalDropsSouth },
    { name: "West", progress: westProgress, completed: completedDropsWest, total: totalDropsWest },
  ];

  return (
    <div className={`flex flex-col items-center ${className}`} data-testid="highrise-building">
      {/* Overall Progress - Premium Style */}
      <div className="text-center mb-8">
        <div className="text-5xl font-bold gradient-text mb-2" data-testid="progress-percentage">
          {Math.round(overallProgress)}%
        </div>
        <div className="text-sm font-medium text-muted-foreground" data-testid="drops-progress">
          {completedDrops} of {totalDrops} Total Drops Complete
        </div>
      </div>

      {/* Four Elevations Side-by-Side - Premium Cards */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2">
        {elevations.map((elevation) => (
          <div key={elevation.name} className="flex flex-col items-center">
            {/* Elevation Label - Premium Badge */}
            <div className="mb-3 px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                {elevation.name}
              </span>
            </div>
            
            {/* Building Structure - Premium Card with Shadow */}
            <div className="relative">
              <div className="w-20 bg-gradient-to-b from-card to-background border border-border/50 rounded-t-xl shadow-premium transition-premium hover:shadow-premium-lg">
                {/* Roof - Premium Gradient */}
                <div className="h-3 bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border/30 rounded-t-xl"></div>
                
                {/* Floors - Refined Styling */}
                <div className="relative flex flex-col">
                  {buildingFloors.map(({ floorNumber }) => (
                    <div
                      key={floorNumber}
                      className="relative border-b border-border/20 last:border-b-0 bg-card"
                      style={{ height: '14px' }}
                      data-testid={`${elevation.name.toLowerCase()}-floor-${floorNumber}`}
                    >
                      {/* Horizontal Progress Fill - Premium Gradient */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
                        style={{ width: `${elevation.progress}%` }}
                        data-testid={`${elevation.name.toLowerCase()}-progress-${floorNumber}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Base - Premium Foundation */}
                <div className="h-3 bg-gradient-to-r from-muted to-muted/50 border-t border-border/30 rounded-b-xl"></div>
              </div>
            </div>
            
            {/* Elevation Progress - Premium Typography */}
            <div className="mt-3 text-center">
              <div className="text-lg font-bold text-foreground mb-0.5">
                {Math.round(elevation.progress)}%
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                {elevation.completed} / {elevation.total} drops
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

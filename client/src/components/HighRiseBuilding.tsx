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
      {/* Overall Progress */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-foreground" data-testid="progress-percentage">
          {Math.round(overallProgress)}%
        </div>
        <div className="text-sm text-muted-foreground mt-1" data-testid="drops-progress">
          {completedDrops} / {totalDrops} Total Drops
        </div>
      </div>

      {/* Four Elevations Side-by-Side */}
      <div className="flex gap-2 md:gap-4 overflow-x-auto">
        {elevations.map((elevation) => (
          <div key={elevation.name} className="flex flex-col items-center">
            {/* Elevation Label */}
            <div className="text-xs font-bold text-muted-foreground mb-2">
              {elevation.name}
            </div>
            
            {/* Building Structure */}
            <div className="relative">
              <div className="w-16 bg-card border-2 border-card-border rounded-t-sm shadow-md">
                {/* Roof */}
                <div className="h-2 bg-muted border-b border-card-border"></div>
                
                {/* Floors */}
                <div className="relative flex flex-col">
                  {buildingFloors.map(({ floorNumber }) => (
                    <div
                      key={floorNumber}
                      className="relative border-b border-card-border last:border-b-0 bg-muted/10"
                      style={{ height: '12px' }}
                      data-testid={`${elevation.name.toLowerCase()}-floor-${floorNumber}`}
                    >
                      {/* Horizontal Progress Fill */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-warning/90 transition-all duration-500"
                        style={{ width: `${elevation.progress}%` }}
                        data-testid={`${elevation.name.toLowerCase()}-progress-${floorNumber}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Base */}
                <div className="h-2 bg-muted border-t-2 border-card-border"></div>
              </div>
            </div>
            
            {/* Elevation Progress */}
            <div className="mt-2 text-center">
              <div className="text-xs font-bold text-foreground">
                {Math.round(elevation.progress)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {elevation.completed}/{elevation.total}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

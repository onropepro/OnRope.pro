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
  customColor?: string | null;
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
  className = "",
  customColor = null
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
    <div className={`w-full ${className}`} data-testid="highrise-building">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {completedDrops} of {totalDrops} Total Drops Complete
        </div>
      </div>

      {/* Four Elevations - Minimalist Premium Design */}
      <div className="flex justify-center gap-8 overflow-x-auto pb-4 px-4">
        {elevations.map((elevation) => (
          <div key={elevation.name} className="flex flex-col items-center min-w-[120px]">
            {/* Elevation Label - Soft Pill */}
            <div 
              className="mb-6 px-6 py-2 rounded-full"
              style={customColor ? {
                backgroundColor: `${customColor}1a`,
              } : {}}
            >
              <span 
                className="text-sm font-bold uppercase tracking-wide"
                style={customColor ? { color: customColor } : {}}
              >
                {elevation.name}
              </span>
            </div>
            
            {/* Building Visualization - Clean Minimal Style */}
            <div className="relative w-24 h-96 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {/* Progress Fill from Bottom */}
              <div 
                className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out rounded-3xl"
                style={customColor ? {
                  height: `${elevation.progress}%`,
                  background: `linear-gradient(to top, ${customColor}e6, ${customColor}b3, ${customColor}80)`
                } : {
                  height: `${elevation.progress}%`
                }}
                data-testid={`${elevation.name.toLowerCase()}-progress-fill`}
              >
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              
              {/* Floor Lines */}
              {buildingFloors.slice(0, 15).map(({ floorNumber }, index) => (
                <div
                  key={floorNumber}
                  className="absolute left-0 right-0 border-t border-gray-300/30"
                  style={{ top: `${(index / 15) * 100}%` }}
                />
              ))}
              
              {/* Windows Pattern */}
              <div className="absolute inset-4 grid grid-cols-2 gap-2 opacity-20">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="h-3 bg-gray-400 rounded-sm"></div>
                ))}
              </div>
            </div>
            
            {/* Stats Below */}
            <div className="mt-6 text-center">
              <div 
                className="text-3xl font-bold mb-1"
                style={customColor ? { color: customColor } : {}}
              >
                {Math.round(elevation.progress)}%
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {elevation.completed} / {elevation.total}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

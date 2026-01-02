import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  customColors?: string[];
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
  customColor = null,
  customColors = []
}: HighRiseBuildingProps) {
  const { t } = useTranslation();
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
    { name: t('directions.north', 'North'), key: "north", progress: northProgress, completed: completedDropsNorth, total: totalDropsNorth, exceeded: completedDropsNorth > totalDropsNorth && totalDropsNorth > 0 },
    { name: t('directions.east', 'East'), key: "east", progress: eastProgress, completed: completedDropsEast, total: totalDropsEast, exceeded: completedDropsEast > totalDropsEast && totalDropsEast > 0 },
    { name: t('directions.south', 'South'), key: "south", progress: southProgress, completed: completedDropsSouth, total: totalDropsSouth, exceeded: completedDropsSouth > totalDropsSouth && totalDropsSouth > 0 },
    { name: t('directions.west', 'West'), key: "west", progress: westProgress, completed: completedDropsWest, total: totalDropsWest, exceeded: completedDropsWest > totalDropsWest && totalDropsWest > 0 },
  ];
  
  const hasAnyExceeded = elevations.some(e => e.exceeded);

  return (
    <div className={`w-full ${className}`} data-testid="highrise-building">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {completedDrops} {t('common.of', 'of')} {totalDrops} {t('highRiseBuilding.totalDropsComplete', 'Total Drops Complete')}
        </div>
        {hasAnyExceeded && (
          <div className="inline-flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-amber-100 dark:bg-amber-900/40 border border-amber-400 dark:border-amber-600 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">{t('highRiseBuilding.exceededWarning', 'Some elevations have more drops than planned')}</span>
          </div>
        )}
      </div>

      {/* Four Elevations - Minimalist Premium Design */}
      <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 pb-4 px-2">
        {elevations.map((elevation, index) => {
          return (
          <div key={elevation.name} className="flex flex-col items-center flex-1 max-w-[140px]">
            {/* Elevation Label - Soft Pill */}
            <div className="mb-4 sm:mb-6 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full bg-muted">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground">
                {elevation.name}
              </span>
            </div>
            
            {/* Building Visualization - Clean Minimal Style */}
            <div className="relative w-16 sm:w-20 md:w-24 h-64 sm:h-80 md:h-96 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl sm:rounded-3xl shadow-xl border border-border/50 dark:border-muted-foreground/50 overflow-hidden">
              {/* Progress Fill from Bottom */}
              <div 
                className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out rounded-3xl bg-gradient-to-t from-primary/90 via-primary/70 to-primary/50"
                style={{ height: `${elevation.progress}%` }}
                data-testid={`${elevation.key}-progress-fill`}
              >
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
              
              {/* Floor Lines */}
              {buildingFloors.slice(0, 15).map(({ floorNumber }, index) => (
                <div
                  key={floorNumber}
                  className="absolute left-0 right-0 border-t border-border/30"
                  style={{ top: `${(index / 15) * 100}%` }}
                />
              ))}
              
              {/* Windows Pattern */}
              <div className="absolute inset-4 grid grid-cols-2 gap-2 opacity-20">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="h-3 bg-muted-foreground/50 rounded-sm"></div>
                ))}
              </div>
            </div>
            
            {/* Stats Below */}
            <div className="mt-4 sm:mt-6 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-primary">
                {Math.round(elevation.progress)}%
              </div>
              <div className={`text-xs sm:text-sm font-medium flex items-center justify-center gap-1 ${elevation.exceeded ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                {elevation.exceeded && <AlertTriangle className="w-3 h-3" />}
                {elevation.completed} / {elevation.total}
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}

import { useMemo } from "react";

interface HighRiseBuildingProps {
  floors: number;
  completedDrops: number;
  totalDrops: number;
  className?: string;
}

export function HighRiseBuilding({ floors, completedDrops, totalDrops, className = "" }: HighRiseBuildingProps) {
  const progressPercentage = totalDrops > 0 ? (completedDrops / totalDrops) * 100 : 0;
  const floorsCompleted = Math.floor((progressPercentage / 100) * floors);
  
  const buildingFloors = useMemo(() => {
    return Array.from({ length: floors }, (_, index) => {
      const floorNumber = floors - index; // Top to bottom
      const isCompleted = floorNumber <= floorsCompleted;
      return { floorNumber, isCompleted };
    });
  }, [floors, floorsCompleted]);

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
          
          {/* Floors Container */}
          <div className="flex flex-col-reverse">
            {buildingFloors.map(({ floorNumber, isCompleted }) => (
              <div
                key={floorNumber}
                className="relative border-b border-card-border last:border-b-0"
                style={{ height: '40px' }}
                data-testid={`floor-${floorNumber}`}
              >
                {/* Floor Number */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono w-8 text-right">
                  {floorNumber}
                </div>

                {/* Windows Row */}
                <div className="h-full flex items-center justify-center gap-2 px-3">
                  {[1, 2, 3, 4].map((windowNum) => (
                    <div
                      key={windowNum}
                      className={`w-8 h-6 rounded-sm border transition-all duration-500 ${
                        isCompleted
                          ? 'bg-yellow-400 border-yellow-500 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                          : 'bg-muted/30 border-muted'
                      }`}
                      data-testid={`window-${floorNumber}-${windowNum}`}
                    >
                      {/* Window Panes */}
                      <div className="h-full w-full grid grid-cols-2 gap-[1px]">
                        <div className={`${isCompleted ? 'bg-yellow-300/40' : 'bg-background/20'}`}></div>
                        <div className={`${isCompleted ? 'bg-yellow-300/40' : 'bg-background/20'}`}></div>
                        <div className={`${isCompleted ? 'bg-yellow-300/40' : 'bg-background/20'}`}></div>
                        <div className={`${isCompleted ? 'bg-yellow-300/40' : 'bg-background/20'}`}></div>
                      </div>
                    </div>
                  ))}
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

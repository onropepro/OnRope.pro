import { useMemo } from "react";

interface VerticalBuildingProgressProps {
  buildingFloors: number;
  totalUnits: number;
  completedUnits: number;
  className?: string;
}

export function VerticalBuildingProgress({ 
  buildingFloors,
  totalUnits,
  completedUnits,
  className = "" 
}: VerticalBuildingProgressProps) {
  // Calculate progress percentage
  const progressPercent = totalUnits > 0 ? Math.min(100, (completedUnits / totalUnits) * 100) : 0;
  
  // Calculate how many floors are "filled" based on progress
  const filledFloors = Math.floor((progressPercent / 100) * buildingFloors);
  
  // Building floors array (top to bottom)
  const floors = useMemo(() => {
    return Array.from({ length: buildingFloors }, (_, index) => {
      const floorNumber = buildingFloors - index; // Top to bottom (floor 25, 24, 23...)
      const isFilled = floorNumber <= filledFloors;
      return { floorNumber, isFilled };
    });
  }, [buildingFloors, filledFloors]);

  return (
    <div className={`flex flex-col items-center ${className}`} data-testid="vertical-building-progress">
      {/* Overall Progress */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-foreground" data-testid="progress-percentage">
          {Math.round(progressPercent)}%
        </div>
        <div className="text-sm text-muted-foreground mt-2" data-testid="units-progress">
          {completedUnits} / {totalUnits} Units Completed
        </div>
      </div>

      {/* Vertical Building */}
      <div className="relative">
        {/* Building Structure */}
        <div 
          className="relative bg-card border-2 border-border rounded-lg overflow-hidden shadow-lg"
          style={{ width: '200px' }}
        >
          {/* Floors Container */}
          <div className="relative">
            {floors.map((floor, index) => (
              <div
                key={index}
                className={`
                  relative h-8 border-b border-border/50 transition-all duration-300
                  ${floor.isFilled ? 'bg-primary/20' : 'bg-background'}
                `}
                style={{
                  borderBottom: index === floors.length - 1 ? 'none' : undefined
                }}
              >
                {/* Floor Number */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  {floor.floorNumber}
                </div>
                
                {/* Floor Fill Indicator */}
                {floor.isFilled && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <span className="material-icons text-primary text-sm">check_circle</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Fill (from bottom to top) */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-primary/10 transition-all duration-500 ease-out pointer-events-none"
            style={{ 
              height: `${progressPercent}%`,
            }}
          />
        </div>

        {/* Building Label */}
        <div className="text-center mt-4">
          <div className="text-sm font-medium text-foreground">In-Suite Dryer Vent Cleaning</div>
          <div className="text-xs text-muted-foreground mt-1">{buildingFloors} Floors</div>
        </div>
      </div>
    </div>
  );
}

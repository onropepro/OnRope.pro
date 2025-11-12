interface ParkadeViewProps {
  totalStalls: number;
  completedStalls: number;
  className?: string;
}

export function ParkadeView({ totalStalls, completedStalls, className = "" }: ParkadeViewProps) {
  // Calculate stall size based on total count for scalability
  const getStallConfig = (total: number) => {
    if (total <= 20) return { columns: 4, stallHeight: "h-16", iconSize: "text-2xl" };
    if (total <= 50) return { columns: 5, stallHeight: "h-14", iconSize: "text-xl" };
    if (total <= 100) return { columns: 6, stallHeight: "h-12", iconSize: "text-lg" };
    if (total <= 200) return { columns: 8, stallHeight: "h-10", iconSize: "text-base" };
    return { columns: 10, stallHeight: "h-8", iconSize: "text-sm" };
  };

  const config = getStallConfig(totalStalls);
  const progressPercentage = totalStalls > 0 ? Math.round((completedStalls / totalStalls) * 100) : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with progress */}
      <div className="text-center mb-6">
        <h3 className="text-4xl font-bold text-primary mb-2">
          {progressPercentage}%
        </h3>
        <p className="text-muted-foreground">
          Parkade Progress
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {completedStalls} of {totalStalls} stalls cleaned
        </p>
      </div>

      {/* Parkade visualization */}
      <div className="bg-muted/30 rounded-2xl p-4 sm:p-6 border-2 border-border/50">
        {/* Parkade entrance header */}
        <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b-2 border-dashed border-border">
          <span className="material-icons text-primary text-2xl">local_parking</span>
          <h4 className="text-lg font-semibold text-muted-foreground">Parking Level</h4>
        </div>

        {/* Parking stalls grid */}
        <div 
          className="grid gap-2 max-h-[500px] overflow-y-auto pr-2"
          style={{ gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: totalStalls }, (_, index) => {
            const isCompleted = index < completedStalls;
            return (
              <div
                key={index}
                className={`
                  ${config.stallHeight}
                  flex flex-col items-center justify-center
                  rounded-lg border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-500/20 border-green-500 dark:bg-green-500/30' 
                    : 'bg-card border-border hover-elevate'
                  }
                `}
                data-testid={`stall-${index + 1}`}
              >
                <span className={`material-icons ${config.iconSize} ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/50'}`}>
                  {isCompleted ? 'check_circle' : 'local_parking'}
                </span>
                <span className={`text-xs font-medium mt-0.5 ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/70'}`}>
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500"></div>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-card border-2 border-border"></div>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-8 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 ease-out flex items-center justify-end pr-3"
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage > 10 && (
            <span className="text-xs font-bold text-white">
              {progressPercentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

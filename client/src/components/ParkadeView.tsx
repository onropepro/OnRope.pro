interface ParkadeViewProps {
  totalStalls: number;
  completedStalls: number;
  className?: string;
  customColor?: string | null;
}

export function ParkadeView({ totalStalls, completedStalls, className = "", customColor = null }: ParkadeViewProps) {
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
      {/* Header with progress - Premium Style */}
      <div className="text-center mb-8">
        <h3 
          className="text-5xl font-bold mb-2"
          style={customColor ? { color: customColor } : {}}
        >
          {progressPercentage}%
        </h3>
        <p className="text-base font-medium text-foreground">
          Parkade Cleaning Progress
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {completedStalls} of {totalStalls} stalls completed
        </p>
      </div>

      {/* Parkade visualization - Premium Card */}
      <div className="bg-gradient-to-br from-card to-background rounded-2xl p-6 border border-border/50 shadow-premium">
        {/* Parkade entrance header - Premium Badge */}
        <div className="flex items-center justify-center gap-3 mb-6 pb-4 border-b border-border/30">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={customColor ? { backgroundColor: `${customColor}1a` } : {}}
          >
            <span 
              className="material-icons text-xl"
              style={customColor ? { color: customColor } : {}}
            >
              local_parking
            </span>
          </div>
          <h4 className="text-lg font-semibold text-foreground">Parking Level</h4>
        </div>

        {/* Parking stalls grid - Premium Styling */}
        <div 
          className="grid gap-2.5 max-h-[500px] overflow-y-auto pr-2"
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
                  rounded-xl border transition-premium
                  ${isCompleted 
                    ? 'bg-success/10 border-success/30 shadow-sm' 
                    : 'bg-card border-border/50 hover-elevate'
                  }
                `}
                data-testid={`stall-${index + 1}`}
              >
                <span className={`material-icons ${config.iconSize} ${isCompleted ? 'text-success' : 'text-muted-foreground/40'}`}>
                  {isCompleted ? 'check_circle' : 'local_parking'}
                </span>
                <span className={`text-xs font-semibold mt-0.5 ${isCompleted ? 'text-success' : 'text-muted-foreground/60'}`}>
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend - Premium Pills */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-xs font-semibold text-success">Completed</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/40 border border-border"></div>
            <span className="text-xs font-semibold text-muted-foreground">Remaining</span>
          </div>
        </div>
      </div>

      {/* Progress bar - Premium Gradient */}
      <div className="relative h-10 bg-muted/50 rounded-xl overflow-hidden border border-border/30 shadow-sm">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-success/80 transition-all duration-500 ease-out flex items-center justify-end pr-4"
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage > 15 && (
            <span className="text-sm font-bold text-white drop-shadow">
              {progressPercentage}%
            </span>
          )}
        </div>
        {progressPercentage <= 15 && progressPercentage > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">
              {progressPercentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

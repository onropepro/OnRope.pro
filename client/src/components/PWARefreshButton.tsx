import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";

export function PWARefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      await queryClient.invalidateQueries();
      window.location.reload();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-background/95 backdrop-blur-sm"
      data-testid="button-pwa-refresh"
      aria-label="Refresh page"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
}

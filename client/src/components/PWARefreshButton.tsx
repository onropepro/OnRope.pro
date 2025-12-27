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
      variant="default"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="!fixed !bottom-6 !right-6 !z-[99999] rounded-full shadow-2xl h-12 w-12"
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999 }}
      data-testid="button-pwa-refresh"
      aria-label="Refresh page"
    >
      <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
}

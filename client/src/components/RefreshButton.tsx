import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export function RefreshButton() {
  const handleRefresh = () => {
    queryClient.invalidateQueries();
    window.location.reload();
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleRefresh}
      className="h-9 w-9"
      data-testid="button-refresh"
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  );
}

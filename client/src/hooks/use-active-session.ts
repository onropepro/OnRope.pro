import { useQuery } from "@tanstack/react-query";

interface ActiveSessionData {
  hasActiveSession: boolean;
  type?: "billable" | "non_billable";
  sessionId?: string;
  startTime?: string;
  projectName?: string | null;
  buildingName?: string | null;
  description?: string | null;
}

export function useActiveWorkSession() {
  return useQuery<ActiveSessionData>({
    queryKey: ["/api/my-active-session"],
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

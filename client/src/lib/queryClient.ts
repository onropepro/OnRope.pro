import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    // Try to parse JSON and extract the message for user-friendly errors
    try {
      const json = JSON.parse(text);
      // For 409 conflict responses, include the full JSON in the error message
      // so the frontend can parse conflict details
      if (res.status === 409) {
        throw new Error(`409:${text}`);
      }
      if (json.message) {
        throw new Error(json.message);
      }
    } catch (e) {
      // If parsing failed but we have error already, rethrow it
      if (e instanceof Error && e.message.startsWith('409:')) {
        throw e;
      }
      // If not JSON or no message, use the raw text
    }
    throw new Error(text || res.statusText);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Override defaults for security-critical user query
// This ensures license verification status is always fresh
queryClient.setQueryDefaults(["/api/user"], {
  refetchOnWindowFocus: true,  // Recheck when user returns to tab
  refetchInterval: 60000,      // Automatic recheck every 60 seconds
  staleTime: 0,                // Always fetch fresh data
  retry: (failureCount, error: any) => {
    // Only retry on network errors, not auth failures (401/403)
    if (error?.message?.includes("401") || error?.message?.includes("403")) {
      return false; // Don't retry auth failures - user should be logged out
    }
    return failureCount < 2; // Retry network errors up to 2 times
  },
});

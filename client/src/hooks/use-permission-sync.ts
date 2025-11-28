import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function usePermissionSync(userId: string | undefined) {
  const wsRef = useRef<WebSocket | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!userId) return;

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws?userId=${userId}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Permission sync WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'permissions:updated') {
            toast({
              title: "Access Updated",
              description: "Your permissions have been updated. Refreshing your access...",
              variant: "default",
            });
            queryClient.invalidateQueries({ queryKey: ['/api/user'] });
            queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
          } else if (data.type === 'user:terminated') {
            toast({
              title: "Session Ended",
              description: "Your account access has been revoked. You will be redirected to the login page.",
              variant: "destructive",
            });
            setTimeout(() => {
              queryClient.clear();
              setLocation('/login');
            }, 2000);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Permission sync WebSocket disconnected');
        reconnectTimeoutRef.current = setTimeout(() => {
          if (userId) {
            connect();
          }
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [userId, setLocation, toast]);
}

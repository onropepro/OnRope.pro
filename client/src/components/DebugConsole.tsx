import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'log' | 'error' | 'warn';
}

export function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      if (message.includes('[Dashboard]') || message.includes('[HoursAnalytics]')) {
        setLogs(prev => [...prev.slice(-20), {
          timestamp: new Date().toLocaleTimeString(),
          message,
          type: 'log'
        }]);
      }
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev.slice(-20), {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type: 'error'
      }]);
      originalError(...args);
    };

    console.warn = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev.slice(-20), {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type: 'warn'
      }]);
      originalWarn(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <Button
          onClick={() => setIsMinimized(false)}
          variant="default"
          size="sm"
          className="shadow-2xl"
        >
          <span className="material-icons text-sm mr-2">bug_report</span>
          Debug Console ({logs.length})
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[500px] max-h-[400px] z-[9999] shadow-2xl">
      <div className="p-3 border-b flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <span className="material-icons text-sm">bug_report</span>
          <span className="font-semibold text-sm">Debug Console</span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setLogs([])}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-white hover:bg-slate-800"
          >
            Clear
          </Button>
          <Button
            onClick={() => setIsMinimized(true)}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-white hover:bg-slate-800"
          >
            <span className="material-icons text-sm">minimize</span>
          </Button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[340px] bg-slate-950 p-3 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-slate-400 text-center py-8">
            No debug logs yet. Interact with the page to see logs.
          </div>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className={`mb-1 ${
                log.type === 'error' ? 'text-red-400' :
                log.type === 'warn' ? 'text-yellow-400' :
                'text-green-400'
              }`}
            >
              <span className="text-slate-500">[{log.timestamp}]</span>{' '}
              <span className="whitespace-pre-wrap break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

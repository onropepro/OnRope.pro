import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface LogEntry {
  timestamp: number;
  message: string;
  type: 'log' | 'error' | 'warn';
}

export default function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Intercept console.log
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, { 
        timestamp: Date.now(), 
        message,
        type: 'log'
      }]);
      
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, { 
        timestamp: Date.now(), 
        message,
        type: 'error'
      }]);
      
      originalError(...args);
    };

    console.warn = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, { 
        timestamp: Date.now(), 
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

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-[9999] bg-black/95 text-white rounded-lg shadow-2xl border border-green-500/50"
      style={{ width: isMinimized ? '300px' : '600px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-green-500/30 bg-green-900/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-sm font-bold text-green-400">DEBUG CONSOLE</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-green-400 hover:text-green-300 hover:bg-green-500/20"
            onClick={() => setIsMinimized(!isMinimized)}
            data-testid="button-minimize-console"
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/20"
            onClick={() => setIsVisible(false)}
            data-testid="button-close-console"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Console Output */}
      {!isMinimized && (
        <div 
          className="p-3 font-mono text-xs overflow-y-auto space-y-1"
          style={{ maxHeight: '400px' }}
        >
          {logs.length === 0 ? (
            <div className="text-gray-500 italic">Waiting for logs...</div>
          ) : (
            logs.map((log, index) => (
              <div 
                key={index} 
                className={`py-1 px-2 rounded ${
                  log.type === 'error' ? 'bg-red-900/20 text-red-300' :
                  log.type === 'warn' ? 'bg-yellow-900/20 text-yellow-300' :
                  'text-green-300'
                }`}
              >
                <span className="text-gray-500 text-[10px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                {" "}
                <span className="whitespace-pre-wrap break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      {!isMinimized && (
        <div className="p-2 border-t border-green-500/30 bg-green-900/10 flex justify-between items-center">
          <span className="text-[10px] text-gray-400 font-mono">{logs.length} logs</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-[10px] text-gray-400 hover:text-gray-300 hover:bg-green-500/20"
            onClick={() => setLogs([])}
            data-testid="button-clear-logs"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

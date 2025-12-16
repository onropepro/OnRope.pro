import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp, Trash2, Bug } from "lucide-react";
import { useLocation } from "wouter";

interface LogEntry {
  id: number;
  timestamp: number;
  message: string;
  type: 'log' | 'error' | 'warn' | 'fetch' | 'route';
  details?: string;
}

let logIdCounter = 0;

export default function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [filter, setFilter] = useState<'all' | 'error' | 'fetch' | 'route'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const prevLocationRef = useRef(location);

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    setLogs(prev => {
      const newLogs = [...prev, { 
        ...entry,
        id: ++logIdCounter, 
        timestamp: Date.now()
      }];
      return newLogs.slice(-200);
    });
  };

  useEffect(() => {
    if (prevLocationRef.current !== location) {
      addLog({
        type: 'route',
        message: `Navigation: ${prevLocationRef.current} -> ${location}`,
      });
      prevLocationRef.current = location;
    }
  }, [location]);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog({ message, type: 'log' });
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      const message = args.map(arg => {
        if (arg instanceof Error) {
          return `${arg.message}\n${arg.stack}`;
        }
        return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
      }).join(' ');
      addLog({ message, type: 'error' });
      originalError(...args);
    };

    console.warn = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog({ message, type: 'warn' });
      originalWarn(...args);
    };

    const originalFetch = window.fetch;
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      const method = (args[1]?.method || 'GET').toUpperCase();
      const startTime = Date.now();
      
      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;
        const statusColor = response.ok ? 'success' : 'error';
        
        addLog({
          type: 'fetch',
          message: `${method} ${url} - ${response.status} (${duration}ms)`,
          details: !response.ok ? `Status: ${response.status} ${response.statusText}` : undefined
        });
        
        return response;
      } catch (error: any) {
        const duration = Date.now() - startTime;
        addLog({
          type: 'error',
          message: `FETCH FAILED: ${method} ${url} (${duration}ms)`,
          details: error.message
        });
        throw error;
      }
    };

    window.addEventListener('error', (event) => {
      addLog({
        type: 'error',
        message: `Uncaught Error: ${event.message}`,
        details: `${event.filename}:${event.lineno}:${event.colno}`
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      addLog({
        type: 'error',
        message: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
        details: event.reason?.stack
      });
    });

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter);

  const errorCount = logs.filter(l => l.type === 'error').length;
  const fetchCount = logs.filter(l => l.type === 'fetch').length;

  if (!isVisible) {
    return (
      <Button
        size="icon"
        variant="outline"
        className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-green-400 border-green-500/50 hover:bg-green-900/30"
        onClick={() => setIsVisible(true)}
        data-testid="button-show-debug-console"
      >
        <Bug className="h-4 w-4" />
        {errorCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {errorCount}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-[9999] bg-black/95 text-white rounded-lg shadow-2xl border border-green-500/50"
      style={{ width: isMinimized ? '300px' : '650px' }}
      data-testid="debug-console"
    >
      <div className="flex items-center justify-between p-2 border-b border-green-500/30 bg-green-900/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs font-bold text-green-400">DEBUG CONSOLE</span>
          {errorCount > 0 && (
            <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {errorCount} errors
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-green-400 hover:text-green-300 hover:bg-green-500/20"
            onClick={() => setIsMinimized(!isMinimized)}
            data-testid="button-minimize-console"
          >
            {isMinimized ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/20"
            onClick={() => setIsVisible(false)}
            data-testid="button-close-console"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex gap-1 p-1 border-b border-green-500/20 bg-black/50">
            {(['all', 'error', 'fetch', 'route'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                  filter === f 
                    ? 'bg-green-600 text-white' 
                    : 'text-green-400 hover:bg-green-500/20'
                }`}
                data-testid={`filter-${f}`}
              >
                {f.toUpperCase()}
                {f === 'error' && errorCount > 0 && ` (${errorCount})`}
                {f === 'fetch' && ` (${fetchCount})`}
              </button>
            ))}
          </div>

          <div 
            ref={scrollRef}
            className="p-2 font-mono text-[11px] overflow-y-auto space-y-0.5"
            style={{ maxHeight: '350px' }}
          >
            {filteredLogs.length === 0 ? (
              <div className="text-muted-foreground italic text-center py-4">
                {filter === 'all' ? 'Waiting for logs...' : `No ${filter} logs`}
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`py-0.5 px-1.5 rounded ${
                    log.type === 'error' ? 'bg-red-900/30 text-red-300 border-l-2 border-red-500' :
                    log.type === 'warn' ? 'bg-yellow-900/30 text-yellow-300 border-l-2 border-yellow-500' :
                    log.type === 'fetch' ? 'bg-blue-900/20 text-blue-300' :
                    log.type === 'route' ? 'bg-purple-900/20 text-purple-300 border-l-2 border-purple-500' :
                    'text-green-300/80'
                  }`}
                >
                  <div className="flex gap-2">
                    <span className="text-muted-foreground text-[9px] flex-shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`text-[9px] uppercase flex-shrink-0 w-10 ${
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'warn' ? 'text-yellow-400' :
                      log.type === 'fetch' ? 'text-blue-400' :
                      log.type === 'route' ? 'text-purple-400' :
                      'text-green-400'
                    }`}>
                      [{log.type}]
                    </span>
                    <span className="whitespace-pre-wrap break-all flex-1">{log.message}</span>
                  </div>
                  {log.details && (
                    <div className="ml-16 text-[9px] text-muted-foreground mt-0.5">
                      {log.details}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-1.5 border-t border-green-500/30 bg-green-900/10 flex justify-between items-center">
            <span className="text-[9px] text-muted-foreground font-mono">
              {filteredLogs.length}/{logs.length} logs | Current: {location}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 px-2 text-[9px] text-muted-foreground hover:text-red-400 hover:bg-red-500/20"
              onClick={() => setLogs([])}
              data-testid="button-clear-logs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

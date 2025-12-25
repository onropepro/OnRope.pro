import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import chokidar from "chokidar";
import { pool } from "./db";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { runMigrations } from "./migrate";
import { seedEquipmentCatalog } from "./seedEquipmentCatalog";
import { wsHub } from "./websocket-hub";
import { SESSION_SECRET, SESSION_COOKIE_NAME } from "./session-config";
import { indexAllGuides } from "./services/ragService";

const app = express();

// Health check endpoint - responds immediately for deployment health checks
// This must be before any middleware that requires database connections
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Trust proxy - required for secure cookies behind Replit's HTTPS proxy
app.set('trust proxy', 1);

// Session configuration
// Note: Replit uses HTTPS for all requests, so we need secure cookies even in development
const PgSession = connectPg(session);
app.use(session({
  store: new PgSession({
    pool,
    tableName: "sessions",
    createTableIfMissing: true,
  }),
  name: SESSION_COOKIE_NAME,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Always true - Replit proxies all requests over HTTPS
    httpOnly: true,
    sameSite: "none", // Required for cross-origin cookies with secure: true
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
}));

declare module 'express-session' {
  interface SessionData {
    userId: string;
    role: string;
    buildingId?: string;
    strataPlanNumber?: string;
    staffPermissions?: string[];
  }
}

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Run database migrations (triggers, constraints)
  await runMigrations();
  
  // Seed equipment catalog with pre-populated items if empty
  await seedEquipmentCatalog();
  
  const server = await registerRoutes(app);

  // Initialize WebSocket hub for real-time permission updates
  wsHub.initialize(server);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
  
  // Index Knowledge Base content on startup (non-blocking)
  indexAllGuides().then(result => {
    log(`[RAG] Knowledge base indexed: ${result.success} guides, ${result.failed} failed`);
  }).catch(err => {
    log(`[RAG] Knowledge base indexing error: ${err.message}`);
  });
  
  // Watch for Guide file changes in development mode
  // Includes both TSX guides and markdown content files for automatic RAG updates
  if (app.get("env") === "development") {
    const watcher = chokidar.watch([
      'client/src/pages/*Guide.tsx',
      'client/src/pages/help/**/*.tsx',
      'server/help-content/**/*.md'
    ], {
      persistent: true,
      ignoreInitial: true,
    });
    
    watcher.on('change', async (filePath) => {
      log(`[RAG] Detected change in ${filePath}, reindexing...`);
      await indexAllGuides();
    });
    
    watcher.on('add', async (filePath) => {
      log(`[RAG] Detected new file ${filePath}, reindexing...`);
      await indexAllGuides();
    });
  }
})();

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Determine which database URL to use based on environment
const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
const databaseUrl = isProduction 
  ? process.env.PRODUCTION_DATABASE_URL 
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  const envName = isProduction ? 'PRODUCTION_DATABASE_URL' : 'DATABASE_URL';
  throw new Error(
    `${envName} must be set. Did you forget to provision a ${isProduction ? 'production' : 'development'} database?`,
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });

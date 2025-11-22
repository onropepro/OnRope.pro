import { db } from "./db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

/**
 * Run SQL migrations from db/migrations directory
 * This ensures database triggers and constraints are applied
 * across all environments (development, production)
 */
export async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), "db", "migrations");
  
  // Check if migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    console.log("No migrations directory found, skipping...");
    return;
  }

  // Get all .sql files in migrations directory
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort(); // Run in alphabetical order

  if (migrationFiles.length === 0) {
    console.log("No migration files found, skipping...");
    return;
  }

  console.log(`Found ${migrationFiles.length} migration(s) to run...`);

  // Run each migration
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const migrationSQL = fs.readFileSync(filePath, "utf-8");
    
    try {
      console.log(`Running migration: ${file}`);
      await db.execute(sql.raw(migrationSQL));
      console.log(`✓ Migration completed: ${file}`);
    } catch (error: any) {
      // If the error is about the trigger/function already existing, that's OK (idempotent)
      if (
        error.message?.includes("already exists") ||
        error.message?.includes("does not exist")
      ) {
        console.log(`⊙ Migration already applied: ${file}`);
      } else {
        console.error(`✗ Migration failed: ${file}`, error);
        throw error;
      }
    }
  }

  console.log("All migrations completed successfully!");
}

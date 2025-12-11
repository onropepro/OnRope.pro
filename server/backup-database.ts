import { db, pool } from "./db";
import * as schema from "@shared/schema";
import { objectStorageClient } from "./objectStorage";

const BACKUP_BUCKET = "replit-objstore-6e6b229a-26f3-44e3-8851-0347a883531e";
const BACKUP_PREFIX = "private/backups/database/";
const MAX_BACKUPS = 28;

interface TableConfig {
  name: string;
  table: any;
}

const tables: TableConfig[] = [
  { name: "sessions", table: schema.sessions },
  { name: "license_keys", table: schema.licenseKeys },
  { name: "users", table: schema.users },
  { name: "buildings", table: schema.buildings },
  { name: "building_instructions", table: schema.buildingInstructions },
  { name: "property_manager_company_links", table: schema.propertyManagerCompanyLinks },
  { name: "clients", table: schema.clients },
  { name: "projects", table: schema.projects },
  { name: "custom_job_types", table: schema.customJobTypes },
  { name: "drop_logs", table: schema.dropLogs },
  { name: "work_sessions", table: schema.workSessions },
  { name: "non_billable_work_sessions", table: schema.nonBillableWorkSessions },
  { name: "gear_items", table: schema.gearItems },
  { name: "equipment_catalog", table: schema.equipmentCatalog },
  { name: "gear_assignments", table: schema.gearAssignments },
  { name: "gear_serial_numbers", table: schema.gearSerialNumbers },
  { name: "equipment_damage_reports", table: schema.equipmentDamageReports },
  { name: "complaints", table: schema.complaints },
  { name: "complaint_notes", table: schema.complaintNotes },
  { name: "project_photos", table: schema.projectPhotos },
  { name: "job_comments", table: schema.jobComments },
  { name: "harness_inspections", table: schema.harnessInspections },
  { name: "toolbox_meetings", table: schema.toolboxMeetings },
  { name: "flha_forms", table: schema.flhaForms },
  { name: "incident_reports", table: schema.incidentReports },
  { name: "method_statements", table: schema.methodStatements },
  { name: "company_documents", table: schema.companyDocuments },
  { name: "pay_period_config", table: schema.payPeriodConfig },
  { name: "pay_periods", table: schema.payPeriods },
  { name: "quotes", table: schema.quotes },
  { name: "quote_services", table: schema.quoteServices },
  { name: "quote_history", table: schema.quoteHistory },
  { name: "scheduled_jobs", table: schema.scheduledJobs },
  { name: "job_assignments", table: schema.jobAssignments },
  { name: "employee_time_off", table: schema.employeeTimeOff },
  { name: "notifications", table: schema.notifications },
  { name: "irata_task_logs", table: schema.irataTaskLogs },
  { name: "historical_hours", table: schema.historicalHours },
  { name: "document_review_signatures", table: schema.documentReviewSignatures },
  { name: "user_preferences", table: schema.userPreferences },
  { name: "feature_requests", table: schema.featureRequests },
  { name: "feature_request_messages", table: schema.featureRequestMessages },
  { name: "mrr_snapshots", table: schema.mrrSnapshots },
  { name: "customer_health_scores", table: schema.customerHealthScores },
  { name: "churn_events", table: schema.churnEvents },
  { name: "superuser_tasks", table: schema.superuserTasks },
  { name: "superuser_task_comments", table: schema.superuserTaskComments },
  { name: "superuser_task_attachments", table: schema.superuserTaskAttachments },
  { name: "team_invitations", table: schema.teamInvitations },
  { name: "technician_employer_connections", table: schema.technicianEmployerConnections },
  { name: "job_postings", table: schema.jobPostings },
  { name: "job_applications", table: schema.jobApplications },
  { name: "future_ideas", table: schema.futureIdeas },
];

async function listExistingBackups(): Promise<string[]> {
  try {
    const bucket = objectStorageClient.bucket(BACKUP_BUCKET);
    const [files] = await bucket.getFiles({ prefix: BACKUP_PREFIX });
    return files
      .map((file) => file.name)
      .filter((name) => name.endsWith(".json"))
      .sort();
  } catch (error) {
    console.error("Error listing backups:", error);
    return [];
  }
}

async function deleteOldBackups(existingBackups: string[]): Promise<void> {
  const backupFolders = new Set<string>();
  for (const backup of existingBackups) {
    const parts = backup.split("/");
    if (parts.length >= 4) {
      backupFolders.add(parts.slice(0, 4).join("/"));
    }
  }

  const sortedFolders = Array.from(backupFolders).sort();

  if (sortedFolders.length <= MAX_BACKUPS) {
    console.log(`Current backup count (${sortedFolders.length}) is within limit (${MAX_BACKUPS})`);
    return;
  }

  const foldersToDelete = sortedFolders.slice(0, sortedFolders.length - MAX_BACKUPS);
  console.log(`Deleting ${foldersToDelete.length} old backup folder(s)...`);

  const bucket = objectStorageClient.bucket(BACKUP_BUCKET);
  for (const folder of foldersToDelete) {
    const filesToDelete = existingBackups.filter((backup) => backup.startsWith(folder));
    for (const fileName of filesToDelete) {
      try {
        await bucket.file(fileName).delete();
        console.log(`Deleted: ${fileName}`);
      } catch (error) {
        console.error(`Error deleting ${fileName}:`, error);
      }
    }
  }
}

async function exportTable(
  tableName: string,
  table: any
): Promise<{ name: string; data: any[]; count: number }> {
  try {
    const data = await db.select().from(table);
    return { name: tableName, data, count: data.length };
  } catch (error) {
    console.error(`CRITICAL: Failed to export table ${tableName}:`, error);
    throw new Error(`Failed to export table "${tableName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function runBackup(): Promise<void> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFolder = `${BACKUP_PREFIX}${timestamp}`;

  console.log("=".repeat(60));
  console.log(`Database Backup Started: ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  try {
    console.log("\nExporting tables...");
    const backupData: Record<string, { count: number; data: any[] }> = {};
    let totalRecords = 0;

    for (const { name, table } of tables) {
      const result = await exportTable(name, table);
      backupData[result.name] = { count: result.count, data: result.data };
      totalRecords += result.count;
      console.log(`  - ${name}: ${result.count} records`);
    }

    const metadata = {
      timestamp: new Date().toISOString(),
      totalTables: tables.length,
      totalRecords,
      tables: Object.entries(backupData).map(([name, { count }]) => ({ name, count })),
    };

    console.log("\nSaving backup to object storage...");

    const bucket = objectStorageClient.bucket(BACKUP_BUCKET);

    const metadataFile = bucket.file(`${backupFolder}/metadata.json`);
    await metadataFile.save(JSON.stringify(metadata, null, 2), {
      metadata: { contentType: "application/json" },
      resumable: false,
    });
    console.log("  - Saved metadata.json");

    const fullBackupFile = bucket.file(`${backupFolder}/full-backup.json`);
    await fullBackupFile.save(JSON.stringify(backupData, null, 2), {
      metadata: { contentType: "application/json" },
      resumable: false,
    });
    console.log("  - Saved full-backup.json");

    console.log("\nRotating old backups...");
    const existingBackups = await listExistingBackups();
    await deleteOldBackups(existingBackups);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n" + "=".repeat(60));
    console.log(`Backup Completed Successfully`);
    console.log(`  - Tables backed up: ${tables.length}`);
    console.log(`  - Total records: ${totalRecords}`);
    console.log(`  - Duration: ${duration}s`);
    console.log(`  - Location: ${backupFolder}`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\nBackup Failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runBackup()
  .then(() => {
    console.log("\nBackup script finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

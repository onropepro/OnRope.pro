import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";

const WORKER_INTERVAL_MS = 30000; // 30 seconds
const BATCH_SIZE = 5; // Process up to 5 photos per cycle

let isRunning = false;
let workerInterval: NodeJS.Timeout | null = null;

async function processPhotoQueue() {
  if (isRunning) {
    console.log("[PhotoWorker] Previous cycle still running, skipping");
    return;
  }
  
  isRunning = true;
  
  try {
    const pendingPhotos = await storage.getPendingPhotoUploads(BATCH_SIZE);
    
    if (pendingPhotos.length === 0) {
      return;
    }
    
    console.log(`[PhotoWorker] Processing ${pendingPhotos.length} queued photo(s)`);
    
    const objectStorageService = new ObjectStorageService();
    
    for (const photo of pendingPhotos) {
      try {
        // Mark as uploading
        await storage.markPhotoUploading(photo.id);
        
        // Decode base64 payload to buffer
        const fileBuffer = Buffer.from(photo.payload, "base64");
        
        // Upload to dedicated resident photos bucket
        const uploadedUrl = await objectStorageService.uploadResidentPhoto(
          photo.objectKey,
          fileBuffer,
          photo.contentType
        );
        
        // Mark as uploaded and update complaint
        await storage.markPhotoUploaded(photo.id, uploadedUrl);
        await storage.updateComplaintPhotoUrl(photo.complaintId, uploadedUrl);
        
        console.log(`[PhotoWorker] Successfully uploaded photo for complaint ${photo.complaintId}`);
      } catch (error: any) {
        const errorMessage = error.message || "Unknown upload error";
        console.error(`[PhotoWorker] Upload failed for ${photo.id}: ${errorMessage}`);
        
        // Increment retry count and schedule next retry
        await storage.incrementPhotoRetry(photo.id, errorMessage);
      }
    }
  } catch (error: any) {
    console.error("[PhotoWorker] Queue processing error:", error.message || error);
  } finally {
    isRunning = false;
  }
}

export function startPhotoUploadWorker(): void {
  if (workerInterval) {
    console.log("[PhotoWorker] Worker already running");
    return;
  }
  
  console.log(`[PhotoWorker] Starting resident photo upload worker (interval: ${WORKER_INTERVAL_MS / 1000}s)`);
  
  // Process immediately on startup
  setTimeout(() => processPhotoQueue(), 5000);
  
  // Then run on interval
  workerInterval = setInterval(processPhotoQueue, WORKER_INTERVAL_MS);
}

export function stopPhotoUploadWorker(): void {
  if (workerInterval) {
    clearInterval(workerInterval);
    workerInterval = null;
    console.log("[PhotoWorker] Worker stopped");
  }
}

export async function runBucketHealthCheck(): Promise<boolean> {
  try {
    const objectStorageService = new ObjectStorageService();
    const health = await objectStorageService.checkResidentPhotosBucketHealth();
    
    if (!health.ok) {
      console.error(
        "[PhotoWorker] HEALTH CHECK FAILED - Resident photos bucket not accessible.\n" +
        `Error: ${health.error}\n` +
        "Action: Verify RESIDENT_PHOTOS_BUCKET env var is set and bucket exists in App Storage."
      );
      return false;
    }
    
    console.log("[PhotoWorker] Health check passed - Resident photos bucket is accessible");
    return true;
  } catch (error: any) {
    console.error(
      "[PhotoWorker] HEALTH CHECK FAILED - Could not verify bucket.\n" +
      `Error: ${error.message}\n` +
      "Action: Check RESIDENT_PHOTOS_BUCKET env var and bucket configuration."
    );
    return false;
  }
}

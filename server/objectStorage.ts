import { Storage, File } from "@google-cloud/storage";
import { Response } from "express";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

// The object storage client is used to interact with the object storage service.
export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// The object storage service is used to interact with the object storage service.
export class ObjectStorageService {
  constructor() {}

  // Gets the public object search paths.
  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }

  // Gets the private object directory.
  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }

  // Search for a public object from the search paths.
  async searchPublicObject(filePath: string): Promise<File | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;

      // Full path format: /<bucket_name>/<object_name>
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);

      // Check if file exists
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }

    return null;
  }

  // Downloads an object to the response.
  async downloadObject(file: File, res: Response, cacheTtlSec: number = 3600) {
    try {
      // Get file metadata
      const [metadata] = await file.getMetadata();
      
      // Set appropriate headers
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });

      // Stream the file to the response
      const stream = file.createReadStream();

      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });

      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  // Upload a file buffer to public storage
  async uploadPublicFile(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const publicPaths = this.getPublicObjectSearchPaths();
    if (publicPaths.length === 0) {
      throw new Error("No public object search paths configured");
    }

    // Use the first public path
    const publicPath = publicPaths[0];
    const fullPath = `${publicPath}/${fileName}`;
    
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);

    // Upload the file (resumable: false for better performance on small files)
    await file.save(fileBuffer, {
      metadata: {
        contentType,
      },
      resumable: false,
    });

    // Return the public URL path
    return `/public-objects/${fileName}`;
  }

  // Upload a file buffer to private storage
  async uploadPrivateFile(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const privateDir = this.getPrivateObjectDir();
    if (!privateDir) {
      throw new Error("No private object directory configured");
    }

    const fullPath = `${privateDir}/${fileName}`;
    
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);

    // Upload the file (resumable: false for better performance on small files)
    await file.save(fileBuffer, {
      metadata: {
        contentType,
      },
      resumable: false,
    });

    // Return the API URL path to access this private file
    return `/api/private-documents/${fileName}`;
  }

  // Get a private file for authenticated download
  async getPrivateFile(fileName: string): Promise<File | null> {
    const privateDir = this.getPrivateObjectDir();
    if (!privateDir) {
      throw new Error("No private object directory configured");
    }

    const fullPath = `${privateDir}/${fileName}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return null;
    }

    return file;
  }

  // Download a public file as a Buffer (for processing like AI quiz generation)
  async downloadPublicFileAsBuffer(fileUrl: string): Promise<Buffer | null> {
    // fileUrl can be:
    // - Relative: "/public-objects/company-documents/..."
    // - Absolute: "https://domain.com/public-objects/company-documents/..."
    const prefix = "/public-objects/";
    
    let filePath: string;
    
    // Handle absolute URLs by extracting path after /public-objects/
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      try {
        const url = new URL(fileUrl);
        const pathname = url.pathname;
        if (!pathname.includes(prefix)) {
          console.error("Invalid absolute URL format - missing /public-objects/:", fileUrl);
          return null;
        }
        const prefixIndex = pathname.indexOf(prefix);
        filePath = pathname.substring(prefixIndex + prefix.length);
      } catch (e) {
        console.error("Failed to parse absolute URL:", fileUrl, e);
        return null;
      }
    } else if (fileUrl.startsWith(prefix)) {
      // Handle relative URLs
      filePath = fileUrl.substring(prefix.length);
    } else {
      console.error("Invalid file URL format:", fileUrl);
      return null;
    }
    
    const file = await this.searchPublicObject(filePath);
    
    if (!file) {
      console.error("File not found in object storage:", filePath);
      return null;
    }
    
    // Download file content as buffer
    const [buffer] = await file.download();
    return buffer;
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return {
    bucketName,
    objectName,
  };
}

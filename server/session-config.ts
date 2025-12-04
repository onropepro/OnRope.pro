if (!process.env.SESSION_SECRET) {
  throw new Error("CRITICAL: SESSION_SECRET environment variable is required for security. Please set it in your environment secrets.");
}

export const SESSION_SECRET = process.env.SESSION_SECRET;
export const SESSION_COOKIE_NAME = "connect.sid";

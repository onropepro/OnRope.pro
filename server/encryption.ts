import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    console.warn('[Encryption] ENCRYPTION_KEY not set - sensitive data will be stored in plaintext');
    return Buffer.alloc(0);
  }
  return Buffer.from(key, 'hex');
}

export function encryptField(plaintext: string | null | undefined): string | null {
  if (!plaintext) return null;
  
  const key = getEncryptionKey();
  if (key.length === 0) {
    return plaintext;
  }
  
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('[Encryption] Failed to encrypt field:', error);
    return plaintext;
  }
}

export function decryptField(ciphertext: string | null | undefined): string | null {
  if (!ciphertext) return null;
  
  const key = getEncryptionKey();
  if (key.length === 0) {
    return ciphertext;
  }
  
  if (!ciphertext.includes(':')) {
    return ciphertext;
  }
  
  try {
    const parts = ciphertext.split(':');
    if (parts.length !== 3) {
      return ciphertext;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[Encryption] Failed to decrypt field:', error);
    return ciphertext;
  }
}

export const SENSITIVE_FIELDS = [
  'socialInsuranceNumber',
  'bankTransitNumber',
  'bankInstitutionNumber',
  'bankAccountNumber',
  'driversLicenseNumber',
  'specialMedicalConditions',
] as const;

export function encryptSensitiveFields<T extends Record<string, any>>(data: T): T {
  const result = { ...data } as Record<string, any>;
  
  for (const field of SENSITIVE_FIELDS) {
    if (field in result && result[field]) {
      result[field] = encryptField(result[field]);
    }
  }
  
  return result as T;
}

export function decryptSensitiveFields<T extends Record<string, any>>(data: T): T {
  const result = { ...data } as Record<string, any>;
  
  for (const field of SENSITIVE_FIELDS) {
    if (field in result && result[field]) {
      result[field] = decryptField(result[field]);
    }
  }
  
  return result as T;
}

export const ENABLE_OAUTH = process.env.ENABLE_OAUTH === 'true';

export const OAUTH_CONFIG = {
  issuerUrl: process.env.ISSUER_URL || 'https://replit.com/oidc',
  clientId: process.env.REPL_ID || '',
  scopes: ['openid', 'email', 'profile', 'offline_access'],
  stateNonceTtlMs: 10 * 60 * 1000,
  callbackPath: '/api/oauth/callback',
  loginPath: '/api/oauth/login',
  logoutPath: '/api/oauth/logout',
};

export const OAUTH_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many OAuth attempts, please try again later' },
};

export const SENSITIVE_LOG_PATTERNS = [
  /code=[^&\s]+/gi,
  /state=[^&\s]+/gi,
  /access_token=[^&\s]+/gi,
  /id_token=[^&\s]+/gi,
  /refresh_token=[^&\s]+/gi,
];

export function scrubSensitiveData(input: string): string {
  let result = input;
  for (const pattern of SENSITIVE_LOG_PATTERNS) {
    result = result.replace(pattern, (match) => {
      const key = match.split('=')[0];
      return `${key}=[REDACTED]`;
    });
  }
  return result;
}

export const ROLE_REDIRECTS: Record<string, string> = {
  company: '/dashboard',
  rope_access_tech: '/technician-portal',
  resident: '/resident',
  property_manager: '/property-manager',
  operations_manager: '/dashboard',
  supervisor: '/dashboard',
  manager: '/dashboard',
  ground_crew: '/technician-portal',
  ground_crew_supervisor: '/technician-portal',
};

export const OAUTH_PLACEHOLDER_PASSWORD_PREFIX = 'OAUTH_PLACEHOLDER_';

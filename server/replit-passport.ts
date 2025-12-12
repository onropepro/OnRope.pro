import * as client from "openid-client";
import type { Express, Request, Response, NextFunction, RequestHandler } from "express";
import { storage } from "./storage";
import { ENABLE_OAUTH, OAUTH_CONFIG, ROLE_REDIRECTS, scrubSensitiveData, OAUTH_PLACEHOLDER_PASSWORD_PREFIX } from "./oauth-config";
import crypto from "crypto";
import bcrypt from "bcrypt";

let openIdConfig: client.Configuration | null = null;

async function getOIDCConfig(): Promise<client.Configuration> {
  if (!openIdConfig) {
    openIdConfig = await client.discovery(
      new URL(OAUTH_CONFIG.issuerUrl),
      OAUTH_CONFIG.clientId,
      undefined
    );
  }
  return openIdConfig;
}

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export async function initializePassport(app: Express): Promise<void> {
  if (!ENABLE_OAUTH) {
    console.log("[OAuth] OAuth is disabled via ENABLE_OAUTH flag");
    return;
  }

  if (!OAUTH_CONFIG.clientId) {
    console.log("[OAuth] REPL_ID not found, OAuth will not be available");
    return;
  }

  try {
    await getOIDCConfig();
    console.log("[OAuth] OpenID Connect configuration loaded successfully");
  } catch (error) {
    console.error("[OAuth] Failed to load OpenID Connect configuration:", error);
    return;
  }
}

export function oauthLoginHandler(): RequestHandler {
  return async (req: Request, res: Response) => {
    if (!ENABLE_OAUTH) {
      return res.status(503).json({ message: "OAuth is not available" });
    }

    try {
      const config = await getOIDCConfig();
      
      const state = generateSecureToken();
      const nonce = generateSecureToken();
      
      req.session.oauthState = state;
      req.session.oauthNonce = nonce;
      req.session.oauthStateCreatedAt = Date.now();
      
      if (req.query.returnUrl && typeof req.query.returnUrl === 'string') {
        req.session.returnUrl = req.query.returnUrl;
      }
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const callbackUrl = `https://${req.get('host')}${OAUTH_CONFIG.callbackPath}`;
      
      const authUrl = client.buildAuthorizationUrl(config, {
        redirect_uri: callbackUrl,
        scope: OAUTH_CONFIG.scopes.join(' '),
        state,
        nonce,
      });

      console.log(`[OAuth] Redirecting to authorization URL (state: ${scrubSensitiveData(`state=${state.substring(0, 8)}...`)})`);
      res.redirect(authUrl.href);
    } catch (error) {
      console.error("[OAuth] Login error:", error);
      res.redirect("/login?error=oauth_init_failed");
    }
  };
}

export function oauthCallbackHandler(): RequestHandler {
  return async (req: Request, res: Response) => {
    if (!ENABLE_OAUTH) {
      return res.status(503).json({ message: "OAuth is not available" });
    }

    try {
      const config = await getOIDCConfig();
      
      const savedState = req.session.oauthState;
      const savedNonce = req.session.oauthNonce;
      const stateCreatedAt = req.session.oauthStateCreatedAt;
      const returnUrl = req.session.returnUrl;
      
      delete req.session.oauthState;
      delete req.session.oauthNonce;
      delete req.session.oauthStateCreatedAt;
      delete req.session.returnUrl;
      
      if (!savedState || !savedNonce) {
        console.error("[OAuth] Missing state or nonce in session");
        return res.redirect("/login?error=oauth_state_missing");
      }
      
      if (stateCreatedAt && Date.now() - stateCreatedAt > OAUTH_CONFIG.stateNonceTtlMs) {
        console.error("[OAuth] State/nonce expired");
        return res.redirect("/login?error=oauth_state_expired");
      }
      
      const callbackUrl = `https://${req.get('host')}${OAUTH_CONFIG.callbackPath}`;
      
      const currentUrl = new URL(`https://${req.get('host')}${req.originalUrl}`);
      const tokens = await client.authorizationCodeGrant(config, currentUrl, {
        expectedState: savedState,
        expectedNonce: savedNonce,
        idTokenExpected: true,
      });
      
      const claims = tokens.claims();
      
      if (!claims || !claims.sub) {
        console.error("[OAuth] Missing claims or subject in token");
        return res.redirect("/login?error=oauth_invalid_token");
      }
      
      const oauthId = claims.sub;
      const email = claims.email as string | undefined;
      const name = claims.name as string | undefined;
      const profileImageUrl = claims.picture as string | undefined;
      
      let user = await storage.getUserByOAuthId(oauthId, 'replit');
      
      if (!user && email) {
        user = await storage.getUserByEmail(email);
        
        if (user) {
          if (user.role === 'superuser') {
            console.error("[OAuth] SuperUser accounts cannot be linked to OAuth");
            return res.redirect("/login?error=oauth_superuser_blocked");
          }
          
          await storage.linkOAuthToUser(user.id, oauthId, 'replit', profileImageUrl);
          console.log(`[OAuth] Linked OAuth to existing user: ${user.id}`);
        }
      }
      
      if (!user) {
        console.log(`[OAuth] No existing user found for OAuth ID: ${oauthId.substring(0, 8)}...`);
        
        req.session.pendingOAuthRegistration = {
          oauthId,
          oauthProvider: 'replit',
          email,
          name,
          profileImageUrl,
        };
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        const registrationUrl = returnUrl?.includes('/technician') 
          ? '/technician-register?oauth=true'
          : '/register?oauth=true';
        
        return res.redirect(registrationUrl);
      }
      
      if (user.isDisabled) {
        console.error("[OAuth] User account is disabled");
        return res.redirect("/login?error=account_disabled");
      }
      
      const oldSessionId = req.sessionID;
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log(`[OAuth] Session regenerated: ${oldSessionId.substring(0, 8)}... -> ${req.sessionID.substring(0, 8)}...`);
      
      req.session.userId = user.id;
      req.session.role = user.role;
      
      if (user.role === 'resident' && user.strataPlanNumber) {
        req.session.strataPlanNumber = user.strataPlanNumber;
      }
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      const redirectPath = returnUrl || ROLE_REDIRECTS[user.role] || '/dashboard';
      console.log(`[OAuth] User ${user.id} logged in successfully, redirecting to ${redirectPath}`);
      res.redirect(redirectPath);
      
    } catch (error) {
      console.error("[OAuth] Callback error:", error);
      res.redirect("/login?error=oauth_callback_failed");
    }
  };
}

export function oauthLogoutHandler(): RequestHandler {
  return async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("[OAuth] Logout error:", err);
      }
      res.redirect("/login");
    });
  };
}

export function isOAuthEnabled(): boolean {
  return ENABLE_OAUTH && !!OAUTH_CONFIG.clientId;
}

export async function createOAuthPlaceholderPassword(): Promise<string> {
  const placeholder = `${OAUTH_PLACEHOLDER_PASSWORD_PREFIX}${crypto.randomBytes(32).toString('hex')}`;
  return await bcrypt.hash(placeholder, 12);
}

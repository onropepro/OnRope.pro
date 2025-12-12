import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import type { Express, RequestHandler, Request, Response, NextFunction } from "express";
import memoize from "memoizee";
import { storage } from "./storage";

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

export async function setupOAuth(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      const claims = tokens.claims();
      const oauthUser = {
        claims,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: claims?.exp,
      };

      const oauthId = claims.sub as string;
      const email = claims.email as string | null;
      const firstName = claims.first_name as string | null;
      const lastName = claims.last_name as string | null;
      const profileImageUrl = claims.profile_image_url as string | null;

      const user = await storage.findOrCreateOAuthUser({
        oauthId,
        email,
        firstName,
        lastName,
        profileImageUrl,
      });

      const sessionUser = {
        ...oauthUser,
        dbUserId: user.id,
        dbUserRole: user.role,
      };

      verified(null, sessionUser);
    } catch (error) {
      console.error("[OAuth] Error in verify callback:", error);
      verified(error as Error);
    }
  };

  const registeredStrategies = new Set<string>();

  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/oauth/callback`,
        },
        verify,
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/oauth/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/oauth/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      failureRedirect: "/login?error=oauth_failed",
    })(req, res, (err: any) => {
      if (err) {
        console.error("[OAuth] Callback error:", err);
        return res.redirect("/login?error=oauth_failed");
      }

      const passportUser = req.user as any;
      if (!passportUser?.dbUserId || !passportUser?.dbUserRole) {
        console.error("[OAuth] Missing user data after authentication");
        return res.redirect("/login?error=oauth_failed");
      }

      req.session.userId = passportUser.dbUserId;
      req.session.role = passportUser.dbUserRole;

      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("[OAuth] Session save error:", saveErr);
          return res.redirect("/login?error=session_error");
        }

        const role = passportUser.dbUserRole;
        let redirectPath = "/";

        if (role === "company") {
          redirectPath = "/dashboard";
        } else if (role === "rope_access_tech") {
          redirectPath = "/technician-portal";
        } else if (role === "resident") {
          redirectPath = "/resident";
        } else if (role === "property_manager") {
          redirectPath = "/property-manager";
        }

        res.redirect(redirectPath);
      });
    });
  });

  app.get("/api/oauth/logout", (req, res) => {
    req.logout(() => {
      req.session.destroy((err) => {
        if (err) {
          console.error("[OAuth] Session destroy error:", err);
        }
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href;
        res.redirect("/");
      });
    });
  });
}

export const isOAuthAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return next();
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return next();
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    console.error("[OAuth] Token refresh failed:", error);
    return next();
  }
};

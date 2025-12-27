import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import type { IncomingMessage } from 'http';
import { pool } from './db';
import cookie from 'cookie';
import cookieSignature from 'cookie-signature';
import { SESSION_SECRET, SESSION_COOKIE_NAME } from './session-config';

class WebSocketHub {
  private wss: WebSocketServer | null = null;
  private connections: Map<string, Set<WebSocket>> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
      try {
        // Parse session cookie to authenticate the connection
        const cookies = cookie.parse(req.headers.cookie || '');
        const sessionCookie = cookies[SESSION_COOKIE_NAME];
        
        if (!sessionCookie) {
          console.log('WebSocket connection rejected: No session cookie');
          ws.close(1008, 'Authentication required');
          return;
        }

        // Decode URL-encoded cookie value and verify the signature
        // Cookie format: s%3A<sessionId>.<signature> (URL-encoded "s:" prefix)
        const decodedCookie = decodeURIComponent(sessionCookie);
        
        // Check for signed cookie prefix (s:)
        if (!decodedCookie.startsWith('s:')) {
          console.log('WebSocket connection rejected: Unsigned session cookie');
          ws.close(1008, 'Invalid session');
          return;
        }
        
        // Remove the "s:" prefix and verify the signature
        const signedValue = decodedCookie.slice(2);
        const sessionId = cookieSignature.unsign(signedValue, SESSION_SECRET);
        
        if (sessionId === false) {
          console.log('WebSocket connection rejected: Invalid session signature');
          ws.close(1008, 'Invalid session signature');
          return;
        }

        // Verify session exists in database, is not expired, and get userId
        const result = await pool.query(
          'SELECT sess, expire FROM sessions WHERE sid = $1',
          [sessionId]
        );

        if (result.rows.length === 0) {
          console.log('WebSocket connection rejected: Session not found');
          ws.close(1008, 'Session expired');
          return;
        }

        const { sess: sessionData, expire } = result.rows[0];
        
        // Check if session has expired
        if (expire && new Date(expire) < new Date()) {
          console.log('WebSocket connection rejected: Session expired');
          ws.close(1008, 'Session expired');
          return;
        }
        
        const userId = sessionData?.userId;

        if (!userId) {
          console.log('WebSocket connection rejected: No userId in session');
          ws.close(1008, 'Not authenticated');
          return;
        }

        // Successfully authenticated - register the connection
        if (!this.connections.has(userId)) {
          this.connections.set(userId, new Set());
        }
        this.connections.get(userId)!.add(ws);
        console.log(`WebSocket connected for user ${userId}`);

        ws.on('close', () => {
          const userConnections = this.connections.get(userId);
          if (userConnections) {
            userConnections.delete(ws);
            if (userConnections.size === 0) {
              this.connections.delete(userId);
            }
          }
          console.log(`WebSocket disconnected for user ${userId}`);
        });

        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
        });
      } catch (error) {
        console.error('WebSocket authentication error:', error);
        ws.close(1008, 'Authentication failed');
      }
    });

    console.log('WebSocket hub initialized');
  }

  notifyPermissionsUpdated(userId: string) {
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      const message = JSON.stringify({ type: 'permissions:updated' });
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  notifyUserTerminated(userId: string) {
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      const message = JSON.stringify({ type: 'user:terminated' });
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
          ws.close(1000, 'Account terminated');
        }
      });
      this.connections.delete(userId);
    }
  }

  async invalidateUserSessions(userId: string) {
    try {
      await pool.query(
        `DELETE FROM sessions WHERE sess->>'userId' = $1`,
        [userId]
      );
      console.log(`Invalidated sessions for user ${userId}`);
    } catch (error) {
      console.error('Error invalidating sessions:', error);
    }
  }

  async terminateUser(userId: string) {
    this.notifyUserTerminated(userId);
    await this.invalidateUserSessions(userId);
  }

  async updateUserPermissions(userId: string) {
    this.notifyPermissionsUpdated(userId);
    await this.invalidateUserSessions(userId);
  }

  // Notify user that their historical hours have been updated (added/deleted)
  // This enables real-time sync across multiple devices
  notifyHistoricalHoursUpdated(userId: string) {
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      const message = JSON.stringify({ type: 'historical-hours:updated' });
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
      console.log(`WebSocket: Notified user ${userId} of historical hours update`);
    }
  }

  // Notify technician that their access to a specific company has been suspended
  // This does NOT logout the technician - they can still access their portal
  notifyEmployerSuspension(userId: string, companyId: string, companyName: string) {
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      const message = JSON.stringify({ 
        type: 'employer:suspended',
        companyId,
        companyName,
        message: `Your access to ${companyName} has been suspended.`
      });
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  // Notify property manager when a new quote is linked to them
  notifyQuoteCreated(propertyManagerId: string, quote: {
    id: string;
    quoteNumber: string | null;
    buildingName: string | null;
    strataPlanNumber: string | null;
    status: string;
    grandTotal: string | null;
    createdAt: Date | string;
    companyName: string | null;
  }) {
    const userConnections = this.connections.get(propertyManagerId);
    if (userConnections) {
      const message = JSON.stringify({ 
        type: 'quote:created',
        quote
      });
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
      console.log(`WebSocket: Notified property manager ${propertyManagerId} of new quote ${quote.quoteNumber}`);
    }
  }

  // Notify company when a quote is accepted by property manager
  notifyQuoteAccepted(companyId: string, quote: {
    id: string;
    quoteNumber: string | null;
    buildingName: string | null;
    strataPlanNumber: string | null;
    propertyManagerName: string | null;
  }) {
    const userConnections = this.connections.get(companyId);
    if (userConnections) {
      const message = JSON.stringify({ 
        type: 'quote:accepted',
        quote
      });
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
      console.log(`WebSocket: Notified company ${companyId} that quote ${quote.quoteNumber} was accepted`);
    }
  }

  // Notify company when a quote is declined by property manager
  notifyQuoteDeclined(companyId: string, quote: {
    id: string;
    quoteNumber: string | null;
    buildingName: string | null;
    strataPlanNumber: string | null;
    propertyManagerName: string | null;
    reason: string | null;
  }) {
    const userConnections = this.connections.get(companyId);
    if (userConnections) {
      const message = JSON.stringify({ 
        type: 'quote:declined',
        quote
      });
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
      console.log(`WebSocket: Notified company ${companyId} that quote ${quote.quoteNumber} was declined`);
    }
  }

  // Notify company when a property manager submits a counter-offer
  notifyQuoteCounterOffer(companyId: string, quote: {
    id: string;
    quoteNumber: string | null;
    buildingName: string | null;
    strataPlanNumber: string | null;
    propertyManagerName: string | null;
    counterOfferAmount: string;
  }) {
    const userConnections = this.connections.get(companyId);
    if (userConnections) {
      const message = JSON.stringify({ 
        type: 'quote:counter_offer',
        quote
      });
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
      console.log(`WebSocket: Notified company ${companyId} that quote ${quote.quoteNumber} received a counter-offer`);
    }
  }
}

export const wsHub = new WebSocketHub();

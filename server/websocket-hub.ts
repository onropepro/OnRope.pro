import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import type { IncomingMessage } from 'http';
import { pool } from './db';

interface UserConnection {
  userId: string;
  ws: WebSocket;
}

class WebSocketHub {
  private wss: WebSocketServer | null = null;
  private connections: Map<string, Set<WebSocket>> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');
      
      if (!userId) {
        ws.close(1008, 'User ID required');
        return;
      }

      if (!this.connections.has(userId)) {
        this.connections.set(userId, new Set());
      }
      this.connections.get(userId)!.add(ws);

      ws.on('close', () => {
        const userConnections = this.connections.get(userId);
        if (userConnections) {
          userConnections.delete(ws);
          if (userConnections.size === 0) {
            this.connections.delete(userId);
          }
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
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
}

export const wsHub = new WebSocketHub();

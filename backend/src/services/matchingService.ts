import { Socket } from 'socket.io';

export interface User {
  socket: Socket;
  userId: string;
  mode: string;
  scenario?: string; // Scenario for roleplay mode
  interests?: string[];
  country?: string;
}

class MatchingService {
  private queue: User[] = [];

  constructor() {}

  public addToQueue(user: User) {
    // Remove if already in queue
    this.removeFromQueue(user.socket.id);
    this.queue.push(user);
    console.log(`[MatchingService] User added to queue. Mode: ${user.mode}, Scenario: ${user.scenario || 'N/A'}. Queue size: ${this.queue.length}`);
    return this.tryMatch(user.mode, user.scenario);
  }

  public removeFromQueue(socketId: string) {
    const initialLength = this.queue.length;
    this.queue = this.queue.filter((u) => u.socket.id !== socketId);
    if (this.queue.length !== initialLength) {
      console.log(`[MatchingService] User removed from queue. Queue size: ${this.queue.length}`);
    }
  }

  public tryMatch(mode: string, scenario?: string): { user1: User; user2: User } | null {
    // Find potential partners with the same mode (and scenario if roleplay)
    // We filter then take the top two. 
    // Optimization: This could be called in a loop or handle multiple matches, 
    // but the current caller (addToQueue) expects one match or null.
    // Let's improve it to at least be more robust.

    const potentialUsers = this.queue.filter(u => 
      u.mode === mode && (mode !== 'roleplay' || u.scenario === scenario)
    );

    if (potentialUsers.length < 2) return null;

    const user1 = potentialUsers[0];
    const user2 = potentialUsers[1];

    // Double check they are still in the main queue (to avoid race conditions)
    const idx1 = this.queue.findIndex(u => u.socket.id === user1.socket.id);
    const idx2 = this.queue.findIndex(u => u.socket.id === user2.socket.id);

    if (idx1 === -1 || idx2 === -1) {
      console.warn(`[MatchingService] Race condition detected: users no longer in queue.`);
      return null;
    }

    // Remove them from the main queue
    this.removeFromQueue(user1.socket.id);
    this.removeFromQueue(user2.socket.id);

    console.log(`[MatchingService] Match found in mode "${mode}"${scenario ? ` for scenario "${scenario}"` : ""}: ${user1.socket.id} & ${user2.socket.id}`);
    return { user1, user2 };
  }

  public getQueueSize(): number {
    return this.queue.length;
  }
}

export const matchingService = new MatchingService();

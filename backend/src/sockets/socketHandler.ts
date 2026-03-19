import { Server, Socket } from 'socket.io';
import { matchingService, User } from '../services/matchingService';
import { db, auth } from '../config/firebase';
import { roomService } from '../services/RoomService';

const activeMatches = new Map<string, string>(); // socketId -> partnerSocketId
const socketToUser = new Map<string, any>(); // socketId -> userData
const matchSessions = new Map<string, { startTime: number; user1Id: string; user2Id: string }>();

export const setupSocketHandlers = (io: Server) => {
  const safeHandler = (socket: Socket, eventName: string, handler: (...args: any[]) => Promise<void> | void) => {
    return async (...args: any[]) => {
      try {
        await handler(...args);
      } catch (err) {
        console.error(`[Socket Error] Event "${eventName}" on socket ${socket.id}:`, err);
        socket.emit('error', { message: 'Internal server error' });
      }
    };
  };

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    socket.on('register', safeHandler(socket, 'register', async (userData: { userId: string; token?: string; level?: string; goal?: string; [key: string]: any }) => {
      let verifiedUserId = userData.userId;

      // Verify token if provided
      if (userData.token && auth) {
        const decodedToken = await auth.verifyIdToken(userData.token);
        verifiedUserId = decodedToken.uid;
        console.log(`[Socket] Token verified for user: ${verifiedUserId}`);
      }

      socketToUser.set(socket.id, { ...userData, userId: verifiedUserId });
      
      // Store user in Firestore if not exists
      if (db) {
        const userRef = db.collection('users').doc(verifiedUserId);
        const doc = await userRef.get();
        if (!doc.exists) {
          await userRef.set({
            id: verifiedUserId,
            level: userData.level || 'beginner',
            goal: userData.goal || 'general',
            isAnonymous: !userData.token,
            createdAt: new Date().toISOString(),
          });
          console.log(`[Firestore] New user created: ${verifiedUserId} (Anon: ${!userData.token})`);
        }
      }
      
      console.log(`[Socket] User registered: ${verifiedUserId}`);
    }));

    socket.on('join_queue', safeHandler(socket, 'join_queue', (data: { userId: string; mode?: string; scenario?: string; interests?: string[] }) => {
      const user: User = {
        socket,
        userId: data.userId,
        mode: data.mode || 'normal',
        scenario: data.scenario,
        interests: data.interests || [],
      };

      const match = matchingService.addToQueue(user);

      if (match) {
        const { user1, user2 } = match;
        
        activeMatches.set(user1.socket.id, user2.socket.id);
        activeMatches.set(user2.socket.id, user1.socket.id);

        const sessionId = `session_${Date.now()}_${user1.userId}_${user2.userId}`;
        matchSessions.set(user1.socket.id, { startTime: Date.now(), user1Id: user1.userId, user2Id: user2.userId });
        matchSessions.set(user2.socket.id, { startTime: Date.now(), user1Id: user1.userId, user2Id: user2.userId });

        // For roleplay, assign roles A and B
        const role1 = Math.random() > 0.5 ? 'A' : 'B';
        const role2 = role1 === 'A' ? 'B' : 'A';

        user1.socket.emit('match_found', { 
          initiator: true, 
          partnerId: user2.userId, 
          mode: user.mode,
          scenario: user.scenario,
          role: role1 
        });
        user2.socket.emit('match_found', { 
          initiator: false, 
          partnerId: user1.userId, 
          mode: user.mode,
          scenario: user.scenario,
          role: role2 
        });

        console.log(`[Match] Pair created: ${user1.socket.id} <-> ${user2.socket.id} (Mode: ${user.mode}, Scenario: ${user.scenario || 'N/A'})`);
      }
    }));

    // WebRTC Signaling
    socket.on('webrtc_offer', safeHandler(socket, 'webrtc_offer', (data: any) => {
      const partnerId = activeMatches.get(socket.id);
      if (partnerId) {
        console.log(`[Signaling] Offer: ${socket.id} -> ${partnerId}`);
        io.to(partnerId).emit('webrtc_offer', data);
      }
    }));

    socket.on('webrtc_answer', safeHandler(socket, 'webrtc_answer', (data: any) => {
      const partnerId = activeMatches.get(socket.id);
      if (partnerId) {
        console.log(`[Signaling] Answer: ${socket.id} -> ${partnerId}`);
        io.to(partnerId).emit('webrtc_answer', data);
      }
    }));

    socket.on('webrtc_ice_candidate', safeHandler(socket, 'webrtc_ice_candidate', (data: any) => {
      const partnerId = activeMatches.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('webrtc_ice_candidate', data);
      }
    }));

    // Chat Message Relay
    socket.on('chat-message', safeHandler(socket, 'chat-message', (data: any) => {
      const partnerId = activeMatches.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('chat-message', data);
      }
    }));

    // Typing Status Relay
    socket.on('typing-start', safeHandler(socket, 'typing-start', (data: any) => {
      const partnerId = activeMatches.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('typing-start', data);
      }
    }));

    socket.on('typing-stop', safeHandler(socket, 'typing-stop', (data: any) => {
      const partnerId = activeMatches.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('typing-stop', data);
      }
    }));

    // Reaction Relay
    socket.on('reaction', safeHandler(socket, 'reaction', (data: any) => {
      const partnerId = activeMatches.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('reaction', data);
      }
    }));

    // Identity Broadcast (Custom Name & Country)
    socket.on('identity', safeHandler(socket, 'identity', (data: any) => {
      const partnerId = activeMatches.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('identity', data);
      }
    }));

    socket.on('next', safeHandler(socket, 'next', () => {
      handleDisconnectFromPartner(socket, io);
      
      // Auto re-queue for MVP when 'next' is clicked
      const userData = socketToUser.get(socket.id);
      if (userData) {
        const user: User = {
          socket,
          userId: userData.userId,
          mode: userData.mode || 'normal',
        };
        matchingService.addToQueue(user);
        socket.emit('ready_for_next');
        console.log(`[Socket] User ${socket.id} re-queued after 'next'`);
      }
    }));

    socket.on('disconnect', safeHandler(socket, 'disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
      handleDisconnectFromPartner(socket, io);
      matchingService.removeFromQueue(socket.id);
      
      // SpeakRooms disconnect
      const { room, promotedUser } = roomService.leaveRoom(socket);
      if (room) {
        io.to(room.id).emit('sr_room_update', room);
        if (promotedUser) {
          io.to(promotedUser.socketId).emit('sr_joined_active', { roomId: room.id });
          console.log(`[SpeakRooms] User ${promotedUser.socketId} promoted to active in room ${room.id}`);
        }
      }

      socketToUser.delete(socket.id);
    }));

    // --- SpeakRooms Handlers ---
    socket.on('sr_join_topic', safeHandler(socket, 'sr_join_topic', (data: { topicId: string; userId: string; username: string; avatar: string }) => {
      const room = roomService.joinTopic(socket, data.topicId, data);
      io.to(room.id).emit('sr_room_update', room);
      console.log(`[SpeakRooms] User ${socket.id} joined room ${room.id} for topic ${data.topicId}`);
    }));

    socket.on('sr_leave', safeHandler(socket, 'sr_leave', () => {
      const { room, promotedUser } = roomService.leaveRoom(socket);
      if (room) {
        io.to(room.id).emit('sr_room_update', room);
        if (promotedUser) {
          io.to(promotedUser.socketId).emit('sr_joined_active', { roomId: room.id });
        }
      }
    }));

    socket.on('sr_send_message', safeHandler(socket, 'sr_send_message', (data: { text: string; userId: string; username: string; avatar: string }) => {
      const roomId = Array.from(socket.rooms).find(r => r.startsWith('room_'));
      if (roomId) {
        socket.to(roomId).emit('sr_receive_message', {
          id: Math.random().toString(36).substring(7),
          ...data,
          timestamp: Date.now()
        });
      }
    }));

    socket.on('sr_typing', safeHandler(socket, 'sr_typing', (isTyping: boolean) => {
      const room = roomService.setTyping(socket.id, isTyping);
      if (room) {
        io.to(room.id).emit('sr_room_update', room);
      }
    }));

    socket.on('sr_join_spectator', safeHandler(socket, 'sr_join_spectator', (data: { topicId: string; userId: string; username: string; avatar: string }) => {
      const room = roomService.joinQueue(socket, data.topicId, data);
      io.to(room.id).emit('sr_room_update', room);
    }));

    // Friend Request Logic
    socket.on('send_friend_request', safeHandler(socket, 'send_friend_request', (data: { targetUserId: string }) => {
      const senderData = socketToUser.get(socket.id);
      if (!senderData) return;

      // Find target user's socket
      for (const [sId, userData] of socketToUser.entries()) {
        if (userData.userId === data.targetUserId) {
          io.to(sId).emit('friend_request_received', { 
            fromUserId: senderData.userId, 
            fromUsername: senderData.username || senderData.displayName || 'Learner' 
          });
          console.log(`[FriendRequest] Sent from ${senderData.userId} to ${data.targetUserId}`);
          break;
        }
      }
    }));

    socket.on('accept_friend_request', safeHandler(socket, 'accept_friend_request', (data: { targetUserId: string }) => {
      const accepterData = socketToUser.get(socket.id);
      if (!accepterData) return;

      // Find target user's socket to notify them
      for (const [sId, userData] of socketToUser.entries()) {
        if (userData.userId === data.targetUserId) {
          io.to(sId).emit('friend_request_accepted', { friendId: accepterData.userId });
          console.log(`[FriendRequest] Accepted by ${accepterData.userId} (notified ${data.targetUserId})`);
          break;
        }
      }
    }));
  });
};

const handleDisconnectFromPartner = async (socket: Socket, io: Server) => {
  const partnerId = activeMatches.get(socket.id);
  const session = matchSessions.get(socket.id);

  if (session && db) {
    const duration = Math.floor((Date.now() - session.startTime) / 1000);
    try {
      await db.collection('sessions').add({
        user1: session.user1Id,
        user2: session.user2Id,
        duration,
        createdAt: new Date().toISOString(),
      });
      console.log(`[Firestore] Session saved for ${session.user1Id} & ${session.user2Id} (${duration}s)`);
    } catch (err) {
      console.warn(`[Firestore] Could not save session: ${err}`);
    }
    matchSessions.delete(socket.id);
    if (partnerId) matchSessions.delete(partnerId);
  }

  if (partnerId) {
    io.to(partnerId).emit('partner_disconnected');
    activeMatches.delete(partnerId);
    activeMatches.delete(socket.id);
  }
};

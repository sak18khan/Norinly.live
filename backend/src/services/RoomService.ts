import { Socket } from 'socket.io';

export interface Topic {
  id: string;
  title: string;
  category: 'Daily' | 'Debate' | 'Fun' | 'Roleplay';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface RoomUser {
  socketId: string;
  userId: string;
  username: string;
  avatar: string;
  isTyping: boolean;
  isSpectator: boolean;
}

export interface SpeakRoom {
  id: string;
  topicId: string;
  users: RoomUser[];
  queue: { socketId: string; userId: string; username: string; avatar: string }[];
}

class RoomService {
  private rooms: Map<string, SpeakRoom> = new Map(); // roomId -> Room
  private topicToRooms: Map<string, string[]> = new Map(); // topicId -> roomId[]
  private socketToRoom: Map<string, string> = new Map(); // socketId -> roomId

  constructor() {
    // Initial mock rooms will be created as users join
  }

  public joinTopic(socket: Socket, topicId: string, userData: { userId: string; username: string; avatar: string }) {
    // Check if user is already in a room
    this.leaveRoom(socket);

    let roomIds = this.topicToRooms.get(topicId) || [];
    let targetRoom: SpeakRoom | null = null;

    // Find a room with space
    for (const rid of roomIds) {
      const room = this.rooms.get(rid);
      if (room && room.users.filter(u => !u.isSpectator).length < 4) {
        targetRoom = room;
        break;
      }
    }

    if (!targetRoom) {
      // Create new room
      const roomId = `room_${topicId}_${Date.now()}`;
      targetRoom = {
        id: roomId,
        topicId: topicId,
        users: [],
        queue: []
      };
      this.rooms.set(roomId, targetRoom);
      roomIds.push(roomId);
      this.topicToRooms.set(topicId, roomIds);
    }

    // Add user to room
    const roomUser: RoomUser = {
      ...userData,
      socketId: socket.id,
      isTyping: false,
      isSpectator: false
    };

    targetRoom.users.push(roomUser);
    this.socketToRoom.set(socket.id, targetRoom.id);
    socket.join(targetRoom.id);

    return targetRoom;
  }

  public joinQueue(socket: Socket, topicId: string, userData: { userId: string; username: string; avatar: string }) {
     // Join as spectator or just queue
     // For now, if room is full, they go to queue of the first room of that topic
     let roomIds = this.topicToRooms.get(topicId) || [];
     if (roomIds.length === 0) {
        return this.joinTopic(socket, topicId, userData);
     }

     const firstRoom = this.rooms.get(roomIds[0])!;
     firstRoom.queue.push({ ...userData, socketId: socket.id });
     this.socketToRoom.set(socket.id, firstRoom.id);
     socket.join(firstRoom.id);
     
     return firstRoom;
  }

  public leaveRoom(socket: Socket): { room: SpeakRoom | null; promotedUser?: RoomUser } {
    const roomId = this.socketToRoom.get(socket.id);
    if (!roomId) return { room: null };

    const room = this.rooms.get(roomId);
    if (!room) return { room: null };

    // Remove from users or queue
    room.users = room.users.filter(u => u.socketId !== socket.id);
    room.queue = room.queue.filter(q => q.socketId !== socket.id);
    this.socketToRoom.delete(socket.id);
    socket.leave(roomId);

    let promotedUser: RoomUser | undefined = undefined;

    // If room has space, pull from queue
    if (room.users.filter(u => !u.isSpectator).length < 4 && room.queue.length > 0) {
      const nextUser = room.queue.shift()!;
      promotedUser = {
        ...nextUser,
        isTyping: false,
        isSpectator: false
      };
      room.users.push(promotedUser);
    }

    return { room, promotedUser };
  }

  public getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  public setTyping(socketId: string, isTyping: boolean) {
    const roomId = this.socketToRoom.get(socketId);
    if (!roomId) return;
    const room = this.rooms.get(roomId);
    if (!room) return;
    const user = room.users.find(u => u.socketId === socketId);
    if (user) user.isTyping = isTyping;
    return room;
  }
}

export const roomService = new RoomService();

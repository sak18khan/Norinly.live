import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, auth } from './firebase';
import axios from 'axios';



dotenv.config();

const app = express();

// CORS: use ALLOWED_ORIGIN env var in production, fallback to '*' for local dev
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST']
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://norinly.live",
            "https://Norinly.live",
            "http://localhost:3000"
        ],
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    pingInterval: 10000,
    pingTimeout: 5000
});

const PORT = process.env.PORT || 5000;

interface QueueUser {
    socket: Socket;
    userId: string;
    interests: string[];
    country: string;
    mode: string;
}

// Matchmaking state
let waitingUsers: QueueUser[] = [];
let isMatching = false;

// Rooms state Map<socketId, roomId>
const activeRooms = new Map<string, string>();
const roomStartTimes = new Map<string, number>(); // roomId -> startTime

// User sessions mapping
const connectedUsers = new Map<string, Socket>(); // userId -> Socket
const socketToUserId = new Map<string, string>(); // socket.id -> userId
const socketToCountry = new Map<string, { countryName: string, countryCode: string }>(); // socket.id -> countryInfo

// Reconnect window mapping: userId -> { partnerId, expiresAt }
const recentSessions = new Map<string, { partnerId: string, expiresAt: number }>();

// Cleanup expired sessions every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [userId, session] of recentSessions.entries()) {
        if (session.expiresAt <= now) {
            recentSessions.delete(userId);
        }
    }
}, 300000);

// Moderation Map (In-memory fallback + Firestore)
const bannedIPs = new Set<string>();
const bannedUUIDs = new Set<string>();

// Banned words filter
const BANNED_WORDS = ['badword1', 'badword2', 'spamlink.com'];
const filterMessage = (text: string): string => {
    let filtered = text;
    BANNED_WORDS.forEach(word => {
        const regex = new RegExp(word, 'gi');
        filtered = filtered.replace(regex, '***');
    });
    return filtered;
};

// Pre-load bans from Firestore
const loadBans = async () => {
    try {
        if (db) {
            const ipSnapshot = await db.collection('banned_ips').get();
            ipSnapshot.forEach(doc => bannedIPs.add(doc.id));

            const uuidSnapshot = await db.collection('banned_uuids').get();
            uuidSnapshot.forEach(doc => bannedUUIDs.add(doc.id));

            console.log(`Loaded ${bannedIPs.size} banned IPs and ${bannedUUIDs.size} banned UUIDs.`);
        }
    } catch (error) {
        console.warn("Firestore not available or not configured for bans yet.", error);
    }
};
loadBans();

app.get('/', (req, res) => {
    res.send('Norinly signaling server is running');
});

const emitLiveCount = () => {
    io.emit('live_users_count', io.engine.clientsCount);
};

const processQueue = async () => {
    if (isMatching || waitingUsers.length < 2) return;
    isMatching = true;

    try {
        while (waitingUsers.length >= 2) {
            // Find a match for the first user
            const user1 = waitingUsers[0];
            let bestMatchIndex = -1;
            let bestScore = -1;

            for (let i = 1; i < waitingUsers.length; i++) {
                const user2 = waitingUsers[i];

                // Skip if socket disconnected
                if (!user2.socket.connected) continue;

                // Mode match - fundamental requirement
                if (user1.mode !== user2.mode) continue;

                let score = 0;
                // Country match
                if (user1.country && user2.country && user1.country === user2.country) {
                    score += 10;
                }
                // Interest match
                const sharedInterests = user1.interests.filter((i: string) => user2.interests.includes(i));
                score += sharedInterests.length;

                if (score > bestScore) {
                    bestScore = score;
                    bestMatchIndex = i;
                }
            }

            if (bestMatchIndex !== -1) {
                // We have a match
                const user2 = waitingUsers[bestMatchIndex];

                // Remove both from queue
                waitingUsers.splice(bestMatchIndex, 1);
                waitingUsers.splice(0, 1); // user1 was at index 0

                const roomId = `room_${user1.socket.id}_${user2.socket.id}`;
                user1.socket.join(roomId);
                user2.socket.join(roomId);

                activeRooms.set(user1.socket.id, roomId);
                activeRooms.set(user2.socket.id, roomId);
                roomStartTimes.set(roomId, Date.now());

                console.log(`[MATCH] Matched ${user1.socket.id} with ${user2.socket.id} in room ${roomId} (Score: ${bestScore})`);

                user1.socket.emit('match_found', { initiator: true, partnerId: user2.userId });
                user2.socket.emit('match_found', { initiator: false, partnerId: user1.userId });

                // Emit country info
                const user1Country = socketToCountry.get(user1.socket.id) || { countryName: 'Unknown location', countryCode: '' };
                const user2Country = socketToCountry.get(user2.socket.id) || { countryName: 'Unknown location', countryCode: '' };
                user1.socket.emit('user-country', user2Country);
                user2.socket.emit('user-country', user1Country);

                // Auto-start debate if mode is debate
                if (user1.mode === 'debate') {
                    const DEBATE_TOPICS = [
                        'Android vs iPhone', 'Remote work vs Office', 'Coffee vs Tea',
                        'Cats vs Dogs', 'Summer vs Winter', 'Fiction vs Non-fiction',
                        'Space exploration is worth it', 'Books vs E-books'
                    ];
                    const randomTopic = DEBATE_TOPICS[Math.floor(Math.random() * DEBATE_TOPICS.length)];
                    const initiatorIndex = Math.floor(Math.random() * 2);
                    const firstSpeakerId = initiatorIndex === 0 ? user1.userId : user2.userId;

                    io.to(roomId).emit('debate_start', {
                        topic: randomTopic,
                        firstSpeakerId: firstSpeakerId
                    });
                }
            } else {
                // Should always find a match since score > -1 for any user, but break just in case
                break;
            }
        }
    } finally {
        isMatching = false;
        // Clean up any disconnected users left in queue
        waitingUsers = waitingUsers.filter(u => u.socket.connected);
    }
};

io.on('connection', (socket) => {
    console.log(`[CONNECT] User connected: ${socket.id} (total clients: ${io.engine.clientsCount})`);

    // Initial emission when this user connects
    emitLiveCount();

    socket.on('register', (data: { userId: string }) => {
        if (!data || !data.userId) return;

        const userIp = (socket.handshake.headers['x-forwarded-for'] as string)?.split(',')[0] || socket.handshake.address;
        if (bannedIPs.has(userIp) || bannedUUIDs.has(data.userId)) {
            socket.emit('banned', { reason: 'You have been banned due to multiple reports.' });
            socket.disconnect();
            return;
        }

        connectedUsers.set(data.userId, socket);
        socketToUserId.set(socket.id, data.userId);

    });

    socket.on('join_queue', async (data: { userId: string, interests?: string[], country?: string, mode?: string }) => {
        const userIp = (socket.handshake.headers['x-forwarded-for'] as string)?.split(',')[0] || socket.handshake.address;
        const userId = data?.userId || socket.id;
        const mode = data?.mode || 'normal';

        if (bannedIPs.has(userIp) || bannedUUIDs.has(userId)) {
            socket.emit('banned', { reason: 'You have been banned due to multiple reports.' });
            return;
        }

        if (activeRooms.has(socket.id)) return;

        // Ensure user is registered
        if (data && data.userId) {
            connectedUsers.set(data.userId, socket);
            socketToUserId.set(socket.id, data.userId);
        }

        const interests = data?.interests || [];

        // Accurate Geolocation via ipapi.co
        let countryInfo = { countryName: 'Unknown location', countryCode: '' };
        try {
            const cleanIp = userIp === '::1' || userIp === '127.0.0.1' ? '' : userIp;
            const res = await axios.get(`https://ipapi.co/${cleanIp}/json/`, { timeout: 3000 });
            if (res.data && !res.data.error) {
                countryInfo = {
                    countryName: res.data.country_name,
                    countryCode: res.data.country_code
                };
            }
        } catch (err) {
            console.error('IP Geolocation failed:', err);
        }

        // Remove from queue if already there to avoid duplicates
        waitingUsers = waitingUsers.filter(u => u.socket.id !== socket.id);

        waitingUsers.push({ socket, userId, interests, country: countryInfo.countryName, mode });
        socketToCountry.set(socket.id, countryInfo);

        console.log(`[QUEUE] User joined queue: ${socket.id} (userId: ${userId}, mode: ${mode}, country: ${countryInfo.countryName}, queue size: ${waitingUsers.length})`);
        processQueue();
    });


    socket.on('join_private_room', (data: { userId: string, inviteCode: string }) => {
        const roomId = `private_${data.inviteCode}`;
        socket.join(roomId);
        activeRooms.set(socket.id, roomId);
        if (!roomStartTimes.has(roomId)) roomStartTimes.set(roomId, Date.now());

        connectedUsers.set(data.userId, socket);
        socketToUserId.set(socket.id, data.userId);

        console.log(`User ${socket.id} joined private room: ${roomId}`);

        // Check if there's someone else in the room
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        if (roomSockets && roomSockets.size >= 2) {
            // Found a match in private room
            const roomArray = Array.from(roomSockets);
            const partnerSocketId = roomArray.find(sid => sid !== socket.id);
            if (partnerSocketId) {
                const partnerUserId = socketToUserId.get(partnerSocketId);
                socket.emit('match_found', { initiator: true, partnerId: partnerUserId });
                io.to(partnerSocketId).emit('match_found', { initiator: false, partnerId: data.userId });
            }
        }
    });


    socket.on('reconnect_request', ({ targetUserId, myUserId }) => {
        const session = recentSessions.get(myUserId);

        // Verify session exists, target matches, and hasn't expired (120s window)
        if (session && session.partnerId === targetUserId && session.expiresAt > Date.now()) {
            const targetSocket = connectedUsers.get(targetUserId);
            if (targetSocket && targetSocket.connected && !activeRooms.has(targetSocket.id) && !activeRooms.has(socket.id)) {
                // Check if target is in queue and remove them
                waitingUsers = waitingUsers.filter(u => u.socket.id !== targetSocket.id);
                waitingUsers = waitingUsers.filter(u => u.socket.id !== socket.id);

                const roomId = `room_${socket.id}_${targetSocket.id}`;
                socket.join(roomId);
                targetSocket.join(roomId);

                activeRooms.set(socket.id, roomId);
                activeRooms.set(targetSocket.id, roomId);

                console.log(`Reconnected ${socket.id} with ${targetSocket.id}`);

                socket.emit('match_found', { initiator: true, partnerId: targetUserId });
                targetSocket.emit('match_found', { initiator: false, partnerId: myUserId });

                // Emit country info
                const myCountry = socketToCountry.get(socket.id) || { countryName: 'Unknown location', countryCode: '' };
                const partnerCountry = socketToCountry.get(targetSocket.id) || { countryName: 'Unknown location', countryCode: '' };
                socket.emit('user-country', partnerCountry);
                targetSocket.emit('user-country', myCountry);




                // Clear session map
                recentSessions.delete(myUserId);
                recentSessions.delete(targetUserId);
                roomStartTimes.set(roomId, Date.now());
            } else {
                // Target unavailable
                socket.emit('reconnect_failed');
            }
        } else {
            // Expired or invalid
            recentSessions.delete(myUserId);
            socket.emit('reconnect_failed');
        }
    });

    socket.on('next_stranger', () => {
        console.log(`[QUEUE] User ${socket.id} pressed Next Stranger`);
        leaveRoomAndNotifyPartner(socket);
    });

    // WebRTC Signaling
    socket.on('webrtc_offer', (data) => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            console.log(`[WebRTC] Offer relayed from ${socket.id} in room ${roomId}`);
            socket.to(roomId).emit('webrtc_offer', data);
        }
    });

    socket.on('webrtc_answer', (data) => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            console.log(`[WebRTC] Answer relayed from ${socket.id} in room ${roomId}`);
            socket.to(roomId).emit('webrtc_answer', data);
        }
    });

    socket.on('webrtc_ice_candidate', (data) => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            console.log(`[WebRTC] ICE candidate relayed from ${socket.id}`);
            socket.to(roomId).emit('webrtc_ice_candidate', data);
        }
    });

    // Chat Messaging
    socket.on('chat-message', (message: string) => {
        if (!message || typeof message !== 'string') return;
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            const filteredMessage = filterMessage(message);
            socket.to(roomId).emit('chat-message', filteredMessage);
        }
    });

    socket.on('typing-start', () => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            socket.to(roomId).emit('typing-start');
        }
    });

    socket.on('typing-stop', () => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            socket.to(roomId).emit('typing-stop');
        }
    });

    socket.on('reaction', (emoji: string) => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            socket.to(roomId).emit('reaction', emoji);
        }
    });

    socket.on('reveal-country', async () => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            // Find the partner in this room
            const roomSockets = io.sockets.adapter.rooms.get(roomId);
            let partnerSocketId = '';
            if (roomSockets) {
                for (const sid of roomSockets) {
                    if (sid !== socket.id) partnerSocketId = sid;
                }
            }

            if (partnerSocketId) {
                const partnerCountry = socketToCountry.get(partnerSocketId) || { countryName: 'Unknown location', countryCode: '' };
                socket.emit('partner-country-revealed', partnerCountry);
            }


        }
    });

    socket.on('partner_left_cleanup', () => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            socket.leave(roomId);
            activeRooms.delete(socket.id);
            // We don't delete roomStartTimes here, leaveRoomAndNotifyPartner handles it
        }
    });

    // Helper functions
    async function saveChatHistory(userId: string, partnerId: string, startTime: number) {
        if (!db) return;
        const duration = Math.floor((Date.now() - startTime) / 1000);
        if (duration < 60) return;

        try {
            // Get partner username
            const partnerDoc = await db.collection('users').doc(partnerId).get();
            const partnerUsername = partnerDoc.exists ? partnerDoc.data()?.username : 'Anonymous Stranger';

            await db.collection('users').doc(userId).collection('history').add({
                partnerId,
                partnerUsername,
                startTime: new Date(startTime),
                duration,
                createdAt: new Date()
            });
            console.log(`Saved history for user ${userId} (duration: ${duration}s)`);
        } catch (err) {
            console.error('Error saving chat history:', err);
        }
    }

    // Moderation
    socket.on('report_user', async () => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            // Find the partner in this room
            const roomSockets = io.sockets.adapter.rooms.get(roomId);
            let partnerSocketId = '';
            if (roomSockets) {
                for (const sid of roomSockets) {
                    if (sid !== socket.id) partnerSocketId = sid;
                }
            }

            if (partnerSocketId) {
                const partnerSocket = io.sockets.sockets.get(partnerSocketId);
                const partnerUserId = socketToUserId.get(partnerSocketId);

                if (partnerSocket && partnerUserId) {
                    const partnerIp = partnerSocket.handshake.address;

                    try {
                        let currentReports = 0;
                        if (db) {
                            const reportRef = db.collection('reports').doc(partnerUserId); // Keying reports by UUID is safer
                            const doc = await reportRef.get();
                            if (doc.exists) {
                                currentReports = doc.data()?.count || 0;
                            }
                            currentReports += 1;
                            await reportRef.set({ count: currentReports, lastReported: new Date(), ip: partnerIp }, { merge: true });
                        } else {
                            // Fallback behavior
                            currentReports += 1;
                        }

                        console.log(`User ${socket.id} reported User ${partnerUserId} / IP ${partnerIp} (Total reports: ${currentReports})`);

                        if (currentReports >= 3) {
                            bannedIPs.add(partnerIp);
                            bannedUUIDs.add(partnerUserId);

                            if (db) {
                                await db.collection('banned_ips').doc(partnerIp).set({ bannedAt: new Date(), reason: 'Reported' });
                                await db.collection('banned_uuids').doc(partnerUserId).set({ bannedAt: new Date(), reason: 'Reported' });
                            }

                            console.log(`User ${partnerUserId} and IP ${partnerIp} have been banned.`);
                            partnerSocket.emit('banned', { reason: 'You have been banned due to multiple reports.' });
                            partnerSocket.disconnect();
                        }
                    } catch (error) {
                        console.error("Error handling report", error);
                    }
                }
            }

            leaveRoomAndNotifyPartner(socket);
        }
    });

    socket.on('disconnect', () => {
        leaveRoomAndNotifyPartner(socket);
        waitingUsers = waitingUsers.filter(u => u.socket.id !== socket.id);

        const userId = socketToUserId.get(socket.id);
        if (userId) {
            connectedUsers.delete(userId);
            socketToUserId.delete(socket.id);
            socketToCountry.delete(socket.id);
        }

        console.log(`[DISCONNECT] User disconnected: ${socket.id} (queue size: ${waitingUsers.length})`);
        emitLiveCount();
    });

    // Friend System
    socket.on('send_friend_request', async () => {
        const roomId = activeRooms.get(socket.id);
        if (!roomId) return;

        const myUserId = socketToUserId.get(socket.id);
        if (!myUserId) return;

        try {
            const myDoc = await db?.collection('users').doc(myUserId).get();
            if (!myDoc?.exists) {
                socket.emit('auth_required', { action: 'add_friend' });
                return;
            }

            // Find partner
            const roomSockets = io.sockets.adapter.rooms.get(roomId);
            let partnerSocketId = '';
            let partnerUserId: string | null = null;
            if (roomSockets) {
                for (const sid of roomSockets) {
                    if (sid !== socket.id) {
                        partnerSocketId = sid;
                        partnerUserId = socketToUserId.get(sid) || null;
                    }
                }
            }

            if (partnerUserId && db) {
                const requestRef = db.collection('users').doc(partnerUserId).collection('friendRequests').doc(myUserId);
                await requestRef.set({
                    fromUserId: myUserId,
                    fromUsername: myDoc.data()?.username || 'Stranger',
                    status: 'pending',
                    createdAt: new Date()
                });
            }

            if (partnerSocketId) {
                const partnerSocket = io.sockets.sockets.get(partnerSocketId);
                if (partnerSocket && partnerUserId) {
                    partnerSocket.emit('friend_request_received', {
                        fromUserId: myUserId,
                        fromUsername: myDoc.data()?.username || 'Stranger'
                    });
                    console.log(`Friend request from ${myUserId} to ${partnerUserId}`);
                }
            }
        } catch (error) {
            console.error("Error sending friend request", error);
        }
    });

    socket.on('accept_friend_request', async ({ fromUserId }: { fromUserId: string }) => {
        const myUserId = socketToUserId.get(socket.id);
        if (!myUserId || !fromUserId) return;

        try {
            if (db) {
                const batch = db.batch();
                const myFriendRef = db.collection('users').doc(myUserId).collection('friends').doc(fromUserId);
                const theirFriendRef = db.collection('users').doc(fromUserId).collection('friends').doc(myUserId);
                const requestRef = db.collection('users').doc(myUserId).collection('friendRequests').doc(fromUserId);

                batch.set(myFriendRef, { status: 'accepted', addedAt: new Date() });
                batch.set(theirFriendRef, { status: 'accepted', addedAt: new Date() });
                batch.delete(requestRef);

                await batch.commit();

                // Notify both if online
                socket.emit('friend_request_accepted', { friendId: fromUserId });
                const partnerSocket = connectedUsers.get(fromUserId);
                if (partnerSocket) {
                    partnerSocket.emit('friend_request_accepted', { friendId: myUserId });
                }
            }
        } catch (error) {
            console.error("Error accepting friend request", error);
        }
    });

    socket.on('get_friends_list', async () => {
        const myUserId = socketToUserId.get(socket.id);
        if (!myUserId) return;

        try {
            if (db) {
                const friendsSnapshot = await db.collection('users').doc(myUserId).collection('friends').get();
                const friends: { id: string, username: string, status: string, lastSeen: any }[] = [];

                for (const doc of friendsSnapshot.docs) {
                    const friendId = doc.id;
                    const friendDoc = await db.collection('users').doc(friendId).get();
                    if (friendDoc.exists) {
                        const friendData = friendDoc.data();
                        const isOnline = connectedUsers.has(friendId);
                        friends.push({
                            id: friendId,
                            username: friendData?.username || 'Unknown',
                            status: isOnline ? 'online' : 'offline',
                            lastSeen: friendData?.lastSeen || null
                        });
                    }
                }
                socket.emit('friends_list', friends);
            }
        } catch (error) {
            console.error("Error getting friends list", error);
        }
    });

    // Debate Mode
    socket.on('debate_offer', () => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            socket.to(roomId).emit('debate_offered', { from: socketToUserId.get(socket.id) });
        }
    });

    socket.on('debate_accept', (data: { topic: string }) => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            // Pick a random initiator (who starts speaking in Round 1)
            const roomSockets = io.sockets.adapter.rooms.get(roomId);
            const socketsArray = roomSockets ? Array.from(roomSockets) : [];
            const initiatorIndex = Math.floor(Math.random() * socketsArray.length);
            const firstSpeakerId = socketsArray[initiatorIndex];

            io.to(roomId).emit('debate_start', {
                topic: data.topic,
                firstSpeakerId: socketToUserId.get(firstSpeakerId)
            });
        }
    });

    socket.on('debate_state_sync', (data: any) => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            socket.to(roomId).emit('debate_state_updated', data);
        }
    });

    socket.on('debate_vote', (data: { winnerId: string | null }) => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            socket.to(roomId).emit('debate_vote_received', { from: socketToUserId.get(socket.id), winnerId: data.winnerId });
        }
    });

    socket.on('debate_exit', () => {
        const roomId = activeRooms.get(socket.id);
        if (roomId) {
            io.to(roomId).emit('debate_ended');
        }
    });

    function leaveRoomAndNotifyPartner(s: Socket) {
        const roomId = activeRooms.get(s.id);
        if (roomId) {
            const userId = socketToUserId.get(s.id);
            let partnerUserId: string | null = null;

            // Find partner userId
            for (const [sid, rId] of activeRooms.entries()) {
                if (rId === roomId && sid !== s.id) {
                    partnerUserId = socketToUserId.get(sid) || null;
                    break;
                }
            }

            // Save recent session for both users to allow reconnect within 120s
            if (userId && partnerUserId) {
                const expiresAt = Date.now() + 120000; // 120 seconds
                recentSessions.set(userId, { partnerId: partnerUserId, expiresAt });
                recentSessions.set(partnerUserId, { partnerId: userId, expiresAt });
            }

            s.to(roomId).emit('partner_disconnected');
            s.leave(roomId);
            activeRooms.delete(s.id);

            // Handle history saving
            const startTime = roomStartTimes.get(roomId);
            if (startTime) {
                if (userId && partnerUserId) {
                    saveChatHistory(userId, partnerUserId, startTime);
                    // Also save for the partner if they are still connected
                    // The partner will eventually call this too or disconnect
                }
                // Room is fully empty when both leave, but we can clean up the startTime if one person leaves
                // Actually, let's only clean up when the room is empty from adapter
                const roomSockets = io.sockets.adapter.rooms.get(roomId);
                if (!roomSockets || roomSockets.size === 0) {
                    roomStartTimes.delete(roomId);
                }
            }
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { auth, db as fdb } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import AuthModal from '@/components/AuthModal';

export type ConnectionStatus = 'idle' | 'searching' | 'connected' | 'error' | 'disconnected';

export interface Message {
    id: string;
    sender: 'me' | 'stranger';
    text: string;
    timestamp: number;
}

export type DebateStatusType = 'idle' | 'offered' | 'accepted' | 'active' | 'voting' | 'finished';

export interface DebateData {
    status: DebateStatusType;
    topic: string | null;
    round: number;
    turn: 'me' | 'stranger' | null;
    timeLeft: number;
    isInitiator: boolean;
    votes: { me: string | null, stranger: string | null };
    winner: string | null;
}

interface ChatContextProps {
    status: ConnectionStatus;
    liveUsers: number;
    isMuted: boolean;
    micDenied: boolean;
    partnerId: string | null;
    partnerCountry: { countryName: string, countryCode: string } | null;
    lastPartnerId: string | null;

    connectionStartTime: number | null;
    messages: Message[];
    isStrangerTyping: boolean;
    isRemoteSpeaking: boolean;
    activeReactions: Array<{ id: string, emoji: string }>;
    activeFilter: string;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    localAudioRef: React.RefObject<HTMLAudioElement | null>;
    remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
    requestMicrophoneAndJoin: (interests: string[], country: string) => Promise<void>;
    handleMute: () => void;
    handleNext: () => void;
    handleEnd: () => void;
    handleReconnect: () => void;
    handleReport: () => void;
    sendMessage: (text: string) => void;
    sendTyping: (isTyping: boolean) => void;
    sendReaction: (emoji: string) => void;
    sendSystemMessage: (text: string) => void;
    revealCountry: () => void;
    setActiveFilter: (filter: string) => void;
    cleanupConnection: () => void;
    currentUser: User | null;
    logout: () => Promise<void>;
    sendFriendRequest: () => void;
    acceptFriendRequest: (fromUserId: string) => void;
    friends: any[];
    showAuthModal: boolean;
    setShowAuthModal: (show: boolean) => void;
    joinPrivateRoom: (inviteCode: string) => Promise<void>;

    // Debate Mode
    debateData: DebateData;
    offerDebate: () => void;
    acceptDebate: (topic: string) => void;
    rejectDebate: () => void;
    sendDebateAction: (action: any) => void;
    voteDebate: (winnerId: string | null) => void;
    exitDebate: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<ConnectionStatus>('idle');
    const [liveUsers, setLiveUsers] = useState<number>(0);
    const [isMuted, setIsMuted] = useState(false);
    const [micDenied, setMicDenied] = useState(false);

    const [partnerId, setPartnerId] = useState<string | null>(null);
    const [partnerCountry, setPartnerCountry] = useState<{ countryName: string, countryCode: string } | null>(null);
    const [lastPartnerId, setLastPartnerId] = useState<string | null>(null);

    const [connectionStartTime, setConnectionStartTime] = useState<number | null>(null);

    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStrangerTyping, setIsStrangerTyping] = useState(false);
    const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false);
    const [activeReactions, setActiveReactions] = useState<Array<{ id: string, emoji: string }>>([]);
    const [activeFilter, setActiveFilter] = useState<string>('none');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [friends, setFriends] = useState<any[]>([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingFriendRequest, setPendingFriendRequest] = useState<any>(null);

    // Debate State
    const [debateData, setDebateData] = useState<DebateData>({
        status: 'idle',
        topic: null,
        round: 1,
        turn: null,
        timeLeft: 0,
        isInitiator: false,
        votes: { me: null, stranger: null },
        winner: null
    });

    // Search parameters
    const searchParamsRef = useRef<{ interests: string[], country: string }>({ interests: [], country: '' });

    // Media Refs
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Audio analysis refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const remoteAnalyserRef = useRef<AnalyserNode | null>(null);
    const remoteDataArrayRef = useRef<Uint8Array | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // WebRTC & Socket refs
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const negotiationInProgressRef = useRef(false);
    const answerCreatedRef = useRef(false);
    const currentPartnerRef = useRef<string | null>(null);
    const listenersSetUpRef = useRef(false);

    useEffect(() => {
        currentPartnerRef.current = partnerId;
    }, [partnerId]);

    // General background socket just to get live user count when idle on homepage
    useEffect(() => {
        if (status === 'idle') {
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
                transports: ['websocket'],
            });
            socket.on('live_users_count', (count: number) => {
                setLiveUsers(count);
            });
            return () => {
                socket.disconnect();
            };
        }
    }, [status]);

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                // Update last seen
                updateDoc(doc(fdb, 'users', user.uid), {
                    lastSeen: new Date()
                }).catch(console.error);

                // Re-register with back-end if socket is active
                if (socketRef.current?.connected) {
                    socketRef.current.emit('register', { userId: user.uid });
                }
            }
        });
        return () => unsubscribe();
    }, []);

    // Awkward Silence Helper (Feature 6) & Streak Logic (Feature 5)
    useEffect(() => {
        if (status !== 'connected' || !connectionStartTime) return;

        const suggestions = [
            "Ask them what music they like",
            "Ask where they are from",
            "Ask their favorite movie",
            "Ask what they do for fun",
            "Ask what country they want to visit"
        ];

        let streakSent = false;

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - connectionStartTime;

            // Streak check (3 minutes)
            if (elapsed >= 180000 && !streakSent) {
                sendSystemMessage("🔥 You've been talking for 3 minutes! Great conversation!");
                streakSent = true;
            }
        }, 1000);

        // Individual timeout for silence to avoid spamming
        const silenceTimer = setTimeout(() => {
            if (!isRemoteSpeaking && !isStrangerTyping) {
                const now = Date.now();
                const lastMsgTime = messages.length > 0 ? messages[messages.length - 1].timestamp : connectionStartTime;
                if (now - lastMsgTime >= 15000) {
                    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                    sendSystemMessage(`Conversation idea: ${randomSuggestion}`);
                }
            }
        }, 15000);

        return () => {
            clearInterval(interval);
            clearTimeout(silenceTimer);
        }
    }, [messages.length, isRemoteSpeaking, isStrangerTyping, status, connectionStartTime]);


    const setupSocketListeners = () => {
        if (!socketRef.current) return;
        // Guard against duplicate listener attachment
        if (listenersSetUpRef.current) return;
        listenersSetUpRef.current = true;

        socketRef.current.on('live_users_count', (count) => {
            setLiveUsers(count);
        });

        socketRef.current.on('match_found', async ({ initiator, partnerId }) => {
            console.log('Match found!', initiator, partnerId);
            setPartnerId(partnerId);
            setPartnerCountry(null);
            setConnectionStartTime(Date.now());
            setMessages([]);
            setIsStrangerTyping(false);
            setStatus('connected');
            setupWebRTC(initiator);
        });

        socketRef.current.on('chat-message', (text: string) => {
            setMessages(prev => [...prev, {
                id: Math.random().toString(36).substring(7),
                sender: 'stranger',
                text,
                timestamp: Date.now()
            }]);
        });

        socketRef.current.on('typing-start', () => setIsStrangerTyping(true));
        socketRef.current.on('typing-stop', () => setIsStrangerTyping(false));

        socketRef.current.on('reaction', (emoji: string) => {
            const id = Math.random().toString(36).substring(7);
            setActiveReactions(prev => [...prev, { id, emoji }]);
            setTimeout(() => {
                setActiveReactions(prev => prev.filter(r => r.id !== id));
            }, 2000);
        });

        socketRef.current.on('user-country', (data: { countryName: string, countryCode: string }) => {
            setPartnerCountry(data);
        });

        socketRef.current.on('partner-country-revealed', (data: { countryName: string, countryCode: string }) => {
            const getFlag = (code: string) => {
                if (!code) return '🌍';
                return code.toUpperCase().replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
            };
            sendSystemMessage(`Stranger is from ${getFlag(data.countryCode)} ${data.countryName}`);
            setPartnerCountry(data);
        });


        socketRef.current.on('webrtc_offer', async (offer) => {
            if (!peerConnectionRef.current) return;

            // Check if we already created an answer for this session
            if (answerCreatedRef.current) {
                console.warn('Answer already created for this session, ignoring duplicate offer');
                return;
            }

            // Check if we are already in the process of negotiating or if state is not stable
            if (negotiationInProgressRef.current || peerConnectionRef.current.signalingState !== 'stable') {
                console.warn('Received offer but signaling state is not stable or negotiation in progress', peerConnectionRef.current.signalingState);
                return;
            }

            try {
                negotiationInProgressRef.current = true;
                answerCreatedRef.current = true; // Set flag that answer is being created
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socketRef.current?.emit('webrtc_answer', answer);
            } catch (e) {
                console.error('Error handling webrtc_offer', e);
                answerCreatedRef.current = false; // Reset if it failed
            } finally {
                negotiationInProgressRef.current = false;
            }
        });

        socketRef.current.on('webrtc_answer', async (answer) => {
            if (!peerConnectionRef.current) return;

            // Only process answer if we have sent an offer and are waiting for one
            if (peerConnectionRef.current.signalingState !== 'have-local-offer') {
                console.warn('Received answer but signaling state is not have-local-offer', peerConnectionRef.current.signalingState);
                return;
            }

            try {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (e) {
                console.error('Error handling webrtc_answer', e);
            }
        });

        socketRef.current.on('webrtc_ice_candidate', async (candidate) => {
            if (!peerConnectionRef.current || !peerConnectionRef.current.remoteDescription) return;
            try {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        });

        socketRef.current.on('partner_disconnected', () => {
            cleanupWebRTC();
            setLastPartnerId(currentPartnerRef.current);
            setPartnerId(null);
            setPartnerCountry(null);
            setConnectionStartTime(null);
            setIsStrangerTyping(false);
            setStatus('disconnected');
        });

        socketRef.current.on('reconnect_failed', () => {
            sendSystemMessage('Could not reconnect. The stranger might be offline or already in another chat.');
            setStatus('disconnected');
        });

        socketRef.current.on('banned', ({ reason }) => {
            alert(reason || 'You have been banned.');
            cleanupConnection();
            window.location.href = '/';
        });

        socketRef.current.on('auth_required', () => setShowAuthModal(true));

        socketRef.current.on('friend_request_received', ({ fromUserId, fromUsername }) => {
            setPendingFriendRequest({ fromUserId, fromUsername });
        });

        socketRef.current.on('friend_request_accepted', ({ friendId }) => {
            sendSystemMessage(`You and your partner are now friends!`);
            socketRef.current?.emit('get_friends_list');
        });

        socketRef.current.on('friends_list', (list) => setFriends(list));

        // Debate Socket Listeners
        socketRef.current.on('debate_offered', ({ from }) => {
            setDebateData(prev => ({ ...prev, status: 'offered' }));
        });

        socketRef.current.on('debate_start', ({ topic, firstSpeakerId }) => {
            const isMeFirst = firstSpeakerId === (currentUser?.uid || localStorage.getItem('norinly_user_id'));
            setDebateData({
                status: 'active',
                topic,
                round: 1,
                turn: isMeFirst ? 'me' : 'stranger',
                timeLeft: 30, // Round 1 starts with 30s
                isInitiator: isMeFirst,
                votes: { me: null, stranger: null },
                winner: null
            });
            sendSystemMessage(`Debate started! Topic: ${topic}`);
        });

        socketRef.current.on('debate_state_updated', (data) => {
            setDebateData(prev => ({ ...prev, ...data }));
        });

        socketRef.current.on('debate_vote_received', ({ from, winnerId }) => {
            setDebateData(prev => ({
                ...prev,
                votes: { ...prev.votes, stranger: winnerId }
            }));
        });

        socketRef.current.on('debate_ended', () => {
            setDebateData(prev => ({ ...prev, status: 'idle', turn: null }));
            // Re-enable mic if it was disabled by debate
            if (localStreamRef.current) {
                localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !isMuted);
            }
        });
    };

    const requestMicrophoneAndJoin = async (interests: string[], country: string) => {
        searchParamsRef.current = { interests, country };
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            setMicDenied(false);
            localStreamRef.current = stream;
            if (localAudioRef.current) localAudioRef.current.srcObject = stream;

            setupVisualizer(stream);
            connectToSignalingServer();
        } catch (err) {
            console.error('Error accessing microphone', err);
            setMicDenied(true);
            setStatus('error');
        }
    };

    const emitJoinQueue = () => {
        const userId = currentUser?.uid || localStorage.getItem('norinly_user_id') || crypto.randomUUID();
        if (!currentUser) localStorage.setItem('norinly_user_id', userId);

        const { interests, country } = searchParamsRef.current;

        socketRef.current?.emit('register', { userId });
        socketRef.current?.emit('join_queue', { userId, interests, country });
        // NOTE: setupSocketListeners is called once by connectToSignalingServer, not here, to prevent duplicate listeners
    };

    // Debate Logic Effect
    useEffect(() => {
        if (debateData.status !== 'active') return;

        let interval: NodeJS.Timeout;

        // Automatically handle mic tracks based on turn
        if (localStreamRef.current) {
            const isMyTurn = debateData.turn === 'me';
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = isMyTurn && !isMuted;
            });
        }

        if (debateData.turn === 'me') {
            interval = setInterval(() => {
                setDebateData(prev => {
                    if (prev.timeLeft <= 1) {
                        clearInterval(interval);
                        handleTurnEnd(prev);
                        return { ...prev, timeLeft: 0 };
                    }
                    const newData = { ...prev, timeLeft: prev.timeLeft - 1 };
                    // Sync every 5 seconds to prevent drift, or keep it local and sync on turn end
                    if (newData.timeLeft % 5 === 0) {
                        socketRef.current?.emit('debate_state_sync', { timeLeft: newData.timeLeft });
                    }
                    return newData;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [debateData.status, debateData.turn, debateData.round, isMuted]);

    const handleTurnEnd = (currentDebate: DebateData) => {
        if (currentDebate.turn !== 'me') return;

        // Transitions logic
        let nextTurn: 'me' | 'stranger' = 'stranger';
        let nextRound = currentDebate.round;
        let nextTime = 0;

        if (!currentDebate.isInitiator) {
            // Second speaker finished, move to next round
            nextRound++;
            if (nextRound > 3) {
                // Debate finished
                const finalData = { status: 'voting' as DebateStatusType, turn: null, timeLeft: 0 };
                setDebateData(prev => ({ ...prev, ...finalData }));
                socketRef.current?.emit('debate_state_sync', finalData);
                return;
            }
            // Transition countdown
            sendSystemMessage(`Round ${nextRound} starting...`);
        }

        // Determine next time based on new round/turn
        const times = [30, 45, 60];
        nextTime = times[nextRound - 1];

        const syncData = {
            round: nextRound,
            turn: nextTurn,
            timeLeft: nextTime,
            isInitiator: !currentDebate.isInitiator // Swap role for turn tracking logic
        };

        setDebateData(prev => ({ ...prev, ...syncData }));
        socketRef.current?.emit('debate_state_sync', syncData);
    };

    const offerDebate = () => {
        socketRef.current?.emit('debate_offer');
        setDebateData(prev => ({ ...prev, status: 'offered' }));
    };

    const acceptDebate = (topic: string) => {
        socketRef.current?.emit('debate_accept', { topic });
    };

    const rejectDebate = () => {
        setDebateData(prev => ({ ...prev, status: 'idle' }));
    };

    const voteDebate = (winnerId: string | null) => {
        setDebateData(prev => {
            const newVotes = { ...prev.votes, me: winnerId };
            let finalWinner = prev.winner;

            // If both voted, calculate results
            if (newVotes.stranger !== null || newVotes.me !== null) {
                if (newVotes.me === newVotes.stranger && newVotes.me !== null) {
                    finalWinner = newVotes.me;
                } else if (newVotes.stranger !== null && newVotes.me !== null) {
                    finalWinner = 'draw';
                }
            }

            const updated = { ...prev, votes: newVotes, winner: finalWinner };
            if (finalWinner) {
                updated.status = 'finished' as DebateStatusType;

                // Update stats in Firebase if logged in
                if (currentUser && finalWinner) {
                    const userRef = doc(fdb, 'users', currentUser.uid);
                    const isWin = finalWinner === 'me';
                    const isDraw = finalWinner === 'draw';
                    const isLoss = finalWinner === 'stranger';

                    let points = 5; // Participation
                    if (isWin) points += 50;
                    else if (isDraw) points += 20;

                    updateDoc(userRef, {
                        debatePoints: increment(points),
                        debatesWon: increment(isWin ? 1 : 0),
                        debatesLost: increment(isLoss ? 1 : 0),
                        debatesDraw: increment(isDraw ? 1 : 0)
                    }).catch(console.error);
                }
            }
            return updated;
        });
        socketRef.current?.emit('debate_vote', { winnerId });
    };

    const exitDebate = () => {
        socketRef.current?.emit('debate_exit');
        setDebateData(prev => ({ ...prev, status: 'idle', turn: null }));
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !isMuted);
        }
    };

    const sendDebateAction = (action: any) => {
        socketRef.current?.emit('debate_state_sync', action);
    };

    const connectToSignalingServer = () => {
        setStatus('searching');
        listenersSetUpRef.current = false; // Reset guard so listeners can be attached to new socket
        socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
            transports: ['websocket'],
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to signaling server');
            emitJoinQueue();
        });

        setupSocketListeners();
    };

    const joinPrivateRoom = async (inviteCode: string) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            setMicDenied(false);
            localStreamRef.current = stream;
            if (localAudioRef.current) localAudioRef.current.srcObject = stream;

            setupVisualizer(stream);

            setStatus('searching');
            socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
                transports: ['websocket'],
            });

            socketRef.current.on('connect', () => {
                const userId = currentUser?.uid || localStorage.getItem('norinly_user_id') || crypto.randomUUID();
                socketRef.current?.emit('register', { userId });
                socketRef.current?.emit('join_private_room', { userId, inviteCode });
            });

            setupSocketListeners();
        } catch (err) {
            console.error('Error joining private room', err);
            setMicDenied(true);
            setStatus('error');
        }
    };

    const setupWebRTC = async (initiator: boolean) => {
        cleanupWebRTC();
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;
        negotiationInProgressRef.current = false;
        answerCreatedRef.current = false;

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current!);
            });
        }

        pc.ontrack = (event) => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
                remoteAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            remoteStreamRef.current = event.streams[0];
            setupRemoteAudioAnalysis(event.streams[0]);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('webrtc_ice_candidate', event.candidate);
            }
        };

        if (initiator) {
            try {
                // Guard: only create offer if in stable state
                if (pc.signalingState !== 'stable') {
                    console.warn('Cannot create offer: signalingState is not stable:', pc.signalingState);
                    return;
                }
                const offer = await pc.createOffer();
                if (pc.signalingState !== 'stable') return; // Re-check after async gap
                await pc.setLocalDescription(offer);
                socketRef.current?.emit('webrtc_offer', offer);
            } catch (e) {
                console.error('Error creating offer:', e);
            }
        }
    };

    const cleanupWebRTC = () => {
        if (peerConnectionRef.current) {
            // Safely close: remove event handlers first to prevent stale callbacks
            peerConnectionRef.current.ontrack = null;
            peerConnectionRef.current.onicecandidate = null;
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        negotiationInProgressRef.current = false;
        answerCreatedRef.current = false;
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }
    };

    const cleanupConnection = () => {
        cleanupWebRTC();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.error);
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
        }
        if (socketRef.current) socketRef.current.disconnect();

        setStatus('idle');
        setPartnerId(null);
        setPartnerCountry(null);
        setConnectionStartTime(null);
        setIsRemoteSpeaking(false);
        setActiveFilter('none');
    };

    const setupRemoteAudioAnalysis = (stream: MediaStream) => {
        if (!audioContextRef.current) return;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        remoteAnalyserRef.current = analyser;
        remoteDataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    };

    const setupVisualizer = (stream: MediaStream) => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }

        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const filterNode = audioCtx.createBiquadFilter();
        const gainNode = audioCtx.createGain();

        source.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(analyser);

        (audioCtx as any).filterNode = filterNode;
        (audioCtx as any).gainNode = gainNode;

        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        updateFilterEffect(activeFilter);
        drawVisualizer();
    };

    const drawVisualizer = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;

        if (!canvas || !analyser || !dataArray) {
            animationFrameRef.current = requestAnimationFrame(drawVisualizer);
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            animationFrameRef.current = requestAnimationFrame(drawVisualizer);
            return;
        }

        animationFrameRef.current = requestAnimationFrame(drawVisualizer);

        if (remoteAnalyserRef.current && remoteDataArrayRef.current) {
            remoteAnalyserRef.current.getByteFrequencyData(remoteDataArrayRef.current as unknown as Uint8Array<ArrayBuffer>);
            const average = remoteDataArrayRef.current.reduce((a, b) => a + b) / remoteDataArrayRef.current.length;
            setIsRemoteSpeaking(average > 30);
        }

        analyser.getByteFrequencyData(dataArray as any);

        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            barHeight = dataArray[i];
            const r = barHeight + (25 * (i / dataArray.length));
            const g = 100 + (25 * (i / dataArray.length));
            const b = 250;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
    };

    const updateFilterEffect = (filter: string) => {
        const ctx = audioContextRef.current;
        if (!ctx || !(ctx as any).filterNode) return;
        const filterNode = (ctx as any).filterNode as BiquadFilterNode;

        filterNode.type = 'allpass';
        filterNode.frequency.value = 440;
        filterNode.detune.value = 0;
        filterNode.Q.value = 1;

        switch (filter) {
            case 'robot':
                filterNode.type = 'peaking';
                filterNode.frequency.value = 100;
                filterNode.Q.value = 10;
                break;
            case 'deep':
                filterNode.type = 'lowpass';
                filterNode.frequency.value = 400;
                break;
            case 'chipmunk':
                filterNode.detune.value = 1200;
                break;
            case 'alien':
                filterNode.type = 'notch';
                filterNode.frequency.value = 800;
                filterNode.Q.value = 5;
                break;
        }
    };

    useEffect(() => {
        updateFilterEffect(activeFilter);
    }, [activeFilter]);

    const handleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const handleNext = () => {
        cleanupWebRTC();
        socketRef.current?.emit('next_stranger');
        setPartnerId(null);
        setPartnerCountry(null);
        setConnectionStartTime(null);
        setMessages([]);
        setIsStrangerTyping(false);
        // Reset debate state so it doesn't bleed into next session
        setDebateData({
            status: 'idle',
            topic: null,
            round: 1,
            turn: null,
            timeLeft: 0,
            isInitiator: false,
            votes: { me: null, stranger: null },
            winner: null
        });
        setStatus('searching');
        emitJoinQueue();
    };

    const handleReconnect = () => {
        if (!lastPartnerId) return;
        setStatus('searching');
        const myUserId = localStorage.getItem('norinly_user_id');
        socketRef.current?.emit('reconnect_request', { targetUserId: lastPartnerId, myUserId });
    };

    const handleEnd = () => {
        cleanupConnection();
    };

    const handleReport = () => {
        socketRef.current?.emit('report_user');
        alert('User reported. Moderation team has been notified.');
        handleNext();
    };

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const newMessage: Message = {
            id: Math.random().toString(36).substring(7),
            sender: 'me',
            text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, newMessage]);
        socketRef.current?.emit('chat-message', text);
    };

    const sendTyping = (isTyping: boolean) => {
        if (isTyping) {
            socketRef.current?.emit('typing-start');
        } else {
            socketRef.current?.emit('typing-stop');
        }
    };

    const sendReaction = (emoji: string) => {
        socketRef.current?.emit('reaction', emoji);
        const id = Math.random().toString(36).substring(7);
        setActiveReactions(prev => [...prev, { id, emoji }]);
        setTimeout(() => {
            setActiveReactions(prev => prev.filter(r => r.id !== id));
        }, 2000);
    };

    const sendSystemMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(36).substring(7),
            sender: 'stranger',
            text: `[SYSTEM]: ${text}`,
            timestamp: Date.now()
        }]);
    };

    const revealCountry = () => {
        socketRef.current?.emit('reveal-country');
    };

    const logout = async () => {
        await signOut(auth);
        cleanupConnection();
    };

    const sendFriendRequest = () => {
        if (!currentUser) {
            setShowAuthModal(true);
            return;
        }
        socketRef.current?.emit('send_friend_request');
        alert('Friend request sent!');
    };

    const acceptFriendRequest = (fromUserId: string) => {
        if (!currentUser) {
            setShowAuthModal(true);
            return;
        }
        socketRef.current?.emit('accept_friend_request', { fromUserId });
    };

    return (
        <ChatContext.Provider value={{
            status, liveUsers, isMuted, micDenied, partnerId, partnerCountry, lastPartnerId, connectionStartTime,
            messages, isStrangerTyping, isRemoteSpeaking, activeReactions, activeFilter,
            canvasRef, localAudioRef, remoteAudioRef,
            requestMicrophoneAndJoin, handleMute, handleNext, handleEnd, handleReconnect, handleReport,
            sendMessage, sendTyping, sendReaction, sendSystemMessage, revealCountry, setActiveFilter, cleanupConnection,
            currentUser, logout, sendFriendRequest, acceptFriendRequest, friends, showAuthModal, setShowAuthModal,
            joinPrivateRoom,
            debateData, offerDebate, acceptDebate, rejectDebate, sendDebateAction, voteDebate, exitDebate
        }}>
            {children}
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay />

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            {pendingFriendRequest && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-surface border border-accent/50 p-4 rounded-2xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{pendingFriendRequest.fromUsername} wants to add you as a friend.</span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => {
                                acceptFriendRequest(pendingFriendRequest.fromUserId);
                                setPendingFriendRequest(null);
                            }}
                            className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent-hover transition-all"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => setPendingFriendRequest(null)}
                            className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-all"
                        >
                            Decline
                        </button>
                    </div>
                </div>
            )}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

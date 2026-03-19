'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import socket from '@/lib/socket';
import { auth, db as fdb } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, increment, arrayUnion, addDoc, collection, query, where, getDocs, getDoc, setDoc } from 'firebase/firestore';
import AuthModal from '@/components/AuthModal';
import toast from 'react-hot-toast';
import { generateRandomName, getFlagEmoji, getCountryInitials } from '@/lib/identity-utils';
import { initializeUserProgress, updateTaskProgress } from '@/lib/gamification';

export type ConnectionStatus = 'idle' | 'initializing' | 'requesting_mic' | 'searching' | 'connecting' | 'connected' | 'error' | 'disconnected';

export interface Message {
    id: string;
    sender: 'me' | 'partner' | 'system';
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
    partnerDisplayName: string | null;
    partnerCountry: { countryName: string, countryCode: string } | null;
    myDisplayName: string | null;
    lastPartnerId: string | null;
    errorDetail: string | null;

    connectionStartTime: number | null;
    messages: Message[];
    isStrangerTyping: boolean;
    isRemoteSpeaking: boolean;
    isLocalSpeaking: boolean;
    activeReactions: Array<{ id: string, emoji: string }>;
    activeFilter: string;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    localAudioRef: React.RefObject<HTMLAudioElement | null>;
    remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
    requestMicrophoneAndJoin: (interests: string[], country: string, mode?: string, scenario?: string) => Promise<void>;
    handleMute: () => void;
    handleNext: () => void;
    handleEnd: () => void;
    handleReconnect: () => void;
    handleReport: () => void;
    sendMessage: (text: string) => void;
    sendTyping: (isTyping: boolean) => void;
    sendStopTyping: () => void;
    sendReaction: (emoji: string) => void;
    sendSystemMessage: (text: string) => void;
    saveRating: (rating: 'good' | 'okay' | 'bad') => Promise<void>;
    setActiveFilter: (filter: string) => void;
    cleanupConnection: () => void;
    currentUser: User | null;
    logout: () => Promise<void>;
    sendFriendRequest: () => void;
    acceptFriendRequest: (requestId: string) => Promise<void>;
    declineFriendRequest: (requestId: string) => Promise<void>;
    friends: any[];
    showAuthModal: boolean;
    setShowAuthModal: (show: boolean) => void;
    showProfileModal: boolean;
    setShowProfileModal: (show: boolean) => void;
    showProfileSetupModal: boolean;
    setShowProfileSetupModal: (show: boolean) => void;
    joinPrivateRoom: (inviteCode: string) => Promise<void>;
    pendingFriendRequest: any;

    // Session Metrics
    sessionDuration: number;
    isSessionFinished: boolean;
    selectedMode: string;

    // Debate Mode
    debateData: DebateData;
    offerDebate: () => void;
    acceptDebate: (topic: string) => void;
    rejectDebate: () => void;
    sendDebateAction: (action: any) => void;
    voteDebate: (winnerId: string | null) => void;
    exitDebate: () => void;
    // Roleplay Mode
    roleplayData: { scenario: string | null, role: 'A' | 'B' | null };
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun.ekiga.net' },
        { urls: 'stun:stun.ideasip.com' },
        { urls: 'stun:stun.schlund.de' },
        { urls: 'stun:stun.voiparound.com' },
        { urls: 'stun:stun.voipbuster.com' },
        { urls: 'stun:stun.voipstunt.com' },
        { urls: 'stun:stun.voxgratia.org' },
    ],
    iceCandidatePoolSize: 10,
};

// Removed getSocketUrl - using centralized socket from @/lib/socket

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<ConnectionStatus>('idle');
    const [liveUsers, setLiveUsers] = useState<number>(0);
    const [isMuted, setIsMuted] = useState(false);
    const [micDenied, setMicDenied] = useState(false);
    const [chatMode, setChatMode] = useState<string>('normal');

    const [partnerId, setPartnerId] = useState<string | null>(null);
    const [partnerDisplayName, setPartnerDisplayName] = useState<string | null>(null);
    const [partnerCountry, setPartnerCountry] = useState<{ countryName: string, countryCode: string } | null>(null);
    const [myDisplayName, setMyDisplayName] = useState<string | null>(null);
    const [lastPartnerId, setLastPartnerId] = useState<string | null>(null);
    const [errorDetail, setErrorDetail] = useState<string | null>(null);

    const [connectionStartTime, setConnectionStartTime] = useState<number | null>(null);

    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStrangerTyping, setIsStrangerTyping] = useState(false);
    const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false);
    const [isLocalSpeaking, setIsLocalSpeaking] = useState(false);
    const [activeReactions, setActiveReactions] = useState<Array<{ id: string, emoji: string }>>([]);
    const [activeFilter, setActiveFilter] = useState<string>('none');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [friends, setFriends] = useState<any[]>([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showProfileSetupModal, setShowProfileSetupModal] = useState(false);
    const [pendingFriendRequest, setPendingFriendRequest] = useState<any>(null);

    // Session Metrics
    const [sessionDuration, setSessionDuration] = useState(0);
    const [isSessionFinished, setIsSessionFinished] = useState(false);
    const [selectedMode, setSelectedMode] = useState('casual');

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

    // Roleplay State
    const [roleplayData, setRoleplayData] = useState<{ scenario: string | null, role: 'A' | 'B' | null }>({
        scenario: null,
        role: null
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
    const analysisFrameRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const socketRef = useRef<Socket | null>(socket);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const negotiationInProgressRef = useRef(false);
    const answerCreatedRef = useRef(false);
    const currentPartnerRef = useRef<string | null>(null);
    const listenersSetUpRef = useRef(false);
    const hasShownProfileSetupRef = useRef(false);
    // ICE candidate buffer: holds candidates that arrive before remoteDescription is set
    const iceCandidateBufferRef = useRef<RTCIceCandidateInit[]>([]);
    const threeMinuteNoticeShownRef = useRef(false);


    useEffect(() => {
        currentPartnerRef.current = partnerId;
    }, [partnerId]);

    useEffect(() => {
        if (status === 'idle') {
            // Versioning for deployment verification
            console.log('[Norinly-App] Version: 1.0.17-CORS-CLEANUP');

            if (!socket.connected) {
                socket.connect();
            }

            const handleLiveUsers = (count: number) => {
                setLiveUsers(count);
            };

            socket.on('live_users_count', handleLiveUsers);
            
            return () => {
                socket.off('live_users_count', handleLiveUsers);
            };
        }
    }, [status]);

    // Auth Listener
    useEffect(() => {
        if (!auth) return; // Firebase not configured
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                // Update last seen
                if (fdb) {
                    const userRef = doc(fdb, 'users', user.uid);
                    onSnapshot(userRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.data();
                            // If user is new and hasn't completed onboarding OR doesn't have required fields
                            /* Disabled: This popup is irritating
                            if (!data.onboardingComplete && !data.profileCompleted && !hasShownProfileSetupRef.current) {
                                if (typeof window !== 'undefined' && sessionStorage.getItem('skippedProfileSetup') !== 'true') {
                                    setShowProfileSetupModal(true);
                                    hasShownProfileSetupRef.current = true;
                                }
                            }
                            */
                        } else {
                            // Document doesn't exist yet, AuthModal usually creates it, 
                            // but if not, user is definitely new
                            /* Disabled: This popup is irritating
                            if (!hasShownProfileSetupRef.current) {
                                if (typeof window !== 'undefined' && sessionStorage.getItem('skippedProfileSetup') !== 'true') {
                                    setShowProfileSetupModal(true);
                                    hasShownProfileSetupRef.current = true;
                                }
                            }
                            */
                        }
                    });

                    updateDoc(userRef, {
                        lastSeen: new Date()
                    }).catch(console.error);

                    // Initialize Daily Progress & Gamification
                    initializeUserProgress(user.uid).catch(console.error);
                }

                // Re-register with back-end if socket is active
                if (socketRef.current?.connected) {
                    user.getIdToken().then(token => {
                        socketRef.current?.emit('register', { userId: user.uid, token });
                    }).catch(console.error);
                }

                // Fetch friends from Firestore
                const friendsRef = collection(fdb, 'users', user.uid, 'friends');
                const unsubFriends = onSnapshot(friendsRef, async (snapshot) => {
                    const friendList: any[] = [];
                    for (const friendDoc of snapshot.docs) {
                        const friendData = friendDoc.data();
                        let profileData = null;
                        try {
                            const profileSnap = await getDoc(doc(fdb, 'users', friendDoc.id));
                            if (profileSnap.exists()) {
                                profileData = profileSnap.data();
                            }
                        } catch (err) {
                            console.warn(`[Firestore] Failed to fetch profile for ${friendDoc.id} (offline?):`, err);
                        }

                        friendList.push({
                            id: friendDoc.id,
                            ...friendData,
                            profile: profileData
                        });
                    }
                    setFriends(friendList);
                });

                return () => {
                    unsubscribe();
                    unsubFriends();
                };
            }
        });
        return () => unsubscribe();
    }, []);

    // Session Timer & Stats
    useEffect(() => {
        if (status !== 'connected' || !connectionStartTime) {
            setSessionDuration(0);
            setIsSessionFinished(false);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - connectionStartTime) / 1000);
            
            setSessionDuration(elapsed);

            // Session finish logic (if still needed, e.g., for stats)
            if (elapsed >= 300 && !isSessionFinished) {
                setIsSessionFinished(true);
                saveSessionStats();
                // sendSystemMessage("Time's up! Great practice session. You can stay and finish your point, or find a new partner.");
            }

            // Streak/Long convo check (3 minutes)
            if (elapsed >= 180 && !threeMinuteNoticeShownRef.current) {
                sendSystemMessage("🔥 You've been talking for 3 minutes! Great conversation!");
                threeMinuteNoticeShownRef.current = true;
                if (currentUser) {
                    updateTaskProgress(currentUser.uid, 'activeTime', 180);
                }
            }
        }, 1000);

        const suggestions = [
            "Ask them what music they like",
            "Ask where they are from",
            "Ask their favorite movie",
            "Ask what they do for fun",
            "Ask what country they want to visit"
        ];

        /*
        // Disabled: Conversation ideas are now shown as a floating card in the UI
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
        */

        return () => {
            clearInterval(interval);
            // silenceTimer is disabled
        }
    }, [messages.length, isRemoteSpeaking, isStrangerTyping, status, connectionStartTime, isSessionFinished]);

    const saveSessionStats = async () => {
        if (!currentUser || !connectionStartTime || !fdb) return;
        const now = Date.now();
        const elapsedMinutes = Math.floor((now - connectionStartTime) / 60000);
        
        if (elapsedMinutes < 1) return;

        try {
            const userRef = doc(fdb, 'users', currentUser.uid);
            const updates: any = {
                conversationsCount: increment(1),
                totalSpeakingMinutes: increment(elapsedMinutes),
                updatedAt: new Date()
            };

            // Add country to countriesSpokenTo if we have it
            if (partnerCountry?.countryName) {
                updates.countriesSpokenTo = arrayUnion(partnerCountry.countryName);
            }

            await updateDoc(userRef, updates);
            toast.success(`Session saved! +${elapsedMinutes} mins recorded.`);
        } catch (e) {
            console.error('Error saving session stats:', e);
        }
    };

    const saveRating = async (rating: 'good' | 'okay' | 'bad') => {
        if (!currentUser || !fdb) return;

        // Map rating to score
        const scores = { good: 5, okay: 3, bad: 1 };
        const score = scores[rating];

        try {
            const userRef = doc(fdb, 'users', currentUser.uid);
            let userDoc;
            try {
                userDoc = await getDoc(userRef);
            } catch (err) {
                toast.error('Could not save rating. You might be offline.');
                console.error('getDoc error in saveRating:', err);
                return;
            }
            
            if (userDoc && userDoc.exists()) {
                const data = userDoc.data();
                const totalRatings = data.totalRatings || 0;
                const currentAvg = data.averageRating || 0;
                
                const newTotalRatings = totalRatings + 1;
                const newAvg = ((currentAvg * totalRatings) + score) / newTotalRatings;

                await updateDoc(userRef, {
                    averageRating: Number(newAvg.toFixed(1)),
                    totalRatings: newTotalRatings
                });
                toast.success('Your feedback helps us improve! Thanks ❤️');
            }
        } catch (e) {
            console.error('Error saving rating:', e);
        }
    };


    const setupSocketListeners = () => {
        if (!socketRef.current) return;
        // Guard against duplicate listener attachment
        if (listenersSetUpRef.current) return;
        listenersSetUpRef.current = true;

        socketRef.current.on('live_users_count', (count) => {
            setLiveUsers(count);
        });

        socketRef.current.on('match_found', async (data: any) => {
            const { initiator, partnerId, partnerDisplayName, partnerCountry, mode, scenario, role } = data;
            console.log('[Match Found] Data:', data);
            
            setPartnerId(partnerId);
            setPartnerDisplayName(partnerDisplayName || 'Partner');
            setPartnerCountry(partnerCountry || null);
            setConnectionStartTime(Date.now());
            setMessages([]);
            setIsStrangerTyping(false);
            setStatus('connected');
            setupWebRTC(initiator);

            // Task: Join Room
            if (currentUser) {
                updateTaskProgress(currentUser.uid, 'joinRoom', 1);
            }
            if (mode === 'roleplay') {
                setRoleplayData({
                    scenario: scenario || null,
                    role: role || null
                });
            } else {
                setRoleplayData({ scenario: null, role: null });
            }

            // Broadcast our identity to the partner
            const myIdData = {
                name: myDisplayName,
                country: searchParamsRef.current.country, // this is the country name we have from IP or selection
                countryCode: '' // will be resolved if needed
            };
            socketRef.current?.emit('identity', myIdData);
        });

        socketRef.current.on('typing', () => {
            setIsStrangerTyping(true);
        });

        socketRef.current.on('stop_typing', () => {
            setIsStrangerTyping(false);
        });

        socketRef.current.on('receive_message', (data: { text: string, senderId: string }) => {
            setIsStrangerTyping(false); // Hide indicator when message received
            setMessages(prev => [...prev, {
                id: Math.random().toString(36).substring(7),
                sender: 'partner',
                text: data.text,
                timestamp: Date.now()
            }]);
        });

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
            setPartnerCountry(data);
        });

        socketRef.current.on('identity', (data: { name: string, country: string, countryCode?: string }) => {
            console.log('[Identity] Received from partner:', data);
            if (data.name) setPartnerDisplayName(data.name);
            if (data.country) {
                setPartnerCountry({
                    countryName: data.country,
                    countryCode: data.countryCode || ''
                });
            }
        });


        socketRef.current.on('webrtc_offer', async (offer) => {
            console.log('[Signaling] Received WebRTC offer');
            // Check if we already created an answer for this session
            if (answerCreatedRef.current) {
                console.warn('Answer already created for this session, ignoring duplicate offer');
                return;
            }

            // If peer connection isn't ready yet, wait a bit and retry once
            if (!peerConnectionRef.current) {
                console.warn('[Signaling] PeerConnection not initialized yet, retrying in 500ms');
                setTimeout(() => {
                    if (peerConnectionRef.current && !answerCreatedRef.current) {
                        socketRef.current?.emit('webrtc_offer', offer); // Trigger a re-emit from this side to ourselves is not valid, 
                        // Instead, we just call the handler again manually if possible, or wait for the other side's retry.
                        // Actually, better to just wait. The initiator should handle a lack of answer.
                    }
                }, 500);
                return;
            }

            // Check if we are already in the process of negotiating or if state is not stable
            if (negotiationInProgressRef.current || (peerConnectionRef.current.signalingState !== 'stable' && peerConnectionRef.current.signalingState !== 'have-local-offer')) {
                console.warn('Received offer but signaling state is not stable or negotiation in progress', peerConnectionRef.current.signalingState);
                return;
            }

            try {
                negotiationInProgressRef.current = true;
                answerCreatedRef.current = true;
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

                // Drain buffered ICE candidates now that remoteDescription is set
                if (iceCandidateBufferRef.current.length > 0) {
                    console.log(`[WebRTC] Draining ${iceCandidateBufferRef.current.length} buffered ICE candidates`);
                    for (const c of iceCandidateBufferRef.current) {
                        try { await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(c)); } catch { /* ignore stale */ }
                    }
                    iceCandidateBufferRef.current = [];
                }

                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socketRef.current?.emit('webrtc_answer', answer);
                console.log('[WebRTC] Answer created and sent');
            } catch (e) {
                console.error('Error handling webrtc_offer', e);
                answerCreatedRef.current = false;
            } finally {
                negotiationInProgressRef.current = false;
            }
        });

        socketRef.current.on('webrtc_answer', async (answer) => {
            if (!peerConnectionRef.current) return;

            if (peerConnectionRef.current.signalingState !== 'have-local-offer') {
                console.warn('Received answer but signaling state is not have-local-offer', peerConnectionRef.current.signalingState);
                return;
            }

            try {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));

                // Drain buffered ICE candidates now that remoteDescription is set
                if (iceCandidateBufferRef.current.length > 0) {
                    console.log(`[WebRTC] Draining ${iceCandidateBufferRef.current.length} buffered ICE candidates (from answer path)`);
                    for (const c of iceCandidateBufferRef.current) {
                        try { await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(c)); } catch { /* ignore stale */ }
                    }
                    iceCandidateBufferRef.current = [];
                }

                console.log('[WebRTC] Remote answer applied');
            } catch (e) {
                console.error('Error handling webrtc_answer', e);
            }
        });

        socketRef.current.on('webrtc_ice_candidate', async (candidate) => {
            console.log('[Signaling] Received Remote ICE Candidate');
            const pc = peerConnectionRef.current;
            if (!pc) return;

            if (!pc.remoteDescription) {
                // Buffer candidate — remoteDescription not yet set
                console.log('[WebRTC] Buffering ICE candidate (remoteDescription not set yet)');
                iceCandidateBufferRef.current.push(candidate);
                return;
            }

            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error('Error adding received ICE candidate', e);
            }
        });

        const onPartnerLeft = () => {
            cleanupWebRTC();
            setLastPartnerId(currentPartnerRef.current);
            setPartnerId(null);
            setPartnerDisplayName(null);
            setConnectionStartTime(null);
            setIsStrangerTyping(false);
            setStatus('disconnected');
        };

        socketRef.current.on('partner_disconnected', onPartnerLeft);
        socketRef.current.on('partner_left', onPartnerLeft);

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

        socketRef.current.on('friends_list', (list) => setFriends(list));

        socketRef.current.on('friend_request_accepted', ({ friendId }) => {
            sendSystemMessage(`You and your partner are now friends!`);
            socketRef.current?.emit('get_friends_list');
        });

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

    const requestMicrophoneAndJoin = async (interests: string[], country: string, mode: string = 'normal', scenario?: string) => {
        searchParamsRef.current = { interests, country };
        if (scenario) {
            setRoleplayData(prev => ({ ...prev, scenario }));
        }
        setChatMode(mode);
        setSelectedMode(mode);
        setErrorDetail(null);
        setStatus('initializing');
        
        // Use user's real name if logged in, otherwise use a fun random one
        let displayName = currentUser?.displayName || myDisplayName;
        
        if (!displayName || displayName === 'Learner') {
            displayName = generateRandomName();
        }
        
        setMyDisplayName(displayName);

        try {
            // STEP 1: Request Microphone immediately to satisfy user gesture requirements (especially Safari/iOS)
            console.log("[Connection-Flow] Requesting microphone access...");
            setStatus('requesting_mic');

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: false
            });

            console.log("[Connection-Flow] Microphone granted.");
            setMicDenied(false);
            localStreamRef.current = stream;
            if (localAudioRef.current) localAudioRef.current.srcObject = stream;

            // STEP 2: Setup Visualizer (non-blocking)
            setupVisualizer(stream);

            // STEP 3: Connect to Signaling Server
            setStatus('searching');
            connectToSignalingServer();
        } catch (err: any) {
            console.error('[Connection-Flow] Microphone error:', err);
            setStatus('error');

            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setMicDenied(true);
                setErrorDetail("Microphone permission denied. Please allow access and try again.");
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                setErrorDetail("No microphone detected. Please plug in a microphone.");
            } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
                setErrorDetail("Microphone is already in use by another application.");
            } else if (err.name === "OverconstrainedError") {
                setErrorDetail("Your microphone does not support the required settings.");
            } else {
                setErrorDetail("Could not access microphone: " + (err.message || "Unknown error"));
            }
        }
    };

    const emitJoinQueue = async () => {
        const userId = currentUser?.uid || localStorage.getItem('norinly_user_id') || crypto.randomUUID();
        if (!currentUser) localStorage.setItem('norinly_user_id', userId);

        const { interests, country } = searchParamsRef.current;

        let token = undefined;
        if (currentUser) {
            try {
                token = await currentUser.getIdToken();
            } catch (err) {
                console.error('Error getting ID token:', err);
            }
        }

        socketRef.current?.emit('register', { userId, token });
        socketRef.current?.emit('join_queue', { userId, interests, country, mode: chatMode, scenario: roleplayData.scenario });
        
        // Tracking messages sent
        // This is a bit hacky, better to use the sendMessage function
    };

    const sendMessage = (text: string) => {
        if (socketRef.current && status === 'connected') {
            socketRef.current.emit('send_message', { text });
            setMessages(prev => [...prev, {
                id: Math.random().toString(36).substring(7),
                sender: 'me',
                text,
                timestamp: Date.now()
            }]);
            
            // Task: Send Messages
            if (currentUser) {
                updateTaskProgress(currentUser.uid, 'sendMessages', 1);
            }
        }
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
                if (currentUser && finalWinner && fdb) {
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
        listenersSetUpRef.current = false;

        if (socket.connected) {
            socket.disconnect();
        }

        socket.connect();
        socketRef.current = socket;

        socketRef.current.on('connect', () => {
            console.log('[Chat Socket] Connected:', socketRef.current?.id);
            // Attach all listeners once the connection is confirmed to avoid race conditions
            setupSocketListeners();
            emitJoinQueue();
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket connection failed:', err.message);
            setErrorDetail(`Connection Error: Unable to reach the signaling server. Please check your internet connection and try again. (Detail: ${err.message})`);
            setStatus('error');
            setTimeout(() => {
                if (socketRef.current) socketRef.current.connect();
            }, 3000);
        });
    };

    const joinPrivateRoom = async (inviteCode: string) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            setMicDenied(false);
            localStreamRef.current = stream;
            if (localAudioRef.current) localAudioRef.current.srcObject = stream;

            setupVisualizer(stream);

            setStatus('searching');
            listenersSetUpRef.current = false;

            // Removed redundant getSocketUrl in private room

            if (socket.connected) {
                socket.disconnect();
            }

            socket.connect();
            socketRef.current = socket;

            socketRef.current.on('connect', () => {
                console.log('[Private Socket] Connected:', socketRef.current?.id);
                const userId = currentUser?.uid || localStorage.getItem('norinly_user_id') || crypto.randomUUID();
                setupSocketListeners();
                socketRef.current?.emit('register', { userId });
                socketRef.current?.emit('join_private_room', { userId, inviteCode });
            });

        } catch (err: any) {
            console.error('Error joining private room', err);
            setMicDenied(true);
            setErrorDetail(`Could not join private room: ${err.message || 'Unknown error'}`);
            setStatus('error');
        }
    };

    const setupWebRTC = async (initiator: boolean) => {
        cleanupWebRTC();
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;
        negotiationInProgressRef.current = false;
        answerCreatedRef.current = false;
        threeMinuteNoticeShownRef.current = false;

        pc.onconnectionstatechange = () => {
            console.log('[WebRTC] Connection state:', pc.connectionState);
            if (pc.connectionState === 'failed') {
                setErrorDetail("WebRTC Connection Failed: Could not establish a direct voice path. This can happen due to strict firewalls or mobile network restrictions.");
                setStatus('error');
            } else if (pc.connectionState === 'connected') {
                console.log('[WebRTC] SUCCESS: Peer-to-peer connection established!');
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log('[WebRTC] ICE Connection state:', pc.iceConnectionState);
            if (pc.iceConnectionState === 'failed') {
                setErrorDetail("ICE Negotiation Failed: Peer-to-peer connection could not be negotiated.");
                setStatus('error');
            }
        };

        pc.onicegatheringstatechange = () => {
            console.log('[WebRTC] ICE Gathering state:', pc.iceGatheringState);
        };

        pc.onsignalingstatechange = () => {
            console.log('[WebRTC] Signaling state:', pc.signalingState);
        };


        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current!);
            });

        }

        pc.ontrack = (event) => {
            console.log('[WebRTC] Received remote track:', event.track.kind);
            if (remoteAudioRef.current) {
                if (remoteAudioRef.current.srcObject !== event.streams[0]) {
                    remoteAudioRef.current.srcObject = event.streams[0];
                    console.log('[WebRTC] Attached remote stream to audio element');
                }
                remoteAudioRef.current.play().catch(e => {
                    console.log("[WebRTC] Autoplay blocked, standard handling triggered:", e);
                });
            }
            remoteStreamRef.current = event.streams[0];
            setupRemoteAudioAnalysis(event.streams[0]);
        };


        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('[WebRTC] Local ICE Candidate generated');
                socketRef.current?.emit('webrtc_ice_candidate', event.candidate);
            } else {
                console.log('[WebRTC] ICE Gathering Complete');
            }
        };

        if (initiator) {
            try {
                // Wait a bit to ensure the other side has joined and set up their socket listeners
                await new Promise(resolve => setTimeout(resolve, 800));

                // Guard: only create offer if we are still in a valid state
                if (!peerConnectionRef.current || pc.signalingState !== 'stable') {
                    console.warn('Cannot create offer: PC closed or signalingState is not stable:', pc.signalingState);
                    return;
                }
                const offer = await pc.createOffer({
                    offerToReceiveAudio: true
                });
                if (!peerConnectionRef.current || pc.signalingState !== 'stable') return; 
                await pc.setLocalDescription(offer);
                socketRef.current?.emit('webrtc_offer', offer);
                console.log('[WebRTC] Initiator offer sent');
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
        // Clear buffered ICE candidates to prevent them leaking into next session
        iceCandidateBufferRef.current = [];
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }
    };

    const cleanupConnection = () => {
        cleanupWebRTC();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (analysisFrameRef.current) cancelAnimationFrame(analysisFrameRef.current);
        analysisFrameRef.current = null;
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.error);
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
        }
        if (socketRef.current) socketRef.current.disconnect();

        setStatus('idle');
        setPartnerCountry(null);
        setConnectionStartTime(null);
        setIsRemoteSpeaking(false);
        setIsLocalSpeaking(false);
        setActiveFilter('none');
        setErrorDetail(null);
    };

    const setupRemoteAudioAnalysis = (stream: MediaStream) => {
        if (!audioContextRef.current) return;
        try {
            const source = audioContextRef.current.createMediaStreamSource(stream);
            const analyser = audioContextRef.current.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            source.connect(analyser);
            remoteAnalyserRef.current = analyser;
            remoteDataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

            // Ensure analysis loop is running
            if (!analysisFrameRef.current) {
                runAudioAnalysis();
            }
        } catch (e) {
            console.error('[WebRTC] Error setting up remote audio analysis:', e);
        }
    };

    const runAudioAnalysis = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;

        analysisFrameRef.current = requestAnimationFrame(runAudioAnalysis);

        // Analyze Remote Speaking
        if (remoteAnalyserRef.current && remoteDataArrayRef.current) {
            remoteAnalyserRef.current.getByteFrequencyData(remoteDataArrayRef.current as any);
            const average = remoteDataArrayRef.current.reduce((a, b: any) => a + b, 0) / remoteDataArrayRef.current.length;
            // Sensitivity threshold
            const remoteSpeaking = average > 12;
            setIsRemoteSpeaking(prev => prev !== remoteSpeaking ? remoteSpeaking : prev);
        }

        // Analyze Local Speaking
        if (analyserRef.current && dataArrayRef.current) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
            const localAverage = dataArrayRef.current.reduce((a, b: any) => a + b, 0) / dataArrayRef.current.length;
            const localSpeaking = localAverage > 12;
            setIsLocalSpeaking(prev => prev !== localSpeaking ? localSpeaking : prev);
        }
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

        // Start continuous analysis if not already running
        if (!analysisFrameRef.current) {
            runAudioAnalysis();
        }
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
        setPartnerDisplayName(null);
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
        threeMinuteNoticeShownRef.current = false;
        setStatus('searching');


        // Only re-emit join_queue if the socket is still connected
        if (socketRef.current?.connected) {
            emitJoinQueue();
        } else {
            console.warn('[handleNext] Socket not connected, reconnecting before emitting join_queue');
            connectToSignalingServer();
        }
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

    const sendStopTyping = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('stop_typing');
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
            sender: 'system',
            text: `[SYSTEM]: ${text}`,
            timestamp: Date.now()
        }]);
    };

    const logout = async () => {
        if (auth) await signOut(auth);
        cleanupConnection();
    };

    const sendFriendRequest = async () => {
        if (!currentUser) {
            setShowAuthModal(true);
            return;
        }

        if (!partnerId || !fdb) return;

        try {
            // Check for existing request
            const q = query(
                collection(fdb, 'friendRequests'),
                where('fromUserId', '==', currentUser.uid),
                where('toUserId', '==', partnerId),
                where('status', '==', 'pending')
            );
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                toast.error('Friend request already pending');
                return;
            }

            await addDoc(collection(fdb, 'friendRequests'), {
                fromUserId: currentUser.uid,
                fromUsername: currentUser.displayName || 'Learner',
                toUserId: partnerId,
                status: 'pending',
                createdAt: new Date()
            });

            // Notify via socket for real-time alerts
            socketRef.current?.emit('send_friend_request', { targetUserId: partnerId });

            toast.success('Friend request sent ✅');
        } catch (e) {
            console.error('Error sending friend request:', e);
            toast.error('Failed to send request');
        }
    };

    const acceptFriendRequest = async (requestId: string) => {
        if (!fdb || !currentUser) return;
        try {
            const reqRef = doc(fdb, 'friendRequests', requestId);
            let reqSnap;
            try {
                reqSnap = await getDoc(reqRef);
            } catch (err) {
                toast.error('Failed to accept request. Please check your connection.');
                console.error('getDoc error in acceptFriendRequest:', err);
                return;
            }

            if (!reqSnap || !reqSnap.exists()) return;
            const reqData = reqSnap.data();

            await updateDoc(reqRef, {
                status: 'accepted',
                updatedAt: new Date()
            });

            // Add mutual friends
            const friendId = reqData.fromUserId === currentUser.uid ? reqData.toUserId : reqData.fromUserId;
            
            await setDoc(doc(fdb, 'users', currentUser.uid, 'friends', friendId), {
                friendId,
                addedAt: new Date()
            }, { merge: true });

            await setDoc(doc(fdb, 'users', friendId, 'friends', currentUser.uid), {
                friendId: currentUser.uid,
                addedAt: new Date()
            }, { merge: true });

            // Notify via socket for real-time alerts
            socketRef.current?.emit('accept_friend_request', { targetUserId: friendId });

            toast.success('Accepted! You are now friends 🤝');
        } catch (e) {
            console.error('Error accepting friend request:', e);
        }
    };

    const declineFriendRequest = async (requestId: string) => {
        if (!fdb) return;
        try {
            await updateDoc(doc(fdb, 'friendRequests', requestId), {
                status: 'rejected',
                updatedAt: new Date()
            });
            toast.success('Request declined');
        } catch (e) {
            console.error('Error declining friend request:', e);
        }
    };

    return (
        <ChatContext.Provider value={{
            status, liveUsers, isMuted, micDenied, partnerId, partnerDisplayName, partnerCountry, myDisplayName, lastPartnerId, connectionStartTime,
            messages, isStrangerTyping, isRemoteSpeaking, isLocalSpeaking, activeReactions, activeFilter,
            errorDetail,
            canvasRef, localAudioRef, remoteAudioRef,
            requestMicrophoneAndJoin, handleMute, handleNext, handleEnd, handleReconnect, handleReport,
            sendMessage, sendTyping, sendStopTyping, sendReaction, sendSystemMessage, saveRating, setActiveFilter, cleanupConnection,
            currentUser, logout, sendFriendRequest, acceptFriendRequest, declineFriendRequest, friends,
            showAuthModal,
            setShowAuthModal,
            showProfileModal,
            setShowProfileModal,
            showProfileSetupModal,
            setShowProfileSetupModal,
            joinPrivateRoom,
            pendingFriendRequest,
            sessionDuration,
            isSessionFinished,
            selectedMode,
            roleplayData,
            debateData, offerDebate, acceptDebate, rejectDebate, sendDebateAction, voteDebate, exitDebate
        }}>
            {children}
            <audio ref={localAudioRef} autoPlay muted playsInline />
            <audio ref={remoteAudioRef} autoPlay playsInline />

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
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

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Mic, MicOff, SkipForward, XSquare, Flag, Loader2, Users, RefreshCcw, RefreshCw, Send,
    UserPlus, User as UserIcon, LogOut, Info, Scale, Check, ArrowRight, X,
    Bell, Heart, SendHorizontal, Sparkles, Gamepad2, Globe, Trophy, Mic2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useChatContext } from '@/context/ChatContext';
import { PROMPTS, GAMES, DEBATE_TOPICS } from '@/lib/engagement';
import { getFlagEmoji, getCountryInitials } from '@/lib/identity-utils';
import DebateStatus from '@/components/DebateStatus';
import FeedbackModal from '@/components/FeedbackModal';
import ViralShareModal from '@/components/ViralShareModal';

export default function ChatPage() {
    const router = useRouter();
    const {
        status, liveUsers, isMuted, micDenied, partnerId, partnerCountry, lastPartnerId, connectionStartTime,
        messages, isStrangerTyping, isRemoteSpeaking, isLocalSpeaking, activeReactions, activeFilter,
        canvasRef, handleMute, handleNext, handleEnd, handleReconnect, handleReport,
        sendMessage, sendTyping, sendStopTyping, sendReaction, sendSystemMessage, setActiveFilter,
        currentUser, logout, sendFriendRequest, setShowAuthModal,
        setShowProfileModal, acceptFriendRequest, declineFriendRequest,
        debateData, offerDebate, acceptDebate, rejectDebate, exitDebate, voteDebate,
        sessionDuration, isSessionFinished, selectedMode, partnerDisplayName, myDisplayName
    } = useChatContext();

    const [inputText, setInputText] = useState('');
    const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('Searching for someone...');
    const [showStartPrompts, setShowStartPrompts] = useState(false);
    const [startPrompts, setStartPrompts] = useState<string[]>([]);
    const [isSwitching, setIsSwitching] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showViralModal, setShowViralModal] = useState(false);
    const [sessionStats, setSessionStats] = useState({ minutes: 0, peopleMet: 0 });
    const [hasShownCountryBadge, setHasShownCountryBadge] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const lastPromptIndexRef = useRef<number>(-1);
    const lastGameIndexRef = useRef<number>(-1);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Loading message rotation
    useEffect(() => {
        if (status === 'searching') {
            const msgs = [
                'Get ready to practice your English...',
                'Connecting with global learner...',
                'Finding a friendly practice partner...',
                'Preparing your secure voice room...',
                'Joining the conversation...'
            ];
            let i = 0;
            const interval = setInterval(() => {
                i = (i + 1) % msgs.length;
                setLoadingMessage(msgs[i]);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [status]);

    // Initial prompts logic
    useEffect(() => {
        if (status === 'connected') {
            // Pick 3 random prompts
            const shuffled = [...PROMPTS].sort(() => 0.5 - Math.random());
            setStartPrompts(shuffled.slice(0, 3));
            setShowStartPrompts(true);

            // Auto-hide after 15 seconds
            const timer = setTimeout(() => setShowStartPrompts(false), 15000);
            return () => clearTimeout(timer);
        } else {
            setShowStartPrompts(false);
        }
    }, [status]);

    // Prompt effect
    useEffect(() => {
        if (status === 'connected' && !currentPrompt) {
            handleNextPrompt();
        } else if (status !== 'connected') {
            setCurrentPrompt(null);
        }
    }, [status]);

    const handleNextPrompt = () => {
        const nextIndex = (lastPromptIndexRef.current + 1) % PROMPTS.length;
        lastPromptIndexRef.current = nextIndex;
        setCurrentPrompt(PROMPTS[nextIndex]);
    };

    const getAvatarColor = (name: string | null) => {
        if (!name) return 'bg-slate-100 text-slate-400';
        const colors = [
            'bg-blue-100 text-blue-600',
            'bg-purple-100 text-purple-600',
            'bg-rose-100 text-rose-600',
            'bg-amber-100 text-amber-600',
            'bg-emerald-100 text-emerald-600',
            'bg-indigo-100 text-indigo-600',
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (inputText.trim()) {
            sendMessage(inputText);
            setInputText('');
            sendStopTyping();
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputText(value);

        if (value.length > 0) {
            sendTyping(true);
            
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                sendStopTyping();
                typingTimeoutRef.current = null;
            }, 1500);
        } else {
            sendStopTyping();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Micro-rewards logic
    useEffect(() => {
        if (status === 'connected' && connectionStartTime) {
            const checkRewards = setInterval(() => {
                const duration = Math.floor((Date.now() - connectionStartTime) / 1000);
                
                if (duration === 60) {
                    toast.success("1 minute reached! Nice! You're improving. 🎙️", { icon: '🎉', duration: 5000 });
                } else if (duration === 120) {
                    toast.success("2 minutes! Great confidence! Keep it up! 🌟", { icon: '🏆', duration: 5000 });
                } else if (duration === 300) {
                    toast.success("5 minutes! Your commitment to learning is inspiring! Keep shining! ✨", { icon: '💖', duration: 8000 });
                } else if (duration === 600) {
                    toast.success("10 minutes! You're doing amazing! Your confidence is growing with every word. 🌟", { icon: '💎', duration: 8000 });
                } else if (duration === 1800) {
                    toast.success("30 minutes! WOW! You're a true language champion. Your dedication is incredible! 🏆", { icon: '🔥', duration: 10000 });
                } else if (duration === 3600) {
                    toast.success("1 hour! Unbelievable! You've officially conquered the language barrier today. So proud of you! ❤️", { icon: '👑', duration: 12000 });
                }
            }, 1000);
            return () => clearInterval(checkRewards);
        }
    }, [status, connectionStartTime]);

    useEffect(() => {
        if (status === 'disconnected' && connectionStartTime) {
            const duration = Math.floor((Date.now() - connectionStartTime) / 1000);
            if (duration > 10) {
                setSessionStats(prev => ({
                    minutes: prev.minutes + Math.floor(duration / 60),
                    peopleMet: prev.peopleMet + 1
                }));
                
                setTimeout(() => {
                    setShowViralModal(true);
                }, 800);
            }
        }
    }, [status, connectionStartTime]);

    // Country discovery moment
    useEffect(() => {
        if (status === 'connected' && partnerCountry && !hasShownCountryBadge) {
            toast.success(`You connected with someone from ${partnerCountry.countryName}! 🌍`, {
                icon: getFlagEmoji(partnerCountry.countryCode),
                duration: 5000,
                position: 'top-center',
                style: {
                    borderRadius: '24px',
                    background: '#fff',
                    color: '#000',
                    border: '2px solid rgba(var(--accent-rgb), 0.2)',
                    fontWeight: '900',
                    padding: '20px 28px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    fontSize: '16px'
                }
            });
            setHasShownCountryBadge(true);
        } else if (status !== 'connected') {
            setHasShownCountryBadge(false);
        }
    }, [status, partnerCountry, hasShownCountryBadge]);

    const handleEnhancedNext = async () => {
        const duration = connectionStartTime ? Math.floor((Date.now() - connectionStartTime) / 1000) : 0;
        
        if (duration > 10 && status === 'connected') {
            setShowFeedbackModal(true);
            return;
        }

        setIsSwitching(true);
        setTimeout(async () => {
            await handleNext();
            setIsSwitching(false);
        }, 400);
    };

    const handleEnhancedEnd = () => {
        setShowExitDialog(true);
    };

    const confirmEnd = () => {
        setShowExitDialog(false);
        handleEnd();
    };

    // Redirect to home if accessed directly without being in a session
    useEffect(() => {
        if (status === 'idle') {
            router.push('/');
        }
    }, [status, router]);

    return (
        <div className="min-h-screen h-screen flex flex-col bg-slate-50 selection:bg-accent/10 selection:text-accent overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-glass-premium border border-white/20 shadow-premium-xl transition-all duration-500">

                        <div
                            className="flex items-center space-x-2.5 cursor-pointer group select-none"
                            onClick={() => router.push('/')}
                        >
                            <div className="w-8 h-8 md:w-9 md:h-9 bg-accent rounded-xl flex items-center justify-center shadow-premium-sm group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                                <Mic2 className="w-4.5 h-4.5 md:w-5 md:h-5 text-white" />
                            </div>
                            <span className="text-lg md:text-xl font-black text-foreground tracking-tight">
                                Norinly<span className="text-accent">.</span>
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-surface border border-border px-3 py-1.5 rounded-xl group hover:border-accent/30 transition-colors">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-positive-accent"></span>
                                </span>
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">
                                    {liveUsers.toLocaleString()} <span className="hidden sm:inline">Online</span>
                                </span>
                            </div>

                            {currentUser ? (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-accent hover:text-accent text-secondary transition-all shadow-sm group"
                                    >
                                        <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="px-4 py-1.5 bg-foreground text-white font-black rounded-lg transition-all hover:bg-slate-800 active:scale-95 text-[11px] shadow-sm uppercase tracking-wider"
                                >
                                    Log In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Compact Session Header (Point 6) */}
            <div className="pt-20 md:pt-24 px-4 flex-shrink-0">
                <div className="max-w-4xl mx-auto border-b border-slate-100 pb-4">
                    {micDenied ? (
                        <div className="bg-red-50/50 border border-red-100/50 rounded-xl p-3 flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <XSquare className="w-4 h-4" />
                            Microphone permission denied.
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full px-2 py-0.5">
                            {/* Left: Partner Identity */}
                            <div className="flex items-center gap-2.5">
                                {status === 'connected' ? (
                                    <div className="flex items-center gap-3 animate-fade-in">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${getAvatarColor(partnerDisplayName)}`}>
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 line-height-1">
                                                <span className={`${!partnerDisplayName ? 'animate-pulse text-slate-400' : 'text-slate-800'} text-[11px] font-black uppercase tracking-widest truncate max-w-[120px]`}>
                                                    {partnerDisplayName || 'Searching...'}
                                                </span>
                                                <span className="text-sm leading-none">{getFlagEmoji(partnerCountry?.countryCode || null)}</span>
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">
                                                {partnerCountry?.countryName || 'GLOBAL MATCH'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-accent/5 rounded-lg border border-accent/10">
                                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            {status === 'searching' ? 'SEARCHING...' : selectedMode.toUpperCase().replace('-', ' ')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Center: Live Timer */}
                            {status === 'connected' && (
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    <span className="text-[10px] font-black text-slate-700 tracking-tight font-mono whitespace-nowrap">
                                        LIVE: <span className="text-accent">{formatTime(sessionDuration)}</span>
                                    </span>
                                </div>
                            )}

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2.5">
                                {status === 'connected' && currentUser && (
                                    <button
                                        onClick={sendFriendRequest}
                                        className="h-8 flex items-center gap-2 px-3 bg-accent/5 border border-accent/10 rounded-lg hover:bg-accent/10 transition-soft text-accent group/friend"
                                        title="Add Friend"
                                    >
                                        <UserPlus className="w-4 h-4 group-hover/friend:scale-110 transition-transform" />
                                        <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest">Add Friend</span>
                                    </button>
                                )}
                                <div className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-300">
                                    <Globe className={`w-4 h-4 transition-colors ${status === 'connected' ? 'text-accent' : 'text-slate-200'}`} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Content Area */}
            <main className="flex-1 w-full flex flex-col items-center relative overflow-hidden bg-slate-50 pt-4 md:pt-6 pb-32 md:pb-40">
                <div className={`absolute inset-0 transition-opacity duration-1000 -z-10 ${status === 'connected' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-100' : 'opacity-0'}`} />

                {/* Deskop Speaking Indicators */}
                <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center space-y-4 w-32">
                    <SpeakingIndicator isSpeaking={status === 'connected' && isRemoteSpeaking} label="Stranger Speaking" />
                </div>
                <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center space-y-4 w-32">
                    <SpeakingIndicator isSpeaking={status === 'connected' && isLocalSpeaking} label="You Speaking" />
                </div>

                {/* Mobile Speaking Indicators (Compact Top) */}
                <div className="lg:hidden absolute top-0 inset-x-0 flex justify-center gap-8 px-4 z-20 pointer-events-none">
                    <SpeakingIndicator isSpeaking={status === 'connected' && isRemoteSpeaking} label="Stranger" compact />
                    <SpeakingIndicator isSpeaking={status === 'connected' && isLocalSpeaking} label="You" compact />
                </div>

                {/* Chat Container */}
                <div className={`flex-1 w-full max-w-4xl flex flex-col px-4 md:px-6 relative mb-2 transition-soft ${isSwitching ? 'opacity-0 scale-[0.98] translate-y-2 blur-sm' : 'opacity-100 scale-100 translate-y-0'}`}>
                    <div className="flex-1 bg-white border border-slate-100/80 rounded-[1.5rem] flex flex-col overflow-hidden relative shadow-premium-sm">
                        
                        {/* Improved Empty State */}
                        {status === 'connected' && messages.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-fade-in pointer-events-none">
                                <div className="w-16 h-16 bg-accent/5 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110">
                                    <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-2">Practice Started!</h3>
                                <p className="text-xs text-slate-500 font-medium max-w-[240px] leading-relaxed">
                                    You&apos;re now connected 🎉 <br />
                                    <span className="text-accent/80">Start by saying hi!</span>
                                </p>
                            </div>
                        )}

                        {/* Debate Status Overlay */}
                        <DebateStatus
                            data={debateData}
                            onExit={exitDebate}
                            onVote={voteDebate}
                            partnerId={partnerId}
                        />

                        {/* Visualizer Background */}
                        {!micDenied && status === 'connected' && (
                            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.02] transition-opacity duration-1000">
                                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 no-scrollbar relative z-10 scroll-smooth pt-10">
                            
                            {/* Lightweight Topic Suggestion */}
                            {status === 'connected' && currentPrompt && !isSessionFinished && (
                                <div className="mb-6 animate-fade-in-up duration-700 max-w-2xl mx-auto">
                                    <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-2xl flex items-center gap-3.5 shadow-sm transition-all hover:border-accent/30 group">
                                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                            <Sparkles className="w-4 h-4 text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[8px] font-black text-accent uppercase tracking-widest leading-none mb-1">Topic Suggestion</div>
                                            <div className="text-[12px] font-semibold text-slate-600 leading-tight">{currentPrompt}</div>
                                        </div>
                                        <button
                                            onClick={handleNextPrompt}
                                            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-900 hover:text-white rounded-lg text-slate-300 transition-all shrink-0 border border-slate-100 shadow-sm"
                                            title="New Suggestion"
                                        >
                                            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {messages.length > 0 && messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} animate-fade-in-up`}
                                >
                                    <div
                                        className={`max-w-[85%] px-5 py-3 rounded-2xl text-[14px] font-medium leading-relaxed shadow-sm transition-all duration-300 ${msg.sender === 'me'
                                            ? 'bg-slate-900 text-white rounded-tr-none'
                                            : msg.text.startsWith('[SYSTEM]:')
                                                ? 'bg-accent/5 text-accent border border-accent/10 rounded-xl mx-auto !max-w-[90%] py-2 px-6 text-center text-[10px] font-black uppercase tracking-widest shadow-none'
                                                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text.replace('[SYSTEM]:', '').trim()}
                                    </div>
                                    <span className={`mt-1.5 px-2 text-[9px] font-black uppercase tracking-widest ${msg.sender === 'me' ? 'text-accent' : 'text-slate-400'}`}>
                                        {msg.sender === 'me' ? (myDisplayName || 'You') : (partnerDisplayName || 'Partner')}
                                    </span>
                                </div>
                            ))}

                            {isStrangerTyping && (
                                <div className="flex justify-start items-center space-x-2 animate-pulse pl-2">
                                    <div className="flex space-x-1.5 px-4 py-3 bg-slate-50 rounded-xl rounded-tl-none border border-slate-100">
                                        <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0s]" />
                                        <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input Area */}
                        <div className="p-4 md:p-6 bg-white border-t border-slate-100 z-20">
                            {status === 'connected' && (
                                <div className="flex flex-col gap-4">
                                    {/* Prompts Row */}
                                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                        <button
                                            type="button"
                                            onClick={handleNextPrompt}
                                            className="h-8 flex items-center gap-2 px-3 bg-accent/5 border border-accent/10 rounded-lg hover:bg-accent/10 transition-soft shrink-0"
                                        >
                                            <Sparkles className="w-3 h-3 text-accent" />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-accent">New Prompt</span>
                                        </button>
                                        
                                        <div className="h-8 flex items-center bg-slate-50 border border-slate-100 rounded-lg px-2 shrink-0 gap-1.5">
                                            {['😂', '🔥', '👏', '🙌', '💯'].map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => sendReaction(emoji)}
                                                    className="w-6 h-6 flex items-center justify-center hover:scale-125 active:scale-90 transition-soft text-sm"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main Input Box */}
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (inputText.trim()) {
                                                sendMessage(inputText);
                                                setInputText('');
                                            }
                                        }}
                                        className="relative flex items-center gap-2 md:gap-3"
                                    >
                                        <div className="flex-1 relative group">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputText}
                                                onChange={handleInputChange}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Type a message..."
                                                className="w-full bg-slate-50 border border-slate-100/80 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-soft shadow-sm group-hover:bg-white"
                                            />
                                            {isStrangerTyping && (
                                                <div className="absolute -top-7 left-1 flex items-center gap-1.5 animate-fade-in">
                                                    <div className="flex gap-1">
                                                        <span className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                                                        <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                                                        <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                                                    </div>
                                                    <span className="text-[7px] font-black text-accent uppercase tracking-[0.15em]">Partner is typing</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!inputText.trim()}
                                            className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 hover:bg-accent text-white rounded-2xl flex items-center justify-center transition-soft active:scale-95 disabled:opacity-30 shadow-premium-lg hover:shadow-glow-accent-lg group/send"
                                        >
                                            <Send className="w-5 h-5 md:w-5.5 md:h-5.5 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-soft" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Overlays (Searching / Disconnected) */}
                {status === 'searching' && (
                    <div className="absolute inset-x-4 top-4 bottom-24 md:inset-0 flex items-center justify-center bg-white/90 backdrop-blur-md z-40 rounded-[2rem] md:rounded-none animate-in fade-in duration-500">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full blur-2xl bg-accent/10 animate-pulse scale-150" />
                                <div className="w-16 h-16 rounded-full border border-slate-100 flex items-center justify-center relative bg-white shadow-xl">
                                    <Loader2 className="w-8 h-8 text-accent animate-spin relative z-10" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-2 text-center">
                                <h2 className="text-lg font-bold text-slate-800 tracking-tight px-6">
                                    {loadingMessage}
                                </h2>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                                    Matching...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'disconnected' && (
                    <div className="absolute inset-x-4 top-4 bottom-24 md:inset-0 flex items-center justify-center bg-white/95 backdrop-blur-md z-40 rounded-[2rem] md:rounded-none animate-in fade-in duration-300">
                        <div className="flex flex-col items-center space-y-6 p-10 text-center max-w-sm">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-2 border border-slate-100">
                                <XSquare className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Partner Left</h3>
                                <p className="text-slate-500 text-sm">The conversation has ended. Start a new one?</p>
                            </div>
                            <button
                                onClick={handleReconnect}
                                className="flex items-center px-8 py-3.5 bg-accent text-white font-bold rounded-2xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 active:scale-[0.98] text-sm"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Find New Partner
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Symmetrical Bottom Control Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-8 md:pb-10 flex justify-center pointer-events-none">
                <div className="w-full max-w-4xl flex items-center justify-between pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-100 rounded-[2rem] px-6 py-3.5 shadow-premium-xl transition-all duration-500 hover:shadow-premium group/dock">
                    
                    {/* Left: Device Controls */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="flex flex-col items-center gap-1 min-w-[48px]">
                            <button
                                onClick={handleMute}
                                className={`w-11 h-11 rounded-1.5xl flex items-center justify-center transition-all bg-slate-50 border border-slate-100 text-slate-400 hover:text-accent hover:border-accent shadow-sm ${isMuted ? '!bg-red-50 !border-red-100 !text-red-500' : ''}`}
                            >
                                {isMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                            </button>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${isMuted ? 'text-red-500' : 'text-slate-400'}`}>
                                {isMuted ? 'Muted' : 'Mute'}
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-1 min-w-[48px]">
                            <button
                                onClick={handleEnhancedEnd}
                                className="w-11 h-11 rounded-1.5xl flex items-center justify-center transition-all bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 hover:border-slate-300 shadow-sm"
                            >
                                <XSquare className="w-4.5 h-4.5" />
                            </button>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Exit</span>
                        </div>
                    </div>

                    {/* Center: Dominant CTA */}
                    <div className="flex-shrink-0 px-4">
                        <button
                            onClick={handleEnhancedNext}
                            disabled={status === 'idle' || status === 'error' || isSwitching}
                            className={`h-14 md:h-16 px-10 md:px-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-4 transition-all active:scale-95 shadow-glow-dark hover:shadow-glow-dark-lg group/skip ${isSwitching ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] whitespace-nowrap">Skip Partner</span>
                            {isSwitching ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <SkipForward className="w-4 h-4 md:w-5 md:h-5 group-hover/skip:translate-x-1 transition-transform" />
                            )}
                        </button>
                    </div>

                    {/* Right: Social Controls */}
                    <div className="flex items-center justify-end gap-3 flex-1">
                        <div className="flex flex-col items-center gap-1 min-w-[48px]">
                            <button
                                onClick={sendFriendRequest}
                                disabled={status !== 'connected'}
                                className="w-11 h-11 rounded-1.5xl flex items-center justify-center transition-all bg-slate-50 border border-slate-100 text-slate-400 hover:text-accent hover:border-accent shadow-sm disabled:opacity-10"
                            >
                                <UserPlus className="w-4.5 h-4.5" />
                            </button>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Add Friend</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & Overlays */}
            <FeedbackModal
                isOpen={showFeedbackModal}
                sessionDuration={connectionStartTime ? Math.floor((Date.now() - connectionStartTime) / 1000) : 0}
                onClose={() => setShowFeedbackModal(false)}
                onSubmit={(feedback) => {
                    console.log('Feedback received:', feedback);
                    toast.success('Thank you for your feedback! 💖');
                    setIsSwitching(true);
                    setTimeout(async () => {
                        await handleNext();
                        setIsSwitching(false);
                        setShowFeedbackModal(false);
                    }, 400);
                }}
            />

            {showExitDialog && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 rounded-[2rem] bg-accent/5 flex items-center justify-center mx-auto mb-6">
                            <LogOut className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">Leaving already?</h3>
                        <p className="text-secondary mb-8">Want to try one more conversation before you go?</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowExitDialog(false)}
                                className="w-full py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent-hover transition-all shadow-lg active:scale-95"
                            >
                                One more conversation!
                            </button>
                            <button
                                onClick={confirmEnd}
                                className="w-full py-4 bg-white border border-border text-muted font-bold rounded-2xl hover:bg-slate-50 transition-all"
                            >
                                Exit now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ViralShareModal 
                isOpen={showViralModal}
                onClose={() => setShowViralModal(false)}
                countryName={partnerCountry?.countryName}
                countryCode={partnerCountry?.countryCode}
                stats={sessionStats.minutes > 0 ? sessionStats : undefined}
                isReconnectLoop={true}
            />
        </div>
    );
}

function SpeakingIndicator({ isSpeaking, label, compact = false }: { isSpeaking: boolean, label: string, compact?: boolean }) {
    return (
        <div className={`flex flex-col items-center transition-all duration-500 ${isSpeaking ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="relative flex flex-col items-center">
                {isSpeaking && (
                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse-glow -z-10" />
                )}
                {!compact && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent animate-pulse">
                            {label}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    </div>
                )}
                <div className={`flex items-end justify-center space-x-1.5 ${compact ? 'h-6' : 'h-12'}`}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="w-1 bg-accent rounded-full animate-speaking-bar"
                        style={{
                            height: '100%',
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: `${0.6 + Math.random() * 0.4}s`
                        }}
                    />
                ))}
            </div>
            </div>
            {compact && (
                <span className="text-[8px] font-black uppercase tracking-widest text-accent mt-1 animate-pulse">
                    {label}
                </span>
            )}
        </div>
    );
}

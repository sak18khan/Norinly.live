'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Mic, MicOff, SkipForward, XSquare, Flag, Loader2, Users, RefreshCcw, Send,
    UserPlus, User as UserIcon, LogOut, Info, Scale, Check, ArrowRight,
    Bell, Heart, SendHorizontal, Sparkles, Gamepad2, Globe
} from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import { PROMPTS, GAMES, DEBATE_TOPICS } from '@/lib/engagement';
import DebateStatus from '@/components/DebateStatus';
import ProfileModal from '@/components/ProfileModal';
import HeaderFriendsList from '@/components/HeaderFriendsList';

export default function ChatPage() {
    const router = useRouter();
    const {
        status, liveUsers, isMuted, micDenied, partnerId, partnerCountry, lastPartnerId, connectionStartTime,
        messages, isStrangerTyping, isRemoteSpeaking, isLocalSpeaking, activeReactions, activeFilter,
        canvasRef, handleMute, handleNext, handleEnd, handleReconnect, handleReport,
        sendMessage, sendTyping, sendReaction, sendSystemMessage, revealCountry, setActiveFilter,
        currentUser, logout, sendFriendRequest, setShowAuthModal,
        showProfileModal, setShowProfileModal, acceptFriendRequest, declineFriendRequest,
        debateData, offerDebate, acceptDebate, rejectDebate, exitDebate, voteDebate,
        timeLeft, isSessionFinished, selectedMode
    } = useChatContext();

    const [inputText, setInputText] = useState('');
    const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
    const lastPromptIndexRef = useRef<number>(-1);
    const lastGameIndexRef = useRef<number>(-1);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getFlagEmoji = (code: string | null) => {

        if (!code) return '🌍';
        return code
            .toUpperCase()
            .replace(/./g, char =>
                String.fromCodePoint(127397 + char.charCodeAt(0))
            );
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
            sendTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);

        if (!typingTimeoutRef.current) {
            sendTyping(true);
        } else {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            sendTyping(false);
            typingTimeoutRef.current = null;
        }, 2000);

    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
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
            <header className="w-full px-5 py-3 flex justify-between items-center border-b border-border bg-white z-50 shrink-0">
                <div
                    className="text-lg md:text-xl font-bold tracking-tight cursor-pointer select-none text-foreground shrink-0"
                    onClick={() => router.push('/')}
                >
                    Norinly<span className="text-accent">.</span>
                </div>

                <div className="flex items-center space-x-2 text-muted text-[10px] md:text-xs font-bold uppercase tracking-widest mx-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-positive-accent animate-pulse" />
                    <span className="whitespace-nowrap">Live: <strong className="text-secondary ml-0.5">{liveUsers.toLocaleString()}</strong></span>
                </div>

                <div className="flex items-center space-x-2 shrink-0 text-white">
                    {currentUser ? (
                        <div className="flex items-center space-x-1">
                            <HeaderFriendsList />
                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <UserIcon className="w-4 h-4 text-secondary" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-accent text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold hover:bg-accent-hover transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </header>

            <div className="h-10 md:h-12 flex items-center justify-center bg-white border-b border-border shrink-0">
                {micDenied ? (
                    <div className="text-red-400 text-[10px] font-bold px-4 uppercase tracking-widest">Microphone permission denied. Enable in settings.</div>
                ) : (
                    <div className="flex items-center gap-4 text-[10px] md:text-xs text-zinc-400 font-black uppercase tracking-[0.1em] px-4">
                        <div className="flex items-center gap-2 bg-accent/5 text-accent px-4 py-1 rounded-full border border-accent/10">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[150px] font-bold">{selectedMode.replace('-', ' ')} Mode</span>
                        </div>

                        {status === 'connected' && (
                            <>
                                <span className="text-border font-light">|</span>
                                <div className={`flex items-center gap-2 font-mono transition-colors ${timeLeft < 30 ? 'text-red-500 font-bold' : 'text-secondary'}`}>
                                    <span className="tracking-tight">{formatTime(timeLeft)}</span>
                                </div>
                                <span className="text-border font-light">|</span>
                                <span className="flex items-center truncate text-secondary font-medium">
                                    {partnerCountry ? (
                                        <>
                                            <span className="mr-1.5 text-lg leading-none">{getFlagEmoji(partnerCountry.countryCode)}</span>
                                            <span className="truncate max-w-[120px]">{partnerCountry.countryName}</span>
                                        </>
                                    ) : (
                                        'Unknown Location'
                                    )}
                                </span>
                            </>
                        )}
                        {status === 'searching' && (
                            <span className="animate-pulse">Finding a partner...</span>
                        )}
                    </div>
                )}
            </div>

            {/* Main Chat Content Area */}
            <main className="flex-1 w-full flex flex-col items-center relative overflow-hidden bg-slate-50">
                {/* Background Decorations */}
                <div className={`absolute inset-0 transition-opacity duration-1000 -z-10 ${status === 'connected' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background opacity-100' : 'opacity-0'}`} />

                {/* Deskop Speaking Indicators */}
                <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center space-y-4 w-32">
                    <SpeakingIndicator isSpeaking={status === 'connected' && isRemoteSpeaking} label="Stranger Speaking" position="left" />
                </div>
                <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center space-y-4 w-32">
                    <SpeakingIndicator isSpeaking={status === 'connected' && isLocalSpeaking} label="You Speaking" position="right" />
                </div>

                {/* Mobile Speaking Indicators (Compact Top) */}
                <div className="lg:hidden absolute top-4 inset-x-0 flex justify-center gap-8 px-4 z-20 pointer-events-none">
                    <SpeakingIndicator isSpeaking={status === 'connected' && isRemoteSpeaking} label="Stranger" position="top" compact />
                    <SpeakingIndicator isSpeaking={status === 'connected' && isLocalSpeaking} label="You" position="top" compact />
                </div>

                {/* Chat Container */}
                <div className="flex-1 w-full max-w-3xl flex flex-col pt-4 md:pt-6 px-4 md:px-0 relative mb-6">
                    <div className="flex-1 bg-white border border-border rounded-t-[3rem] md:rounded-[3rem] flex flex-col overflow-hidden relative shadow-xl shadow-slate-200/50">

                        {/* Debate Status Overlay */}
                        <DebateStatus
                            data={debateData}
                            onExit={exitDebate}
                            onVote={voteDebate}
                            partnerId={partnerId}
                        />

                        {/* Visualizer Background */}
                        {!micDenied && status === 'connected' && (
                            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 transition-opacity duration-1000">
                                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Topic Prompt Overlay */}
                        {status === 'connected' && currentPrompt && !isSessionFinished && (
                            <div className="absolute top-6 inset-x-6 z-40 animate-in slide-in-from-top-4 duration-500">
                                <div className="bg-white/90 backdrop-blur-md border border-border p-4 rounded-2xl flex items-center gap-4 shadow-lg">
                                    <div className="w-10 h-10 rounded-2xl bg-accent/5 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Topic Suggestion</div>
                                        <div className="text-[14px] font-bold text-foreground leading-tight">{currentPrompt}</div>
                                    </div>
                                    <button
                                        onClick={handleNextPrompt}
                                        className="p-2.5 hover:bg-surface rounded-xl text-muted hover:text-foreground transition-all shrink-0"
                                        title="Next Topic"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Session Finished Overlay */}
                        {isSessionFinished && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-white/90 backdrop-blur-xl animate-in zoom-in-95 fade-in duration-300 text-center">
                                <div className="flex flex-col items-center space-y-8 max-w-sm">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-positive-accent/5 flex items-center justify-center mb-2 border border-positive-accent/10">
                                        <Check className="w-12 h-12 text-positive-accent" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-foreground tracking-tight mb-3">Practice Complete!</h3>
                                        <p className="text-secondary text-lg">Goal reached. Your progress has been saved to your profile.</p>
                                    </div>
                                    <div className="flex flex-col w-full gap-4">
                                        <button
                                            onClick={handleNext}
                                            className="w-full py-5 bg-accent text-white font-bold rounded-2xl hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
                                        >
                                            <SkipForward className="w-5 h-5" />
                                            Next Partner
                                        </button>
                                        <button
                                            onClick={handleEnd}
                                            className="w-full py-5 bg-white border border-border text-secondary font-bold rounded-2xl hover:bg-surface transition-all active:scale-[0.98]"
                                        >
                                            Exit Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar relative z-10 scroll-smooth">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                                    <div className="p-8 rounded-[2rem] bg-surface">
                                        <Users className="w-12 h-12 text-muted" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-foreground font-bold text-lg">Connected!</p>
                                        <p className="text-muted font-medium text-sm">Say hello to get the conversation started.</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} mb-3`}
                                    >
                                        <div className="flex items-center space-x-2 mb-1.5 px-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${msg.sender === 'me' ? 'text-accent' : 'text-muted'}`}>
                                                {msg.sender === 'me' ? 'You' : 'Stranger'}
                                            </span>
                                        </div>
                                        <div
                                            className={`max-w-[85%] px-5 py-3.5 rounded-[1.5rem] text-[14px] md:text-[15px] font-medium transition-all duration-300 ${msg.sender === 'me'
                                                ? 'bg-accent text-white rounded-tr-none shadow-md shadow-accent/10'
                                                : msg.text.startsWith('[SYSTEM]:')
                                                    ? 'bg-slate-50 text-muted border border-border rounded-xl mx-auto !max-w-[92%] shadow-none py-2 px-4 text-center text-[12px] md:text-sm font-bold tracking-tight'
                                                    : 'bg-surface text-foreground border border-border shadow-sm rounded-tl-none'
                                                }`}
                                        >
                                            {msg.text.replace('[SYSTEM]:', '').trim()}
                                        </div>
                                    </div>
                                ))
                            )}

                            {isStrangerTyping && (
                                <div className="flex justify-start items-center space-x-2 animate-pulse mb-6 pl-2">
                                    <div className="flex space-x-1 px-4 py-3 bg-surface rounded-2xl rounded-tl-none border border-border">
                                        <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Floating Reactions */}
                        <div className="absolute inset-x-0 bottom-32 pointer-events-none z-30 flex justify-center h-24">
                            <div className="relative w-full max-w-xs overflow-hidden">
                                {activeReactions.map((reaction) => (
                                    <div
                                        key={reaction.id}
                                        className="absolute bottom-0 text-3xl animate-float-up opacity-0"
                                        style={{
                                            left: `${Math.random() * 80 + 10}%`,
                                            animationDelay: `${Math.random() * 0.2}s`
                                        }}
                                    >
                                        {reaction.emoji}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Message Input & Actions */}
                        <div className="p-4 md:p-6 bg-white border-t border-border mt-auto z-20">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="relative flex items-center gap-2"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={handleInputChange}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-surface border border-border rounded-2xl px-6 py-4 md:py-4.5 text-[14px] md:text-base text-foreground focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all placeholder:text-muted h-[60px]"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="w-[60px] h-[60px] rounded-2xl bg-accent flex items-center justify-center text-white hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 active:scale-95 disabled:opacity-40"
                                >
                                    <SendHorizontal className="w-6 h-6" />
                                </button>
                            </form>

                            {/* Scrollable Quick Actions */}
                            <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar py-0.5">
                                <button
                                    onClick={() => {
                                        const nextPrompt = PROMPTS[(lastPromptIndexRef.current + 1) % PROMPTS.length];
                                        lastPromptIndexRef.current = (lastPromptIndexRef.current + 1) % PROMPTS.length;
                                        setInputText(nextPrompt);
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary">Prompt</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const nextGame = GAMES[(lastGameIndexRef.current + 1) % GAMES.length];
                                        lastGameIndexRef.current = (lastGameIndexRef.current + 1) % GAMES.length;
                                        setInputText(nextGame);
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                                >
                                    <Gamepad2 className="w-3.5 h-3.5 text-positive-accent" />
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary">Game</span>
                                </button>

                                <div className="flex items-center bg-surface border border-border rounded-xl px-2 py-1 shrink-0">
                                    {['😂', '🔥', '👏', '🤯'].map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => sendReaction(emoji)}
                                            className="w-8 h-8 flex items-center justify-center hover:scale-125 transition-transform"
                                        >
                                            <span className="text-base">{emoji}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={revealCountry}
                                    disabled={status !== 'connected'}
                                    className="flex items-center space-x-2 px-4 py-2 bg-accent/5 border border-accent/10 rounded-xl hover:bg-accent/10 transition-colors whitespace-nowrap shrink-0 disabled:opacity-30"
                                >
                                    <Globe className="w-3.5 h-3.5 text-accent" />
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-accent">Guess</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlays (Searching / Disconnected) */}
                {status === 'searching' && (
                    <div className="absolute inset-x-4 top-4 bottom-6 md:inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-40 rounded-[3rem] md:rounded-none animate-in fade-in duration-500">
                        <div className="flex flex-col items-center space-y-8">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full blur-3xl bg-accent/10 animate-pulse scale-150" />
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-accent/5 flex items-center justify-center relative overflow-hidden bg-white shadow-xl">
                                    <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-accent animate-spin relative z-10" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-3 text-center">
                                <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-accent uppercase animate-pulse">
                                    Finding a partner...
                                </span>
                                <p className="text-muted text-sm font-medium">Matching you with another English speaker</p>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'disconnected' && (
                    <div className="absolute inset-x-4 top-4 bottom-6 md:inset-0 flex items-center justify-center bg-white/95 backdrop-blur-xl z-40 rounded-[3rem] md:rounded-none animate-in fade-in duration-300">
                        <div className="flex flex-col items-center space-y-8 p-10 text-center max-w-sm">
                            <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center text-muted mb-2">
                                <XSquare className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">Stranger Left</h3>
                                <p className="text-secondary text-base">The conversation has ended. Would you like to find someone else?</p>
                            </div>
                            {lastPartnerId && (
                                <button
                                    onClick={handleReconnect}
                                    className="flex items-center px-10 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 active:scale-[0.98]"
                                >
                                    <RefreshCcw className="w-5 h-5 mr-3" />
                                    Find New Partner
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Primary Controls (Footer) */}
            <footer className="p-6 md:p-8 bg-white border-t border-border z-50 shrink-0">
                <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
                    <button
                        onClick={handleMute}
                        className={`flex flex-col items-center justify-center w-20 h-20 rounded-3xl transition-all duration-200 border group ${isMuted ? 'bg-red-50 border-red-200 text-red-500 shadow-sm' : 'bg-surface border-border text-muted hover:border-accent/40'}`}
                    >
                        {isMuted ? <MicOff className="w-6 h-6 mb-1.5" /> : <Mic className="w-6 h-6 mb-1.5" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{isMuted ? 'Muted' : 'Mute'}</span>
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={status === 'idle' || status === 'error'}
                        className="flex-1 flex flex-col items-center justify-center h-24 md:h-28 rounded-[2.5rem] bg-accent text-white hover:bg-accent-hover active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-2xl shadow-accent/20 group relative overflow-hidden"
                    >
                        <SkipForward className="w-10 h-10 mb-1.5 group-hover:translate-x-1 transition-transform" />
                        <span className="text-[11px] md:text-sm font-bold uppercase tracking-[0.2em] whitespace-nowrap">Next Partner</span>
                    </button>

                    <button
                        onClick={handleEnd}
                        className="flex flex-col items-center justify-center w-20 h-20 rounded-3xl bg-surface border border-border text-muted hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shrink-0 group"
                    >
                        <XSquare className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">End</span>
                    </button>

                    <button
                        onClick={sendFriendRequest}
                        disabled={status !== 'connected'}
                        className="flex flex-col items-center justify-center w-20 h-20 rounded-3xl bg-surface border border-border text-muted hover:text-accent hover:bg-accent/5 hover:border-accent/20 transition-all shrink-0 disabled:opacity-20 group"
                    >
                        <UserPlus className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-none">Add Friend</span>
                    </button>
                </div>
            </footer>

            {/* Modals & Overlays */}
            <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
            <FriendRequestNotification />
        </div>
    );

    function SpeakingIndicator({ isSpeaking, label, position, compact = false }: { isSpeaking: boolean, label: string, position: 'left' | 'right' | 'top', compact?: boolean }) {
        return (
            <div className={`flex flex-col items-center transition-all duration-500 ${isSpeaking ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                {!compact && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-3 animate-pulse">
                        {label}
                    </span>
                )}
                <div className={`flex items-end justify-center space-x-1 ${compact ? 'h-5' : 'h-10'}`}>
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
                {compact && (
                    <span className="text-[8px] font-black uppercase tracking-widest text-accent mt-1 animate-pulse">
                        {label}
                    </span>
                )}
            </div>
        );
    }

    function FriendRequestNotification() {
        const { pendingFriendRequest, acceptFriendRequest } = useChatContext();

        if (!pendingFriendRequest) return null;

        return (
            <div className="fixed bottom-28 right-4 left-4 md:left-auto md:w-[350px] z-[100] animate-in slide-in-from-bottom-full duration-500">
                <div className="bg-surface/90 backdrop-blur-xl border border-accent/30 rounded-2xl shadow-2xl p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center shrink-0">
                        <Heart className="w-7 h-7 text-accent animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Bell className="w-3.5 h-3.5 text-accent" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-accent">New Request</span>
                        </div>
                        <p className="text-sm font-bold text-foreground truncate">
                            {pendingFriendRequest.fromUsername} wants to connect
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                        <button
                            onClick={() => acceptFriendRequest(pendingFriendRequest.fromUserId)}
                            className="px-4 py-1.5 bg-accent text-white rounded-lg text-xs font-bold hover:bg-accent-hover active:scale-95 transition-all"
                        >
                            Accept
                        </button>
                        <button
                            onClick={declineFriendRequest}
                            className="px-4 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg text-xs font-bold hover:bg-zinc-700 active:scale-95 transition-all"
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

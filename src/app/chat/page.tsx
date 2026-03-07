'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, SkipForward, XSquare, Flag, Loader2, Users, RefreshCcw, Send, UserPlus, User as UserIcon, LogOut, Info, Scale, Check, ArrowRight } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import { PROMPTS, GAMES, DEBATE_TOPICS } from '@/lib/engagement';
import DebateStatus from '@/components/DebateStatus';

export default function ChatPage() {
    const router = useRouter();
    const {
        status, liveUsers, isMuted, micDenied, partnerId, partnerCountry, lastPartnerId, connectionStartTime,
        messages, isStrangerTyping, isRemoteSpeaking, activeReactions, activeFilter,
        canvasRef, handleMute, handleNext, handleEnd, handleReconnect, handleReport,
        sendMessage, sendTyping, sendReaction, sendSystemMessage, revealCountry, setActiveFilter,
        currentUser, logout, sendFriendRequest, setShowAuthModal,
        debateData, offerDebate, acceptDebate, rejectDebate, exitDebate, voteDebate
    } = useChatContext();



    const [inputText, setInputText] = useState('');
    const [seconds, setSeconds] = useState(0);
    const [showDebateModal, setShowDebateModal] = useState(false);
    const lastPromptIndexRef = useRef<number>(-1);
    const lastGameIndexRef = useRef<number>(-1);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'connected' && connectionStartTime) {
            interval = setInterval(() => {
                setSeconds(Math.floor((Date.now() - connectionStartTime) / 1000));
            }, 1000);
        } else {
            setSeconds(0);
        }
        return () => clearInterval(interval);
    }, [status, connectionStartTime]);

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
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30 selection:text-white">
            {/* Top Navigation Bar */}
            <header className="w-full px-6 py-4 flex justify-between items-center border-b border-border bg-surface/30 backdrop-blur-md z-50">
                <div className="flex items-center gap-6">
                    <div
                        className="text-xl font-black tracking-tighter cursor-pointer select-none text-white"
                        onClick={() => router.push('/')}
                    >
                        NORINLY<span className="text-accent">.</span>
                    </div>

                    <div className="flex items-center space-x-2 text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>People talking right now: <strong className="text-zinc-300 ml-1">{liveUsers.toLocaleString()}</strong></span>
                    </div>
                </div>


                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.push('/friends')}
                        className="text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                    >
                        Friends
                    </button>
                    {currentUser ? (
                        <div className="flex items-center space-x-3 bg-surface/50 border border-border px-3 py-1.5 rounded-full">
                            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                                <UserIcon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs font-bold text-white max-w-[100px] truncate">{currentUser.displayName || 'User'}</span>
                            <button onClick={logout} className="p-1 hover:text-red-400 transition-colors">
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-accent/10 border border-accent/20 text-accent px-4 py-1.5 rounded-full text-xs font-bold hover:bg-accent/20 transition-all"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </header>

            {/* Connection Status Banner (Subtle) */}
            <div className="py-2 text-center bg-surface/20 border-b border-border">
                {micDenied ? (
                    <div className="text-red-400 text-sm font-medium">Microphone permission denied. Please enable it in browser settings.</div>
                ) : (
                    <div className="flex items-center justify-center gap-4 text-sm text-zinc-400 font-medium tracking-wide">
                        <span className="flex items-center gap-2">
                            {status === 'searching' && <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />}
                            {status === 'connected' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.7)]" />}
                            {status === 'disconnected' && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.7)]" />}

                            {status === 'searching' && 'Searching for a stranger...'}
                            {status === 'connected' && 'Connected'}
                            {status === 'disconnected' && 'Stranger disconnected'}
                            {status === 'idle' && 'Starting up...'}
                            {status === 'error' && 'Error connecting'}
                        </span>

                        {status === 'connected' && (
                            <>
                                <span>•</span>
                                <span className="font-mono text-zinc-400">{formatTime(seconds)}</span>
                                <span>•</span>
                                <span className="flex items-center">
                                    Stranger from {partnerCountry ? (
                                        <span className="ml-1.5 flex items-center">
                                            <span className="mr-1.5 text-lg leading-none">{getFlagEmoji(partnerCountry.countryCode)}</span>
                                            <span className="text-zinc-200">{partnerCountry.countryName}</span>
                                        </span>
                                    ) : (
                                        <span className="ml-1.5 text-zinc-200">🌍 Unknown location</span>
                                    )}
                                </span>
                            </>
                        )}
                    </div>
                )}

            </div>


            {/* Main Content (Visualizer & Chat) */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className={`absolute inset-0 transition-opacity duration-1000 -z-10 ${status === 'connected' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background opacity-100' : 'opacity-0'}`} />

                {status === 'connected' && isRemoteSpeaking && (
                    <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <span className="flex items-center text-[11px] font-black text-accent animate-pulse px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 tracking-widest uppercase">
                            <span className="mr-2">🔊</span> Stranger speaking...
                        </span>
                    </div>
                )}

                <div className="w-full max-w-2xl h-[60vh] md:h-[500px] rounded-3xl bg-surface/30 border border-border shadow-2xl flex flex-col overflow-hidden relative backdrop-blur-sm transition-all duration-500">

                    {/* Debate Status Overlay */}
                    <DebateStatus
                        data={debateData}
                        onExit={exitDebate}
                        onVote={voteDebate}
                        partnerId={partnerId}
                    />

                    {/* Visualizer Background (Overlay when connected) */}
                    {!micDenied && status === 'connected' && (
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full object-cover grayscale"
                                width={800}
                                height={400}
                            />
                        </div>
                    )}

                    {!micDenied && status !== 'connected' && (
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-cover transition-opacity duration-500 opacity-40 grayscale-[0.8]"
                            width={800}
                            height={400}
                        />
                    )}

                    {/* Chat Area */}
                    {status === 'connected' && (
                        <div className="flex-1 flex flex-col overflow-hidden z-10">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                <div className="text-center mb-6">
                                    <span className="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-500 text-[10px] font-bold uppercase tracking-widest border border-zinc-700/30">
                                        Secure voice & text connection established
                                    </span>
                                </div>
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className="flex items-center space-x-1 mb-1 px-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.sender === 'me' ? 'text-accent' : 'text-zinc-500'}`}>
                                                {msg.sender === 'me' ? 'You' : 'Stranger'}
                                            </span>
                                        </div>
                                        <div
                                            className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm leading-relaxed transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${msg.sender === 'me'
                                                ? 'bg-accent text-white rounded-tr-none'
                                                : msg.text.startsWith('[SYSTEM]:')
                                                    ? 'bg-zinc-800/90 text-zinc-100 border border-zinc-700/50 rounded-xl mx-auto !max-w-[95%] shadow-lg'
                                                    : 'bg-zinc-800/80 text-zinc-100 border border-zinc-700/50 rounded-tl-none'
                                                }`}
                                        >
                                            {msg.text.startsWith('[SYSTEM]:') ? (
                                                <div className="flex flex-col gap-1 py-1">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-accent/80 mb-0.5">
                                                        <div className="w-1 h-1 rounded-full bg-accent" />
                                                        {msg.text.includes('Prompt:') ? 'Conversation Starter' : msg.text.includes('Game:') ? 'Mini Game' : 'System Notification'}
                                                    </div>
                                                    <div className="text-sm font-medium leading-relaxed">
                                                        {msg.text.replace('[SYSTEM]: ', '').replace('Prompt: ', '').replace('Game: ', '')}
                                                    </div>
                                                </div>
                                            ) : msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Stranger is Typing Indicator (Relocated above input) */}
                            {isStrangerTyping && (
                                <div className="px-6 py-2 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex space-x-1 bg-zinc-800/40 px-3 py-1.5 rounded-full border border-zinc-700/30">
                                        <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">Stranger is typing...</span>
                                </div>
                            )}


                            {/* Floating Reactions Overlay */}
                            <div className="absolute inset-x-0 bottom-24 pointer-events-none z-30 flex justify-center">
                                <div className="relative w-full max-w-xs h-32">
                                    {activeReactions.map((reaction) => (
                                        <div
                                            key={reaction.id}
                                            className="absolute bottom-0 text-4xl animate-float-up opacity-0"
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

                            {/* Engagement Buttons Row */}
                            <div className="px-4 py-2 bg-surface/30 border-t border-border flex items-center justify-center space-x-2 overflow-x-auto no-scrollbar">
                                <button
                                    onClick={() => {
                                        let randomIndex;
                                        do {
                                            randomIndex = Math.floor(Math.random() * PROMPTS.length);
                                        } while (randomIndex === lastPromptIndexRef.current && PROMPTS.length > 1);

                                        lastPromptIndexRef.current = randomIndex;
                                        const randomPrompt = PROMPTS[randomIndex];
                                        sendSystemMessage(`Prompt: ${randomPrompt}`);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/30 text-[11px] font-bold text-zinc-300 flex items-center space-x-1 transition-all whitespace-nowrap"
                                >
                                    <span>🎲</span> <span>Prompt</span>
                                </button>
                                <button
                                    onClick={() => {
                                        let randomIndex;
                                        do {
                                            randomIndex = Math.floor(Math.random() * GAMES.length);
                                        } while (randomIndex === lastGameIndexRef.current && GAMES.length > 1);

                                        lastGameIndexRef.current = randomIndex;
                                        const randomGame = GAMES[randomIndex];
                                        sendSystemMessage(`Game: ${randomGame}`);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/30 text-[11px] font-bold text-zinc-300 flex items-center space-x-1 transition-all whitespace-nowrap"
                                >
                                    <span>🎮</span> <span>Game</span>
                                </button>
                                <div className="h-4 w-px bg-border mx-1 shrink-0" />
                                {['😂', '🔥', '👏', '🤯'].map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => sendReaction(emoji)}
                                        className="w-8 h-8 rounded-full bg-zinc-800/50 hover:bg-accent/20 hover:border-accent/40 border border-zinc-700/30 flex items-center justify-center text-sm transition-all hover:scale-110 active:scale-90"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                                <div className="h-4 w-px bg-border mx-1 shrink-0" />
                                <button
                                    onClick={revealCountry}
                                    className="px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/20 text-[11px] font-bold text-accent flex items-center space-x-1 transition-all whitespace-nowrap"
                                >
                                    <span>🌍</span> <span>Guess Country</span>
                                </button>
                                <div className="h-4 w-px bg-border mx-1 shrink-0" />
                                <button
                                    onClick={() => setShowDebateModal(true)}
                                    disabled={debateData.status !== 'idle'}
                                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold flex items-center space-x-1 transition-all whitespace-nowrap ${debateData.status !== 'idle' ? 'bg-accent/20 border-accent/40 text-accent cursor-default' : 'bg-zinc-800/50 hover:bg-accent/10 hover:border-accent/30 text-zinc-300 hover:text-accent border-zinc-700/30'}`}
                                >
                                    <Scale className="w-3.5 h-3.5" /> <span>Debate Mode</span>
                                </button>
                            </div>

                            {/* Debate Invitation Overlay */}
                            {debateData.status === 'offered' && (
                                <div className="p-4 bg-accent/10 border-t border-accent/20 animate-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                                <Scale className="w-5 h-5 text-accent" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white uppercase tracking-widest">Debate Invitation</span>
                                                <span className="text-[10px] text-accent font-bold">Stranger wants to start a structured debate</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={rejectDebate}
                                                className="px-4 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-700 transition-all"
                                            >
                                                Decline
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const randomTopic = DEBATE_TOPICS[Math.floor(Math.random() * DEBATE_TOPICS.length)];
                                                    acceptDebate(randomTopic);
                                                }}
                                                className="px-4 py-1.5 rounded-lg bg-accent border border-accent text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-all"
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Chat Input Area */}
                            <div className="p-4 bg-surface/50 border-t border-border flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-zinc-900/50 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputText.trim()}
                                    className="p-3 bg-accent text-white rounded-xl hover:bg-accent-hover hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Debate Invitation Waiting Overlay */}
                {debateData.status === 'offered' && !isStrangerTyping && !isRemoteSpeaking && (
                    <div className="absolute inset-x-0 bottom-32 p-4 z-40 pointer-events-none text-center">
                        <div className="mx-auto max-w-sm bg-zinc-900/90 border border-accent/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 duration-500 pointer-events-auto">
                            <div className="flex flex-col items-center space-y-3">
                                <Scale className="w-8 h-8 text-accent animate-pulse" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-white uppercase tracking-tight">Waiting for response</span>
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">You invited the stranger to a debate</span>
                                </div>
                                <button
                                    onClick={rejectDebate}
                                    className="w-full py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-700 transition-all"
                                >
                                    Cancel Invitation
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'searching' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-md animate-in fade-in duration-500 z-20">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full blur-2xl bg-accent/20 animate-pulse scale-150" />
                                <div className="w-20 h-20 rounded-full border-2 border-accent/20 flex items-center justify-center relative overflow-hidden">
                                    <Loader2 className="w-10 h-10 text-accent animate-spin relative z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent animate-pulse" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <span className="text-sm font-black tracking-[0.3em] text-white uppercase animate-pulse">
                                    Finding someone new
                                </span>
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest animate-pulse delay-75">
                                    Connecting to world...
                                </span>
                            </div>
                        </div>
                    </div>
                )}


                {status === 'disconnected' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-md animate-in fade-in duration-300 z-20">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-2">
                                <XSquare className="w-10 h-10" />
                            </div>
                            <span className="text-zinc-300 font-medium">The stranger has left the chat.</span>

                            {lastPartnerId && (
                                <button
                                    onClick={handleReconnect}
                                    className="mt-4 flex items-center px-6 py-3 bg-accent/20 border border-accent/50 text-accent rounded-full hover:bg-accent/30 transition-colors"
                                >
                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                    Reconnect with previous stranger
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main >

            {/* Footer Controls */}
            <footer className="p-6 pb-10 bg-surface/80 border-t border-border backdrop-blur-md z-20">
                <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handleMute}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl flex-1 transition-all duration-200 border group ${isMuted ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20' : 'bg-surface border-border text-zinc-300 hover:bg-surface hover:text-white'}`}
                    >
                        {isMuted ? <MicOff className="w-6 h-6 mb-2" /> : <Mic className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />}
                        <span className="text-xs font-semibold uppercase tracking-wider">{isMuted ? 'Muted' : 'Mute'}</span>
                    </button>

                    <div className="hidden md:flex flex-col items-center space-y-1">
                        <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Filters</span>
                        <div className="flex bg-surface border border-border rounded-xl p-1 shrink-0">
                            {[
                                { id: 'none', icon: '🎤' },
                                { id: 'robot', icon: '🤖' },
                                { id: 'deep', icon: '🐻' },
                                { id: 'chipmunk', icon: '🐿️' },
                                { id: 'alien', icon: '👽' }
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    title={f.id}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${activeFilter === f.id ? 'bg-accent text-white' : 'text-zinc-500 hover:bg-zinc-800'}`}
                                >
                                    {f.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={status === 'idle' || status === 'error'}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl flex-2 bg-accent text-white border border-accent hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] cursor-pointer"
                    >
                        <SkipForward className="w-7 h-7 mb-2" />
                        <span className="text-sm font-bold uppercase tracking-wider">Next Stranger</span>
                    </button>

                    <button
                        onClick={handleEnd}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl flex-1 bg-surface border border-border text-zinc-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all duration-200 group cursor-pointer"
                    >
                        <XSquare className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold uppercase tracking-wider">End</span>
                    </button>

                    <button
                        onClick={handleReport}
                        disabled={status !== 'connected' && status !== 'disconnected'}
                        title="Report this user"
                        className="flex flex-col items-center justify-center p-4 rounded-2xl flex-1 bg-surface border border-border text-zinc-500 hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-500 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none group cursor-pointer"
                    >
                        <Flag className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Report</span>
                    </button>

                    <button
                        onClick={sendFriendRequest}
                        disabled={status !== 'connected'}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl flex-1 bg-surface border border-border text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none group cursor-pointer"
                    >
                        <UserPlus className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Add Friend</span>
                    </button>
                </div>
            </footer>

            {/* Debate Mode Confirmation Modal */}
            {showDebateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-zinc-900 border border-border rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                                <Scale className="w-10 h-10 text-accent" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Start Debate Mode?</h3>
                            <p className="text-sm text-zinc-400 font-medium mb-8 leading-relaxed">
                                This will start a structured debate with timed rounds. Microphones will be automatically controlled based on whose turn it is.
                            </p>
                            <div className="w-full flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        offerDebate();
                                        setShowDebateModal(false);
                                    }}
                                    className="w-full py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest hover:bg-accent-hover transition-all flex items-center justify-center gap-2 group"
                                >
                                    Start Debate <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => setShowDebateModal(false)}
                                    className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-700 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

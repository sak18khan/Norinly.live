'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    Mic, MicOff, SkipForward, XSquare, Loader2, Users, RefreshCcw, Send,
    User as UserIcon, LogOut, Info, Sparkles, MessageSquare, Timer, ChevronRight, Globe, Mic2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useChatContext } from '@/context/ChatContext';
import { SCENARIOS } from '@/scenarios';
import { getFlagEmoji } from '@/lib/identity-utils';

export default function RoleplayRoomPage() {
    const router = useRouter();
    const params = useParams();
    const { 
        status, partnerId, roleplayData, partnerDisplayName, partnerCountry,
        messages, isStrangerTyping, isRemoteSpeaking, isLocalSpeaking,
        handleMute, handleEnd, handleNext, sendMessage, sendTyping, sendStopTyping,
        isMuted, myDisplayName, sessionDuration
    } = useChatContext();

    const [inputText, setInputText] = useState('');
    const [showInstructions, setShowInstructions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scenario = SCENARIOS.find(s => s.id === roleplayData.scenario);
    const myRole = roleplayData.role === 'A' ? scenario?.roles.A : scenario?.roles.B;
    const partnerRole = roleplayData.role === 'A' ? scenario?.roles.B : scenario?.roles.A;
    const myPrompts = roleplayData.role === 'A' ? scenario?.prompts.A : scenario?.prompts.B;

    useEffect(() => {
        if (status === 'disconnected') {
            router.push('/roleplay');
        } else if (status === 'idle') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (status === 'connected') {
            const timer = setTimeout(() => setShowInstructions(false), 8000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (inputText.trim()) {
            sendMessage(inputText);
            setInputText('');
            sendStopTyping();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        if (e.target.value.length > 0) {
            sendTyping(true);
        } else {
            sendStopTyping();
        }
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!scenario) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen h-screen flex flex-col bg-background selection:bg-accent/10 selection:text-accent overflow-hidden text-foreground">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-glass border border-border shadow-premium">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-premium-sm">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-sm font-black text-foreground uppercase tracking-widest leading-none mb-1">Roleplay Mode</h1>
                                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{scenario.title}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 bg-surface-alt border border-border px-4 py-2 rounded-xl shadow-sm">
                                <Timer className="w-4 h-4 text-accent" />
                                <span className="text-xs font-black text-foreground font-mono">{formatTime(sessionDuration)}</span>
                            </div>
                            <button 
                                onClick={handleEnd}
                                className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Role Info Bar */}
            <div className="pt-24 px-4 flex-shrink-0">
                <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
                    <div className="bg-surface border-2 border-accent/20 rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-fade-in-up">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[8px] font-black text-accent uppercase tracking-widest block mb-0.5">Your Role</span>
                            <span className="text-sm font-black text-foreground uppercase tracking-tight">{myRole}</span>
                        </div>
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-fade-in-up [animation-delay:100ms]">
                        <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center text-muted-text">
                             <span className="text-base">{getFlagEmoji(partnerCountry?.countryCode || null)}</span>
                        </div>
                        <div>
                            <span className="text-[8px] font-black text-muted-text uppercase tracking-widest block mb-0.5">Partner Role</span>
                            <span className="text-sm font-black text-foreground uppercase tracking-tight">{partnerRole}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <main className="flex-1 w-full flex flex-col items-center relative overflow-hidden bg-background pt-6 pb-40">
                {/* Messages Container */}
                <div className="flex-1 w-full max-w-4xl flex flex-col px-4 md:px-6 relative">
                    <div className="flex-1 bg-surface border border-border rounded-[2rem] flex flex-col overflow-hidden relative shadow-premium">
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar pt-10">
                            {/* Scenario Description */}
                            <div className="bg-accent/5 border border-accent/10 p-5 rounded-2xl mb-8 animate-fade-in">
                                <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2 text-center">Current Scenario</h4>
                                <p className="text-xs text-secondary-text font-medium text-center leading-relaxed italic">
                                    "{scenario.description}"
                                </p>
                            </div>

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} animate-fade-in-up`}
                                >
                                    <div
                                        className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.sender === 'me'
                                            ? 'bg-foreground text-background rounded-tr-none'
                                            : 'bg-surface-alt text-foreground border border-border rounded-tl-none'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className={`mt-1.5 px-2 text-[9px] font-black uppercase tracking-widest ${msg.sender === 'me' ? 'text-accent' : 'text-muted-text'}`}>
                                        {msg.sender === 'me' ? myRole : partnerRole}
                                    </span>
                                </div>
                            ))}

                            {isStrangerTyping && (
                                <div className="flex justify-start items-center space-x-2 animate-pulse">
                                    <div className="flex space-x-1.5 px-4 py-3 bg-surface-alt rounded-xl rounded-tl-none border border-border">
                                        <div className="w-1 h-1 bg-muted-text/30 rounded-full animate-bounce [animation-delay:0s]" />
                                        <div className="w-1 h-1 bg-muted-text/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1 h-1 bg-muted-text/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Prompt Suggestions */}
                        <div className="p-4 bg-surface-alt/50 border-t border-border">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg text-accent text-[8px] font-black uppercase tracking-widest shrink-0">
                                    Your Prompts
                                </div>
                                {myPrompts?.map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(prompt)}
                                        className="h-8 flex items-center px-4 bg-surface border border-border rounded-lg text-[10px] font-bold text-secondary-text whitespace-nowrap hover:border-accent hover:text-accent transition-all shadow-sm group"
                                    >
                                        {prompt}
                                        <ChevronRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 md:p-6 bg-surface border-t border-border">
                             <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                                <div className="flex-1">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputText}
                                        onChange={handleInputChange}
                                        placeholder={`Message the ${partnerRole}...`}
                                        className="w-full bg-surface-alt border border-border rounded-2xl px-5 py-4 text-sm font-medium text-foreground placeholder:text-muted-text/60 focus:outline-none focus:border-accent/20 transition-all shadow-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="w-12 h-12 md:w-14 md:h-14 bg-foreground text-background hover:bg-accent hover:text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-30 shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Controls */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-8 flex justify-center pointer-events-none">
                <div className="w-full max-w-4xl flex items-center justify-between pointer-events-auto bg-surface/90 backdrop-blur-md border border-border rounded-[2rem] px-6 py-4 shadow-premium">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={handleMute}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-surface-alt border border-border text-muted-text hover:text-accent hover:border-accent shadow-sm ${isMuted ? '!bg-red-500/10 !border-red-500/20 !text-red-500' : ''}`}
                            >
                                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-text">{isMuted ? 'Muted' : 'Mute'}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                         <div className="px-6 py-3 bg-foreground text-background rounded-2xl flex items-center gap-3 shadow-premium">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Session</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={handleNext}
                                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-surface-alt border border-border text-muted-text hover:text-foreground hover:border-accent transition-soft shadow-sm"
                            >
                                <SkipForward className="w-5 h-5" />
                            </button>
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-text">Next</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions Overlay */}
            {showInstructions && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-surface border border-border rounded-[3rem] p-10 max-w-md w-full text-center shadow-premium animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 rounded-[2rem] bg-accent/10 flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-10 h-10 text-accent" />
                        </div>
                        <h2 className="text-3xl font-black text-foreground mb-2">Role assigned!</h2>
                        <p className="text-secondary-text font-medium mb-8">
                            You are the <span className="text-accent font-black uppercase">{myRole}</span>.
                            <br />
                            Use the prompts below your messages to guide the conversation.
                        </p>
                        <button
                            onClick={() => setShowInstructions(false)}
                            className="w-full py-4 bg-accent text-white font-black rounded-2xl shadow-glow-accent hover:bg-accent-hover transition-all active:scale-95 uppercase tracking-widest text-xs"
                        >
                            I'm Ready
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

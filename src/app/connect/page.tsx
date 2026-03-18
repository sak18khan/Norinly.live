'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Loader2, Mic2, Users, ArrowLeft, Shield, Sparkles, Globe, Laptop, MessageSquare } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';

function ConnectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const source = searchParams.get('source');

    const { status, requestMicrophoneAndJoin, errorDetail, roleplayData, partnerId } = useChatContext();

    const [isPreferencesOpen, setIsPreferencesOpen] = useState(true);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [loadingMessage, setLoadingMessage] = useState('Finding someone to talk to...');

    useEffect(() => {
        const scenario = searchParams.get('scenario');
        if (mode === 'roleplay' && scenario && isPreferencesOpen) {
            setIsPreferencesOpen(false);
            handleStartSearch('casual', scenario); // We pass scenario as second arg if we update requestMicrophoneAndJoin
        }
    }, [mode, searchParams]);

    useEffect(() => {
        if (status === 'searching') {
            const messages = [
                'Finding a great partner for you...',
                'Connecting to the global community...',
                'Setting up your practice session...',
                'Almost there...',
                'Joining the conversation...'
            ];
            let i = 0;
            const interval = setInterval(() => {
                i = (i + 1) % messages.length;
                setLoadingMessage(messages[i]);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [status]);

    useEffect(() => {
        if (status === 'connected') {
            if (roleplayData && roleplayData.scenario) {
                router.push(`/roleplay/${partnerId}`);
            } else {
                router.push('/chat');
            }
        }
    }, [status, router, roleplayData, partnerId]);

    // Debate Mode Route Guard and Direct Entry
    useEffect(() => {
        if (mode === 'debate') {
            if (source === 'homepage') {
                // Direct entry from homepage: skip selection and start search
                setIsPreferencesOpen(false);
                handleStartSearch('debate');
            } else {
                // Attempted access from elsewhere: reset to normal mode
                router.replace('/connect');
            }
        }
    }, [mode, source]);

    const handleStartSearch = async (selectedMode: 'casual' | 'debate' | 'interview' | 'pronunciation' = 'casual', scenario?: string) => {
        setIsPreferencesOpen(false);
        // Updated requestMicrophoneAndJoin to accept interests, country, mode, scenario
        // Wait, let's check the actual signature again.
        await requestMicrophoneAndJoin(selectedInterests, selectedCountry, selectedMode, scenario);
    };



    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden bg-mesh">
            <header className="absolute top-0 left-0 w-full p-8 z-20">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center space-x-3 group px-5 py-3 rounded-2xl bg-white/50 backdrop-blur-md border border-border hover:bg-white hover:border-accent/30 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 text-accent group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black text-foreground text-sm uppercase tracking-widest">Back</span>
                </button>
            </header>

            {isPreferencesOpen ? (
                <div className="w-full max-w-2xl bg-white border border-border rounded-[3.5rem] p-10 md:p-14 shadow-premium relative animate-fade-in-up">
                    <div className="space-y-4 mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-accent text-xs font-black uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" /> Smart Matching
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight uppercase italic">Find Your <br /><span className="text-accent underline decoration-accent/10 underline-offset-4 not-italic">Practice Partner.</span></h2>
                        <p className="text-zinc-600 text-lg font-bold leading-relaxed uppercase tracking-tight">
                            Our smart algorithm pairs you with the best speaker for your goals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-12">
                        {[
                            { id: 'casual', title: 'Casual Chat', desc: 'Relaxed conversation on any topic', icon: <MessageSquare className="w-6 h-6" />, color: 'text-accent', locked: false },
                            { id: 'interview', title: 'Interview Prep', desc: 'Mock interviews & professional skill', icon: <Laptop className="w-6 h-6" />, color: 'text-secondary-accent', locked: true },
                            { id: 'pronunciation', title: 'Pronunciation', desc: 'Focus on accent & sounding natural', icon: <Shield className="w-6 h-6" />, color: 'text-positive-accent', locked: true },
                        ].map((option) => (
                            <button
                                key={option.id}
                                onClick={() => !option.locked && handleStartSearch(option.id as 'casual' | 'debate' | 'interview' | 'pronunciation')}
                                className={`flex items-center gap-6 p-6 rounded-3xl bg-surface border border-transparent transition-all text-left group relative overflow-hidden ${option.locked ? 'opacity-70 grayscale-[0.5] cursor-not-allowed' : 'hover:border-accent/30 hover:bg-white hover:shadow-premium'}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${option.color}`}>
                                    {option.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                                        {option.title}
                                    </h3>
                                    <p className="text-sm font-medium text-secondary">{option.desc}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {option.locked ? (
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <X className="w-4 h-4" />
                                            </div>
                                            <span className="text-[8px] font-black text-accent uppercase tracking-widest whitespace-nowrap">Upgrade to unlock</span>
                                        </div>
                                    ) : (
                                        <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-accent">
                                            <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-t border-border pt-8">
                        <Shield className="w-3 h-3 text-positive-accent" /> Secure & Anonymous Voice Matching
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-12 animate-fade-in-up">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full blur-[100px] bg-accent/30 animate-pulse-glow" />
                        <div className="relative w-56 h-56 bg-white rounded-full border border-border shadow-premium flex items-center justify-center overflow-hidden animate-pulse-subtle">
                            <div className="absolute inset-4 border-2 border-dashed border-accent/20 rounded-full animate-spin [animation-duration:15s]" />
                            <div className="absolute inset-8 border border-accent/10 rounded-full animate-spin [animation-duration:8s] reverse" />
                            <div className="flex items-end gap-1.5 h-12 relative z-10">
                                {[0, 1, 2, 3, 4, 3, 2, 1, 0].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-2 bg-accent rounded-full animate-speaking-bar"
                                        style={{ height: '100%', animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-6 max-w-sm">
                        <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight min-h-[4rem]">
                            {status === 'initializing' && 'Preparing session...'}
                            {status === 'requesting_mic' && 'Permission Required'}
                            {status === 'searching' && loadingMessage}
                            {status === 'connected' && 'Partner Found!'}
                            {status === 'error' && 'Connection error'}
                            {status === 'idle' && 'Ready to go'}
                        </h1>
                        <div className="min-h-[3rem] px-4">
                            <p className="text-secondary font-medium text-lg leading-relaxed">
                                {!window.isSecureContext && (
                                    <span className="text-red-500 font-black block mb-2">HTTPS required for Mic access</span>
                                )}
                                {status === 'requesting_mic' && 'Please allow microphone access to join the voice practice.'}
                                {status === 'searching' && loadingMessage}
                                {status === 'error' && (errorDetail || 'Could not connect. Please check your mic.')}
                            </p>
                        </div>
                    </div>

                    {(status === 'error' || status === 'disconnected') && (
                        <button
                            onClick={() => setIsPreferencesOpen(true)}
                            className="px-10 py-4 bg-accent text-white font-black rounded-2xl shadow-glow hover:bg-accent-hover transition-all hover:scale-105 active:scale-95"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ConnectPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
        }>
            <ConnectContent />
        </Suspense>
    );
}


'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import AIPracticeSetup from '@/components/AIPracticeSetup';

const INTERESTS = ['Music', 'Gaming', 'Travel', 'Startups', 'Language Practice', 'Movies', 'Sports', 'Art'];
const COUNTRIES = [
    'United States', 'United Kingdom', 'Canada', 'Australia',
    'India', 'Germany', 'France', 'Japan', 'Brazil', 'South Korea', 'Other'
];

function ConnectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') === 'debate' ? 'debate' : 'normal';

    const { status, requestMicrophoneAndJoin, errorDetail } = useChatContext();

    const [practiceType, setPracticeType] = useState<'ai' | 'people' | null>(null);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(true);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    useEffect(() => {
        if (status === 'connected') {
            router.push('/chat');
        }
    }, [status, router]);

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(prev => prev.filter(i => i !== interest));
        } else {
            if (selectedInterests.length < 3) {
                setSelectedInterests(prev => [...prev, interest]);
            }
        }
    };

    const handleStartSearch = async (selectedMode: string = 'casual') => {
        setIsPreferencesOpen(false);
        await requestMicrophoneAndJoin(selectedInterests, selectedCountry, selectedMode as any);
    };

    if (status === 'idle' && isPreferencesOpen && !practiceType) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
                {/* Logo in Header */}
                <header className="absolute top-0 left-0 w-full p-6 z-20">
                    <div
                        className="text-2xl font-bold tracking-tight cursor-pointer select-none text-foreground inline-block"
                        onClick={() => router.push('/')}
                    >
                        Norinly<span className="text-accent">.</span>
                    </div>
                </header>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background -z-10" />

                <div className="bg-white border border-border rounded-[2.5rem] w-full max-w-xl p-10 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
                    <h2 className="text-4xl font-bold text-foreground mb-4 text-center tracking-tight">Choose Your Practice Mode</h2>
                    <p className="text-secondary text-lg mb-12 text-center">
                        Select how you want to learn English today.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <button
                            onClick={() => setPracticeType('ai')}
                            className={`flex flex-col items-center gap-6 p-8 rounded-3xl border transition-all group relative ${
                                practiceType === 'ai'
                                    ? 'bg-[#F0F9FF] border-[#0EA5E9] border-2 shadow-sm'
                                    : 'bg-white border-border hover:border-accent hover:shadow-md'
                            }`}
                        >
                            <div className="text-5xl p-5 bg-[#F8FAFC] rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                🤖
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground font-bold text-xl mb-2">Practice With AI</h3>
                                <p className="text-secondary text-sm font-medium leading-relaxed">Talk to an AI partner to build confidence</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setPracticeType('people')}
                            className={`flex flex-col items-center gap-6 p-8 rounded-3xl border transition-all group relative ${
                                practiceType === 'people'
                                    ? 'bg-[#F0F9FF] border-[#0EA5E9] border-2 shadow-sm'
                                    : 'bg-white border-border hover:border-accent hover:shadow-md'
                            }`}
                        >
                            <div className="text-5xl p-5 bg-[#F8FAFC] rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                🌍
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground font-bold text-xl mb-2">Practice With People</h3>
                                <p className="text-secondary text-sm font-medium leading-relaxed">Real conversations with English learners</p>
                            </div>
                        </button>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-2 text-muted hover:text-secondary text-sm font-bold transition-colors"
                    >
                        Cancel and return home
                    </button>
                </div>
            </div>
        );
    }

    // AI Practice Setup Screen
    if (practiceType === 'ai' && isPreferencesOpen) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
                {/* Logo in Header */}
                <header className="absolute top-0 left-0 w-full p-6 z-20">
                    <div
                        className="text-2xl font-bold tracking-tight cursor-pointer select-none text-foreground inline-block"
                        onClick={() => {
                            setPracticeType(null);
                        }}
                    >
                        <span className="mr-2 text-accent">←</span> Norinly<span className="text-accent">.</span>
                    </div>
                </header>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background -z-10" />

                <AIPracticeSetup onCancel={() => setPracticeType(null)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Logo in Header */}
            <header className="absolute top-0 left-0 w-full p-6 z-20">
                <div
                    className="text-2xl font-bold tracking-tight cursor-pointer select-none text-foreground inline-block"
                    onClick={() => {
                        if (practiceType) {
                            setPracticeType(null);
                        } else {
                            router.push('/');
                        }
                    }}
                >
                    {practiceType && <span className="mr-2 text-accent">←</span>}
                    Norinly<span className="text-accent">.</span>
                </div>
            </header>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background -z-10" />

            {isPreferencesOpen ? (
                <div className="bg-white border border-border rounded-[2.5rem] w-full max-w-xl p-10 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
                    <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">Configure Practice</h2>
                    <p className="text-secondary text-lg mb-10 font-medium">
                        Select a conversation goal to match with the right partner.
                    </p>

                    <div className="grid grid-cols-1 gap-4 mb-10">
                        {[
                            { id: 'casual', title: 'Casual Conversation', desc: 'Talk freely and improve speaking confidence', icon: '🗣️' },
                            { id: 'interview', title: 'Job Interview Practice', desc: 'Practice answering common interview questions', icon: '💼' },
                            { id: 'debate', title: 'Debate Mode', desc: 'Discuss topics and express your opinions', icon: '🔥' },
                            { id: 'business', title: 'Business English', desc: 'Professional conversations and terminology', icon: '👔' },
                            { id: 'pronunciation', title: 'Pronunciation Practice', desc: 'Focus on speaking clearly and accurately', icon: '🎯' },
                        ].map((modeOption) => (
                            <button
                                key={modeOption.id}
                                onClick={() => {
                                    handleStartSearch(modeOption.id);
                                }}
                                className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-border hover:border-accent hover:shadow-md transition-all text-left group"
                            >
                                <div className="text-4xl p-4 bg-[#F8FAFC] rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                    {modeOption.icon}
                                </div>
                                <div>
                                    <h3 className="text-foreground font-bold text-lg mb-1">{modeOption.title}</h3>
                                    <p className="text-secondary text-sm font-medium">{modeOption.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPracticeType(null)}
                        className="w-full py-2 text-muted hover:text-secondary text-sm font-bold transition-colors"
                    >
                        Back to mode selection
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full blur-3xl bg-accent/40 animate-pulse" />
                        <div className="relative bg-surface p-8 rounded-full border border-border shadow-2xl">
                            <Loader2 className="w-20 h-20 text-accent animate-spin" />
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-foreground tracking-tight">
                            {status === 'initializing' && 'Preparing Practice...'}
                            {status === 'requesting_mic' && 'Waiting for Microphone...'}
                            {status === 'searching' && 'Finding a speaking partner...'}
                            {status === 'connected' && 'Partner found!'}
                            {status === 'error' && 'Connection Error'}
                            {status === 'idle' && 'Ready to start'}
                        </h1>
                        <p className="text-secondary font-medium max-w-sm mx-auto text-lg">
                            {!window.isSecureContext && (
                                <span className="text-red-500 block mb-3 font-bold">
                                    ⚠️ Insecure Context: WebRTC requires HTTPS to access the microphone.
                                </span>
                            )}
                            {status === 'requesting_mic' && 'Please click "Allow" when prompted by your browser to enable voice chat.'}
                            {status === 'searching' && 'Matching you with an English learner from around the world.'}
                            {status === 'error' && (errorDetail || 'Make sure your microphone is enabled and try again.')}
                            {status === 'initializing' && 'Preparing secure connection...'}
                        </p>
                    </div>

                    {(status === 'error' || status === 'disconnected') && (
                        <button
                            onClick={() => setIsPreferencesOpen(true)}
                            className="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 mt-4"
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

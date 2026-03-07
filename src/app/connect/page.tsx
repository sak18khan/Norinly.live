'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';

const INTERESTS = ['Music', 'Gaming', 'Travel', 'Startups', 'Language Practice', 'Movies', 'Sports', 'Art'];
const COUNTRIES = [
    'United States', 'United Kingdom', 'Canada', 'Australia',
    'India', 'Germany', 'France', 'Japan', 'Brazil', 'South Korea', 'Other'
];

export default function ConnectPage() {
    const router = useRouter();
    const { status, requestMicrophoneAndJoin } = useChatContext();

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

    const handleStartSearch = async () => {
        setIsPreferencesOpen(false);
        await requestMicrophoneAndJoin(selectedInterests, selectedCountry);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Logo in Header */}
            <header className="absolute top-0 left-0 w-full p-6 z-20">
                <div
                    className="text-2xl font-black tracking-tighter cursor-pointer select-none text-white inline-block"
                    onClick={() => router.push('/')}
                >
                    NORINLY<span className="text-accent">.</span>
                </div>
            </header>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background -z-10" />

            {isPreferencesOpen ? (
                <div className="bg-surface border border-border rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                    <h2 className="text-3xl font-bold text-white mb-2">Configure Matchmaking</h2>
                    <p className="text-zinc-400 mb-8">Select your preferences to find someone with shared interests.</p>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">
                                Interests (Max 3)
                            </label>
                            <div className="flex flex-wrap gap-2.5">
                                {INTERESTS.map(interest => (
                                    <button
                                        key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedInterests.includes(interest)
                                            ? 'bg-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                                            : 'bg-background/50 text-zinc-400 border border-border hover:border-zinc-500 hover:text-zinc-200'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">
                                Country
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 text-zinc-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 appearance-none transition-all"
                                >
                                    <option value="">Anywhere in the world</option>
                                    {COUNTRIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStartSearch}
                            className="w-full py-5 rounded-2xl bg-accent text-white font-bold text-xl hover:bg-accent-hover transition-all shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] active:scale-[0.98] mt-4"
                        >
                            Find a Stranger
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors"
                        >
                            Cancel and return home
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full blur-3xl bg-accent/40 animate-pulse" />
                        <div className="relative bg-surface p-8 rounded-full border border-border shadow-2xl">
                            <Loader2 className="w-20 h-20 text-accent animate-spin" />
                        </div>
                    </div>

                    <div className="text-center space-y-3">
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            {status === 'searching' && 'Searching for a stranger...'}
                            {status === 'connected' && 'Match found!'}
                            {status === 'error' && 'Connection Error'}
                            {status === 'idle' && 'Initializing...'}
                        </h1>
                        <p className="text-zinc-400 max-w-xs mx-auto">
                            {status === 'searching' && 'Matching you with someone across the globe based on your interests.'}
                            {status === 'error' && 'Make sure your microphone is enabled and try again.'}
                        </p>
                    </div>

                    {(status === 'error' || status === 'disconnected') && (
                        <button
                            onClick={() => setIsPreferencesOpen(true)}
                            className="px-8 py-3 bg-surface border border-border text-white rounded-full hover:bg-white/5 transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

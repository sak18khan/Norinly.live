'use client';

import { useState, useEffect } from 'react';
import { Flame, Clock, MessageSquare, Calendar, ChevronRight, TrendingUp, Award, Zap } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useChatContext } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';

export default function AIDashboard() {
    const { currentUser } = useChatContext();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            loadStats();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const loadStats = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser!.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setStats(data.stats || {
                    aiSessions: 0,
                    speakingMinutes: 0,
                    streak: 0,
                    lastPracticeDate: null
                });
            }
        } catch (error) {
            console.error('Error loading AI stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser || loading) return null;

    // If no stats yet, show a welcome message to start practicing
    if (!stats || stats.aiSessions === 0) {
        return (
            <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white border border-border p-10 md:p-16 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 shadow-sm">
                    <div className="space-y-6 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">Your Practice Journey <br />Starts Here</h2>
                        <p className="text-lg text-secondary max-w-xl font-normal">Build your confidence by practicing with AI before moving to real human conversations.</p>
                        <button 
                            onClick={() => router.push('/connect')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent-hover transition-all shadow-md shadow-accent/20"
                        >
                            Start AI Session
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="w-48 h-48 bg-surface rounded-[2rem] flex items-center justify-center border border-border shadow-inner">
                        <Zap className="w-24 h-24 text-accent animate-pulse" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent border border-accent/10 rounded-full w-fit">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Progress Overview</span>
                    </div>
                    <h2 className="text-4xl font-bold text-foreground">Learning Activity</h2>
                </div>
                <button 
                    onClick={() => router.push('/connect')}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                >
                    Practice More AI
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Streak */}
                <div className="bg-white border border-border p-8 rounded-[2rem] hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Flame className="w-12 h-12 text-orange-500" />
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-1">{stats.streak || 0}d</div>
                    <div className="text-xs text-secondary font-bold uppercase tracking-wider">Current Streak</div>
                </div>

                {/* AI Sessions */}
                <div className="bg-white border border-border p-8 rounded-[2rem] hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="w-12 h-12 text-accent" />
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-1">{stats.aiSessions || 0}</div>
                    <div className="text-xs text-secondary font-bold uppercase tracking-wider">AI Sessions</div>
                </div>

                {/* Minutes */}
                <div className="bg-white border border-border p-8 rounded-[2rem] hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Clock className="w-12 h-12 text-positive-accent" />
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-1">{stats.speakingMinutes || 0}m</div>
                    <div className="text-xs text-secondary font-bold uppercase tracking-wider">Speaking Time</div>
                </div>

                {/* Rank / Award */}
                <div className="bg-white border border-border p-8 rounded-[2rem] hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Award className="w-12 h-12 text-secondary-accent" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">
                        {stats.speakingMinutes > 60 ? 'Pro' : stats.speakingMinutes > 20 ? 'Active' : 'Newbie'}
                    </div>
                    <div className="text-xs text-secondary font-bold uppercase tracking-wider">Practice Level</div>
                </div>
            </div>
        </section>
    );
}

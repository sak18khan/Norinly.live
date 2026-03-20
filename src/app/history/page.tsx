'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, User, ArrowLeft, History, Calendar, Trash2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import HeaderFriendsList from '@/components/HeaderFriendsList';
import Footer from '@/components/Footer';

interface HistoryEntry {
    id: string;
    partnerId: string;
    partnerUsername: string;
    startTime: any;
    duration: number;
}

export default function HistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (u) {
                loadHistory(u.uid);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const loadHistory = async (uid: string) => {
        if (!db) return;
        setLoading(true);
        try {
            const historyRef = collection(db, 'users', uid, 'history');
            const q = query(historyRef, orderBy('startTime', 'desc'));
            const snapshot = await getDocs(q);

            const entries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as HistoryEntry));

            setHistory(entries);
        } catch (err) {
            console.error('Error loading history:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteEntry = async (id: string) => {
        if (!db || !user) return;
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'history', id));
            setHistory(prev => prev.filter(entry => entry.id !== id));
        } catch (err) {
            console.error('Error deleting entry:', err);
        }
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Unknown date';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30 selection:text-white overflow-x-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            
            <div className="max-w-5xl mx-auto flex-1 w-full px-6 md:p-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 md:mb-20">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/')}
                            className="p-3 bg-surface-alt border border-border rounded-2xl hover:bg-surface transition-all group active:scale-95 shadow-premium"
                        >
                            <ArrowLeft className="w-5 h-5 text-muted-text group-hover:text-foreground transition-colors" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <History className="w-5 h-5 md:w-6 md:h-6 text-accent animate-pulse" />
                                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground uppercase italic leading-none">
                                    History<span className="text-accent">.</span>
                                </h1>
                            </div>
                            <p className="text-muted-text text-[10px] md:text-xs font-black uppercase tracking-[0.2em] pl-1">Preserving your best encounters</p>
                        </div>
                    </div>
                    {user && (
                        <div className="flex items-center gap-4">
                            <HeaderFriendsList />
                            <div className="h-10 w-[1px] bg-white/10 mx-2 hidden md:block" />
                            <button 
                                onClick={() => {
                                    if(confirm('Are you sure you want to wipe your history? This cannot be undone.')) {
                                        setHistory([]);
                                        toast.success('History cleared successfully');
                                    }
                                }}
                                className="px-6 py-2.5 bg-secondary-accent/10 hover:bg-secondary-accent/20 border border-secondary-accent/20 rounded-xl text-secondary-accent text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                            >
                                Wipe Data
                            </button>
                        </div>
                    )}
                </header>

                {!user ? (
                    <div className="bg-surface-alt/50 border border-border rounded-[3rem] p-16 text-center shadow-premium-xl backdrop-blur-xl group">
                        <div className="w-24 h-24 bg-surface border border-border rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-premium group-hover:scale-110 transition-transform">
                            <User className="w-10 h-10 text-muted-text" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight mb-4">Identity Required</h2>
                        <p className="text-secondary-text font-medium mb-12 max-w-sm mx-auto leading-relaxed">Chat history and persistent connections are reserved for registered English learners.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-12 py-5 bg-accent text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-glow-accent transition-all hover:scale-105 active:scale-95"
                        >
                            Establish Identity
                        </button>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="w-16 h-16 border-4 border-accent/10 border-t-accent rounded-full animate-spin shadow-glow-accent" />
                        <p className="text-muted-text font-black tracking-[0.4em] uppercase text-[11px] animate-pulse">Retrieving Archives</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="bg-surface-alt/20 border-2 border-dashed border-border rounded-[4rem] p-24 text-center">
                        <div className="w-20 h-20 bg-surface border border-border rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <Clock className="w-8 h-8 text-muted-text" />
                        </div>
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4 grayscale opacity-50">Empty Archives</h2>
                        <p className="text-secondary-text font-medium">Only deep conversations (1m+) are logged in your history.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 pb-20">
                        {history.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-surface border border-border rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between hover:border-accent/40 hover:bg-surface-alt transition-all group relative overflow-hidden shadow-premium"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] bg-zinc-900 flex items-center justify-center shrink-0 border-2 border-white/5 group-hover:border-accent/30 transition-all">
                                        <User className="w-8 h-8 md:w-10 md:h-10 text-zinc-700 group-hover:text-accent transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-accent transition-colors truncate">
                                                {entry.partnerUsername || 'Anonymous Stranger'}
                                            </h3>
                                            <span className="text-[9px] bg-surface-alt text-muted-text px-3 py-1 rounded-full uppercase tracking-widest font-black border border-border">Stranger</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                                            <div className="flex items-center gap-2.5 text-secondary-text font-medium">
                                                <Calendar className="w-4 h-4 opacity-50" />
                                                <span className="text-xs">{formatDate(entry.startTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-accent font-black">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-xs uppercase tracking-tighter">{formatDuration(entry.duration)} session</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-6 md:mt-0 relative z-10 w-full md:w-auto justify-end">
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="p-4 text-zinc-700 hover:text-secondary hover:bg-secondary/10 rounded-2xl transition-all active:scale-90"
                                        title="Delete from history"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

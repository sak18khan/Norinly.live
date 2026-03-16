'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, User, ArrowLeft, History, Calendar, Trash2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
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
        <div className="min-h-screen bg-background text-white p-6 md:p-12 flex flex-col">
            <div className="max-w-4xl mx-auto flex-1 w-full">
                {/* Header */}
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="p-3 bg-surface border border-border rounded-2xl hover:bg-zinc-800 transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                <History className="w-8 h-8 text-accent" />
                                Chat History
                            </h1>
                            <p className="text-zinc-500 text-sm font-medium mt-1">Conversations longer than 1 minute</p>
                        </div>
                    </div>
                    {user && (
                        <div className="flex items-center bg-surface border border-border rounded-full p-1">
                            <HeaderFriendsList />
                        </div>
                    )}
                </header>

                {!user ? (
                    <div className="bg-surface border border-border rounded-3xl p-12 text-center">
                        <User className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Sign in to see history</h2>
                        <p className="text-zinc-500 mb-8">History is only saved for registered users.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-8 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent-hover transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                        <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px]">Loading history...</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="bg-surface border border-border rounded-3xl p-12 text-center">
                        <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">No history yet</h2>
                        <p className="text-zinc-500">Only conversations over 1 minute are saved here.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {history.map((entry) => (
                            <div
                                key={entry.id}
                                className="bg-surface/50 border border-border rounded-3xl p-6 flex items-center justify-between hover:border-accent/30 transition-all group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <User className="w-7 h-7 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                            {entry.partnerUsername || 'Anonymous Stranger'}
                                            <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Stranger</span>
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(entry.startTime)}
                                            </div>
                                            <div className="flex items-center gap-1.5 font-mono text-zinc-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatDuration(entry.duration)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="p-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
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

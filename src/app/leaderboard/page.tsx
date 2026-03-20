'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trophy, Medal, Crown, Star, ArrowUpRight, Globe, Calendar, User, Loader2, TrendingUp } from 'lucide-react';
import { getLeaderboard } from '@/lib/gamification';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
    const [type, setType] = useState<'global' | 'weekly'>('weekly');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const data = await getLeaderboard(type, 50);
                setUsers(data);
                
                const currentUserId = auth?.currentUser?.uid;
                if (currentUserId) {
                    const rank = data.findIndex(u => u.id === currentUserId);
                    if (rank !== -1) setCurrentUserRank(rank + 1);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [type]);

    const topThree = users.slice(0, 3);
    const theRest = users.slice(3);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/10">
            <Header />

            <main className="flex-grow container mx-auto px-6 pt-44 pb-12 md:pt-60 md:pb-24 max-w-5xl relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none -z-10" />
                
                <div className="text-center space-y-6 mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-widest">
                        <Trophy className="w-4 h-4" /> Global Ranking
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                        Top <span className="text-accent underline decoration-accent/10 underline-offset-8">Speakers</span>
                    </h1>
                    <p className="text-secondary text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Be the voice that inspires. Compete with learners worldwide and climb the ranks by practicing English every day.
                    </p>

                    {/* Type Toggle */}
                    <div className="flex justify-center mt-12">
                        <div className="bg-surface border border-border p-1.5 rounded-[1.5rem] flex gap-2">
                            <button 
                                onClick={() => setType('weekly')}
                                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                                    type === 'weekly' ? 'bg-accent text-white shadow-glow-accent' : 'text-muted hover:text-foreground'
                                }`}
                            >
                                <Calendar className="w-4 h-4" /> Weekly
                            </button>
                            <button 
                                onClick={() => setType('global')}
                                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                                    type === 'global' ? 'bg-accent text-white shadow-glow-accent' : 'text-muted hover:text-foreground'
                                }`}
                            >
                                <Globe className="w-4 h-4" /> Global
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-6">
                        <Loader2 className="w-12 h-12 text-accent animate-spin" />
                        <p className="text-muted font-black uppercase tracking-[0.2em] text-sm">Calculating Rankings...</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* Top 3 Podium */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end max-w-4xl mx-auto px-4 mb-24">
                            {/* Rank 2 */}
                            {topThree[1] && (
                                <div className="order-2 md:order-1 flex flex-col items-center space-y-6 md:pb-8 group cursor-pointer" onClick={() => router.push(`/profile/${topThree[1].id}`)}>
                                    <div className="relative">
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-2 border-border overflow-hidden shadow-premium group-hover:scale-105 transition-all duration-500 bg-surface">
                                            <img src={topThree[1].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].username}`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-surface text-secondary-text w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border border-border">2</div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-black text-foreground truncate max-w-[150px] uppercase italic tracking-tight">{topThree[1].username || 'Learner'}</h3>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{type === 'global' ? topThree[1].xp : topThree[1].weeklyXp} XP</p>
                                    </div>
                                </div>
                            )}

                            {/* Rank 1 */}
                            {topThree[0] && (
                                <div className="order-1 md:order-2 flex flex-col items-center space-y-8 md:pb-16 group cursor-pointer" onClick={() => router.push(`/profile/${topThree[0].id}`)}>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
                                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] border-4 border-primary overflow-hidden shadow-glow-accent relative z-10 group-hover:scale-105 transition-all duration-700 bg-surface">
                                            <img src={topThree[0].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].username}`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-3xl shadow-glow relative z-20">1</div>
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
                                            <Crown className="w-12 h-12 text-primary fill-primary/10" />
                                        </div>
                                    </div>
                                    <div className="text-center relative z-10">
                                        <h3 className="text-3xl md:text-4xl font-black text-foreground truncate max-w-[200px] uppercase italic tracking-tighter">{topThree[0].username || 'Champion'}</h3>
                                        <div className="flex items-center justify-center gap-2 mt-4">
                                            <Star className="w-5 h-5 text-primary fill-primary" />
                                            <p className="text-xl font-black text-primary uppercase tracking-widest">{type === 'global' ? topThree[0].xp : topThree[0].weeklyXp} XP</p>
                                            <Star className="w-5 h-5 text-primary fill-primary" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rank 3 */}
                            {topThree[2] && (
                                <div className="order-3 md:order-3 flex flex-col items-center space-y-6 md:pb-4 group cursor-pointer" onClick={() => router.push(`/profile/${topThree[2].id}`)}>
                                    <div className="relative">
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-2 border-orange-200/50 overflow-hidden shadow-premium group-hover:scale-105 transition-all duration-500 bg-surface">
                                            <img src={topThree[2].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].username}`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-orange-100 text-orange-600 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border border-orange-200/50">3</div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-black text-foreground truncate max-w-[150px] uppercase italic tracking-tight">{topThree[2].username || 'Speaker'}</h3>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{type === 'global' ? topThree[2].xp : topThree[2].weeklyXp} XP</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* List - The Rest */}
                        <div className="bg-premium-card rounded-3xl overflow-hidden shadow-premium">
                            <div className="p-8 border-b border-border bg-foreground/[0.02] flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-secondary-text uppercase tracking-widest opacity-50 italic">Rising Stars</h4>
                                <div className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="w-3.5 h-3.5" /> Updated Live
                                </div>
                            </div>
                            <div className="divide-y divide-border/50">
                                {theRest.map((user, idx) => (
                                    <div 
                                        key={user.id} 
                                        className={`flex items-center justify-between p-6 px-8 hover:bg-surface transition-colors group cursor-pointer ${auth?.currentUser?.uid === user.id ? 'bg-accent/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-8 text-center font-black text-muted group-hover:text-accent transition-colors">{idx + 4}</div>
                                            <div className="relative">
                                                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-12 h-12 rounded-2xl border border-border shadow-sm" alt="" />
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-positive-accent rounded-full border-2 border-white" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-foreground flex items-center gap-2">
                                                    {user.username || 'Learner'}
                                                    {auth?.currentUser?.uid === user.id && (
                                                        <span className="text-[9px] bg-accent/20 text-accent px-2 py-0.5 rounded-full border border-accent/20 font-black tracking-widest uppercase">You</span>
                                                    )}
                                                </h5>
                                                <p className="text-xs text-muted font-medium">{user.englishLevel || 'Intermediate'} • {user.country || 'Global'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-foreground tracking-tight">{type === 'global' ? (user.xp || 0).toLocaleString() : (user.weeklyXp || 0).toLocaleString()}</p>
                                            <p className="text-[9px] font-black text-muted uppercase tracking-widest">Points</p>
                                        </div>
                                    </div>
                                ))}
                                
                                {theRest.length === 0 && (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="w-16 h-16 bg-surface rounded-3xl flex items-center justify-center mx-auto border border-border">
                                            <User className="w-8 h-8 text-muted" />
                                        </div>
                                        <p className="text-muted font-black uppercase tracking-widest text-xs">More speakers arriving soon...</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Current User Fixed Rank if not in list */}
                            {currentUserRank && currentUserRank > 50 && (
                                <div className="p-8 border-t border-border bg-foreground text-background flex items-center justify-between rounded-b-[2.5rem]">
                                    <div className="flex items-center gap-6">
                                        <div className="w-8 text-center font-black text-accent">{currentUserRank}</div>
                                        <img src={auth?.currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth?.currentUser?.displayName}`} className="w-12 h-12 rounded-2xl border border-background/20" alt="" />
                                        <div>
                                            <h5 className="font-black">Your Progress</h5>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Keep speaking to climb higher</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <ArrowUpRight className="w-6 h-6 text-accent animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    User, 
    AtSign, 
    Globe, 
    Phone, 
    Mail, 
    Loader2, 
    Save, 
    Check, 
    ArrowLeft,
    Sparkles,
    Trophy,
    Clock,
    Users,
    Star,
    ChevronRight,
    Search
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Form fields
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [country, setCountry] = useState('');
    const [englishLevel, setEnglishLevel] = useState('Intermediate');
    const [goals, setGoals] = useState('');
    
    const [stats, setStats] = useState({ 
        conversationsCount: 0, 
        totalSpeakingMinutes: 0, 
        streak: 0,
        countriesCount: 0,
        averageRating: 0
    });

    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Initial load of form fields
                await loadInitialProfile(currentUser.uid);
            } else {
                setLoading(false);
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, []);

    // Separated effect for real-time stats to avoid multiple listeners
    useEffect(() => {
        if (!user || !db) return;

        const userRef = doc(db, 'users', user.uid);
        const unsubscribeStats = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setStats({
                    conversationsCount: data.conversationsCount || 0,
                    totalSpeakingMinutes: data.totalSpeakingMinutes || 0,
                    streak: data.streak || 0,
                    countriesCount: data.countriesSpokenTo?.length || 0,
                    averageRating: data.averageRating || 0
                });
                
                // Only update basic info if NOT saving to avoid state fighting
                if (!saving) {
                    setCountry(data.country || '');
                    setEnglishLevel(data.englishLevel || 'Intermediate');
                    setGoals(data.goals || '');
                }
            }
        });

        return () => unsubscribeStats();
    }, [user?.uid, db]); // Removed 'saving' to avoid listener recreation

    const loadInitialProfile = async (uid: string) => {
        if (!db) return;
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const data = userSnap.data();
                // We set form fields once on initial load
                // setName from Auth is prioritized
                setName(auth.currentUser?.displayName || data.name || '');
                setUsername(data.username || '');
                setCountry(data.country || '');
                setEnglishLevel(data.englishLevel || 'Intermediate');
                setGoals(data.goals || '');
                setStats({
                    conversationsCount: data.conversationsCount || 0,
                    totalSpeakingMinutes: data.totalSpeakingMinutes || 0,
                    streak: data.streak || 0,
                    countriesCount: data.countriesSpokenTo?.length || 0,
                    averageRating: data.averageRating || 0
                });
            }
            setLoading(false);
        } catch (err) {
            console.error('Error loading profile:', err);
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser || !db) return;

        setSaving(true);
        try {
            await updateProfile(auth.currentUser, { displayName: name });
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                name,
                username,
                country,
                englishLevel,
                goals,
                updatedAt: new Date()
            });
            toast.success('Profile updated successfully! ✨');
        } catch (err: any) {
            console.error('Error saving profile:', err);
            toast.error(err.message || 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Loading Norinly Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Nav */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-secondary hover:text-accent hover:bg-accent/5 rounded-xl transition-all flex items-center gap-2 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/5 rounded-lg flex items-center justify-center">
                            <User className="w-4 h-4 text-accent" />
                        </div>
                        <h1 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Account Settings</h1>
                    </div>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12 space-y-8">
                {/* Hero Section */}
                <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-premium-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-accent/10" />
                    <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-premium overflow-hidden flex items-center justify-center group-hover:rotate-3 transition-transform duration-500">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-slate-200" />
                                ) }
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                                <Sparkles className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{name || 'Norinly Learner'}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    <AtSign className="w-3.5 h-3.5" />
                                    <span>{username || 'no-username'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>{country || 'Global Citizen'}</span>
                                </div>
                            </div>
                            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                <span className="px-4 py-1.5 bg-accent/5 text-accent border border-accent/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {englishLevel}
                                </span>
                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Trophy className="w-3 h-3" />
                                    Streak: {stats.streak} Days
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Grid (Section 1) */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard 
                        icon={<Users className="w-5 h-5" />} 
                        label="Sessions" 
                        value={stats.conversationsCount} 
                        color="bg-blue-500" 
                    />
                    <StatCard 
                        icon={<Clock className="w-5 h-5" />} 
                        label="Minutes" 
                        value={stats.totalSpeakingMinutes} 
                        color="bg-purple-500" 
                    />
                    <StatCard 
                        icon={<Globe className="w-5 h-5" />} 
                        label="Countries" 
                        value={stats.countriesCount} 
                        color="bg-amber-500" 
                    />
                    <StatCard 
                        icon={<Star className="w-5 h-5" />} 
                        label="Rating" 
                        value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'} 
                        color="bg-rose-500" 
                    />
                </section>

                {/* User Info Form (Section 2) */}
                <section className="bg-white border border-slate-100 rounded-[2.5rem] shadow-premium-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Profile Details</h3>
                    </div>
                    <form onSubmit={handleSave} className="p-8 md:p-10 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <FormInput 
                                label="Full Name" 
                                value={name} 
                                onChange={setName} 
                                icon={<User className="w-4 h-4" />} 
                                placeholder="e.g. Saqib Fayaz" 
                            />
                            <FormInput 
                                label="Username" 
                                value={username} 
                                onChange={setUsername} 
                                icon={<AtSign className="w-4 h-4" />} 
                                placeholder="norinly_fan" 
                            />
                            <FormInput 
                                label="Country" 
                                value={country} 
                                onChange={setCountry} 
                                icon={<Globe className="w-4 h-4" />} 
                                placeholder="Brazil, Japan, etc." 
                            />
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                    English Level
                                </label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all appearance-none"
                                    value={englishLevel}
                                    onChange={(e) => setEnglishLevel(e.target.value)}
                                >
                                    <option>Beginner</option>
                                    <option>Elementary</option>
                                    <option>Intermediate</option>
                                    <option>Upper Intermediate</option>
                                    <option>Advanced</option>
                                    <option>Native</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                Learning Goals
                            </label>
                            <textarea 
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 min-h-[120px] focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all resize-none"
                                placeholder="What do you want to achieve with Norinly? (e.g. Prepare for IELTS, improve fluency...)"
                                value={goals}
                                onChange={(e) => setGoals(e.target.value)}
                            />
                        </div>

                        <button 
                            disabled={saving}
                            className="w-full bg-accent hover:bg-accent-hover disabled:bg-slate-100 text-white font-black py-5 rounded-2xl shadow-glow-accent transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="uppercase tracking-[0.2em] text-[11px]">Saving Changes...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span className="uppercase tracking-[0.2em] text-[11px]">Save Profile</span>
                                </>
                            )}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
    return (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium-sm hover:shadow-premium transition-all hover:-translate-y-1 group">
            <div className={`w-10 h-10 ${color} bg-opacity-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <div className={`${color.replace('bg-', 'text-')}`}>
                    {icon}
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    );
}

function FormInput({ label, value, onChange, icon, placeholder, disabled = false }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                {label}
            </label>
            <div className="relative group/input">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-accent transition-colors">
                    {icon}
                </div>
                <input 
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all"
                />
            </div>
        </div>
    );
}

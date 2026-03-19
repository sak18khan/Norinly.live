'use client';

import { useState, useEffect } from 'react';
import { X, User, Phone, AtSign, Mail, Loader2, Save, Check } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
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
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen && auth?.currentUser) {
            setEmail(auth.currentUser.email || '');
            loadProfile();
        }
    }, [isOpen]);

    const loadProfile = async () => {
        if (!auth?.currentUser || !db) return;
        setLoading(true);
        try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setName(auth.currentUser.displayName || data.name || '');
                setUsername(data.username || '');
                setPhone(data.phone || '');
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
        } catch (err: any) {
            console.error('Error loading profile:', err);
            setError('Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth?.currentUser || !db) return;

        setSaving(true);
        setError('');
        setSuccess(false);

        try {
            // Update Firebase Auth Profile
            await updateProfile(auth.currentUser, {
                displayName: name
            });

            // Update Firestore Profile
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                name,
                username,
                phone,
                country,
                englishLevel,
                goals,
                updatedAt: new Date()
            });

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);
        } catch (err: any) {
            console.error('Error saving profile:', err);
            setError(err.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface/80 dark:bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="w-full max-w-md bg-premium-card/90 backdrop-blur-2xl border border-border rounded-[3.5rem] shadow-premium-xl overflow-hidden animate-in zoom-in-95 duration-500 relative">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />
                
                <div className="p-10 border-b border-border flex justify-between items-center bg-surface relative z-10">
                    <h2 className="text-2xl font-black text-foreground flex items-center gap-4 uppercase tracking-tighter italic">
                        <div className="bg-accent/5 p-2.5 rounded-2xl shadow-sm">
                            <User className="w-6 h-6 text-accent" />
                        </div>
                        Identity<span className="text-accent">.</span>
                    </h2>
                    <button onClick={onClose} className="p-3 bg-surface border border-border hover:bg-surface/80 rounded-[1.25rem] text-muted-text hover:text-foreground transition-all active:scale-90 shadow-sm">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-10 space-y-10 max-h-[75vh] overflow-y-auto no-scrollbar relative z-10">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-5">
                            <Loader2 className="w-12 h-12 text-accent animate-spin" />
                            <p className="text-muted-text text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Retrieving Archives...</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-surface border border-border p-6 rounded-[2.5rem] text-center group hover:border-accent/30 hover:bg-surface/80 transition-all shadow-sm">
                                    <div className="text-foreground font-black text-2xl tracking-tighter leading-none">{stats.conversationsCount}</div>
                                    <div className="text-[9px] text-muted-text font-black uppercase tracking-[0.2em] mt-3 group-hover:text-accent transition-colors">Sessions</div>
                                </div>
                                <div className="bg-surface border border-border p-6 rounded-[2.5rem] text-center group hover:border-positive-accent/30 hover:bg-surface/80 transition-all shadow-sm">
                                    <div className="text-foreground font-black text-2xl tracking-tighter leading-none">{stats.totalSpeakingMinutes}</div>
                                    <div className="text-[9px] text-muted-text font-black uppercase tracking-[0.2em] mt-3 group-hover:text-positive-accent transition-colors">Minutes</div>
                                </div>
                                <div className="bg-surface border border-border p-6 rounded-[2.5rem] text-center group hover:border-accent/30 hover:bg-surface/80 transition-all shadow-sm">
                                    <div className="text-foreground font-black text-2xl tracking-tighter leading-none">{stats.countriesCount}</div>
                                    <div className="text-[9px] text-muted-text font-black uppercase tracking-[0.2em] mt-3 group-hover:text-accent transition-colors">Nations</div>
                                </div>
                                <div className="bg-secondary/5 border border-secondary/10 p-6 rounded-[2.5rem] text-center relative overflow-hidden group hover:bg-secondary/10 transition-all shadow-sm">
                                    <div className="relative z-10">
                                        <div className="text-secondary font-black text-2xl tracking-tighter leading-none">
                                            {stats.averageRating > 0 ? stats.averageRating : '—'}<span className="text-base ml-1">⭐</span>
                                        </div>
                                        <div className="text-[9px] text-secondary/40 font-black uppercase tracking-[0.2em] mt-3">Reputation</div>
                                    </div>
                                    <div className="absolute top-0 right-0 -m-2 w-16 h-16 bg-secondary/5 blur-xl rounded-full group-hover:bg-secondary/10 transition-all" />
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                            {/* Display Name */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted-text uppercase tracking-[0.25em] ml-2">Public Identity</label>
                                <div className="relative group/input">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-text group-focus-within/input:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full bg-surface border border-border rounded-[1.5rem] pl-14 pr-6 py-4.5 text-xs font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all placeholder:text-muted-text shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted-text uppercase tracking-[0.25em] ml-2">Network Handle</label>
                                <div className="relative group/input">
                                    <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-text group-focus-within/input:text-accent transition-colors" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                        placeholder="unique_handle"
                                        className="w-full bg-surface border border-border rounded-[1.5rem] pl-14 pr-6 py-4.5 text-xs font-black lowercase text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all placeholder:text-muted-text shadow-sm"
                                    />
                                </div>
                            </div>

                              {/* Country */}
                             <div className="space-y-3">
                                 <label className="text-[9px] font-black text-muted-text uppercase tracking-[0.25em] ml-2">Location</label>
                                 <input
                                     type="text"
                                     value={country}
                                     onChange={(e) => setCountry(e.target.value)}
                                     placeholder="e.g. United Kingdom"
                                     className="w-full bg-surface border border-border rounded-[1.5rem] px-6 py-4.5 text-xs font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all placeholder:text-muted-text shadow-sm"
                                 />
                             </div>

                            {/* English Level */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted-text uppercase tracking-[0.25em] ml-2">Proficiency Tier</label>
                                <select
                                    value={englishLevel}
                                    onChange={(e) => setEnglishLevel(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-[1.5rem] px-6 py-4.5 text-xs font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all appearance-none cursor-pointer shadow-sm"
                                >
                                    {['Beginner', 'Intermediate', 'Advanced', 'Native'].map(level => (
                                        <option key={level} value={level} className="bg-surface text-foreground">{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Learning Goals */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted-text uppercase tracking-[0.25em] ml-2">Strategic Objectives</label>
                                <textarea
                                    value={goals}
                                    onChange={(e) => setGoals(e.target.value)}
                                    placeholder="Briefly describe your targets..."
                                    rows={2}
                                    className="w-full bg-surface border border-border rounded-[1.5rem] px-6 py-4.5 text-xs font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all resize-none placeholder:text-muted-text shadow-sm"
                                />
                            </div>

                            {/* Phone Number (Optional) */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted-text uppercase tracking-[0.25em] ml-2">Communication Link (Optional)</label>
                                <div className="relative group/input">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-text group-focus-within/input:text-accent transition-colors" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 000 000 000"
                                        className="w-full bg-surface border border-border rounded-[1.5rem] pl-14 pr-6 py-4.5 text-xs font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all placeholder:text-muted-text shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Email (Read-only) */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted-text uppercase tracking-[0.25em] ml-2">Verified Endpoint (Private)</label>
                                <div className="relative opacity-50">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-text" />
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full bg-surface border border-border rounded-[1.5rem] pl-14 pr-6 py-4.5 text-xs font-black text-foreground cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-secondary text-[9px] font-black uppercase tracking-widest bg-secondary/10 py-3 rounded-xl border border-secondary/20 px-4">{error}</p>}

                            <button
                                type="submit"
                                disabled={saving || success}
                                className={`w-full font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-[1.5rem] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 mt-6 shadow-premium relative group overflow-hidden ${success ? 'bg-positive-accent text-white shadow-premium' : 'bg-black text-white hover:bg-accent'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : success ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Synchronization Complete</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Update Protocol</span>
                                    </>
                                )}
                                </span>
                                {!success && !saving && (
                                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                )}
                            </button>
                        </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

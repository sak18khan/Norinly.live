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
    const [stats, setStats] = useState({ conversationsCount: 0, totalSpeakingMinutes: 0, streak: 0 });
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
                    streak: data.streak || 0
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-border flex justify-between items-center bg-surface">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <div className="bg-accent/10 p-2 rounded-xl">
                            <User className="w-6 h-6 text-accent" />
                        </div>
                        My Profile
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-secondary transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                    {loading ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-accent animate-spin" />
                            <p className="text-secondary text-sm font-semibold">Loading your details...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-surface border border-border p-4 rounded-2xl text-center">
                                    <div className="text-foreground font-bold text-xl leading-none">{stats.conversationsCount}</div>
                                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-2">Sessions</div>
                                </div>
                                <div className="bg-surface border border-border p-4 rounded-2xl text-center">
                                    <div className="text-foreground font-bold text-xl leading-none">{stats.totalSpeakingMinutes}</div>
                                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-2">Minutes</div>
                                </div>
                                <div className="bg-surface border border-border p-4 rounded-2xl text-center">
                                    <div className="text-accent font-bold text-xl leading-none">{stats.streak}d</div>
                                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest mt-2">Streak</div>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                            {/* Display Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Username</label>
                                <div className="relative">
                                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                        placeholder="username"
                                        className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    />
                                </div>
                            </div>

                              {/* Country */}
                             <div className="space-y-2">
                                 <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Country</label>
                                 <input
                                     type="text"
                                     value={country}
                                     onChange={(e) => setCountry(e.target.value)}
                                     placeholder="e.g. Brazil"
                                     className="w-full bg-surface border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                 />
                             </div>

                            {/* English Level */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">English Level</label>
                                <select
                                    value={englishLevel}
                                    onChange={(e) => setEnglishLevel(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none"
                                >
                                    {['Beginner', 'Intermediate', 'Advanced', 'Native'].map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Learning Goals */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Learning Goals</label>
                                <textarea
                                    value={goals}
                                    onChange={(e) => setGoals(e.target.value)}
                                    placeholder="e.g. Master business English, improve pronunciation..."
                                    rows={2}
                                    className="w-full bg-surface border border-border rounded-2xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                                />
                            </div>

                            {/* Phone Number (Optional) */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Phone (Optional)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 234 567 890"
                                        className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email (Read-only) */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Email (Private)</label>
                                <div className="relative opacity-50">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-secondary cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}

                            <button
                                type="submit"
                                disabled={saving || success}
                                className={`w-full font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4 shadow-lg ${success ? 'bg-positive-accent text-white shadow-positive-accent/20' : 'bg-accent hover:bg-accent-hover text-white shadow-accent/20'
                                    }`}
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : success ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Changes Saved</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Save Profile</span>
                                    </>
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

'use client';

import { useState } from 'react';
import { X, User, MapPin, Hash, Heart, Camera, Loader2, Check } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface ProfileSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileSetupModal({ isOpen, onClose }: ProfileSetupModalProps) {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [country, setCountry] = useState('');
    const [interests, setInterests] = useState('');
    const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
    const [englishLevel, setEnglishLevel] = useState('Intermediate');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth?.currentUser || !db) return;

        setLoading(true);
        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userRef, {
                username: username || auth.currentUser.displayName || 'Anonymous',
                age: age ? parseInt(age) : null,
                country: country || null,
                englishLevel,
                interests: interests ? interests.split(',').map(i => i.trim()).filter(i => i) : [],
                avatar,
                profileCompleted: true,
                onboardingComplete: true,
                updatedAt: serverTimestamp()
            }, { merge: true });

            setSuccess(true);
            toast.success('Profile updated successfully');
            setLoading(false);
            onClose();
        } catch (err: any) {
            console.error('Error saving profile:', err);
            toast.error('Failed to save profile. Please try again.');
            setLoading(false);
        }
    };

    const handleSkip = () => {
        sessionStorage.setItem('skippedProfileSetup', 'true');
        onClose();
    };

    const generateNewAvatar = () => {
        const seeds = ['Felix', 'Aneka', 'Charlie', 'Luna', 'Max', 'Bella', 'Oliver', 'Milo'];
        const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
        setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}${Math.random()}`);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white border border-border rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 border-b border-border flex justify-between items-center bg-surface">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">Complete Your Profile</h2>
                        <p className="text-secondary text-base mt-2">Tell us a bit about yourself to get started.</p>
                    </div>
                </div>

                <div className="p-10 space-y-10">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-surface">
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <button
                                onClick={generateNewAvatar}
                                className="absolute bottom-1 right-1 p-2.5 bg-accent rounded-full text-white hover:bg-accent-hover transition-all shadow-lg"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Choose an Avatar</span>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="your_username"
                                    className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* Age */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Age</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="Your age"
                                    className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Country</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="e.g. United States"
                                    className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Interests</label>
                            <div className="relative">
                                <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    value={interests}
                                    onChange={(e) => setInterests(e.target.value)}
                                    placeholder="Music, Tech, Gaming..."
                                    className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* English Level */}
                        <div className="md:col-span-2 space-y-4 pt-4 border-t border-border/50">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">English Proficiency</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {['Beginner', 'Intermediate', 'Advanced', 'Native'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setEnglishLevel(level)}
                                        className={`py-4 px-2 rounded-2xl border text-xs font-bold transition-all ${englishLevel === level
                                            ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
                                            : 'bg-surface border-border text-secondary hover:border-accent hover:text-accent'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-6 flex gap-4">
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="flex-1 py-4 px-6 rounded-2xl border border-border text-secondary font-bold hover:bg-surface transition-all"
                            >
                                Skip
                            </button>
                            <button
                                type="submit"
                                disabled={loading || success}
                                className={`flex-[2] py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg ${success ? 'bg-positive-accent text-white shadow-positive-accent/20' : 'bg-accent hover:bg-accent-hover text-white shadow-accent/20'
                                    }`}
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : success ? <Check className="w-6 h-6" /> : <span>Start Practicing</span>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

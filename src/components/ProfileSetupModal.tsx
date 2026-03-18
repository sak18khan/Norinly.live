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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-white/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-black/5 rounded-[3.5rem] shadow-premium-xl overflow-hidden animate-in zoom-in-95 duration-500 relative">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />
                
                <div className="p-10 border-b border-black/5 flex justify-between items-center bg-black/[0.02] relative z-10">
                    <div>
                        <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Initial Setup<span className="text-accent">.</span></h2>
                        <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mt-2 opacity-60">Define your presence in the network.</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-black/5 border border-black/5 hover:bg-black/10 rounded-[1.25rem] text-zinc-400 hover:text-black transition-all active:scale-90 shadow-sm">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-10 space-y-10 max-h-[80vh] overflow-y-auto no-scrollbar relative z-10">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-premium overflow-hidden bg-black/5">
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <button
                                onClick={generateNewAvatar}
                                className="absolute bottom-1 right-1 p-3 bg-black rounded-full text-white hover:bg-accent transition-all shadow-premium active:scale-95"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] opacity-60">Visual Identity</span>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Username */}
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">Network Handle</label>
                            <div className="relative group/input">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within/input:text-accent transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="your_username"
                                    className="w-full bg-black/5 border border-black/5 rounded-[1.5rem] pl-14 pr-6 py-4.5 text-xs font-black lowercase text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all placeholder:text-zinc-300 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Age */}
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">Maturity Level</label>
                            <div className="relative group/input">
                                <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within/input:text-accent transition-colors" />
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="Age"
                                    className="w-full bg-black/5 border border-black/5 rounded-[1.5rem] pl-14 pr-6 py-4.5 text-xs font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all placeholder:text-zinc-300 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Country */}
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">Point of Origin</label>
                            <div className="relative group/input">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within/input:text-accent transition-colors" />
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="Country"
                                    className="w-full bg-black/5 border border-black/5 rounded-[1.5rem] pl-14 pr-6 py-4.5 text-xs font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all placeholder:text-zinc-300 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">Core Affinities</label>
                            <div className="relative group/input">
                                <Heart className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within/input:text-accent transition-colors" />
                                <input
                                    type="text"
                                    value={interests}
                                    onChange={(e) => setInterests(e.target.value)}
                                    placeholder="Music, Tech..."
                                    className="w-full bg-black/5 border border-black/5 rounded-[1.5rem] pl-14 pr-6 py-4.5 text-xs font-black uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all placeholder:text-zinc-300 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* English Level */}
                        <div className="md:col-span-2 space-y-6 pt-6 border-t border-black/5">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">Proficiency Tier</label>
                                <p className="text-[10px] font-black text-zinc-400/60 uppercase tracking-widest ml-2">Matchmaking Optimization</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { id: 'Beginner', title: 'Beginner', desc: 'Fundamentals', icon: '🌱' },
                                    { id: 'Intermediate', title: 'Intermediate', desc: 'Daily use', icon: '🚀' },
                                    { id: 'Advanced', title: 'Advanced', desc: 'Fluency', icon: '🏆' },
                                ].map((level) => (
                                    <button
                                        key={level.id}
                                        type="button"
                                        onClick={() => setEnglishLevel(level.id)}
                                        className={`p-6 rounded-[2.5rem] border-2 text-left transition-all duration-500 group flex flex-col gap-3 relative overflow-hidden ${englishLevel === level.id
                                            ? 'bg-black/5 border-black shadow-premium'
                                            : 'bg-black/[0.02] border-black/5 hover:border-accent/30 hover:bg-white'
                                            }`}
                                    >
                                        <div className={`text-2xl transition-transform duration-500 ${englishLevel === level.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {level.icon}
                                        </div>
                                        <div>
                                            <div className={`font-black uppercase tracking-tighter text-base ${englishLevel === level.id ? 'text-foreground' : 'text-zinc-400'}`}>
                                                {level.title}
                                            </div>
                                            <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1 opacity-60 leading-none">
                                                {level.desc}
                                            </div>
                                        </div>
                                        {englishLevel === level.id && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shadow-premium animate-in zoom-in duration-300">
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-8 flex gap-4">
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="flex-1 py-5 px-6 rounded-[1.5rem] border border-black/5 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:bg-black/5 transition-all shadow-sm"
                            >
                                Bypassing
                            </button>
                            <button
                                type="submit"
                                disabled={loading || success}
                                className={`flex-[2] py-5 px-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center space-x-3 shadow-premium group relative overflow-hidden ${success ? 'bg-positive-accent text-white shadow-premium' : 'bg-black text-white hover:bg-accent'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : success ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Initialization Complete</span>
                                    </>
                                ) : (
                                    <span>Establish Identity</span>
                                )}
                                </span>
                                {!success && !loading && (
                                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

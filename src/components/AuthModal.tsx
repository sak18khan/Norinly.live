'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { auth, googleProvider, db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import {
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

const ADJECTIVES = ['Blue', 'Cosmic', 'Silent', 'Golden', 'Swift', 'Mystic', 'Brave', 'Cunning'];
const NOUNS = ['Tiger', 'Fox', 'Moon', 'Eagle', 'Storm', 'Wolf', 'Dragon', 'Shadow'];

const generateRandomUsername = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj}${noun}${num}`;
};

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsLogin(initialMode === 'login');
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    // Firebase not configured — show notice
    if (!auth || !googleProvider) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl">
                <div className="w-full max-w-sm bg-white border border-black/5 rounded-[3rem] shadow-premium-xl p-10 text-center relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 blur-[60px] rounded-full" />
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4 relative z-10">Almost Ready!</h2>
                    <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-10 relative z-10">
                        We need to finish the setup. Please double-check your <code className="text-accent bg-accent/5 px-2 py-0.5 rounded-md">FIREBASE_CONFIG</code> to enable sign-in.
                    </p>
                    <button onClick={onClose} className="w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 relative z-10">Acknowledge</button>
                </div>
            </div>
        );
    }

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth!, googleProvider!);
            const user = result.user;

            if (db) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (!userDoc.exists()) {
                        const username = generateRandomUsername();
                        await setDoc(doc(db, 'users', user.uid), {
                            username,
                            displayName: user.displayName || username,
                            email: user.email,
                            createdAt: new Date(),
                            lastSeen: new Date(),
                            onboardingComplete: false,
                            conversationsCount: 0,
                            totalSpeakingMinutes: 0,
                            countriesSpokenTo: [],
                            averageRating: 0,
                            totalRatings: 0
                        });
                        toast.success("You're in! Welcome to Norinly 🎉");
                    } else {
                        toast.success("Welcome back to Norinly! 🎉");
                    }
                } catch (firestoreErr: any) {
                    console.error('Firestore sync error:', firestoreErr);
                    toast.error('Sync error: Profile might not update immediately.');
                }
            }
            onClose();
            // Small delay to let modal close before redirecting
            setTimeout(() => {
                router.push('/chat');
            }, 100);
        } catch (err: any) {
            console.error('Google auth error:', err);
            let message = 'Google sign in failed. Please try again.';
            if (err.code === 'auth/popup-closed-by-user') {
                message = 'Sign-in popup closed before completion.';
            } else if (err.code === 'auth/network-request-failed') {
                message = 'Network error. Please check your connection.';
            } else if (err.code === 'auth/internal-error') {
                message = 'An internal error occurred. Please try again.';
            }
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-black/5 rounded-[3.5rem] shadow-premium-xl overflow-hidden animate-in zoom-in-95 duration-500 relative">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full" />
                
                <div className="p-10 md:p-12 border-b border-black/5 flex justify-between items-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">
                        {isLogin ? 'Hello' : 'Join Us'}<span className="text-accent">.</span>
                    </h2>
                    <button onClick={onClose} className="p-3 bg-black/5 border border-black/5 hover:bg-black/10 rounded-2xl text-zinc-400 hover:text-black transition-all active:scale-90 shadow-sm">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-10 md:p-12 space-y-12 relative z-10">
                    <div className="space-y-4">
                        <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight uppercase tracking-tight">
                            {isLogin 
                                ? 'Welcome Back!' 
                                : 'Start Your Journey'}
                        </h3>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed opacity-80 uppercase tracking-tight">
                            {isLogin
                                ? 'Sign in to sync your progress, connect with friends, and view your history.'
                                : 'Create your profile to connect with learners globally and track your progress.'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center space-x-4 disabled:opacity-70 shadow-premium active:scale-[0.98] relative overflow-hidden group"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-3">
                                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                                    <span className="animate-pulse uppercase text-[10px] tracking-widest">Verifying Identity...</span>
                                </div>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 48 48">
                                        <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                        <path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                        <path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                        <path fill="#1565c0" d="M43.611,20.083L43.611,20.083L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                    </svg>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Continue with Google</span>
                                </>
                            )}
                        </button>
                        
                        {error && <p className="text-secondary text-[10px] text-center font-black uppercase tracking-widest bg-secondary/10 py-3 rounded-xl border border-secondary/20">{error}</p>}
                    </div>

                    <div className="pt-6 border-t border-black/5 flex flex-col items-center gap-8">
                        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                            {isLogin ? "New here?" : "Already have an account?"}{' '}
                            <button 
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-accent hover:text-black transition-colors"
                            >
                                {isLogin ? 'Create Profile' : 'Sign In'}
                            </button>
                        </p>

                        <p className="text-center text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[300px] opacity-60 hover:opacity-100 transition-opacity">
                            By continuing, you accept our <br />
                            <span className="text-black">Community Guidelines & Privacy Policy</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

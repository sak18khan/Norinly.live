'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { auth, googleProvider, db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useState(() => {
        if (isOpen) {
            setIsLogin(initialMode === 'login');
        }
    });

    useEffect(() => {
        if (isOpen) {
            setIsLogin(initialMode === 'login');
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    // Firebase not configured — show notice
    if (!auth || !googleProvider) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="w-full max-w-sm bg-white border border-border rounded-[2rem] shadow-2xl p-8 text-center">
                    <h2 className="text-xl font-bold text-foreground mb-3">Auth not configured</h2>
                    <p className="text-secondary text-sm">
                        Set your <code className="text-accent">NEXT_PUBLIC_FIREBASE_*</code> environment variables to enable sign-in.
                    </p>
                    <button onClick={onClose} className="mt-8 px-8 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent-hover transition-all">Close</button>
                </div>
            </div>
        );
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth!, email, password);
                toast.success('Welcome to Norinly!');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
                const user = userCredential.user;
                const username = generateRandomUsername();

                await updateProfile(user, { displayName: username });

                // Save to Firestore
                if (db) {
                    await setDoc(doc(db, 'users', user.uid), {
                        username,
                        email: user.email,
                        createdAt: new Date(),
                        lastSeen: new Date(),
                        onboardingComplete: false
                    });
                }
                toast.success('Welcome to Norinly!');
            }
            setLoading(false);
            onClose();
            // Redirect to chat, ChatContext will handle ProfileSetupModal if needed
            router.push('/chat');
        } catch (err: any) {
            console.error('Auth error:', err);
            let message = 'Authentication failed. Please try again.';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                message = 'Invalid email or password';
            } else if (err.code === 'auth/network-request-failed') {
                message = 'Network error. Please check your connection.';
            } else if (err.code === 'auth/email-already-in-use') {
                message = 'Email already in use';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Invalid email address';
            } else if (err.code === 'auth/weak-password') {
                message = 'Password should be at least 6 characters';
            }
            setError(message);
            toast.error(message);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Attempting Google Sign-In...');
            const result = await signInWithPopup(auth!, googleProvider!);
            const user = result.user;
            console.log('Google Sign-In successful:', user.uid);

            // Check if user exists in Firestore
            if (db) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (!userDoc.exists()) {
                        const username = generateRandomUsername();
                        await updateProfile(user, { displayName: username });
                        await setDoc(doc(db, 'users', user.uid), {
                            username,
                            email: user.email,
                            createdAt: new Date(),
                            lastSeen: new Date(),
                            onboardingComplete: false
                        });
                        toast.success('Welcome to Norinly!');
                    } else {
                        toast.success('Welcome to Norinly!');
                    }
                } catch (firestoreErr: any) {
                    console.error('Firestore sync error:', firestoreErr);
                    // Don't block login if Firestore fails, but warn
                    toast.error('Sync error: Profile might not update immediately.');
                }
            }
            setLoading(false);
            onClose();
            router.push('/chat');
        } catch (err: any) {
            console.error('Google auth error detailed:', err);
            let message = 'Google sign in failed. Please try again.';

            if (err.code === 'auth/network-request-failed') {
                message = 'Network error. Please check your connection.';
            } else if (err.code === 'auth/popup-closed-by-user') {
                message = 'Sign-in popup closed before completion.';
            } else if (err.code === 'auth/operation-not-allowed') {
                message = 'Google sign-in is not enabled for this project.';
            } else if (err.code === 'auth/unauthorized-domain') {
                message = 'This domain is not authorized for Google sign-in.';
            } else if (err.code === 'auth/popup-blocked') {
                message = 'Sign-in popup was blocked. Please allow popups.';
            } else {
                // Show raw error code if unknown to help debugging
                message = `Google sign in failed: ${err.code || 'Unknown error'}`;
            }

            setError(message);
            toast.error(message);
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-border flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-surface rounded-full text-secondary transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <p className="text-secondary text-sm font-medium">
                        {isLogin
                            ? 'Login to reconnect with your practice partners and track progress.'
                            : 'Create a free account to build your learning profile and add friends.'}
                    </p>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-accent/20"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span>{isLogin ? 'Login' : 'Create Account'}</span>
                            )}
                        </button>
                    </form>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                        <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest"><span className="bg-white px-4 text-muted">Or</span></div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full bg-white border border-border text-foreground font-bold py-3.5 rounded-2xl hover:bg-surface transition-all flex items-center justify-center space-x-3 disabled:opacity-50 shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                            <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1565c0" d="M43.611,20.083L43.611,20.083L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    <p className="text-center text-sm text-muted font-medium">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-accent hover:underline font-bold"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    ArrowLeft,
    MessageSquare,
    Phone,
    Clock,
    MoreVertical,
    UserPlus,
    Loader2,
    Share2,
    Copy,
    Check,
    Globe,
    User,
    Camera
} from 'lucide-react';

import { useChatContext } from '@/context/ChatContext';
import HeaderFriendsList from '@/components/HeaderFriendsList';
import Footer from '@/components/Footer';

export default function FriendsPage() {
    const router = useRouter();
    const { currentUser, friends, setShowAuthModal, logout } = useChatContext();
    const [loading, setLoading] = useState(true);
    const [inviteLink, setInviteLink] = useState('');
    const [copied, setCopied] = useState(false);

    // Profile Edit State
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [country, setCountry] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            const timer = setTimeout(() => {
                if (!currentUser) {
                    setShowAuthModal(true);
                    setLoading(false);
                }
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setUsername(currentUser.displayName || '');
            setLoading(false);
        }
    }, [currentUser, setShowAuthModal]);

    const generateInviteLink = () => {
        const code = Math.random().toString(36).substring(2, 8);
        const link = `${window.location.origin}/invite/${code}`;
        setInviteLink(link);
    };

    const copyToClipboard = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSaveProfile = async () => {
        if (!currentUser) return;
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Profile updated! (Simulation)');
        }, 1000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-surface border border-border rounded-full flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-zinc-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Sign in to see friends</h1>
                <p className="text-zinc-400 mb-8 max-w-sm">
                    Create an account to save people you've enjoyed talking to and reconnect with them anytime.
                </p>
                <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-accent hover:bg-accent-hover text-white font-bold px-8 py-3 rounded-xl transition-all"
                >
                    Sign In / Sign Up
                </button>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 text-zinc-500 hover:text-white transition-colors"
                >
                    Back to Home
                </button>
                <div className="mt-20 w-full">
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex flex-col font-sans selection:bg-accent/30 selection:text-white">
            <header className="w-full px-6 py-6 border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/5 active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase italic">
                            Friends<span className="text-accent">.</span>
                        </h1>
                    </div>
                    <div className="flex items-center space-x-6">
                        <HeaderFriendsList />
                        <button
                            onClick={logout}
                            className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-accent transition-colors py-2 px-4 bg-white/5 border border-white/5 rounded-xl"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                {/* User Profile Section (Feature 9) */}
                <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    <div className="lg:col-span-1 flex flex-col items-center">
                        <div className="relative group perspective-1000">
                            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-zinc-900 border-2 border-white/5 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-accent/50 group-hover:shadow-[0_20px_50px_-15px_rgba(99,102,241,0.3)] shadow-premium rotate-3 group-hover:rotate-0">
                                {currentUser.photoURL ? (
                                    <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                                       <User className="w-16 h-16 text-zinc-700" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                    <Camera className="w-8 h-8 text-white animate-bounce" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{username || 'Anonymous Learner'}</h2>
                          <div className="flex items-center justify-center gap-2 mt-2">
                             <div className="w-2 h-2 rounded-full bg-positive-accent animate-pulse" />
                             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{currentUser.email}</span>
                          </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6 bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-[3rem] backdrop-blur-xl shadow-premium relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 blur-[80px] rounded-full" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Personal Identifier</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:bg-black/60 transition-all font-medium shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Home Base</label>
                                <div className="relative">
                                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="United States"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:bg-black/60 transition-all font-medium shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 relative z-10">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Mini Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell friends about yourself..."
                                rows={2}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:bg-black/60 transition-all font-medium resize-none shadow-inner"
                            />
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="w-full py-5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-glow-accent group relative z-10 overflow-hidden"
                        >
                            <span className="relative z-10">{isSaving ? 'Synchronizing...' : 'Save Profile Changes'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-hover opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>

                <hr className="border-border/50 mb-10" />

                {/* Invite Section (Feature 10) */}
                <div className="mb-16 bg-gradient-to-br from-accent/20 to-zinc-900/50 border border-accent/20 rounded-[3rem] p-10 md:p-12 relative overflow-hidden group shadow-premium-xl animate-in slide-in-from-bottom-12 duration-1000">
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/30 transition-all duration-700" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mb-6">
                           <Share2 className="w-3.5 h-3.5" /> Instant Direct Link
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">Invite to <span className="text-accent underline decoration-accent/20 decoration-8 underline-offset-4">Private Chat</span></h2>
                        <p className="text-zinc-400 text-lg mb-8 font-medium max-w-xl leading-relaxed">Want to talk to a specific friend? Generate a private link and share it with them. You'll bypass matchmaking and connect directly in a secure room.</p>

                        {!inviteLink ? (
                            <button
                                onClick={generateInviteLink}
                                className="flex items-center space-x-3 bg-accent hover:bg-accent-hover text-white px-8 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-glow-accent hover:scale-105 active:scale-95"
                            >
                                <UserPlus className="w-5 h-5" />
                                <span>Generate Private Key</span>
                            </button>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/50 border border-white/10 p-2 rounded-[2rem] backdrop-blur-3xl">
                                <code className="flex-1 px-6 py-3 text-xs md:text-sm font-mono text-accent truncate max-w-md">
                                    {inviteLink}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className={`w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-[1.4rem] text-[11px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-positive-accent text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? 'Copied to Clipboard' : 'Copy Link'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-8 flex justify-between items-end">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-accent" />
                          </div>
                          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Your Circle</h3>
                        </div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] pl-1">{friends.length} Network Connections</p>
                    </div>
                </div>

                {friends.length === 0 ? (
                    <div className="bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[3rem] p-16 text-center group hover:bg-white/[0.02] hover:border-accent/20 transition-all">
                        <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-[1.8rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-premium">
                            <UserPlus className="w-8 h-8 text-zinc-600 group-hover:text-accent transition-colors" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Your library is empty</h3>
                        <p className="text-zinc-500 text-sm font-medium mb-10 max-w-xs mx-auto leading-relaxed">Start exploring live rooms and use the heart button to add people to your network.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-accent/10 border border-accent/20 text-accent px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all shadow-glow-accent/20"
                        >
                            Find Someone Now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                        {friends.map((friend) => (
                            <div
                                key={friend.id}
                                className="bg-[#121214] border-2 border-white/5 p-6 rounded-[2.5rem] hover:border-accent/30 hover:bg-[#161618] transition-all group relative overflow-hidden"
                            >
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.4rem] bg-zinc-800 flex items-center justify-center border-2 border-white/5 overflow-hidden group-hover:border-accent/30 transition-all">
                                                <span className="text-2xl font-black text-zinc-600 group-hover:text-accent">
                                                    {friend.username.charAt(0)}
                                                </span>
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full border-[3px] border-[#121214] ${friend.status === 'online' ? 'bg-positive-accent shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-600'}`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-white group-hover:text-accent transition-colors tracking-tight">
                                                {friend.username}
                                            </span>
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center">
                                                {friend.status === 'online' ? (
                                                    <span className="text-positive-accent">Ready to chat</span>
                                                ) : (
                                                    <>
                                                        <Clock className="w-3 h-3 mr-1.5 opacity-50" />
                                                        Active {friend.lastSeen ? new Date(friend.lastSeen.seconds * 1000).toLocaleDateString() : 'recently'}
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            title="Quick Connect"
                                            className="p-3 bg-white/5 text-zinc-500 hover:bg-accent hover:text-white rounded-2xl transition-all active:scale-90"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 text-zinc-700 hover:text-white transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

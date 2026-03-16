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
        <div className="min-h-screen bg-background flex flex-col">
            <header className="w-full px-6 py-6 border-b border-border bg-surface/30 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-black tracking-tighter text-white">
                            FRIENDS<span className="text-accent">.</span>
                        </h1>
                    </div>
                    <div className="flex items-center space-x-6">
                        <HeaderFriendsList />
                        <button
                            onClick={logout}
                            className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-6">
                {/* User Profile Section (Feature 9) */}
                <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex flex-col items-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-3xl bg-zinc-800 border-2 border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-accent">
                                {currentUser.photoURL ? (
                                    <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-zinc-600" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-white tracking-tight">{username || 'Anonymous User'}</h2>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{currentUser.email}</span>
                    </div>

                    <div className="md:col-span-2 space-y-4 bg-surface/20 border border-border p-6 rounded-3xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Country</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="United States"
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell friends about yourself..."
                                rows={2}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50 transition-all font-medium resize-none"
                            />
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-accent/20"
                        >
                            {isSaving ? 'Saving...' : 'Update Profile'}
                        </button>
                    </div>
                </div>

                <hr className="border-border/50 mb-10" />

                {/* Invite Section (Feature 10) */}
                <div className="mb-10 bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Share2 className="w-32 h-32 text-accent" />
                    </div>
                    <div className="relative z-10 max-w-lg">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Invite to Private Chat</h2>
                        <p className="text-zinc-400 text-sm mb-6 font-medium">Want to talk to a specific friend? Generate a private link and share it with them. You'll bypass matchmaking and connect directly.</p>

                        {!inviteLink ? (
                            <button
                                onClick={generateInviteLink}
                                className="flex items-center space-x-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-accent/30"
                            >
                                <UserPlus className="w-5 h-5" />
                                <span>Generate Private Link</span>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2 bg-zinc-950/50 border border-white/10 p-1.5 rounded-2xl">
                                <code className="flex-1 px-4 text-xs font-mono text-zinc-300 truncate">
                                    {inviteLink}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-8 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-accent" />
                        <span className="text-sm font-bold text-zinc-100 uppercase tracking-[0.3em]">
                            Friends List <span className="text-zinc-500 ml-2">({friends.length})</span>
                        </span>
                    </div>
                </div>

                {friends.length === 0 ? (
                    <div className="bg-surface/30 border border-border border-dashed rounded-3xl p-12 text-center">
                        <div className="w-16 h-16 bg-zinc-900 border border-border rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-white font-bold mb-1">No friends yet</h3>
                        <p className="text-zinc-500 text-sm mb-6">Start a chat and use the "Add Friend" button to fill this list.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-accent/10 border border-accent/20 text-accent px-6 py-2 rounded-xl text-sm font-bold hover:bg-accent/20 transition-all"
                        >
                            Find Someone to Talk To
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {friends.map((friend) => (
                            <div
                                key={friend.id}
                                className="bg-surface/50 border border-border p-4 rounded-2xl hover:border-accent/30 transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-border">
                                                <span className="text-lg font-black text-zinc-500">
                                                    {friend.username.charAt(0)}
                                                </span>
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface ${friend.status === 'online' ? 'bg-green-500' : 'bg-zinc-600'}`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white group-hover:text-accent transition-colors">
                                                {friend.username}
                                            </span>
                                            <span className="text-xs text-zinc-500 flex items-center">
                                                {friend.status === 'online' ? (
                                                    <span className="text-green-500 font-medium">Online now</span>
                                                ) : (
                                                    <>
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Last seen {friend.lastSeen ? new Date(friend.lastSeen.seconds * 1000).toLocaleDateString() : 'a long time ago'}
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            title="Voice Call"
                                            className="p-2.5 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-xl transition-all"
                                        >
                                            <Phone className="w-4 h-4" />
                                        </button>
                                        <button
                                            title="Text Chat"
                                            className="p-2.5 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white rounded-xl transition-all"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                        <button className="p-2.5 text-zinc-500 hover:text-white transition-colors">
                                            <MoreVertical className="w-4 h-4" />
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

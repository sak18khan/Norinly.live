'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Check, X, User, Bell, Loader2, Users, MessageSquare, Globe, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function SocialDropdown() {
    const { currentUser, friends, acceptFriendRequest, declineFriendRequest } = useChatContext();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Listen to friend requests
    useEffect(() => {
        if (!currentUser || !db) return;

        const q = query(
            collection(db, 'friendRequests'),
            where('toUserId', '==', currentUser.uid),
            where('status', '==', 'pending')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reqs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(reqs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    if (!currentUser) return null;

    const totalNotifications = requests.length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-premium relative group active:scale-95 border ${isOpen ? 'bg-accent border-accent text-white shadow-premium' : 'bg-white border-black/5 text-secondary-text hover:border-accent/30 hover:text-foreground'}`}
            >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {totalNotifications > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-secondary text-white text-[10px] font-black rounded-xl flex items-center justify-center border-2 border-white shadow-premium animate-bounce">
                        {totalNotifications}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white/90 backdrop-blur-3xl border border-black/5 rounded-[2.5rem] shadow-premium-xl z-[100] overflow-hidden animate-in slide-in-from-top-4 duration-500">
                    <div className="p-6 border-b border-black/5 bg-black/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-accent/5 flex items-center justify-center">
                              <Users className="w-4 h-4 text-accent" />
                            </div>
                            <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">My Network</h3>
                        </div>
                        <span className="text-[9px] font-black text-zinc-400 bg-black/5 border border-black/5 px-3 py-1 rounded-full uppercase tracking-tighter">
                            {friends.length} Networked
                        </span>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto no-scrollbar py-2">
                        {/* Section: Pending Requests */}
                        {requests.length > 0 && (
                            <div className="px-4 py-3 border-b border-white/5 mb-2">
                                <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2 mb-4">Pending Requests ({requests.length})</h4>
                                <div className="space-y-3">
                                    {requests.map((req) => (
                                        <FriendRequestItem
                                            key={req.id}
                                            request={req}
                                            onAccept={() => acceptFriendRequest(req.id)}
                                            onDecline={() => declineFriendRequest(req.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Section: Friends List */}
                        <div className="px-4 py-3">
                            <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] px-2 mb-4">Your Network</h4>
                            {friends.length === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-4 text-center px-8 bg-black/[0.01] rounded-[2.5rem] border border-dashed border-black/10 mx-2">
                                    <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-zinc-300 shadow-premium">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <p className="text-[11px] font-bold text-zinc-400 leading-relaxed tracking-tight uppercase">
                                        No connections established yet. <br /> 
                                        <span className="text-accent underline cursor-pointer hover:text-black transition-colors" onClick={() => {setIsOpen(false); router.push('/connect');}}>Start Networking</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {friends.map((friend) => (
                                        <FriendListItem key={friend.id} friend={friend} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <Link 
                        href="/friends" 
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center py-5 bg-black/[0.02] text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all border-t border-black/5"
                    >
                        View Full Network
                    </Link>
                </div>
            )}
        </div>
    );
}

function FriendRequestItem({ request, onAccept, onDecline }: any) {
    return (
        <div className="bg-surface border border-black/5 p-4 rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-all shadow-premium">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/5 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-sm">
                    <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-black text-foreground truncate max-w-[100px] tracking-tight">{request.fromUsername || 'Learner'}</span>
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Wants to practice English</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onAccept}
                    className="w-9 h-9 rounded-xl bg-positive-accent/10 text-positive-accent hover:bg-positive-accent hover:text-white transition-all flex items-center justify-center border border-positive-accent/20 shadow-sm active:scale-90"
                >
                    <Check className="w-4 h-4" />
                </button>
                <button
                    onClick={onDecline}
                    className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all flex items-center justify-center border border-secondary/20 active:scale-90"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function FriendListItem({ friend }: any) {
    const profile = friend.profile;
    return (
        <div className="flex items-center justify-between p-4 hover:bg-black/5 rounded-2xl cursor-pointer transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center space-x-4 relative z-10">
                <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-black/5 flex items-center justify-center shrink-0 overflow-hidden group-hover:border-accent/30 transition-all shadow-premium">
                        {profile?.photoURL ? (
                            <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6 text-zinc-300 group-hover:text-accent transition-colors" />
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-positive-accent border-2 border-white shadow-premium" />
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-foreground group-hover:text-accent transition-colors leading-none tracking-tight">{profile?.username || profile?.name || 'Network Peer'}</span>
                    </div>
                    <span className="text-[8px] text-zinc-400 mt-1.5 uppercase font-black tracking-widest group-hover:text-zinc-600 transition-colors">
                        {profile?.country || 'English Learner'}
                    </span>
                </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-black/5 border border-black/5 flex items-center justify-center text-zinc-400 group-hover:text-accent group-hover:bg-accent/5 group-hover:border-accent/20 transition-all shadow-sm active:scale-90 relative z-10">
                <MessageSquare className="w-5 h-5" />
            </div>
        </div>
    );
}

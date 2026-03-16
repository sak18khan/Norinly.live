'use client';

import { useEffect, useState, useRef } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Users, Check, X, User } from 'lucide-react';

export default function HeaderFriendsList() {
    const { currentUser, friends, acceptFriendRequest } = useChatContext();
    const [isOpen, setIsOpen] = useState(false);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
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

    // Listen to friend requests in Firestore
    useEffect(() => {
        if (!currentUser || !db) return;
        
        const requestsRef = collection(db, 'users', currentUser.uid, 'friendRequests');
        const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
            const reqs: any[] = [];
            snapshot.forEach(doc => {
                reqs.push({ id: doc.id, ...doc.data() });
            });
            setPendingRequests(reqs);
        });
        
        return () => unsubscribe();
    }, [currentUser]);

    const handleDecline = async (friendId: string) => {
        if (!currentUser || !db) return;
        try {
            await deleteDoc(doc(db, 'users', currentUser.uid, 'friendRequests', friendId));
        } catch (err) {
            console.error('Error declining request:', err);
        }
    };

    if (!currentUser) return null;

    const totalNotifications = pendingRequests.length;

    return (
        <div className="relative mr-2" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-surface transition-colors text-muted hover:text-foreground"
            >
                <Users className="w-5 h-5" />
                {totalNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 w-80 bg-white text-foreground border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-4 border-b border-border bg-surface font-bold text-sm text-foreground">
                        Social
                    </div>
                    
                    <div className="overflow-y-auto flex-1 p-3 space-y-6 custom-scrollbar">
                        {/* Pending Requests */}
                        {pendingRequests.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Requests</h3>
                                {pendingRequests.map(req => (
                                    <div key={req.id} className="flex flex-col bg-surface border border-border rounded-xl p-3 space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shrink-0">
                                                <User className="w-4 h-4 text-muted" />
                                            </div>
                                            <span className="text-sm font-medium truncate flex-1">{req.fromUsername || 'Stranger'}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => acceptFriendRequest(req.fromUserId)}
                                                className="flex-1 bg-accent hover:bg-accent-hover text-white text-xs font-bold py-2 rounded-lg transition-colors flex justify-center items-center shadow-sm"
                                            >
                                                <Check className="w-3 h-3 mr-1" /> Accept
                                            </button>
                                            <button 
                                                onClick={() => handleDecline(req.fromUserId)}
                                                className="flex-1 bg-white border border-border hover:bg-red-50 hover:text-red-500 text-secondary text-xs font-bold py-2 rounded-lg transition-colors flex justify-center items-center"
                                            >
                                                <X className="w-3 h-3 mr-1" /> Decline
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Friends List */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Friends</h3>
                            {(!friends || friends.length === 0) ? (
                                <p className="text-sm text-muted px-2 py-6 text-center italic">No friends yet.</p>
                            ) : (
                                friends.map(friend => (
                                    <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-surface rounded-xl cursor-pointer transition-all group">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 overflow-hidden group-hover:border-accent/30 transition-colors">
                                                    <User className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                                                </div>
                                                <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${friend.status === 'online' ? 'bg-positive-accent' : 'bg-muted'}`}></span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-foreground leading-none">{friend.username}</span>
                                                <span className="text-[10px] text-muted mt-1.5 capitalize font-medium">{friend.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

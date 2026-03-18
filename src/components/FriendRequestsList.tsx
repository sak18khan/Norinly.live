'use client';

import { useState, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { Check, X, User, Bell, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FriendRequestsList() {
    const { currentUser } = useChatContext();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

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

    const handleAccept = async (req: any) => {
        if (!db || !currentUser) return;
        try {
            // Update request status
            await updateDoc(doc(db, 'friendRequests', req.id), {
                status: 'accepted',
                updatedAt: new Date()
            });

            // Add to both users' friends list (using a sub-collection or array)
            // For MVP, we'll use a 'friends' collection or just update the user doc
            // A separate 'friends' collection is better for scale
            const friendId = req.fromUserId;
            
            // Add to current user's friends
            const myFriendRef = doc(db, 'users', currentUser.uid, 'friends', friendId);
            await setDoc(myFriendRef, {
                friendId: friendId,
                addedAt: new Date()
            }, { merge: true });

            // Add to other user's friends
            const theirFriendRef = doc(db, 'users', friendId, 'friends', currentUser.uid);
            await setDoc(theirFriendRef, {
                friendId: currentUser.uid,
                addedAt: new Date()
            }, { merge: true });

            toast.success('Friend request accepted! 🤝');
        } catch (e) {
            console.error('Error accepting friend request:', e);
            toast.error('Failed to accept request');
        }
    };

    const handleReject = async (req: any) => {
        if (!db) return;
        try {
            await updateDoc(doc(db, 'friendRequests', req.id), {
                status: 'rejected',
                updatedAt: new Date()
            });
            toast.success('Request declined');
        } catch (e) {
            console.error('Error rejecting friend request:', e);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-accent hover:text-accent text-secondary transition-all shadow-sm relative group"
            >
                <Bell className={`w-5 h-5 ${requests.length > 0 ? 'animate-bell-ring' : ''} group-hover:scale-110 transition-transform`} />
                {requests.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {requests.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-border rounded-2xl shadow-premium-xl z-[100] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Friend Requests</h3>
                        <span className="text-[10px] font-bold text-muted bg-white border px-2 py-0.5 rounded-full">{requests.length} Pending</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-2 space-y-2 no-scrollbar">
                        {loading ? (
                            <div className="py-8 flex flex-col items-center justify-center gap-2">
                                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Checking...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center px-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-slate-400">No pending requests</p>
                            </div>
                        ) : (
                            requests.map((req) => (
                                <FriendRequestCard 
                                    key={req.id} 
                                    request={req} 
                                    onAccept={() => handleAccept(req)} 
                                    onReject={() => handleReject(req)} 
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function FriendRequestCard({ request, onAccept, onReject }: { request: any, onAccept: () => void, onReject: () => void }) {
    const [username, setUsername] = useState('Loading...');

    useEffect(() => {
        const fetchUsername = async () => {
            if (!db) return;
            const userDoc = await getDoc(doc(db, 'users', request.fromUserId));
            if (userDoc.exists()) {
                setUsername(userDoc.data().username || 'Learner');
            } else {
                setUsername('Anonymous');
            }
        };
        fetchUsername();
    }, [request.fromUserId]);

    return (
        <div className="bg-white border border-border p-3 rounded-xl flex items-center justify-between group hover:border-accent/30 transition-all shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-accent/5 rounded-lg flex items-center justify-center">
                    <User className="w-4.5 h-4.5 text-accent" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-slate-800 tracking-tight">{username}</span>
                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Wants to be friends</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onAccept}
                    className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center border border-emerald-100 shadow-sm"
                    title="Accept"
                >
                    <Check className="w-4 h-4" />
                </button>
                <button
                    onClick={onReject}
                    className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center border border-rose-100 shadow-sm"
                    title="Decline"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

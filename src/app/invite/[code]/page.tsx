'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChatContext } from '@/context/ChatContext';
import { Loader2 } from 'lucide-react';

export default function InvitePage() {
    const { code } = useParams();
    const router = useRouter();
    const { joinPrivateRoom } = useChatContext();

    useEffect(() => {
        if (code) {
            joinPrivateRoom(code as string).then(() => {
                router.push('/chat');
            });
        }
    }, [code, joinPrivateRoom, router]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-2xl bg-accent/20 animate-pulse scale-150" />
                    <Loader2 className="w-16 h-16 text-accent animate-spin relative z-10" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Joining Private Chat</h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Hang tight, we're connecting you to your friend...</p>
                </div>
            </div>
        </div>
    );
}

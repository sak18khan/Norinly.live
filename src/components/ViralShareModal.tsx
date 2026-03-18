'use client';

import { useState, useEffect } from 'react';
import { X, Share2, MessageSquare, Instagram, Copy, Globe, RefreshCcw, Heart } from 'lucide-react';
import { shareToWhatsApp, shareToInstagram, copyToClipboard, getSharingMessage } from '@/lib/sharing';

interface ViralShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    countryName?: string;
    countryCode?: string;
    stats?: {
        minutes: number;
        peopleMet: number;
    };
    isReconnectLoop?: boolean;
}

export default function ViralShareModal({ 
    isOpen, 
    onClose, 
    countryName, 
    countryCode,
    stats,
    isReconnectLoop = false
}: ViralShareModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    const getFlagEmoji = (code: string | undefined) => {
        if (!code) return '🌍';
        return code
            .toUpperCase()
            .replace(/./g, char =>
                String.fromCodePoint(127397 + char.charCodeAt(0))
            );
    };

    const shareMessage = getSharingMessage(countryName);

    return (
        <div className={`fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div 
                className={`w-full max-w-lg bg-white rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full md:translate-y-10 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Actions */}
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-accent/5 rounded-2xl border border-accent/10">
                        <Share2 className="w-6 h-6 text-accent" />
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-muted" />
                    </button>
                </div>

                {/* Content */}
                <div className="text-center space-y-6">
                    {countryName ? (
                        <div className="space-y-2">
                            <div className="text-4xl md:text-5xl mb-4 transform hover:scale-110 transition-transform duration-300 cursor-default">
                                {getFlagEmoji(countryCode)}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                                You just talked to someone from <span className="text-accent">{countryName}</span>
                            </h3>
                            <p className="text-secondary font-medium">Share your experience with friends!</p>
                        </div>
                    ) : stats ? (
                        <div className="space-y-2">
                            <div className="flex justify-center gap-4 mb-4">
                                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center min-w-[100px]">
                                    <div className="text-2xl font-black text-orange-600">{stats.minutes}m</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-orange-400">Practiced</div>
                                </div>
                                <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 text-center min-w-[100px]">
                                    <div className="text-2xl font-black text-accent">{stats.peopleMet}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-accent/60">Met People</div>
                                </div>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                                Amazing progress today! 🎉
                            </h3>
                            <p className="text-secondary font-medium">Show your friends how much you're improving.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                                Enjoying Norinly?
                            </h3>
                            <p className="text-secondary font-medium">Invite your friends to practice together!</p>
                        </div>
                    )}

                    {isReconnectLoop && (
                        <div className="bg-surface border border-border rounded-3xl p-5 md:p-6 mt-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                <Heart className="w-12 h-12 text-accent" />
                            </div>
                            <div className="relative z-10 text-left">
                                <h4 className="text-sm font-black uppercase tracking-widest text-secondary mb-1">Want to reconnect?</h4>
                                <p className="text-xs text-muted leading-relaxed">Share this unique link to find this person again later.</p>
                            </div>
                        </div>
                    )}

                    {/* Share Buttons */}
                    <div className="grid grid-cols-1 gap-3 md:gap-4 pt-6">
                        <button 
                            onClick={() => shareToWhatsApp(shareMessage)}
                            className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-green-200"
                        >
                            <MessageSquare className="w-5 h-5 fill-current" />
                            Share on WhatsApp
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <button 
                                onClick={() => shareToInstagram(shareMessage)}
                                className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white font-bold rounded-2xl hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-pink-200"
                            >
                                <Instagram className="w-5 h-5" />
                                Instagram
                            </button>
                            
                            <button 
                                onClick={() => copyToClipboard('https://norinly.live')}
                                className="flex items-center justify-center gap-3 w-full py-4 bg-slate-100 text-secondary font-bold rounded-2xl hover:bg-slate-200 active:scale-[0.98] transition-all"
                            >
                                <Copy className="w-5 h-5" />
                                Copy Link
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors pt-4"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
}

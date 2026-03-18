'use client';

import { useState } from 'react';
import { Gift, Copy, MessageSquare, ChevronRight, Sparkles, Trophy, Zap, Globe } from 'lucide-react';
import { shareToWhatsApp, copyToClipboard } from '@/lib/sharing';

export default function InviteCard() {
    const [inviteCount, setInviteCount] = useState(1); // Simulating progress
    const totalNeeded = 3;
    const progress = (inviteCount / totalNeeded) * 100;

    const inviteLink = 'https://norinly.live/join?ref=user123';
    const whatsappMessage = `Hey! I'm using Norinly to practice English by talking to real people. It's actually fun! Try it here: ${inviteLink}`;

    return (
        <section className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-premium-card rounded-3xl p-8 md:p-16 shadow-premium hover:shadow-premium-xl transition-all duration-500 group relative overflow-hidden">
                {/* Background Sparkles */}
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-32 h-32 text-primary" />
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="space-y-8 text-center lg:text-left flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary border border-primary/10 rounded-xl">
                            <Gift className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Referral Rewards</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[0.95] italic uppercase">
                            Invite Friends, <br />
                            <span className="text-brand-gradient not-italic">Unlock Rewards.</span>
                        </h2>
                        
                        <p className="text-base md:text-xl text-secondary-text max-w-xl font-bold uppercase tracking-tight opacity-70">
                            Share Norinly with friends and earn premium features like Country Filters and Extended Talk Time.
                        </p>

                        {/* Progress Bar */}
                        <div className="space-y-4 pt-4 max-w-md mx-auto lg:mx-0">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-black uppercase tracking-widest text-secondary-text opacity-50">Reward Progress</span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{inviteCount}/{totalNeeded} Joined</span>
                            </div>
                            <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden relative">
                                <div 
                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-sm"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                             {[
                                { title: '+10m Talk Time', icon: <Zap className="w-4 h-4" />, unlocked: inviteCount >= 1 },
                                { title: 'Country Filter', icon: <Globe className="w-4 h-4" />, unlocked: inviteCount >= 3 },
                             ].map((reward, i) => (
                                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${reward.unlocked ? 'bg-positive-accent/5 border-positive-accent/20 text-positive-accent' : 'bg-white border-border text-secondary-text opacity-50'}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${reward.unlocked ? 'bg-positive-accent/10' : 'bg-foreground/5'}`}>
                                        {reward.icon}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{reward.title}</span>
                                </div>
                             ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-auto shrink-0 flex flex-col gap-6">
                        <div className="bg-white border border-border p-10 rounded-3xl flex flex-col gap-8 text-center shadow-premium-sm group-hover:shadow-premium transition-all duration-500">
                            <div className="space-y-2">
                                <div className="text-[9px] font-black uppercase tracking-widest text-secondary-text opacity-50">Share your unique link</div>
                                <div className="text-[11px] font-bold text-foreground uppercase tracking-tight">Invite friends to join the fun</div>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-foreground/5 p-4 rounded-xl border border-transparent hover:border-primary/20 transition-colors">
                                <code className="text-xs font-mono text-foreground truncate max-w-[160px] tracking-tight">{inviteLink}</code>
                                <button 
                                    onClick={() => copyToClipboard(inviteLink)}
                                    className="p-2 hover:bg-primary/10 rounded-lg transition-all active:scale-90 group/btn"
                                    title="Copy Link"
                                >
                                    <Copy className="w-4 h-4 text-secondary-text group-hover/btn:text-primary" />
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => shareToWhatsApp(whatsappMessage)}
                                className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white font-black rounded-xl hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 text-[10px] uppercase tracking-widest"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                Invite via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

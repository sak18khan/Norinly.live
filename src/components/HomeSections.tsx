'use client';

import {
    Mic, Globe, Zap, Shield, MessageSquare, UserPlus, Flame, CheckCircle2, HelpCircle, ArrowRight, Sparkles, Users, Star, Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import InviteCard from '@/components/InviteCard';

export default function HomeSections() {
    const router = useRouter();

    const features = [
        { icon: <Mic className="w-5 h-5 text-primary" />, title: 'Real Conversations', desc: 'Talk to real people instantly for authentic practice.' },
        { icon: <Globe className="w-5 h-5 text-primary" />, title: 'Global Community', desc: 'Practice with English learners from every corner of the globe.' },
        { icon: <Zap className="w-5 h-5 text-positive-accent" />, title: 'Natural Fluency', desc: 'Speak naturally, not from textbooks, through real dialogue.' },
        { icon: <Users className="w-5 h-5 text-secondary" />, title: 'Genuine Connection', desc: 'No bots, no scripts. Just you and another human sharing thoughts.' },
        { icon: <MessageSquare className="w-5 h-5 text-primary" />, title: 'No Judgment', desc: 'A safe space where everyone is here to learn and build confidence.' },
        { icon: <UserPlus className="w-5 h-5 text-secondary" />, title: 'Stay Connected', desc: 'Add great practice partners and continue your journey together.' },
    ];

    const steps = [
        { number: '01', title: 'Click Start', desc: 'Jump into a room instantly with a partner.' },
        { number: '02', title: 'Get Matched', desc: 'Our smart algorithm pairs you in seconds.' },
        { number: '03', title: 'Start Speaking', desc: 'No templates, just real conversation.' },
    ];

    const testimonials = [
        { text: "I met a student from Italy today and we talked for two hours. It felt like I made a real friend!", name: "Sarah Miller", location: "London, UK", rating: 5 },
        { text: "No bots, just real humans. That makes all the difference when building confidence. I feel so much more comfortable now.", name: "David Kovac", location: "Berlin, Germany", rating: 5 },
        { text: "The spontaneous nature of the chats forces you to use what you know. It's the most authentic way to practice speaking.", name: "Elena Rossi", location: "Milan, Italy", rating: 5 },
    ];

    const faqs = [
        { q: "What is Norinly?", a: "Norinly is an anonymous voice chat platform where you can connect with strangers from around the world for real English speaking practice." },
        { q: "Is it free?", a: "Yes, Norinly is completely free to use for all learners." },
        { q: "Do I need an account?", a: "No account is required to start talking. You can optionally sign up to add friends and track progress." },
        { q: "Is voice chat anonymous?", a: "Absolutely. We don't require personal info, and we don't use cameras. Your identity remains private." },
    ];

    return (
        <div className="w-full space-y-20 md:space-y-32 pb-16 md:pb-32">
            {/* SECTION 1 — FEATURES */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm">
                        <Zap className="w-3.5 h-3.5" />
                        <span>The Fast Track</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-[0.95] tracking-tighter italic uppercase">
                        Learn by <span className="text-brand-gradient not-italic">Speaking.</span>
                    </h2>
                    <p className="text-secondary-text text-sm md:text-lg max-w-2xl mx-auto font-bold uppercase tracking-tight leading-tight opacity-70">
                        Real conversations help you improve faster than lessons. <br className="hidden md:block" /> Built for those who want to speak better.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="bg-premium-card p-10 rounded-3xl transition-all duration-500 group hover:shadow-premium-xl hover:-translate-y-2 hover:bg-white relative overflow-hidden cursor-default shadow-premium">
                            <div className="mb-8 bg-surface border border-border w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-3 group-hover:text-primary transition-colors uppercase italic tracking-tight">{f.title}</h3>
                            <p className="text-secondary-text leading-relaxed text-[11px] opacity-70 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-tight">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>



            {/* SECTION 3 — THE MISSION */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="relative overflow-hidden bg-white border border-border p-12 md:p-24 rounded-3xl group shadow-premium hover:shadow-premium-xl transition-all duration-700">
                    <div className="absolute top-0 right-0 -m-24 w-[500px] h-full bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-all duration-1000" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="space-y-12 text-center lg:text-left flex-1">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                                <Users className="w-4 h-4 mr-1" />
                                <span>Core Philosophy</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.9] tracking-tighter italic uppercase">
                                Real Human <br /><span className="text-brand-gradient not-italic">Connection.</span>
                            </h2>
                            <p className="text-lg md:text-2xl text-secondary-text font-bold uppercase tracking-tight leading-tight max-w-2xl opacity-80">
                                AI can compute syntax, but it cannot share instinct. Norinly is built for raw human interaction.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="text-primary font-black text-5xl md:text-7xl italic tracking-tighter leading-none">0%</div>
                                    <div className="text-[10px] uppercase font-black tracking-widest text-secondary-text leading-none opacity-50">Synthetic Nodes</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-primary font-black text-5xl md:text-7xl italic tracking-tighter leading-none">100%</div>
                                    <div className="text-[10px] uppercase font-black tracking-widest text-secondary-text leading-none opacity-50">Human Practice</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4 — SAFETY */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
                    <div className="w-full md:w-1/2 space-y-12 order-2 md:order-1 text-center md:text-left">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-[0.95] tracking-tighter uppercase italic">Safe & <br className="hidden md:block" /><span className="text-brand-gradient not-italic">Private.</span></h2>
                            <p className="text-base md:text-xl text-secondary-text font-bold uppercase tracking-tight leading-tight opacity-70">
                                Practice English without fear. <br className="hidden md:block" /> Stay anonymous and comfortable.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            {[
                                { icon: <Shield className="w-5 h-5" />, title: 'ANONYMOUS CHATS', desc: 'No personal info required. Your privacy is our priority.' },
                                { icon: <Flame className="w-5 h-5" />, title: 'SUPPORTIVE SPACE', desc: 'A safe community for learners of all levels to grow.' },
                                { icon: <Globe className="w-5 h-5" />, title: 'WORLDWIDE REACH', desc: 'Active learners from 100+ nations online every day.' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-premium-card hover:bg-white transition-all duration-500 group shadow-premium">
                                    <div className="bg-primary/5 p-4 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                        {item.icon}
                                    </div>
                                    <div className="text-left space-y-1">
                                        <h4 className="text-foreground text-lg font-black uppercase tracking-tight italic leading-none">{item.title}</h4>
                                        <p className="text-secondary-text font-bold text-[10px] uppercase tracking-widest leading-none opacity-50">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
                        <div className="relative group perspective-1000">
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-all duration-1000" />
                            <div className="relative bg-premium-card h-64 w-64 md:h-[480px] md:w-[480px] rounded-3xl shadow-premium-xl flex items-center justify-center animate-float group-hover:scale-105 transition-all duration-700 overflow-hidden">
                                <Shield className="w-32 h-32 md:w-56 md:h-56 text-primary drop-shadow-[0_20px_40px_rgba(99,102,241,0.2)] relative z-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5 — TESTIMONIALS */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <Users className="w-3.5 h-3.5" />
                        <span>Social Proof</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase italic leading-none">Global Voices.</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-premium-card p-10 rounded-3xl relative h-full flex flex-col shadow-premium hover:shadow-premium-xl hover:bg-white transition-all duration-500 group cursor-default">
                             <div className="flex items-center gap-1 mb-8 text-primary">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                             </div>
                            <p className="text-lg font-black text-foreground italic tracking-tight leading-tight mb-10">"{t.text}"</p>
                            <div className="mt-auto border-t border-border pt-8 flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary text-lg font-black shadow-sm group-hover:rotate-6 transition-transform">
                                    {t.name[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-foreground font-black tracking-tight text-base uppercase italic leading-none">{t.name}</span>
                                    <span className="text-secondary-text font-bold text-[9px] uppercase tracking-widest opacity-50">{t.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 5.5 — VIRAL LOOP / INVITE */}
            <InviteCard />

            {/* SECTION 6 — COMMON QUESTIONS (FAQ) */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="bg-slate-50/50 p-12 md:p-24 rounded-[3rem] border border-black/5 relative overflow-hidden shadow-premium">
                    <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full" />

                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="text-center mb-20 space-y-6">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-border text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Support Center</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic leading-none">Common <br /><span className="text-brand-gradient not-italic">Questions.</span></h2>
                            <p className="text-secondary-text text-sm md:text-lg font-bold uppercase tracking-tight leading-tight opacity-70">Everything you need to know about practicing English on Norinly.</p>
                        </div>

                        <div className="grid gap-4">
                            {faqs.map((faq, i) => (
                                <FAQItem key={i} question={faq.q} answer={faq.a} />
                            ))}
                        </div>

                        <div className="mt-20 pt-12 border-t border-black/5 text-center">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-8">Still have questions?</p>
                            <button
                                onClick={() => router.push('/connect')}
                                className="inline-flex items-center gap-6 group px-10 py-5 rounded-2xl bg-foreground text-white hover:bg-primary transition-all shadow-premium active:scale-95"
                            >
                                <span className="font-black uppercase tracking-widest text-[10px] italic">Speak with a human now</span>
                                <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white group-hover:text-primary flex items-center justify-center transition-all">
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-premium-card border transition-all duration-500 overflow-hidden ${isOpen ? 'border-primary/20 shadow-premium-xl bg-white scale-[1.02]' : 'border-transparent shadow-premium'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-10 text-left group"
            >
                <span className="text-xl font-black text-foreground uppercase italic tracking-tight group-hover:text-primary transition-colors">{question}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-primary text-white rotate-180 shadow-glow-accent' : 'bg-primary/5 text-primary'}`}>
                    <Plus className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} />
                </div>
            </button>
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 p-10 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <p className="text-secondary-text font-bold text-sm uppercase tracking-tight leading-relaxed opacity-70">
                    {answer}
                </p>
            </div>
        </div>
    );
}

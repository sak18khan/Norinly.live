'use client';

import {
    Mic,
    Globe,
    Dices,
    Gamepad2,
    Smile,
    UserPlus,
    Shield,
    Zap,
    MessageSquare,
    Heart,
    HelpCircle,
    ArrowRight,
    Flame,
    CheckCircle2,
    Lock,
    MessageCircle,
    Clock,
    LayoutGrid,
    TrendingUp,
    Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomeSections() {
    const router = useRouter();

    const features = [
        { icon: <Mic className="w-6 h-6 text-accent" />, title: 'Instant Conversations', desc: 'Connect instantly with real people for speaking practice.' },
        { icon: <Globe className="w-6 h-6 text-accent" />, title: 'Learners Worldwide', desc: 'Speak with English learners and speakers globally.' },
        { icon: <Zap className="w-6 h-6 text-positive-accent" />, title: 'Improve Fluency', desc: 'Build confidence through real-time verbal communication.' },
        { icon: <Shield className="w-6 h-6 text-secondary-accent" />, title: 'Guided Topics', desc: 'Topic prompts to keep your conversations productive.' },
        { icon: <MessageSquare className="w-6 h-6 text-accent" />, title: 'Relaxed Environment', desc: 'Voice-only chat for pressure-free learning.' },
        { icon: <UserPlus className="w-6 h-6 text-secondary-accent" />, title: 'Stay Connected', desc: 'Add great practice partners to your friends list.' },
    ];

    const steps = [
        { number: '1️⃣', title: 'Choose Practice Type', desc: 'Select from casual chat, interview prep, and more.' },
        { number: '2️⃣', title: 'Get Matched Instantly', desc: 'Connect with a speaking partner in seconds.' },
        { number: '3️⃣', title: 'Have a Conversation', desc: 'Practice speaking with guided topic prompts.' },
    ];

    const testimonials = [
        { text: "I met someone from Brazil and we talked for an hour.", author: "Anonymous User" },
        { text: "I improved my English by talking with strangers.", author: "Language Learner" },
        { text: "I love the debate feature. It's surprisingly fun.", author: "Debate Enthusiasts" },
    ];

    const faqs = [
        { q: "What is Norinly?", a: "Norinly is an anonymous voice chat platform where you can connect with strangers from around the world for real conversations." },
        { q: "Is Norinly free?", a: "Yes, Norinly is completely free to use." },
        { q: "Do I need an account?", a: "No account is required to start talking. You can optionally sign up to add friends and keep in touch." },
        { q: "Is voice chat anonymous?", a: "Absolutely. We don't require personal info, and we don't use cameras. Your identity remains private." },
        { q: "How does Debate Mode work?", a: "Debate Mode pairs you with someone to discuss a random topic in timed rounds with a voting system." },
        { q: "Can I reconnect with people?", a: "Yes, you can add people as friends durante a conversation to reconnect with them later if they accept." },
    ];

    return (
        <div className="w-full space-y-24 md:space-y-48 pb-16 md:pb-48">
            {/* SECTION 1 — PLATFORM FEATURES */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                        Everything You Need to <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary-accent">Speak English Fluently</span>
                    </h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        Powerful tools designed to help you master spoken English through practice.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white border border-border p-10 rounded-[2rem] transition-all duration-300 group hover:shadow-xl hover:shadow-accent/5 hover:border-accent/40">
                            <div className="mb-6 bg-white border border-border w-fit p-4 rounded-2xl group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                                <div className="group-hover:text-white transition-colors duration-500">
                                    {f.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                            <p className="text-secondary font-normal text-sm md:text-base leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 2 — HOW IT WORKS */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="bg-white border border-border p-12 md:p-24 rounded-[4rem] shadow-sm">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-24 text-foreground tracking-tight">How to Start Practicing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                        {steps.map((s, i) => (
                            <div key={i} className="flex flex-col items-center text-center space-y-8 relative z-10">
                                <div className="w-20 h-20 bg-[#F1F5F9] border border-border rounded-2xl flex items-center justify-center text-2xl font-bold text-accent shadow-sm">
                                    {s.number.replace('1️⃣', '1').replace('2️⃣', '2').replace('3️⃣', '3')}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-foreground">{s.title}</h3>
                                    <p className="text-secondary font-medium text-base md:text-lg max-w-[280px] mx-auto leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3 — DEBATE MODE */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 md:p-20 rounded-[3rem] group">
                    <div className="absolute top-0 right-0 -m-8 w-96 h-96 bg-accent/10 blur-[100px] rounded-full" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-8 text-center md:text-left">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                                <Flame className="w-4 h-4" />
                                <span>Advanced Learning</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white">Debate Mode</h2>
                            <p className="text-lg md:text-xl text-slate-400 font-normal max-w-xl leading-relaxed">
                                Elevate your fluency by challenging others in structured debates. The ultimate way to practice complex articulation.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
                                {[
                                    'practice expressing opinions',
                                    'timed speaking rounds',
                                    'challenging topics',
                                    'vocabulary expansion',
                                    'speaking confidence'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <CheckCircle2 className="w-5 h-5 text-accent" />
                                        <span className="text-sm md:text-base font-semibold">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => router.push('/connect?mode=debate')}
                                className="mt-4 px-10 py-5 bg-accent hover:bg-accent-hover text-white rounded-2xl font-bold transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-accent/20 text-base"
                            >
                                Try Debate Practice
                            </button>
                        </div>
                        <div className="hidden lg:flex w-1/3 aspect-square bg-white/5 backdrop-blur-sm border border-white/10 rounded-[3rem] items-center justify-center p-12 group-hover:border-accent/30 transition-all duration-700">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <div className="absolute inset-0 border-2 border-dashed border-accent/30 rounded-full animate-spin [animation-duration:15s]" />
                                <Flame className="w-32 h-32 text-accent opacity-30 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4 — WHY SPEAKING */}
            <section className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">Why Fluency Starts With Speaking</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { text: 'Real-time conversation practice', icon: <Mic className="w-5 h-5" /> },
                        { text: 'Low-pressure, voice-only chat', icon: <Shield className="w-5 h-5" /> },
                        { text: 'Connect with global learners', icon: <Globe className="w-5 h-5" /> },
                        { text: 'Immediate verbal feedback cycle', icon: <Zap className="w-5 h-5" /> },
                        { text: 'Perfect for building confidence', icon: <Smile className="w-5 h-5" /> },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-4 p-6 bg-white border border-border hover:border-accent hover:shadow-md rounded-2xl transition-all group">
                            <div className="text-accent group-hover:scale-110 transition-transform">{item.icon}</div>
                            <span className="text-secondary text-sm md:text-base font-semibold">{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 5 — SAFETY & PRIVACY */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="bg-surface border border-border p-12 md:p-20 rounded-[3rem] flex flex-col md:flex-row gap-16 items-center">
                    <div className="w-full md:w-1/2 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">Focus on Learning, <br /><span className="text-accent">Stay Protected</span></h2>
                            <p className="text-lg text-secondary">We prioritize your safety so you can focus on mastering your English skills.</p>
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: 'anonymous practice', desc: 'No personal details or camera required to start learning.' },
                                { title: 'respectful community', desc: 'A dedicated focus on language learning and mutual respect.' },
                                { title: 'active moderation', desc: 'Ensuring a safe and friendly environment for all learners.' },
                                { title: 'report violations', desc: 'Instant reporting tools to keep the community professional.' },
                                { title: 'verified partners', desc: 'Connect with a global network of serious English learners.' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="bg-white border border-border p-1 rounded-lg mt-1 shadow-sm">
                                        <CheckCircle2 className="w-5 h-5 text-positive-accent flex-shrink-0" />
                                    </div>
                                    <div>
                                        <h4 className="text-foreground text-base md:text-lg font-bold capitalize">{item.title}</h4>
                                        <p className="text-secondary text-sm font-normal">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/10 blur-[80px] rounded-full" />
                            <div className="relative bg-white border border-border h-64 w-64 md:h-80 md:w-80 rounded-[3rem] shadow-xl flex items-center justify-center">
                                <Shield className="w-32 h-32 md:w-48 md:h-48 text-accent animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6 — TESTIMONIALS */}
            <section className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">What Our Learners Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white border border-border p-10 rounded-[2.5rem] relative h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <MessageSquare className="absolute top-8 right-8 w-8 h-8 text-accent/10" />
                            <div className="flex-grow">
                                <p className="text-lg md:text-xl text-foreground font-medium italic mb-10 leading-relaxed">"{t.text}"</p>
                            </div>
                            <div className="font-bold text-xs text-muted uppercase tracking-widest mt-auto border-t border-border pt-6 flex items-center space-x-3">
                                <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center text-accent text-[10px]">
                                    {t.author[0]}
                                </div>
                                <span>{t.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 7 — FAQ */}
            <section className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </section>

            {/* SECTION 8 — FINAL CALL TO ACTION */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="bg-slate-900 border border-slate-800 p-16 md:p-28 rounded-[4rem] text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-tight">Ready to Master <br />English Fluency?</h2>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-normal">
                            Join millions of learners worldwide and start practicing with real people today.
                        </p>
                        <button
                            onClick={() => router.push('/connect')}
                            className="px-14 py-6 bg-accent hover:bg-accent-hover text-white rounded-[2rem] font-bold text-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-accent/40"
                        >
                            Start Practicing Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-accent shadow-md' : 'border-border shadow-sm'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-8 text-left"
            >
                <span className="text-lg font-bold text-foreground">{question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-accent text-white rotate-180' : 'bg-surface text-secondary'}`}>
                    <HelpCircle className="w-5 h-5" />
                </div>
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 p-8 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <p className="text-secondary font-normal leading-relaxed text-base">
                    {answer}
                </p>
            </div>
        </div>
    );
}

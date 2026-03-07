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
        { icon: <Mic className="w-6 h-6 text-accent" />, title: 'Voice-Only Chat', desc: 'Talk naturally without cameras.' },
        { icon: <Globe className="w-6 h-6 text-accent" />, title: 'Global Connections', desc: 'Meet people from different countries.' },
        { icon: <Dices className="w-6 h-6 text-accent" />, title: 'Conversation Prompts', desc: 'Instant icebreakers for every chat.' },
        { icon: <Gamepad2 className="w-6 h-6 text-accent" />, title: 'Mini Games', desc: 'Play games while talking.' },
        { icon: <Smile className="w-6 h-6 text-accent" />, title: 'Emoji Reactions', desc: 'React instantly during conversations.' },
        { icon: <UserPlus className="w-6 h-6 text-accent" />, title: 'Add Friends', desc: 'Reconnect with great people you meet.' },
    ];

    const steps = [
        { number: '1️⃣', title: 'Click Start Talking', desc: 'Instantly connect with a stranger.' },
        { number: '2️⃣', title: 'Talk, Play, or Debate', desc: 'Use prompts, games, or Debate Mode.' },
        { number: '3️⃣', title: 'Skip or Add Friends', desc: 'Continue exploring new conversations.' },
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
        <div className="w-full space-y-32 pb-32">
            {/* SECTION 1 — PLATFORM FEATURES */}
            <section className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white leading-tight">
                    Powerful Features for <br /><span className="text-accent">Real Conversations</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="bg-surface/40 hover:bg-surface/60 border border-border p-8 rounded-3xl transition-all duration-300 group hover:-translate-y-1">
                            <div className="mb-4 bg-accent/10 w-fit p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-zinc-400 font-light">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 2 — HOW NORINLY WORKS */}
            <section className="max-w-6xl mx-auto px-6">
                <div className="bg-surface/30 border border-border p-12 rounded-[3rem]">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">How Norinly Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-border -z-10" />
                        {steps.map((s, i) => (
                            <div key={i} className="flex flex-col items-center text-center space-y-4">
                                <div className="text-4xl mb-2">{s.number}</div>
                                <h3 className="text-xl font-bold text-white">{s.title}</h3>
                                <p className="text-zinc-400 font-light max-w-[200px]">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3 — DEBATE MODE */}
            <section className="max-w-6xl mx-auto px-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-orange-500/20 p-12 rounded-[3rem] group">
                    <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-6 text-center md:text-left">
                            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-bold uppercase tracking-wider">
                                <Flame className="w-4 h-4" />
                                <span>Unique Feature</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white">🔥 Debate Mode</h2>
                            <p className="text-xl text-zinc-400 font-light max-w-xl">
                                Challenge strangers in structured debates with timed rounds and topics.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
                                {[
                                    '1v1 debate matches',
                                    'timed speaking rounds',
                                    'random debate topics',
                                    'winner voting system',
                                    'points and ranking'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-2">
                                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => router.push('/connect')}
                                className="mt-4 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/20"
                            >
                                Try Debate Mode
                            </button>
                        </div>
                        <div className="w-full md:w-1/3 aspect-square bg-gradient-to-tr from-surface to-transparent border border-border rounded-3xl flex items-center justify-center p-8 group-hover:border-orange-500/30 transition-colors">
                            <div className="relative w-full h-full flex items-center justify-center">
                                <div className="absolute inset-0 border-2 border-dashed border-orange-500/20 rounded-full animate-spin [animation-duration:10s]" />
                                <Flame className="w-24 h-24 text-orange-500 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="absolute top-4 left-4 bg-surface p-4 rounded-2xl border border-border transform -rotate-12 group-hover:-translate-x-4 transition-transform duration-500">
                                    <TrendingUp className="w-8 h-8 text-orange-400" />
                                </div>
                                <div className="absolute bottom-4 right-4 bg-surface p-4 rounded-2xl border border-border transform rotate-12 group-hover:translate-x-4 transition-transform duration-500">
                                    <Award className="w-8 h-8 text-orange-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4 — WHY VOICE CHAT */}
            <section className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">Why Voice Chat Feels More Real</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { text: 'more natural communication', icon: <Mic className="w-5 h-5" /> },
                        { text: 'no camera pressure', icon: <Shield className="w-5 h-5" /> },
                        { text: 'anonymous conversations', icon: <Lock className="w-5 h-5" /> },
                        { text: 'better emotional connection', icon: <Heart className="w-5 h-5" /> },
                        { text: 'perfect for shy users', icon: <Smile className="w-5 h-5" /> },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-4 p-6 bg-surface/20 border border-border hover:border-accent/30 rounded-2xl transition-all">
                            <div className="text-accent">{item.icon}</div>
                            <span className="text-zinc-200 font-medium">{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 5 — SAFETY & PRIVACY */}
            <section className="max-w-6xl mx-auto px-6">
                <div className="bg-accent/5 border border-accent/20 p-12 rounded-[3.5rem] flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2 space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Safe and Anonymous <br /><span className="text-accent">Conversations</span></h2>
                        <div className="space-y-4">
                            {[
                                { title: 'no signup required', desc: 'Start chatting without sharing personal details.' },
                                { title: 'anonymous voice chat', desc: 'No cameras, just your voice and personality.' },
                                { title: 'moderation tools', desc: 'Active systems ensuring a friendly environment.' },
                                { title: 'report system', desc: 'Easy reporting for any platform violations.' },
                                { title: 'optional friend connections', desc: 'Only connect when you feel comfortable.' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-white font-bold capitalize">{item.title}</h4>
                                        <p className="text-zinc-400 text-sm font-light">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                            <div className="relative bg-surface border-4 border-accent/20 h-64 w-64 rounded-[3rem] flex items-center justify-center p-8">
                                <Shield className="w-32 h-32 text-accent animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6 — TESTIMONIALS */}
            <section className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">What Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-surface/30 border border-border p-8 rounded-3xl relative">
                            <MessageCircle className="absolute top-6 right-6 w-8 h-8 text-accent/20" />
                            <p className="text-lg text-zinc-300 italic mb-6">"{t.text}"</p>
                            <div className="font-bold text-sm text-zinc-500 uppercase tracking-widest">— {t.author}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 7 — FAQ */}
            <section className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </section>

            {/* SECTION 8 — FINAL CALL TO ACTION */}
            <section className="max-w-6xl mx-auto px-6">
                <div className="bg-accent border border-accent/50 p-16 md:p-24 rounded-[4rem] text-center shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)]">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to Talk to <br />Someone New?</h2>
                    <p className="text-xl md:text-2xl text-blue-100/70 mb-12 max-w-2xl mx-auto font-light">
                        Start a real conversation with someone from anywhere in the world.
                    </p>
                    <button
                        onClick={() => router.push('/connect')}
                        className="px-12 py-6 bg-white text-accent hover:bg-zinc-100 rounded-full font-black text-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl"
                    >
                        Start Talking
                    </button>
                </div>
            </section>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-surface/40 border border-border rounded-2xl overflow-hidden transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="text-lg font-bold text-white">{question}</span>
                <HelpCircle className={`w-5 h-5 text-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 p-6 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <p className="text-zinc-400 font-light leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
}

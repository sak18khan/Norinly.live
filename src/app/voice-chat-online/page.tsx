'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mic, Zap, Shield, Globe, Monitor, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function VoiceChatOnline() {
    const router = useRouter();

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'seo_page_visit', { page: '/voice-chat-online' });
        }
    }, []);

    const handleCTAClick = () => {
        if (analytics) {
            logEvent(analytics, 'seo_cta_click', { page: '/voice-chat-online' });
            logEvent(analytics, 'start_chat_from_seo', { source: '/voice-chat-online' });
        }
        router.push('/connect');
    };

    const features = [
        { icon: <Monitor className="w-6 h-6 text-accent" />, title: 'No App Required', desc: 'Join directly from your web browser on any device.' },
        { icon: <Zap className="w-6 h-6 text-accent" />, title: 'Zero Signup', desc: 'Start talking instantly without creating an account.' },
        { icon: <Shield className="w-6 h-6 text-accent" />, title: 'Safe & Secure', desc: 'Anonymous voice chat with no cameras for maximum privacy.' },
        { icon: <Globe className="w-6 h-6 text-accent" />, title: 'Connect Globally', desc: 'Meet people from around the world without geographical limits.' },
    ];

    const faqs = [
        { q: "Do I need to download anything?", a: "No, Norinly is a web-based platform. You can start voice chatting directly from your browser." },
        { q: "Is registration mandatory?", a: "Registration is 100% optional. You can enjoy the full voice chat experience as a guest." },
        { q: "Does it work on mobile?", a: "Yes, Norinly is fully optimized for mobile browsers, so you can talk on the go." },
        { q: "Is voice chat free?", a: "Yes, our online voice chat service is completely free of charge." },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30 selection:text-white">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden text-center px-6">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-background to-background -z-10" />
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                            Voice Chat Online <br /> <span className="text-accent">with Strangers</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
                            Join voice conversations instantly without downloading an app or signing up. 
                            Norinly provides a seamless, web-based experience for real connections.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={handleCTAClick}
                                className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 font-bold text-white transition-all duration-200 bg-accent rounded-full hover:bg-accent-hover shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)] scale-100 hover:scale-105 active:scale-95 text-xl cursor-pointer"
                            >
                                Start Voice Chat
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <div className="bg-surface/30 border border-border p-8 md:p-16 rounded-[3rem] overflow-hidden relative">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 blur-3xl rounded-full" />
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Instant Voice Connections Anywhere</h2>
                                <p className="text-zinc-400 text-lg font-light">
                                    Why wait for downloads? Norinly is designed for the modern web. Simply open our site, 
                                    press start, and you're immediately connected to someone new. It's the simplest way 
                                    to have meaningful voice conversations online.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    <div className="flex items-center space-x-3 text-zinc-300">
                                        <div className="bg-green-500/20 p-1 rounded-full"><Zap className="w-4 h-4 text-green-500" /></div>
                                        <span>No signup required</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-zinc-300">
                                        <div className="bg-green-500/20 p-1 rounded-full"><Zap className="w-4 h-4 text-green-500" /></div>
                                        <span>Safe & Anonymous</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-zinc-300">
                                        <div className="bg-green-500/20 p-1 rounded-full"><Zap className="w-4 h-4 text-green-500" /></div>
                                        <span>Global networking</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-zinc-300">
                                        <div className="bg-green-500/20 p-1 rounded-full"><Zap className="w-4 h-4 text-green-500" /></div>
                                        <span>High-quality audio</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center md:justify-end">
                                <div className="bg-background/80 border border-border p-1 rounded-3xl shadow-2xl backdrop-blur-xl">
                                    <div className="bg-surface p-8 rounded-[1.4rem] border border-border/50 text-center space-y-6">
                                        <Monitor className="w-20 h-20 text-accent mx-auto" />
                                        <div className="space-y-2">
                                            <p className="text-white font-bold">Web-Based Platform</p>
                                            <p className="text-zinc-500 text-sm">Optimized for Chrome, Safari, and Firefox.</p>
                                        </div>
                                        <button onClick={handleCTAClick} className="w-full py-3 bg-accent/20 hover:bg-accent/30 text-accent font-bold rounded-xl transition-colors">
                                            Open Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-8 bg-surface/20 border border-transparent hover:border-border hover:bg-surface/30 rounded-3xl transition-all">
                                <div className="mb-4 text-accent">{f.icon}</div>
                                <h4 className="text-lg font-bold text-white mb-2">{f.title}</h4>
                                <p className="text-zinc-400 text-sm font-light">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 border-t border-border/50">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Voice Chat Help</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-32">
                    <div className="bg-surface border border-border p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-3xl md:text-6xl font-black text-white mb-8">Talk Instantly Now</h2>
                        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light">
                            Experience the best browser-based voice chat. No strings attached.
                        </p>
                        <button
                            onClick={handleCTAClick}
                            className="px-12 py-6 bg-accent text-white hover:bg-accent-hover rounded-full font-black text-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            Start Voice Chat
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-surface/30 border border-border rounded-2xl overflow-hidden transition-all">
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

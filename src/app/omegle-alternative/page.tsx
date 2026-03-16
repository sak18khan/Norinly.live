'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mic, Zap, Shield, MessageSquare, Award, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function OmegleAlternative() {
    const router = useRouter();

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'seo_page_visit', { page: '/omegle-alternative' });
        }
    }, []);

    const handleCTAClick = () => {
        if (analytics) {
            logEvent(analytics, 'seo_cta_click', { page: '/omegle-alternative' });
            logEvent(analytics, 'start_chat_from_seo', { source: '/omegle-alternative' });
        }
        router.push('/connect');
    };

    const features = [
        { icon: <Mic className="w-6 h-6 text-accent" />, title: 'Voice-First', desc: 'A more personal alternative to text-only or video chat.' },
        { icon: <Shield className="w-6 h-6 text-accent" />, title: 'Better Privacy', desc: 'No cameras means you can relax and be yourself.' },
        { icon: <Zap className="w-6 h-6 text-accent" />, title: 'Faster Matching', desc: 'Our advanced matchmaking connects you in seconds.' },
        { icon: <MessageSquare className="w-6 h-6 text-accent" />, title: 'Pure Talk', desc: 'Focus on conversation without distractions.' },
    ];

    const faqs = [
        { q: "Why is Norinly a good Omegle alternative?", a: "Norinly focuses on high-quality voice interactions, offering a more personal and safer environment than traditional random chat apps." },
        { q: "Is Norinly safer than Omegle?", a: "By being voice-only, we remove many of the risks associated with video-based chat while maintaining the excitement of meeting strangers." },
        { q: "Can I use Norinly on my phone?", a: "Yes, Norinly is designed to work perfectly on mobile browsers, making it a great on-the-go alternative." },
        { q: "Are there any age restrictions?", a: "Yes, Norinly is for users aged 18 and over. We have active moderation to ensure a safe community." },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30 selection:text-white">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden text-center px-6">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-background to-background -z-10" />
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-4">
                            <Award className="w-4 h-4" />
                            <span>Top Rated Alternative</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                            Best Omegle Alternative <br /> <span className="text-accent">for Voice Chat</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
                            Norinly offers a modern alternative to traditional random chat platforms with voice-first communication. 
                            Skip the video and connect instantly through pure conversation.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={handleCTAClick}
                                className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 font-bold text-white transition-all duration-200 bg-accent rounded-full hover:bg-accent-hover shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)] scale-100 hover:scale-105 active:scale-95 text-xl cursor-pointer"
                            >
                                Try Norinly Now
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why People Choose Norinly</h2>
                                <p className="text-zinc-400 text-lg font-light leading-relaxed">
                                    Many users look for Omegle alternatives because they want a simpler, more focused experience. 
                                    Norinly provides exactly that by specializing in voice communication.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center text-accent">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Better Privacy and Simplicity</h4>
                                        <p className="text-zinc-400 text-sm">No cameras, no complicated setup. Just your voice and a world of strangers to meet.</p>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center text-accent">
                                        <Mic className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Advantages of Voice-Only</h4>
                                        <p className="text-zinc-400 text-sm">Voice eliminates the awkwardness of video while providing more depth than simple text chat.</p>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center text-accent">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Connect Instantly Without Video</h4>
                                        <p className="text-zinc-400 text-sm">Our platform is built for speed. Get matched and start talking in less than 5 seconds.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
                            <div className="relative bg-surface/50 border border-border aspect-square rounded-[3rem] p-12 flex flex-col justify-center items-center text-center space-y-8 backdrop-blur-md">
                                <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center shadow-[0_0_50px_-5px_var(--color-accent)]">
                                    <Mic className="w-16 h-16 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-2xl font-black text-white uppercase tracking-tighter">Voice First Chat</p>
                                    <p className="text-zinc-500 font-medium">The Future of Meeting Strangers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-surface/20 border-y border-border py-16 md:py-24">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="bg-surface/40 border border-border p-8 rounded-3xl hover:bg-surface/60 transition-all text-center">
                                    <div className="mb-4 bg-accent/10 w-fit p-3 rounded-2xl mx-auto">{f.icon}</div>
                                    <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
                                    <p className="text-zinc-400 text-sm font-light">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Platform FAQs</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="max-w-5xl mx-auto px-6 pb-20 md:pb-32 text-center">
                    <h2 className="text-3xl md:text-6xl font-black text-white mb-10 leading-tight">The Best Alternative <br /> is Just One Click Away</h2>
                    <button
                        onClick={handleCTAClick}
                        className="group relative px-12 py-6 bg-accent text-white hover:bg-accent-hover rounded-full font-black text-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
                    >
                        <span className="relative z-10">Try Norinly Now</span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                    <p className="text-zinc-500 mt-8 font-medium">No credit card. No download. No nonsense.</p>
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

'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mic, Shield, Zap, Globe, MessageCircle, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function TalkToStrangers() {
    const router = useRouter();

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'seo_page_visit', { page: '/talk-to-strangers' });
        }
    }, []);

    const handleCTAClick = () => {
        if (analytics) {
            logEvent(analytics, 'seo_cta_click', { page: '/talk-to-strangers' });
            logEvent(analytics, 'start_chat_from_seo', { source: '/talk-to-strangers' });
        }
        router.push('/connect');
    };

    const features = [
        { icon: <Zap className="w-6 h-6 text-accent" />, title: 'Instant Connections', desc: 'Start talking with someone new in seconds.' },
        { icon: <Mic className="w-6 h-6 text-accent" />, title: 'Voice Only', desc: 'Focus on the conversation without camera pressure.' },
        { icon: <Shield className="w-6 h-6 text-accent" />, title: '100% Anonymous', desc: 'No personal information required to start.' },
        { icon: <Globe className="w-6 h-6 text-accent" />, title: 'Global Community', desc: 'Meet people from all over the world.' },
    ];

    const faqs = [
        { q: "Is Norinly free to use?", a: "Yes, Norinly is completely free to use for everyone." },
        { q: "Can I talk to strangers without an account?", a: "Absolutely. You can start talking instantly without any signup." },
        { q: "Is it safe to talk to strangers online?", a: "Norinly is voice-only and anonymous to protect your privacy. You can skip any conversation at any time." },
        { q: "How do I start a conversation?", a: "Just click the 'Start Talking' button and you'll be paired with a random stranger instantly." },
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
                            Talk to Strangers <br /> <span className="text-accent">Online Instantly</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
                            Norinly allows people to instantly connect with strangers through anonymous voice chat. 
                            Start conversations with people from around the world without sharing personal information.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={handleCTAClick}
                                className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 font-bold text-white transition-all duration-200 bg-accent rounded-full hover:bg-accent-hover shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)] scale-100 hover:scale-105 active:scale-95 text-xl cursor-pointer"
                            >
                                Start Talking
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Talk to Strangers Online?</h2>
                            <p className="text-zinc-400 text-lg font-light leading-relaxed">
                                Conversations with strangers offer a unique perspective and the freedom to express yourself 
                                without the constraints of social expectations. Whether you're looking for a quick chat, 
                                wanting to practice a language, or simply curious about other cultures, Norinly provides 
                                the perfect platform.
                            </p>
                            <ul className="space-y-4 pt-4">
                                <li className="flex items-start space-x-3">
                                    <div className="mt-1 bg-accent/20 p-1 rounded-full"><Zap className="w-4 h-4 text-accent" /></div>
                                    <span className="text-zinc-300">Break out of your social bubble</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="mt-1 bg-accent/20 p-1 rounded-full"><MessageCircle className="w-4 h-4 text-accent" /></div>
                                    <span className="text-zinc-300">Spontaneous and real-time interactions</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="mt-1 bg-accent/20 p-1 rounded-full"><Shield className="w-4 h-4 text-accent" /></div>
                                    <span className="text-zinc-300">Privacy-focused anonymous environment</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-surface/30 border border-border p-8 rounded-[2.5rem] relative group">
                            <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-2xl font-bold text-white mb-6">How Norinly Works</h3>
                            <div className="space-y-8">
                                <div className="flex items-center space-x-4">
                                    <div className="text-2xl font-black text-accent/50 w-8">01</div>
                                    <p className="text-zinc-200 font-medium">Click the Start Button</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-2xl font-black text-accent/50 w-8">02</div>
                                    <p className="text-zinc-200 font-medium">Wait seconds to be matched</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-2xl font-black text-accent/50 w-8">03</div>
                                    <p className="text-zinc-200 font-medium">Start your voice conversation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-surface/20 border-y border-border py-16 md:py-24">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white">Feature Highlights</h2>
                            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">Everything you need for a comfortable anonymous experience.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="bg-surface/40 border border-border p-8 rounded-3xl hover:border-accent/40 transition-colors">
                                    <div className="mb-4">{f.icon}</div>
                                    <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
                                    <p className="text-zinc-400 text-sm font-light">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Common Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="max-w-5xl mx-auto px-6 pb-20 md:pb-32">
                    <div className="bg-accent border border-accent/50 p-12 md:p-20 rounded-[2.5rem] text-center shadow-[0_0_80px_-20px_rgba(59,130,246,0.2)]">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Start Talking Instantly</h2>
                        <p className="text-lg md:text-xl text-blue-100/70 mb-10 max-w-xl mx-auto">
                            Join thousands of users online right now and start your first conversation.
                        </p>
                        <button
                            onClick={handleCTAClick}
                            className="px-10 py-5 bg-white text-accent hover:bg-zinc-100 rounded-full font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            Connect Now
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

'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mic, Dices, Users, FastForward, Globe, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function RandomVoiceChat() {
    const router = useRouter();

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'seo_page_visit', { page: '/random-voice-chat' });
        }
    }, []);

    const handleCTAClick = () => {
        if (analytics) {
            logEvent(analytics, 'seo_cta_click', { page: '/random-voice-chat' });
            logEvent(analytics, 'start_chat_from_seo', { source: '/random-voice-chat' });
        }
        router.push('/connect');
    };

    const features = [
        { icon: <Dices className="w-6 h-6 text-accent" />, title: 'Random Matching', desc: 'Connect with a completely new person every time you click next.' },
        { icon: <Mic className="w-6 h-6 text-accent" />, title: 'Crystal Clear Audio', desc: 'High-quality voice chat that feels like you\'re in the same room.' },
        { icon: <FastForward className="w-6 h-6 text-accent" />, title: 'Instant Skip', desc: 'Not vibing? Skip instantly and find a new partner in seconds.' },
        { icon: <Users className="w-6 h-6 text-accent" />, title: 'Real People Only', desc: 'Our community is made of real users looking for genuine talk.' },
    ];

    const faqs = [
        { q: "What is random voice chat?", a: "Random voice chat is a way to instantly connect with people you don't know for a spontaneous conversation using only your voice." },
        { q: "Can I choose who I talk to?", a: "The system pairs you randomly to keep things exciting, but you can skip anyone instantly if the conversation isn't for you." },
        { q: "Is it better than text chat?", a: "Voice chat allows for much more natural communication, including tone and emotion, making it feel more real than typing." },
        { q: "How many people are online?", a: "Norinly has thousands of users active at all times from every time zone in the world." },
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
                            Random Voice Chat <br /> <span className="text-accent">with Real People</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
                            Norinly connects you randomly for voice conversations with people globally. 
                            Experience spontaneous and authentic connections without any setup.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={handleCTAClick}
                                className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 font-bold text-white transition-all duration-200 bg-accent rounded-full hover:bg-accent-hover shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)] scale-100 hover:scale-105 active:scale-95 text-xl cursor-pointer"
                            >
                                Start Random Voice Chat
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 border-t border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
                                <div className="relative bg-surface border border-border h-64 w-64 md:h-80 md:w-80 rounded-[3rem] flex items-center justify-center p-8 overflow-hidden">
                                     <Dices className="w-32 h-32 md:w-48 md:h-48 text-accent/20 absolute -bottom-10 -right-10 rotate-12" />
                                     <Mic className="w-20 h-20 md:w-32 md:h-32 text-accent" />
                                     <div className="absolute top-8 left-8 flex space-x-1">
                                        {[1,2,3].map(i => <div key={i} className="w-1 h-4 bg-accent/40 rounded-full animate-speaking-bar" style={{animationDelay: `${i * 0.2}s`}} />)}
                                     </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">The Magic of Random Conversations</h2>
                            <p className="text-zinc-400 text-lg font-light leading-relaxed">
                                What is random voice chat? It's the thrill of meeting someone completely new with no 
                                preconceived notions. Voice conversations feel more natural than text because you 
                                can hear the nuances of a person's voice—their laughter, their hesitation, and their 
                                genuine excitement.
                            </p>
                            <div className="space-y-4 pt-4">
                                <div className="bg-surface/40 p-5 rounded-2xl border border-border flex items-start space-x-4">
                                    <Globe className="w-6 h-6 text-accent mt-1" />
                                    <div>
                                        <h4 className="text-white font-bold">Meet people from around the world</h4>
                                        <p className="text-zinc-400 text-sm">Expand your horizons by chatting with users from different continents and cultures.</p>
                                    </div>
                                </div>
                                <div className="bg-surface/40 p-5 rounded-2xl border border-border flex items-start space-x-4">
                                    <FastForward className="w-6 h-6 text-accent mt-1" />
                                    <div>
                                        <h4 className="text-white font-bold">Skip and connect anytime</h4>
                                        <p className="text-zinc-400 text-sm">You're always one click away from a brand new experience. Keep searching until you find a great talk.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-surface/20 border-y border-border py-16 md:py-24">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white">Everything is Instant</h2>
                            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">Designed for the fastest connection possible.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="bg-surface/40 border border-border p-8 rounded-3xl group hover:-translate-y-1 transition-all">
                                    <div className="mb-4 bg-accent/10 w-fit p-3 rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">{f.icon}</div>
                                    <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
                                    <p className="text-zinc-400 text-sm font-light">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Random Chat FAQs</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="max-w-5xl mx-auto px-6 pb-20 md:pb-32">
                    <div className="bg-gradient-to-br from-accent to-accent-hover p-12 md:p-20 rounded-[2.5rem] text-center shadow-[0_0_80px_-20px_rgba(59,130,246,0.2)]">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Ready for a <br className="md:hidden" /> New Connection?</h2>
                        <p className="text-lg md:text-xl text-blue-100/70 mb-10 max-w-xl mx-auto">
                            The next person you meet could be anywhere. Start the dice rolling now.
                        </p>
                        <button
                            onClick={handleCTAClick}
                            className="px-10 py-5 bg-white text-accent hover:bg-zinc-100 rounded-full font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            Start Random Chat
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

'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mic, Shield, Zap, Globe, MessageCircle, HelpCircle, CheckCircle2, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';
import Script from 'next/script';
import Link from 'next/link';
import { blogPosts } from '@/data/blogPosts';

interface FAQ {
    q: string;
    a: string;
}

interface SEOLandingPageProps {
    slug: string;
    title: string;
    description: string;
    heroHighlight: string;
    contentTitle: string;
    contentParagraph: string;
    faqs: FAQ[];
}

export default function SEOLandingPage({
    slug,
    title,
    description,
    heroHighlight,
    contentTitle,
    contentParagraph,
    faqs
}: SEOLandingPageProps) {
    const router = useRouter();

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'seo_page_visit', { page: slug });
        }
        window.scrollTo(0, 0);
    }, [slug]);

    const handleCTAClick = () => {
        if (analytics) {
            logEvent(analytics, 'seo_cta_click', { page: slug });
            logEvent(analytics, 'start_chat_from_seo', { source: slug });
        }
        router.push('/connect');
    };

    const features = [
        { icon: <Sparkles className="w-6 h-6 text-accent" />, title: 'English Only', desc: 'Focus on practicing your English speaking skills with real people.' },
        { icon: <Mic className="w-6 h-6 text-accent" />, title: 'Voice Practice', desc: 'Improve your pronunciation and fluency in real conversations.' },
        { icon: <Globe className="w-6 h-6 text-accent" />, title: 'Global Peers', desc: 'Connect with language learners and speakers from around the world.' },
        { icon: <Shield className="w-6 h-6 text-accent" />, title: 'Safe Environment', desc: 'A moderated community focused on learning and respect.' },
    ];

    // Structured Data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/20 selection:text-foreground">
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-24 pb-20 md:pt-32 md:pb-40 overflow-hidden text-center px-6">
                    <div className="absolute inset-0 bg-white -z-10" />
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-accent text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span>English Speaking Practice</span>
                        </div>
                        <h1 className="text-4xl md:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
                            {title} <br /> <span className="bg-gradient-to-r from-accent to-secondary-accent bg-clip-text text-transparent">{heroHighlight}</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
                            {description}
                        </p>
                        <div className="pt-8">
                            <button
                                onClick={handleCTAClick}
                                className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-accent rounded-2xl hover:bg-accent-hover shadow-xl shadow-accent/20 scale-100 hover:scale-[1.02] active:scale-[0.98] text-xl cursor-pointer"
                            >
                                Start Practicing Free
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-6xl font-bold text-foreground leading-[1.1]">{contentTitle}</h2>
                            <p className="text-secondary text-lg md:text-2xl font-normal leading-relaxed">
                                {contentParagraph}
                            </p>
                            <div className="space-y-4 pt-4">
                                {[
                                    'Improve fluency with real conversations',
                                    'Connect with partners at your level',
                                    'Practice anytime, anywhere for free',
                                    'Build confidence in a safe community'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 bg-positive-accent/10 p-1 rounded-full">
                                            <CheckCircle2 className="w-5 h-5 text-positive-accent" />
                                        </div>
                                        <span className="text-secondary font-semibold text-lg">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-10 bg-accent/5 blur-[100px] rounded-full opacity-50" />
                            <div className="relative bg-white border border-border p-8 md:p-12 rounded-[3rem] shadow-sm">
                                <h3 className="text-xl font-bold text-foreground mb-10 uppercase tracking-widest text-muted">How It Works</h3>
                                <div className="space-y-12">
                                    {[
                                        { step: '01', text: 'Select "Casual" or "Debate" practice mode' },
                                        { step: '02', text: 'Instant matching with an English speaker' },
                                        { step: '03', text: '5-minute timed practice session' },
                                        { step: '04', text: 'Real-time stats and progress tracking' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center space-x-6 group">
                                            <div className="text-4xl font-bold text-accent/10 w-12 group-hover:text-accent/20 transition-colors">{item.step}</div>
                                            <p className="text-foreground text-xl font-bold leading-tight">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white border-y border-border py-24 md:py-40">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16 md:mb-24">
                            <h2 className="text-3xl md:text-7xl font-bold text-foreground leading-tight">Why Choose Norinly?</h2>
                            <p className="text-secondary mt-8 text-lg md:text-2xl max-w-2xl mx-auto font-normal">
                                The most effective way to learn a language is by speaking it. Norinly makes it instant and effortless.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((f, i) => (
                                <div key={i} className="bg-surface border border-border p-10 rounded-[2.5rem] hover:shadow-xl transition-all duration-300 group">
                                    <div className="mb-8 p-4 bg-white shadow-sm w-fit rounded-2xl group-hover:scale-110 transition-transform">{f.icon}</div>
                                    <h4 className="text-xl font-bold text-foreground mb-4">{f.title}</h4>
                                    <p className="text-secondary text-base font-normal leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-4xl mx-auto px-6 py-24 md:py-40">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-6xl font-bold text-foreground mb-6 leading-tight">Common Questions</h2>
                        <p className="text-secondary text-lg md:text-xl font-normal">Everything you need to know about practicing on Norinly.</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </section>

                {/* Latest from Blog Section */}
                <section className="bg-surface border-y border-border py-24 md:py-40">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-6xl font-bold text-foreground leading-tight">Latest From Our Blog</h2>
                                <p className="text-secondary mt-6 text-lg md:text-xl font-normal">Expert tips and strategies to accelerate your language journey.</p>
                            </div>
                            <Link 
                                href="/blog"
                                className="inline-flex items-center space-x-2 text-accent font-bold text-lg hover:underline decoration-2 underline-offset-8"
                            >
                                <span>View All Posts</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {blogPosts.slice(0, 3).map((post, i) => (
                                <Link key={i} href={`/blog/${post.slug}`} className="group block">
                                    <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                                        <div className="relative aspect-video overflow-hidden">
                                            <img 
                                                src={post.image} 
                                                alt={post.title}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                                            />
                                            <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-accent">
                                                {post.category}
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-4 flex-grow">
                                            <h4 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                                                {post.title}
                                            </h4>
                                            <p className="text-secondary text-sm leading-relaxed line-clamp-2">
                                                {post.description}
                                            </p>
                                        </div>
                                        <div className="px-8 pb-8 pt-4 flex items-center justify-between border-t border-border/50 mx-8">
                                            <span className="text-[10px] font-black text-muted uppercase tracking-widest">{post.date}</span>
                                            <span className="text-[10px] font-black text-muted uppercase tracking-widest">{post.readTime}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="max-w-7xl mx-auto px-6 pb-24 md:pb-48 pt-24">
                    <div className="bg-accent p-12 md:p-32 rounded-[3.5rem] text-center shadow-2xl shadow-accent/20 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 space-y-10">
                            <h2 className="text-3xl md:text-8xl font-bold text-white leading-[1.1]">Start Your First <br />Conversation Today</h2>
                            <p className="text-xl md:text-3xl text-white/80 max-w-3xl mx-auto font-normal leading-relaxed">
                                Join 5,000+ English learners and start speaking fluently from day one.
                            </p>
                            <button
                                onClick={handleCTAClick}
                                className="px-12 py-6 bg-white text-accent hover:bg-surface rounded-2xl font-bold text-2xl transition-all hover:scale-105 shadow-xl"
                            >
                                Practice Now — It's Free
                            </button>
                        </div>
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
        <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden transition-all hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-8 md:p-10 text-left group"
            >
                <span className="text-xl md:text-2xl font-bold text-foreground group-hover:text-accent transition-colors text-left">{question}</span>
                <div className={`p-2 rounded-xl transition-all duration-300 flex-shrink-0 ${isOpen ? 'bg-accent/10 text-accent rotate-180' : 'bg-surface text-muted'}`}>
                    <HelpCircle className="w-6 h-6 outline-none" />
                </div>
            </button>
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 p-8 md:p-10 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <p className="text-secondary text-lg md:text-xl font-normal leading-relaxed border-t border-border pt-8">
                    {answer}
                </p>
            </div>
        </div>
    );
}

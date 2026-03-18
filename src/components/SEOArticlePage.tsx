'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Zap, Shield, MessageSquare, ArrowRight, CheckCircle2, Users, Award, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

interface ArticleSection {
    heading: string;
    level: 1 | 2 | 3;
    content: string | string[]; // string for paragraph, string[] for bullet points
}

interface SEOArticlePageProps {
    slug: string;
    title: string;
    description: string;
    heroImage?: string;
    sections: ArticleSection[];
    ctaText?: string;
}

export default function SEOArticlePage({
    slug,
    title,
    description,
    sections,
    ctaText = "Start Practicing Free"
}: SEOArticlePageProps) {
    const router = useRouter();

    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'article_view', { page: slug });
        }
        window.scrollTo(0, 0);
    }, [slug]);

    const handleCTAClick = () => {
        if (analytics) {
            logEvent(analytics, 'article_cta_click', { page: slug });
        }
        router.push('/connect');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/20 selection:text-foreground">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden px-6 bg-slate-50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent -z-10" />
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-accent text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>English Speaking Guide</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                            {title}
                        </h1>
                        <p className="text-lg md:text-2xl text-secondary max-w-3xl mx-auto font-medium leading-relaxed">
                            {description}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                            <div className="flex items-center space-x-2 text-sm font-bold text-muted uppercase tracking-widest">
                                <Users className="w-4 h-4 text-accent" />
                                <span>15 Min Read</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                            <div className="flex items-center space-x-2 text-sm font-bold text-muted uppercase tracking-widest">
                                <Award className="w-4 h-4 text-accent" />
                                <span>Expert Verified</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
                    {/* Article Content */}
                    <article className="space-y-12">
                        {sections.map((section, index) => {
                            const HeadingTag = section.level === 1 ? 'h1' : section.level === 2 ? 'h2' : 'h3';
                            const headingClass = section.level === 1 ? "text-4xl md:text-6xl font-black text-foreground mb-8" : 
                                               section.level === 2 ? "text-3xl md:text-5xl font-black text-foreground mt-16 mb-6 pt-8 border-t border-border/50" : 
                                               "text-2xl md:text-3xl font-bold text-foreground mt-10 mb-4";

                            return (
                                <div key={index} className="animate-in fade-in duration-700 delay-150">
                                    <HeadingTag className={headingClass}>{section.heading}</HeadingTag>
                                    {Array.isArray(section.content) ? (
                                        <ul className="space-y-4 my-6">
                                            {section.content.map((item, i) => (
                                                <li key={i} className="flex items-start space-x-4 group">
                                                    <div className="mt-1.5 bg-accent/10 p-1 rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
                                                        <CheckCircle2 className="w-4 h-4 text-accent group-hover:text-white" />
                                                    </div>
                                                    <span className="text-lg md:text-xl text-secondary leading-relaxed font-medium group-hover:text-foreground transition-colors">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-lg md:text-xl text-secondary leading-relaxed font-medium whitespace-pre-line">
                                            {section.content}
                                        </p>
                                    )}

                                    {/* Inline CTA every 3-4 sections */}
                                    {(index + 1) % 4 === 0 && (
                                        <div className="my-16 p-8 md:p-12 bg-slate-950 rounded-[3rem] text-white overflow-hidden relative group">
                                            <div className="absolute inset-x-0 bottom-0 h-full bg-accent/20 blur-[100px] -z-10 group-hover:bg-accent/30 transition-all" />
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                                <div className="space-y-4 text-center md:text-left">
                                                    <h3 className="text-2xl md:text-4xl font-black leading-tight">Ready to test these tips?</h3>
                                                    <p className="text-slate-400 font-medium text-lg">Talk to a real person on Norinly right now.</p>
                                                </div>
                                                <button 
                                                    onClick={handleCTAClick}
                                                    className="px-10 py-5 bg-accent hover:bg-white hover:text-accent text-white rounded-2xl font-black transition-all flex items-center gap-3 whitespace-nowrap shadow-glow-accent group-hover:scale-105"
                                                >
                                                    Start Speaking Instantly
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Final Author Note / CTA */}
                        <div className="mt-24 p-12 md:p-20 bg-accent rounded-[4rem] text-white text-center shadow-2xl shadow-accent/20 relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                             <div className="relative z-10 space-y-10">
                                <h2 className="text-4xl md:text-8xl font-black leading-[1] tracking-tighter">Become Fluent <br />Faster with Norinly</h2>
                                <p className="text-xl md:text-3xl text-white/80 max-w-3xl mx-auto font-medium">
                                    Stop studying and start speaking. Join the global community practicing right now.
                                </p>
                                <button
                                    onClick={handleCTAClick}
                                    className="px-16 py-8 bg-white text-accent hover:bg-slate-50 rounded-[2rem] font-black text-2xl transition-all hover:scale-105 shadow-xl flex items-center gap-4 mx-auto"
                                >
                                    {ctaText}
                                    <ArrowRight className="w-8 h-8" />
                                </button>
                             </div>
                        </div>
                    </article>

                    {/* Sidebar / Quick Links */}
                    <aside className="space-y-8 lg:sticky lg:top-32 h-fit">
                        <div className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm">
                            <h4 className="text-xl font-black text-foreground mb-6 uppercase tracking-widest text-muted">Quick Access</h4>
                            <div className="space-y-4">
                                <button onClick={handleCTAClick} className="w-full text-left p-4 rounded-2xl hover:bg-accent/5 flex items-center justify-between group transition-all">
                                    <span className="font-bold text-foreground">Free Voice Practice</span>
                                    <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-all translate-x-1" />
                                </button>
                                <button onClick={() => router.push('/connect?mode=debate')} className="w-full text-left p-4 rounded-2xl hover:bg-orange-500/5 flex items-center justify-between group transition-all">
                                    <span className="font-bold text-foreground">Debate Challenge</span>
                                    <ArrowRight className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-all translate-x-1" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-border p-8 rounded-[2.5rem]">
                            <h4 className="text-xl font-black text-foreground mb-6 uppercase tracking-widest text-muted">Why Norinly?</h4>
                            <div className="space-y-6">
                                {[
                                    { icon: <Zap className="w-5 h-5 text-accent" />, text: "Instant Global Matching" },
                                    { icon: <Shield className="w-5 h-5 text-accent" />, text: "100% Anonymous & Safe" },
                                    { icon: <MessageSquare className="w-5 h-5 text-accent" />, text: "Real Human Feedback" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm border border-border/50">
                                            {item.icon}
                                        </div>
                                        <span className="font-bold text-secondary text-sm">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}


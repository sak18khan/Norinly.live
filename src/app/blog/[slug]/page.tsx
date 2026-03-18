'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts, BlogPost } from '@/data/blogPosts';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    
    const post = blogPosts.find(p => p.slug === slug);
    const relatedPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 3);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black mb-6">Post Not Found</h1>
                <Link href="/blog" className="text-accent font-black uppercase tracking-widest hover:underline">Back to Blog</Link>
            </div>
        );
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/20">
            <Header />

            <main className="flex-grow pt-32 pb-24 md:pt-48 md:pb-40">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Back Button */}
                    <button 
                        onClick={() => router.push('/blog')}
                        className="group inline-flex items-center space-x-3 text-muted hover:text-accent font-black uppercase tracking-widest text-[10px] mb-12 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Back to Insights</span>
                    </button>

                    {/* Header */}
                    <div className="space-y-8 mb-16">
                        <div className="flex items-center space-x-4">
                            <span className="px-4 py-2 bg-accent/5 border border-accent/10 text-accent rounded-xl text-[10px] font-black uppercase tracking-widest">
                                {post.category}
                            </span>
                            <div className="flex items-center space-x-4 text-muted text-[10px] font-black uppercase tracking-widest">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{post.date}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                            {post.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-secondary leading-relaxed font-normal">
                            {post.description}
                        </p>
                    </div>

                    {/* Featured Image */}
                    <div className="relative aspect-[21/10] rounded-[3rem] overflow-hidden border border-border mb-16 shadow-premium-xl">
                        <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                    </div>

                    {/* Content */}
                    <div className="prose prose-2xl prose-zinc max-w-none mb-24">
                        <p className="text-secondary-text text-xl leading-relaxed md:text-2xl mb-8">
                            Learning a new language is one of the most rewarding challenges you can undertake. However, the path to fluency is often blocked by psychological barriers and inefficient methods. In this article, we'll dive deep into strategies that actually work in the real world.
                        </p>
                        
                        <h3 className="text-3xl font-bold text-foreground mt-12 mb-6 uppercase tracking-tight">Break the Silence</h3>
                        <p className="text-secondary-text text-xl leading-relaxed mb-8">
                            The biggest mistake learners make is waiting until they are "ready" to speak. The truth is, you are never ready. Fluency is built through the very act of struggling to find the right words. When you talk to strangers on a platform like Norinly, you enter a "safe zone" where mistakes don't have real-world consequences.
                        </p>

                        <div className="my-16 p-10 bg-surface border-l-8 border-accent rounded-r-[2rem] italic">
                            <p className="text-2xl font-bold text-foreground leading-relaxed">
                                "Fluency isn't the absence of mistakes; it's the ability to communicate effectively despite them."
                            </p>
                        </div>

                        <h3 className="text-3xl font-bold text-foreground mt-12 mb-6 uppercase tracking-tight">Daily Consistency</h3>
                        <p className="text-secondary-text text-xl leading-relaxed mb-8">
                            15 minutes of daily conversation is infinitely more effective than a 3-hour study session once a week. Your brain needs regular activation of the language networks to build "muscle memory." Treat your speaking practice like a gym workout—it's about the repitition.
                        </p>

                        <ul className="space-y-6 my-12">
                            {[
                                'Use anonymous platforms to reduce anxiety',
                                'Focus on message clarity over grammatical perfection',
                                'Record your sessions and listen back (if possible)',
                                'Engage in debates to challenge your vocabulary'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start space-x-4">
                                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-accent" />
                                    </div>
                                    <span className="text-xl text-secondary-text font-bold leading-tight">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Share */}
                    <div className="flex flex-col md:flex-row items-center justify-between py-12 border-y border-border mb-24 gap-8">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-muted">Share this Insight</span>
                        <div className="flex items-center space-x-4">
                            {[
                                { icon: <Facebook className="w-5 h-5" />, label: 'Facebook' },
                                { icon: <Twitter className="w-5 h-5" />, label: 'Twitter' },
                                { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn' },
                                { icon: <Share2 className="w-5 h-5" />, label: 'Copy' }
                            ].map((s, i) => (
                                <button key={i} className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-secondary hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sticky CTA for mobile/desktop */}
                    <div className="bg-accent p-12 rounded-[3.5rem] shadow-2xl shadow-accent/20 text-center mb-24 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                         <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight italic">Ready to put this into practice?</h2>
                            <p className="text-white/80 text-lg md:text-xl font-normal">Connect with an English speaker right now and start your journey.</p>
                            <Link 
                                href="/connect"
                                className="inline-flex px-10 py-5 bg-white text-accent font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 transition-transform shadow-xl"
                            >
                                Start Chatting Free
                            </Link>
                         </div>
                    </div>

                    {/* Related Posts */}
                    <div>
                        <h2 className="text-3xl font-bold mb-12 uppercase tracking-tight">More Stories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map((p, i) => (
                                <Link key={i} href={`/blog/${p.slug}`} className="group block">
                                    <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                                        <div className="relative aspect-video overflow-hidden">
                                            <img src={p.image} alt={p.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="p-8 space-y-4">
                                            <h4 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-tight">{p.title}</h4>
                                            <p className="text-secondary text-xs line-clamp-2">{p.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

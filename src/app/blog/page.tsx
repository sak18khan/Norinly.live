'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts, BlogPost } from '@/data/blogPosts';
import Link from 'next/link';
import { Search, ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             post.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredPost = blogPosts[0];

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/20">
            <Header />

            <main className="flex-grow pt-32 pb-24 md:pt-48 md:pb-40">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16 md:mb-24 space-y-6">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-accent text-[10px] md:text-xs font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span>Norinly Insights</span>
                        </div>
                        <h1 className="text-4xl md:text-8xl font-black tracking-tight text-foreground leading-tight uppercase">
                            The Fluency <span className="bg-gradient-to-r from-accent to-secondary-accent bg-clip-text text-transparent italic">Journal</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
                            Tips, stories, and strategies to help you master English conversation.
                        </p>
                    </div>

                    {/* Featured Post */}
                    {!searchQuery && selectedCategory === 'All' && featuredPost && (
                        <div className="mb-24">
                            <Link href={`/blog/${featuredPost.slug}`} className="group relative block aspect-[21/9] rounded-[3.5rem] overflow-hidden border border-border shadow-2xl">
                                <img 
                                    src={featuredPost.image} 
                                    alt={featuredPost.title} 
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 md:p-16 space-y-6 max-w-3xl">
                                    <div className="flex items-center space-x-4">
                                        <span className="px-4 py-2 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Featured</span>
                                        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{featuredPost.category}</span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight group-hover:text-accent-hover transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-white/70 text-lg md:text-xl line-clamp-2 font-normal">
                                        {featuredPost.description}
                                    </p>
                                    <div className="flex items-center space-x-6 pt-4">
                                        <div className="flex items-center space-x-2 text-white/50 text-xs font-black uppercase tracking-widest">
                                            <Calendar className="w-4 h-4" />
                                            <span>{featuredPost.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-white/50 text-xs font-black uppercase tracking-widest">
                                            <Clock className="w-4 h-4" />
                                            <span>{featuredPost.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                        <div className="flex items-center p-1 bg-surface border border-border rounded-2xl overflow-x-auto max-w-full">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === category ? 'bg-white text-accent shadow-premium' : 'text-muted hover:text-foreground'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                            <input 
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all text-sm font-bold placeholder:font-black placeholder:uppercase placeholder:tracking-widest"
                            />
                        </div>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, i) => (
                            <Link key={i} href={`/blog/${post.slug}`} className="group block h-full">
                                <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                                    <div className="relative aspect-video overflow-hidden">
                                        <img 
                                            src={post.image} 
                                            alt={post.title}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-accent flex items-center space-x-2">
                                            <Tag className="w-3 h-3" />
                                            <span>{post.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4 flex-grow">
                                        <h4 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                                            {post.title}
                                        </h4>
                                        <p className="text-secondary text-sm leading-relaxed line-clamp-3">
                                            {post.description}
                                        </p>
                                    </div>
                                    <div className="px-8 pb-8 pt-4 flex items-center justify-between border-t border-border/50 mx-8">
                                        <div className="flex items-center space-x-2 text-[10px] font-black text-muted uppercase tracking-widest">
                                            <Calendar className="w-3 h-3" />
                                            <span>{post.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-[10px] font-black text-muted uppercase tracking-widest">
                                            <Clock className="w-3 h-3" />
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-24">
                            <p className="text-secondary text-xl font-bold">No articles found matching your criteria.</p>
                            <button 
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="mt-8 text-accent font-black uppercase tracking-widest hover:underline"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

'use client';

import Link from 'next/link';
import { Mic2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-premium-card border-t border-border pt-16 pb-16 mt-auto relative overflow-hidden rounded-t-[3rem] md:rounded-t-[4rem]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-32 bg-primary/5 blur-[120px] rounded-full -translate-y-16" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
          <div className="space-y-8 max-w-sm text-center lg:text-left">
            <Link href="/" className="flex items-center gap-3 group w-fit mx-auto lg:mx-0">
              <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-premium group-hover:scale-105 transition-all duration-300">
                <Mic2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-foreground tracking-tight italic uppercase">Norinly<span className="text-primary">.</span></span>
            </Link>
            <p className="text-muted-text font-bold leading-relaxed text-[11px] uppercase tracking-widest opacity-70">
              A platform to practice English by talking to real people worldwide in real-time. No pressure. No judgment.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 lg:gap-24">
            <div className="space-y-6">
              <h4 className="text-[9px] font-black text-muted-text uppercase tracking-widest opacity-40">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/connect" className="text-[10px] font-black text-foreground hover:text-primary transition-all flex items-center group uppercase tracking-widest">Speak</Link></li>
                <li><Link href="/connect?mode=debate" className="text-[10px] font-black text-foreground hover:text-primary transition-all flex items-center group uppercase tracking-widest">Debates</Link></li>
                <li><Link href="/blog" className="text-[10px] font-black text-foreground hover:text-primary transition-all flex items-center group uppercase tracking-widest">Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[9px] font-black text-muted-text uppercase tracking-widest opacity-40">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="/guidelines" className="text-[10px] font-black text-foreground hover:text-primary transition-all flex items-center group uppercase tracking-widest">Guidelines</Link></li>
                <li><Link href="/safety" className="text-[10px] font-black text-foreground hover:text-primary transition-all flex items-center group uppercase tracking-widest">Safety</Link></li>
                <li><Link href="/terms" className="text-[10px] font-black text-foreground hover:text-primary transition-all flex items-center group uppercase tracking-widest">Terms</Link></li>
              </ul>
            </div>
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-black text-muted-text uppercase tracking-[0.3em] opacity-40">Quick Links</h4>
              <ul className="grid grid-cols-1 gap-3">
                <li><Link href="/practice-english-speaking" className="text-[10px] font-black text-muted-text hover:text-foreground transition-colors uppercase tracking-[0.15em] leading-loose">Practice English Speaking</Link></li>
                <li><Link href="/talk-to-english-speakers" className="text-[10px] font-black text-muted-text hover:text-foreground transition-colors uppercase tracking-[0.15em] leading-loose">Talk to English Speakers</Link></li>
                <li><Link href="/free-english-speaking-practice" className="text-[10px] font-black text-muted-text hover:text-foreground transition-colors uppercase tracking-[0.15em] leading-loose">Free English Practice</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-border gap-8">
          <p className="text-[9px] font-black text-muted-text uppercase tracking-widest opacity-40">
            © {new Date().getFullYear()} Norinly. <span className="hidden sm:inline">All rights reserved.</span>
          </p>
          <div className="flex items-center gap-2 text-[9px] font-black text-muted-text uppercase tracking-widest group cursor-default opacity-40">
            Made with <Heart className="w-3 h-3 text-primary fill-primary group-hover:animate-pulse transition-all" /> locally for Learners
          </div>
        </div>
      </div>
    </footer>
  );
}


'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse-glow [animation-delay:2s]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-brand-gradient italic opacity-20">
            404
          </h1>
          <div className="space-y-2 -mt-12 md:-mt-24">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight">
              Page <span className="text-primary not-italic">Lost.</span>
            </h2>
            <p className="text-secondary-text text-sm md:text-lg font-bold uppercase tracking-widest opacity-70">
              The conversation you're looking for doesn't exist.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-8">
          <Link
            href="/"
            className="group flex items-center gap-6 px-10 py-5 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white transition-all shadow-premium active:scale-95"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white group-hover:text-primary flex items-center justify-center transition-all">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </div>
            <span className="font-black uppercase tracking-widest text-[11px] italic">Return Home</span>
          </Link>
          
          <Link
            href="/connect"
            className="px-10 py-5 rounded-2xl bg-surface border border-border text-foreground font-black uppercase text-[11px] tracking-widest hover:border-primary/30 transition-all hover:shadow-premium active:scale-95"
          >
            Start Speaking
          </Link>
        </div>
      </div>
      
      <div className="mt-24 text-[10px] font-black text-muted-text uppercase tracking-[0.5em] opacity-30">
        Norinly Global Network
      </div>
    </div>
  );
}

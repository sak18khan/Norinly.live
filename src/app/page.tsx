'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mic, Shield, Zap } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import HomeSections from '@/components/HomeSections';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIDashboard from '@/components/AIDashboard';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center pointer-events-auto bg-background selection:bg-accent/10 selection:text-foreground overflow-y-auto">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="flex flex-col w-full text-center z-10 relative">
        <div className="absolute inset-0 bg-white -z-10" />

        {/* Above-the-fold content for Mobile / Standard Hero for Desktop */}
        <div className="flex flex-col items-center min-h-[calc(100dvh-80px)] md:min-h-0 md:justify-center px-4 py-8 md:py-16 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="flex-[0.5] md:hidden" /> {/* Top Spacer for Mobile */}
          
          <div className="space-y-6 md:space-y-8 max-w-3xl w-full">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Practice Speaking English <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary-accent">With Real People</span>
            </h1>

            <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto font-normal px-2">
              Instant voice conversations to improve your fluency, confidence, and pronunciation.
            </p>
          </div>

          <div className="flex-[1.5] md:hidden" /> {/* Bottom Spacer for Mobile */}

          <div className="w-full pb-6 md:pb-0 md:pt-8 mt-auto md:mt-0 flex flex-col items-center">
            <button
              onClick={() => router.push('/connect')}
              className="group w-[90%] md:w-auto mx-auto relative inline-flex items-center justify-center px-10 py-4 md:px-12 md:py-5 font-bold text-white transition-all duration-300 bg-accent rounded-2xl md:rounded-3xl hover:bg-accent-hover focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 scale-100 hover:scale-[1.02] active:scale-95 text-xl cursor-pointer"
            >
              Start Practicing
            </button>
          </div>
        </div>

        {/* Trust Points (below the fold on mobile, right below hero on desktop) */}
        <div className="max-w-4xl mx-auto w-full px-4 pb-12 md:py-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-6 pt-12 md:pt-16 border-t border-border">
            <div className="flex flex-col items-center space-y-4 text-secondary">
              <div className="p-4 rounded-3xl bg-white border border-border shadow-sm">
                <Zap className="w-6 h-6 text-positive-accent" />
              </div>
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-muted">No signup required</span>
            </div>

            <div className="flex flex-col items-center space-y-4 text-secondary">
              <div className="p-4 rounded-3xl bg-white border border-border shadow-sm">
                <Mic className="w-6 h-6 text-accent" />
              </div>
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-muted">Anonymous voice chat</span>
            </div>

            <div className="flex flex-col items-center space-y-4 text-secondary">
              <div className="p-4 rounded-3xl bg-white border border-border shadow-sm">
                <Shield className="w-6 h-6 text-secondary-accent" />
              </div>
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-muted">Skip anytime</span>
            </div>
          </div>
        </div>
      </main>

      {/* AI Dashboard - Only visible for logged in users with stats */}
      <AIDashboard />

      {/* Additional Informational Sections */}
      <HomeSections />

      {/* Footer */}
      <Footer />
    </div>
  );
}

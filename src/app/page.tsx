'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mic, Shield, Zap, Users } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import HomeSections from '@/components/HomeSections';

export default function Home() {
  const router = useRouter();
  const { liveUsers } = useChatContext();

  return (
    <div className="min-h-screen flex flex-col items-center pointer-events-auto bg-background selection:bg-accent/30 selection:text-white overflow-y-auto">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto p-6 flex justify-between items-center z-20">
        <div className="text-2xl font-black tracking-tighter cursor-pointer select-none text-white">
          NORINLY<span className="text-accent">.</span>
        </div>

        {/* Live Users Counter */}
        <div className="flex items-center space-x-2 bg-surface/50 border border-border px-4 py-2 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <Users className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-200">
            {liveUsers.toLocaleString()} online now
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-80px)] px-4 text-center z-10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-background to-background -z-10" />

        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Talk to strangers <br /> <span className="text-accent">instantly</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
            Anonymous voice conversations with people around the world. No setup required.
          </p>

          <div className="pt-8 pb-12">
            <button
              onClick={() => router.push('/connect')}
              className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-accent rounded-full hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-background shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)] scale-100 hover:scale-105 active:scale-95 text-xl cursor-pointer"
            >
              Start Talking
            </button>
          </div>

          {/* Trust Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-border">
            <div className="flex flex-col items-center space-y-3 text-zinc-400">
              <div className="p-3 rounded-2xl bg-surface border border-border">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <span className="font-medium text-sm uppercase tracking-wider">No signup required</span>
            </div>

            <div className="flex flex-col items-center space-y-3 text-zinc-400">
              <div className="p-3 rounded-2xl bg-surface border border-border">
                <Mic className="w-6 h-6 text-accent" />
              </div>
              <span className="font-medium text-sm uppercase tracking-wider">Anonymous voice chat</span>
            </div>

            <div className="flex flex-col items-center space-y-3 text-zinc-400">
              <div className="p-3 rounded-2xl bg-surface border border-border">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <span className="font-medium text-sm uppercase tracking-wider">Skip anytime</span>
            </div>
          </div>
        </div>
      </main>

      {/* Additional Informational Sections */}
      <HomeSections />

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto p-6 text-center text-sm text-zinc-600 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 relative z-10 border-t border-border">
        <p>© {new Date().getFullYear()} Norinly. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-zinc-300 transition-colors">Community Guidelines</Link>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { Mic, Shield, Zap, Globe, MessageSquare, Sparkles, Users, ChevronRight, Brain, Coffee, ArrowRight, Clock } from 'lucide-react';
import HomeSections from '@/components/HomeSections';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveActivityWidget from '@/components/LiveActivityWidget';
import DailyChallengeWidget from '@/components/DailyChallengeWidget';
import { getLeaderboard } from '@/lib/gamification';
import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [topSpeakers, setTopSpeakers] = useState<any[]>([]);

  useEffect(() => {
    getLeaderboard('weekly', 3).then(setTopSpeakers);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-background selection:bg-accent/10 selection:text-accent overflow-y-auto bg-mesh animate-background-shift relative text-foreground">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-pulse-glow [animation-delay:2s]" />
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section - The "First Look" */}
      <main className="flex flex-col w-full z-10 relative">
        <div className="flex flex-col items-center justify-center px-6 pt-28 md:pt-48 pb-16 max-w-7xl mx-auto w-full text-center space-y-10 md:space-y-16 animate-fade-in-up min-h-[90vh] md:min-h-screen relative">
          
          <div className="space-y-6 md:space-y-10 max-w-5xl w-full">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-surface dark:bg-slate-800 border border-black/5 dark:border-white/5 text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-2 shadow-premium backdrop-blur-md transition-soft hover:border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-positive-accent shadow-[0_0_10px_rgba(16,185,129,0.3)]"></span>
              </span>
              1,248 People Practicing Live
            </div>
            
            <h1 className="text-[3.25rem] md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-[0.85] mb-4 drop-shadow-sm italic">
              Speak English <br className="hidden md:block" /> 
              <span className="text-brand-gradient not-italic">With Confidence.</span>
            </h1>

            <div className="space-y-3">
              <p className="text-sm md:text-3xl text-foreground max-w-3xl mx-auto font-black px-4 leading-tight tracking-tight uppercase opacity-90">
                Real people. Real conversations.
              </p>
              <p className="text-[11px] md:text-2xl text-secondary-text max-w-3xl mx-auto font-black px-4 leading-tight tracking-tight uppercase opacity-80">
                No pressure. Just fluency.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-8 w-full md:w-auto">
                <button
                  onClick={() => router.push('/connect')}
                  className="group w-full md:w-auto px-10 py-5 md:px-16 md:py-9 font-black text-background transition-all duration-500 bg-foreground hover:bg-primary hover:text-white shadow-premium-xl hover:shadow-glow-accent scale-100 hover:scale-[1.03] active:scale-95 text-xl md:text-3xl rounded-3xl md:rounded-[2.5rem] cursor-pointer flex items-center justify-center gap-4 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <Mic className="w-8 h-8 md:w-11 md:h-11 relative z-10" />
                  <span className="relative z-10 leading-none uppercase tracking-tighter">Start Speaking Now</span>
                </button>
                <div className="flex flex-col items-center space-y-3 mt-2">
                  <span className="text-[9px] md:text-[11px] font-black text-muted-text uppercase tracking-[0.4em] leading-none opacity-60">Connecting you in seconds</span>
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="h-px w-8 md:w-16 bg-border" />
                    <span className="text-[9px] md:text-[11px] font-black text-accent uppercase tracking-widest leading-none">100% Human • Private & Secure</span>
                    <div className="h-px w-8 md:w-16 bg-border" />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </main>

      {/* Home Content Sections - Below the fold */}
      <div className="flex flex-col items-center px-6 py-20 max-w-7xl mx-auto w-full space-y-24 relative z-10 overflow-x-hidden pt-12">
        {/* Daily Challenge Widget */}
        <div className="w-full max-w-xs md:max-w-md animate-fade-in-up [animation-delay:200ms]">
          <DailyChallengeWidget />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl animate-fade-in-up [animation-delay:400ms]">
          {/* Public Rooms Card */}
          <div 
            onClick={() => router.push('/speak-rooms')}
            className="group relative bg-premium-card rounded-3xl p-10 cursor-pointer hover:shadow-premium-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 -mr-24 -mt-24 bg-primary/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left h-full">
              <div className="w-32 h-32 rounded-3xl bg-surface dark:bg-slate-800 border border-border flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-110 transition-transform duration-500 shadow-premium-xl mb-10">
                <img src="/images/public_rooms.png" alt="Public Rooms" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 animate-float" />
              </div>
              <div className="flex-1 flex flex-col justify-between w-full">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <Users className="w-3.5 h-3.5" /> Group Hubs
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase italic leading-tight">
                        Group <span className="text-brand-gradient not-italic">Rooms</span>
                      </h3>
                      <p className="text-secondary text-xs md:text-sm font-bold leading-relaxed max-w-xs mx-auto md:mx-0 opacity-80">
                        Join live themed discussions with learners worldwide and practice naturally.
                      </p>
                    </div>
                  </div>
                  <div className="pt-8 mt-auto w-full flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                      Join Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
              </div>
            </div>
          </div>

          {/* Roleplay Card */}
          <div 
            onClick={() => router.push('/roleplay')}
            className="group relative bg-premium-card rounded-3xl p-10 cursor-pointer hover:shadow-premium-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
              <div className="absolute bottom-0 right-0 w-64 h-64 -mr-24 -mb-24 bg-secondary/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left h-full">
              <div className="w-32 h-32 rounded-3xl bg-surface dark:bg-slate-800 border border-border flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-110 transition-transform duration-500 shadow-premium-xl mb-10">
                <img src="/images/roleplay.png" alt="Roleplay" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 animate-float" />
              </div>
              <div className="flex-1 flex flex-col justify-between w-full">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-secondary/5 text-secondary text-[9px] font-black uppercase tracking-widest group-hover:bg-secondary group-hover:text-white transition-colors duration-500">
                      <Sparkles className="w-3.5 h-3.5" /> Real World
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase italic leading-tight">
                        Daily <span className="text-secondary not-italic">Roleplay</span>
                      </h3>
                      <p className="text-secondary text-xs md:text-sm font-bold leading-relaxed max-w-xs mx-auto md:mx-0 opacity-80">
                        Practice interviews, travel conversations, and real-world situations with peers.
                      </p>
                    </div>
                  </div>
                  <div className="pt-8 mt-auto w-full flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary group-hover:gap-4 transition-all">
                      Try Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="w-full mt-12 pt-12 border-t border-black/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent" />
          <div className="flex flex-col items-center gap-12">
            <div className="space-y-4 text-center animate-fade-in-up">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.6em] opacity-60 mb-2">Global Operational Integrity</h3>
              <div className="h-0.5 w-12 bg-accent/20 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-6xl">
              <div className="group relative p-8 rounded-3xl bg-premium-card hover:bg-surface dark:hover:bg-slate-800/50 transition-all duration-500 hover:shadow-premium-xl animate-fade-in-up [animation-delay:100ms] overflow-hidden">
                <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-surface dark:bg-slate-800 border border-border flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform duration-500">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-secondary-text uppercase tracking-widest leading-none">The Network</p>
                    <h4 className="text-xl font-black text-foreground tracking-tight uppercase italic">Global Grid</h4>
                    <p className="text-secondary-text text-[11px] font-medium leading-relaxed opacity-80">Low-latency connectivity across 50+ nations.</p>
                  </div>
                </div>
              </div>
              <div className="group relative p-8 rounded-3xl bg-premium-card hover:bg-surface dark:hover:bg-slate-800/50 transition-all duration-500 hover:shadow-premium-xl animate-fade-in-up [animation-delay:200ms] overflow-hidden">
                <div className="absolute inset-0 bg-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-surface dark:bg-slate-800 border border-border flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform duration-500">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-secondary-text uppercase tracking-widest leading-none">Security</p>
                    <h4 className="text-xl font-black text-foreground tracking-tight uppercase italic">Secure P2P</h4>
                    <p className="text-secondary-text text-[11px] font-medium leading-relaxed opacity-80">End-to-end encryption for private conversations.</p>
                  </div>
                </div>
              </div>
              <div className="group relative p-8 rounded-3xl bg-premium-card hover:bg-surface dark:hover:bg-slate-800/50 transition-all duration-500 hover:shadow-premium-xl animate-fade-in-up [animation-delay:300ms] overflow-hidden">
                <div className="absolute inset-0 bg-positive-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-surface dark:bg-slate-800 border border-border flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-6 h-6 text-positive-accent" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-secondary-text uppercase tracking-widest leading-none">Performance</p>
                    <h4 className="text-xl font-black text-foreground tracking-tight uppercase italic">Anti-Bot</h4>
                    <p className="text-secondary-text text-[11px] font-medium leading-relaxed opacity-80">Advanced AI filtering for authentic interaction.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SpeakRooms Section */}
      <section className="w-full py-16 md:py-24 bg-surface border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-16 mb-20 animate-fade-in-up">
            <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest shadow-glow-accent backdrop-blur-md">
                  Join Live Now
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-foreground italic uppercase">
                  Community <br /> <span className="text-brand-gradient not-italic">Group Rooms.</span>
                </h2>
                <p className="text-secondary-text text-base md:text-xl font-bold max-w-2xl opacity-80 uppercase tracking-tight">
                  Pick a topic and start speaking instantly with people around the world.
                </p>
                <button 
                  onClick={() => router.push('/speak-rooms')}
                  className="flex items-center gap-6 group px-8 py-4 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white transition-all w-fit active:scale-95 shadow-premium overflow-hidden"
                >
                  <span className="z-10 font-black uppercase tracking-widest text-[9px] italic">Explore Rooms</span>
                  <div className="z-10 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all">
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
            </div>
            
            <div className="hidden lg:block relative group">
               <div className="absolute -inset-4 bg-accent/10 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="w-80 h-80 bg-surface dark:bg-slate-900 rounded-[4rem] p-12 border border-border shadow-premium rotate-3 group-hover:rotate-0 transition-all duration-700 overflow-hidden relative z-10">
                  <img src="/images/live_rooms.png" alt="Live Rooms" className="w-full h-full object-contain drop-shadow-xl" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { id: '1', title: 'Daily Life & Routines', category: 'Daily', difficulty: 'Beginner', desc: 'Talk about your day, hobbies, and simple routines with others.', icon: <Coffee className="w-6 h-6" />, count: '3/4', color: 'primary' },
              { id: '2', title: 'AI: Friend or Foe?', category: 'Debate', difficulty: 'Advanced', desc: 'Dive deep into the impact of AI on our future and society.', icon: <Brain className="w-6 h-6" />, count: '2/4', color: 'secondary' },
              { id: '3', title: 'Travel Adventures', category: 'Daily', difficulty: 'Intermediate', desc: 'Share your travel stories and dream destinations.', icon: <Globe className="w-6 h-6" />, count: '4/4', color: 'positive-accent' },
            ].map((topic, idx) => (
              <div 
                key={topic.id}
                onClick={() => router.push('/speak-rooms')}
                style={{ animationDelay: `${idx * 150}ms` }}
                className="group bg-premium-card p-8 rounded-3xl cursor-pointer hover:shadow-premium-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative animate-fade-in-up h-full flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-primary/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div>
                  <div className="mb-6 w-12 h-12 bg-surface dark:bg-slate-800 border border-border rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-premium">
                    <span className="transition-transform duration-500 group-hover:scale-110">{topic.icon}</span>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                        {topic.category}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                        topic.difficulty === 'Beginner' ? 'text-positive-accent border-positive-accent/20 bg-positive-accent/5' :
                        topic.difficulty === 'Intermediate' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' :
                        'text-secondary border-secondary/20 bg-secondary/5'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight uppercase italic mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-secondary-text text-[11px] leading-relaxed opacity-70">
                        {topic.desc}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="w-8 h-8 rounded-lg bg-surface dark:bg-slate-800 border-2 border-surface dark:border-slate-800 shadow-premium overflow-hidden group-hover:scale-105 transition-transform" style={{ transitionDelay: `${j * 50}ms` }}>
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${topic.id}${j}`} alt="" className="group-hover:rotate-3 transition-all duration-500" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-secondary-text uppercase tracking-widest opacity-60">{topic.count} ACTIVE</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-secondary-text group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Leaders Section */}
      <section className="w-full py-32 bg-surface/50 dark:bg-slate-900/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-20" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
             <div className="lg:w-[50%] space-y-10 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center gap-10 text-center sm:text-left">
                    <div className="w-40 h-40 md:w-56 md:h-56 bg-surface dark:bg-slate-800 rounded-[3rem] p-8 md:p-12 shrink-0 border border-black/5 dark:border-white/10 shadow-premium group overflow-hidden relative">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img src="/images/leaderboard.png" alt="Leaderboard" className="w-full h-full object-contain relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" />
                    </div>
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-accent text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <Trophy className="w-3.5 h-3.5" /> Weekly Top Speakers
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none italic uppercase">
                            Top Speakers <br /><span className="text-accent underline decoration-accent/10 underline-offset-8 not-italic">This Week.</span>
                        </h2>
                        <p className="text-zinc-600 text-lg md:text-2xl font-black uppercase tracking-tight leading-tight">
                            See the most active learners <br className="hidden md:block" /> and stay motivated.
                        </p>
                    </div>
                </div>
                <div className="pt-4 flex justify-center sm:justify-start">
                    <button 
                        onClick={() => router.push('/leaderboard')}
                        className="flex items-center gap-6 group px-10 py-5 rounded-2xl bg-foreground text-white hover:bg-primary transition-all w-fit shadow-premium active:scale-95"
                    >
                        <span className="font-black uppercase tracking-widest text-[10px] italic">View Rankings</span>
                        <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white group-hover:text-primary flex items-center justify-center transition-all">
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </div>
                    </button>
                </div>
             </div>

             <div className="lg:w-[50%] w-full">
                {topSpeakers.length > 0 ? (
                    <div className="flex flex-col gap-6 w-full">
                        {topSpeakers.map((speaker, idx) => (
                                <div 
                                    key={speaker.id}
                                    onClick={() => router.push('/leaderboard')}
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                    className={`group flex items-center gap-6 p-6 md:p-8 rounded-3xl bg-premium-card hover:bg-surface dark:hover:bg-slate-800/50 transition-all duration-700 cursor-pointer animate-fade-in-up shadow-premium hover:shadow-premium-xl w-full relative overflow-hidden`}
                                >
                                <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative shrink-0">
                                    <img 
                                        src={speaker.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${speaker.username}`} 
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-surface dark:border-slate-800 shadow-premium relative z-10 object-cover"
                                        alt=""
                                    />
                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-xl border-2 border-white flex items-center justify-center font-black text-xs md:text-sm shadow-premium z-20 ${
                                        idx === 0 ? 'bg-amber-400 text-white' : 
                                        idx === 1 ? 'bg-slate-400 text-white' : 
                                        'bg-orange-400 text-white'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 relative z-10">
                                    <p className="text-2xl font-black text-foreground truncate tracking-tighter uppercase italic">{speaker.username || 'Learner'}</p>
                                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-lg bg-primary/5 border border-primary/10">
                                        <Zap className="w-3 h-3 text-primary fill-primary" />
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{speaker.weeklyXp || 0} XP</p>
                                    </div>
                                </div>
                                <div className={`hidden sm:block px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0 transition-all z-10 ${
                                    idx === 0 ? 'bg-amber-100 text-amber-700' : 
                                    idx === 1 ? 'bg-slate-100 text-slate-600' : 
                                    'bg-orange-100 text-orange-700'
                                }`}>
                                    {idx === 0 ? 'Champion' : idx === 1 ? 'Elite' : 'Top'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-surface dark:bg-slate-900/50 p-12 md:p-20 rounded-[5rem] border border-black/5 dark:border-white/5 text-center w-full shadow-premium animate-fade-in-up group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-24 h-24 bg-accent/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-accent/10 animate-float shadow-premium relative z-10">
                            <Clock className="w-12 h-12 text-accent" />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tighter uppercase italic relative z-10">New Week Starting Soon</h3>
                        <p className="text-zinc-400 font-bold text-sm mb-12 max-w-md mx-auto relative z-10 leading-relaxed uppercase tracking-tight opacity-60">The leaderboard resets every Monday at 00:00 UTC. Join a room now to be the first on the list!</p>
                        <button 
                            onClick={() => router.push('/connect')}
                            className="px-14 py-6 bg-foreground text-background font-black rounded-[2.5rem] shadow-premium hover:shadow-glow-accent transition-all hover:scale-105 active:scale-95 text-[11px] uppercase tracking-[0.4em] relative z-10 italic"
                        >
                            Start Practicing Now
                        </button>
                    </div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* Additional Informational Sections */}
      <HomeSections />

      {/* Footer */}
      <Footer />

      {/* Live Activity Widget */}
      <LiveActivityWidget />
    </div>
  );
}

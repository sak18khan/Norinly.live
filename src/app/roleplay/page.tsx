'use client';

import { useRouter } from 'next/navigation';
import { useChatContext } from '@/context/ChatContext';
import { SCENARIOS } from '@/scenarios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, ArrowRight, Info, ChevronRight } from 'lucide-react';

export default function RoleplaySelectionPage() {
    const router = useRouter();
    const { requestMicrophoneAndJoin, status } = useChatContext();

    const handleStartRoleplay = async (scenarioId: string) => {
        // We use the scenarioId as the third argument to requestMicrophoneAndJoin
        // The context will handle setting the mode to 'roleplay' and the scenario
        router.push(`/connect?mode=roleplay&scenario=${scenarioId}&source=roleplay`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/10 selection:text-foreground overflow-y-auto bg-mesh animate-background-shift relative">
            <Header />

            <main className="flex-1 flex flex-col items-center px-6 py-20 md:py-32 max-w-7xl mx-auto w-full relative z-10">
                <div className="text-center space-y-6 mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" /> 1v1 Guided Practice
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-tight">
                        Practice Real <br />
                        <span className="text-accent underline decoration-accent/10 underline-offset-8">Conversations</span>
                    </h1>
                    <p className="text-secondary text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Choose a scenario and get matched with a real person. 
                        We'll provide roles and prompts to help you practice your English naturally.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-fade-in-up [animation-delay:200ms]">
                    {SCENARIOS.map((scenario) => (
                        <div 
                            key={scenario.id}
                            className="group bg-white border border-border p-8 rounded-[2.5rem] flex flex-col hover:border-accent/40 hover:shadow-premium transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="mb-8 w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm text-3xl">
                                {scenario.icon}
                            </div>
                            
                            <div className="space-y-3 mb-8 flex-1">
                                <h3 className="text-2xl font-black text-foreground group-hover:text-accent transition-colors leading-tight">
                                    {scenario.title}
                                </h3>
                                <p className="text-secondary text-sm font-medium leading-relaxed">
                                    {scenario.description}
                                </p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Roles</span>
                                        <span className="text-xs font-bold text-foreground">
                                            {scenario.roles.A} vs {scenario.roles.B}
                                        </span>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleStartRoleplay(scenario.id)}
                                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-accent transition-all group/btn"
                                >
                                    Start Roleplay
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Decorative Background Element */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors" />
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-8 rounded-[3rem] bg-accent/5 border border-accent/10 max-w-3xl w-full text-center space-y-4 animate-fade-in-up [animation-delay:400ms]">
                    <h4 className="text-lg font-black text-foreground uppercase tracking-tight">How it works?</h4>
                    <p className="text-secondary text-sm font-medium leading-relaxed">
                        Wait for a partner to join the same scenario. Once matched, you'll be assigned a role and given specific talking points to guide your conversation. Each session lasts 3-5 minutes.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}

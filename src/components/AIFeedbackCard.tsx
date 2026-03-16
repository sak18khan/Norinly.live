'use client';

import { Trophy, CheckCircle, AlertCircle, TrendingUp, ArrowRight, RefreshCcw } from 'lucide-react';

interface FeedbackSession {
    fluency: number;
    grammar: number;
    vocabulary: number;
    confidence: number;
    suggestions: string[];
}

interface AIFeedbackCardProps {
    feedback: FeedbackSession;
    onRestart: () => void;
    onTryReal: () => void;
}

export default function AIFeedbackCard({ feedback, onRestart, onTryReal }: AIFeedbackCardProps) {
    const getLevel = (score: number) => {
        if (score >= 8.5) return 'Advanced';
        if (score >= 6.5) return 'Intermediate';
        return 'Beginner';
    };

    const metrics = [
        { label: 'Fluency', score: feedback.fluency, icon: <TrendingUp className="w-5 h-5 text-blue-400" /> },
        { label: 'Grammar', score: feedback.grammar, icon: <CheckCircle className="w-5 h-5 text-green-400" /> },
        { label: 'Vocabulary', score: feedback.vocabulary, icon: <Trophy className="w-5 h-5 text-yellow-400" /> },
        { label: 'Confidence', score: feedback.confidence, icon: <Zap className="w-5 h-5 text-purple-400" /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white border border-border rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl relative animate-in zoom-in-95 duration-500 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] -z-10" />

                <div className="text-center mb-10">
                    <div className="inline-flex p-5 rounded-[2rem] bg-accent/5 mb-6">
                        <Trophy className="w-12 h-12 text-accent" />
                    </div>
                    <h2 className="text-4xl font-bold text-foreground">Session Feedback</h2>
                    <p className="text-secondary text-lg mt-3">Amazing job! Here's a breakdown of your performance.</p>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-10">
                    {metrics.map((m) => (
                        <div key={m.label} className="bg-surface border border-border p-6 rounded-3xl flex flex-col items-center text-center group hover:border-accent/30 transition-colors">
                            <div className="mb-3 transition-transform group-hover:scale-110">{m.icon}</div>
                            <span className="text-muted text-[10px] uppercase tracking-widest font-bold mb-2">{m.label}</span>
                            <span className="text-4xl font-bold text-foreground">{m.score.toFixed(1)}</span>
                            <span className="text-accent text-xs font-bold mt-2 uppercase tracking-wide">{getLevel(m.score)}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-accent/5 border border-accent/10 rounded-3xl p-8 mb-10">
                    <h3 className="text-foreground text-xl font-bold mb-6 flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-accent" />
                        Suggestions for Improvement
                    </h3>
                    <ul className="space-y-4">
                        {feedback.suggestions.map((s, i) => (
                            <li key={i} className="flex items-start gap-4 text-secondary text-base leading-relaxed">
                                <CheckCircle className="w-5 h-5 text-positive-accent mt-0.5 shrink-0" />
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <button
                        onClick={onRestart}
                        className="flex items-center justify-center gap-3 py-4.5 px-6 bg-white border border-border text-foreground font-bold rounded-2xl hover:bg-surface transition-all active:scale-[0.98] shadow-sm"
                    >
                        <RefreshCcw className="w-5 h-5 text-muted" />
                        Practice Again
                    </button>
                    <button
                        onClick={onTryReal}
                        className="flex items-center justify-center gap-3 py-4.5 px-6 bg-accent text-white font-bold rounded-2xl hover:bg-accent-hover shadow-lg shadow-accent/20 transition-all active:scale-[0.98]"
                    >
                        Join Group Chat
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

import { Zap } from 'lucide-react';

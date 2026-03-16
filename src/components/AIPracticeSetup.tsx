'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Trophy, MessageSquare, Briefcase, Zap, Globe, GraduationCap, Plane, Cpu } from 'lucide-react';

interface AIPracticeSetupProps {
    onCancel: () => void;
}

const GOALS = [
    { id: 'casual', title: 'Casual Conversation', icon: <MessageSquare className="w-5 h-5" />, desc: 'Friendly chat about hobbies and daily life' },
    { id: 'interview', title: 'Job Interview Practice', icon: <Briefcase className="w-5 h-5" />, desc: 'Professional interview simulation' },
    { id: 'business', title: 'Business English', icon: <Globe className="w-5 h-5" />, desc: 'Workplace scenarios and terminology' },
    { id: 'debate', title: 'Debate Practice', icon: <Zap className="w-5 h-5" />, desc: 'Express opinions on controversial topics' },
    { id: 'pronunciation', title: 'Pronunciation Practice', icon: <Target className="w-5 h-5" />, desc: 'Focus on clarity and accent' },
    { id: 'travel', title: 'Travel English', icon: <Plane className="w-5 h-5" />, desc: 'Airport, hotel, and restaurant Roleplay' },
];

const DIFFICULTIES = [
    { id: 'beginner', title: 'Beginner', level: 1 },
    { id: 'intermediate', title: 'Intermediate', level: 2 },
    { id: 'advanced', title: 'Advanced', level: 3 },
];

const TOPICS = [
    { id: 'tech', title: 'Technology', icon: <Cpu className="w-4 h-4" /> },
    { id: 'travel', title: 'Travel', icon: <Plane className="w-4 h-4" /> },
    { id: 'culture', title: 'Culture', icon: <Globe className="w-4 h-4" /> },
    { id: 'work', title: 'Work', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'education', title: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
];

export default function AIPracticeSetup({ onCancel }: AIPracticeSetupProps) {
    const router = useRouter();
    const [goal, setGoal] = useState('casual');
    const [difficulty, setDifficulty] = useState('intermediate');
    const [selectedTopic, setSelectedTopic] = useState('tech');

    const handleStart = () => {
        const params = new URLSearchParams({
            goal,
            difficulty,
            topic: selectedTopic
        });
        router.push(`/ai-practice?${params.toString()}`);
    };

    return (
        <div className="bg-white border border-border rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-4xl font-bold text-foreground mb-3">Create Your AI Practice Session</h2>
            <p className="text-secondary text-lg mb-10">
                Customize your AI partner to match your learning needs.
            </p>

            <div className="space-y-8">
                {/* Goal Selection */}
                <section>
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-xl">
                            <Target className="w-5 h-5 text-accent" />
                        </div>
                        Practice Goal
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {GOALS.map((g) => (
                            <button
                                key={g.id}
                                onClick={() => setGoal(g.id)}
                                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left group ${
                                    goal === g.id
                                        ? 'bg-[#F0F9FF] border-accent shadow-sm'
                                        : 'bg-white border-border hover:border-accent/40 hover:shadow-sm'
                                }`}
                            >
                                <div className={`p-3 rounded-xl transition-colors ${goal === g.id ? 'bg-accent text-white' : 'bg-white border border-border text-muted group-hover:text-accent'}`}>
                                    {g.icon}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-lg ${goal === g.id ? 'text-foreground' : 'text-secondary'}`}>{g.title}</h4>
                                    <p className="text-muted text-sm font-medium mt-1 leading-relaxed">{g.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Difficulty Selection */}
                    <section>
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-accent" />
                            Difficulty
                        </h3>
                        <div className="flex flex-col gap-2">
                            {DIFFICULTIES.map((d) => (
                                <button
                                    key={d.id}
                                    onClick={() => setDifficulty(d.id)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                        difficulty === d.id
                                            ? 'bg-[#F0F9FF] border-accent text-foreground'
                                            : 'bg-white border-border text-secondary hover:border-accent/40 hover:shadow-sm'
                                    }`}
                                >
                                    <span className="font-bold">{d.title}</span>
                                    <div className="flex gap-1">
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2.5 h-2.5 rounded-full ${
                                                    i < d.level 
                                                        ? (difficulty === d.id ? 'bg-accent' : 'bg-muted') 
                                                        : 'bg-border'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Topic Selection */}
                    <section>
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-accent" />
                            Topic
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {TOPICS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTopic(t.id)}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all font-bold text-sm ${
                                        selectedTopic === t.id
                                            ? 'bg-accent text-white border-accent shadow-md shadow-accent/20'
                                            : 'bg-white border-border text-secondary hover:border-accent/40 hover:shadow-sm'
                                    }`}
                                >
                                    {t.icon}
                                    <span className="font-medium">{t.title}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <button
                        onClick={handleStart}
                        className="w-full py-5 bg-accent hover:bg-accent-hover text-white font-bold text-xl rounded-2xl transition-all h-[70px] flex items-center justify-center shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Start AI Session
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-2 text-muted hover:text-secondary text-sm font-medium transition-colors"
                    >
                        Back to casual practice
                    </button>
                </div>
            </div>
        </div>
    );
}

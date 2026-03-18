'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Meh, X, Sparkles, ArrowRight } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (feedback: 'good' | 'okay' | 'bad') => void;
    sessionDuration?: number; // in seconds
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, sessionDuration = 0 }: FeedbackModalProps) {
    const [selected, setSelected] = useState<'good' | 'okay' | 'bad' | null>(null);
    const { saveRating } = useChatContext();

    if (!isOpen) return null;

    const handleSelect = (feedback: 'good' | 'okay' | 'bad') => {
        setSelected(feedback);
        saveRating(feedback);
        setTimeout(() => {
            onSubmit(feedback);
            onClose();
            setSelected(null);
        }, 800);
    };

    const minutes = Math.floor(sessionDuration / 60);

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-500 overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-50 rounded-xl"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-7 md:space-y-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-accent text-[9px] font-black uppercase tracking-widest">
                            Great job practicing!
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">How was it?</h3>
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest opacity-80">
                                You just practiced English with a real person
                            </p>
                        </div>
                    </div>

                    {/* Session Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] text-left transition-all hover:border-accent/20">
                            <div className="text-2xl font-black text-accent mb-0.5">{minutes === 0 ? '< 1' : minutes}m</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Minutes Spoken</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] text-left transition-all hover:border-accent/20">
                            <div className="text-2xl font-black text-emerald-500 mb-0.5">+{Math.ceil(minutes / 2) || 1}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Practice Score</div>
                        </div>
                    </div>

                    {/* Learning Tip */}
                    <div className="bg-orange-50 border border-orange-100 p-5 rounded-[1.5rem] text-left flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                            <Sparkles className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Quick Tip</div>
                            <p className="text-xs font-bold text-orange-900 leading-relaxed">
                                Try speaking in longer sentences next time to improve faster!
                            </p>
                        </div>
                    </div>

                    <div className="py-1">
                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider bg-slate-50 inline-block px-4 py-1.5 rounded-full border border-slate-100/50">
                            Every conversation makes you better 🎉
                        </p>
                    </div>

                    {/* Ratings */}
                    <div className="flex justify-between items-center gap-4">
                        <FeedbackOption
                            icon={<ThumbsDown className="w-7 h-7" />}
                            label="Hard"
                            color="text-red-500"
                            bgColor="bg-red-50"
                            isSelected={selected === 'bad'}
                            onClick={() => setSelected('bad')}
                        />
                        <FeedbackOption
                            icon={<Meh className="w-7 h-7" />}
                            label="Okay"
                            color="text-orange-500"
                            bgColor="bg-orange-50"
                            isSelected={selected === 'okay'}
                            onClick={() => setSelected('okay')}
                        />
                        <FeedbackOption
                            icon={<ThumbsUp className="w-7 h-7" />}
                            label="Great"
                            color="text-emerald-500"
                            bgColor="bg-emerald-50"
                            isSelected={selected === 'good'}
                            onClick={() => setSelected('good')}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-white text-slate-500 font-bold rounded-[1.5rem] hover:bg-slate-50 transition-all border border-slate-200 text-sm active:scale-95 shadow-sm"
                        >
                            Take a Break
                        </button>
                        <button
                            onClick={() => {
                                if (selected) onSubmit(selected);
                                else onSubmit('okay');
                                onClose();
                            }}
                            className="flex-[1.5] py-4 bg-slate-900 text-white font-black rounded-[1.5rem] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 text-sm shadow-xl shadow-slate-200 uppercase tracking-widest active:scale-[0.98]"
                        >
                            Next Person
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface FeedbackOptionProps {
    icon: React.ReactNode;
    label: string;
    color: string;
    bgColor: string;
    isSelected: boolean;
    onClick: () => void;
}

function FeedbackOption({ icon, label, color, bgColor, isSelected, onClick }: FeedbackOptionProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-2 transition-all duration-300 group ${isSelected ? 'scale-105' : 'hover:scale-105 active:scale-95'}`}
        >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center transition-all ${isSelected ? `${bgColor} ${color} ring-2 ring-current` : `bg-slate-50 text-slate-300 group-hover:${bgColor} group-hover:${color}`}`}>
                {icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? color : 'text-slate-400 group-hover:text-slate-600'}`}>
                {label}
            </span>
        </button>
    );
}

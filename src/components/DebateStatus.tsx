import React from 'react';
import { Timer, Mic, MicOff, Trophy, Scale, X, Check, ArrowRight } from 'lucide-react';
import { DebateData } from '@/context/ChatContext';

interface DebateStatusProps {
    data: DebateData;
    onExit: () => void;
    onVote: (winnerId: string | null) => void;
    partnerId: string | null;
}

const DebateStatus: React.FC<DebateStatusProps> = ({ data, onExit, onVote, partnerId }) => {
    if (data.status === 'idle') return null;

    const getRoundTitle = (round: number) => {
        switch (round) {
            case 1: return 'Round 1 — Opening Argument';
            case 2: return 'Round 2 — Counter Argument';
            case 3: return 'Round 3 — Closing Statement';
            default: return `Round ${round}`;
        }
    };

    const isVoting = data.status === 'voting';
    const isFinished = data.status === 'finished';

    return (
        <div className={`w-full border-b p-5 animate-in slide-in-from-top-4 duration-500 z-30 transition-all duration-300 ${data.status === 'active' ? 'bg-orange-50/50 border-orange-200 shadow-sm' : 'bg-white border-border shadow-sm'}`}>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${data.status === 'active' ? 'bg-orange-500 text-white' : 'bg-accent/10 text-accent'}`}>
                            Debate Mode
                        </div>
                        {data.topic && (
                            <span className="text-base font-bold text-foreground truncate max-w-[200px] md:max-w-md">
                                {data.topic}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onExit}
                        className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-muted"
                        title="Exit Debate"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {!isVoting && !isFinished && (
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Current Round</span>
                            <span className={`text-sm font-black uppercase tracking-tight transition-colors duration-300 ${data.status === 'active' ? 'text-orange-500' : 'text-secondary'}`}>{getRoundTitle(data.round)}</span>
                        </div>

                        <div className="flex items-center gap-6 bg-surface p-3.5 rounded-2xl border border-border shadow-sm">
                            <div className="flex items-center gap-3">
                                {data.turn === 'me' ? (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center animate-pulse transition-colors duration-300 ${data.status === 'active' ? 'bg-orange-500' : 'bg-accent'}`}>
                                        <Mic className="w-4 h-4 text-white" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center">
                                        <MicOff className="w-5 h-5 text-muted" />
                                    </div>
                                )
                                }
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none mb-1">
                                        {data.turn === 'me' ? 'YOUR TURN' : 'STRANGER IS SPEAKING'}
                                    </span>
                                    <span className={`text-xs font-bold ${data.turn === 'me' ? (data.status === 'active' ? 'text-orange-500' : 'text-accent') : 'text-secondary'}`}>
                                        {data.turn === 'me' ? 'Speak clearly into your mic' : 'Listen carefully to the argument'}
                                    </span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-border" />

                            <div className="flex items-center gap-3 px-2 min-w-[80px]">
                                <Timer className={`w-5 h-5 ${data.timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-muted'}`} />
                                <span className={`text-2xl font-mono font-bold ${data.timeLeft < 10 ? 'text-red-500' : 'text-foreground'}`}>
                                    {data.timeLeft}s
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {isVoting && (
                    <div className="flex flex-col items-center py-4 animate-in fade-in zoom-in duration-300">
                        <span className="text-xs font-bold text-muted uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Scale className="w-5 h-5 text-accent" /> Who had the stronger arguments?
                        </span>
                        <div className="flex gap-4">
                            <button
                                onClick={() => onVote('me')}
                                disabled={data.votes.me !== null}
                                className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border ${data.votes.me === 'me' ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-white border-border text-secondary hover:border-accent hover:text-accent shadow-sm'}`}
                            >
                                Me
                            </button>
                            <button
                                onClick={() => onVote('stranger')}
                                disabled={data.votes.me !== null}
                                className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border ${data.votes.me === 'stranger' ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-white border-border text-secondary hover:border-accent hover:text-accent shadow-sm'}`}
                            >
                                Stranger
                            </button>
                            <button
                                onClick={() => onVote('draw')}
                                disabled={data.votes.me !== null}
                                className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border ${data.votes.me === 'draw' ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-white border-border text-secondary hover:border-accent hover:text-accent shadow-sm'}`}
                            >
                                Draw
                            </button>
                        </div>
                        {data.votes.me && !data.votes.stranger && (
                            <span className="mt-3 text-[10px] text-muted uppercase tracking-widest animate-pulse">
                                Waiting for stranger's vote...
                            </span>
                        )}
                    </div>
                )}

                {isFinished && (
                    <div className="flex flex-col items-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                        <div className="p-4 rounded-[2rem] bg-accent/5 mb-4">
                            <Trophy className={`w-10 h-10 ${data.winner === 'me' ? 'text-yellow-500' : data.winner === 'draw' ? 'text-muted' : 'text-secondary'}`} />
                        </div>
                        <span className="text-3xl font-bold text-foreground uppercase tracking-tight">
                            {data.winner === 'me' ? 'You won the debate!' :
                                data.winner === 'stranger' ? 'The stranger won' :
                                    'It\'s a draw!'}
                        </span>
                        <button
                            onClick={onExit}
                            className="mt-8 px-10 py-3 rounded-2xl bg-accent text-white text-sm font-bold hover:bg-accent-hover shadow-lg shadow-accent/20 transition-all active:scale-[0.98]"
                        >
                            Return to Chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebateStatus;

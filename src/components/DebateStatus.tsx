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
        <div className={`w-full border-b p-4 animate-in slide-in-from-top-4 duration-500 z-30 transition-colors duration-300 ${data.status === 'active' ? 'bg-orange-500/10 border-orange-400/30' : 'bg-surface/50 border-border'}`}>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${data.status === 'active' ? 'bg-orange-500 border border-orange-400/50 text-white' : 'bg-accent/20 border border-accent/30 text-accent'}`}>
                            Debate Mode
                        </div>
                        {data.topic && (
                            <span className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-md">
                                {data.topic}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onExit}
                        className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-zinc-500"
                        title="Exit Debate"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {!isVoting && !isFinished && (
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Round</span>
                            <span className={`text-sm font-black uppercase tracking-tight transition-colors duration-300 ${data.status === 'active' ? 'text-orange-400' : 'text-zinc-200'}`}>{getRoundTitle(data.round)}</span>
                        </div>

                        <div className="flex items-center gap-6 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800 shadow-inner">
                            <div className="flex items-center gap-3">
                                {data.turn === 'me' ? (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center animate-pulse transition-colors duration-300 ${data.status === 'active' ? 'bg-orange-500' : 'bg-accent'}`}>
                                        <Mic className="w-4 h-4 text-white" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <MicOff className="w-4 h-4 text-zinc-500" />
                                    </div>
                                )
                                }
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                                        {data.turn === 'me' ? 'YOUR TURN' : 'STRANGER IS SPEAKING'}
                                    </span>
                                    <span className={`text-xs font-bold ${data.turn === 'me' ? (data.status === 'active' ? 'text-orange-400' : 'text-accent') : 'text-zinc-300'}`}>
                                        {data.turn === 'me' ? 'Speak clearly into your mic' : 'Listen carefully to the argument'}
                                    </span>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-zinc-800" />

                            <div className="flex items-center gap-2 px-2 min-w-[70px]">
                                <Timer className={`w-4 h-4 ${data.timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`} />
                                <span className={`text-xl font-mono font-black ${data.timeLeft < 10 ? 'text-red-500' : (data.status === 'active' ? 'text-orange-400' : 'text-white')}`}>
                                    {data.timeLeft}s
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {isVoting && (
                    <div className="flex flex-col items-center py-2 animate-in fade-in zoom-in duration-300">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Scale className="w-4 h-4" /> Who had the stronger arguments?
                        </span>
                        <div className="flex gap-4">
                            <button
                                onClick={() => onVote('me')}
                                disabled={data.votes.me !== null}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all border ${data.votes.me === 'me' ? 'bg-accent border-accent text-white' : 'bg-surface border-border text-zinc-300 hover:border-accent/50 hover:text-accent'}`}
                            >
                                Me
                            </button>
                            <button
                                onClick={() => onVote('stranger')}
                                disabled={data.votes.me !== null}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all border ${data.votes.me === 'stranger' ? 'bg-accent border-accent text-white' : 'bg-surface border-border text-zinc-300 hover:border-accent/50 hover:text-accent'}`}
                            >
                                Stranger
                            </button>
                            <button
                                onClick={() => onVote('draw')}
                                disabled={data.votes.me !== null}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all border ${data.votes.me === 'draw' ? 'bg-accent border-accent text-white' : 'bg-surface border-border text-zinc-300 hover:border-accent/50 hover:text-accent'}`}
                            >
                                Draw
                            </button>
                        </div>
                        {data.votes.me && !data.votes.stranger && (
                            <span className="mt-3 text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">
                                Waiting for stranger's vote...
                            </span>
                        )}
                    </div>
                )}

                {isFinished && (
                    <div className="flex flex-col items-center py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Trophy className={`w-8 h-8 mb-2 ${data.winner === 'me' ? 'text-yellow-500' : data.winner === 'draw' ? 'text-zinc-400' : 'text-zinc-600'}`} />
                        <span className="text-xl font-black text-white uppercase tracking-tighter">
                            {data.winner === 'me' ? 'YOU WON THE DEBATE!' :
                                data.winner === 'stranger' ? 'THE STRANGER WON' :
                                    'IT\'S A DRAW!'}
                        </span>
                        <button
                            onClick={onExit}
                            className="mt-4 px-6 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold hover:bg-accent/20 transition-all"
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

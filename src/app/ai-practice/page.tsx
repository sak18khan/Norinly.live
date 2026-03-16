'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, MicOff, X, RotateCcw, Volume2, Timer, MessageSquare, Info, ChevronRight, Play } from 'lucide-react';
import AIFeedbackCard from '@/components/AIFeedbackCard';
import { useChatContext } from '@/context/ChatContext';
import { calculateFeedback, saveAISession } from '@/lib/ai-utils';

function AIPracticeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const goal = searchParams.get('goal') || 'casual';
    const difficulty = searchParams.get('difficulty') || 'intermediate';
    const topic = searchParams.get('topic') || 'general';

    const { currentUser } = useChatContext();
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string; audio?: string }[]>([]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [sessionEnded, setSessionEnded] = useState(false);
    const [isAITyping, setIsAITyping] = useState(false);
    const [lastAIResponse, setLastAIResponse] = useState<string | null>(null);
    const [showTranscript, setShowTranscript] = useState(true);
    const [feedbackData, setFeedbackData] = useState<any>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    // Initial message
    useEffect(() => {
        const welcomeMessages: Record<string, string> = {
            casual: "Hi there! I'm your AI speaking partner for today. How are you doing? Tell me about your hobbies!",
            interview: "Welcome to your mock interview. I'm the hiring manager. To start, could you please tell me about yourself?",
            business: "Good morning. Let's discuss our strategy for the upcoming project. Do you have any initial thoughts on the budget?",
            debate: "I strongly believe that social media has done more harm than good to society. What is your take on this?",
            pronunciation: "Let's work on your pronunciation. Please repeat after me: 'The quick brown fox jumps over the lazy dog'.",
            travel: "Hello! Welcome to the Grand Hotel. How can I help you today? Do you have a reservation?",
        };

        const initialText = welcomeMessages[goal] || welcomeMessages.casual;
        setMessages([{ role: 'ai', text: initialText }]);
        setLastAIResponse(initialText);
        
        // Timer countdown
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    handleEndSession();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [goal]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleMicToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        if (typeof window === 'undefined') return;
        
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (event.results[0].isFinal) {
                handleUserMessage(transcript);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleUserMessage = async (text: string) => {
        const newUserMessage = { role: 'user' as const, text };
        setMessages(prev => [...prev, newUserMessage]);
        setIsAITyping(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, newUserMessage],
                    goal,
                    difficulty,
                    topic
                })
            });

            const data = await response.json();
            const aiText = data.text;

            setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
            setLastAIResponse(aiText);
            setIsAITyping(false);

            // Play AI Voice
            playAIVoice(aiText);
        } catch (error) {
            console.error('Error getting AI response:', error);
            setIsAITyping(false);
        }
    };

    const playAIVoice = async (text: string) => {
        try {
            const response = await fetch('/api/ai/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voice: 'onyx' })
            });

            if (!response.ok) throw new Error('TTS Failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
            }
        } catch (error) {
            console.error('Error playing AI voice:', error);
            // Fallback to browser TTS
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                const uttr = new SpeechSynthesisUtterance(text);
                uttr.lang = 'en-US';
                window.speechSynthesis.speak(uttr);
            }
        }
    };

    const handleRepeat = () => {
        if (lastAIResponse) {
            playAIVoice(lastAIResponse);
        }
    };

    const handleEndSession = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const feedback = calculateFeedback(messages, duration);
        setFeedbackData(feedback);
        setSessionEnded(true);

        // Save to Firestore if user is logged in
        if (currentUser) {
            await saveAISession({
                userId: currentUser.uid,
                goal,
                difficulty,
                topic,
                duration,
                messageCount: messages.length,
                ...feedback
            });
        }
    };

    if (sessionEnded && feedbackData) {
        return (
            <AIFeedbackCard 
                feedback={feedbackData}
                onRestart={() => window.location.reload()}
                onTryReal={() => router.push('/connect')}
            />
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col text-white overflow-hidden">
            {/* Top Bar */}
            <div className="p-4 md:p-6 border-b border-border flex items-center justify-between bg-surface/50 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/connect')}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="font-black text-lg md:text-xl capitalize flex items-center gap-2">
                            {goal.replace('-', ' ')}
                            <span className="text-zinc-500 text-sm font-normal hidden md:inline">• {difficulty}</span>
                        </h2>
                        <div className="flex items-center gap-1 text-xs text-accent font-bold uppercase tracking-widest">
                            <Info className="w-3 h-3" />
                            Topic: {topic}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-lg md:text-xl transition-colors ${timeLeft < 60 ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                        <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'animate-pulse' : ''}`} />
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row relative">
                {/* Conversation View */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                    {/* Background Visuals */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
                    
                    <div className="relative flex flex-col items-center space-y-8 max-w-lg w-full">
                        {/* AI Avatar / Indicator */}
                        <div className="relative">
                            <div className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-1000 ${isAITyping ? 'bg-accent/40 scale-125' : 'bg-accent/20 scale-100'}`} />
                            <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 flex items-center justify-center bg-surface shadow-2xl overflow-hidden transition-all duration-500 ${isAITyping ? 'border-accent scale-105 shadow-accent/20' : 'border-border'}`}>
                                {isAITyping ? (
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-3 h-3 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-3 h-3 bg-accent rounded-full animate-bounce" />
                                    </div>
                                ) : (
                                    <div className="text-8xl select-none animate-in zoom-in-50 duration-500">
                                        🤖
                                    </div>
                                )}
                                
                                {/* Orbiting visual when AI speaks */}
                                {isAITyping && (
                                    <div className="absolute inset-0 border-4 border-accent border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-30" />
                                )}
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="bg-surface/80 border border-border p-6 rounded-3xl shadow-xl backdrop-blur-sm max-w-md animate-in slide-in-from-bottom-4 duration-500">
                                <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-zinc-200">
                                    "{lastAIResponse}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transcript Sidebar (Optional) */}
                {showTranscript && (
                    <div className="w-full md:w-96 border-l border-border bg-surface/30 backdrop-blur-sm flex flex-col animate-in slide-in-from-right-8 duration-500">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-accent" />
                                Transcript
                            </h3>
                            <button 
                                onClick={() => setShowTranscript(false)}
                                className="md:hidden p-1 hover:bg-zinc-800 rounded-lg"
                            >
                                <ChevronRight className="w-5 h-5 rotate-90 md:rotate-0" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-accent text-white rounded-tr-none' 
                                            : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-border'
                                    }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">
                                        {msg.role === 'user' ? 'You' : 'AI Partner'}
                                    </span>
                                </div>
                            ))}
                            {isAITyping && (
                                <div className="flex flex-col items-start animate-pulse">
                                    <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none border border-border">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="p-6 md:p-10 bg-background/80 backdrop-blur-xl border-t border-border relative z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
                    <button 
                        onClick={() => setShowTranscript(!showTranscript)}
                        className={`hidden md:flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${showTranscript ? 'bg-accent/10 border-accent text-accent' : 'border-border text-zinc-400 hover:border-zinc-700'}`}
                    >
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase">Transcript</span>
                    </button>

                    <div className="flex-1 flex flex-col items-center">
                        <div className="relative group">
                            {/* Visual Pings for Recording */}
                            {isRecording && (
                                <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-30 scale-150" />
                            )}
                            
                            <button 
                                onClick={handleMicToggle}
                                className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-2xl ${
                                    isRecording 
                                        ? 'bg-red-500 border-red-400 scale-110 shadow-red-500/20' 
                                        : 'bg-accent border-accent-hover hover:scale-105 active:scale-95 shadow-accent/30'
                                }`}
                            >
                                {isRecording ? <MicOff className="w-10 h-10 md:w-14 md:h-14" /> : <Mic className="w-10 h-10 md:w-14 md:h-14" />}
                            </button>
                        </div>
                        <p className={`mt-4 font-bold text-sm md:text-base tracking-wide transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-zinc-500'}`}>
                            {isRecording ? 'Listening...' : 'Tap to speak'}
                        </p>
                    </div>

                    <div className="hidden md:flex gap-4">
                        <button 
                            onClick={handleRepeat}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border text-zinc-400 hover:border-zinc-700 hover:text-white transition-all active:scale-95"
                        >
                            <RotateCcw className="w-6 h-6" />
                            <span className="text-[10px] font-bold uppercase">Repeat AI</span>
                        </button>
                        <button 
                            onClick={handleEndSession}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-red-500/30 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
                        >
                            <X className="w-6 h-6" />
                            <span className="text-[10px] font-bold uppercase">End</span>
                        </button>
                    </div>

                    {/* Mobile Only Compact Controls */}
                    <div className="md:hidden flex gap-2">
                        <button onClick={handleRepeat} className="p-4 bg-surface border border-border rounded-2xl"><RotateCcw className="w-6 h-6" /></button>
                        <button onClick={handleEndSession} className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl"><X className="w-6 h-6" /></button>
                    </div>
                </div>
            </div>

            <audio ref={audioRef} className="hidden" />
        </div>
    );
}

export default function AIPracticePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Loading Session...</p>
                </div>
            </div>
        }>
            <AIPracticeContent />
        </Suspense>
    );
}

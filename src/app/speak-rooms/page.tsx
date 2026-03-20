'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Users, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  Globe, 
  Brain, 
  Music, 
  Coffee, 
  Gamepad2, 
  Mic2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  MoreVertical,
  ThumbsUp,
  Smile,
  ShieldCheck,
  Eye,
  Type,
  ArrowLeft,
  Loader2,
  ArrowUp
} from 'lucide-react';
import { Socket } from 'socket.io-client';
import socket from '@/lib/socket';
import toast from 'react-hot-toast';
import { generateRandomName } from '@/lib/identity-utils';
import { updateTaskProgress } from '@/lib/gamification';
import { auth } from '@/lib/firebase';

// Types
interface Topic {
  id: string;
  title: string;
  desc: string;
  category: 'Daily' | 'Debate' | 'Fun' | 'Roleplay';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ReactNode;
}

interface RoomUser {
  socketId: string;
  userId: string;
  username: string;
  avatar: string;
  isTyping: boolean;
  isSpectator: boolean;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: number;
}

const TOPICS: Topic[] = [
  { id: '1', title: 'Daily Life & Routines', desc: 'Talk about your day and habits.', category: 'Daily', difficulty: 'Beginner', icon: <Coffee className="w-5 h-5" /> },
  { id: '2', title: 'AI: Friend or Foe?', desc: 'The future of artificial intelligence.', category: 'Debate', difficulty: 'Advanced', icon: <Brain className="w-5 h-5" /> },
  { id: '3', title: 'Travel Adventures', desc: 'Share your best travel stories.', category: 'Daily', difficulty: 'Intermediate', icon: <Globe className="w-5 h-5" /> },
  { id: '4', title: 'Gaming Culture', desc: 'Discuss your favorite games and trends.', category: 'Fun', difficulty: 'Intermediate', icon: <Gamepad2 className="w-5 h-5" /> },
  { id: '5', title: 'Coffee Shop Roleplay', desc: 'Practice ordering and small talk.', category: 'Roleplay', difficulty: 'Beginner', icon: <Coffee className="w-5 h-5" /> },
  { id: '6', title: 'Future of Work', desc: 'Remote work and new career paths.', category: 'Debate', difficulty: 'Advanced', icon: <Sparkles className="w-5 h-5" /> },
  { id: '7', title: 'Music & Emotions', desc: 'How music affects our daily lives.', category: 'Fun', difficulty: 'Intermediate', icon: <Music className="w-5 h-5" /> },
  { id: '8', title: 'Job Interview Prep', desc: 'Mock interviews for your dream job.', category: 'Roleplay', difficulty: 'Advanced', icon: <Users className="w-5 h-5" /> },
  { id: '9', title: 'Hobby Showcase', desc: 'Show and tell about your passions.', category: 'Daily', difficulty: 'Beginner', icon: <Gamepad2 className="w-5 h-5" /> },
  { id: '10', title: 'Movie Critic Night', desc: 'Review the latest blockbusters.', category: 'Fun', difficulty: 'Intermediate', icon: <MessageSquare className="w-5 h-5" /> },
  { id: '11', title: 'Space Exploration & Aliens', desc: 'Discuss the possibility of life beyond Earth.', category: 'Debate', difficulty: 'Advanced', icon: <Sparkles className="w-5 h-5" /> },
  { id: '12', title: 'Street Food Adventures', desc: 'Talk about your favorite local snacks and dishes.', category: 'Daily', difficulty: 'Beginner', icon: <Coffee className="w-5 h-5" /> },
];

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sheba',
];

export default function SpeakRooms() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCorrectMe, setShowCorrectMe] = useState(false);
  const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set());
  const [isSelfMuted, setIsSelfMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Socket Initialization
    if (!socket.connected) {
      socket.connect();
    }
    socketRef.current = socket;

    socket.on('sr_room_update', (data) => {
      setRoomData(data);
    });

    socket.on('sr_receive_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });
    
    socket.on('sr_joined_active', () => {
      toast.success("It's your turn! You're now an active participant.");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleJoinTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    const userId = localStorage.getItem('norinly_user_id') || `user_${Math.random().toString(36).substring(7)}`;
    const username = generateRandomName();
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    
    socketRef.current?.emit('sr_join_topic', {
      topicId: topic.id,
      userId,
      username,
      avatar
    });
    toast.success(`Joining ${topic.title}`);

    // Task: Join Room
    const currentUser = auth?.currentUser;
    if (currentUser) {
      updateTaskProgress(currentUser.uid, 'joinRoom', 1);
    }
  };

  const handleLeave = () => {
    socketRef.current?.emit('sr_leave');
    setRoomData(null);
    setSelectedTopic(null);
    setMessages([]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userId = localStorage.getItem('norinly_user_id') || 'anon';
    const username = roomData?.users.find((u: any) => u.socketId === socketRef.current?.id)?.username || 'Me';
    const avatar = roomData?.users.find((u: any) => u.socketId === socketRef.current?.id)?.avatar || AVATARS[0];

    const newMsg: Message = {
      id: Math.random().toString(36).substring(7),
      userId,
      username,
      avatar,
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMsg]);
    socketRef.current?.emit('sr_send_message', newMsg);
    setInputText('');
    socketRef.current?.emit('sr_typing', false);

    // Task: Send Messages
    const currentUser = auth?.currentUser;
    if (currentUser) {
      updateTaskProgress(currentUser.uid, 'sendMessages', 1);
    }
  };

  const handleTyping = (text: string) => {
    setInputText(text);
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      socketRef.current?.emit('sr_typing', true);
    } else if (isTyping && text.length === 0) {
      setIsTyping(false);
      socketRef.current?.emit('sr_typing', false);
    }
  };
  
  const toggleMuteUser = (socketId: string) => {
    setMutedUsers(prev => {
      const next = new Set(prev);
      if (next.has(socketId)) {
        next.delete(socketId);
        toast.success('User unmuted');
      } else {
        next.add(socketId);
        toast.error('User muted');
      }
      return next;
    });
  };

  const toggleMuteAll = () => {
    if (mutedUsers.size > 0 && mutedUsers.size === roomData?.users.length - 1) {
      setMutedUsers(new Set());
      toast.success('All unmuted');
    } else {
      const allOtherUsers = roomData?.users
        .filter((u: any) => u.socketId !== socketRef.current?.id)
        .map((u: any) => u.socketId);
      setMutedUsers(new Set(allOtherUsers));
      toast.error('All muted');
    }
  };

  const toggleSelfMute = () => {
    setIsSelfMuted(!isSelfMuted);
    toast(isSelfMuted ? 'Microphone enabled' : 'Microphone muted', {
      icon: isSelfMuted ? <Mic className="w-4 h-4 text-positive-accent" /> : <MicOff className="w-4 h-4 text-secondary" />,
    });
  };

    if (roomData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden font-sans selection:bg-accent/30">
        {/* Main Content: Grid */}
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto no-scrollbar relative max-h-screen md:max-h-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-10 gap-4 relative z-10">
            <div className="flex items-center gap-4 md:gap-6">
              <button 
                onClick={handleLeave} 
                className="group p-2.5 md:p-3 hover:bg-surface-alt rounded-2xl transition-all border border-transparent hover:border-border"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-muted-text group-hover:text-foreground group-hover:-translate-x-1 transition-all" />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                  <h1 className="text-xl md:text-3xl font-black tracking-tight leading-tight">{selectedTopic?.title}</h1>
                  <span className="text-[9px] md:text-[10px] bg-accent/10 text-accent px-2.5 py-1 rounded-full border border-accent/20 font-black uppercase tracking-widest whitespace-nowrap">
                    {selectedTopic?.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-text text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  <span className="bg-surface-alt px-2 py-0.5 rounded">ID: {roomData.id.split('_').pop()}</span>
                  <span className="hidden md:block h-1 w-1 rounded-full bg-border" />
                  <span className="hidden md:block">Practice Session</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-4 bg-surface border border-border px-4 md:px-6 py-2.5 md:py-3 rounded-2xl md:rounded-[1.5rem] backdrop-blur-xl">
               <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 md:-space-x-2.5">
                    {roomData.users.filter((u: any) => !u.isSpectator).map((u: any) => (
                      <img key={u.socketId} src={u.avatar} className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-background" alt={u.username} />
                    ))}
                  </div>
                  <div className="h-4 md:h-6 w-px bg-white/10 mx-1 md:mx-2" />
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base font-black text-foreground">{roomData.users.filter((u: any) => !u.isSpectator).length}/4</span>
                    <span className="text-[8px] md:text-[9px] font-black text-muted-text uppercase tracking-widest leading-none">Inside</span>
                  </div>
               </div>
               
               {roomData.queue.length > 0 && (
                 <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-accent/10 text-accent border border-accent/10">
                   <Users className="w-3.5 h-3.5" />
                   <span className="text-[10px] font-black">{roomData.queue.length} Wait</span>
                 </div>
               )}
            </div>
          </div>

          {/* Grid Layout: Stacks on very small, 2x2 on medium */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8 pb-4 relative z-10">
            {[0, 1, 2, 3].map((idx) => {
              const user = roomData.users.filter((u: any) => !u.isSpectator)[idx];
              const isCurrentUser = user?.socketId === socketRef.current?.id;
              const isMuted = user ? mutedUsers.has(user.socketId) : false;
              
              return (
                <div 
                  key={idx} 
                  className={`relative group rounded-[2rem] md:rounded-[3rem] border-2 transition-all duration-500 overflow-hidden min-h-[160px] md:min-h-[280px] flex flex-col items-center justify-center p-4 md:p-8 ${
                    user 
                      ? 'bg-surface/50 border-border shadow-premium backdrop-blur-xl' 
                      : 'bg-surface-alt/50 border-dashed border-border hover:bg-surface-alt'
                  } ${user?.isTyping && (!isCurrentUser || !isSelfMuted) ? 'border-accent ring-[6px] md:ring-[10px] ring-accent/5' : ''} ${isMuted ? 'opacity-60' : ''}`}
                >
                  {user ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full relative">
                      {/* Mute Button for Others */}
                      {!isCurrentUser && (
                        <button 
                          onClick={() => toggleMuteUser(user.socketId)}
                          className={`absolute top-0 right-0 p-2 md:p-3 rounded-full transition-all duration-300 z-20 ${
                            isMuted ? 'bg-secondary/20 text-secondary' : 'bg-surface-alt text-muted-text hover:bg-surface'
                          }`}
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                      )}

                      {/* Self Mute Toggle */}
                      {isCurrentUser && (
                        <button 
                          onClick={toggleSelfMute}
                          className={`absolute top-0 right-0 p-2 md:p-3 rounded-full transition-all duration-300 z-20 ${
                            isSelfMuted ? 'bg-secondary/20 text-secondary' : 'bg-positive-accent/20 text-positive-accent hover:bg-positive-accent/30'
                          }`}
                          title={isSelfMuted ? 'Unmute Mic' : 'Mute Mic'}
                        >
                          {isSelfMuted ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                      )}

                      <div className="relative mb-3 md:mb-6">
                        <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${user.isTyping && (!isCurrentUser || !isSelfMuted) ? 'bg-accent/30 scale-125' : 'bg-transparent'}`} />
                        <img 
                          src={user.avatar} 
                          className={`relative w-14 h-14 md:w-36 md:h-36 rounded-full object-cover border-2 md:border-4 transition-all duration-500 shadow-premium ${
                            user.isTyping && (!isCurrentUser || !isSelfMuted) ? 'border-accent scale-105' : 'border-border group-hover:border-accent/40'
                          } ${isMuted ? 'grayscale' : ''}`}
                          alt={user.username} 
                        />
                        {user.isTyping && (!isCurrentUser || !isSelfMuted) && (
                          <div className="absolute -bottom-1 translate-x-1/2 right-1/2 flex gap-1 md:gap-1.5 bg-accent px-2.5 md:px-4 py-1 md:py-2 rounded-full shadow-[0_10px_30px_-5px_rgba(59,130,246,0.6)] animate-bounce">
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse" />
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse [animation-delay:0.2s]" />
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse [animation-delay:0.4s]" />
                          </div>
                        )}
                        {isSelfMuted && isCurrentUser && (
                          <div className="absolute top-0 right-0 bg-secondary-accent p-1.5 rounded-full border-2 border-background drop-shadow-lg">
                            <MicOff className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-center space-y-0.5 md:space-y-1">
                        <h3 className="text-sm md:text-2xl font-black tracking-tight text-foreground flex items-center justify-center gap-2 md:gap-3 truncate max-w-full">
                          <span className={`${isMuted ? 'text-muted-text' : ''} truncate`}>{user.username}</span>
                          {isCurrentUser && (
                            <span className="hidden md:inline-block text-[8px] md:text-[9px] bg-accent/20 text-accent px-2 py-0.5 rounded-full border border-accent/20 font-black tracking-widest uppercase">You</span>
                          )}
                        </h3>
                        <p className="text-secondary-text text-[9px] md:text-sm font-bold uppercase tracking-widest md:opacity-60 truncate">Active Learner</p>
                      </div>
                      
                      {/* Active Indicator */}
                      <div className={`mt-3 md:mt-6 flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-1 md:py-1.5 rounded-full border transition-all duration-500 ${
                        user.isTyping && (!isCurrentUser || !isSelfMuted)
                          ? 'bg-accent text-white shadow-glow border-accent' 
                          : 'bg-surface-alt border-border text-muted-text'
                      }`}>
                         <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${user.isTyping && (!isCurrentUser || !isSelfMuted) ? 'bg-white animate-pulse' : (isMuted ? 'bg-border' : 'bg-positive-accent')}`} />
                         <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                           {isCurrentUser && isSelfMuted ? 'Muted' : (user.isTyping ? (window.innerWidth < 768 ? 'Live' : 'Speaking Now') : 'Listening')}
                         </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 md:p-8 text-center group/empty">
                      <div className="w-12 h-12 md:w-20 md:h-20 rounded-[1.2rem] md:rounded-[2rem] bg-surface-alt/50 border border-border flex items-center justify-center mb-3 md:mb-6 group-hover/empty:scale-110 group-hover/empty:bg-surface-alt transition-all duration-500">
                        {roomData.queue.length > 0 ? (
                           <div className="relative w-6 h-6 md:w-10 md:h-10">
                              <Loader2 className="w-6 h-6 md:w-10 md:h-10 text-accent/30 animate-spin" />
                              <Eye className="w-3 h-3 md:w-5 md:h-5 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                           </div>
                        ) : (
                          <Users className="w-6 h-6 md:w-10 md:h-10 text-border group-hover/empty:text-muted-text transition-colors" />
                        )}
                      </div>
                      <p className="text-[9px] md:text-xs font-black text-border uppercase tracking-widest group-hover/empty:text-muted-text transition-colors">Available Slot</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Spectator Warning */}
          {roomData.users.find((u: any) => u.socketId === socketRef.current?.id)?.isSpectator && (
            <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-between relative z-10">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-accent" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-white">You are currently spectating</p>
                   <p className="text-xs text-zinc-500">You will join the discussion as soon as a spot becomes available.</p>
                 </div>
               </div>
               <div className="px-4 py-2 bg-accent/20 rounded-xl text-accent text-xs font-bold">
                 Queue Position: 1
               </div>
            </div>
          )}
        </div>

        {/* Chat Panel: Right side on Desktop */}
        <div className="w-full md:w-[450px] md:h-screen border-l border-border bg-surface flex flex-col shadow-premium relative z-20 overflow-hidden shrink-0">
          <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-gradient-to-b from-surface-alt/50 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                 <MessageSquare className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-black text-base md:text-lg uppercase tracking-tight text-foreground">Conversation</h2>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-positive-accent animate-pulse" />
                   <span className="text-[9px] font-black text-muted-text uppercase tracking-widest whitespace-nowrap">Secure Room</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(roomData.id.split('_').pop() || '');
                  toast.success('Room ID copied!');
                }}
                className="p-2.5 hover:bg-surface-alt rounded-xl transition-all text-muted-text hover:text-foreground"
                title="Copy Room ID"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button 
                onClick={toggleMuteAll}
                className={`p-2.5 rounded-xl transition-all ${
                  mutedUsers.size > 0 ? 'bg-secondary-accent/10 text-secondary-accent' : 'hover:bg-surface-alt text-muted-text'
                }`}
                title="Toggle Mute All"
              >
                {mutedUsers.size > 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button className="p-2.5 hover:bg-surface-alt rounded-xl transition-all"><MoreVertical className="w-5 h-5 text-muted-text" /></button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex px-6 md:px-8 border-b border-border bg-surface-alt/20">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === 'chat' ? 'text-accent' : 'text-muted-text hover:text-foreground'
              }`}
            >
              Chat
              {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
            </button>
            <button 
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === 'participants' ? 'text-accent' : 'text-muted-text hover:text-foreground'
              }`}
            >
              Participants ({roomData.users.length})
              {activeTab === 'participants' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
            </button>
          </div>

          {activeTab === 'chat' ? (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8 custom-scrollbar min-h-[300px] md:min-h-0">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-6 md:px-12 py-10">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2.5rem] bg-surface-alt border border-border flex items-center justify-center mb-6 md:mb-8">
                       <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-accent" />
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-foreground mb-3">Break the ice!</h3>
                    <p className="text-xs md:text-sm font-medium leading-relaxed text-secondary-text">People here are friendly and ready to practice English with you.</p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMuted = mutedUsers.has(msg.userId) || (roomData?.users.find((u: any) => u.userId === msg.userId)?.socketId && mutedUsers.has(roomData.users.find((u: any) => u.userId === msg.userId).socketId));
                  const isMe = msg.userId === (localStorage.getItem('norinly_user_id') || 'anon');
                  
                  if (isMuted) return (
                    <div key={msg.id} className="flex justify-center opacity-40">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-surface-alt px-3 py-1 rounded-full border border-border">Message from muted user</span>
                    </div>
                  );

                  return (
                    <div key={msg.id} className={`flex items-start gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <img src={msg.avatar} className="w-9 h-9 md:w-11 md:h-11 rounded-[1.2rem] object-cover shrink-0 border-2 border-white/10 shadow-lg" alt="" />
                      <div className={`flex-1 min-w-0 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          <span className="font-black text-[10px] md:text-[11px] text-muted-text uppercase tracking-widest">{msg.username}</span>
                          <span className="text-[9px] md:text-[10px] text-muted-text/60 font-black uppercase">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`px-4 md:px-5 py-3 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] border text-sm md:text-base leading-relaxed break-words shadow-sm transition-all hover:shadow-md ${
                          isMe 
                            ? 'bg-gradient-to-br from-accent to-accent/80 border-accent/20 text-white rounded-tr-none shadow-glow-accent' 
                            : 'bg-surface-alt border-border text-foreground rounded-tl-none hover:bg-surface'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Suggestions */}
              <div className="px-6 md:px-8 pb-4 shrink-0">
                 <div className="flex gap-2.5 md:gap-3 overflow-x-auto no-scrollbar pb-2">
                    {['👋 Hey!', 'Nice to meet you!', 'Where from?', "Let's talk!", 'Repeat?'].map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSendMessage({ preventDefault: () => {}, target: { value: s } } as any)} 
                        className="whitespace-nowrap px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-surface-alt border border-border text-[9px] md:text-[11px] font-black uppercase tracking-widest text-muted-text hover:text-foreground hover:bg-surface hover:border-accent transition-all duration-300 active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Input Area */}
              <div className="p-6 md:p-8 bg-black/40 backdrop-blur-3xl border-t border-white/5 shrink-0">
                <div className="flex items-center justify-between mb-4 md:mb-5 px-1">
                   <button 
                    onClick={() => setShowCorrectMe(!showCorrectMe)}
                    className={`flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border duration-300 ${
                      showCorrectMe ? 'bg-positive-accent border-positive-accent text-white shadow-glow' : 'bg-surface-alt border-border text-muted-text hover:text-foreground'
                    }`}
                   >
                     <ShieldCheck className={`w-3.5 h-3.5 md:w-4 md:h-4 ${showCorrectMe ? 'animate-pulse' : ''}`} />
                     Correct Me
                   </button>
                   <div className="flex items-center gap-4 md:gap-5">
                     <button className="text-zinc-600 hover:text-accent transition-colors"><ThumbsUp className="w-4 h-4 md:w-5 md:h-5" /></button>
                     <button className="text-zinc-600 hover:text-accent transition-colors"><Smile className="w-4 h-4 md:w-5 md:h-5" /></button>
                   </div>
                </div>
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-surface-alt border-2 border-border rounded-2xl md:rounded-[2rem] px-6 md:px-8 py-4 md:py-5 pr-16 md:pr-20 text-sm md:text-base font-medium text-foreground focus:border-accent focus:bg-surface transition-all outline-none shadow-inner"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="absolute right-2 top-2 bottom-2 w-11 md:w-14 flex items-center justify-center bg-accent text-white rounded-xl md:rounded-[1.4rem] hover:bg-accent-hover transition-all shadow-glow-accent active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  >
                    <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-2 custom-scrollbar">
              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Inside Room</div>
              {roomData.users.filter((u: any) => !u.isSpectator).map((u: any) => (
                <div key={u.socketId} className="flex items-center justify-between p-3 rounded-2xl bg-surface-alt/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={u.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#121214] ${u.isTyping ? 'bg-accent animate-pulse' : 'bg-positive-accent'}`} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground flex items-center gap-2">
                        {u.username}
                        {u.socketId === socketRef.current?.id && <span className="text-[8px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-black uppercase">You</span>}
                      </div>
                      <div className="text-[9px] font-black text-muted-text uppercase tracking-widest">Active Learner</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.socketId !== socketRef.current?.id && (
                      <button 
                        onClick={() => toggleMuteUser(u.socketId)}
                        className={`p-2.5 rounded-xl transition-all ${mutedUsers.has(u.socketId) ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'}`}
                      >
                        {mutedUsers.has(u.socketId) ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {roomData.users.some((u: any) => u.isSpectator) && (
                <>
                  <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-8 mb-4">Spectating</div>
                  {roomData.users.filter((u: any) => u.isSpectator).map((u: any) => (
                    <div key={u.socketId} className="flex items-center justify-between p-3 rounded-2xl bg-surface-alt/20 border border-border/50">
                       <div className="flex items-center gap-3">
                        <img src={u.avatar} className="w-10 h-10 rounded-xl opacity-50" alt="" />
                        <div>
                          <div className="text-sm font-bold text-zinc-400">{u.username}</div>
                          <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Watching</div>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-zinc-700" />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-12 md:py-20 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-wider">
               <Globe className="w-4 h-4" /> Live English Practice
             </div>
             <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-loose md:leading-tight uppercase italic">
               Join Live <br /><span className="text-accent underline decoration-accent/10 underline-offset-[20px] not-italic">Conversations.</span>
             </h1>
             <p className="text-secondary-text text-lg md:text-xl font-bold leading-relaxed max-w-xl uppercase tracking-tight">
               Practice English naturally by joining themed discussions with learners worldwide. Fast, anonymous, and fun.
             </p>
          </div>
          
          <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-8 duration-700">
             <div className="text-right">
                <p className="text-3xl font-black text-foreground">1,248</p>
                <p className="text-xs font-black text-muted uppercase tracking-widest">Active Learners</p>
             </div>
             <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center shadow-premium">
                <Users className="w-6 h-6 text-accent" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {TOPICS.map((topic, i) => (
            <div 
              key={topic.id}
              onClick={() => handleJoinTopic(topic)}
              className="group relative bg-surface border border-border p-8 rounded-[2.5rem] cursor-pointer hover:border-accent/40 hover:shadow-premium hover:-translate-y-2 hover:shadow-glow-accent transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                 <ChevronRight className="w-6 h-6 text-accent" />
              </div>

              <div className="mb-8 w-14 h-14 bg-surface border border-border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <span className="text-accent">{topic.icon}</span>
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded-md border border-accent/10">
                    {topic.category}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                    topic.difficulty === 'Beginner' ? 'bg-positive-accent/5 text-positive-accent border-positive-accent/10' :
                    topic.difficulty === 'Intermediate' ? 'bg-secondary-accent/5 text-secondary-accent border-secondary-accent/10' :
                    'bg-orange-500/5 text-orange-500 border-orange-500/10'
                  }`}>
                    {topic.difficulty}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-foreground group-hover:text-accent transition-colors leading-tight">
                  {topic.title}
                </h3>
                <p className="text-secondary-text text-sm font-bold uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
                  {topic.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                 <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(j => (
                         <div key={j} className="w-6 h-6 rounded-full bg-zinc-100 border-2 border-white" />
                       ))}
                    </div>
                    <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest">3/4 Active</span>
                 </div>
                 <button className="text-accent font-black text-xs uppercase tracking-widest group-hover:underline">Join Now</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

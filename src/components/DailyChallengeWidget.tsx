'use client';

import { useState, useEffect } from 'react';
import { Flame, CheckCircle2, Circle, Trophy, Star, TrendingUp, Zap } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db as fdb, auth as fauth } from '@/lib/firebase';
import { initializeUserProgress, DailyTask } from '@/lib/gamification';

export default function DailyChallengeWidget() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fauth.onAuthStateChanged(async (user) => {
      if (user) {
        // Initialize if first time today
        await initializeUserProgress(user.uid);
        
        // Listen for real-time updates
        const userRef = doc(fdb, 'users', user.uid);
        const unsub = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setProgress(doc.data());
          }
          setLoading(false);
        });
        return () => unsub();
      } else {
        setProgress(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (!progress) return null;

  const tasks = progress.dailyProgress?.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.completed).length;
  const progressPercentage = (completedTasks / totalTasks) * 100;
  const isAllComplete = completedTasks === totalTasks && totalTasks > 0;

  return (
     <div className="w-full max-w-sm bg-premium-card border border-border rounded-[2.5rem] p-8 shadow-premium hover:shadow-premium-xl transition-all duration-500 group relative overflow-hidden">
       {/* Background Glow */}
       <div className={`absolute top-0 right-0 -m-4 w-32 h-32 blur-3xl rounded-full transition-all duration-1000 ${isAllComplete ? 'bg-positive-accent/10 opacity-100' : 'bg-accent/5 opacity-50Group-hover:opacity-100'}`} />
       
       <div className="relative z-10 space-y-8">
         {/* Header */}
         <div className="flex items-center justify-between">
           <div className="space-y-1">
             <h3 className="text-[10px] font-black text-muted-text uppercase tracking-widest flex items-center gap-2">
               <Zap className="w-3.5 h-3.5 text-accent" />
               Daily Goal
             </h3>
             <div className="flex items-baseline gap-2">
               <span className="text-3xl font-black text-foreground tracking-tighter">{completedTasks}/{totalTasks}</span>
               <span className="text-[10px] font-black text-muted-text uppercase tracking-wider mb-1">Items</span>
             </div>
           </div>
           <div className="flex flex-col items-end">
             <div className="flex items-center gap-2 bg-accent/5 border border-accent/10 px-4 py-2 rounded-2xl group/streak hover:scale-105 transition-transform">
               <Flame className={`w-5 h-5 transition-colors ${progress.streak > 0 ? 'text-accent' : 'text-muted'}`} />
               <span className={`text-xl font-black tracking-tighter ${progress.streak > 0 ? 'text-accent' : 'text-muted'}`}>{progress.streak || 0}</span>
             </div>
             <span className="text-[9px] font-black text-accent/40 uppercase tracking-widest mt-1 mr-1">Hot Streak</span>
           </div>
         </div>
 
         {/* Progress Bar */}
         <div className="space-y-4">
           <div className="h-3 w-full bg-surface border border-border rounded-full overflow-hidden p-0.5 shadow-inner">
             <div 
               className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isAllComplete ? 'bg-foreground shadow-premium' : 'bg-accent'}`}
               style={{ width: `${progressPercentage}%` }}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" />
             </div>
           </div>
           <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-text">
             <span>{Math.round(progressPercentage)}% Protocol</span>
             <span className={isAllComplete ? 'text-foreground' : ''}>
               {isAllComplete ? 'All Tasks Done' : `${totalTasks - completedTasks} Remaining`}
             </span>
           </div>
         </div>
 
         {/* Task List */}
         <div className="space-y-3">
           {tasks.map((task: DailyTask) => (
             <div 
               key={task.id}
               className={`flex items-center justify-between p-4 rounded-3xl border transition-all duration-500 ${
                 task.completed 
                 ? 'bg-surface border-border' 
                 : 'bg-surface/50 border-border hover:border-accent/30'
               }`}
             >
               <div className="flex items-center gap-4">
                 <div className={`p-2 rounded-2xl transition-all duration-500 ${task.completed ? 'bg-premium-card shadow-sm' : 'bg-premium-card shadow-sm opacity-50'}`}>
                   {task.completed ? (
                     <CheckCircle2 className="w-5 h-5 text-foreground" />
                   ) : (
                     <Circle className="w-5 h-5 text-muted" />
                   )}
                 </div>
                 <div>
                   <p className={`text-xs font-black uppercase tracking-tight ${task.completed ? 'text-foreground' : 'text-muted-text'}`}>
                     {task.title}
                   </p>
                   <p className="text-[9px] font-black text-muted-text uppercase tracking-[0.2em]">
                     {task.current}/{task.target} • <span className="text-accent">{task.xp} XP</span>
                   </p>
                 </div>
               </div>
               {task.completed && (
                 <div className="animate-bounce">
                   <Star className="w-4 h-4 text-accent fill-accent" />
                 </div>
               )}
             </div>
           ))}
         </div>
 
         {/* Footer info */}
         <div className="pt-6 border-t border-border flex items-center justify-between">
             <div className="flex items-center gap-3">
                 <div className="p-2 bg-surface rounded-xl">
                     <Trophy className="w-4 h-4 text-foreground" />
                 </div>
                 <div>
                     <p className="text-[9px] font-black text-muted-text uppercase tracking-widest leading-none mb-1">Total</p>
                     <p className="text-sm font-black text-foreground tracking-tighter">{progress.xp || 0} XP</p>
                 </div>
             </div>
             <div className="flex items-center gap-3">
                 <div className="p-2 bg-surface rounded-xl">
                     <TrendingUp className="w-4 h-4 text-foreground" />
                 </div>
                 <div>
                     <p className="text-[9px] font-black text-muted-text uppercase tracking-widest leading-none mb-1">Weekly</p>
                     <p className="text-sm font-black text-foreground tracking-tighter">{progress.weeklyXp || 0} XP</p>
                 </div>
             </div>
         </div>
       </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Globe, Users, MessageSquare, Zap } from 'lucide-react';

const ACTIVITIES = [
  { message: "Someone just joined from India 🇮🇳", icon: <Globe className="w-4 h-4" /> },
  { message: "New conversation started", icon: <MessageSquare className="w-4 h-4" /> },
  { message: "User from Brazil is online 🇧🇷", icon: <Users className="w-4 h-4" /> },
  { message: "34 people just started practicing", icon: <Zap className="w-4 h-4" /> },
  { message: "Someone joined from Turkey 🇹🇷", icon: <Globe className="w-4 h-4" /> },
  { message: "New peer match in Debate Mode", icon: <Zap className="w-4 h-4" /> },
  { message: "Learner from Spain is practicing 🇪🇸", icon: <Globe className="w-4 h-4" /> },
  { message: "1,240 learners active right now", icon: <Users className="w-4 h-4" /> },
];

export default function LiveActivityWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showInterval = setInterval(() => {
      setIsVisible(true);
      
      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
        // Change to next activity after hiding
        setTimeout(() => {
          setCurrentIdx((prev) => (prev + 1) % ACTIVITIES.length);
        }, 500);
      }, 4000);
      
    }, 8000); // Repeat every 8 seconds

    // Initial show
    const initialTimeout = setTimeout(() => setIsVisible(true), 2000);

    return () => {
      clearInterval(showInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const activity = ACTIVITIES[currentIdx];

  return (
    <div className={`fixed bottom-4 left-0 right-0 z-[100] transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90'} flex justify-center pointer-events-none md:left-auto md:right-8 md:bottom-8 md:block`}>
      <div className="bg-premium-card px-5 py-3 md:px-6 md:py-4 rounded-full md:rounded-3xl shadow-premium flex items-center gap-4 w-auto max-w-[calc(100vw-32px)] md:min-w-[320px] pointer-events-auto">
        <div className="w-10 h-10 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 animate-pulse">
          {activity.icon}
        </div>
        <div className="flex-1">
          <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5 leading-none opacity-50 italic">Live Activity</div>
          <div className="text-[11px] font-black text-foreground leading-tight uppercase tracking-tight">{activity.message}</div>
        </div>
      </div>
    </div>
  );
}

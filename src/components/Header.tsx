'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Users, LogIn, User, LogOut, Mic2, Sparkles, Menu, X, History } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import { useState, useRef, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import AuthModal from '@/components/AuthModal';
import ProfileModal from '@/components/ProfileModal';
import SocialDropdown from '@/components/SocialDropdown';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { liveUsers, currentUser } = useChatContext();
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setShowDropdown(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (pathname === '/chat') return null;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'py-3' : 'py-6 md:py-10'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className={`flex items-center justify-between px-4 md:px-10 py-3 md:py-4 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-700 border group ${isScrolled ? 'bg-white/70 backdrop-blur-3xl border-black/5 shadow-premium-xl translate-y-[-4px]' : 'bg-white/50 backdrop-blur-xl border-white/20 shadow-premium-sm'}`}>
            
            {/* Logo */}
            <div 
              className="flex items-center gap-2 md:gap-3 cursor-pointer group select-none relative" 
              onClick={() => router.push('/')}
            >
              <div className="w-9 h-9 md:w-11 md:h-11 bg-primary rounded-xl flex items-center justify-center shadow-premium group-hover:scale-105 transition-all duration-500 relative z-10">
                <Mic2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-2xl font-black text-foreground tracking-tight italic relative z-10 transition-colors uppercase">
                Norinly<span className="text-primary">.</span>
              </span>
            </div>

            {/* Center Nav - Desktop Only */}
            <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 space-x-4">
              <Link 
                href="/connect" 
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 active:scale-95 shadow-sm border border-black/5 hover:border-black/10 hover:shadow-md ${pathname === '/connect' ? 'bg-primary text-white border-primary shadow-premium' : 'bg-white/80 backdrop-blur-md text-secondary-text hover:text-foreground'}`}
              >
                <Sparkles className="w-4 h-4" />
                Start Speaking
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Live Users Counter - Hidden on Mobile */}
              <div className="hidden md:flex items-center space-x-2 bg-primary/5 px-4 py-2.5 rounded-2xl group transition-all cursor-default border border-primary/10">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-positive-accent"></span>
                </span>
                <span className="text-[9px] font-black text-primary uppercase tracking-widest whitespace-nowrap">
                  {liveUsers.toLocaleString()} <span className="hidden xl:inline">Live Now</span>
                </span>
              </div>

              {currentUser && (
                <div className="hidden md:flex items-center space-x-2">
                  <SocialDropdown />
                  <Link 
                    href="/history" 
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm group border ${pathname === '/history' ? 'bg-primary text-white border-primary shadow-premium' : 'bg-white border-black/5 text-secondary-text hover:bg-black/5 hover:text-foreground'}`}
                    title="History"
                  >
                    <History className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Profile / Auth - Desktop Only */}
              <div className="hidden md:block">
                {currentUser ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="relative group flex items-center justify-center w-11 h-11 rounded-2xl border border-black/5 overflow-hidden hover:border-accent/30 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-premium"
                    >
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white flex items-center justify-center">
                          <User className="w-6 h-6 text-secondary-text group-hover:text-accent transition-colors" />
                        </div>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute top-16 right-0 w-72 bg-white/90 backdrop-blur-3xl border border-black/5 rounded-[2rem] shadow-premium-xl py-4 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300">
                        <div className="px-6 py-5 border-b border-black/5 mb-3">
                          <p className="text-lg font-black text-foreground tracking-tight truncate leading-tight mb-1">{currentUser.displayName || 'Learner'}</p>
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest truncate">{currentUser.email}</p>
                        </div>
                        <div className="px-3 space-y-1">
                          <Link
                            href="/profile"
                            onClick={() => setShowDropdown(false)}
                            className="w-full text-left px-5 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 hover:bg-black/5 hover:text-foreground rounded-2xl transition-all flex items-center space-x-4 group"
                          >
                            <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                              <User className="w-4 h-4" />
                            </div>
                            <span>My Profile</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-5 py-4 text-xs font-black uppercase tracking-widest text-secondary hover:bg-secondary/5 rounded-2xl transition-all flex items-center space-x-4 group"
                          >
                             <div className="w-8 h-8 rounded-xl bg-secondary/5 flex items-center justify-center group-hover:bg-secondary transition-colors group-hover:text-white">
                               <LogOut className="w-4 h-4" />
                             </div>
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openAuth('login')}
                    className="px-8 py-3.5 bg-black text-white font-black rounded-2xl transition-all hover:bg-accent active:scale-95 text-[10px] uppercase tracking-[0.2em] shadow-premium relative overflow-hidden group"
                  >
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${isMobileMenuOpen ? 'bg-accent border-accent text-white scale-90' : 'bg-surface border-border text-secondary'}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 bg-white/95 backdrop-blur-3xl border border-black/5 rounded-[2rem] p-4 shadow-premium-xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-3">
                {/* Profile Section for Mobile if Logged In */}
                {currentUser ? (
                  <div className="px-2 py-4 mb-2 flex items-center gap-4 border-b border-black/5">
                    <div className="w-12 h-12 rounded-2xl border border-black/5 overflow-hidden shadow-premium flex-shrink-0">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-accent/5 flex items-center justify-center text-accent">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-foreground truncate tracking-tight">{currentUser.displayName || 'Learner'}</p>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate">{currentUser.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 mb-4">
                    <button
                      onClick={() => openAuth('login')}
                      className="w-full py-5 bg-foreground text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-premium flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      <LogIn className="w-5 h-5" />
                      Sign In Now
                    </button>
                  </div>
                )}

                <Link 
                  href="/connect" 
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-black/5 hover:bg-black/10 text-foreground font-black uppercase text-[10px] tracking-widest transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  Start Speaking
                </Link>

                {currentUser && (
                  <>
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-black/5 hover:bg-black/10 text-foreground font-black uppercase text-[10px] tracking-widest transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-5 h-5" />
                      </div>
                      My Profile
                    </Link>
                    <Link 
                      href="/history" 
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-black/5 hover:bg-black/10 text-foreground font-black uppercase text-[10px] tracking-widest transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <History className="w-5 h-5" />
                      </div>
                      Session History
                    </Link>
                    
                    <hr className="border-black/5 mx-2 my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-secondary/5 text-secondary hover:bg-secondary hover:text-white font-black uppercase text-[10px] tracking-widest transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary">
                        <LogOut className="w-5 h-5" />
                      </div>
                      Log Out
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}


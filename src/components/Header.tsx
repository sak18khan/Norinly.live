'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, LogIn, User, LogOut } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import { useState, useRef, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import AuthModal from '@/components/AuthModal';
import ProfileModal from '@/components/ProfileModal';
import HeaderFriendsList from '@/components/HeaderFriendsList';

export default function Header() {
  const router = useRouter();
  const { liveUsers, currentUser } = useChatContext();
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setShowDropdown(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <header className="w-full bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold tracking-tight cursor-pointer select-none text-foreground shrink-0" onClick={() => router.push('/')}>
            Norinly<span className="text-accent">.</span>
          </div>

        {/* Right Side Nav */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {currentUser && (
              <Link href="/history" className="text-sm font-semibold text-secondary hover:text-accent transition-colors">History</Link>
            )}

            {/* Live Users Counter */}
            <div className="flex items-center space-x-2 bg-surface border border-border px-3 py-1.5 md:px-4 md:py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-positive-accent animate-pulse" />
              <Users className="w-4 h-4 text-muted" />
              <span className="text-xs md:text-sm font-semibold text-secondary">
                {liveUsers.toLocaleString()} <span className="hidden md:inline">learners online</span>
              </span>
            </div>

          {/* Auth Button or Avatar */}
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <HeaderFriendsList />
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative group flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl border border-border overflow-hidden hover:border-accent transition-all hover:scale-105 active:scale-95 shrink-0 shadow-sm"
                    title={currentUser.displayName || 'Profile'}
                  >
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surface flex items-center justify-center">
                        <User className="w-5 h-5 text-accent" />
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-positive-accent rounded-full border-2 border-white" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-12 right-0 w-56 bg-white border border-border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-border mb-1">
                        <p className="text-sm font-bold text-foreground truncate">{currentUser.displayName || 'Learner'}</p>
                        <p className="text-xs text-muted truncate">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfile(true);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-surface hover:text-accent transition-colors flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50/50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 text-sm shadow-md shadow-accent/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} initialMode={authMode} />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}

'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start space-y-2">
            <div className="text-xl font-bold tracking-tight text-foreground">
              Norinly<span className="text-accent">.</span>
            </div>
            <p className="text-xs md:text-sm text-secondary">© 2026 Norinly. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-4 order-1 md:order-2">
            <div className="flex items-center flex-wrap justify-center gap-4 md:gap-6 font-semibold text-xs text-secondary">
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
              <Link href="/community-guidelines" className="hover:text-accent transition-colors">Guidelines</Link>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 font-medium text-[10px] text-muted max-w-xl md:text-right">
              <Link href="/practice-english-speaking" className="hover:text-accent transition-colors">Practice English Speaking</Link>
              <Link href="/talk-to-english-speakers" className="hover:text-accent transition-colors">Talk to English Speakers</Link>
              <Link href="/practice-english-online" className="hover:text-accent transition-colors">Practice English Online</Link>
              <Link href="/free-english-speaking-practice" className="hover:text-accent transition-colors">Free English Practice</Link>
              <Link href="/practice-english-with-strangers" className="hover:text-accent transition-colors">Practice With Strangers</Link>
              <Link href="/english-conversation-practice" className="hover:text-accent transition-colors">Conversation Practice</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Norinly Community Guidelines',
  description: 'Norinly is a platform for people around the world to practice speaking English in a respectful learning environment.',
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-background text-zinc-300 selection:bg-accent/30 selection:text-white flex flex-col">
      {/* Small Header for Legal Pages */}
      <header className="p-6 border-b border-border mb-12 shrink-0">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tighter text-white">
            NORINLY<span className="text-accent">.</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">Back to Home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 leading-relaxed flex-1">
        <h1 className="text-4xl font-black text-white mb-8 tracking-tighter">Norinly Community Guidelines</h1>
        
        <p className="text-lg text-zinc-400 mb-10">
          Norinly is a platform for people around the world to practice speaking English in a respectful learning environment. Please follow these rules to ensure a positive experience for everyone.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Respect other learners</h2>
          <p>
            Treat every person you encounter with respect. Diversity makes our community better. Respect personal boundaries and don't make others feel uncomfortable.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Use conversations for practicing English</h2>
          <p>
            The primary purpose of Norinly is English language practice. Please focus your conversations on practicing English and helping others improve.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Do not use abusive or offensive language</h2>
          <p>
            Norinly has zero tolerance for bullying, threats, harassment, or hate speech. Targeting individuals or groups based on their identity is strictly prohibited.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Avoid inappropriate content</h2>
          <p>
            Illegal activity or explicit sexual behavior is prohibited on Norinly. Sharing or engaging in such content will result in an immediate and permanent ban.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Be patient with beginners learning English</h2>
          <p>
            Everyone is at a different stage in their learning journey. Be patient, supportive, and encouraging to those who are just starting out.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Report users who violate guidelines</h2>
          <p>
            Help us keep Norinly safe. If you encounter someone violating these guidelines, use the report feature immediately. Our moderation team reviews reports to take appropriate action.
          </p>
        </section>

        <div className="mt-16 p-8 bg-surface rounded-3xl border border-border text-center">
          <p className="text-white font-bold italic">
            "Norinly is a platform for people around the world to practice speaking English in a respectful learning environment."
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

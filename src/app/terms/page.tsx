import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Norinly Terms of Service',
  description: 'Terms of Service for Norinly online English speaking practice platform.',
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-black text-white mb-8 tracking-tighter">Terms of Service</h1>
        
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Introduction</h2>
          <p>
            Welcome to Norinly. Norinly is an online English speaking practice platform designed to connect users with English learners and speakers around the world for spontaneous conversations. By using our service, you agree to these terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">User Responsibilities</h2>
          <p className="mb-4">As a user of Norinly, you agree to behave respectfully. You must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Harass, bully, or threaten other users.</li>
            <li>Share illegal, explicit, or harmful content.</li>
            <li>Impersonate any person or entity.</li>
            <li>Engaging in abusive behavior or hate speech.</li>
            <li>Spam the platform or exploit its features for commercial purposes.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Anonymous Interaction Notice</h2>
          <p>
            Norinly facilitates conversations between strangers. You understand that Norinly cannot guarantee the behavior or identity of other users. Use caution when sharing information and interact at your own risk.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Account and Moderation</h2>
          <p>
            Norinly reserves the right to suspend or block users who violate these terms or the Community Guidelines at our sole discretion, without prior notice.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Limitation of Liability</h2>
          <p>
            Norinly provides the platform "as-is" and is not responsible for user-generated behavior, conversations, or any damages resulting from your use of the service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Changes to Terms</h2>
          <p>
            We may update these Terms of Service at any time. Your continued use of the platform after changes are posted constitutes your acceptance of the new terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
          <p>
            If you have questions about these terms, please contact us at: <br />
            <a href="mailto:support@norinly.live" className="text-accent hover:underline">support@norinly.live</a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

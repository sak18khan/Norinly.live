import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Norinly Privacy Policy',
  description: 'Privacy Policy for Norinly online English speaking practice platform.',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-black text-white mb-8 tracking-tighter">Privacy Policy</h1>
        
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Information Collected</h2>
          <p className="mb-4">Norinly may collect the following information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Basic account data (such as email if you choose to sign up).</li>
            <li>Profile information provided by you.</li>
            <li>Usage analytics to improve our service.</li>
            <li>Technical connection information (IP address, device type) for security and functionality.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">How Data Is Used</h2>
          <p className="mb-4">We use your data for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining and improving platform functionality.</li>
            <li>Preventing abuse and ensuring user safety.</li>
            <li>Analyzing trends to enhance user experience.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">No Recording Policy</h2>
          <p>
            Your privacy is paramount. Norinly does not record your voice conversations by default. Interactions are intended to be ephemeral and private between participants.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Third-Party Services</h2>
          <p className="mb-4">We may use third-party services to provide the platform, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Firebase for authentication and database services.</li>
            <li>Analytics tools to understand platform usage.</li>
            <li>Cloud infrastructure for hosting and scaling.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Cookies</h2>
          <p>
            We use cookies and local storage to manage your login sessions, remember preferences, and ensure the platform works correctly. You can manage cookie settings in your browser.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">User Rights</h2>
          <p>
            You have the right to access your data and request account deletion. To delete your account and associated data, please use the settings in your profile or contact support.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Data Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect your data from unauthorized access, loss, or misuse. However, no internet-based service is 100% secure.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
          <p>
            If you have questions about your privacy, please contact us at: <br />
            <a href="mailto:support@norinly.live" className="text-accent hover:underline">support@norinly.live</a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

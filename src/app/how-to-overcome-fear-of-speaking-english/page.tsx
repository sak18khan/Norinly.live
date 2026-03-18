'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function OvercomeFearPage() {
    return (
        <SEOLandingPage
            slug="/how-to-overcome-fear-of-speaking-english"
            title="How to Overcome Fear of Speaking English"
            heroHighlight="Speak Without Fear"
            description="Don't let anxiety hold back your fluency. Learn proven strategies and practice speaking with a supportive community on Norinly."
            contentTitle="Overcome the Psychological Barrier to Fluency"
            contentParagraph="Is your English good in your head but not in your mouth? You are not alone. 'Foreign Language Anxiety' is the biggest hurdle for learners. Norinly helps you break this cycle by providing an anonymous, low-stakes environment. Without the fear of real-world judgment, your brain finally relaxes, allowing you to speak more naturally and confidently."
            faqs={[
                { q: "Why am I afraid to speak English?", a: "It is often the fear of negative evaluation or making mistakes. Our anonymous platform helps eliminate this fear." },
                { q: "How can I start speaking if I'm shy?", a: "Start with short, casual chats. On Norinly, you don't use your real name, which often makes it easier to open up." },
                { q: "Will I find supportive partners?", a: "Yes. Our community is built on mutual learning, so most users are very patient and encouraging." },
                { q: "What should I do if I forget a word?", a: "Just describe it or use a simpler word. Communication is about being understood, not about perfection." }
            ]}
        />
    );
}

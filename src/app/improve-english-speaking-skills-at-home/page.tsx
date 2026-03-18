'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function ImproveSpeakingAtHomePage() {
    return (
        <SEOLandingPage
            slug="/improve-english-speaking-skills-at-home"
            title="Improve English Speaking Skills at Home"
            heroHighlight="Without a Tutor"
            description="You don't need to travel to learn English. Practice speaking from the comfort of your home with real conversation partners on Norinly."
            contentTitle="Your Personalized English Speaking Club at Home"
            contentParagraph="Bringing the world to your living room. Norinly makes it easy to maintain a daily speaking habit without the high cost of private tutors. By engaging in diverse conversations every day, you naturally pick up vocabulary, improve your accent, and overcome the hesitation that stops most learners from becoming fluent."
            faqs={[
                { q: "Can I practice English speaking at home for free?", a: "Yes! Norinly allows you to connect with global speakers from home at any time, absolutely free." },
                { q: "How much time should I practice daily?", a: "Even 15-30 minutes of daily conversation can lead to significant improvements in your fluency within a month." },
                { q: "Is it better than watching English movies?", a: "Watching movies helps with listening, but speaking is a separate skill. Active conversation is essential for speaking mastery." },
                { q: "What topics can I talk about?", a: "Anything! From hobbies and travel to professional topics and daily life." }
            ]}
        />
    );
}

'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function TalkToStrangersPage() {
    return (
        <SEOLandingPage
            slug="/talk-to-strangers-to-learn-english"
            title="Talk to Strangers to Learn English"
            heroHighlight="Safely & Anonymously"
            description="The best way to overcome social anxiety in a new language is by talking to new people. Connect with strangers securely on Norinly."
            contentTitle="The Power of Anonymous Conversation"
            contentParagraph="Talking to strangers removes the fear of 'looking stupid' in front of people you know. At Norinly, we leverage this psychological advantage to help you speak more freely. Our platform matches you with other learners and speakers who are there for the same reason: to practice and improve together in a respectful, anonymous environment."
            faqs={[
                { q: "Is it safe to talk to strangers on Norinly?", a: "Yes. We focus on voice-only communication and have strict community guidelines to ensure a safe learning environment." },
                { q: "Why talk to strangers instead of friends?", a: "Strangers challenge you with different accents and vocabulary, which is more effective for real-world fluency." },
                { q: "What if the other person is also a learner?", a: "That's great! You can learn from each other's mistakes and build confidence together without pressure." },
                { q: "Can I report inappropriate behavior?", a: "Yes, we have an instant reporting system to keep the community clean and focused on learning." }
            ]}
        />
    );
}

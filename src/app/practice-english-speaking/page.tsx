'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function PracticeEnglishSpeaking() {
    return (
        <SEOLandingPage
            slug="/practice-english-speaking"
            title="Practice English Speaking"
            heroHighlight="With Real People"
            description="Norinly connects you with global learners for real-time English speaking practice. Improve your fluency, build confidence, and speak like a pro."
            contentTitle="Master Your English Fluency Through Conversation"
            contentParagraph="Traditional learning methods often miss the most critical element: real conversation. Norinly bridges this gap by providing a platform where you can practice speaking English with real people instantly. Whether you want to improve your pronunciation, expand your vocabulary, or just get comfortable speaking, our community is here to help you reach your goals."
            faqs={[
                { q: "Is Norinly really free?", a: "Yes! Norinly is completely free for language learners to practice speaking English." },
                { q: "What is the best way to practice speaking English?", a: "The most effective way is by speaking as much as possible with different people. Norinly makes this easy by matching you with partners instantly." },
                { q: "Can beginners practice here?", a: "Absolutely. Our community is supportive, and you can find partners at various levels, including other beginners." },
                { q: "Is it safe and anonymous?", a: "Yes. Norinly is voice-only and you don't need to share any personal information to start talking." }
            ]}
        />
    );
}

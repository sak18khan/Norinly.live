'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function AnonymousChatRoomsPage() {
    return (
        <SEOLandingPage
            slug="/anonymous-english-chat-rooms"
            title="Anonymous English Chat Rooms"
            heroHighlight="Talk Freely"
            description="Experience a new way to learn English. Join our anonymous chat rooms and speak with learners and native speakers without judgment."
            contentTitle="The Ultimate Safe Space for English Practice"
            contentParagraph="Anonymous chat rooms are not just for fun—they are powerful tools for language discovery. By removing social identities, learners feel bold enough to try new slang, complex sentences, and different tones. Norinly's rooms are designed to be respectful, focused, and incredibly effective for anyone looking to level up their spoken English."
            faqs={[
                { q: "Do I need to create an account?", a: "You can start as a guest to experience the anonymity first, then sign up to save your progress." },
                { q: "Are the chat rooms moderated?", a: "Yes. We have real-time monitoring to ensure the rooms remain helpful and safe for language learners." },
                { q: "Can I choose who I talk to?", a: "Our algorithm matches you instantly with available speakers based on your selected mode." },
                { q: "Is there a limit on chat time?", a: "No! You can practice for as long as you want, any time of the day." }
            ]}
        />
    );
}

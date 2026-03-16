'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function PracticeEnglishWithStrangers() {
    return (
        <SEOLandingPage
            slug="/practice-english-with-strangers"
            title="Practice English"
            heroHighlight="With Strangers & Peers"
            description="Break free from your local routine and practice English with people from around the world. Spontaneous, real-time voice chat for learners."
            contentTitle="Why Practice With Strangers?"
            contentParagraph="Speaking with someone you don't know is the ultimate test of your language skills. It forces you to rely on your conversational abilities, adapt to different accents, and think on your feet. Norinly provides a safe, anonymous platform where you can challenge yourself and grow your confidence through spontaneous English conversations."
            faqs={[
                { q: "Is it safe to talk to strangers?", a: "Yes, Norinly is designed for safety. It's voice-only, anonymous, and we have active moderation to ensure a respectful learning environment." },
                { q: "What if I don't know what to say?", a: "Don't worry! We provide floating topic prompts and conversation starters in the chat to help keep the dialogue flowing." },
                { q: "How many strangers can I talk to?", a: "There's no limit. You can match with as many partners as you like, 24/7." },
                { q: "Can I make friends on Norinly?", a: "Yes! If you have a great conversation, you can send a friend request and connect with that partner again in the future." }
            ]}
        />
    );
}

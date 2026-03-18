'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function FreeEnglishConversationPage() {
    return (
        <SEOLandingPage
            slug="/free-english-conversation-practice-online"
            title="Free English Conversation Practice Online"
            heroHighlight="With Global Partners"
            description="Master English fluency through real-time conversations. Norinly connects you with language learners worldwide for instant, free speaking practice."
            contentTitle="The Most Effective Way to Speak English Fluently"
            contentParagraph="Stop studying grammar in isolation and start using it in conversation. Norinly provides a judgment-free environment where you can practice speaking English with real people from over 100 countries. Whether you are preparing for a job interview, an exam, or just want to make friends, our platform is the perfect place to build your confidence."
            faqs={[
                { q: "Is this really free?", a: "Yes, Norinly is 100% free. You can start practicing English conversation online without any subscription or hidden fees." },
                { q: "How do I find a speaking partner?", a: "Simply click 'Start Practicing' and we will match you with a live speaking partner in seconds. No scheduling required." },
                { q: "Is it safe for beginners?", a: "Absolutely! Our community is very supportive of learners at all levels, including complete beginners." },
                { q: "Do I need a webcam?", a: "No. Norinly is focused on voice and text chat to ensure privacy and focus on speaking skills." }
            ]}
        />
    );
}

'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function DailyTopicsPage() {
    return (
        <SEOLandingPage
            slug="/daily-english-speaking-topics-for-practice"
            title="Daily English Speaking Topics"
            heroHighlight="Never Run Out of Ideas"
            description="Struggling to find things to talk about? Norinly provides daily prompts and topics to keep your conversations fresh and engaging."
            contentTitle="Fuel Your Conversation with Interesting Topics"
            contentParagraph="Running out of things to say is a common problem for learners. We help solve this by providing diverse topics ranging from technology and travel to ethics and future trends. These prompts encourage you to use new vocabulary and think critically in English, making every session a unique learning experience."
            faqs={[
                { q: "Does Norinly provide daily topics?", a: "Yes! We have built-in prompts and suggestions to help you start and maintain engaging conversations." },
                { q: "Can I choose my own topics?", a: "Of course! You are free to talk about whatever you like with your speaking partners." },
                { q: "Are the topics suitable for all levels?", a: "Yes, we categorize topics from simple everyday life to more complex societal issues." },
                { q: "How often are topics updated?", a: "We regularly refresh our suggestion engine to reflect current events and trending interests." }
            ]}
        />
    );
}

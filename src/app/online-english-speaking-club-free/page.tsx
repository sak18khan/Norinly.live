'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function EnglishSpeakingClubPage() {
    return (
        <SEOLandingPage
            slug="/online-english-speaking-club-free"
            title="Online English Speaking Club"
            heroHighlight="Always Open"
            description="Join a global community of 50,000+ English learners. Our virtual speaking club is free, instant, and available 24/7."
            contentTitle="Join the World's Largest Speaking Community"
            contentParagraph="Finding a consistent speaking club can be hard. Norinly solves this by being a 'perpetual' speaking club. Whenever you have 5 minutes, you can log in and find someone to chat with. No memberships, no schedules, just pure practice whenever it fits into your day."
            faqs={[
                { q: "Is there a level requirement to join?", a: "No. Our club includes learners from A1 to C2 levels. You will find matches that suit your proficiency." },
                { q: "Are there native speakers in the club?", a: "Yes, many native speakers join to help others or to engage in cultural exchange." },
                { q: "How do I become a regular member?", a: "Simply sign up for free to track your progress, earn XP, and become part of our regular community." },
                { q: "Can I host a group discussion?", a: "Currently, we focus on 1-on-1 sessions to maximize speaking time for every participant." }
            ]}
        />
    );
}

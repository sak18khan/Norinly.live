'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function IELTSPracticePage() {
    return (
        <SEOLandingPage
            slug="/english-speaking-practice-for-ielts"
            title="English Speaking Practice for IELTS"
            heroHighlight="Score 7.0+ Higher"
            description="Boost your IELTS speaking score with real conversation practice. Simulate the test experience and build fluency on Norinly."
            contentTitle="Master the IELTS Speaking Test"
            contentParagraph="Preparing for IELTS? The speaking section is all about fluency, vocabulary, and grammar in action. Norinly provides the perfect training ground to practice these skills. Engage in our 'Debate' mode to practice Part 3 questions or use 'Casual' mode to improve your Part 1 responses. Hear yourself speak and get comfortable thinking on your feet."
            faqs={[
                { q: "How does Norinly help with IELTS?", a: "It improves your spontaneous speaking ability and helps you practice articulating complex ideas, which is key for a high score." },
                { q: "Can I find other IELTS students here?", a: "Yes! Use it as a platform to find partners who are also preparing for exams for mutual study." },
                { q: "Should I focus on grammar or fluency for IELTS?", a: "Both are important, but fluency and coherence carry a lot of weight. Norinly helps you develop a natural flow." },
                { q: "Is 'Debate' mode good for IELTS Part 3?", a: "Absolutely. It forces you to defend an opinion and use more academic vocabulary, just like in the real test." }
            ]}
        />
    );
}

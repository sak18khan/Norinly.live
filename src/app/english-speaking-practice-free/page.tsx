'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function EnglishSpeakingPracticeFree() {
    return (
        <SEOLandingPage
            slug="/english-speaking-practice-free"
            title="English Speaking Practice"
            heroHighlight="100% Free Forever"
            description="Improve your English speaking skills without spending a dime. Join the world's most accessible free English practice platform."
            contentTitle="High-Quality Practice, Zero Cost"
            contentParagraph="We believe that language learning should be accessible to everyone. That's why Norinly offers high-quality English speaking practice for free. No expensive tutors, no subscription fees—just real people practicing together. Our platform uses modern WebRTC technology to give you crystal clear voice connections for the best possible practice experience."
            faqs={[
                { q: "Is Norinly really free?", a: "Yes, all our core features, including casual practice and debate mode, are completely free." },
                { q: "How can it be free?", a: "We are supported by a community of passionate learners and maintain low overhead to keep the platform accessible for everyone." },
                { q: "Are there any hidden charges?", a: "None. You can register, match, and talk as much as you want without ever entering a credit card." },
                { q: "Can I use it to prepare for IELTS/TOEFL?", a: "Yes! Many of our users use the platform to practice their speaking fluency for standardized English exams." }
            ]}
        />
    );
}

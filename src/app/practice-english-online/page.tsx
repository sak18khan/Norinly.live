'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function PracticeEnglishOnline() {
    return (
        <SEOLandingPage
            slug="/practice-english-online"
            title="Practice English Online"
            heroHighlight="Anytime, Anywhere"
            description="The most convenient platform for online English speaking practice. Join a global community of learners and speakers today."
            contentTitle="Your 24/7 English Conversation Club"
            contentParagraph="Why wait for a class when you can practice right now? Norinly provides an instant, online environment for English speaking practice. Whether you're on your lunch break or winding down for the day, there's always someone ready to talk. Our platform is optimized for browser use, so you can practice on your phone or computer with no downloads required."
            faqs={[
                { q: "Is Norinly available on mobile?", a: "Yes! Norinly works perfectly on all mobile browsers, so you can practice on the go." },
                { q: "Do I need to download any software?", a: "No downloads required. You can start practicing directly in your browser." },
                { q: "How many people use Norinly?", a: "We have a growing community of thousands of users from all over the world." },
                { q: "Can I choose my conversation partner?", a: "To keep things instant and fair, matching is random, but you can always skip to the next partner if needed." }
            ]}
        />
    );
}

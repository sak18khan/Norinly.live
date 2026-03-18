'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function NativeSpeakersChatPage() {
    return (
        <SEOLandingPage
            slug="/native-english-speakers-chat-free"
            title="Native English Speakers Chat Free"
            heroHighlight="Real Cultural Exchange"
            description="Want to learn real, spoken English? Connect with native speakers and advanced learners for a truly immersive experience."
            contentTitle="Go Beyond Textbook English"
            contentParagraph="Textbooks often teach you formal English that sounds unnatural in real life. By talking to native speakers and advanced learners, you pick up the rhythm, idioms, and nuances of the language. Norinly facilitates these connections for free, enabling a global exchange of knowledge and culture that helps you sound more like a native."
            faqs={[
                { q: "Are there really native speakers on Norinly?", a: "Yes! Many native speakers join for cultural exchange or to help learners from different backgrounds." },
                { q: "How can I tell if someone is a native speaker?", a: "Often you can tell by their accent and use of slang, but the focus is always on mutual communication." },
                { q: "Is it okay to ask for help with pronunciation?", a: "Absolutely. Most speakers are more than happy to help you with specific words if you ask." },
                { q: "What is the best time to find native speakers?", a: "Since we are global, you can find speakers from different time zones 24/7." }
            ]}
        />
    );
}

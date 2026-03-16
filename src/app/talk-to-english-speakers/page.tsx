'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function TalkToEnglishSpeakers() {
    return (
        <SEOLandingPage
            slug="/talk-to-english-speakers"
            title="Talk to English Speakers"
            heroHighlight="Globally, Every Day"
            description="Connect with fluent English speakers and fellow learners worldwide. Break your speaking barriers and gain confidence through real-world talk."
            contentTitle="The Fast Track to English Fluency"
            contentParagraph="Stop learning English and start living it. Talking to English speakers is the fastest way to internalize grammar, pick up natural idioms, and improve your listening skills. Norinly provides a dedicated space where you can find conversation partners instantly, allowing you to practice in a low-pressure, high-reward environment."
            faqs={[
                { q: "Who can I talk to on Norinly?", a: "You can talk to English learners and fluent speakers from every corner of the globe." },
                { q: "Do I need to be fluent to start?", a: "Not at all. Norinly is for all levels. Whether you're just starting out or looking to perfect your accent, you'll find someone to talk to." },
                { q: "What should I talk about?", a: "Anything! You can choose Casual mode for everyday talk or Debate mode for more structured practice. We also provide conversation prompts to keep things moving." },
                { q: "How long are the sessions?", a: "Each session has a 5-minute timer to encourage focused practice, but you can always stay longer or find a new partner instantly." }
            ]}
        />
    );
}

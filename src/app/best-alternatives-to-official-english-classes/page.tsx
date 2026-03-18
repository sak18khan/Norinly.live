'use client';

import SEOLandingPage from '@/components/SEOLandingPage';

export default function EnglishClassAlternativePage() {
    return (
        <SEOLandingPage
            slug="/best-alternatives-to-official-english-classes"
            title="Best Alternatives to English Classes"
            heroHighlight="Learn by Doing"
            description="Tired of expensive courses and textbooks? Experience a more natural way to learn English through immersive conversation."
            contentTitle="Why Traditional Classes Often Fail"
            contentParagraph="Most English classes spend 90% of the time on theory and only 10% on speaking. Norinly flips the script. We provide the practical immersion you need to turn your knowledge into fluency. It is the perfect companion—or alternative—to traditional learning, focusing on the skill that matters most: speaking."
            faqs={[
                { q: "Is this better than a language school?", a: "It is different. Language schools teach you 'about' English; Norinly helps you 'speak' English. Many users use both." },
                { q: "Is Norinly really a free alternative?", a: "Yes. While schools cost hundreds of dollars, Norinly provides unlimited speaking time for free." },
                { q: "Can I learn grammar here?", a: "You learn 'natural' grammar by hearing how others speak, which is often more effective than memorizing rules." },
                { q: "How fast will I see results?", a: "Most users report a significant boost in speaking confidence after just one week of daily sessions." }
            ]}
        />
    );
}

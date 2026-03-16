import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages, goal, difficulty, topic } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ text: "I'm sorry, but my AI services are currently unavailable. Please check the API key configuration." }, { status: 500 });
        }

        const systemPrompts: Record<string, string> = {
            casual: `You are a friendly English conversation partner. Use ${difficulty} level English. Keep your responses short and engaging to encourage the user to speak more. Goal: Casual conversation about ${topic}.`,
            interview: `You are a professional HR manager interviewing the user for a job related to ${topic}. Use ${difficulty} level English. Ask one question at a time. Be professional but encouraging.`,
            business: `You are a colleague in a business meeting discussing ${topic}. Use ${difficulty} level English. Use professional terminology appropriately for the level.`,
            debate: `You are debating the user on the topic of ${topic}. Take an opposing view and challenge their arguments respectfully using ${difficulty} level English.`,
            pronunciation: `You are an English pronunciation coach. Give the user a short sentence related to ${topic} to read, then provide brief encouragement. Use ${difficulty} level vocabulary.`,
            travel: `You are a travel assistant or local person helping the user with ${topic} in a travel scenario. Use ${difficulty} level English. Roleplay naturally.`,
        };

        const systemPrompt = systemPrompts[goal] || systemPrompts.casual;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Fast and cost-effective
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.map((m: any) => ({
                        role: m.role === 'ai' ? 'assistant' : 'user',
                        content: m.text
                    }))
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('OpenAI API Error:', data.error);
            return NextResponse.json({ text: "I encountered an error while thinking. Let's try again!" }, { status: 500 });
        }

        const aiText = data.choices[0].message.content;
        return NextResponse.json({ text: aiText });
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ text: "Something went wrong. Please try again." }, { status: 500 });
    }
}

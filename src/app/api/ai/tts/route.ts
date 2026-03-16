import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text, voice = 'onyx' } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return new NextResponse("API key missing", { status: 500 });
        }

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: voice, // alloy, echo, fable, onyx, nova, shimmer
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('TTS API error:', error);
            return new NextResponse("TTS failed", { status: 500 });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buffer.length.toString(),
            }
        });
    } catch (error) {
        console.error('Error in TTS route:', error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

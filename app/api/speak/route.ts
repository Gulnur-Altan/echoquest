
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const voiceId = process.env.ELEVENLABS_VOICE_ID;

        if (!apiKey || !voiceId) {
            return NextResponse.json(
                { error: "ElevenLabs environment variables are missing." },
                { status: 500 }
            );
        }

        const body = await request.json();
        const text = body.text;

        if (
            typeof text !== "string" ||
            text.trim().length === 0 ||
            text.length > 500
        ) {
            return NextResponse.json(
                { error: "Please provide text between 1 and 500 characters." },
                { status: 400 }
            );
        }

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: text.trim(),
                    model_id: "eleven_multilingual_v2",
                }),
            }
        );

        // if (!response.ok) {
        //     console.error("ElevenLabs returned status:", response.status);

        //     return NextResponse.json(
        //         {
        //             error:
        //                 "Speech generation failed. Check your ElevenLabs account and settings.",
        //         },
        //         { status: 502 }
        //     );
        // }

        if (!response.ok) {
            const errorDetails = await response.text();

            console.error(
                "ElevenLabs error:",
                response.status,
                errorDetails
            );

            return NextResponse.json(
                {
                    error: `ElevenLabs error (${response.status}). Check the terminal.`,
                },
                { status: 502 }
            );
        }


        const audio = await response.arrayBuffer();

        return new Response(audio, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Speech route error:", error);

        return NextResponse.json(
            { error: "Could not generate speech." },
            { status: 500 }
        );
    }
}

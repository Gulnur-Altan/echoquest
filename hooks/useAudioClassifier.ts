"use client";

import { useEffect, useRef, useState } from "react";
import { pipeline } from "@huggingface/transformers";
import {
    getBestNatureMatch,
    type Prediction,
} from "../lib/nature";
import type { Discovery } from "../lib/types";

const MODEL = "Xenova/ast-finetuned-audioset-10-10-0.4593";

type AudioClassifierOptions = {
    onDiscovery: (discovery: Discovery) => void;
};

export function useAudioClassifier({
    onDiscovery,
}: AudioClassifierOptions) {
    const [status, setStatus] = useState("Ready to explore");
    const [recording, setRecording] = useState(false);
    const [busy, setBusy] = useState(false);
    const [results, setResults] = useState<Prediction[]>([]);
    const [audioUrl, setAudioUrl] = useState("");

    const recorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    useEffect(() => {
        return () => {
            if (recorder.current?.state === "recording") {
                recorder.current.stop();
            }

            streamRef.current?.getTracks().forEach((track) => track.stop());
        };

    }, []);

    async function startRecording() {
        try {
            setResults([]);
            setStatus("Listening to nature...");

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            streamRef.current = stream;
            chunks.current = [];

            const mediaRecorder = new MediaRecorder(stream);
            recorder.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks.current, {
                    type: mediaRecorder.mimeType,
                });

                setAudioUrl(URL.createObjectURL(blob));

                stream.getTracks().forEach((track) => track.stop());
                streamRef.current = null;

                setStatus("Recording ready. Analyze your discovery!");
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            setStatus("Microphone access failed. Please allow microphone access.");
            console.error(error);
        }

    }

    function stopRecording() {
        if (recorder.current?.state === "recording") {
            recorder.current.stop();
            setRecording(false);
        }
    }

    async function analyzeSound() {
        if (!audioUrl || busy) return;

        setBusy(true);
        setResults([]);

        let audioContext: AudioContext | null = null;

        try {
            setStatus("Loading AI model... First load may take a while.");

            const classifier = await pipeline("audio-classification", MODEL, {
                dtype: "q8",
            });

            setStatus("AI is listening to your recording...");

            const response = await fetch(audioUrl);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();

            audioContext = new AudioContext();
            const decoded = await audioContext.decodeAudioData(arrayBuffer);

            // AST expects audio sampled at 16 kHz.
            const targetRate = 16000;
            const frameCount = Math.ceil(decoded.duration * targetRate);

            const offline = new OfflineAudioContext(
                1,
                frameCount,
                targetRate
            );

            const source = offline.createBufferSource();
            source.buffer = decoded;
            source.connect(offline.destination);
            source.start();

            const resampled = await offline.startRendering();
            const audioData = resampled.getChannelData(0);

            const predictions = (await classifier(audioData, {
                sampling_rate: targetRate,
                top_k: 5,
            })) as Prediction[];

            setResults(predictions);

            const natureMatch = getBestNatureMatch(predictions);

            if (natureMatch) {
                onDiscovery({
                    label: natureMatch.insight.category,
                    score: natureMatch.prediction.score,
                    points: natureMatch.insight.points,
                    time: new Date().toLocaleTimeString(),
                });
            }

            setStatus("Discovery complete!");
        } catch (error) {
            console.error(error);
            setStatus(
                "Could not analyze this recording. Try a shorter recording or reload the page."
            );
        } finally {
            if (audioContext && audioContext.state !== "closed") {
                await audioContext.close();
            }

            setBusy(false);
        }

    }

    return {
        status,
        recording,
        busy,
        results,
        audioUrl,
        startRecording,
        stopRecording,
        analyzeSound,
    };
}
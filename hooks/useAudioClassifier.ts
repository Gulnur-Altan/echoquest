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
    const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );

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
        if (recordingTimerRef.current !== null) {
            clearTimeout(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }

        try {
            setResults([]);
            setStatus("Requesting microphone access...");

            if (!navigator.mediaDevices?.getUserMedia) {
                setStatus(
                    "Microphone access is unavailable. Please use HTTPS or localhost."
                );
                setRecording(false);
                return;
            }

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
                setRecording(false);

                if (recordingTimerRef.current !== null) {
                    clearTimeout(recordingTimerRef.current);
                    recordingTimerRef.current = null;
                }

                const blob = new Blob(chunks.current, {
                    type: mediaRecorder.mimeType,
                });

                if (blob.size > 0) {
                    setAudioUrl(URL.createObjectURL(blob));
                    setStatus("Recording ready. Analyze your discovery!");
                } else {
                    setStatus("No audio recorded. Please try again.");
                }

                stream.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            };

            mediaRecorder.start();

            setRecording(true);
            setStatus("Listening to nature...");

            recordingTimerRef.current = setTimeout(() => {
                if (mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }, 15_000);
        }
        catch (error: unknown) {
            console.error("Microphone access error:", error);

            setRecording(false);

            if (
                error instanceof DOMException &&
                error.name === "NotAllowedError"
            ) {
                setStatus(
                    "🎙️ Microphone access denied. Please allow microphone access in your browser settings and try again."
                );
            } else if (
                error instanceof DOMException &&
                error.name === "NotFoundError"
            ) {
                setStatus(
                    "🎤 No microphone found. Please connect a microphone and try again."
                );
            } else {
                setStatus(
                    "⚠️ Could not start recording. Please check your microphone and try again."
                );
            }
        }
    }


    function stopRecording() {
        if (recorder.current?.state === "recording") {
            recorder.current.stop();
            setRecording(false);
        }
        if (recordingTimerRef.current !== null) {
            clearTimeout(recordingTimerRef.current);
            recordingTimerRef.current = null;
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
"use client";

import { useEffect, useRef, useState } from "react";
import { pipeline } from "@huggingface/transformers";

const MODEL = "Xenova/ast-finetuned-audioset-10-10-0.4593";

type Prediction = {
  label: string;
  score: number;
};

function getNatureInsight(label: string) {
  const sound = label.toLowerCase();

  if (
    sound.includes("bird") ||
    sound.includes("chirp") ||
    sound.includes("birds")
  ) {
    return {
      isNature: true,
      category: "Birdsong",
      title: "🐦 Birdsong detected!",
      message: "Listen closely. Birds communicate through calls and songs.",
      points: 5,
    };
  }

  if (
    sound.includes("wind") ||
    sound.includes("rustling") ||
    sound.includes("leaves") ||
    sound.includes("wind noise")
  ) {
    return {
      isNature: true,
      category: "Wind & leaves",
      title: "🍃 Nature is moving!",
      message:
        "Wind moving through leaves creates a unique natural soundscape.",
      points: 5,
    };
  }

  if (
    sound.includes("water") ||
    sound.includes("rain") ||
    sound.includes("stream") ||
    sound.includes("waterfall") ||
    sound.includes("ocean") ||
    sound.includes("waves")
  ) {
    return {
      isNature: true,
      category: "Water",
      title: "💧 Water sound detected!",
      message: "Water creates one of nature's most recognizable soundscapes.",
      points: 5,
    };
  }

  if (
    sound.includes("insect") ||
    sound.includes("cricket") ||
    sound.includes("frog") ||
    sound.includes("croak")
  ) {
    return {
      isNature: true,
      category: "Small wildlife",
      title: "🦗 Wildlife sound detected!",
      message:
        "Small creatures can make a big contribution to a natural soundscape.",
      points: 5,
    };
  }

  return {
    isNature: false,
    category: "Unclassified",
    title: "🔎 Keep exploring!",
    message:
      "This sound was not confidently matched to one of our nature categories. Try recording birds, wind, water, or insects.",
    points: 0,
  };
}

export default function Home() {
  //state variables
  const [status, setStatus] = useState("Ready to explore");
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Prediction[]>([]);
  const [audioUrl, setAudioUrl] = useState("");

  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  type Discovery = {
    label: string;
    score: number;
    points: number;
    time: string;
  };
  const [history, setHistory] = useState<Discovery[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem("echoquest-history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("echoquest-history", JSON.stringify(history));
  }, [history]);

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
        if (event.data.size > 0) chunks.current.push(event.data);
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
    if (!audioUrl) return;

    setBusy(true);
    setResults([]);

    try {
      setStatus("Loading AI model... First load may take a while.");

      const classifier = await pipeline("audio-classification", MODEL, {
        dtype: "q8",
      });

      setStatus("AI is listening to your recording...");

      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      const audioContext = new AudioContext();
      const decoded = await audioContext.decodeAudioData(arrayBuffer);

      // AST expects audio sampled at 16 kHz.
      const targetRate = 16000;
      const frameCount = Math.ceil(decoded.duration * targetRate);

      const offline = new OfflineAudioContext(1, frameCount, targetRate);

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

      const topResult = predictions[0];
      const insight = getNatureInsight(topResult.label);

      setResults(predictions);

      if (insight.isNature) {
        setHistory((previous) => [
          {
            label: insight.category,
            score: topResult.score,
            points: insight.points,
            time: new Date().toLocaleTimeString(),
          },
          ...previous,
        ]);
      }

      setStatus("Listening to nature...");

      setStatus("Discovery complete!");
      await audioContext.close();
    } catch (error) {
      console.error(error);
      setStatus(
        "Could not analyze this recording. Try a shorter recording or reload the page.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#101910] px-5 py-12 text-[#f0f4e8]">
      <section className="mx-auto max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-lime-300">
          Outdoor discovery
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight">
          EchoQuest<span className="text-lime-300"></span>
        </h1>

        <p className="mt-4 max-w-lg leading-7 text-stone-300">
          Step outside. Listen closely. Discover the sounds hiding in the world
          around you.
        </p>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-5xl">🌿</div>

          <h2 className="mt-4 text-2xl font-bold">Your first discovery</h2>

          <p className="mt-2 text-stone-300">
            Find a quiet spot. Record 5–10 seconds of the world around you.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {!recording ? (
              <button
                onClick={startRecording}
                disabled={busy}
                className="rounded-full bg-lime-300 px-6 py-3 font-bold text-[#101910] disabled:opacity-50"
              >
                🎙 Start listening
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="rounded-full bg-red-400 px-6 py-3 font-bold text-black"
              >
                ■ Stop recording
              </button>
            )}

            <button
              onClick={analyzeSound}
              disabled={!audioUrl || busy || recording}
              className="rounded-full border border-lime-300 px-6 py-3 font-bold text-lime-200 disabled:opacity-40"
            >
              {busy ? "Analyzing..." : "✨ Analyze sound"}
            </button>
          </div>

          <p role="status" className="mt-5 text-sm text-lime-200">
            {status}
          </p>

          {audioUrl && (
            <audio className="mt-4 w-full" controls src={audioUrl} />
          )}
        </section>

        {results.length > 0 && (
          <section className="mt-8 rounded-3xl border border-lime-300/20 bg-lime-300/5 p-6">
            <p className="text-sm uppercase tracking-widest text-lime-300">
              AI sound predictions
            </p>

            {(() => {
              const topResult = results[0];
              const insight = getNatureInsight(topResult.label);

              return (
                <div className="mt-5 rounded-2xl bg-lime-300/10 p-5">
                   {/* <div className="text-4xl">{insight.emoji}</div>  */}

                  <h3 className="mt-3 text-xl font-black text-lime-200">
                    {insight.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-stone-300">
                    {insight.message}
                  </p>

                  {insight.isNature ? (
                    <p className="mt-4 font-bold text-lime-300">
                      +{insight.points} nature points
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-stone-400">
                      No nature points awarded for this sound.
                    </p>
                  )}
                </div>
              );
            })()}

            <h2 className="mt-2 text-2xl font-bold">What did you hear?</h2>

            <p className="mt-2 text-sm text-stone-400">
              These are model predictions, not confirmed identifications.
            </p>

            <ul className="mt-6 space-y-4">
              {results.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-lime-200">
                      {(item.score * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-lime-300"
                      style={{
                        width: `${item.score * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-lime-300/20 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-lime-300">
            🌿 Your Nature Journal
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-sm text-white/60">Discoveries</p>
              <p className="text-3xl font-black">{history.length}</p>
            </div>

            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-sm text-white/60">Total points</p>
              <p className="text-3xl font-black text-lime-300">
                {history.reduce((sum, item) => sum + item.points, 0)}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {history.map((item, index) => (
              <div
                key={`${item.time}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl bg-black/20 p-3"
              >
                <div className="min-w-0">
                  <p className="break-words font-bold">{item.label}</p>
                  <p className="text-xs text-white/50">{item.time}</p>
                </div>

                <span className="shrink-0 font-bold text-lime-300">
                  +{item.points} XP
                </span>
              </div>
            ))}

            {history.length === 0 && (
              <p className="text-sm text-white/60">
                Your first nature discovery is waiting outside. 🌱
              </p>
            )}
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-stone-500">
          Your recording is analyzed in your browser.
          <br />
          Model files are downloaded on first use.
        </footer>
      </section>
    </main>
  );
}

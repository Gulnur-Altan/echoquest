"use client";

import { useEffect, useState } from "react";
import BadgePanel from "./components/BadgePanel";
import NatureJournal from "./components/NatureJournal";
import type { Discovery } from "../lib/types";
import { useAudioClassifier } from "../hooks/useAudioClassifier";
import SoundResults from "./components/SoundResults";

const MODEL = "Xenova/ast-finetuned-audioset-10-10-0.4593";

export default function Home() {
  //state variables
  const [history, setHistory] = useState<Discovery[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const natureDiscoveries = history.filter((item) => item.points > 0).length;

  const {
    status,
    recording,
    busy,
    results,
    audioUrl,
    startRecording,
    stopRecording,
    analyzeSound,
  } = useAudioClassifier({
    onDiscovery: (discovery) => {
      setHistory((previous) => [discovery, ...previous]);
    },
  });

  // 1. Önce kayıtlı keşifleri yükle

  useEffect(() => {
    try {
      const saved = localStorage.getItem("echoquest-history");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error("Could not load history:", error);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  // 2. Yükleme tamamlandıktan sonra değişiklikleri kaydet
  useEffect(() => {
    if (!historyLoaded) return;

    localStorage.setItem("echoquest-history", JSON.stringify(history));
  }, [history, historyLoaded]);

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
          <p role="status" aria-live="polite">
            {status}
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

        {results.length > 0 && <SoundResults results={results} />}

        <NatureJournal
          history={history}
          onClearHistory={() => setHistory([])}
        />
        <BadgePanel natureDiscoveries={natureDiscoveries} />

        <footer className="mt-10 text-center text-xs text-stone-500">
          Your recording is analyzed in your browser.
          <br />
          Model files are downloaded on first use.
        </footer>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import BadgePanel from "./components/BadgePanel";
import NatureJournal from "./components/NatureJournal";
import type { Discovery } from "../lib/types";
import { useAudioClassifier } from "../hooks/useAudioClassifier";
import SoundResults from "./components/SoundResults";
import DiscoveryHero from "./components/DiscoveryHero";

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
  <main className="min-h-screen bg-[#111B15] px-4 py-8 text-[#f0f4e8] sm:px-6 sm:py-12">
    <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(ellipse_at_top,_rgba(67,105,49,0.12),transparent_55%)]" />

    <section className="relative z-10 mx-auto max-w-3xl">
      <DiscoveryHero
        status={status}
        recording={recording}
        busy={busy}
        audioUrl={audioUrl}
        startRecording={startRecording}
        stopRecording={stopRecording}
        analyzeSound={analyzeSound}
      />

      <div className="mt-8 space-y-6">
        {results.length > 0 && (
          <SoundResults results={results} />
        )}

        <NatureJournal
          history={history}
          onClearHistory={() => setHistory([])}
        />

        <BadgePanel natureDiscoveries={natureDiscoveries} />
      </div>

      <footer className="mt-10 text-center text-xs leading-6 text-stone-500">
        Your recording is analyzed in your browser.
        <br />
        Model files are downloaded on first use.
      </footer>
    </section>
  </main>
);
}
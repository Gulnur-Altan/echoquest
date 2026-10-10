"use client";

import type { Discovery } from "../../lib/types";

type NatureJournalProps = {
  history: Discovery[];
  onClearHistory: () => void;
};

export default function NatureJournal({
  history,
  onClearHistory,
}: NatureJournalProps) {
  const totalPoints = history.reduce((sum, item) => sum + item.points, 0);

  const natureDiscoveries = history.filter((item) => item.points > 0);

  const categoryCounts = natureDiscoveries.reduce<Record<string, number>>(
    (counts, item) => {
      counts[item.label] = (counts[item.label] ?? 0) + 1;
      return counts;
    },
    {},
  );

  const topCategory = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return (
    <section className="mt-8 rounded-3xl border border-lime-300/20 bg-white/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-lime-300">
          🌿 Your Nature Journal
        </h2>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to delete your discovery history?",
              );

              if (confirmed) {
                onClearHistory();
              }
            }}
            className="rounded-full border border-red-400/30 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
          >
            Clear history
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-sm text-white/60">Total discoveries</p>
          <p className="mt-1 text-3xl font-black">{history.length}</p>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <p className="text-sm text-white/60">Total XP</p>
          <p className="mt-1 text-3xl font-black text-lime-300">
            {totalPoints}
          </p>
        </div>

        <div className="col-span-2 rounded-2xl bg-black/20 p-4">
          {/* it should be seen only when there are discoveries */}
          {natureDiscoveries.length > 0 && (
            <p className="text-sm text-white/60">Most discovered category</p>
          )}

          {topCategory ? (
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-xl font-black text-lime-200">
                {topCategory[0]}
              </p>
              <span className="rounded-full bg-lime-300/10 px-3 py-1 text-sm font-bold text-lime-300">
                {topCategory[1]} discoveries
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-stone-400">
              Your first nature discovery is waiting outside. 🌱
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="font-bold text-stone-200">Recent discoveries</h3>

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
            No discoveries yet. Start listening to the world around you! 🍃
          </p>
        )}
      </div>
    </section>
  );
}

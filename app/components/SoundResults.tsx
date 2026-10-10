"use client";

import {
  getNatureInsight,
  getBestNatureMatch,
  type Prediction,
} from "../../lib/nature";

type SoundResultsProps = {
  results: Prediction[];
};

export default function SoundResults({ results }: SoundResultsProps) {
  if (results.length === 0) return null;

  const natureMatch = getBestNatureMatch(results);
  const insight = natureMatch?.insight ?? getNatureInsight(results[0].label);

  return (
    <section className="mt-8 rounded-3xl border border-lime-300/20 bg-lime-300/5 p-6">
      <p className="text-sm uppercase tracking-widest text-lime-300">
        AI sound predictions
      </p>

      <div className="mt-5 rounded-2xl bg-lime-300/10 p-5">
        <h3 className="mt-3 text-xl font-black text-lime-200">
          {insight.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-stone-300">
          {insight.message}
        </p>

        {natureMatch && (
          <p className="mt-2 text-xs text-stone-400">
            Matched sound: {natureMatch.prediction.label}
          </p>
        )}

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

      <h2 className="mt-6 text-2xl font-bold">What did you hear?</h2>

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
  );
}

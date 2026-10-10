
"use client";

type BadgePanelProps = {
  natureDiscoveries: number;
};

const badges = [
  {
    name: "Nature Beginner",
    description: "Made your first nature discovery",
    emoji: "🌱",
    required: 1,
  },
  {
    name: "Nature Explorer",
    description: "Discovered 5 nature sounds",
    emoji: "🐦",
    required: 5,
  },
  {
    name: "Wildlife Guardian",
    description: "Discovered 10 nature sounds",
    emoji: "🌳",
    required: 10,
  },
];

export default function BadgePanel({
  natureDiscoveries,
}: BadgePanelProps) {
  const unlockedBadges = badges.filter(
    (badge) => natureDiscoveries >= badge.required
  );

  return (
    <section className="mt-6 rounded-3xl border border-lime-300/20 bg-white/5 p-6">
      <h2 className="text-xl font-black text-lime-200">
        🏆 Nature Badges
      </h2>

      <p className="mt-2 text-sm text-stone-400">
        {unlockedBadges.length} of {badges.length} badges unlocked
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {badges.map((badge) => {
          const unlocked =
            natureDiscoveries >= badge.required;

          return (
            <div
              key={badge.name}
              className={`rounded-2xl border p-4 ${
                unlocked
                  ? "border-lime-300/40 bg-lime-300/10"
                  : "border-white/10 bg-black/20 opacity-50"
              }`}
            >
              <div className="text-3xl">
                {unlocked ? badge.emoji : "🔒"}
              </div>

              <h3 className="mt-3 font-black">
                {badge.name}
              </h3>

              <p className="mt-1 text-xs text-stone-400">
                {badge.description}
              </p>

              <p className="mt-3 text-xs font-bold text-lime-300">
                {natureDiscoveries}/{badge.required} discoveries
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
 
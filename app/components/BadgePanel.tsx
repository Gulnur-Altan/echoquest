"use client";

type BadgePanelProps = {
  natureDiscoveries: number;
};

const XP_PER_DISCOVERY = 5;

const levels = [
  { name: "Seedling", minXP: 0, nextXP: 25, emoji: "🌱" },
  { name: "Sprout", minXP: 25, nextXP: 75, emoji: "🌿" },
  { name: "Sapling", minXP: 75, nextXP: 150, emoji: "🌳" },
  { name: "Forest Guardian", minXP: 150, nextXP: null, emoji: "🌲" },
];

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
  const totalXP = natureDiscoveries * XP_PER_DISCOVERY;

  const currentLevelIndex = levels.findLastIndex(
    (level) => totalXP >= level.minXP
  );

  const currentLevel = levels[currentLevelIndex];
  const nextLevel = levels[currentLevelIndex + 1];

  const progress = nextLevel
    ? ((totalXP - currentLevel.minXP) /
        (nextLevel.minXP - currentLevel.minXP)) *
      100
    : 100;

  const unlockedBadges = badges.filter(
    (badge) => natureDiscoveries >= badge.required
  );

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-[#A3BFA8]/20 bg-gradient-to-br from-[#1B2A20] to-[#111B15] p-5 text-[#E4E8DE] shadow-xl sm:p-6">
      {/* XP and level */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A3BFA8]/70">
            Your nature journey
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            {currentLevel.emoji} {currentLevel.name}
          </h2>

          <p className="mt-1 text-sm text-[#A3BFA8]/70">
            Every discovery brings you closer to nature.
          </p>
        </div>

        <div className="rounded-2xl border border-[#A3BFA8]/20 bg-[#A3BFA8]/5 px-5 py-3 sm:min-w-28 sm:text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A3BFA8]/70">
            Total XP
          </p>
          <p className="mt-1 text-3xl font-black text-[#D1DDC8]">
            {totalXP}
            <span className="ml-1 text-sm font-bold">XP</span>
          </p>
        </div>
      </div>

      {/* Level progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="font-bold text-[#D1DDC8]">
            Level progress
          </span>

          <span className="text-[#A3BFA8]/70">
            {nextLevel
              ? `${totalXP} / ${nextLevel.minXP} XP`
              : "Maximum level reached"}
          </span>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full bg-black/30"
          role="progressbar"
          aria-label="Level progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#607C67] to-[#D1DDC8] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-[#A3BFA8]/60">
          <span>{currentLevel.name}</span>
          <span>
            {nextLevel
              ? `Next: ${nextLevel.name}`
              : "🌲 Nature master"}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-8 border-t border-[#A3BFA8]/10 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-black">
              🏆 Nature Badges
            </h3>
            <p className="mt-1 text-sm text-[#A3BFA8]/60">
              Small discoveries, meaningful achievements.
            </p>
          </div>

          <span className="rounded-full border border-[#A3BFA8]/20 bg-[#A3BFA8]/5 px-3 py-1.5 text-xs font-bold text-[#D1DDC8]">
            {unlockedBadges.length} / {badges.length} unlocked
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {badges.map((badge) => {
            const unlocked =
              natureDiscoveries >= badge.required;

            const badgeProgress = Math.min(
              (natureDiscoveries / badge.required) * 100,
              100
            );

            return (
              <div
                key={badge.name}
                className={`rounded-2xl border p-4 transition-all duration-300 ${
                  unlocked
                    ? "border-[#A3BFA8]/35 bg-[#A3BFA8]/[0.08] hover:bg-[#A3BFA8]/[0.13]"
                    : "border-white/[0.07] bg-black/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                      unlocked
                        ? "bg-[#A3BFA8]/10"
                        : "bg-white/[0.04] grayscale"
                    }`}
                  >
                    {unlocked ? badge.emoji : "🔒"}
                  </div>

                  {unlocked && (
                    <span className="text-xs font-bold text-[#A3BFA8]">
                      ✓ Unlocked
                    </span>
                  )}
                </div>

                <h4
                  className={`mt-4 font-extrabold ${
                    unlocked
                      ? "text-[#E4E8DE]"
                      : "text-[#E4E8DE]/45"
                  }`}
                >
                  {badge.name}
                </h4>

                <p className="mt-1 min-h-9 text-xs leading-5 text-[#A3BFA8]/65">
                  {badge.description}
                </p>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="font-bold text-[#A3BFA8]">
                      {natureDiscoveries}/{badge.required}
                    </span>
                    <span className="text-[#A3BFA8]/50">
                      discoveries
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-black/30">
                    <div
                      className="h-full rounded-full bg-[#A3BFA8] transition-all duration-500"
                      style={{ width: `${badgeProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
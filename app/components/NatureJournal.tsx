type Discovery = {
    label: string;
    score: number;
    points: number;
    time: string;
  };
type NatureJournalProps = {
history: Discovery[];
};

export default function NatureJournal({
history,
}: NatureJournalProps) {
const totalPoints = history.reduce(
(sum, item) => sum + item.points,
0
);

return (
<section className="mt-8 rounded-3xl border border-lime-300/20 bg-white/5 p-6">
<h2 className="text-xl font-bold text-lime-300">
🌿 Your Nature Journal
</h2>

  <div className="mt-4 grid grid-cols-2 gap-4">
    <div className="rounded-2xl bg-black/20 p-4">
      <p className="text-sm text-white/60">Discoveries</p>
      <p className="text-3xl font-black">
        {history.length}
      </p>
    </div>

    <div className="rounded-2xl bg-black/20 p-4">
      <p className="text-sm text-white/60">Total points</p>
      <p className="text-3xl font-black text-lime-300">
        {totalPoints}
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
          <p className="break-words font-bold">
            {item.label}
          </p>
          <p className="text-xs text-white/50">
            {item.time}
          </p>
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

);
}
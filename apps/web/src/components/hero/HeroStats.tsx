const HeroStats = () => {
  return (
    <div className="grid grid-cols-2 gap-px bg-border border border-border mt-8 rounded-lg overflow-hidden">
      {[
        { value: "200+", label: "Snippets" },
        { value: "Open", label: "Source" },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-surface p-4 flex flex-col items-center justify-center text-center"
        >
          <div className="text-2xl font-bold text-foreground">
            {stat.value}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted font-semibold mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroStats;

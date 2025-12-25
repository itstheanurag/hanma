import { features } from "@/data/features.data";

const Features = () => {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="mb-16 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Everything you need
        </h2>
        <p className="text-muted">
          Built with modern architecture patterns to ensure scalability and
          maintainability from day one.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-background p-8 hover:bg-surface-hover transition-colors group relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRightIcon className="text-muted w-4 h-4" />
            </div>
            <div className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <feature.icon className="text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {feature.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

export default Features;

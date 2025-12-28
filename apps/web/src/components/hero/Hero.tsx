import HeroSearch from "./HeroSearch";
import HeroCodePreview from "./HeroCodePreview";
import HeroStats from "./HeroStats";
import HeroActions from "./HeroActions";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-secondary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="grid lg:grid-cols-12 gap-0 lg:divide-x divide-border border-b border-border -mx-6 px-6 pb-12">
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-12">
          {/* Hero batch */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium text-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            v1.0 Public Beta
          </div>
          {/* hero heading */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Backend Snippets.
              <br />
              <span className="text-muted">Copy. Paste. Ship.</span>
            </h1>

            <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
              Beautifully designed, secure, and production-ready backend
              snippets. Not a framework. Just code you can copy into your
              Express, Hono, or Elysia apps.
            </p>
          </div>
          {/* Hero Search */}
          <HeroSearch />
          {/* Hero Actions */}
          <HeroActions />
        </div>

        <div className="lg:col-span-5 hidden lg:block pl-12 pt-8 lg:pt-0">
          {/* Hero Code Preview */}
          <HeroCodePreview />
          {/* Hero Stats */}
          <HeroStats />
        </div>
      </div>
    </section>
  );
};

export default Hero;

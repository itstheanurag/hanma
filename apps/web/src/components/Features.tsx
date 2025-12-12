import { LuRocket, LuShield, LuZap, LuSettings, LuPackage, LuTerminal } from 'react-icons/lu';

export function Features() {
  const features = [
    {
      title: "Production Ready",
      description: "Snippets include best practices like graceful shutdown, security headers, and structured logging.",
      icon: <LuRocket />
    },
    {
      title: "Type-Safe",
      description: "Built with TypeScript in mind. All snippets come with full type definition and interfaces.",
      icon: <LuShield />
    },
    {
      title: "Framework Agnostic",
      description: "Supports Express, Hono, NestJS, and more. Consistent patterns across all frameworks.",
      icon: <LuZap />
    },
    {
      title: "Customizable",
      description: "Pure code tailored to your needs. No hidden abstractions or vendor lock-in.",
      icon: <LuSettings />
    },
    {
      title: "Zero Runtime Ops",
      description: "Add the code to your project and you own it. No external dependencies or services.",
      icon: <LuPackage />
    },
    {
      title: "Developer First",
      description: "CLI tool designed for speed. Interactive mode or quick flags to get what you need.",
      icon: <LuTerminal />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
          Why Hanma?
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          We provide the building blocks for modern backends, so you can focus on your unique business rules.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.title} className="p-8 bg-neutral-900/20 border border-neutral-800 rounded-2xl hover:bg-neutral-900/40 hover:border-neutral-700 transition-all group">
            <div className="text-4xl mb-6 bg-neutral-800 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-neutral-200">
              {feature.title}
            </h3>
            <p className="text-neutral-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

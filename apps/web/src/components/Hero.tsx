
import { FaGithub } from 'react-icons/fa6';
import { LuTerminal } from 'react-icons/lu';

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 min-h-[80vh] relative overflow-hidden container mx-auto px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.15)_0%,rgba(10,10,10,0)_70%)]"></div>
      
      <h1 className="text-6xl tracking-tight mb-6 font-bold bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
        Build High-Performance<br />Backends Faster
      </h1>
      <p className="text-xl text-neutral-400 max-w-2xl mb-12">
        A powerful CLI to scaffold production-ready code snippets for Express, Hono, and more. 
        Focus on logic, not boilerplate.
      </p>
      
      <div className="flex gap-4 mb-20">
        <a href="#snippets" className="px-6 py-3 bg-neutral-100 text-neutral-950 rounded-lg font-semibold hover:bg-white hover:-translate-y-px transition-all flex items-center gap-2">
          <LuTerminal />
          Browse Snippets
        </a>
        <a href="https://github.com/itstheanurag/hanma" target="_blank" rel="noreferrer" className="px-6 py-3 bg-neutral-900 text-neutral-100 rounded-lg font-medium border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition-all flex items-center gap-2">
          <FaGithub />
          GitHub
        </a>
      </div>

      {/* Terminal Window */}
      <div className="w-full max-w-2xl bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-2xl shadow-neutral-950/50">
        <div className="flex items-center px-4 py-3 bg-neutral-900/50 border-b border-neutral-800">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <div className="flex-1 text-center font-sans text-sm text-neutral-500">bash</div>
        </div>
        <div className="p-8 text-left font-mono text-base">
          <div className="flex items-center gap-2 text-neutral-100">
            <span className="text-orange-500">➜</span>
            <span>npx hanma add</span>
            <span className="inline-block w-2 h-5 bg-neutral-500 animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { BiHeart, BiUser } from "react-icons/bi";
import { FiMessageCircle } from "react-icons/fi";

const Community = () => {
  return (
    <section className="py-24 px-6 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 relative overflow-hidden">
           {/* Background decorative elements */}
           <div className="absolute top-0 right-0 p-40 bg-purple-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 left-0 p-32 bg-secondary/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>

           <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-xs font-medium text-foreground mb-6 shadow-sm">
                    <BiHeart size={12} className="text-red-500 fill-red-500" />
                    <span>Open Source Community</span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Join the developers building the future.
                 </h2>
                 <p className="text-muted text-lg mb-8 leading-relaxed">
                    Hanma is community-driven. Join our Discord to discuss architecture, request Snippets, or show off what you've built.
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20">
                       <FiMessageCircle size={18} />
                       <span>Join Discord</span>
                    </button>
                    <button className="flex items-center gap-2 bg-background text-foreground border border-border hover:bg-surface-hover px-6 py-3 rounded-lg font-medium transition-colors">
                       <BiUser size={18} />
                       <span>View Contributors</span>
                    </button>
                 </div>
              </div>

              {/* Simulated Chat/Community Visual */}
              <div className="bg-background border border-border rounded-xl p-6 shadow-xl max-w-md mx-auto w-full">
                  <div className="space-y-4">
                     <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold">JD</div>
                        <div>
                           <div className="flex items-baseline gap-2">
                              <span className="text-sm font-bold text-foreground">John Doe</span>
                              <span className="text-[10px] text-muted">Today at 10:42 AM</span>
                           </div>
                           <p className="text-sm text-muted mt-1">Has anyone tried the new Rate Limiter with Redis Cluster?</p>
                        </div>
                     </div>
                     
                     <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-bold">SA</div>
                        <div>
                           <div className="flex items-baseline gap-2">
                              <span className="text-sm font-bold text-foreground">Sarah A.</span>
                              <span className="text-[10px] text-muted">Today at 10:45 AM</span>
                           </div>
                           <p className="text-sm text-muted mt-1">Yes! It works seamlessly. The new adapter pattern makes it super easy to switch.</p>
                           <div className="flex gap-1 mt-2">
                               <span className="text-[10px] bg-surface border border-border px-1.5 py-0.5 rounded text-foreground">🚀 2</span>
                               <span className="text-[10px] bg-surface border border-border px-1.5 py-0.5 rounded text-foreground">🔥 1</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-2 items-center text-muted text-xs pt-2">
                        <span className="w-full h-px bg-border"></span>
                        <span>New messages</span>
                        <span className="w-full h-px bg-border"></span>
                     </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
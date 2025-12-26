import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { LuGithub } from "react-icons/lu";
import { useGithubStore } from "@/stores";
import { GITHUB } from "@/constants";

const Contributors = () => {
  const { contributorsList, fetchStats, loading } = useGithubStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
       <div className="fixed inset-0 bg-grid pointer-events-none opacity-[0.3]" />
       <div className="fixed inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

       <Navbar />

       <main className="flex-1 relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium text-foreground">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Community Driven
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Our <span className="text-muted">Contributors</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Hanma is built by a passionate community of developers from around the world.
              Join us in building the future of backend development.
            </p>
          </div>

          {loading && contributorsList.length === 0 ? (
             <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {contributorsList.map((contributor) => (
                <div
                  key={contributor.login}
                  className="group relative bg-surface border border-border rounded-xl p-6 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border mb-4 ">
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    {contributor.login}
                  </h3>
                  <p className="text-sm text-muted mb-4 capitalize">{contributor.type}</p>

                  <div className="w-full h-px bg-border mb-4" />
                  
                  <div className="flex gap-4 items-center justify-center">
                      <a href={contributor.html_url} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground transition-colors">
                        <LuGithub size={18} />
                      </a>
                  </div>

                  <div className="absolute top-4 right-4 text-xs font-mono text-muted bg-background border border-border px-2 py-0.5 rounded">
                     {contributor.contributions} commits
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
             <a
               href={GITHUB.REPO_URL}
               target="_blank"
               rel="noreferrer"
               className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
             >
               <LuGithub size={18} />
               Become a Contributor
             </a>
          </div>
        </div>
       </main>
    </div>
  );
};

export default Contributors;

import { useState, useEffect } from 'react';
import { LuCopy } from 'react-icons/lu';

interface RegistryItem {
  name: string;
  description: string;
  version?: string;
  dependencies?: string[];
  files?: { name: string }[];
}

export function SnippetBrowser() {
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [snippets, setSnippets] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/registry/index.json')
      .then(res => res.json())
      .then(data => {
        setFrameworks(data);
        if (data.length > 0) {
            const defaultFramework = data.includes('express') ? 'express' : data[0];
            handleFrameworkSelect(defaultFramework);
        }
      })
      .catch(() => setError('Failed to load frameworks'));
  }, []);

  const handleFrameworkSelect = async (fw: string) => {
    setSelectedFramework(fw);
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/registry/${fw}.json`);
      if (!res.ok) throw new Error('Failed to load registry');
      const data = await res.json();
      setSnippets(data);
    } catch (err) {
      setError('Failed to load snippets');
    } finally {
      setLoading(false);
    }
  };

  const copyCommand = (name: string) => {
    navigator.clipboard.writeText(`npx hanma add ${name}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 border-t border-neutral-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-neutral-100">Browse Library</h2>
        <p className="text-neutral-400">Explore production-ready snippets for your favorite framework.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 min-h-[500px] relative">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2 md:sticky md:top-24 md:h-[calc(100vh-8rem)] md:overflow-y-auto custom-scrollbar">
           <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-3 sticky top-0 bg-neutral-950/95 backdrop-blur z-10 py-2">Frameworks</h3>
           {frameworks.map(fw => (
             <button
               key={fw}
               onClick={() => handleFrameworkSelect(fw)}
               className={`text-left px-4 py-3 rounded-lg capitalize font-medium transition-all ${
                 selectedFramework === fw 
                   ? 'bg-neutral-800 text-white shadow-lg shadow-neutral-900/50' 
                   : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
               }`}
             >
               {fw}
             </button>
           ))}
        </div>

        {/* Content */}

        <div className="flex-1">
           {loading ? (
             <div className="flex items-center justify-center h-64 text-neutral-500">Loading snippets...</div>
           ) : error ? (
             <div className="text-red-500">{error}</div>
           ) : (
             <div className="space-y-8">
                {Object.entries(
                  snippets.reduce((acc, snippet) => {
                    let dir = 'root';
                    if (snippet.files && snippet.files.length > 0) {
                      const parts = snippet.files[0].name.split('/');
                      if (parts.length > 1) {
                        dir = parts[0];
                      }
                    }
                    if (!acc[dir]) acc[dir] = [];
                    acc[dir].push(snippet);
                    return acc;
                  }, {} as Record<string, RegistryItem[]>)
                )
                .sort(([a], [b]) => {
                  const order = ['config', 'libs', 'middleware', 'utils', 'root'];
                  const indexA = order.indexOf(a);
                  const indexB = order.indexOf(b);
                  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                  if (indexA !== -1) return -1;
                  if (indexB !== -1) return 1;
                  return a.localeCompare(b);
                })
                .map(([group, groupSnippets]) => (
                  <div key={group}>
                    <h3 className="text-lg font-semibold text-neutral-400 mb-4 capitalize flex items-center gap-2 border-b border-neutral-800 pb-2">
                       <span className="text-neutral-600">📁</span> {group === 'root' ? 'Base Components' : group}
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {groupSnippets.map((snippet) => (
                        <div key={snippet.name} className="group p-6 bg-neutral-900/20 border border-neutral-800 rounded-xl hover:border-orange-500/30 transition-all">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                               <div className="flex items-center gap-3 mb-1">
                                 <h3 className="text-xl font-semibold text-neutral-200">{snippet.name}</h3>
                                 {snippet.version && (
                                   <span className="px-2 py-0.5 text-xs bg-neutral-800 text-neutral-400 rounded-full border border-neutral-700">
                                     {snippet.version}
                                   </span>
                                 )}
                               </div>
                               <p className="text-neutral-400 text-sm">{snippet.description}</p>
                             </div>
                             <button
                               onClick={() => copyCommand(snippet.name)}
                               className="p-2 text-neutral-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors cursor-pointer"
                               title="Copy command"
                             >
                               <LuCopy size={18} />
                             </button>
                          </div>
                          <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500 font-mono">
                            <div className="flex gap-2">
                               {snippet.dependencies && snippet.dependencies.map(dep => (
                                  <span key={dep}>#{dep}</span>
                               ))}
                            </div>
                            <code>npx hanma add {snippet.name}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

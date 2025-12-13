import React, { useState, useEffect } from 'react';
import { BiFolder, BiServer } from 'react-icons/bi';
import { CgCheck, CgChevronRight, CgCopy } from 'react-icons/cg';
import { LuSun, LuMoon } from 'react-icons/lu';
import { useTheme } from './ThemeContext';

interface RegistryItem {
  name: string;
  description: string;
  version?: string;
  dependencies?: string[];
  files?: { name: string }[];
}

interface DocSection {
  id: string;
  title: string; // Directory name (e.g., "Middleware", "Utils")
  description: string;
  items: {
    name: string;
    id: string;
    desc: string;
    cmd: string;
    deps?: string[];
  }[];
}

interface DocGroup {
  title: string; // Framework name
  icon: React.ReactNode;
  sections: DocSection[];
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 hover:text-foreground text-muted transition-colors rounded-md hover:bg-surface-hover"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <LuSun size={18} /> : <LuMoon size={18} />}
    </button>
  );
};

const Docs = () => {
  const [activeSection, setActiveSection] = useState("");
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('express');
  const [docsData, setDocsData] = useState<DocGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch frameworks list
  useEffect(() => {
    fetch('/registry/index.json')
      .then(res => res.json())
      .then(data => {
        setFrameworks(data);
        if (data.length > 0 && !data.includes(selectedFramework)) {
           setSelectedFramework(data[0]); 
        }
      })
      .catch(console.error);
  }, []);

  // Fetch registry data for selected framework
  useEffect(() => {
    setLoading(true);
    fetch(`/registry/${selectedFramework}.json`)
      .then(res => res.json())
      .then((data: RegistryItem[]) => {
        const groups = processRegistryData(selectedFramework, data);
        setDocsData(groups);
        if (groups.length > 0 && groups[0].sections.length > 0) {
            setActiveSection(groups[0].sections[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedFramework]);

  const processRegistryData = (framework: string, items: RegistryItem[]): DocGroup[] => {
    // Group items by directory
    const sectionsMap: Record<string, RegistryItem[]> = {};
    
    items.forEach(item => {
      let dir = 'Core';
      if (item.files && item.files.length > 0) {
        const parts = item.files[0].name.split('/');
        if (parts.length > 1) {
          dir = parts[0]; // e.g., "middleware", "utils", "libs"
        } else if (item.files[0].name.endsWith('server.ts') || item.name.includes('server')) {
             dir = 'Servers';
        }
      }
      
      // Capitalize first letter
      dir = dir.charAt(0).toUpperCase() + dir.slice(1);
      
      if (!sectionsMap[dir]) {
        sectionsMap[dir] = [];
      }
      sectionsMap[dir].push(item);
    });

    const sections: DocSection[] = Object.entries(sectionsMap).map(([dir, items]) => ({
      id: `${framework}-${dir.toLowerCase()}`,
      title: dir,
      description: getDirDescription(dir),
      items: items.map(item => ({
        name: item.name,
        id: item.name, // Use name as ID
        desc: item.description,
        cmd: `npx hanma add ${item.name}`,
        deps: item.dependencies
      }))
    })).sort((a, b) => {
        // Custom order: Servers -> Core -> Config -> Libs -> Middleware -> Utils
        const order = ['Servers', 'Core', 'Config', 'Libs', 'Middleware', 'Utils'];
        const idxA = order.indexOf(a.title);
        const idxB = order.indexOf(b.title);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.title.localeCompare(b.title);
    });

    return [{
      title: framework.charAt(0).toUpperCase() + framework.slice(1),
      icon: getFrameworkIcon(framework),
      sections
    }];
  };

  const getDirDescription = (dir: string) => {
      switch(dir.toLowerCase()) {
          case 'servers': return "Production-ready server boilerplates and setups.";
          case 'core': return "Core configuration and essential files.";
          case 'libs': return "Database connections and external service integrators.";
          case 'middleware': return "Express middleware for request handling and safety.";
          case 'utils': return "Helper functions and shared utilities.";
          case 'config': return "Configuration strategies and environment validation.";
          default: return "Snippets and utilities.";
      }
  };

  const getFrameworkIcon = (_fw: string) => {
      // Simple framework icon mapping
      return <BiServer size={18} />;
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-muted">Loading documentation...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-surface sticky top-0 h-screen overflow-y-auto hidden md:block flex flex-col">
        <div className="p-6 flex-1">
          <h2 className="font-bold text-foreground mb-6 px-2">Documentation</h2>
          
          {/* Framework Selector */}
          {frameworks.length > 1 && (
             <div className="mb-8 px-2">
                 <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 block">
                    Framework
                 </label>
                 <div className="grid grid-cols-2 gap-2">
                     {frameworks.map(fw => (
                         <button
                            key={fw}
                            onClick={() => setSelectedFramework(fw)}
                            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                                selectedFramework === fw
                                    ? 'bg-primary/10 border-primary text-primary' 
                                    : 'bg-background border-border text-muted hover:border-foreground/20 hover:text-foreground'
                            }`}
                         >
                             {/* You could add icons here if available based on fw name */}
                             {fw.charAt(0).toUpperCase() + fw.slice(1)}
                         </button>
                     ))}
                 </div>
             </div>
          )}

          <div className="space-y-6">
            {docsData.map((group, idx) => (
              <div key={idx}>
                {frameworks.length <= 1 && ( // Only show group title if not using selector for single framework
                    <div className="flex items-center gap-2 text-muted px-2 mb-2 text-sm font-semibold uppercase tracking-wider">
                    {group.icon}
                    {group.title}
                    </div>
                )}
                <ul className="space-y-1">
                  {group.sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                          activeSection === section.id
                            ? 'bg-secondary text-black font-medium'
                            : 'text-muted hover:text-foreground hover:bg-surface-hover'
                        }`}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-6 border-t border-border bg-surface/50">
            <div className="flex items-center justify-between">
                <a href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2">
                    <CgChevronRight className="rotate-180" />
                    Back to Home
                </a>
                <ThemeToggle />
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-16">
          {docsData.map((group) => (
            <div key={group.title}>
              {group.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24 mb-16">
                   <div className="flex items-center gap-2 text-muted text-sm mb-2">
                      <BiFolder size={14} />
                      <span>{group.title}</span>
                      <CgChevronRight size={14} />
                      <span className="text-foreground font-medium">{section.title}</span>
                   </div>
                   <h2 className="text-3xl font-bold text-foreground mb-4">{section.title}</h2>
                   <p className="text-muted text-lg mb-8">{section.description}</p>
                   
                   <div className="grid gap-8">
                      {section.items.map((item) => (
                        <Card key={item.id} item={item} />
                      ))}
                   </div>
                </section>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const Card = ({ item }: { item: any }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden hover:border-foreground/20 transition-colors">
        <div className="p-6 border-b border-border bg-background">
            <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                {item.name}
                {item.deps && item.deps.length > 0 && (
                    <span className="text-xs bg-border px-2 py-0.5 rounded-full text-muted font-normal">
                        {item.deps.length} deps
                    </span>
                )}
            </h3>
            <p className="text-muted text-sm leading-relaxed">
                {item.desc}
            </p>
        </div>
        <div className="p-4 bg-[#0c0c0e]">
             <div className="flex items-center justify-between gap-4">
                 <div className="font-mono text-sm text-zinc-300 overflow-x-auto whitespace-nowrap custom-scrollbar pb-1">
                    <span className="text-green-500 mr-2">$</span>
                    {item.cmd}
                 </div>
                 <button 
                    onClick={handleCopy}
                    className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
                    title="Copy to clipboard"
                 >
                    {copied ? <CgCheck size={16} className="text-green-500" /> : <CgCopy size={16} />}
                 </button>
             </div>
        </div>
    </div>
  );
};

export default Docs;
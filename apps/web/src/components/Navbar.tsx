import { LuGithub, LuMoon, LuSun, LuCommand } from 'react-icons/lu';
import { useTheme } from './ThemeContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center rounded-lg">
            <LuCommand size={18} strokeWidth={3} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Hanma</span>
        </Link>

        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-medium text-muted hover:text-foreground transition-colors">
            <LuGithub size={14} />
            <span>0 Stars</span>
          </a>
          
          <div className="flex items-center gap-2 text-muted">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:text-foreground transition-colors rounded-md hover:bg-surface"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <LuSun size={18} /> : <LuMoon size={18} />}
            </button>
          </div>

          <Link to="/docs" className="bg-secondary hover:brightness-90 text-black font-semibold text-sm px-4 py-2 rounded-md transition-all">
            Docs
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
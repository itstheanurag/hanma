import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Snippets } from './pages/Snippets';
import { FaGithub } from 'react-icons/fa6';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-950 text-neutral-200">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Hanma
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-500">
                BETA
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-neutral-400">
              <Link to="/snippets" className="hover:text-white transition-colors">Snippets</Link>
              <a href="https://github.com/itstheanurag/hanma" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                <FaGithub className="text-xl" />
              </a>
            </nav>
          </div>
        </header>

        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/snippets" element={<Snippets />} />
          </Routes>
        </main>

        <footer className="border-t border-neutral-900 py-12 mt-24">
          <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
            <p>© 2024 Hanma. Open Source.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

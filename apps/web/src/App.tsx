import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeContext";
import DocsLayout from "./layout/DocLayout";
import AppLayout from "./layout/AppLayout";
import TemplateBuilder from "./pages/TemplateBuilder";

// Lazy load pages
const LandingPage = lazy(() => import("./components/LandingPage"));
const SearchModal = lazy(() =>
  import("./components/ui/SearchModal").then((module) => ({
    default: module.SearchModal,
  })),
);
const Docs = lazy(() => import("./pages/Docs"));
const Contributors = lazy(() => import("./pages/Contributors"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { useDocsStore } from "@/stores/docsStore";
import { useEffect } from "react";

// Simple loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { setSearchOpen } = useDocsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-secondary selection:text-black flex flex-col transition-colors duration-300">
        <Suspense fallback={<LoadingFallback />}>
          <SearchModal />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/contributors" element={<Contributors />} />
              <Route path="/builder" element={<TemplateBuilder />} />
            </Route>

            <Route element={<DocsLayout />}>
              <Route path="/docs/*" element={<Docs />} />
            </Route>

            {/* 404 Catch-all */}
            <Route element={<AppLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

export default App;

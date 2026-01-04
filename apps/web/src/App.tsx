import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeContext";
import DocsLayout from "./layout/DocLayout";
import AppLayout from "./layout/AppLayout";
import { useDocsStore } from "@/stores/docsStore";

// Lazy load pages to reduce initial bundle size
const LandingPage = lazy(() => import("./components/LandingPage"));
const TemplateBuilder = lazy(() => import("./pages/TemplateBuilder"));
const Docs = lazy(() => import("./pages/Docs"));
const Contributors = lazy(() => import("./pages/Contributors"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load SearchModal so it doesn't block main interaction
const SearchModal = lazy(() =>
  import("./components/ui/SearchModal").then((module) => ({
    default: module.SearchModal,
  })),
);

// Simple loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { isSearchOpen, setSearchOpen } = useDocsStore();

  // Keyboard shortcut listener
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

  // Background preloading of routes to ensure snappy navigation
  // "First load the page as it is, and populate the routes in the background"
  useEffect(() => {
    const prefetchRoutes = async () => {
      try {
        await Promise.all([
          import("./components/LandingPage"),
          import("./pages/TemplateBuilder"),
          import("./pages/Docs"),
          import("./pages/Contributors"),
          // Prefetch search modal so it's ready when needed
          import("./components/ui/SearchModal"),
        ]);
      } catch (e) {
        // Ignore prefetch errors
      }
    };

    // Start prefetching after a short delay to prioritize initial render
    const timer = setTimeout(prefetchRoutes, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex flex-col transition-colors duration-300">
        {/* Search Modal in separate Suspense so it never blocks main content */}
        {isSearchOpen && (
          <Suspense fallback={null}>
            <SearchModal />
          </Suspense>
        )}

        {/* Main Routes with fallback */}
        <Suspense fallback={<LoadingFallback />}>
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

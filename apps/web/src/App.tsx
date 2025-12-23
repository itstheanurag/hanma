import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Docs from "./pages/Docs";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/theme/ThemeContext";

function App() {
  const location = useLocation();
  const isDocs = location.pathname.startsWith("/docs");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-secondary selection:text-black relative transition-colors duration-300 flex flex-col">
        {!isDocs && (
          <>
            <div className="fixed inset-0 bg-grid pointer-events-none opacity-[0.3]" />
            <div className="fixed inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
          </>
        )}

        {!isDocs && <Navbar />}

        <main
          className={`flex-1 flex flex-col ${!isDocs ? "max-w-7xl mx-auto border-x border-border relative z-10 bg-background/40 backdrop-blur-[2px] w-full" : "w-full"}`}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs/*" element={<Docs />} />
          </Routes>
        </main>

        {!isDocs && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;

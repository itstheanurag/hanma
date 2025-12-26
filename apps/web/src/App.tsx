import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeContext";

import LandingPage from "./components/LandingPage";
import Docs from "./pages/Docs";
import TemplateBuilder from "./pages/TemplateBuilder";
import Contributors from "./pages/Contributors";
import DocsLayout from "./layout/DocLayout";
import AppLayout from "./layout/AppLayout";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-secondary selection:text-black flex flex-col transition-colors duration-300">
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/builder" element={<TemplateBuilder />} />
          </Route>

          <Route element={<DocsLayout />}>
            <Route path="/docs/*" element={<Docs />} />
          </Route>

        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

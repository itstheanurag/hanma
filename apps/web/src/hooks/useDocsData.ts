import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  TabType,
  SnippetFramework,
  TemplatesData,
  ModulesData,
} from "../types/docs";

interface UseDocsDataReturn {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  snippetsData: SnippetFramework | null;
  templatesData: TemplatesData | null;
  modulesData: ModulesData | null;
  loading: boolean;
  handleTabChange: (tab: TabType) => void;
}

export function useDocsData(): UseDocsDataReturn {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("snippets");
  const [snippetsData, setSnippetsData] = useState<SnippetFramework | null>(
    null,
  );
  const [templatesData, setTemplatesData] = useState<TemplatesData | null>(
    null,
  );
  const [modulesData, setModulesData] = useState<ModulesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Determine active tab from URL
  useEffect(() => {
    const path = location.pathname.replace("/docs", "").replace(/^\//, "");
    if (path.startsWith("templates")) {
      setActiveTab("templates");
    } else if (path.startsWith("modules")) {
      setActiveTab("modules");
    } else {
      setActiveTab("snippets");
    }
  }, [location.pathname]);

  // Fetch data based on active tab
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        if (activeTab === "snippets" && !snippetsData) {
          const res = await fetch("/docs/snippets/express.json");
          const data = await res.json();
          setSnippetsData(data);
          if (data.categories?.length > 0) {
            setActiveCategory(data.categories[0].id);
          }
        } else if (activeTab === "templates" && !templatesData) {
          const res = await fetch("/docs/templates/index.json");
          const data = await res.json();
          setTemplatesData(data);
          if (data.categories?.length > 0) {
            setActiveCategory(data.categories[0].id);
          }
        } else if (activeTab === "modules" && !modulesData) {
          const res = await fetch("/docs/modules/index.json");
          const data = await res.json();
          setModulesData(data);
        }
      } catch (err) {
        console.error("Failed to fetch docs:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab, snippetsData, templatesData, modulesData]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    navigate(`/docs/${tab === "snippets" ? "" : tab}`);
  };

  return {
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    snippetsData,
    templatesData,
    modulesData,
    loading,
    handleTabChange,
  };
}

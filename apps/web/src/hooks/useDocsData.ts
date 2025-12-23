import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  TabType,
  SnippetFramework,
  TemplatesData,
  TemplateCategory,
  ModulesData,
  SnippetCategory,
} from "../types/docs";

export type FrameworkType = "express" | "hono" | "elysia" | "shared";

interface UseDocsDataReturn {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  activeFramework: FrameworkType;
  setActiveFramework: (framework: FrameworkType) => void;
  snippetsData: SnippetFramework | null;
  templatesData: TemplatesData | null;
  modulesData: ModulesData | null;
  loading: boolean;
  handleTabChange: (tab: TabType) => void;
  handleFrameworkChange: (framework: FrameworkType) => void;
}

// Cache for framework data to prevent re-fetching
const frameworkCache = new Map<FrameworkType, SnippetFramework>();

export function useDocsData(): UseDocsDataReturn {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("snippets");
  const [activeFramework, setActiveFramework] =
    useState<FrameworkType>("express");
  const [snippetsData, setSnippetsData] = useState<SnippetFramework | null>(
    null,
  );
  const [templatesData, setTemplatesData] = useState<TemplatesData | null>(
    null,
  );
  const [modulesData, setModulesData] = useState<ModulesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Track if initial load is done
  const initialLoadDone = useRef(false);

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

  // Fetch snippets for a framework
  const fetchFrameworkData = useCallback(
    async (framework: FrameworkType) => {
      // Check cache first
      const cached = frameworkCache.get(framework);
      if (cached) {
        setSnippetsData(cached);
        if (cached.categories.length > 0 && !activeCategory) {
          setActiveCategory(cached.categories[0].id);
        }
        return;
      }

      setLoading(true);
      try {
        const indexRes = await fetch(`/docs/snippets/${framework}/index.json`);
        const indexData = await indexRes.json();
        const categoryPromises = indexData.categoryFiles.map(
          async (catFile: { id: string; file: string }) => {
            const res = await fetch(
              `/docs/snippets/${framework}/${catFile.file}`,
            );
            return res.json();
          },
        );
        const categories: SnippetCategory[] =
          await Promise.all(categoryPromises);

        const mergedData: SnippetFramework = {
          framework: indexData.framework,
          version: indexData.version,
          title: indexData.title,
          description: indexData.description,
          installNote: indexData.installNote,
          concept: indexData.concept,
          examples: indexData.examples,
          categories,
        };

        // Cache the data
        frameworkCache.set(framework, mergedData);
        setSnippetsData(mergedData);

        if (categories.length > 0) {
          setActiveCategory(categories[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch framework data:", err);
      } finally {
        setLoading(false);
      }
    },
    [activeCategory],
  );

  // Fetch templates data
  const fetchTemplatesData = useCallback(async () => {
    if (templatesData) return;

    setLoading(true);
    try {
      const indexRes = await fetch("/docs/templates/express/index.json");
      const indexData = await indexRes.json();

      const categoryPromises = indexData.categoryFiles.map(
        async (catFile: {
          id: string;
          file: string;
          title: string;
          description: string;
        }) => {
          const res = await fetch(`/docs/templates/express/${catFile.file}`);
          return res.json();
        },
      );
      const categories: TemplateCategory[] =
        await Promise.all(categoryPromises);

      const mergedData: TemplatesData = {
        title: indexData.title,
        description: indexData.description,
        categories,
        examples: indexData.examples,
      };

      setTemplatesData(mergedData);
      if (categories.length > 0) {
        setActiveCategory(categories[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setLoading(false);
    }
  }, [templatesData]);

  // Fetch modules data
  const fetchModulesData = useCallback(async () => {
    if (modulesData) return;

    setLoading(true);
    try {
      const res = await fetch("/docs/modules/index.json");
      const data = await res.json();
      setModulesData(data);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    } finally {
      setLoading(false);
    }
  }, [modulesData]);

  // Handle framework change - fetch data if not cached
  useEffect(() => {
    if (activeTab === "snippets") {
      fetchFrameworkData(activeFramework);
    }
  }, [activeFramework, activeTab, fetchFrameworkData]);

  // Handle tab changes
  useEffect(() => {
    if (activeTab === "templates") {
      fetchTemplatesData();
    } else if (activeTab === "modules") {
      fetchModulesData();
    }
  }, [activeTab, fetchTemplatesData, fetchModulesData]);

  // Initial load
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchFrameworkData(activeFramework);
    }
  }, [activeFramework, fetchFrameworkData]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      setActiveTab(tab);
      navigate(`/docs/${tab === "snippets" ? "" : tab}`);
    },
    [navigate],
  );

  const handleFrameworkChange = useCallback((framework: FrameworkType) => {
    setActiveFramework(framework);
  }, []);

  return {
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activeFramework,
    setActiveFramework,
    snippetsData,
    templatesData,
    modulesData,
    loading,
    handleTabChange,
    handleFrameworkChange,
  };
}

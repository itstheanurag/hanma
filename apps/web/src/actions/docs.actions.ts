import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { buildDocsPath } from "@/utils/docsUrl";
import type { TabType, FrameworkType } from "@/types/docs";

/**
 * Hook for documentation navigation actions
 */
export const useDocsActions = () => {
  const navigate = useNavigate();

  const handleTabChange = useCallback(
    (tab: TabType, currentFramework: FrameworkType) => {
      if (tab === "modules") {
        navigate("/docs/modules");
      } else if (tab === "addons") {
        navigate("/docs/addons");
      } else {
        navigate(buildDocsPath(tab, currentFramework, ""));
      }
    },
    [navigate],
  );

  const handleNavigate = useCallback(
    (
      tab: TabType,
      framework: FrameworkType | "shared" | "tooling",
      category: string = "",
    ) => {
      navigate(buildDocsPath(tab, framework as FrameworkType, category));
    },
    [navigate],
  );

  return {
    handleTabChange,
    handleNavigate,
  };
};

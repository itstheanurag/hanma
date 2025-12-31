import type { SnippetFramework, SnippetCategory } from "@/types/docs";

/**
 * Filters categories based on search query
 */
export const filterCategories = (
  data: SnippetFramework | null,
  searchQuery: string,
): SnippetCategory[] => {
  if (!data?.categories || !searchQuery.trim()) {
    return data?.categories || [];
  }

  const query = searchQuery.toLowerCase();
  return data.categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(query) ||
      cat.id.toLowerCase().includes(query),
  );
};

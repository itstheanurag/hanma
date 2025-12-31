import { BiFolder } from "react-icons/bi";
import { CgChevronRight } from "react-icons/cg";
import type { SnippetFramework, FrameworkType } from "@/types/docs";
import { SnippetCard } from "./SnippetCard";
import { SnippetIntro } from "./SnippetIntro";

interface SnippetsViewProps {
  data: SnippetFramework;
  activeCategory: string;
  activeFramework: FrameworkType | "shared" | "tooling";
}

export const SnippetsView = ({
  data,
  activeCategory,
  activeFramework,
}: SnippetsViewProps) => {
  // Show intro when no category is selected (default/overview state)
  const showIntro = activeCategory === "";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {data.title}
        </h1>
        <p className="text-muted text-lg">{data.description}</p>
      </div>

      {showIntro && <SnippetIntro data={data} />}

      {data.categories
        .filter((cat) => cat.id === activeCategory)
        .map((category) => (
          <div key={category.id}>
            {category.subcategories.map((subcat) => (
              <div key={subcat.id} className="mb-12">
                <div className="flex items-center gap-2 text-muted text-sm mb-2">
                  <BiFolder size={14} />
                  <span>{category.title}</span>
                  <CgChevronRight size={14} />
                  <span className="text-foreground font-medium">
                    {subcat.title}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {subcat.title}
                </h2>
                <p className="text-muted mb-6">{subcat.description}</p>

                <div className="space-y-4">
                  {subcat.snippets.map((snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      framework={activeFramework}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

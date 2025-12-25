import { BiFolder } from "react-icons/bi";
import { CgChevronRight } from "react-icons/cg";
import type { SnippetFramework, FrameworkType } from "@/types/docs";
import { SnippetCard } from "./SnippetCard";
import { CodeBlock } from "./CodeBlock";

interface SnippetsViewProps {
  data: SnippetFramework;
  activeCategory: string;
  activeFramework: FrameworkType;
}

export const SnippetsView = ({ data, activeCategory, activeFramework }: SnippetsViewProps) => {
  const showIntro = activeCategory === "libs"; 

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{data.title}</h1>
        <p className="text-muted text-lg">{data.description}</p>
      </div>

      {/* Concept Section */}
      {showIntro && data.concept && (
        <div className="mb-12 p-6 bg-surface rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">What is a Snippet?</h3>
          <p className="text-muted mb-4">{data.concept.whatIsASnippet}</p>
          
          <h4 className="text-sm font-semibold text-foreground mb-2">When to use snippets:</h4>
          <ul className="list-disc list-inside text-muted mb-4 space-y-1">
            {data.concept.whenToUseSnippets.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <h5 className="text-xs font-semibold text-primary uppercase mb-1">Snippets</h5>
              <p className="text-sm text-muted">{data.concept.snippetsVsPackages.snippets}</p>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-yellow-500 uppercase mb-1">Packages</h5>
              <p className="text-sm text-muted">{data.concept.snippetsVsPackages.packages}</p>
            </div>
            <div>
              <h5 className="text-xs font-semibold text-green-500 uppercase mb-1">Benefit</h5>
              <p className="text-sm text-muted">{data.concept.snippetsVsPackages.benefit}</p>
            </div>
          </div>
        </div>
      )}

      {/* Examples Section */}
      {showIntro && data.examples && data.examples.length > 0 && (
        <div className="mb-12 p-6 bg-surface rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Examples</h3>
          <div className="space-y-4">
            {data.examples.map((example, idx) => (
              <div key={idx}>
                <p className="text-sm text-muted mb-2">
                  <span className="font-medium text-foreground">{example.title}</span>
                  {" - "}{example.description}
                </p>
                <CodeBlock command={example.command} />
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <span className="text-foreground font-medium">{subcat.title}</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{subcat.title}</h2>
                <p className="text-muted mb-6">{subcat.description}</p>

                <div className="space-y-4">
                  {subcat.snippets.map((snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet} framework={activeFramework} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

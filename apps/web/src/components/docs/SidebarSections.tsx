import { LuChevronDown, LuChevronRight } from "react-icons/lu";

interface BaseCategory {
  id: string;
  title: string;
}

interface CategoryListProps {
  categories: BaseCategory[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export const CategoryList = ({
  categories,
  activeCategory,
  onCategoryClick,
}: CategoryListProps) => (
  <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onCategoryClick(cat.id)}
        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
          activeCategory === cat.id
            ? "bg-secondary text-secondary-foreground font-medium"
            : "text-muted hover:text-foreground hover:bg-surface-hover"
        }`}
      >
        {cat.title}
      </button>
    ))}
  </div>
);

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const SidebarSection = ({ title, children }: SidebarSectionProps) => (
  <div className="mb-2 mt-4">
    {title && (
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
        {title}
      </div>
    )}
    {children}
  </div>
);

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isExpanded?: boolean;
  onClick: () => void;
  showChevron?: boolean;
}

export const NavButton = ({
  icon: Icon,
  label,
  isActive,
  isExpanded,
  onClick,
  showChevron = true,
}: NavButtonProps) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
      isActive
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted hover:text-foreground hover:bg-surface-hover"
    }`}
  >
    <Icon size={16} />
    <span className="flex-1">{label}</span>
    {showChevron &&
      (isExpanded ? (
        <LuChevronDown size={14} className="text-muted" />
      ) : (
        <LuChevronRight size={14} className="text-muted" />
      ))}
  </button>
);

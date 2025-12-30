import { GITHUB, LINKS } from "@/constants";
import { LuBook, LuGithub } from "react-icons/lu";
import { FaNpm } from "react-icons/fa";
import { Link } from "react-router-dom";

const IconButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    aria-label={label}
    onClick={onClick}
    className="
      h-12 w-12
      flex items-center justify-center
      rounded-xl
      border border-border
      bg-surface
      hover:bg-surface-hover
      transition
    "
  >
    {children}
  </button>
);

const HeroActions = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-6">
      {/* Primary CTA */}
      <Link
        to="/docs"
        className="flex items-center gap-2 bg-foreground text-background px-7 py-3 rounded-xl font-semibold hover:opacity-90 transition"
      >
        <LuBook size={18} />
        Docs
      </Link>

      {/* Secondary icon actions */}
      <div className="flex gap-3">
        <IconButton
          label="GitHub"
          onClick={() =>
            window.open(GITHUB.REPO_URL, "_blank", "noopener noreferrer")
          }
        >
          <LuGithub className="w-5 h-5" />
        </IconButton>

        <IconButton
          label="npm"
          onClick={() =>
            window.open(LINKS.NPM, "_blank", "noopener noreferrer")
          }
        >
          <FaNpm className="w-7 h-7 text-red-500" />
        </IconButton>
      </div>
    </div>
  );
};

export default HeroActions;

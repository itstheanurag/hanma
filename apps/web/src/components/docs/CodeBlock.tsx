import { memo } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";
import { useUIStore } from "@/stores";

interface CodeBlockProps {
  command: string;
}

const CODE_BG = "#0f172a";

const CodeBlockComponent = ({ command }: CodeBlockProps) => {
  const { setCopied, isCopied } = useUIStore();
  const copied = isCopied(command);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(command);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden flex items-center justify-between">
      <pre
        className="p-4 text-sm overflow-x-auto flex-1 rounded-l-lg"
        style={{ backgroundColor: CODE_BG }}
      >
        <code className="text-neutral-200">{command}</code>
      </pre>

      <button
        onClick={handleCopy}
        className="p-4 text-neutral-400 hover:text-neutral-200 transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <LuCheck size={16} className="text-green-500" />
        ) : (
          <LuCopy size={16} />
        )}
      </button>
    </div>
  );
};

export const CodeBlock = memo(CodeBlockComponent);

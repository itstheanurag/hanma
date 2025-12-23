import { memo } from "react";
import { LuCopy, LuCheck } from "react-icons/lu";
import { useUIStore } from "../../stores";

interface CodeBlockProps {
  command: string;
}

const CodeBlockComponent = ({ command }: CodeBlockProps) => {
  const { setCopied, isCopied } = useUIStore();
  const copied = isCopied(command);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(command);
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg overflow-hidden flex items-center justify-between group">
      <pre className="p-4 text-sm text-neutral-800 dark:text-neutral-200 overflow-x-auto flex-1">
        <code>{command}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="p-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied ? <LuCheck size={16} className="text-green-500" /> : <LuCopy size={16} />}
      </button>
    </div>
  );
};

export const CodeBlock = memo(CodeBlockComponent);

import TerminalPreview from "./TerminalPreview";
import TerminalContent from "./TerminalContent";

const TerminalSection = () => {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <TerminalPreview />
        <TerminalContent />
      </div>
    </section>
  );
};

export default TerminalSection;

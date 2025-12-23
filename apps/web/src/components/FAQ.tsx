import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { faqs } from "../data/faq.data";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-muted mb-12">
          Find answers to common questions about Hanma.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-border rounded-lg bg-surface/50 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left p-6  transition-colors"
              >
                <span className="text-foreground font-medium">
                  {faq.question}
                </span>
                {openIndex === idx ? (
                  <BiMinus size={16} className="text-muted" />
                ) : (
                  <BiPlus size={16} className="text-muted" />
                )}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === idx
                    ? "max-h-48 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-sm text-muted leading-relaxed border-t border-border pt-4 bg-background">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

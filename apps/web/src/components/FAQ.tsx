import  { useState } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';

const faqs = [
  {
    question: "What exactly is Hanma?",
    answer: "Hanma is not a framework or a library you install as a dependency. It is a collection of re-usable code snippets that you can copy and paste into your apps. You own the code."
  },
  {
    question: "Is it free to use?",
    answer: "Yes, the core Snippets are open source and free to use in personal and commercial projects. We also offer a Pro plan for advanced enterprise modules."
  },
  {
    question: "How do I update Snippets?",
    answer: "Since you own the code, updates are manual. However, we provide a CLI tool that can diff your local Snippets against the latest version and help you patch changes."
  },
  {
    question: "Do you support microservices?",
    answer: "Absolutely. Our Snippets are designed to be modular. You can use our gRPC or RabbitMQ snippets to easily stitch together microservices."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
        <p className="text-muted mb-12">Find answers to common questions about Hanma.</p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-border rounded-lg bg-surface/50 overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left p-6 hover:bg-surface-hover transition-colors"
              >
                <span className="text-foreground font-medium">{faq.question}</span>
                {openIndex === idx ? <BiMinus size={16} className="text-muted" /> : <BiPlus size={16} className="text-muted" />}
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-sm text-muted leading-relaxed border-t border-border pt-4">
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
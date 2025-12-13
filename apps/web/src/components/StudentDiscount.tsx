import { LuGraduationCap, LuArrowRight } from 'react-icons/lu';

const StudentDiscount = () => {
  return (
    <section className="px-6 py-12">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e]">
        <div className="absolute inset-0 bg-grid-small opacity-20 pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 p-8 lg:p-12">
          <div className="flex-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#ffedd5]/10 text-[#ffedd5] mb-6 border border-[#ffedd5]/20">
              <LuGraduationCap size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Student discount available</h3>
            <p className="text-zinc-400 max-w-xl leading-relaxed">
              Get Pro access for free while you're learning. Simply sign up with your university email address and we'll unlock all enterprise Snippets automatically.
            </p>
          </div>
          
          <button className="group whitespace-nowrap bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-lg font-medium transition-colors w-full lg:w-auto flex items-center justify-center gap-2">
            Get Student License
            <LuArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StudentDiscount;
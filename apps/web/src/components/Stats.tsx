import { useEffect, memo } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { baseStats } from "@/data/stats.data";
import { useGithubStore } from "@/stores";

function Counter({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(
    spring,
    (current) => Math.round(current).toLocaleString() + "+",
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

const StatsComponent = () => {
  const { stars, contributors, fetchStats } = useGithubStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const stats = [
    ...baseStats.map((s) => ({ 
      label: s.label, 
      value: s.value, 
      isPercentage: s.isPercentage 
    })),
    { label: "GitHub Stars", value: stars },
    { label: "Contributors", value: contributors },
  ];

  return (
    <div className="container mx-auto px-4 py-16 border-t border-neutral-900">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {stats.map((stat) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            key={stat.label}
            className="p-6 bg-neutral-900/30 border border-neutral-800/50 rounded-2xl text-center hover:bg-neutral-900/50 transition-colors"
          >
            <div className="text-3xl font-bold bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent mb-2">
              {"isPercentage" in stat && stat.isPercentage ? (
                `${stat.value}%`
              ) : (
                <Counter value={stat.value} />
              )}
            </div>
            <div className="text-sm font-medium text-neutral-500">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const Stats = memo(StatsComponent);

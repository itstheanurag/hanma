import { useEffect, memo } from "react";
import { motion, useSpring, useTransform } from "motion/react";
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
  const { stars, npmDownloads, npmSize, fetchStats } = useGithubStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const stats = [
    { label: "GitHub Stars", value: stars, isText: false },
    { label: "NPM Downloads (Last Month)", value: npmDownloads, isText: false },
    { label: "Package Size (Unpacked)", value: npmSize, isText: true },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={[
              "p-6 text-center",
              "md:border-l md:border-neutral-200 md:dark:border-neutral-800",
              index === 0 && "md:border-l-0",
            ].join(" ")}
          >
            <div className="text-3xl font-bold mb-2">
              {stat.isText ? (
                stat.value
              ) : (
                <Counter value={stat.value as number} />
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

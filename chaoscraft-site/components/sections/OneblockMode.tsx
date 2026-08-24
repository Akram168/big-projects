"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const LINES = [
  "Start with one block.",
  "Mine it. It respawns — different, forever.",
  "Phases, bosses, infinite progression.",
];

export function OneblockMode() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="pt-20 pb-16 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto w-full text-center flex flex-col items-center gap-6">
        <motion.span initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
          style={{ color: "#a3e635", background: "rgba(163,230,53,.12)" }}>
          Coming soon
        </motion.span>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1, duration: .6 }}
          className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2.2rem,6vw,3.8rem)" }}>
          OneBlock
        </motion.h1>

        <div className="flex flex-col gap-1.5">
          {LINES.map((line, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: .2 + i * .08, duration: .5 }}
              className="text-[var(--text-mute)] text-lg leading-relaxed">
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, scale: .9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: .5, duration: .6 }}
          className="mt-4">
          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl"
            style={{ background: "rgba(163,230,53,.1)", border: "1px solid rgba(163,230,53,.25)" }}>
            ⬜
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .6 }}
          className="rounded-2xl border px-6 py-4 text-sm text-[var(--text-mute)]"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          Access locked — phase unknown. Follow the Discord for the launch date.
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const RULES = [
  "No rules.",
  "No admins watching.",
  "Griefing encouraged.",
  "Hacked clients? We don't care.",
  "Let the best hacker win.",
];

export function ChaosMode() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="pt-20 pb-16 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto w-full text-center flex flex-col items-center gap-6">
        <motion.span initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
          style={{ color: "#fb7185", background: "rgba(251,113,133,.12)" }}>
          Coming soon — enter at your own risk
        </motion.span>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1, duration: .6 }}
          className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2.2rem,6vw,3.8rem)" }}>
          Chaos Mode
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2, duration: .5 }}
          className="text-[var(--text-mute)] text-lg leading-relaxed">
          A small 2b2t. Without the queue.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3, duration: .5 }}
          className="rounded-2xl border w-full max-w-md text-left divide-y"
          style={{ borderColor: "rgba(251,113,133,.25)", background: "var(--bg-card)" }}>
          {RULES.map((r, i) => (
            <div key={i} className="px-6 py-3.5 text-sm text-[var(--text-mute)] flex items-center gap-3" style={{ borderColor: "rgba(251,113,133,.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#fb7185" }} />
              {r}
            </div>
          ))}
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .5 }}
          className="text-xs uppercase tracking-wide text-[var(--text-dim)]">
          Access locked — follow Discord for the launch date
        </motion.p>
      </div>
    </section>
  );
}

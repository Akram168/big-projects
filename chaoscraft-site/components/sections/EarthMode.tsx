"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const FEATURES = [
  { label: "Custom items", desc: "Unique gear and cosmetics you won't find in vanilla Minecraft" },
  { label: "Tournaments & minigames", desc: "PvP, farming, fishing, KOTH, and more — check /timers in-game" },
];

export function EarthMode() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="pt-20 pb-16 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto w-full text-center">
        <motion.span initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full mb-5"
          style={{ color: "#34d399", background: "rgba(52,211,153,.12)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live now
        </motion.span>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1, duration: .6 }}
          className="font-display font-bold leading-tight mb-4" style={{ fontSize: "clamp(2.2rem,6vw,3.8rem)" }}>
          Earth SMP
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2, duration: .6 }}
          className="text-[var(--text-mute)] text-lg leading-relaxed max-w-xl mx-auto">
          A scaled Earth for a fun, friendly community. Claim your country, build your city, and enjoy custom items, tournaments, and minigames along the way.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 text-left">
          {FEATURES.map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: .3 + i * .1, duration: .5 }}
              className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <span className="text-sm font-semibold" style={{ color: "#34d399" }}>{f.label}</span>
              <p className="text-sm text-[var(--text-mute)] leading-relaxed mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

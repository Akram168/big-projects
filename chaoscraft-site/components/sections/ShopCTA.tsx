"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ShopCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-5 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .6 }}
        className="max-w-5xl mx-auto rounded-3xl border p-10 sm:p-16 text-center flex flex-col items-center gap-6"
        style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, rgba(147,51,234,.12), var(--bg-card))" }}>
        <h2 className="font-display font-semibold leading-tight" style={{ fontSize: "clamp(2rem,6vw,3.5rem)" }}>
          Support the server, get perks
        </h2>
        <p className="text-[var(--text-mute)] max-w-lg leading-relaxed">
          Ranks, crate keys, cosmetics, and custom perks. Everything lives in the shop — kept fair, kept fun.
        </p>
        <a href="https://chaos-craft.tebex.io/" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea,#c026d3)" }}>
          Visit the shop ↗
        </a>
        <p className="text-xs text-[var(--text-dim)] uppercase tracking-wide">Secure checkout via Tebex · Instant delivery in-game</p>
      </motion.div>
    </section>
  );
}

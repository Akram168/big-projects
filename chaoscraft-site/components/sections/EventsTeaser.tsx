"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function EventsTeaser() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-5 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .6 }}
        className="max-w-6xl mx-auto rounded-3xl border p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
        style={{ borderColor: "var(--border)", background: "linear-gradient(135deg, rgba(244,114,182,.1), var(--bg-card))" }}>
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full mb-4"
            style={{ color: "#f472b6", background: "rgba(244,114,182,.15)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6] animate-pulse" /> Building tournament
          </span>
          <h2 className="font-display font-semibold leading-tight mb-2" style={{ fontSize: "clamp(1.6rem,3.5vw,2.2rem)" }}>
            Building Tournament — What Makes You Happy
          </h2>
          <p className="text-[var(--text-mute)] max-w-lg leading-relaxed">
            Show off your personality — an item, food, animal, emotion, or any combo. Gift cards + in-game rewards for the top 5, plus a reward for every participant. Check Discord or the spawn board for dates.
          </p>
        </div>
        <Link href="/events"
          className="shrink-0 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ background: "linear-gradient(135deg,#ec4899,#9333ea)" }}>
          See all events →
        </Link>
      </motion.div>
    </section>
  );
}

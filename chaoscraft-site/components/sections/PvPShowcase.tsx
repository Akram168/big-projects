"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CLIPS = [
  { label: "1v1 Arena",     sub: "Pure skill. No gear advantage.",  tag: "PvP",        img: "/mc-pvp3.jpg" },
  { label: "KOTH Arena",    sub: "Hold the hill the longest.",      tag: "Minigame",   img: "/mc-build1.jpg" },
  { label: "Spleef Finals", sub: "Last block standing wins.",       tag: "Tournament", img: "/mc-pvp2.png" },
  { label: "Throne Era",    sub: "One king. Everyone challenges.",  tag: "Ranked",     img: "/mc-pvp4.jpg" },
];

export function PvPShowcase() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-rose-400 mb-3">PvP & minigames</p>
          <h2 className="font-display font-semibold leading-tight" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
            How they fought
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CLIPS.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .08, duration: .5 }}
              className="rounded-xl overflow-hidden border group" style={{ borderColor: "var(--border)" }}>
              <div className="h-28 relative overflow-hidden">
                <Image src={c.img} alt={c.label} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-3" style={{ background: "var(--bg-card)" }}>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-400">{c.tag}</span>
                <p className="font-display font-semibold text-sm mt-0.5">{c.label}</p>
                <p className="text-xs text-[var(--text-dim)] mt-0.5">{c.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

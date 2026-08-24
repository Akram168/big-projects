"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const BUILDS = [
  { title: "Ancient Fortress", desc: "Player-built castle spanning 3 mountain biomes. Took 6 weeks of server time.", tag: "Megabuild",  img: "/mc-world1.jpg" },
  { title: "Cherry Temple",    desc: "Japanese shrine with a living dragon above it. Built by one player, solo.",    tag: "Earth SMP",  img: "/mc-world4.jpg" },
  { title: "Castle on Water",  desc: "Cinematic shaders build. The moat is functional — try swimming across.",       tag: "Survival",   img: "/mc-world3.jpg" },
  { title: "Ocean Mansion",    desc: "Full interior luxury build by the coastal faction. 3 floors, working farms.",  tag: "Base Tour",  img: "/mc-world2.png" },
];

function BuildCard({ build, i }: { build: typeof BUILDS[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * .08, duration: .5 }}
      className="group rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
      <div className="relative h-48 overflow-hidden">
        <Image src={build.img} alt={build.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
          style={{ background: "rgba(10,14,23,.75)", backdropFilter: "blur(4px)" }}>
          {build.tag}
        </span>
      </div>
      <div className="p-5 space-y-1.5">
        <h3 className="font-display font-semibold text-lg">{build.title}</h3>
        <p className="text-sm text-[var(--text-mute)] leading-relaxed">{build.desc}</p>
      </div>
    </motion.div>
  );
}

export function WorldShowcase() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-400 mb-3">Player-built worlds</p>
          <h2 className="font-display font-semibold leading-tight" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
            What they built
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BUILDS.map((b, i) => <BuildCard key={b.title} build={b} i={i} />)}
        </div>
      </div>
    </section>
  );
}

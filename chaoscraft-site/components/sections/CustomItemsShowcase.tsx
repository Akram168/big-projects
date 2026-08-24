"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function CustomItemsShowcase() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--brand-soft)] mb-3">Custom items</p>
          <h2 className="font-display font-semibold leading-tight" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
            Gear you won&apos;t find anywhere else
          </h2>
          <p className="text-[var(--text-mute)] mt-3 max-w-lg mx-auto">
            Crates, cosmetics, and rewards made just for ChaosCraft.
          </p>
          <Link href="/dragon-gear" className="inline-block mt-4 text-sm font-semibold hover:underline underline-offset-4" style={{ color: "var(--brand-soft)" }}>
            View all Dragon Gear abilities →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1, duration: .5 }}>
            <Link href="/dragon-gear" className="block rounded-2xl border overflow-hidden group transition-transform hover:scale-[1.02]" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <Image src="/dragon.png" alt="Dragon Crate" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
                  style={{ background: "rgba(14,10,22,.75)", backdropFilter: "blur(4px)" }}>
                  Crate
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg mb-1">Dragon Crate</h3>
                <p className="text-sm text-[var(--text-mute)] leading-relaxed">Open for exclusive rewards — rare loot, chances, and surprises. Tap to see every item&apos;s abilities.</p>
              </div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2, duration: .5 }}
            className="rounded-2xl border overflow-hidden group" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <Image src="/customs.png" alt="Upcoming crate rewards" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
                style={{ background: "rgba(14,10,22,.75)", backdropFilter: "blur(4px)" }}>
                Coming soon
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold text-lg mb-1">Upcoming Crate Rewards</h3>
              <p className="text-sm text-[var(--text-mute)] leading-relaxed">New custom mounts and gear on the way — will you be lucky enough?</p>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3, duration: .5 }}
          className="rounded-2xl border overflow-hidden group" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <div className="relative h-40 sm:h-52 overflow-hidden">
            <Image src="/wings.png" alt="Cosmetic wings wall" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
              style={{ background: "rgba(14,10,22,.75)", backdropFilter: "blur(4px)" }}>
              Cosmetics
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-display font-semibold text-lg mb-1">Wing Cosmetics</h3>
            <p className="text-sm text-[var(--text-mute)] leading-relaxed">Dozens of unique wings to collect and show off.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

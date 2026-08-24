"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function LiveMap() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-400 mb-3">Live world map</p>
          <h2 className="font-display font-semibold leading-tight" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
            Explore the world, live
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: .1, duration: .6 }}
          className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="relative" style={{ paddingBottom: "56.25%" }}>
            <iframe src="http://31.97.122.176:8083/" title="ChaosCraft Live Map"
              className="absolute inset-0 w-full h-full border-0"
              style={{ background: "var(--bg-card)" }}
              allowFullScreen loading="lazy" />
          </div>
        </motion.div>

        <div className="mt-4 flex justify-end">
          <a href="http://31.97.122.176:8083/" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-cyan-400 hover:underline underline-offset-4">
            Open fullscreen ↗
          </a>
        </div>
      </div>
    </section>
  );
}

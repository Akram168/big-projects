"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const MODES = [
  {
    title: "Earth SMP",
    status: "Live now",
    statusColor: "#34d399",
    accent: "#34d399",
    desc: "A friendly community server on a scaled Earth map. Custom items, PvP tournaments, farming, fishing, KOTH, and more minigames.",
    href: "/earth",
  },
  {
    title: "OneBlock",
    status: "Coming soon",
    statusColor: "#a3e635",
    accent: "#a3e635",
    desc: "Start with one block. Mine it — it respawns, different, forever. Phases, bosses, infinite progression.",
    href: "/oneblock",
  },
  {
    title: "Chaos Mode",
    status: "Coming soon",
    statusColor: "#fb7185",
    accent: "#fb7185",
    desc: "No rules, no admins watching, hacked clients welcome. A small 2b2t — without the queue.",
    href: "/chaos-mode",
  },
];

export function ServersGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--brand-soft)] mb-3">Our servers</p>
          <h2 className="font-display font-semibold leading-tight" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
            Three gamemodes, one network
          </h2>
          <p className="text-[var(--text-mute)] mt-3 max-w-lg mx-auto">
            Join once and hop between them whenever you like.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {MODES.map((m, i) => (
            <motion.div key={m.title} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .1, duration: .5 }}>
              <Link href={m.href}
                className="group block h-full rounded-2xl border p-7 transition-colors"
                style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full mb-4"
                  style={{ color: m.statusColor, background: `${m.statusColor}18` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.statusColor }} />
                  {m.status}
                </span>
                <h3 className="font-display font-semibold text-xl mb-2">{m.title}</h3>
                <p className="text-sm text-[var(--text-mute)] leading-relaxed mb-5">{m.desc}</p>
                <span className="text-sm font-semibold group-hover:underline underline-offset-4" style={{ color: m.accent }}>
                  Learn more →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

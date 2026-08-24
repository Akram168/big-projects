"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EVENTS = [
  { name: "KOTH",              cadence: "Every 3 hours",       detail: "Hold the hill the longest to win. Fully automated via /timers.", color: "#f59e0b" },
  { name: "Fishing Tournament", cadence: "Every 3 hours",       detail: "10-minute round, random fishing challenge type each time.",       color: "#22d3ee" },
  { name: "Farming Tournament", cadence: "Every 4 hours",       detail: "10-minute round, random farming challenge type each time.",       color: "#84cc16" },
  { name: "Parkour Event",      cadence: "Ongoing",              detail: "Drop-in parkour course — start your own attempt anytime.",         color: "#a855f7" },
];

export function RecurringEvents() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-amber-400 mb-3">Every day</p>
          <h2 className="font-display font-semibold leading-tight" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
            Recurring events
          </h2>
          <p className="text-[var(--text-mute)] mt-3 max-w-lg mx-auto">
            Check <span className="font-mono text-sm">/timers</span> in-game for the live countdown to each one.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EVENTS.map((e, i) => (
            <motion.div key={e.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .08, duration: .5 }}
              className="rounded-2xl border p-6 flex items-start gap-4" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: e.color }} />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold">{e.name}</h3>
                  <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ color: e.color, background: `${e.color}18` }}>
                    {e.cadence}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-mute)] mt-1.5 leading-relaxed">{e.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

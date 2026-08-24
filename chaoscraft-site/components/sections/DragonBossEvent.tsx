"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const REWARDS = [
  { place: "1st", prize: "$100,000 + Dragon Egg + Dragon crate key" },
  { place: "2nd", prize: "$50,000" },
  { place: "3rd", prize: "$25,000" },
  { place: "4th", prize: "$15,000" },
  { place: "5th", prize: "$10,000" },
  { place: "Any damage dealt", prize: "$5,000" },
];

const LOOT = [
  { name: "Dragon Helmet",     emoji: "🪖", ability: "Kinetic Shield" },
  { name: "Dragon Chestplate", emoji: "🛡️", ability: "Void Anchor" },
  { name: "Dragon Sword",      emoji: "⚔️", ability: "Soul Rend" },
  { name: "Dragon Pickaxe",    emoji: "⛏️", ability: "Vein Collapse" },
  { name: "Dragon Bow",        emoji: "🏹", ability: "Temporal Arrow" },
  { name: "Dragon Axe",        emoji: "🪓", ability: "Skull Crush" },
];

export function DragonBossEvent() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--brand-soft)] mb-3">Weekly boss fight</p>
          <h2 className="font-display font-semibold leading-tight mb-3" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
            Ender Dragon Event
          </h2>
          <p className="text-[var(--text-mute)] max-w-xl mx-auto">
            Every week in a dedicated End world, a fresh 1024 HP dragon spawns with fireballs,
            fire zones, minion waves, and an enrage phase below 20% health. Live top-5 damage leaderboard on screen.
            Check <span className="font-mono">/timers</span> in-game for the exact countdown.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1, duration: .5 }}
            className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <h3 className="font-display font-semibold text-lg mb-4">Rewards on death</h3>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {REWARDS.map(r => (
                <div key={r.place} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-[var(--text-mute)]">{r.place}</span>
                  <span className="font-medium text-[var(--text)]">{r.prize}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2, duration: .5 }}
            className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
            <h3 className="font-display font-semibold text-lg mb-4">Dragon crate loot</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LOOT.map(item => (
                <div key={item.name} className="rounded-xl border p-3 flex flex-col gap-1" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-semibold leading-tight">{item.name}</span>
                  <span className="text-[11px] text-[var(--text-dim)]">{item.ability}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

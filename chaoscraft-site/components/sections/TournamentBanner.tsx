"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PRIZES = [
  { place: "1st", gift: "$60 gift card", ingame: "1,000,000 in-game" },
  { place: "2nd", gift: "$25 gift card", ingame: "750,000 in-game" },
  { place: "3rd", gift: "$10 gift card", ingame: "500,000 in-game" },
  { place: "4th", gift: "$8 gift card",  ingame: "250,000 in-game" },
  { place: "5th", gift: "$5 gift card",  ingame: "200,000 in-game" },
];

export function TournamentBanner() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="px-5 sm:px-6 pt-20 pb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .6 }}
        className="max-w-5xl mx-auto rounded-3xl border p-8 sm:p-14 text-center flex flex-col items-center gap-6"
        style={{ borderColor: "rgba(244,114,182,.3)", background: "linear-gradient(135deg, rgba(244,114,182,.1), var(--bg-card))" }}>

        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
          style={{ color: "#f472b6", background: "rgba(244,114,182,.15)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6] animate-pulse" /> Community building event
        </span>

        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
          style={{ background: "rgba(244,114,182,.12)", border: "1px solid rgba(244,114,182,.3)" }}>
          😊
        </div>

        <div>
          <h1 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2rem,5.5vw,3.2rem)" }}>
            Building Tournament
          </h1>
          <p className="font-display font-semibold" style={{ fontSize: "clamp(1.3rem,3vw,1.8rem)", color: "#f472b6" }}>
            What Makes You Happy
          </p>
          <p className="text-[var(--text-mute)] mt-4 max-w-md mx-auto">
            Build something that shows off who you are — an item, food, animal, emotion, or any combo that makes you happy. A fun way to introduce yourself and show off your personality!
          </p>
          <p className="text-sm text-[var(--text-dim)] mt-3">
            Check Discord or the spawn board for dates.
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl border px-6 sm:px-8 py-6" style={{ borderColor: "rgba(244,114,182,.35)", background: "rgba(244,114,182,.06)" }}>
          <p className="text-xs uppercase tracking-wide text-[var(--text-dim)] mb-3 text-center">Prizes</p>
          <div className="divide-y" style={{ borderColor: "rgba(244,114,182,.2)" }}>
            {PRIZES.map(p => (
              <div key={p.place} className="flex items-center justify-between py-2.5 gap-3">
                <span className="text-sm font-semibold shrink-0" style={{ color: "#f472b6" }}>{p.place}</span>
                <span className="text-sm text-[var(--text)] text-right">{p.gift} + {p.ingame}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-dim)] mt-3 text-center">
            Gift cards can be from anywhere you choose. Every participant gets a reward too!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="https://discord.gg/hPQpgsvZnD" target="_blank" rel="noopener noreferrer"
            className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg,#ec4899,#9333ea)" }}>
            Enter now ↗
          </a>
          <a href="https://discord.gg/hPQpgsvZnD" target="_blank" rel="noopener noreferrer"
            className="rounded-full px-8 py-3.5 text-sm font-semibold border"
            style={{ borderColor: "rgba(244,114,182,.4)", color: "#f472b6" }}>
            Join Discord ↗
          </a>
        </div>
      </motion.div>
    </section>
  );
}

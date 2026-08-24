"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CATEGORIES } from "@/lib/leaderboardData";

export function LeaderboardsHub() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="pt-20 pb-24 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full mb-5"
            style={{ color: "var(--brand-soft)", background: "rgba(147,51,234,.12)" }}>
            🏆 Top 10 rankings
          </span>
          <h1 className="font-display font-bold leading-tight mb-4" style={{ fontSize: "clamp(2.2rem,6vw,3.8rem)" }}>
            Leaderboards
          </h1>
          <p className="text-[var(--text-mute)] max-w-xl mx-auto leading-relaxed">
            Every way to compete on ChaosCraft, ranked. Mining, movement, combat, economy, minigames, and more —
            pick a category below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .05, duration: .4 }}>
              <Link href={`/leaderboards/${cat.slug}`}
                className="group block h-full rounded-2xl border p-6 transition-colors"
                style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h2 className="font-display font-semibold text-lg">{cat.title}</h2>
                </div>
                <p className="text-sm text-[var(--text-mute)] leading-relaxed mb-4">{cat.blurb}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--text-dim)]">{cat.boards.length} leaderboards</span>
                  <span className="text-sm font-semibold group-hover:underline underline-offset-4" style={{ color: cat.accent }}>
                    View →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

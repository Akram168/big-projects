"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CATEGORIES, type Category } from "@/lib/leaderboardData";
import { LeaderboardBoard } from "@/components/leaderboards/LeaderboardBoard";

export function LeaderboardCategoryView({ category }: { category: Category }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="pt-20 pb-24 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto w-full">
        <Link href="/leaderboards" className="inline-block text-sm font-medium text-[var(--text-mute)] hover:text-[var(--text)] transition-colors mb-8">
          ← All leaderboards
        </Link>

        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full mb-5"
            style={{ color: category.accent, background: `${category.accent}18` }}>
            {category.emoji} {category.boards.length} leaderboards
          </span>
          <h1 className="font-display font-bold leading-tight mb-4" style={{ fontSize: "clamp(2.2rem,6vw,3.5rem)" }}>
            {category.title}
          </h1>
          <p className="text-[var(--text-mute)] max-w-xl mx-auto leading-relaxed">{category.blurb}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(c => (
            <Link key={c.slug} href={`/leaderboards/${c.slug}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
              style={{
                borderColor: c.slug === category.slug ? `${c.accent}60` : "var(--border)",
                color: c.slug === category.slug ? c.accent : "var(--text-mute)",
                background: c.slug === category.slug ? `${c.accent}12` : "transparent",
              }}>
              {c.emoji} {c.title}
            </Link>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {category.boards.map(board => (
            <LeaderboardBoard key={board.name} board={board} accent={category.accent} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

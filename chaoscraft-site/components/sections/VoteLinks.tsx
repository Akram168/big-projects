"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SITES = [
  { name: "Minecraft Servers List", emoji: "🌐", href: "https://minecraftservers-list.com/server/chaoscraft" },
  { name: "MC-Servers",             emoji: "🖥️", href: "https://mc-servers.com/vote/6770" },
  { name: "MinecraftServers.org",   emoji: "🌍", href: "https://minecraftservers.org/vote/691167" },
  { name: "Minecraft Buzz",         emoji: "🐝", href: "https://minecraft.buzz/vote/chaoscraft" },
  { name: "Planet Minecraft",       emoji: "🪐", href: "https://www.planetminecraft.com/server/chaoscraft-7009162/vote/" },
  { name: "Minecraft Server List",  emoji: "📜", href: "https://minecraft-server-list.com/server/522254/vote/" },
  { name: "Top Minecraft Servers",  emoji: "🏆", href: "https://topminecraftservers.org/server/43771" },
];

export function VoteLinks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="pt-20 pb-24 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto w-full text-center flex flex-col items-center gap-6">
        <motion.span initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
          style={{ color: "#facc15", background: "rgba(250,204,21,.12)" }}>
          Free daily rewards
        </motion.span>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1, duration: .6 }}
          className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2.2rem,6vw,3.8rem)" }}>
          Vote for ChaosCraft
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2, duration: .5 }}
          className="text-[var(--text-mute)] text-lg leading-relaxed max-w-xl">
          Vote once every 24 hours on each site below to earn <span className="text-[var(--text)] font-semibold">$5,000</span> +{" "}
          <span className="text-[var(--text)] font-semibold">10 Points</span> per vote, and help the server climb the rankings.
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full mt-4">
          {SITES.map((s, i) => (
            <motion.a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: .3 + i * .1, duration: .5 }}
              className="group rounded-2xl border p-6 flex flex-col items-center gap-3 transition-transform hover:scale-[1.03]"
              style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <span className="text-3xl">{s.emoji}</span>
              <span className="font-display font-semibold">{s.name}</span>
              <span className="text-sm font-semibold" style={{ color: "#facc15" }}>Vote now ↗</span>
            </motion.a>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .6 }}
          className="rounded-2xl border px-6 py-4 text-sm text-[var(--text-mute)] mt-2"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          Type <span className="font-mono text-[var(--text)]">/vote</span> in-game for direct links, or{" "}
          <span className="font-mono text-[var(--text)]">/votetop</span> to see the top voters.
        </motion.div>
      </div>
    </section>
  );
}

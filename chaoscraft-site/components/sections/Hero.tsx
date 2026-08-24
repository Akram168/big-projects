"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/ui/CopyButton";

const HeroBlocks = dynamic(() => import("@/components/three/HeroBlocks").then(m => m.HeroBlocks), { ssr: false });

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="absolute inset-0 z-0"><HeroBlocks /></div>

      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 30%, rgba(10,14,23,.55) 70%, var(--bg) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }} />

      <div className="relative z-[2] flex flex-col items-center text-center px-6 pt-28 pb-20 gap-6 max-w-3xl">
        <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
          className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full"
          style={{ color: "var(--brand-soft)", background: "rgba(147,51,234,.12)", border: "1px solid rgba(147,51,234,.3)" }}>
          Est. 2025 · 24/7 uptime
        </motion.span>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .6 }}
          className="font-display font-bold leading-[1.05]" style={{ fontSize: "clamp(2.5rem,6.5vw,4.5rem)" }}>
          Your Minecraft server,<br />built for chaos.
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .6 }}
          className="text-[var(--text-mute)] text-lg max-w-xl leading-relaxed">
          Earth SMP, OneBlock, and Chaos Mode — free to play, Java &amp; Bedrock crossplay, no whitelist.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .6 }}
          className="rounded-2xl border px-6 py-4 flex flex-col items-center gap-3"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-dim)]">Server IP</span>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="font-mono font-bold select-all text-[var(--text)]" style={{ fontSize: "clamp(1rem,2.6vw,1.4rem)" }}>
              play.chaoscraft.online
            </span>
            <CopyButton text="play.chaoscraft.online" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: .5 }}
          className="flex items-center gap-3 flex-wrap justify-center mt-1">
          <a href="https://discord.gg/hPQpgsvZnD" target="_blank" rel="noopener noreferrer"
            className="rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: "#5865f2" }}>
            Join Discord
          </a>
          <a href="https://chaos-craft.tebex.io/" target="_blank" rel="noopener noreferrer"
            className="rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea,#c026d3)" }}>
            Visit Shop
          </a>
        </motion.div>
      </div>
    </section>
  );
}

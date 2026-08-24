"use client";
import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { CopyButton } from "@/components/ui/CopyButton";

const DISCORD_URL = "https://discord.gg/hPQpgsvZnD";

function CodeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
      style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
      <div>
        <span className="text-[11px] uppercase tracking-wide text-[var(--text-dim)] block mb-0.5">{label}</span>
        <span className="font-mono text-sm font-semibold text-[var(--text)] select-all">{value}</span>
      </div>
      <CopyButton text={value} label="Copy" className="text-xs px-3 py-1.5" />
    </div>
  );
}

function Step({ n, color, children }: { n: number; color: string; children: ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="flex-shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center rounded-full text-[11px] font-semibold"
        style={{ background: `${color}20`, color }}>
        {n}
      </span>
      <div className="text-sm text-[var(--text-mute)] leading-relaxed pt-0.5 flex-1">{children}</div>
    </li>
  );
}

function JoinCard({ emoji, title, subtitle, color, children }: {
  emoji: string; title: string; subtitle: string; color: string; children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border p-7 sm:p-8 flex flex-col gap-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h3 className="font-display font-semibold text-xl">{title}</h3>
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color }}>{subtitle}</p>
        </div>
      </div>
      <ol className="space-y-4">{children}</ol>
    </div>
  );
}

export function HowToJoin() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5 }}
          className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--brand-soft)] mb-3">How to join</p>
          <h2 className="font-display font-semibold leading-tight" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
            Joining takes 15 seconds
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: .1, duration: .6 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <JoinCard emoji="☕" title="Java Edition" subtitle="PC · any version" color="#9333ea">
            <Step n={1} color="#9333ea">Open Minecraft and click <span className="text-[var(--text)]">Multiplayer</span>.</Step>
            <Step n={2} color="#9333ea">Click <span className="text-[var(--text)]">Add Server</span>.</Step>
            <Step n={3} color="#9333ea">
              <span className="block mb-2">Paste the server address:</span>
              <CodeRow label="Server Address" value="play.chaoscraft.online" />
            </Step>
            <Step n={4} color="#9333ea">Join the server and pick your gamemode!</Step>
          </JoinCard>

          <JoinCard emoji="📱" title="Bedrock Edition" subtitle="Mobile, console & Windows" color="#22d3ee">
            <Step n={1} color="#22d3ee">Open Minecraft, go to <span className="text-[var(--text)]">Play → Servers</span>.</Step>
            <Step n={2} color="#22d3ee">Scroll down and click <span className="text-[var(--text)]">Add Server</span>.</Step>
            <Step n={3} color="#22d3ee">
              <span className="block mb-2">Enter these details:</span>
              <div className="space-y-2">
                <CodeRow label="Server Address" value="31.97.122.176" />
                <CodeRow label="Port" value="19132" />
              </div>
            </Step>
            <Step n={4} color="#22d3ee">Save and join — pick your gamemode!</Step>
          </JoinCard>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .3, duration: .5 }}
          className="text-center text-sm text-[var(--text-mute)] mt-10">
          Need help joining? <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer"
            className="text-[var(--brand-soft)] hover:underline underline-offset-4">
            Open a support ticket on Discord ↗
          </a>
        </motion.p>
      </div>
    </section>
  );
}

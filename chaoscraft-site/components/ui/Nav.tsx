"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyButton } from "./CopyButton";

const PAGES = [
  { label: "Home",       href: "/" },
  { label: "Earth",      href: "/earth" },
  { label: "OneBlock",   href: "/oneblock" },
  { label: "Chaos Mode", href: "/chaos-mode" },
  { label: "Events",     href: "/events" },
  { label: "Rules",      href: "/rules" },
  { label: "Commands",   href: "/commands" },
  { label: "Vote",       href: "/vote" },
  { label: "Dragon Gear", href: "/dragon-gear" },
  { label: "Leaderboards", href: "/leaderboards" },
];

const EXTERNAL = [
  { label: "Map",     href: "http://31.97.122.176:8083/",       accent: "#22d3ee" },
  { label: "Shop",    href: "https://chaos-craft.tebex.io/",    accent: "#c084fc" },
  { label: "Discord", href: "https://discord.gg/hPQpgsvZnD",     accent: "#5865f2" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-[900] border-b" style={{ borderColor: "var(--border)", background: "rgba(10,14,23,.92)", backdropFilter: "blur(10px)" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 h-16">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="ChaosCraft" width={30} height={30} className="rounded-lg" />
          <span className="font-display font-semibold text-[15px] tracking-tight text-[var(--text)] hidden sm:inline">
            ChaosCraft
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-1">
          {PAGES.map(p => {
            const active = pathname === p.href;
            return (
              <Link key={p.href} href={p.href}
                className="relative px-3.5 py-2 text-sm font-medium rounded-full transition-colors"
                style={{ color: active ? "var(--text)" : "var(--text-mute)", background: active ? "var(--bg-card)" : "transparent" }}>
                {p.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center gap-2">
          <CopyButton text="play.chaoscraft.online" label="Copy IP" />
          {EXTERNAL.map(e => (
            <a key={e.label} href={e.href} target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium px-3.5 py-2 rounded-full border transition-colors"
              style={{ borderColor: `${e.accent}40`, color: e.accent }}>
              {e.label}
            </a>
          ))}
        </div>

        <button aria-label="Toggle menu" onClick={() => setOpen(v => !v)}
          className="xl:hidden flex flex-col gap-1.5 p-2">
          <span className="w-5 h-0.5 bg-[var(--text)] transition-transform" style={{ transform: open ? "translateY(4px) rotate(45deg)" : "none" }} />
          <span className="w-5 h-0.5 bg-[var(--text)]" style={{ opacity: open ? 0 : 1 }} />
          <span className="w-5 h-0.5 bg-[var(--text)] transition-transform" style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : "none" }} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: .25 }} className="xl:hidden overflow-hidden border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex flex-col gap-1 px-5 py-4">
              {PAGES.map(p => (
                <Link key={p.href} href={p.href} onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium"
                  style={{ color: pathname === p.href ? "var(--text)" : "var(--text-mute)", background: pathname === p.href ? "var(--bg-card)" : "transparent" }}>
                  {p.label}
                </Link>
              ))}
              <div className="h-px my-2" style={{ background: "var(--border)" }} />
              <div className="flex flex-wrap gap-2 px-3">
                {EXTERNAL.map(e => (
                  <a key={e.label} href={e.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium px-3.5 py-2 rounded-full border"
                    style={{ borderColor: `${e.accent}40`, color: e.accent }}>
                    {e.label}
                  </a>
                ))}
              </div>
              <div className="px-3 pt-2">
                <CopyButton text="play.chaoscraft.online" label="Copy Server IP" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

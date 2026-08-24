"use client";
import Link from "next/link";
import Image from "next/image";
import { CopyButton } from "@/components/ui/CopyButton";

const SITE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Earth", href: "/earth" },
  { label: "OneBlock", href: "/oneblock" },
  { label: "Chaos Mode", href: "/chaos-mode" },
  { label: "Events", href: "/events" },
  { label: "Rules", href: "/rules" },
  { label: "Commands", href: "/commands" },
  { label: "Vote", href: "/vote" },
  { label: "Dragon Gear", href: "/dragon-gear" },
  { label: "Leaderboards", href: "/leaderboards" },
];

const EXTERNAL_LINKS = [
  { label: "Live Map", href: "http://31.97.122.176:8083/" },
  { label: "Shop", href: "https://chaos-craft.tebex.io/" },
  { label: "Discord", href: "https://discord.gg/hPQpgsvZnD" },
];

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="ChaosCraft" width={32} height={32} className="rounded-lg" />
            <span className="font-display font-semibold text-lg">ChaosCraft</span>
          </div>
          <p className="text-sm text-[var(--text-mute)] leading-relaxed max-w-xs">
            A free Minecraft server with Earth SMP, OneBlock, and Chaos Mode. Java &amp; Bedrock crossplay, no whitelist.
          </p>
          <CopyButton text="play.chaoscraft.online" label="Copy Server IP" className="self-start" />
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">Pages</span>
          {SITE_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-sm text-[var(--text-mute)] hover:text-[var(--text)] transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">Links</span>
          {EXTERNAL_LINKS.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="text-sm text-[var(--text-mute)] hover:text-[var(--text)] transition-colors">
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <p className="max-w-7xl mx-auto px-5 sm:px-6 py-6 text-xs text-[var(--text-dim)]">
          © ChaosCraft 2026 — Not affiliated with Mojang or Microsoft.
        </p>
      </div>
    </footer>
  );
}

"use client";
import { useMemo, useState } from "react";

type Cmd = { cmd: string; desc: string };
type Category = { title: string; emoji: string; commands: Cmd[] };

const CATEGORIES: Category[] = [
  {
    title: "Getting Around",
    emoji: "🧭",
    commands: [
      { cmd: "/worlds", desc: "World-select menu — travel between Earth, Nether, End, and the Resource worlds" },
      { cmd: "/spawn", desc: "Teleport to the main hub/spawn" },
      { cmd: "/rtp", desc: "Randomly teleport within your current world" },
      { cmd: "/back", desc: "Return to your last location (before a teleport/death)" },
      { cmd: "/tpa <player>", desc: "Request to teleport to another player" },
      { cmd: "/tpahere <player>", desc: "Request another player teleport to you" },
      { cmd: "/tpaccept, /tpdeny", desc: "Accept or deny a teleport request" },
    ],
  },
  {
    title: "Homes & Warps",
    emoji: "🏠",
    commands: [
      { cmd: "/sethome [name]", desc: "Set a home at your location" },
      { cmd: "/home [name]", desc: "Teleport to a home" },
      { cmd: "/delhome [name]", desc: "Delete a home" },
      { cmd: "/homes", desc: "List your homes" },
      { cmd: "/warp", desc: "Browse & use public player-made warps" },
      { cmd: "/pwarp create", desc: "Create your own public player warp" },
    ],
  },
  {
    title: "Economy & Trading",
    emoji: "💰",
    commands: [
      { cmd: "/balance", desc: "Check your money" },
      { cmd: "/pay <player> <amount>", desc: "Send money to another player" },
      { cmd: "/baltop", desc: "Richest players leaderboard" },
      { cmd: "/points", desc: "Check your Points balance (currency for /pointshop)" },
      { cmd: "/sell, /sellall", desc: "Sell items from hand or inventory" },
      { cmd: "/worth <item>", desc: "Check what an item sells for" },
      { cmd: "/ah", desc: "Open the Auction House" },
      { cmd: "/shop", desc: "Open the buy/sell shop menu" },
      { cmd: "/qs", desc: "QuickShop help (shift+right-click a chest to make your own shop)" },
      { cmd: "/axtrade <player>", desc: "Send a secure player-to-player trade request" },
      { cmd: "/jobs join <job>", desc: "Join a job to start earning from it" },
      { cmd: "/jobs browse, /jobs stats, /jobs top", desc: "View jobs, your stats, and leaderboards" },
    ],
  },
  {
    title: "Land & Storage",
    emoji: "🏡",
    commands: [
      { cmd: "/claimmenu", desc: "GUI for managing your claim (PVP, mobs, trust, etc.)" },
      { cmd: "/claim", desc: "Claim land with a golden shovel" },
      { cmd: "/trust <player>, /untrust <player>", desc: "Give/remove build access on your claim" },
      { cmd: "/abandonclaim", desc: "Delete a claim and get blocks back" },
      { cmd: "/claimblocks", desc: "Opens the shop to buy extra claim blocks" },
      { cmd: "/vault, /pv <number>", desc: "Opens a specific vault by number, e.g. /pv 1, /pv 2" },
    ],
  },
  {
    title: "Cosmetics & Customization",
    emoji: "🎨",
    commands: [
      { cmd: "/customize, /cos", desc: "Cosmetics menu" },
      { cmd: "/chatcolor", desc: "Change your chat color" },
      { cmd: "/namecolor, /namestyle", desc: "Style your name tag" },
      { cmd: "/tags", desc: "Pick a tag/prefix you've unlocked" },
      { cmd: "/emote", desc: "Play an emote animation" },
      { cmd: "/sit, /lay, /crawl", desc: "Sit/lay/crawl poses" },
    ],
  },
  {
    title: "Minigames & Events",
    emoji: "🎮",
    commands: [
      { cmd: "/timers", desc: "See when the next KOTH, Fishing, Farming, or Dragon event starts" },
      { cmd: "/dragon", desc: "Join the Weekly Dragon boss fight" },
      { cmd: "/parkour", desc: "Join the active Parkour event" },
      { cmd: "/duel <player>", desc: "Challenge someone to a 1v1 duel" },
      { cmd: "/queue", desc: "Join the ranked duel queue" },
      { cmd: "/ma join", desc: "Join a MobArena wave-survival match" },
      { cmd: "/spleef", desc: "Join a Spleef match" },
      { cmd: "/squidgame", desc: "Join Squid Game minigame" },
    ],
  },
  {
    title: "Voting & Rewards",
    emoji: "🎁",
    commands: [
      { cmd: "/vote", desc: "Get voting site links (rewards for voting)" },
      { cmd: "/votetop", desc: "Top voters leaderboard" },
      { cmd: "/crateshop, /crates", desc: "Browse and buy crate keys" },
      { cmd: "/pointshop, /ps", desc: "Spend Points on exclusive items/perks" },
      { cmd: "/starterkit", desc: "Claim your starter kit — one-time only, can't be redeemed again" },
      { cmd: "/kit", desc: "View/claim available kits" },
      { cmd: "/guide", desc: "Get the server guidebook" },
    ],
  },
  {
    title: "Pets & Utility",
    emoji: "🐾",
    commands: [
      { cmd: "/pets", desc: "Manage your pets" },
      { cmd: "/workbench, /anvil, /enderchest, /disposal", desc: "Portable crafting/utility stations, usable anywhere" },
      { cmd: "/afk", desc: "Mark yourself away" },
      { cmd: "/recipe <item>", desc: "Show how to craft an item" },
      { cmd: "/discord", desc: "Get the Discord invite link" },
    ],
  },
];

export function UsefulCommands() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES
      .map(cat => ({
        ...cat,
        commands: cat.commands.filter(c => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)),
      }))
      .filter(cat => cat.commands.length > 0);
  }, [query]);

  return (
    <section className="pt-20 pb-24 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--brand-soft)] mb-3">Player guide</p>
          <h1 className="font-display font-bold leading-tight mb-4" style={{ fontSize: "clamp(2.2rem,6vw,3.5rem)" }}>
            Useful Commands
          </h1>
          <p className="text-[var(--text-mute)] max-w-xl mx-auto">
            Everything you need to get around, trade, build, and play on ChaosCraft.
          </p>
          <p className="text-sm text-[var(--text-dim)] max-w-xl mx-auto mt-3">
            Note: not every command works for every player — some require a rank.
          </p>
        </div>

        <div className="mb-10 max-w-md mx-auto">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands…"
            className="w-full rounded-full border px-5 py-3 text-sm outline-none focus:border-[var(--brand)] transition-colors"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text)" }}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-[var(--text-mute)]">No commands match &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map(cat => (
              <div key={cat.title} className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <span>{cat.emoji}</span> {cat.title}
                </h2>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {cat.commands.map(c => (
                    <div key={c.cmd} className="py-2.5 flex flex-col gap-0.5" style={{ borderColor: "var(--border)" }}>
                      <span className="font-mono text-sm font-semibold" style={{ color: "var(--brand-soft)" }}>{c.cmd}</span>
                      <span className="text-sm text-[var(--text-mute)] leading-relaxed">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";
import { useMemo, useState } from "react";

type Ability = { name: string; desc: string };
type Item = { name: string; emoji: string; passives: string[]; abilities: Ability[] };
type Category = { title: string; items: Item[] };

const CATEGORIES: Category[] = [
  {
    title: "Weapons",
    items: [
      {
        name: "Dragon Sword", emoji: "⚔️",
        passives: ["Speed II while held", "Hits ignite the target", "Rare chance to drop a Dragon Tail on kill"],
        abilities: [
          { name: "Flame Ring", desc: "Sneak + right click (45s cooldown) — a ring of fire damages, ignites, and knocks back everything nearby." },
          { name: "Dragon's Roar", desc: "Double sneak (60s cooldown) — knocks back everything around you." },
        ],
      },
      {
        name: "Dragon Greatsword", emoji: "🗡️",
        passives: ["Strength III while held", "Wildfire — hits ignite the target and splash-ignite nearby enemies", "Execute — bonus damage against targets below 25% health"],
        abilities: [
          { name: "Inferno Slash", desc: "Sneak + right click (40s cooldown) — AoE fire damage around you, plus a Strength buff for yourself." },
          { name: "Dragonfall", desc: "Double sneak (70s cooldown) — launches you into the air, then slams down for AoE damage on landing." },
        ],
      },
      {
        name: "Dragon Spear", emoji: "🔱",
        passives: ["Strength I while held", "Lance Strike — hits also damage and poison a second enemy standing behind your target"],
        abilities: [
          { name: "Skewer", desc: "Sneak + right click (25s cooldown) — a heavy single-target thrust with knockback." },
          { name: "Dragon's Charge", desc: "Double sneak (50s cooldown) — lunge forward, damaging everything on impact." },
        ],
      },
      {
        name: "Dragon Axe", emoji: "🪓",
        passives: ["Strength II while held", "Tree Feller — breaking one log chops the whole tree above it straight into your inventory"],
        abilities: [
          { name: "Dragon's Cleave", desc: "Sneak + right click (60s cooldown) — AoE damage and knockback around you." },
          { name: "Charge", desc: "Double sneak (45s cooldown) — dash forward, then deal AoE damage on impact." },
        ],
      },
      {
        name: "Dragon Bow", emoji: "🏹",
        passives: ["Night Vision while held", "Arrows ignite their target", "Chance for \"Dragon's Wrath\" — bonus damage plus a small explosion"],
        abilities: [
          { name: "Phoenix Surge", desc: "Double sneak (60s cooldown) — Speed, Fire Resistance, and Regeneration for 8 seconds." },
        ],
      },
      {
        name: "Dragon Crossbow", emoji: "🎯",
        passives: ["Slow Falling while held", "Bolts ignite their target", "Chance for \"Dragon's Wrath\" — bonus damage plus a small explosion"],
        abilities: [
          { name: "Adrenaline Rush", desc: "Double sneak (60s cooldown) — Speed, Jump Boost, and Haste for 8 seconds." },
        ],
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        name: "Dragon Shovel", emoji: "⛏️",
        passives: ["Chance for temporary Haste while digging", "Chance to dig up bonus money"],
        abilities: [
          { name: "Dig Mode", desc: "Sneak + right click — cycles the digging area from 1×1 up to 5×5." },
          { name: "Terraform", desc: "Sneak + left click (60s cooldown) — turns a 10×10 patch of dirt into grass." },
          { name: "Double Jump", desc: "Jump twice quickly to launch yourself upward." },
        ],
      },
      {
        name: "Dragon Hoe", emoji: "🌾",
        passives: ["Saturation while held", "Auto-harvests and auto-replants crops, with a chance of bonus \"Bountiful Harvest\" crops"],
        abilities: [
          { name: "Sow Field", desc: "Sneak + right click (10s cooldown) — plants seeds across a 5×5 area." },
          { name: "Till", desc: "Sneak + left click (8s cooldown) — turns dirt/grass into farmland across a 3×3 area." },
          { name: "Farmer's Frenzy", desc: "Double sneak (90s cooldown) — Haste III and Speed II for 15 seconds." },
        ],
      },
      {
        name: "Dragon Fishing Rod", emoji: "🎣",
        passives: ["Chance for a bonus catch on every reel-in", "Chance for bonus coins from sunken treasure", "Very rare chance to fish up a Dragon Crate key"],
        abilities: [
          { name: "Tidal Call", desc: "Sneak + right click (60s cooldown) — pulls nearby fish toward you." },
          { name: "Reel Master", desc: "Double sneak (90s cooldown) — temporary Luck and Haste burst." },
        ],
      },
    ],
  },
  {
    title: "Defense",
    items: [
      {
        name: "Dragon Shield", emoji: "🛡️",
        passives: ["Fire Resistance while held", "Reduced damage taken, and attackers briefly catch fire"],
        abilities: [
          { name: "Dragon's Bulwark", desc: "Sneak + right click (75s cooldown) — Resistance IV and Fire Resistance for 8 seconds." },
          { name: "Shield Slam", desc: "Double sneak (45s cooldown) — AoE knockback and damage around you." },
        ],
      },
      {
        name: "Dragon Armor Set", emoji: "🐉",
        passives: [
          "Helmet: Night Vision, Water Breathing, and blindness immunity",
          "Chestplate: reduced damage taken, attackers briefly catch fire",
          "Leggings: immune to fall damage",
          "Boots: Saturation, immune to lava damage, chance to ignite nearby hostile mobs",
        ],
        abilities: [
          { name: "Last Stand (Helmet)", desc: "Automatic Resistance II when your health drops critically low (60s cooldown)." },
          { name: "Echo (Helmet)", desc: "Passive chance to reveal (glow) nearby hostile mobs." },
          { name: "Second Wind (Chestplate)", desc: "Survive a fatal hit at 1 HP with brief invulnerability (120s cooldown)." },
          { name: "Sprint Burst (Leggings)", desc: "Sneak + right click (20s cooldown) — temporary Speed III." },
          { name: "Hop (Boots)", desc: "Double sneak — a small vertical hop." },
          { name: "Dragonheart (Full Set)", desc: "Wearing all four pieces grants passive Regeneration and Strength, plus a small chance to fully negate any hit." },
        ],
      },
    ],
  },
];

export function DragonGearAbilities() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES
      .map(cat => ({
        ...cat,
        items: cat.items.filter(it =>
          it.name.toLowerCase().includes(q) ||
          it.passives.some(p => p.toLowerCase().includes(q)) ||
          it.abilities.some(a => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q))
        ),
      }))
      .filter(cat => cat.items.length > 0);
  }, [query]);

  return (
    <section className="pt-20 pb-24 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full mb-5"
            style={{ color: "var(--brand-soft)", background: "rgba(147,51,234,.12)" }}>
            🐉 Current monthly crate
          </span>
          <h1 className="font-display font-bold leading-tight mb-4" style={{ fontSize: "clamp(2.2rem,6vw,3.5rem)" }}>
            Dragon Gear Abilities
          </h1>
          <p className="text-[var(--text-mute)] max-w-xl mx-auto">
            Every weapon, tool, and armor piece in the Dragon Crate has its own passive effects and special abilities.
          </p>
        </div>

        <div className="mb-10 max-w-md mx-auto">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search items or abilities…"
            className="w-full rounded-full border px-5 py-3 text-sm outline-none focus:border-[var(--brand)] transition-colors"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text)" }}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-[var(--text-mute)]">No items match &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="flex flex-col gap-10">
            {filtered.map(cat => (
              <div key={cat.title}>
                <h2 className="font-display font-semibold text-xl mb-4">{cat.title}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {cat.items.map(item => (
                    <div key={item.name} className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                      <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                        <span>{item.emoji}</span> {item.name}
                      </h3>

                      <div className="mb-3">
                        <p className="text-[11px] uppercase tracking-wide text-[var(--text-dim)] mb-1.5">Passive</p>
                        <ul className="space-y-1">
                          {item.passives.map(p => (
                            <li key={p} className="text-sm text-[var(--text-mute)] leading-relaxed flex gap-2">
                              <span className="shrink-0" style={{ color: "var(--brand-soft)" }}>•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {item.abilities.length > 0 && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-[var(--text-dim)] mb-1.5">Abilities</p>
                          <div className="space-y-2">
                            {item.abilities.map(a => (
                              <div key={a.name}>
                                <span className="text-sm font-semibold" style={{ color: "var(--brand-soft)" }}>{a.name}</span>
                                <p className="text-sm text-[var(--text-mute)] leading-relaxed">{a.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

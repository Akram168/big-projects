import Link from "next/link";
import type { Metadata } from "next";
import { EarthMode }      from "@/components/sections/EarthMode";
import { LiveMap }        from "@/components/sections/LiveMap";
import { WorldShowcase }  from "@/components/sections/WorldShowcase";
import { ShopCTA }        from "@/components/sections/ShopCTA";

export const metadata: Metadata = {
  title: "Earth SMP — ChaosCraft",
  description: "A scaled Earth for a fun, friendly community. Claim your country, build your city, and enjoy custom items, tournaments, and minigames.",
};

export default function EarthPage() {
  return (
    <main>
      <EarthMode />
      <LiveMap />
      <WorldShowcase />

      <section className="px-5 sm:px-6 pb-8">
        <div className="max-w-4xl mx-auto rounded-2xl border p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <div>
            <h3 className="font-display font-semibold text-xl mb-1">Tournaments & events</h3>
            <p className="text-sm text-[var(--text-mute)]">PvP, farming, fishing, KOTH, and the weekly Dragon boss fight — all on Earth SMP.</p>
          </div>
          <Link href="/events" className="shrink-0 text-sm font-semibold text-emerald-400 hover:underline underline-offset-4">
            See all events →
          </Link>
        </div>
      </section>

      <ShopCTA />
    </main>
  );
}

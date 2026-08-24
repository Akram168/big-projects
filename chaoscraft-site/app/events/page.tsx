import type { Metadata } from "next";
import { TournamentBanner } from "@/components/sections/TournamentBanner";
import { DragonBossEvent }  from "@/components/sections/DragonBossEvent";
import { RecurringEvents }  from "@/components/sections/RecurringEvents";
import { PvPShowcase }      from "@/components/sections/PvPShowcase";
import { ShopCTA }          from "@/components/sections/ShopCTA";

export const metadata: Metadata = {
  title: "Events — ChaosCraft",
  description: "Weekly Ender Dragon boss fight, KOTH, fishing and farming tournaments, and the What Makes You Happy building tournament.",
};

export default function EventsPage() {
  return (
    <main>
      <TournamentBanner />
      <DragonBossEvent />
      <RecurringEvents />
      <PvPShowcase />
      <ShopCTA />
    </main>
  );
}

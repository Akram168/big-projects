import type { Metadata } from "next";
import { LeaderboardsHub } from "@/components/sections/LeaderboardsHub";

export const metadata: Metadata = {
  title: "Leaderboards — ChaosCraft",
  description: "Top 10 rankings across every category on ChaosCraft — mining, movement, combat, economy, minigames, and more.",
};

export default function LeaderboardsPage() {
  return (
    <main>
      <LeaderboardsHub />
    </main>
  );
}

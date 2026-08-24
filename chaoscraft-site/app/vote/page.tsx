import type { Metadata } from "next";
import { VoteLinks } from "@/components/sections/VoteLinks";

export const metadata: Metadata = {
  title: "Vote — ChaosCraft",
  description: "Vote for ChaosCraft daily on Planet Minecraft, Minecraft Server List, and Top Minecraft Servers for free in-game rewards.",
};

export default function VotePage() {
  return (
    <main>
      <VoteLinks />
    </main>
  );
}

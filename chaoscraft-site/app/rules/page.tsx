import type { Metadata } from "next";
import { Rules } from "@/components/sections/Rules";

export const metadata: Metadata = {
  title: "Rules — ChaosCraft",
  description: "ChaosCraft's rules for Discord and the Minecraft server — kept fun, respectful, and safe for everyone.",
};

export default function RulesPage() {
  return (
    <main>
      <Rules />
    </main>
  );
}

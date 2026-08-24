import type { Metadata } from "next";
import { DragonGearAbilities } from "@/components/sections/DragonGearAbilities";

export const metadata: Metadata = {
  title: "Dragon Gear Abilities — ChaosCraft",
  description: "Every weapon, tool, and armor piece in the current monthly Dragon Crate, with all of its passive effects and special abilities.",
};

export default function DragonGearPage() {
  return (
    <main>
      <DragonGearAbilities />
    </main>
  );
}

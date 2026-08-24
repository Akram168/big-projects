import type { Metadata } from "next";
import { OneblockMode } from "@/components/sections/OneblockMode";
import { ShopCTA }       from "@/components/sections/ShopCTA";

export const metadata: Metadata = {
  title: "OneBlock — ChaosCraft",
  description: "Start with one block. Mine it — it respawns, different, forever. Coming soon to ChaosCraft.",
};

export default function OneblockPage() {
  return (
    <main>
      <OneblockMode />
      <ShopCTA />
    </main>
  );
}

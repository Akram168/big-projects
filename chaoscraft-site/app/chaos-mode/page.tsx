import type { Metadata } from "next";
import { ChaosMode } from "@/components/sections/ChaosMode";
import { ShopCTA }    from "@/components/sections/ShopCTA";

export const metadata: Metadata = {
  title: "Chaos Mode — ChaosCraft",
  description: "No rules, no admins watching, hacked clients welcome. A small 2b2t — without the queue. Coming soon.",
};

export default function ChaosModePage() {
  return (
    <main>
      <ChaosMode />
      <ShopCTA />
    </main>
  );
}

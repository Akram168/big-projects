import { Hero }               from "@/components/sections/Hero";
import { ServersGrid }        from "@/components/sections/ServersGrid";
import { HowToJoin }          from "@/components/sections/HowToJoin";
import { EventsTeaser }       from "@/components/sections/EventsTeaser";
import { CustomItemsShowcase } from "@/components/sections/CustomItemsShowcase";
import { WorldShowcase }      from "@/components/sections/WorldShowcase";
import { ShopCTA }            from "@/components/sections/ShopCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServersGrid />
      <HowToJoin />
      <EventsTeaser />
      <CustomItemsShowcase />
      <WorldShowcase />
      <ShopCTA />
    </main>
  );
}

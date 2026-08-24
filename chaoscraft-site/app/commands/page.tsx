import type { Metadata } from "next";
import { UsefulCommands } from "@/components/sections/UsefulCommands";

export const metadata: Metadata = {
  title: "Commands — ChaosCraft",
  description: "Useful in-game commands for ChaosCraft players.",
};

export default function CommandsPage() {
  return (
    <main>
      <UsefulCommands />
    </main>
  );
}

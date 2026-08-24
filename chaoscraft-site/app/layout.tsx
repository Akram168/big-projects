import type { Metadata } from "next";
import { Baloo_2, Inter, Geist_Mono } from "next/font/google";
import { LenisProvider } from "@/lib/lenis";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/sections/Footer";
import "./globals.css";

const baloo2   = Baloo_2({ subsets:["latin"], variable:"--font-display" });
const inter    = Inter({ subsets:["latin"], variable:"--font-body" });
const geistMono = Geist_Mono({ subsets:["latin"], variable:"--font-mono" });

export const metadata: Metadata = {
  title: "ChaosCraft — Minecraft Server | Java & Bedrock",
  description: "Play ChaosCraft at play.chaoscraft.online — Earth SMP, OneBlock, Chaos Mode, and weekly events. Java & Bedrock crossplay.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo2.variable} ${inter.variable} ${geistMono.variable}`}>
      <body className="bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
        <LenisProvider>
          <Nav />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}

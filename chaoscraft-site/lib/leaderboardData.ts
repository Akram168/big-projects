export type Board = { name: string; desc?: string };
export type Category = { slug: string; title: string; emoji: string; accent: string; blurb: string; boards: Board[] };

export const CATEGORIES: Category[] = [
  {
    slug: "mining", title: "Mining", emoji: "⛏️", accent: "#eab308",
    blurb: "Who's dug the deepest and hauled the most out of the ground.",
    boards: [
      { name: "Most Blocks Mined" },
      { name: "Most Diamonds Mined" },
      { name: "Most Ancient Debris Mined" },
      { name: "Most Emeralds Mined" },
      { name: "Most Iron Mined" },
      { name: "Most Deepslate Mined" },
    ],
  },
  {
    slug: "movement", title: "Movement", emoji: "🏃", accent: "#22d3ee",
    blurb: "Every way you can cover ground on ChaosCraft, ranked.",
    boards: [
      { name: "Most Distance Walked" },
      { name: "Most Distance Sprinted" },
      { name: "Most Distance Swum" },
      { name: "Most Distance Flown (Elytra)" },
      { name: "Most Distance by Boat" },
      { name: "Most Distance by Minecart" },
    ],
  },
  {
    slug: "combat", title: "Combat", emoji: "⚔️", accent: "#fb7185",
    blurb: "Kills, deaths, and everything in between.",
    boards: [
      { name: "Most Mob Kills" },
      { name: "Most Player Kills" },
      { name: "Most Deaths" },
      { name: "Most Damage Dealt" },
      { name: "Longest Kill Streak" },
    ],
  },
  {
    slug: "building", title: "Building", emoji: "🧱", accent: "#fb923c",
    blurb: "Placed blocks and claimed land across the map.",
    boards: [
      { name: "Most Blocks Placed" },
      { name: "Largest Claimed Area" },
      { name: "Most Claims Owned" },
    ],
  },
  {
    slug: "economy", title: "Economy", emoji: "💰", accent: "#34d399",
    blurb: "Who's actually rich around here.",
    boards: [
      { name: "Richest Players (Balance)" },
      { name: "Most Points Earned" },
      { name: "Most Spent in Shop" },
      { name: "Top Auction House Sellers" },
    ],
  },
  {
    slug: "jobs", title: "Jobs", emoji: "💼", accent: "#818cf8",
    blurb: "Top earners in every job on the server.",
    boards: [
      { name: "Top Miners" },
      { name: "Top Farmers" },
      { name: "Top Builders" },
      { name: "Top Fishermen" },
      { name: "Top Hunters" },
    ],
  },
  {
    slug: "fishing", title: "Fishing", emoji: "🎣", accent: "#38bdf8",
    blurb: "Reel it in — catches, treasure, and tournament wins.",
    boards: [
      { name: "Most Fish Caught" },
      { name: "Most Treasure Found" },
      { name: "Fishing Tournament Wins" },
    ],
  },
  {
    slug: "farming", title: "Farming", emoji: "🌾", accent: "#a3e635",
    blurb: "Harvests and farming tournament champions.",
    boards: [
      { name: "Most Crops Harvested" },
      { name: "Farming Tournament Wins" },
    ],
  },
  {
    slug: "pvp-minigames", title: "PvP & Minigames", emoji: "🏆", accent: "#e879f9",
    blurb: "KOTH, duels, Spleef, and every minigame on the network.",
    boards: [
      { name: "KOTH Wins" },
      { name: "Duel Wins" },
      { name: "Spleef Wins" },
      { name: "MobArena Wins" },
      { name: "Squid Game Wins" },
    ],
  },
  {
    slug: "dragon-boss", title: "Dragon Boss", emoji: "🐉", accent: "#9333ea",
    blurb: "The weekly Ender Dragon fight, ranked all-time.",
    boards: [
      { name: "Most Damage Dealt (Weekly)" },
      { name: "Most Dragon Kills (All-Time)" },
      { name: "Most Dragon Crate Keys Earned" },
    ],
  },
  {
    slug: "voting", title: "Voting", emoji: "🗳️", accent: "#facc15",
    blurb: "The players keeping ChaosCraft climbing the server lists.",
    boards: [
      { name: "Top Voters (All-Time)" },
      { name: "Top Voters (This Month)" },
    ],
  },
  {
    slug: "playtime", title: "Playtime", emoji: "⏱️", accent: "#94a3b8",
    blurb: "The most dedicated (or most online) players.",
    boards: [
      { name: "Most Time Played" },
      { name: "Longest Single Session" },
    ],
  },
];

export function getCategory(slug: string) {
  return CATEGORIES.find(c => c.slug === slug);
}

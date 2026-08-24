import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/leaderboardData";
import { LeaderboardCategoryView } from "@/components/sections/LeaderboardCategoryView";

export function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.title} Leaderboards — ChaosCraft`,
    description: category.blurb,
  };
}

export default async function LeaderboardCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <main>
      <LeaderboardCategoryView category={category} />
    </main>
  );
}

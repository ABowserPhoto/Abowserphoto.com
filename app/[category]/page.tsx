import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import CategoryTemplate from "../../components/CategoryTemplate";
import { categoryContentMap, categoryNavigation } from "../../lib/content";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

export function generateStaticParams() {
  return categoryNavigation.map((item) => ({ category: item.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const selectedCategory = categoryContentMap[category];

  if (!selectedCategory) {
    notFound();
  }

  const portfolioFolder = category === "commercial" ? "creative" : category;
  const categoryFolderPath = path.join(process.cwd(), "public", "portfolio", portfolioFolder);
  let portfolioImages: string[] = [];

  try {
    const imageFiles = fs
      .readdirSync(categoryFolderPath)
      .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
    portfolioImages = shuffleArray(imageFiles).map(
      (file) => `/portfolio/${portfolioFolder}/${file}`
    );
  } catch {
    portfolioImages = [];
  }

  return (
    <CategoryTemplate
      category={{ ...selectedCategory, portfolioImages }}
      navItems={categoryNavigation}
    />
  );
}

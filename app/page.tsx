import HomePortal from "../components/HomePortal";
import { getCategoryHeroes, getLogoUrl } from "../lib/cms";
import { categoryNavigation } from "../lib/content";

export default function HomePage() {
  const categorySlugs = categoryNavigation.map((item) => item.slug);
  const categoryHeroes = getCategoryHeroes(categorySlugs);
  const logoUrl = getLogoUrl();

  return <HomePortal categoryHeroes={categoryHeroes} logoUrl={logoUrl} />;
}

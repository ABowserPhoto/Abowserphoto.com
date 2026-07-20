import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import CategoryTemplate from "../../components/CategoryTemplate";
import { getAboutImageUrl, getImageDimensions, getLogoUrl } from "../../lib/cms";
import { categoryContentMap, categoryNavigation, sharedAbout, type FAQItem } from "../../lib/content";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return categoryNavigation.map((item) => ({ category: item.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const selectedCategory = categoryContentMap[category as keyof typeof categoryContentMap];

  if (!selectedCategory) {
    notFound();
  }

  // File-System CMS: drop images into public/[category]/portfolio/
  const directoryPath = path.join(process.cwd(), "public", category, "portfolio");
  let portfolioImages: string[] = [];

  try {
    const files = fs.readdirSync(directoryPath);
    portfolioImages = files
      .filter((file) => !file.startsWith("."))
      .map((file) => `/${category}/portfolio/${file}`);
  } catch {
    portfolioImages = [];
  }

  // File-System CMS: drop hero media into public/[category]/hero/
  const heroDirectoryPath = path.join(process.cwd(), "public", category, "hero");
  let heroMedia: { url: string; type: "image" | "video" }[] = [];

  try {
    const heroFiles = fs.readdirSync(heroDirectoryPath);
    heroMedia = heroFiles
      .filter((file) => !file.startsWith("."))
      .map((file) => {
        const extension = path.extname(file).toLowerCase();
        const type =
          extension === ".mp4" || extension === ".mov" || extension === ".webm"
            ? ("video" as const)
            : ("image" as const);

        return {
          url: `/${category}/hero/${file}`,
          type,
        };
      });
  } catch {
    heroMedia = [];
  }

  // File-System CMS: match service images in public/[category]/services/
  // Filename example: Brand_Photography.jpg -> "Brand Photography"
  const servicesDirectoryPath = path.join(process.cwd(), "public", category, "services");
  const serviceImageMap: Record<string, string> = {};

  try {
    const serviceFiles = fs.readdirSync(servicesDirectoryPath).filter((file) => !file.startsWith("."));

    for (const file of serviceFiles) {
      const strippedName = path
        .parse(file)
        .name.replace(/_/g, " ")
        .trim()
        .toLowerCase();
      serviceImageMap[strippedName] = `/${category}/services/${file}`;
    }
  } catch {
    // Folder may not exist yet — services render without local images
  }

  const servicesWithMedia = selectedCategory.services.map((service) => {
    const matchKey = service.title.trim().toLowerCase();
    const imageUrl = serviceImageMap[matchKey] ?? null;
    const imageDimensions = imageUrl ? getImageDimensions(imageUrl) : null;

    return {
      title: service.title,
      description: service.description,
      imageUrl,
      imageWidth: imageDimensions?.width ?? null,
      imageHeight: imageDimensions?.height ?? null,
    };
  });

  const logoUrl = getLogoUrl();
  const aboutImageUrl = getAboutImageUrl();

  // File-System CMS: drop FAQ entries into public/[category]/faq.json
  const faqFilePath = path.join(process.cwd(), "public", category, "faq.json");
  let faqs: FAQItem[] = [];

  if (fs.existsSync(faqFilePath)) {
    try {
      const rawFaq = fs.readFileSync(faqFilePath, "utf-8");
      const parsedFaq = JSON.parse(rawFaq) as unknown;

      if (Array.isArray(parsedFaq)) {
        faqs = parsedFaq.filter(
          (item): item is FAQItem =>
            typeof item === "object" &&
            item !== null &&
            "question" in item &&
            "answer" in item &&
            typeof item.question === "string" &&
            typeof item.answer === "string"
        );
      }
    } catch {
      faqs = [];
    }
  }

  return (
    <CategoryTemplate
      category={{ ...selectedCategory, portfolioImages }}
      heroMedia={heroMedia}
      services={servicesWithMedia}
      logoUrl={logoUrl}
      aboutData={{ ...sharedAbout, imageUrl: aboutImageUrl }}
      faqs={faqs}
    />
  );
}

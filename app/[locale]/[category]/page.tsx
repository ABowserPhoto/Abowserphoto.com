import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryTemplate from "../../../components/CategoryTemplate";
import { getAboutImageUrl, getImageDimensions, getLogoUrl } from "../../../lib/cms";
import {
  categoryContentMap,
  categoryNavigation,
  type CategorySlug,
  type FAQItem,
} from "../../../lib/content";
import { isLocale, locales, type Locale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/getDictionary";
import { getLocalizedCategory, getLocalizedSharedAbout } from "../../../lib/i18n/localizeContent";
import { buildCategoryMetadata } from "../../../lib/i18n/seo";

type CategoryPageProps = {
  params: Promise<{
    locale: string;
    category: string;
  }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categoryNavigation.map((item) => ({ locale, category: item.slug }))
  );
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale: rawLocale, category } = await params;
  if (!isLocale(rawLocale) || !(category in categoryContentMap)) return {};
  return buildCategoryMetadata(rawLocale, category as CategorySlug);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale: rawLocale, category } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const reserved = new Set(["account", "book", "booking", "api", "auth"]);
  if (reserved.has(category)) notFound();

  const baseCategory = categoryContentMap[category as CategorySlug];
  if (!baseCategory) notFound();

  const selectedCategory = getLocalizedCategory(category as CategorySlug, locale);
  const dictionary = await getDictionary(locale);
  const sharedAbout = getLocalizedSharedAbout(locale);

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
    // Folder may not exist yet
  }

  const servicesWithMedia = selectedCategory.services.map((service, index) => {
    const englishTitle = baseCategory.services[index]?.title ?? service.title;
    const matchKey = englishTitle.trim().toLowerCase();
    const imageUrl = baseCategory.services[index]?.image ?? serviceImageMap[matchKey] ?? null;
    const imageDimensions = imageUrl ? getImageDimensions(imageUrl) : null;
    const baseService = baseCategory.services[index];

    return {
      title: service.title,
      description: service.description,
      imageUrl,
      imageWidth: imageDimensions?.width ?? null,
      imageHeight: imageDimensions?.height ?? null,
      mediaType: baseService?.mediaType,
      embedUrl: baseService?.embedUrl,
      videoUrl: baseService?.videoUrl,
      tours: baseService?.tours,
      videos: baseService?.videos,
      beforeImage: baseService?.beforeImage,
      afterImage: baseService?.afterImage,
    };
  });

  const logoUrl = getLogoUrl();
  const aboutImageUrl = getAboutImageUrl();

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
      dictionary={dictionary}
      locale={locale}
    />
  );
}

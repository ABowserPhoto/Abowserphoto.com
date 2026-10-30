import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import CategoryTemplate from "../../../components/CategoryTemplate";
import { StudioServiceJsonLd } from "../../../components/JsonLd";
import { getAboutImageUrl, getImageDimensions, getLogoUrl } from "../../../lib/cms";
import { categoryContentMap, categoryNavigation, type CategorySlug } from "../../../lib/content";
import { readFaqFile } from "../../../lib/faqs";
import { getImageAlt, readHeroMedia, readPortfolio } from "../../../lib/gallery";
import { isLocale, locales, type Locale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/getDictionary";
import { getLocalizedCategory, getLocalizedSharedAbout } from "../../../lib/i18n/localizeContent";
import { getPageFaqs, getPageSections } from "../../../lib/i18n/pageSections";
import { buildCategoryMetadata } from "../../../lib/i18n/seo";
import { categorySegment, resolveCategorySegment } from "../../../lib/routes";

type CategoryPageProps = {
  params: Promise<{
    locale: string;
    category: string;
  }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categoryNavigation.map((item) => ({
      locale,
      category: categorySegment(item.slug, locale),
    }))
  );
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale: rawLocale, category } = await params;
  const slug = resolveCategorySegment(category);
  if (!isLocale(rawLocale) || !slug) return {};
  const host = (await headers()).get("host");
  return buildCategoryMetadata(rawLocale, slug, host);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale: rawLocale, category } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const reserved = new Set(["account", "book", "booking", "api", "auth"]);
  if (reserved.has(category)) notFound();

  const slug = resolveCategorySegment(category);
  if (!slug) notFound();
  if (category !== categorySegment(slug, locale)) {
    permanentRedirect(`/${locale}/${categorySegment(slug, locale)}`);
  }

  const baseCategory = categoryContentMap[slug];
  const selectedCategory = getLocalizedCategory(slug, locale);
  const dictionary = await getDictionary(locale);
  const sharedAbout = getLocalizedSharedAbout(locale);

  const portfolio = readPortfolio(slug, locale);
  const heroMedia = readHeroMedia(slug, locale);

  const servicesDirectoryPath = path.join(process.cwd(), "public", slug, "services");
  const serviceImageMap: Record<string, string> = {};

  try {
    const serviceFiles = fs.readdirSync(servicesDirectoryPath).filter((file) => !file.startsWith("."));

    for (const file of serviceFiles) {
      const strippedName = path
        .parse(file)
        .name.replace(/_/g, " ")
        .trim()
        .toLowerCase();
      serviceImageMap[strippedName] = `/${slug}/services/${file}`;
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
  const pageFaqs = getPageFaqs(slug, locale);
  const fileFaqs = readFaqFile(slug, locale);
  const faqs = pageFaqs.length > 0 ? pageFaqs : fileFaqs.length > 0 ? fileFaqs : selectedCategory.faq;
  const aboutDescription =
    slug === "business-portraits" || slug === "studio"
      ? selectedCategory.aboutText
      : `${selectedCategory.aboutText}\n\n${sharedAbout.description}`;

  return (
    <>
      {slug === "studio" ? <StudioServiceJsonLd locale={locale} /> : null}
      <CategoryTemplate
        category={selectedCategory}
        portfolio={portfolio}
        heroMedia={heroMedia}
        services={servicesWithMedia}
        logoUrl={logoUrl}
        aboutData={{
          title: sharedAbout.title,
          description: aboutDescription,
          imageUrl: aboutImageUrl,
          imageAlt: aboutImageUrl ? getImageAlt(aboutImageUrl, locale) : sharedAbout.title,
        }}
        faqs={faqs}
        pageSections={getPageSections(slug, locale)}
        dictionary={dictionary}
        locale={locale}
      />
    </>
  );
}

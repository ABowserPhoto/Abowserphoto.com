import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import CategoryTemplate from "../../../components/CategoryTemplate";
import { FaqPageJsonLd, StudioServiceJsonLd } from "../../../components/JsonLd";
import StudioOffHostNotice from "../../../components/StudioOffHostNotice";
import { getAboutImageUrl, getImageDimensions, getLogoUrl } from "../../../lib/cms";
import { categoryContentMap, categoryNavigation, type CategorySlug } from "../../../lib/content";
import { readFaqFile } from "../../../lib/faqs";
import { getImageAlt, readHeroMedia, readPortfolio } from "../../../lib/gallery";
import { isLocale, locales, type Locale } from "../../../lib/i18n/config";
import { getDictionary } from "../../../lib/i18n/getDictionary";
import { getLocalizedCategory, getLocalizedSharedAbout } from "../../../lib/i18n/localizeContent";
import { getPageFaqs, getPageSections } from "../../../lib/i18n/pageSections";
import { buildCategoryMetadata } from "../../../lib/i18n/seo";
import { nicheDocumentCopy } from "../../../lib/niche-landing";
import { categorySegment, resolveCategorySegment } from "../../../lib/routes";
import { serviceIntroBeats, serviceIntroFrames, serviceIntroKicker } from "../../../lib/serviceIntro";
import { nicheHostForHostname } from "../../../lib/subdomains";

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

  const host = (await headers()).get("host");
  if (slug === "studio" && nicheHostForHostname(host ?? "")?.slug !== "studio") {
    const dictionary = await getDictionary(locale);
    return (
      <StudioOffHostNotice
        locale={locale}
        dictionary={dictionary}
        logoUrl={getLogoUrl()}
        publicHost={host ?? ""}
      />
    );
  }

  const baseCategory = categoryContentMap[slug];
  const localizedCategory = getLocalizedCategory(slug, locale);
  // Same component and the same heading styles. Only the words change, and
  // only on this category's own niche host.
  const landing = nicheDocumentCopy(slug, locale, host);
  const pageFaqs = getPageFaqs(slug, locale);
  const fileFaqs = readFaqFile(slug, locale);
  const faqs = pageFaqs.length > 0 ? pageFaqs : fileFaqs.length > 0 ? fileFaqs : localizedCategory.faq;
  const withHeading = landing
    ? { ...localizedCategory, title: landing.h1, subtitle: landing.lead ?? localizedCategory.subtitle }
    : localizedCategory;
  const selectedCategory = { ...withHeading, faq: faqs };
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
      imageAlt: slug === "food" && imageUrl ? getImageAlt(imageUrl, locale) : null,
      imageWidth: imageDimensions?.width ?? null,
      imageHeight: imageDimensions?.height ?? null,
      mediaType: baseService?.mediaType,
      embedUrl: baseService?.embedUrl,
      videoUrl: baseService?.videoUrl,
      tours: baseService?.tours,
      videos: baseService?.videos,
      beforeImage: baseService?.beforeImage,
      afterImage: baseService?.afterImage,
      badge: service.badge,
    };
  });

  const introFrames = serviceIntroFrames(
    slug,
    heroMedia.map((item) => ({ url: item.url, type: item.type })),
    portfolio
  );
  const intro = serviceIntroBeats(slug, locale).map((beat, index) => {
    const frame = introFrames[index] ?? introFrames[0];
    return {
      title: beat.title,
      description: beat.description,
      imageUrl: frame?.imageUrl ?? null,
      imageAlt: frame?.imageUrl ? getImageAlt(frame.imageUrl, locale) : beat.title,
      imageWidth: null,
      imageHeight: null,
      backgroundVideoUrl: frame?.backgroundVideoUrl,
    };
  });

  const logoUrl = getLogoUrl();
  const aboutImageUrl = getAboutImageUrl();
  const aboutDescription = selectedCategory.aboutText;

  return (
    <>
      {slug === "studio" ? <StudioServiceJsonLd locale={locale} /> : null}
      {faqs.length > 0 ? <FaqPageJsonLd items={faqs} /> : null}
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
        publicHost={host ?? ""}
        intro={intro}
        introKicker={serviceIntroKicker(locale)}
      />
    </>
  );
}

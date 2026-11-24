import Image from "next/image";
import Link from "next/link";
import { bookingHref } from "../lib/booking";
import { contactPhoneHref, contactWhatsAppHref } from "../lib/contact";
import { getImageAlt } from "../lib/gallery";
import { homeHeroCopy } from "../lib/homeHero";
import { homeIntroParagraphs, type IntroSegment } from "../lib/homeIntro";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import { getDictionarySync } from "../lib/i18n/getDictionary";
import { categoryPath } from "../lib/routes";

type HomeIntroProps = {
  locale: Locale;
  publicHost?: string;
};

function IntroLink({ segment }: { segment: IntroSegment }) {
  const className =
    "underline decoration-[#322B2B]/40 underline-offset-[3px] transition-opacity hover:opacity-70";
  if (!segment.href) return <span>{segment.text}</span>;
  if (segment.href.startsWith("http")) {
    return (
      <a href={segment.href} className={className}>
        {segment.text}
      </a>
    );
  }
  return (
    <Link href={segment.href} className={className}>
      {segment.text}
    </Link>
  );
}

const FEATURED = [
  {
    slug: "business-portraits" as const,
    image: "/business-portraits/hero/businessportrait-hero-frau-flieder-blazer.webp",
  },
  {
    slug: "food" as const,
    image: "/food/hero/food-hero-1-desktop.jpg",
  },
];

export default function HomeIntro({ locale, publicHost }: HomeIntroProps) {
  const headline = getDictionarySync(locale).home.headline;
  const hero = homeHeroCopy(locale);
  const paragraphs = homeIntroParagraphs(locale, publicHost);
  const featured = [
    {
      ...FEATURED[0],
      title: hero.featuredBusinessTitle,
      text: hero.featuredBusinessText,
    },
    {
      ...FEATURED[1],
      title: hero.featuredFoodTitle,
      text: hero.featuredFoodText,
    },
  ];

  return (
    <article className="pb-28 text-[#322B2B]">
      <h1 className="text-2xl font-light leading-tight tracking-tight text-[#322B2B] sm:text-3xl">
        {headline}
      </h1>
      <p className="mt-4 text-base font-light leading-snug tracking-tight sm:text-lg">{hero.claim}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#322B2B]/85 sm:text-base">{hero.line}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={bookingHref(withLocale("/", locale))}
          scroll={false}
          className="inline-flex items-center justify-center bg-[#322B2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
        >
          {hero.book}
        </Link>
        <a
          href={contactPhoneHref()}
          className="text-sm underline decoration-[#322B2B]/40 underline-offset-[3px] hover:opacity-70"
        >
          {hero.call}
        </a>
        <a
          href={contactWhatsAppHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline decoration-[#322B2B]/40 underline-offset-[3px] hover:opacity-70"
        >
          {hero.whatsapp}
        </a>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#322B2B]/75">{hero.note}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {featured.map((item) => (
          <Link
            key={item.slug}
            href={withLocale(categoryPath(item.slug, locale), locale)}
            className="group block overflow-hidden border border-[#322B2B]/10 bg-white/40"
          >
            <span className="relative block aspect-[4/3] w-full">
              <Image
                src={item.image}
                alt={getImageAlt(item.image, locale)}
                fill
                sizes="(max-width: 640px) 100vw, 20rem"
                className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              />
            </span>
            <span className="block px-3 py-3">
              <span className="block text-sm font-medium tracking-tight">{item.title}</span>
              <span className="mt-1 block text-xs leading-relaxed text-[#322B2B]/75">{item.text}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#322B2B]/90">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph.map((segment, segmentIndex) => (
              <IntroLink key={segmentIndex} segment={segment} />
            ))}
          </p>
        ))}
      </div>
    </article>
  );
}

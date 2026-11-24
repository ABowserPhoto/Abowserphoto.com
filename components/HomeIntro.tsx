import Image from "next/image";
import Link from "next/link";
import { bookingHref } from "../lib/booking";
import { contactPhoneHref, contactWhatsAppHref } from "../lib/contact";
import { getImageAlt } from "../lib/gallery";
import { homeHeroCopy } from "../lib/homeHero";
import { homeAboutCopy, homeHubGroups, homePackageCopy, homeStudioLine, type HubTile } from "../lib/homeHub";
import { homeIntroParagraphs, type IntroSegment } from "../lib/homeIntro";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import { getDictionarySync } from "../lib/i18n/getDictionary";
import { servicePageHref } from "../lib/serviceLinks";
import { solingenStudioPath } from "../lib/routes";
import AwardsStrip from "./AwardsStrip";
import MarketingVideoSlot from "./MarketingVideoSlot";

type HomeIntroProps = {
  locale: Locale;
  publicHost?: string;
};

function IntroLink({ segment }: { segment: IntroSegment }) {
  const className =
    "underline decoration-[#322B2B]/40 underline-offset-[3px] transition-colors duration-300 hover:text-[#E18400]";
  if (!segment.href) return <span>{segment.text}</span>;
  if (segment.href.startsWith("http") || segment.href.startsWith("mailto:") || segment.href.startsWith("tel:")) {
    const external = segment.href.startsWith("http");
    return (
      <a href={segment.href} className={className} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
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

export default function HomeIntro({ locale, publicHost }: HomeIntroProps) {
  const headline = getDictionarySync(locale).home.headline;
  const hero = homeHeroCopy(locale);
  const paragraphs = homeIntroParagraphs(locale, publicHost);
  const groups = homeHubGroups(locale);
  const studios = homeStudioLine(locale);
  const about = homeAboutCopy(locale);
  const marketing = homePackageCopy(locale);
  const portrait = "/about/portraet-aaron-bowser.webp";

  return (
    <article className="pb-6 text-[#322B2B]">
      <h1 className="text-2xl font-light leading-tight tracking-tight text-[#322B2B] sm:text-3xl">{headline}</h1>
      <p className="mt-4 text-base font-light leading-snug tracking-tight sm:text-lg">{hero.claim}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#322B2B]/85 sm:text-base">{hero.line}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={bookingHref(withLocale("/", locale))}
          scroll={false}
          className="inline-flex items-center justify-center bg-[#322B2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#FFB70F] hover:text-[#322B2B]"
        >
          {hero.book}
        </Link>
        <a
          href={contactPhoneHref()}
          className="text-sm underline decoration-[#322B2B]/40 underline-offset-[3px] transition-colors duration-300 hover:text-[#E18400]"
        >
          {hero.call}
        </a>
        <a
          href={contactWhatsAppHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline decoration-[#322B2B]/40 underline-offset-[3px] transition-colors duration-300 hover:text-[#E18400]"
        >
          {hero.whatsapp}
        </a>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#322B2B]/75">{hero.note}</p>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#322B2B]/90">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph.map((segment, segmentIndex) => (
              <IntroLink key={segmentIndex} segment={segment} />
            ))}
          </p>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {groups.featured.map((item) => (
          <Tile key={item.slug} locale={locale} publicHost={publicHost} item={item} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {groups.middle.map((item) => (
          <Tile key={item.slug} locale={locale} publicHost={publicHost} item={item} />
        ))}
      </div>
      <div className="mt-4 grid gap-3 text-sm leading-relaxed sm:grid-cols-2">
        <a href={servicePageHref("studio", locale, publicHost)} className="underline decoration-[#322B2B]/40 underline-offset-[3px] transition-colors duration-300 hover:text-[#E18400]">
          {studios.hagen}
        </a>
        <Link href={withLocale(solingenStudioPath(locale), locale)} className="underline decoration-[#322B2B]/40 underline-offset-[3px] transition-colors duration-300 hover:text-[#E18400]">
          {studios.solingen}
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {groups.afterStudios.map((item) => (
          <Tile key={item.slug} locale={locale} publicHost={publicHost} item={item} />
        ))}
      </div>
      <p className="mt-4 text-sm text-[#322B2B]/80">
        {locale === "de" ? "Außerdem: " : "Also: "}
        {groups.text.map((item, index) => (
          <span key={item.slug}>
            {index > 0 ? " · " : null}
            <Link href={servicePageHref(item.slug, locale, publicHost)} className="underline decoration-[#322B2B]/40 underline-offset-[3px] transition-colors duration-300 hover:text-[#E18400]">
              {item.title}
            </Link>
          </span>
        ))}
      </p>

      <section className="mt-10 border-t border-[#322B2B]/10 pt-8">
        <h2 className="text-lg font-light tracking-tight">{about.title}</h2>
        <div className="mt-4 flex items-start gap-4">
          <span className="relative block h-16 w-16 shrink-0 overflow-hidden">
            <Image
              src={portrait}
              alt={getImageAlt(portrait, locale) || about.portraitAlt}
              fill
              sizes="4rem"
              className="object-cover"
            />
          </span>
          <p className="text-sm leading-relaxed text-[#322B2B]/90">{about.body}</p>
        </div>
        <AwardsStrip label={about.awardsLabel} />
      </section>

      <section className="mt-10 border-t border-[#322B2B]/10 pt-8">
        <h2 className="text-lg font-light tracking-tight">{marketing.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#322B2B]/90">{marketing.body}</p>
        <MarketingVideoSlot alt={marketing.videoAlt} />
      </section>
    </article>
  );
}

function Tile({
  locale,
  publicHost,
  item,
}: {
  locale: Locale;
  publicHost?: string;
  item: HubTile;
}) {
  return (
    <Link
      href={servicePageHref(item.slug, locale, publicHost)}
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
        <span className="block text-sm font-medium tracking-tight transition-colors duration-300 group-hover:text-[#E18400]">
          {item.title}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-[#322B2B]/75">{item.text}</span>
      </span>
    </Link>
  );
}

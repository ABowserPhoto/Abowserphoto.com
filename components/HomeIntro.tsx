import Link from "next/link";
import { homeIntroParagraphs, type IntroSegment } from "../lib/homeIntro";
import type { Locale } from "../lib/i18n/config";
import { getDictionarySync } from "../lib/i18n/getDictionary";

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

export default function HomeIntro({ locale, publicHost }: HomeIntroProps) {
  const headline = getDictionarySync(locale).home.headline;
  const paragraphs = homeIntroParagraphs(locale, publicHost);

  return (
    <section className="bg-[#F4F1ED] text-[#322B2B]">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="text-3xl font-light leading-tight tracking-tight text-[#322B2B] sm:text-4xl lg:text-5xl">
          {headline}
        </h1>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-[#322B2B]/85 sm:text-base">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>
              {paragraph.map((segment, segmentIndex) => (
                <IntroLink key={segmentIndex} segment={segment} />
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <article className="text-[#322B2B]">
      <h1 className="text-2xl font-light leading-tight tracking-tight text-[#322B2B] sm:text-3xl">
        {headline}
      </h1>
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

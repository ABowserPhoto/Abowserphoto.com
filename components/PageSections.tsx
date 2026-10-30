import Link from "next/link";
import type { PageSection } from "../lib/i18n/pageSections";

type PageSectionsProps = {
  sections: PageSection[];
};

export default function PageSections({ sections }: PageSectionsProps) {
  if (sections.length === 0) return null;

  return (
    <div className="relative z-30 bg-[#F4F1ED]">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#322B2B]/55">
            {section.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-light tracking-tight text-[#322B2B] sm:text-4xl">
            {section.title}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#322B2B]/80 sm:text-base">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            {section.links?.map((item) => (
              <p key={item.href}>
                {item.href.startsWith("http") ? (
                  <a href={item.href} className="underline underline-offset-2">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="underline underline-offset-2">
                    {item.label}
                  </Link>
                )}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

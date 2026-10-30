import type { FAQItem } from "../lib/content";
import type { Locale } from "../lib/i18n/config";
import {
  buildBusinessJsonLd,
  buildFaqPageJsonLd,
  buildSolingenPlaceJsonLd,
  buildStudioServiceJsonLd,
} from "../lib/structuredData";

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBusinessJsonLd()) }}
    />
  );
}

export function StudioServiceJsonLd({ locale }: { locale: Locale }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStudioServiceJsonLd(locale)) }}
    />
  );
}

export function SolingenPlaceJsonLd({ locale }: { locale: Locale }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSolingenPlaceJsonLd(locale)) }}
    />
  );
}

export function FaqPageJsonLd({ items }: { items: FAQItem[] }) {
  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqPageJsonLd(items)) }}
    />
  );
}

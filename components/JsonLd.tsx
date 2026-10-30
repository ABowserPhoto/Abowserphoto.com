import type { Locale } from "../lib/i18n/config";
import { buildBusinessJsonLd, buildStudioServiceJsonLd } from "../lib/structuredData";

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

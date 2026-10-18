import { buildBusinessJsonLd } from "../lib/structuredData";

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBusinessJsonLd()) }}
    />
  );
}

import { AWARD_NAMES } from "../lib/awards";
import type { Locale } from "../lib/i18n/config";

type AwardsStripProps = {
  locale: Locale;
};

/** Text-only award names. Logos stay out until image files and rights exist. */
export default function AwardsStrip({ locale }: AwardsStripProps) {
  const names = AWARD_NAMES[locale];

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#322B2B]/55">
        {locale === "de" ? "Auszeichnungen" : "Awards"}
      </p>
      <ul className="mt-2 space-y-1 text-sm leading-relaxed text-[#322B2B]/90">
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

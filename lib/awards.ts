/**
 * Award logos for the homepage strip.
 * Add a file under `public/awards/` and append `{ src, alt }` here.
 * An empty list renders no logos and no stand-in marks.
 */
export type AwardLogo = {
  src: string;
  alt: string;
  href?: string;
};

export const AWARD_LOGOS: readonly AwardLogo[] = [];

/** Confirmed award names. Text only: no logos, images, or schema. */
export const AWARD_NAMES = {
  de: [
    "Hype Award für herausragenden Service",
    "Prestige Award: Fashion Photographer of the Year – West Germany",
  ],
  en: [
    "Hype Award for Outstanding Service",
    "Prestige Award: West Germany Fashion Photographer of the Year",
  ],
} as const;

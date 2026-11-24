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

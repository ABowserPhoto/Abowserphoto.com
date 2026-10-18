/**
 * Business-Porträts gallery.
 *
 * Add a photograph by placing a WebP in public/business-portraits/portfolio/
 * and appending one entry here. The page renders this list in order.
 * A file that is not listed here is not shown.
 *
 * alt.de: one natural German sentence. Mention the subject and, if the
 * sitting was in a known city, that city once. Do not repeat alts.
 */
export type BusinessPortraitImage = {
  file: string;
  alt: {
    de: string;
    en: string;
  };
};

export const businessPortraitGallery: BusinessPortraitImage[] = [
  {
    file: "businessportrait-thomas-metzner.webp",
    alt: {
      de: "Business-Porträt von Thomas Metzner in dunkler Kleidung vor einem ruhigen Hintergrund.",
      en: "Business portrait of Thomas Metzner in dark clothing against a quiet background.",
    },
  },
];

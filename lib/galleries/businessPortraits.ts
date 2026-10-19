/**
 * Business-Porträts gallery.
 *
 * Photographs are listed here in display order. A file that is not listed
 * is not shown. Client portraits stay out until consent is given.
 *
 * alt.de is the sentence from the delivery manifest. alt.en is the same
 * sentence in English.
 */
export type BusinessPortraitImage = {
  file: string;
  width: number;
  height: number;
  alt: {
    de: string;
    en: string;
  };
};

export const businessPortraitGallery: BusinessPortraitImage[] = [
  {
    file: "businessportrait-frau-hellblauer-blazer.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Lächelndes Businessportrait einer blonden Frau im hellblauen Blazer vor warmem Studiohintergrund.",
      en: "Smiling business portrait of a blonde woman in a light blue blazer against a warm studio background.",
    },
  },
  {
    file: "linkedin-foto-frau-grauer-hintergrund.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Natürliches LinkedIn Foto einer Frau in weißer Bluse vor grauem Hintergrund.",
      en: "Natural LinkedIn portrait of a woman in a white blouse against a grey background.",
    },
  },
  {
    file: "executive-portrait-frau-roter-anzug.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Selbstbewusstes Executive-Portrait einer Unternehmerin im roten Anzug, sitzend im Studio.",
      en: "Confident executive portrait of a businesswoman in a red suit, seated in the studio.",
    },
  },
  {
    file: "personal-branding-foto-frau-flieder-anzug.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Fröhliches Personal-Branding-Foto einer Frau im fliederfarbenen Hosenanzug.",
      en: "Cheerful personal-branding portrait of a woman in a lilac trouser suit.",
    },
  },
  {
    file: "businessfoto-frau-weisse-bluse-studio.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Sympathisches Businessfoto einer Frau mit offenem Lächeln in heller Bluse.",
      en: "Friendly business photograph of a woman with an open smile, in a light blouse.",
    },
  },
  {
    file: "corporate-headshot-frau-nadelstreifen-blazer.webp",
    width: 1000,
    height: 1250,
    alt: {
      de: "Moderner Corporate Headshot einer Frau im dunkelblauen Nadelstreifen-Blazer vor heller Holzwand.",
      en: "Modern corporate headshot of a woman in a dark navy pinstripe blazer against a light wood wall.",
    },
  },
  {
    file: "firmenportrait-frau-roter-hosenanzug-stehend.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Stehende Frau im roten Hosenanzug mit Händen in den Taschen als kraftvolles Firmenportrait.",
      en: "A woman standing in a red trouser suit, hands in her pockets, as a strong company portrait.",
    },
  },
  {
    file: "fuehrungskraft-portrait-frau-nachdenklich.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Nachdenkliche Führungskraft im roten Blazer, die ruhig in die Kamera blickt.",
      en: "A thoughtful executive in a red blazer, looking calmly into the camera.",
    },
  },
  {
    file: "business-fotografie-frau-hellblauer-anzug.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Elegante Business-Fotografie einer Frau im hellblauen Anzug, lässig an einen Hocker gelehnt.",
      en: "Elegant business photograph of a woman in a light blue suit, leaning casually against a stool.",
    },
  },
  {
    file: "portrait-unternehmerin-flieder-blazer.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Moderne Unternehmerin im Flieder-Blazer, stehend mit einer Hand in der Hosentasche.",
      en: "A modern businesswoman in a lilac blazer, standing with one hand in her pocket.",
    },
  },
  {
    file: "mitarbeiterfoto-frau-sitzend-grau.webp",
    width: 1000,
    height: 1500,
    alt: {
      de: "Sitzendes Mitarbeiterfoto einer Frau in weißer Bluse und Jeans vor neutralem Grau.",
      en: "Seated staff portrait of a woman in a white blouse and jeans against neutral grey.",
    },
  },
];

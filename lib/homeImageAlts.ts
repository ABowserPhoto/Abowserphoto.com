import type { Locale } from "./i18n/config";

/** German alts for the six /de homepage portraits. English stays empty. */
const HOME_DE_ALTS: Record<string, string> = {
  "/home/images/julia_00220 3.jpg":
    "Modeporträt einer Frau im Profil mit großen Goldringen und Armreifen, im Studio unter türkisem Licht",
  "/home/images/Marsela_16_04_2024_5 2.jpg":
    "Editoriales Studiofoto einer Frau im schwarzen Latexanzug und einer Ledermaske, seitlich vor dunklem Hintergrund",
  "/home/images/Naya_29_01_202206722 1.jpg":
    "Beauty- und Modeporträt einer Frau mit goldenem Schlangenohrring und transparenten Handschuhen",
  "/home/light-theme/01-monja.jpg":
    "Schwarz-weißes Business-Porträt einer Frau mit lockigem Haar, großer Brille und Blazer, sitzend im Fotostudio",
  "/home/light-theme/02-nadine.jpg":
    "Business-Porträt einer lächelnden Frau im rosa Hosenanzug und mit Brille, sitzend auf einem Bürostuhl im Fotostudio",
  "/home/light-theme/03-olga.jpg":
    "Schwarz-weißes Porträt einer Frau mit blonden Haaren, weißer Bluse und großen Creolen",
};

export function explicitImageAlt(src: string, locale: Locale) {
  if (locale !== "de") return "";
  return HOME_DE_ALTS[src] ?? "";
}

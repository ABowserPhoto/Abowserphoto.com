import type { Locale } from "./config";
import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";

const dictionaries = {
  en,
  de,
} as const;

export type Dictionary = typeof en;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries.en;
}

export function getDictionarySync(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

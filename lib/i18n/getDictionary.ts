import { fillContactTokens } from "../contact";
import type { Locale } from "./config";
import de from "./dictionaries/de.json";
import en from "./dictionaries/en.json";

const dictionaries = {
  en,
  de,
} as const;

export type Dictionary = typeof en;

function applyContact<T>(value: T): T {
  if (typeof value === "string") return fillContactTokens(value) as T;
  if (Array.isArray(value)) return value.map((entry) => applyContact(entry)) as T;
  if (value !== null && typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      output[key] = applyContact(entry);
    }
    return output as T;
  }
  return value;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return applyContact(dictionaries[locale] ?? dictionaries.en);
}

export function getDictionarySync(locale: Locale): Dictionary {
  return applyContact(dictionaries[locale] ?? dictionaries.en);
}

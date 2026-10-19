import fs from "fs";
import path from "path";
import type { CategorySlug, FAQItem } from "./content";
import type { Locale } from "./i18n/config";

function isFaqItem(value: unknown): value is FAQItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "question" in value &&
    "answer" in value &&
    typeof value.question === "string" &&
    typeof value.answer === "string"
  );
}

function asFaqList(value: unknown): FAQItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isFaqItem);
}

export function readFaqFile(slug: CategorySlug, locale: Locale): FAQItem[] {
  const faqFilePath = path.join(process.cwd(), "public", slug, "faq.json");
  if (!fs.existsSync(faqFilePath)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(faqFilePath, "utf-8")) as unknown;
    if (Array.isArray(parsed)) return asFaqList(parsed);
    if (typeof parsed === "object" && parsed !== null && locale in parsed) {
      return asFaqList((parsed as Record<string, unknown>)[locale]);
    }
  } catch {
    return [];
  }

  return [];
}

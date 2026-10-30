import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  appointmentOnlyLabel,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
  CONTACT_PHONE_TEL,
  contactPhoneHref,
  formatHagenOpeningHours,
  HAGEN_ADDRESS,
  HAGEN_OPENING_HOURS,
  hagenOpeningHoursSpecification,
  SOLINGEN_ADDRESS,
} from "./contact";
import { readFaqFile } from "./faqs";
import { getDictionarySync } from "./i18n/getDictionary";
import { getLocalizedCategory } from "./i18n/localizeContent";
import { getLegalDocument } from "./legalContent";
import { buildBusinessJsonLd } from "./structuredData";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".mdx",
  ".html",
  ".css",
  ".txt",
  ".yml",
  ".yaml",
  ".svg",
  ".xml",
]);
const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "out", "coverage", "dist", ".turbo"]);

function walk(dir: string, files: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
      continue;
    }
    if (!entry.isFile()) continue;
    if (TEXT_EXT.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const sourceFiles = walk(ROOT);

function relative(file: string) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function retiredPhoneCores() {
  const middle = ["292", "7"].join("");
  return [0, 1].flatMap((last) => {
    const subscriber = `835${middle}${last}`;
    const localGrouping = `352${middle}${last}`;
    return [subscriber, localGrouping, `157${subscriber}`];
  });
}

function unofficialMailboxes() {
  const at = String.fromCharCode(64);
  return ["hello", "aaron"].map((name) => `${name}${at}`);
}

test("official contact values", () => {
  assert.equal(CONTACT_PHONE_DISPLAY, "+49 179 5392188");
  assert.equal(CONTACT_PHONE_TEL, "+491795392188");
  assert.equal(CONTACT_PHONE_E164, CONTACT_PHONE_TEL);
  assert.equal(contactPhoneHref(), `tel:${CONTACT_PHONE_TEL}`);
  assert.equal(CONTACT_EMAIL, "info@aaronbowser-photography.com");
  assert.equal(HAGEN_ADDRESS.street, "Eckeseyer Str. 133");
  assert.equal(HAGEN_ADDRESS.postalCode, "58089");
  assert.equal(HAGEN_ADDRESS.city, "Hagen");
  assert.equal(HAGEN_ADDRESS.countryCode, "DE");
  assert.equal(SOLINGEN_ADDRESS.street, "Merscheider Str. 112");
  assert.equal(SOLINGEN_ADDRESS.postalCode, "42699");
  assert.equal(SOLINGEN_ADDRESS.city, "Solingen");
  assert.equal(SOLINGEN_ADDRESS.countryCode, "DE");
  assert.deepEqual(
    HAGEN_OPENING_HOURS.map((range) => ({
      days: [...range.dayOfWeek],
      opens: range.opens,
      closes: range.closes,
    })),
    [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "20:00",
      },
      { days: ["Sunday"], opens: "09:00", closes: "12:00" },
    ]
  );
  assert.equal(formatHagenOpeningHours("de"), "Mo\u2013Sa 10:00\u201320:00, So 09:00\u201312:00");
  assert.equal(formatHagenOpeningHours("en"), "Mon\u2013Sat 10:00\u201320:00, Sun 09:00\u201312:00");
  assert.equal(appointmentOnlyLabel("de"), "Nur nach Vereinbarung");
  assert.equal(appointmentOnlyLabel("en"), "By appointment only");
  assert.equal(appointmentOnlyLabel("de", { sentence: false }), "nur nach Vereinbarung");
});

test("contact literals are defined only in lib/contact.ts", () => {
  const needles = [
    CONTACT_PHONE_DISPLAY,
    CONTACT_PHONE_TEL,
    CONTACT_EMAIL,
    HAGEN_ADDRESS.street,
    HAGEN_ADDRESS.postalCode,
    SOLINGEN_ADDRESS.street,
    SOLINGEN_ADDRESS.postalCode,
  ];

  for (const needle of needles) {
    const found = sourceFiles
      .filter((file) => relative(file) !== "lib/contact.test.ts")
      .filter((file) => fs.readFileSync(file, "utf8").includes(needle))
      .map(relative);
    assert.deepEqual(found, ["lib/contact.ts"], `${needle} also appears in ${found.join(", ")}`);
  }
});

test("source has no retired phone numbers or unofficial studio mailboxes", () => {
  const cores = retiredPhoneCores();
  const mailboxes = unofficialMailboxes();
  const hits: string[] = [];

  for (const file of sourceFiles) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      const compact = line.replace(/[\s()./+-]/g, "");
      const lower = line.toLowerCase();
      for (const core of cores) {
        if (compact.includes(core)) hits.push(`${relative(file)}:${index + 1} ${core}`);
      }
      for (const mailbox of mailboxes) {
        if (lower.includes(mailbox)) hits.push(`${relative(file)}:${index + 1} ${mailbox}`);
      }
    });
  }

  assert.equal(hits.length, 0, hits.join("\n"));
});

test("structured data lists both studios and opening hours only for Hagen", () => {
  const graph = buildBusinessJsonLd()["@graph"] as Array<Record<string, unknown>>;
  const organization = graph.find((node) => String(node["@id"]).endsWith("#organization"));
  const hagen = graph.find((node) => String(node["@id"]).endsWith("#studio-hagen"));
  const solingen = graph.find((node) => String(node["@id"]).endsWith("#studio-solingen"));
  assert.ok(organization);
  assert.ok(hagen);
  assert.ok(solingen);

  const hours = hagenOpeningHoursSpecification();
  assert.deepEqual(hagen.openingHoursSpecification, hours);
  assert.deepEqual(organization.openingHoursSpecification, hours);
  assert.equal(Object.hasOwn(solingen, "openingHours"), false);
  assert.equal(Object.hasOwn(solingen, "openingHoursSpecification"), false);

  for (const node of graph) {
    assert.equal(Object.hasOwn(node, "openingHours"), false);
    assert.equal(node.telephone, CONTACT_PHONE_TEL);
    assert.equal(node.email, CONTACT_EMAIL);
  }

  for (const node of [hagen, solingen]) {
    const types = node["@type"] as string[];
    assert.ok(types.includes("LocalBusiness"));
    assert.ok(types.includes("Photographer"));
  }

  const hagenAddress = hagen.address as { streetAddress: string; postalCode: string; addressLocality: string };
  const solingenAddress = solingen.address as {
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
  };
  assert.equal(hagenAddress.streetAddress, HAGEN_ADDRESS.street);
  assert.equal(hagenAddress.postalCode, HAGEN_ADDRESS.postalCode);
  assert.equal(hagenAddress.addressLocality, HAGEN_ADDRESS.city);
  assert.equal(solingenAddress.streetAddress, SOLINGEN_ADDRESS.street);
  assert.equal(solingenAddress.postalCode, SOLINGEN_ADDRESS.postalCode);
  assert.equal(solingenAddress.addressLocality, SOLINGEN_ADDRESS.city);

  const serializedSolingen = JSON.stringify(solingen);
  assert.equal(serializedSolingen.includes("openingHours"), false);
});

test("rendered copy reads addresses, phone, and hours from the contact config", () => {
  const german = getDictionarySync("de");
  const english = getDictionarySync("en");
  assert.equal(german.seo.home.description.includes(HAGEN_ADDRESS.street), true);
  assert.equal(german.seo.home.description.includes("{hagenStreet}"), false);
  assert.equal(english.seo.studio.description.includes(HAGEN_ADDRESS.street), true);
  assert.equal(english.seo.home.description.includes("{hagenStreet}"), false);
  assert.equal(german.seo.studio.description.includes(HAGEN_ADDRESS.street), true);
  assert.equal(german.seo.solingen.description.includes(SOLINGEN_ADDRESS.street), true);
  assert.equal(german.seo.solingen.description.includes("{"), false);
  assert.equal(english.seo.solingen.description.includes(SOLINGEN_ADDRESS.street), true);
  assert.equal(english.seo.studio.description.includes("{"), false);
  assert.equal(
    getLocalizedCategory("business-portraits", "de").aboutText.includes(
      appointmentOnlyLabel("de", { sentence: false })
    ),
    true
  );
  assert.equal(
    getLocalizedCategory("business-portraits", "en").aboutText.includes(
      appointmentOnlyLabel("en", { sentence: false })
    ),
    true
  );

  const faqs = readFaqFile("commercial", "de");
  const where = faqs.find((item) => item.answer.includes(HAGEN_ADDRESS.street));
  assert.ok(where);
  assert.equal(where.answer.includes(SOLINGEN_ADDRESS.street), true);
  assert.equal(where.answer.includes("{hagenStreet}"), false);
  assert.equal(where.answer.includes("{solingenStreet}"), false);
  assert.equal(where.answer.includes(appointmentOnlyLabel("de", { sentence: false })), true);
  assert.equal(where.answer.includes("{appointment"), false);

  for (const locale of ["de", "en"] as const) {
    const document = getLegalDocument("/impressum", locale);
    const contact = document.blocks.find((block) => block.heading === (locale === "de" ? "Kontakt" : "Contact"));
    assert.ok(contact);
    const text = contact.paragraphs.join("\n");
    assert.equal(text.includes(CONTACT_PHONE_DISPLAY), true);
    assert.equal(text.includes(CONTACT_EMAIL), true);
    assert.equal(text.includes(formatHagenOpeningHours(locale)), true);
    assert.equal(text.includes(appointmentOnlyLabel(locale)), true);
    const solingenLine = contact.paragraphs.find((paragraph) => paragraph.includes("Solingen"));
    assert.ok(solingenLine);
    assert.equal(solingenLine.includes("10:00"), false);
    assert.equal(solingenLine.includes("09:00"), false);
  }
});

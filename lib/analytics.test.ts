import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  CONTACT_CLICK_EVENT,
  GENERATE_LEAD_EVENT,
  IMMOBILIEN_BOOKING_FORM_NAME,
  canTrackAnalytics,
  contactLinkFromTarget,
  handleContactClick,
  immobilienBookingLead,
  inquiryFormName,
  inquiryLead,
  installContactClickListener,
  pageService,
  serviceForInquirySlug,
  trackEvent,
  trackGenerateLead,
} from "./analytics";
import { resolveBookingContext, type InquiryCategorySlug } from "./booking";
import { COOKIE_CONSENT_STORAGE_KEY } from "./cookieConsent";
import { GA_MEASUREMENT_ID } from "./site";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const INQUIRY_SLUGS: InquiryCategorySlug[] = [
  "wedding",
  "business-portraits",
  "studio",
  "food",
  "cinematography",
  "social-media-management",
  "commercial",
  "general",
];

function readSource(relativePath: string) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function installBrowser(options: {
  nodeEnv?: string;
  consent?: "all" | "essential" | null;
  hostname?: string;
  pathname?: string;
  gtag?: ((...args: unknown[]) => void) | undefined;
  analyticsDisabled?: boolean;
}) {
  const env = process.env as Record<string, string | undefined>;
  const previousEnv = env.NODE_ENV;
  const hadWindow = "window" in globalThis;
  const previousWindow = globalThis.window;

  env.NODE_ENV = options.nodeEnv ?? "production";
  const store = new Map<string, string>();
  if (options.consent) store.set(COOKIE_CONSENT_STORAGE_KEY, options.consent);

  const win = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
    },
    location: {
      hostname: options.hostname ?? "www.aaronbowser-photography.com",
      pathname: options.pathname ?? "/de",
    },
    gtag: options.gtag,
  } as unknown as Window & typeof globalThis;

  if (options.analyticsDisabled) {
    (win as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  }

  globalThis.window = win;

  return () => {
    if (previousEnv === undefined) delete env.NODE_ENV;
    else env.NODE_ENV = previousEnv;
    if (hadWindow) globalThis.window = previousWindow;
    else delete (globalThis as { window?: Window }).window;
  };
}

function anchor(href: string) {
  return {
    getAttribute(name: string) {
      return name === "href" ? href : null;
    },
  };
}

function clickTarget(href: string) {
  const link = anchor(href);
  return {
    closest(selector: string) {
      return selector === "a" ? link : null;
    },
  };
}

test("measurement id is the existing GA4 stream and the tag is mounted for every host", () => {
  assert.equal(GA_MEASUREMENT_ID, "G-L8XCWNTH3N");

  const layout = readSource("app/layout.tsx");
  assert.match(layout, /<GoogleAnalytics\s*\/>/);
  assert.match(layout, /<ContactClickListener\s*\/>/);

  const analytics = readSource("components/GoogleAnalytics.tsx");
  assert.match(analytics, /GA_MEASUREMENT_ID/);
  assert.equal(analytics.includes("nicheHost"), false);
  assert.equal(analytics.includes("abowserphoto.com"), false);
  assert.match(analytics, /hasAnalyticsConsent/);
});

test("page service follows the niche host, then the path", () => {
  const hosts: Array<[string, string]> = [
    ["immo.abowserphoto.com", "immobilien"],
    ["studio.abowserphoto.com", "bewerbungsfoto"],
    ["commercial.abowserphoto.com", "commercial"],
    ["business.abowserphoto.com", "business"],
    ["film.abowserphoto.com", "film"],
    ["social.abowserphoto.com", "social"],
    ["food.abowserphoto.com", "food"],
    ["wedding.abowserphoto.com", "wedding"],
    ["IMMO.ABOWSERPHOTO.COM", "immobilien"],
    ["studio.localhost:3001", "bewerbungsfoto"],
  ];

  for (const [host, service] of hosts) {
    assert.equal(pageService("/de", host), service, host);
    assert.equal(pageService("/", host), service, host);
  }

  assert.equal(pageService("/de/passfotos", "studio.abowserphoto.com"), "passfoto");
  assert.equal(pageService("/en/passport-photos", "www.aaronbowser-photography.com"), "passfoto");
  assert.equal(pageService("/de/passbilder", "www.aaronbowser-photography.com"), "passfoto");
  assert.equal(pageService("/de/passfotos", "immo.abowserphoto.com"), "immobilien");

  assert.equal(pageService("/de/bewerbungsfotos", "www.aaronbowser-photography.com"), "bewerbungsfoto");
  assert.equal(pageService("/en/application-photos", "www.aaronbowser-photography.com"), "bewerbungsfoto");
  assert.equal(pageService("/de/immobilienfotografie", "www.aaronbowser-photography.com"), "immobilien");
  assert.equal(pageService("/en/real-estate", "www.aaronbowser-photography.com"), "immobilien");
  assert.equal(pageService("/de/hochzeitsfotograf", "www.aaronbowser-photography.com"), "wedding");
  assert.equal(pageService("/en/business-portraits", "www.aaronbowser-photography.com"), "business");
  assert.equal(pageService("/de/commercial-fotografie", "www.aaronbowser-photography.com"), "commercial");
  assert.equal(pageService("/de/food-fotografie", "www.aaronbowser-photography.com"), "food");
  assert.equal(pageService("/de/filmproduktion", "www.aaronbowser-photography.com"), "film");
  assert.equal(pageService("/de/social-media", "www.aaronbowser-photography.com"), "social");

  assert.equal(pageService("/de", "www.aaronbowser-photography.com"), undefined);
  assert.equal(pageService("/de/datenschutz", "www.aaronbowser-photography.com"), undefined);
  assert.equal(pageService("/de/impressum", "food.abowserphoto.com"), "food");
});

test("booking context uses the niche host when the address bar has no category", () => {
  assert.equal(resolveBookingContext("/de", "immo.abowserphoto.com").isRealEstate, true);
  assert.equal(resolveBookingContext("/de/book", "immo.localhost:3001").isRealEstate, true);
  assert.equal(resolveBookingContext("/de/immobilienfotografie", "www.aaronbowser-photography.com").isRealEstate, true);
  assert.equal(resolveBookingContext("/en/real-estate", "www.aaronbowser-photography.com").isRealEstate, true);
  assert.equal(resolveBookingContext("/de", "www.aaronbowser-photography.com").isRealEstate, false);
  assert.equal(
    resolveBookingContext("/de", "www.aaronbowser-photography.com").inquiryCategory.slug,
    "general"
  );

  assert.equal(resolveBookingContext("/de", "studio.abowserphoto.com").inquiryCategory.slug, "studio");
  assert.equal(resolveBookingContext("/en", "wedding.abowserphoto.com").inquiryCategory.slug, "wedding");
  assert.equal(resolveBookingContext("/", "business.abowserphoto.com").inquiryCategory.slug, "business-portraits");
  assert.equal(resolveBookingContext("/de/impressum", "food.abowserphoto.com").inquiryCategory.slug, "food");
  assert.equal(resolveBookingContext("/de", "film.abowserphoto.com").inquiryCategory.slug, "cinematography");
  assert.equal(resolveBookingContext("/de", "social.abowserphoto.com").inquiryCategory.slug, "social-media-management");
  assert.equal(resolveBookingContext("/de", "commercial.abowserphoto.com").inquiryCategory.slug, "commercial");
  assert.equal(resolveBookingContext("/de/hochzeitsfotograf", "www.aaronbowser-photography.com").inquiryCategory.slug, "wedding");
  assert.equal(resolveBookingContext("/de/passfotos", "www.aaronbowser-photography.com").inquiryCategory.slug, "studio");
  assert.equal(resolveBookingContext("/en/business-portraits", "www.aaronbowser-photography.com").inquiryCategory.slug, "business-portraits");
});

test("lead params are stable snake_case form ids and a page service", () => {
  assert.deepEqual(immobilienBookingLead(), {
    form_name: "immobilien_booking",
    service: "immobilien",
  });
  assert.equal(IMMOBILIEN_BOOKING_FORM_NAME, "immobilien_booking");

  const expected: Record<InquiryCategorySlug, { form_name: string; service: string }> = {
    wedding: { form_name: "wedding_inquiry", service: "wedding" },
    "business-portraits": { form_name: "business_inquiry", service: "business" },
    studio: { form_name: "studio_inquiry", service: "bewerbungsfoto" },
    food: { form_name: "food_inquiry", service: "food" },
    cinematography: { form_name: "film_inquiry", service: "film" },
    "social-media-management": { form_name: "social_inquiry", service: "social" },
    commercial: { form_name: "commercial_inquiry", service: "commercial" },
    general: { form_name: "general_inquiry", service: "general" },
  };

  for (const slug of INQUIRY_SLUGS) {
    assert.match(inquiryFormName(slug), /^[a-z0-9_]+$/);
    assert.deepEqual(inquiryLead(slug, "/de", "www.aaronbowser-photography.com"), expected[slug]);
  }

  assert.deepEqual(inquiryLead("studio", "/de/passfotos", "studio.abowserphoto.com"), {
    form_name: "studio_inquiry",
    service: "passfoto",
  });
  assert.deepEqual(inquiryLead("studio", "/en/passport-photos", "www.aaronbowser-photography.com"), {
    form_name: "studio_inquiry",
    service: "passfoto",
  });
  assert.deepEqual(inquiryLead("wedding", "/de", "wedding.abowserphoto.com"), {
    form_name: "wedding_inquiry",
    service: "wedding",
  });
  assert.equal(serviceForInquirySlug("general"), "general");
  assert.equal(serviceForInquirySlug("studio"), "bewerbungsfoto");
});

test("generate_lead is sent only after a successful submit", () => {
  for (const file of ["components/BookingForm.tsx", "components/GeneralInquiryForm.tsx"]) {
    const source = readSource(file);
    const call = source.indexOf("trackGenerateLead(");
    assert.ok(call > 0, file);
    assert.match(source.slice(Math.max(0, call - 80), call), /if\s*\(\s*result\.success\s*\)\s*\{/);
    assert.equal(source.indexOf("trackGenerateLead(", call + 1), -1, file);
  }

  const ignored = ["components/AccountProfileForm.tsx", "components/Auth/ClientAuth.tsx"];
  for (const file of ignored) {
    assert.equal(readSource(file).includes("trackGenerateLead"), false, file);
  }
});

test("contact links are tel or mailto only", () => {
  assert.deepEqual(contactLinkFromTarget(clickTarget("tel:+15550001111") as unknown as EventTarget), {
    link_type: "tel",
    link_url: "tel:+15550001111",
  });
  assert.deepEqual(contactLinkFromTarget(clickTarget("MAILTO:guest@example.com") as unknown as EventTarget), {
    link_type: "mailto",
    link_url: "MAILTO:guest@example.com",
  });
  assert.deepEqual(
    contactLinkFromTarget(clickTarget("mailto:guest@example.com?subject=Shoot") as unknown as EventTarget),
    {
      link_type: "mailto",
      link_url: "mailto:guest@example.com?subject=Shoot",
    }
  );

  const child = {
    parentElement: clickTarget("tel:+15550001111"),
  };
  assert.equal(contactLinkFromTarget(child as unknown as EventTarget)?.link_type, "tel");

  for (const href of ["https://aaronbowser-photography.com", "/de/kontakt", "#", "javascript:void(0)", ""]) {
    assert.equal(contactLinkFromTarget(clickTarget(href) as unknown as EventTarget), null, href);
  }
  assert.equal(contactLinkFromTarget(null), null);
});

test("trackEvent is a no-op during SSR, in dev, without consent, or without gtag", () => {
  const calls: unknown[][] = [];
  const gtag = (...args: unknown[]) => {
    calls.push(args);
  };

  assert.equal(trackGenerateLead({ form_name: "general_inquiry", service: "general" }), false);
  assert.equal(trackEvent(GENERATE_LEAD_EVENT, { form_name: "general_inquiry", service: "general", host: "x" }), false);

  const restoreDev = installBrowser({ nodeEnv: "development", consent: "all", gtag });
  assert.equal(canTrackAnalytics(), false);
  assert.equal(trackGenerateLead(immobilienBookingLead()), false);
  restoreDev();

  const restoreTest = installBrowser({ nodeEnv: "test", consent: "all", gtag });
  assert.equal(trackEvent(CONTACT_CLICK_EVENT, { link_type: "tel", link_url: "tel:+1", host: "h" }), false);
  restoreTest();

  const restoreEssential = installBrowser({ consent: "essential", gtag });
  assert.equal(canTrackAnalytics(), false);
  assert.equal(trackGenerateLead(immobilienBookingLead()), false);
  restoreEssential();

  const restoreMissing = installBrowser({ consent: "all" });
  assert.equal(canTrackAnalytics(), false);
  assert.equal(trackGenerateLead(immobilienBookingLead()), false);
  restoreMissing();

  const restoreDisabled = installBrowser({ consent: "all", gtag, analyticsDisabled: true });
  assert.equal(canTrackAnalytics(), false);
  assert.equal(trackGenerateLead(immobilienBookingLead()), false);
  restoreDisabled();

  assert.equal(calls.length, 0);
});

test("trackEvent sends generate_lead and contact_click only when the tag is allowed", () => {
  const calls: unknown[][] = [];
  const restore = installBrowser({
    consent: "all",
    hostname: "immo.abowserphoto.com",
    pathname: "/de",
    gtag: (...args: unknown[]) => {
      calls.push(args);
    },
  });

  assert.equal(trackGenerateLead(immobilienBookingLead()), true);
  assert.deepEqual(calls[0], [
    "event",
    "generate_lead",
    { form_name: "immobilien_booking", service: "immobilien", host: "immo.abowserphoto.com" },
  ]);

  window.gtag = () => {
    throw new Error("gtag failed");
  };
  assert.equal(trackGenerateLead(inquiryLead("food", "/de", "food.abowserphoto.com")), false);

  restore();
});

test("delegated click listener covers links added after it is installed", () => {
  const calls: unknown[][] = [];
  const restore = installBrowser({
    consent: "all",
    hostname: "food.abowserphoto.com",
    pathname: "/de/impressum",
    gtag: (...args: unknown[]) => {
      calls.push(args);
    },
  });

  const registered: { handler: ((event: Event) => void) | null; options: unknown } = {
    handler: null,
    options: undefined,
  };
  const listenable = {
    addEventListener(_type: "click", listener: (event: Event) => void, listenerOptions?: unknown) {
      registered.handler = listener;
      registered.options = listenerOptions;
    },
    removeEventListener() {
      registered.handler = null;
    },
  };

  const uninstall = installContactClickListener(listenable);
  assert.deepEqual(registered.options, { passive: true });
  assert.equal(typeof registered.handler, "function");

  const addedLater = clickTarget("mailto:guest@example.com");
  const prevented = { called: false };
  registered.handler?.({
    target: addedLater,
    preventDefault() {
      prevented.called = true;
    },
  } as unknown as Event);

  assert.equal(prevented.called, false);
  assert.deepEqual(calls, [
    [
      "event",
      "contact_click",
      {
        link_type: "mailto",
        link_url: "mailto:guest@example.com",
        host: "food.abowserphoto.com",
        service: "food",
      },
    ],
  ]);

  registered.handler?.({ target: clickTarget("https://example.com") } as unknown as Event);
  assert.equal(calls.length, 1);

  uninstall();
  registered.handler?.({ target: clickTarget("tel:+15550001111") } as unknown as Event);
  assert.equal(calls.length, 1);

  restore();
});

test("contact clicks omit service when the page has no category", () => {
  const calls: unknown[][] = [];
  const restore = installBrowser({
    consent: "all",
    hostname: "www.aaronbowser-photography.com",
    pathname: "/de/datenschutz",
    gtag: (...args: unknown[]) => {
      calls.push(args);
    },
  });

  assert.equal(
    handleContactClick({ target: clickTarget("tel:+15550001111") } as unknown as Event),
    true
  );
  assert.deepEqual(calls[0], [
    "event",
    "contact_click",
    {
      link_type: "tel",
      link_url: "tel:+15550001111",
      host: "www.aaronbowser-photography.com",
    },
  ]);

  restore();

  const blocked = installBrowser({
    nodeEnv: "development",
    consent: "all",
    gtag: (...args: unknown[]) => {
      calls.push(args);
    },
  });
  assert.equal(handleContactClick({ target: clickTarget("tel:+15550001111") } as unknown as Event), false);
  assert.equal(calls.length, 1);
  blocked();
});

test("installContactClickListener does nothing when there is no document", () => {
  const uninstall = installContactClickListener();
  assert.equal(typeof uninstall, "function");
  uninstall();
});

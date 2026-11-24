import Link from "next/link";
import LightPageFrame from "./LightPageFrame";
import GuestEnquiry from "./GuestEnquiry";
import { FaqPageJsonLd, SolingenPlaceJsonLd, SolingenRentalJsonLd } from "./JsonLd";
import {
  appointmentOnlyLabel,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  contactEmailHref,
  contactPhoneHref,
  formatAddressLine,
  SOLINGEN_ADDRESS,
} from "../lib/contact";
import type { Locale } from "../lib/i18n/config";
import { withLocale } from "../lib/i18n/config";
import type { Dictionary } from "../lib/i18n/getDictionary";
import { categoryPath } from "../lib/routes";
import { SOLINGEN_STUDIO, solingenRentalCopy } from "../lib/site";
import { portalCategoryUrl } from "../lib/subdomains";

type SolingenStudioPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  logoUrl: string | null;
  publicHost?: string;
};

function TextLink({ href, children }: { href: string; children: string }) {
  const className = "underline decoration-[#322B2B]/40 underline-offset-[3px] hover:opacity-70";
  if (href.startsWith("http")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function SolingenStudioPage({
  locale,
  dictionary,
  logoUrl,
  publicHost,
}: SolingenStudioPageProps) {
  const de = locale === "de";
  const address = formatAddressLine(SOLINGEN_ADDRESS);
  const studioHref = portalCategoryUrl("studio", { host: publicHost, locale });
  const href = (slug: Parameters<typeof categoryPath>[0]) => withLocale(categoryPath(slug, locale), locale);
  const rental = solingenRentalCopy(locale);
  const solingenFaqs = de
    ? [
        {
          question: "Was kostet die Studiomiete?",
          answer: `${rental.hourly}. ${rental.halfDay}. ${rental.fullDay}. ${rental.vat}`,
        },
        { question: "Wie groß ist das Studio?", answer: "Rund 100 m², genug für Teams, große Sets und Videodrehs." },
        {
          question: "Wie buche ich das Studio?",
          answer: "Nach Terminvereinbarung per Telefon, WhatsApp oder E-Mail. Sie bekommen eine Terminbestätigung.",
        },
        {
          question: "Kann ich auch Videos im Studio drehen?",
          answer: "Ja, das Studio ist für Foto- und Videoproduktionen ausgelegt.",
        },
      ]
    : [
        {
          question: "What does the studio rental cost?",
          answer: `${rental.hourly}. ${rental.halfDay}. ${rental.fullDay}. ${rental.vat}`,
        },
        { question: "How large is the studio?", answer: "About 100 m², enough for teams, large sets and video." },
        {
          question: "How do I book the studio?",
          answer: "By appointment, by phone, WhatsApp or email. You receive a confirmation.",
        },
        { question: "Can I film in the studio?", answer: "Yes. The studio is set up for photography and video." },
      ];

  return (
    <LightPageFrame locale={locale} dictionary={dictionary} logoUrl={logoUrl}>
      <SolingenPlaceJsonLd locale={locale} />
      <SolingenRentalJsonLd locale={locale} />
      <FaqPageJsonLd items={solingenFaqs} />
      <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#322B2B]/55">
        {de ? "Studio Solingen" : "Solingen studio"}
      </p>
      <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">
        {de ? "Fotostudio mieten in Solingen" : "Rent a photo studio in Solingen"}
      </h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-[#322B2B]/85 sm:text-base">
        <p>
          {de
            ? `Das Fotostudio in Solingen, ${address}, bietet rund 100 m² für Produktionen, die Platz brauchen: Teamshootings, Commercial- und Fashion-Sets, Food-Aufbauten und Videodrehs. Sie mieten das Studio nach Terminvereinbarung, für Ihre eigene Produktion oder zusammen mit einem Shooting. Die Studiomiete kostet 54 € pro Stunde (mindestens 2 Stunden), 189 € für einen halben Tag (4 Stunden) und 329 € für einen ganzen Tag (8 Stunden), alle Preise inkl. 19 % MwSt. Fragen Sie Ihren Wunschtermin per Telefon, WhatsApp oder E-Mail an.`
            : `The photo studio in Solingen, ${address}, offers about 100 m² for productions that need the space: team shoots, commercial and fashion sets, food builds and video. You rent it by appointment, for your own production or together with a shoot. The rent is €54 per hour (at least 2 hours), €189 for a half day (4 hours) and €329 for a full day (8 hours), all prices include 19% VAT. Ask for a time by phone, WhatsApp or email.`}
        </p>
        <h2 className="pt-4 text-2xl font-light tracking-tight">
          {de ? "Termin vor dem Besuch" : "An appointment before you come"}
        </h2>
        <p>
          {de
            ? "Das Studio kann auch gemietet werden. Die Konditionen stehen unten. Ein Termin wird bestätigt, bevor jemand kommt."
            : "The studio can also be rented. The rates are below. A time is confirmed before anyone arrives."}
        </p>
        <h2 className="pt-4 text-2xl font-light tracking-tight">
          {de ? "Studio mieten" : "Rent the studio"}
        </h2>
        <p>
          {de
            ? `Studio mieten in Solingen – ca. ${SOLINGEN_STUDIO.areaSqm} m², ${address}, nur nach Vereinbarung.`
            : `Rent the studio in Solingen – about ${SOLINGEN_STUDIO.areaSqm} m², ${address}, by appointment only.`}
        </p>
        <ul className="space-y-1">
          <li>{rental.hourly}</li>
          <li>{rental.halfDay}</li>
          <li>{rental.fullDay}</li>
        </ul>
        <p>{rental.vat}</p>
        <p>{rental.invoice}</p>
        <p>{rental.photographerExtra}</p>
        <h2 className="pt-4 text-2xl font-light tracking-tight">
          {de ? "Wofür der Raum da ist" : "What the room is for"}
        </h2>
        <p>
          {de ? (
            <>
              Auf der Fläche entstehen{" "}
              <TextLink href={href("commercial")}>Commercial-Aufträge</TextLink>,{" "}
              <TextLink href={href("business-portraits")}>Teamfotos</TextLink> und Produktionen, die
              Aufbau und Ruhe brauchen.{" "}
              <TextLink href={href("food")}>Food</TextLink> und{" "}
              <TextLink href={href("cinematography")}>Film</TextLink> nutzen das Studio, wenn das Set
              mehr als eine kleine Ecke ist. Hochzeiten werden am Ort der Trauung fotografiert; wenn
              danach Porträts im Studio sinnvoll sind, kann das hier oder in Hagen sein.
            </>
          ) : (
            <>
              The floor is used for <TextLink href={href("commercial")}>commercial commissions</TextLink>
              , <TextLink href={href("business-portraits")}>team photographs</TextLink>, and productions
              that need a build and some quiet. <TextLink href={href("food")}>Food</TextLink> and{" "}
              <TextLink href={href("cinematography")}>film</TextLink> use the studio when the set is more
              than a small corner. Weddings are photographed where the ceremony is; portraits afterwards
              can be made here or in Hagen when that suits the day.
            </>
          )}
        </p>
        <h2 className="pt-4 text-2xl font-light tracking-tight">
          {de ? "Bewerbungsfotos und Passbilder" : "Application and passport photos"}
        </h2>
        <p>
          {de ? (
            <>
              Studio Hagen bietet Bewerbungsfotos und Passbilder, mehr dazu{" "}
              <TextLink href={studioHref}>hier</TextLink>.
            </>
          ) : (
            <>
              Studio Hagen offers application and passport photos, more info{" "}
              <TextLink href={studioHref}>here</TextLink>.
            </>
          )}
        </p>
        <h2 className="pt-4 text-2xl font-light tracking-tight">{de ? "Fragen" : "Questions"}</h2>
        {solingenFaqs.map((item) => (
          <div key={item.question}>
            <h3 className="text-base font-medium">{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
        <h2 className="pt-4 text-2xl font-light tracking-tight">{dictionary.footer.contact}</h2>
        <p>
          <span className="block">{de ? "Studio Solingen" : "Solingen studio"}</span>
          <span className="block">{SOLINGEN_ADDRESS.street}</span>
          <span className="block">
            {SOLINGEN_ADDRESS.postalCode} {SOLINGEN_ADDRESS.city}
          </span>
          <a href={contactPhoneHref()} className="mt-3 block underline underline-offset-2">
            {CONTACT_PHONE_DISPLAY}
          </a>
          <a href={contactEmailHref()} className="block underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
          <a
            href={SOLINGEN_STUDIO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block underline underline-offset-2"
          >
            {dictionary.footer.directions}
          </a>
          <span className="mt-3 block">{appointmentOnlyLabel(locale)}</span>
        </p>
        <h2 className="pt-4 text-2xl font-light tracking-tight">{de ? "Termin anfragen" : "Request a time"}</h2>
        <GuestEnquiry topic={de ? "Fotostudio Solingen" : "Solingen studio"} />
      </div>
    </LightPageFrame>
  );
}

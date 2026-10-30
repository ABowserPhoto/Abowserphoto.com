import Link from "next/link";
import LightPageFrame from "./LightPageFrame";
import { SolingenPlaceJsonLd } from "./JsonLd";
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
import { SOLINGEN_STUDIO } from "../lib/site";
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
  const appointment = appointmentOnlyLabel(locale, { sentence: false });
  const address = formatAddressLine(SOLINGEN_ADDRESS);
  const studioHref = portalCategoryUrl("studio", { host: publicHost, locale });
  const href = (slug: Parameters<typeof categoryPath>[0]) => withLocale(categoryPath(slug, locale), locale);

  return (
    <LightPageFrame locale={locale} dictionary={dictionary} logoUrl={logoUrl}>
      <SolingenPlaceJsonLd locale={locale} />
      <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#322B2B]/55">
        {de ? "Studio Solingen" : "Solingen studio"}
      </p>
      <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">
        {de ? "Fotostudio mieten in Solingen" : "Rent a photo studio in Solingen"}
      </h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-[#322B2B]/85 sm:text-base">
        <p>
          {de
            ? `Das Fotostudio in Solingen liegt in der ${address}. Es hat etwa 100 Quadratmeter und ist für größere Projekte und Produktionen gedacht: Teams, Commercial-Sets und Aufbauten, die im Alltagstudio in Hagen keinen Platz haben. Gearbeitet wird hier nicht im Vorbeigehen, sondern dann, wenn der Raum für eine Produktion gebraucht wird.`
            : `The photo studio in Solingen is at ${address}. It is about 100 square metres and is meant for larger projects and productions: teams, commercial sets, and builds that do not fit in the everyday studio in Hagen. Work happens here when a production needs the room, not as a walk-in counter.`}
        </p>
        <h2 className="pt-4 text-2xl font-light tracking-tight">
          {de ? "Nur nach Vereinbarung" : "By appointment only"}
        </h2>
        <p>
          {de
            ? `Es gibt keine öffentlichen Öffnungszeiten. Das Studio ist ${appointment} zugänglich und kann gemietet werden, wenn eine Produktion die Fläche für sich braucht. Was an Dauer, Licht und Personen dazugehört, wird vor dem Termin geklärt. Einen öffentlichen Mietpreis gibt es nicht; Sie erhalten ein Angebot. Telefon und E-Mail stehen unten, und ein Termin wird bestätigt, bevor jemand kommt.`
            : `There are no public opening hours. The studio is ${appointment} and can be rented when a production needs the floor to itself. Duration, light, and how many people are coming are agreed before the day. There is no public rental fee; you receive a quote. Phone and email are below, and a time is confirmed before anyone arrives.`}
        </p>
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
          {de ? "Was hier nicht angeboten wird" : "What is not offered here"}
        </h2>
        <p>
          {de ? (
            <>
              Bewerbungsfotos und Passbilder gibt es in Solingen nicht. Dafür ist das Fotostudio Hagen
              zuständig, auf einer <TextLink href={studioHref}>eigenen Seite</TextLink>.
            </>
          ) : (
            <>
              Application photos and passport photos are not offered in Solingen. Those sittings belong
              to the Hagen studio, on its <TextLink href={studioHref}>own page</TextLink>.
            </>
          )}
        </p>
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
      </div>
    </LightPageFrame>
  );
}

import type { Locale } from "./i18n/config";
import type { LegalPath } from "./routes";
import {
  BRAND_NAME,
  COMPANY_REGISTER,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  formatStudioLine,
  HAGEN_STUDIO,
  HOSTING_PROVIDER,
  LEGAL_NAME,
  MANAGING_DIRECTOR,
  SOLINGEN_STUDIO,
} from "./site";

export type LegalBlock = {
  heading: string;
  paragraphs: string[];
  missing?: boolean;
};

export type LegalDocument = {
  title: string;
  draftNote: string;
  blocks: LegalBlock[];
};

const hagen = `${LEGAL_NAME}, ${formatStudioLine(HAGEN_STUDIO)}`;

function impressum(locale: Locale): LegalDocument {
  const de = locale === "de";
  return {
    title: de ? "Impressum" : "Legal notice",
    draftNote: de
      ? "Entwurf. Im Projekt lag kein früherer Impressumstext. Die Firmendaten unten stammen aus dem bestehenden Footer. Felder mit dem Hinweis „Angabe fehlt“ muss der Inhaber ergänzen, bevor diese Seite als vollständiges Impressum gilt."
      : "Draft. The repository had no previous legal-notice text. The company details below come from the existing footer. Fields marked “missing” have to be completed by the owner before this page is a full legal notice.",
    blocks: [
      {
        heading: de ? "Anbieter" : "Provider",
        paragraphs: [
          LEGAL_NAME,
          de
            ? `Hauptstudio: ${formatStudioLine(HAGEN_STUDIO)}`
            : `Main studio: ${formatStudioLine(HAGEN_STUDIO)}`,
          de ? "Deutschland" : "Germany",
          de
            ? `Studio Solingen, nur nach Termin, für größere Produktionen: ${formatStudioLine(SOLINGEN_STUDIO)}`
            : `Solingen studio, by appointment only, for larger productions: ${formatStudioLine(SOLINGEN_STUDIO)}`,
        ],
      },
      {
        heading: de ? "Kontakt" : "Contact",
        paragraphs: [
          de ? `Telefon: ${CONTACT_PHONE_DISPLAY}` : `Phone: ${CONTACT_PHONE_DISPLAY}`,
          `E-Mail: ${CONTACT_EMAIL}`,
        ],
      },
      {
        heading: de ? "Register und Umsatzsteuer" : "Register and VAT",
        paragraphs: [
          de
            ? `Gericht: ${COMPANY_REGISTER.court}. HRB: ${COMPANY_REGISTER.hrb}.`
            : `Court: ${COMPANY_REGISTER.court}. HRB: ${COMPANY_REGISTER.hrb}.`,
          de
            ? `Umsatzsteuer-ID: ${COMPANY_REGISTER.vatId}`
            : `VAT ID: ${COMPANY_REGISTER.vatId}`,
        ],
      },
      {
        heading: de ? "Geschäftsführung" : "Managing director",
        missing: MANAGING_DIRECTOR === null,
        paragraphs: [
          MANAGING_DIRECTOR ??
            (de
              ? "Angabe fehlt. Bitte den Geschäftsführer der UG eintragen."
              : "Missing. Please add the managing director of the company."),
        ],
      },
      {
        heading: de ? "Verantwortlich für den Inhalt" : "Responsible for content",
        missing: MANAGING_DIRECTOR === null,
        paragraphs: [
          MANAGING_DIRECTOR
            ? `${MANAGING_DIRECTOR}, ${formatStudioLine(HAGEN_STUDIO)}`
            : de
              ? "Angabe fehlt. Bitte die nach § 18 Abs. 2 MStV verantwortliche Person eintragen."
              : "Missing. Please name the person responsible for the content.",
        ],
      },
    ],
  };
}

function datenschutz(locale: Locale): LegalDocument {
  const de = locale === "de";
  return {
    title: de ? "Datenschutzerklärung" : "Privacy policy",
    draftNote: de
      ? "Entwurf, keine anwaltliche Prüfung. Im Projekt lag kein früherer Datenschutztext. Beschrieben ist nur, was diese Website nach dem aktuellen Code tatsächlich tut. Offene Punkte sind markiert."
      : "Draft, not reviewed by counsel. The repository had no previous privacy text. This page describes only what the current code actually does. Open points are marked.",
    blocks: [
      {
        heading: de ? "Verantwortlicher" : "Controller",
        paragraphs: [
          hagen,
          de ? "Deutschland" : "Germany",
          `${de ? "Telefon" : "Phone"}: ${CONTACT_PHONE_DISPLAY}`,
          `E-Mail: ${CONTACT_EMAIL}`,
        ],
      },
      {
        heading: de ? "Hosting" : "Hosting",
        missing: HOSTING_PROVIDER === null,
        paragraphs: [
          HOSTING_PROVIDER
            ? de
              ? `Die Website wird betrieben bei ${HOSTING_PROVIDER}.`
              : `The website is hosted by ${HOSTING_PROVIDER}.`
            : de
              ? "Angabe fehlt. Bitte den Hosting-Anbieter eintragen. Der Anbieter kann technisch bedingt Zugriffsdaten verarbeiten, zum Beispiel IP-Adresse, Zeitpunkt und aufgerufene Adresse."
              : "Missing. Please name the hosting provider. That provider may process access data such as IP address, time, and the address requested.",
        ],
      },
      {
        heading: de ? "Konto und Anfragen" : "Account and enquiries",
        paragraphs: [
          de
            ? "Wenn Sie ein Kundenkonto anlegen oder eine Shoot-Anfrage senden, verarbeiten wir die Angaben aus dem Formular: Name, E-Mail, Telefon, Firma, Adresse des Shootings und Ihre Nachricht. Die Anmeldung läuft über den Dienst Supabase. Anfragen werden per E-Mail an das Studio gesendet. Termine werden gegen den Studio-Kalender geprüft."
            : "If you create a client account or send a shoot enquiry, we process the form fields: name, email, phone, company, the address of the shoot, and your message. Sign-in runs through Supabase. Enquiries are emailed to the studio. Appointment requests are checked against the studio calendar.",
          de
            ? "Eine feste Speicherdauer ist hier noch nicht hinterlegt. Bitte vom Inhaber festlegen."
            : "A fixed retention period is not recorded here yet. The owner still has to set one.",
        ],
      },
      {
        heading: de ? "Cookies und lokaler Speicher" : "Cookies and local storage",
        paragraphs: [
          de
            ? "Die Website setzt ein Cookie namens NEXT_LOCALE, um die gewählte Sprache zu speichern. Wenn Sie sich anmelden, setzt der Login-Dienst Sitzungs-Cookies. Die Cookie-Auswahl selbst liegt im lokalen Speicher des Browsers unter dem Schlüssel cookie-consent. Ein Analyse- oder Werbe-Tool ist im aktuellen Code nicht eingebunden."
            : "The site sets a cookie named NEXT_LOCALE to remember the chosen language. When you sign in, the login service sets session cookies. The cookie choice itself is stored in the browser under the key cookie-consent. The current code does not embed an analytics or advertising tool.",
        ],
      },
      {
        heading: de ? "Ihre Rechte" : "Your rights",
        paragraphs: [
          de
            ? "Sie können Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch verlangen, soweit die Voraussetzungen erfüllt sind. Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren. Für Nordrhein-Westfalen ist das die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen. Anfragen zu Ihren Daten richten Sie an die E-Mail oben."
            : "You can request access, rectification, erasure, restriction, portability, and objection where the conditions are met. You can also complain to a data-protection authority. For North Rhine-Westphalia that is the Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen. Send requests about your data to the email above.",
        ],
      },
    ],
  };
}

function cookies(locale: Locale): LegalDocument {
  const de = locale === "de";
  return {
    title: de ? "Cookie-Richtlinie" : "Cookie policy",
    draftNote: de
      ? "Entwurf. Im Projekt lag keine frühere Cookie-Richtlinie. Aufgeführt sind nur die Speicherungen, die der aktuelle Code setzt."
      : "Draft. The repository had no previous cookie policy. Listed here are only the stores the current code sets.",
    blocks: [
      {
        heading: "NEXT_LOCALE",
        paragraphs: [
          de
            ? "Notwendig. Speichert die Sprache (Deutsch oder Englisch) für bis zu einem Jahr, damit die Weiterleitung von der Startadresse nicht bei jedem Besuch neu raten muss."
            : "Essential. Stores the language (German or English) for up to one year, so the redirect from the root address does not have to guess on every visit.",
        ],
      },
      {
        heading: de ? "Sitzung beim Login" : "Sign-in session",
        paragraphs: [
          de
            ? "Notwendig, sobald Sie sich anmelden. Der Login-Dienst Supabase setzt Sitzungs-Cookies, damit das Kundenkonto angemeldet bleibt. Ohne Konto werden diese Cookies nicht für den normalen Seitenbesuch gebraucht."
            : "Essential once you sign in. The Supabase login service sets session cookies so the client account stays signed in. Without an account, those cookies are not needed for an ordinary visit.",
        ],
      },
      {
        heading: "cookie-consent",
        paragraphs: [
          de
            ? "Liegt im lokalen Speicher, nicht als Cookie. Merkt sich, ob Sie alle oder nur essenzielle Speicherungen gewählt haben. Es wird dabei kein Analyseprofil aufgebaut."
            : "Stored in local storage, not as a cookie. It remembers whether you chose all stores or essential ones only. No analytics profile is built from that choice.",
        ],
      },
    ],
  };
}

export function getLegalDocument(path: LegalPath, locale: Locale): LegalDocument {
  if (path === "/impressum") return impressum(locale);
  if (path === "/datenschutz") return datenschutz(locale);
  return cookies(locale);
}

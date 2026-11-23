import type { Locale } from "./i18n/config";
import type { LegalPath } from "./routes";
import { COOKIE_CONSENT_STORAGE_KEY } from "./cookieConsent";
import {
  appointmentOnlyLabel,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  formatHagenOpeningHours,
} from "./contact";
import {
  COMPANY_REGISTER,
  formatStudioLine,
  GA_MEASUREMENT_ID,
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
  blocks: LegalBlock[];
};

const hagenLine = formatStudioLine(HAGEN_STUDIO);
const solingenLine = formatStudioLine(SOLINGEN_STUDIO);
const director = MANAGING_DIRECTOR ?? "";

function impressum(locale: Locale): LegalDocument {
  const de = locale === "de";
  return {
    title: de ? "Impressum" : "Legal notice",
    blocks: [
      {
        heading: de ? "Anbieter" : "Provider",
        paragraphs: [
          LEGAL_NAME,
          de ? `Anschrift: ${hagenLine}` : `Address: ${hagenLine}`,
          de ? "Deutschland" : "Germany",
          de
            ? `Studio Solingen, ${appointmentOnlyLabel("de", { sentence: false })}, für größere Produktionen: ${solingenLine}`
            : `Solingen studio, ${appointmentOnlyLabel("en", { sentence: false })}, for larger productions: ${solingenLine}`,
        ],
      },
      {
        heading: de ? "Kontakt" : "Contact",
        paragraphs: [
          de ? `Telefon: ${CONTACT_PHONE_DISPLAY}` : `Phone: ${CONTACT_PHONE_DISPLAY}`,
          `E-Mail: ${CONTACT_EMAIL}`,
          de
            ? `Öffnungszeiten Studio Hagen: ${formatHagenOpeningHours("de")}`
            : `Hagen studio opening hours: ${formatHagenOpeningHours("en")}`,
          de
            ? `Studio Solingen: ${appointmentOnlyLabel("de")}`
            : `Solingen studio: ${appointmentOnlyLabel("en")}`,
        ],
      },
      {
        heading: de ? "Register und Umsatzsteuer" : "Register and VAT",
        paragraphs: [
          de
            ? `Registergericht: Amtsgericht ${COMPANY_REGISTER.court}. Handelsregister: HRB ${COMPANY_REGISTER.hrb}.`
            : `Register court: Amtsgericht ${COMPANY_REGISTER.court}. Commercial register: HRB ${COMPANY_REGISTER.hrb}.`,
          de
            ? `Umsatzsteuer-Identifikationsnummer: ${COMPANY_REGISTER.vatId}`
            : `VAT identification number: ${COMPANY_REGISTER.vatId}`,
        ],
      },
      {
        heading: de ? "Geschäftsführung" : "Managing director",
        paragraphs: [director],
      },
      {
        heading: de ? "Verantwortlich für den Inhalt" : "Responsible for content",
        paragraphs: [
          de
            ? `${director}, ${hagenLine}. Verantwortlich nach § 18 Abs. 2 MStV.`
            : `${director}, ${hagenLine}. Responsible under section 18 (2) of the German Interstate Media Treaty.`,
        ],
      },
      {
        heading: de ? "Streitbeilegung" : "Dispute resolution",
        paragraphs: [
          de
            ? "Ob die Aaron Bowser Photography UG an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilnimmt, ist noch nicht festgelegt."
            : "Whether Aaron Bowser Photography UG takes part in a consumer dispute-resolution procedure has not been decided yet.",
        ],
      },
    ],
  };
}

function datenschutz(locale: Locale): LegalDocument {
  const de = locale === "de";
  const hosting = HOSTING_PROVIDER ?? "der Hosting-Anbieter";
  return {
    title: de ? "Datenschutzerklärung" : "Privacy policy",
    blocks: [
      {
        heading: de ? "Verantwortlicher" : "Controller",
        paragraphs: [
          `${LEGAL_NAME}, ${hagenLine}`,
          de ? "Deutschland" : "Germany",
          `${de ? "Telefon" : "Phone"}: ${CONTACT_PHONE_DISPLAY}`,
          `E-Mail: ${CONTACT_EMAIL}`,
          de
            ? `Geschäftsführer: ${director}. Öffnungszeiten des Studios Hagen: ${formatHagenOpeningHours("de")}. Studio Solingen: ${appointmentOnlyLabel("de")}.`
            : `Managing director: ${director}. Opening hours of the Hagen studio: ${formatHagenOpeningHours("en")}. Solingen studio: ${appointmentOnlyLabel("en")}.`,
        ],
      },
      {
        heading: de ? "Hosting" : "Hosting",
        paragraphs: [
          de
            ? `Diese Website wird bei ${hosting} gehostet. Beim Aufruf verarbeitet der Anbieter technisch erforderliche Zugriffsdaten, darunter IP-Adresse, Zeitpunkt, die aufgerufene Adresse und Angaben zum Browser. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, das Interesse am sicheren Betrieb der Website.`
            : `This website is hosted by ${hosting}. When you open a page, the provider processes the access data the connection needs, including IP address, time, the address requested, and browser details. The legal basis is Article 6 (1) (f) GDPR, the interest in running the site securely.`,
          de
            ? "Ein Serverstandort und eine feste Speicherdauer der Zugriffsdaten sind in diesem Projekt nicht hinterlegt."
            : "A server location and a fixed retention period for the access data are not recorded in this project.",
        ],
      },
      {
        heading: de ? "Konto, Buchung und Anfrage ohne Konto" : "Account, booking, and enquiry without an account",
        paragraphs: [
          de
            ? "Wenn Sie ein Kundenkonto anlegen, verarbeiten wir die Angaben aus dem Formular: Name, E-Mail, Telefon, Firma und Anschrift. Die Anmeldung läuft über Supabase. Ein Kundenkonto wird von Hand freigeschaltet, bevor darüber gebucht werden kann."
            : "If you create a client account, we process the form fields: name, email, phone, company, and address. Sign-in runs through Supabase. An account is approved by hand before it can be used to book.",
          de
            ? "Eine Shoot-Anfrage aus einem freigeschalteten Konto enthält dazu Datum, Uhrzeit, den Ort des Shootings und Ihre Nachricht. Eine Anfrage ohne Konto enthält Name, E-Mail, Telefon, Thema und Nachricht und wird per E-Mail an das Studio gesendet. Sie legt kein Kundenkonto an und zeigt keine Preise."
            : "A shoot enquiry from an approved account also includes the date, the time, the place of the shoot, and your message. An enquiry without an account contains name, email, phone, topic, and message, and is emailed to the studio. It does not create an account and it does not show prices.",
          de
            ? "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Angaben einen Vertrag vorbereiten oder durchführen. Ein Auftragsverarbeitungsvertrag mit Supabase und der Serverstandort von Supabase sind in diesem Projekt nicht hinterlegt."
            : "The legal basis is Article 6 (1) (b) GDPR where the details prepare or perform a contract. A data-processing agreement with Supabase, and the location of Supabase’s servers, are not recorded in this project.",
        ],
      },
      {
        heading: de ? "Kalender" : "Calendar",
        paragraphs: [
          de
            ? "Wenn ein freigeschaltetes Konto freie Zeiten abfragt, wird das Datum mit dem Studio-Kalender bei Google abgeglichen. Übermittelt werden das Datum und die geprüften Uhrzeiten, nicht der Text Ihrer Nachricht. Die Anfrage ohne Konto fragt den Kalender nicht ab."
            : "When an approved account asks which times are free, the date is checked against the studio calendar at Google. The date and the times being checked are sent, not the text of your message. An enquiry without an account does not query the calendar.",
        ],
      },
      {
        heading: de ? "Cookies und lokaler Speicher" : "Cookies and local storage",
        paragraphs: [
          de
            ? `Die Website setzt ein Cookie namens NEXT_LOCALE, um die gewählte Sprache für bis zu einem Jahr zu speichern. Wenn Sie sich anmelden, setzt Supabase Sitzungs-Cookies. Die Cookie-Auswahl liegt im lokalen Speicher unter dem Schlüssel ${COOKIE_CONSENT_STORAGE_KEY}. Sie können die Auswahl über das Cookie-Symbol erneut öffnen.`
            : `The site sets a cookie named NEXT_LOCALE to remember the chosen language for up to one year. When you sign in, Supabase sets session cookies. The cookie choice is stored locally under the key ${COOKIE_CONSENT_STORAGE_KEY}. You can open the choice again with the cookie icon.`,
        ],
      },
      {
        heading: "Google Analytics 4",
        paragraphs: [
          de
            ? `Wenn Sie „Alle akzeptieren“ wählen, lädt die Website Google Analytics 4 (Google tag, gtag.js) mit der Mess-ID ${GA_MEASUREMENT_ID}. Das Skript kommt von https://www.googletagmanager.com/gtag/js und sendet Nutzungsdaten an Google, darunter die aufgerufene Seite, den Seitentitel und technische Angaben des Browsers. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO. „Nur essenzielle“ lädt das Skript nicht.`
            : `If you choose “Alle akzeptieren”, the site loads Google Analytics 4 (Google tag, gtag.js) with measurement ID ${GA_MEASUREMENT_ID}. The script is loaded from https://www.googletagmanager.com/gtag/js and sends usage data to Google, including the page, the page title, and technical browser details. The legal basis is Article 6 (1) (a) GDPR. “Nur essenzielle” does not load the script.`,
          de
            ? "Wechseln Sie später auf „Nur essenzielle“, stoppt die weitere Messung und die Website löscht die Google-Analytics-Cookies, die sie im Browser erreichen kann (Namen beginnend mit _ga). Eine Speicherdauer bei Google ist in diesem Projekt nicht festgelegt."
            : "If you later choose “Nur essenzielle”, further measurement stops and the site deletes the Google Analytics cookies it can reach in the browser (names starting with _ga). A retention period at Google is not set in this project.",
        ],
      },
      {
        heading: de ? "Speicherdauer" : "Retention",
        paragraphs: [
          de
            ? "Kontodaten und Anfragen speichern wir für die Dauer der Bearbeitung und des Kundenverhältnisses und danach nur, soweit gesetzliche Aufbewahrungspflichten bestehen. Eine darüber hinaus in Tagen festgelegte Frist ist nicht hinterlegt."
            : "We keep account data and enquiries for as long as we are handling them and the client relationship lasts, and after that only where a statutory retention duty applies. A further period stated in days is not recorded.",
        ],
      },
      {
        heading: de ? "Ihre Rechte" : "Your rights",
        paragraphs: [
          de
            ? "Sie können Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch verlangen, soweit die Voraussetzungen erfüllt sind. Eine Einwilligung können Sie mit Wirkung für die Zukunft widerrufen. Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren. Für Nordrhein-Westfalen ist das die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen. Anfragen zu Ihren Daten richten Sie an die E-Mail oben."
            : "You can request access, rectification, erasure, restriction, portability, and objection where the conditions are met. You can withdraw consent for the future. You can also complain to a data-protection authority. For North Rhine-Westphalia that is the Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen. Send requests about your data to the email above.",
        ],
      },
    ],
  };
}

function cookies(locale: Locale): LegalDocument {
  const de = locale === "de";
  return {
    title: de ? "Cookie-Richtlinie" : "Cookie policy",
    blocks: [
      {
        heading: de ? "Überblick" : "Overview",
        paragraphs: [
          de
            ? "Diese Seite nennt die Speicherungen, die der aktuelle Code setzt. Die Auswahl ändern Sie über das Cookie-Symbol."
            : "This page lists the stores the current code sets. You change the choice with the cookie icon.",
        ],
      },
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
            ? "Notwendig, sobald Sie sich anmelden. Supabase setzt Sitzungs-Cookies, damit das Kundenkonto angemeldet bleibt. Ohne Konto werden diese Cookies nicht für den normalen Seitenbesuch gebraucht."
            : "Essential once you sign in. Supabase sets session cookies so the client account stays signed in. Without an account, those cookies are not needed for an ordinary visit.",
        ],
      },
      {
        heading: COOKIE_CONSENT_STORAGE_KEY,
        paragraphs: [
          de
            ? "Liegt im lokalen Speicher, nicht als Cookie. Merkt sich, ob Sie alle oder nur essenzielle Speicherungen gewählt haben. Die gespeicherte Auswahl selbst erzeugt kein Profil."
            : "Stored in local storage, not as a cookie. It remembers whether you chose all stores or essential ones only. The stored choice itself does not create a profile.",
        ],
      },
      {
        heading: "Google Analytics 4",
        paragraphs: [
          de
            ? `Optional. Nur nach „Alle akzeptieren“. Google tag (gtag.js), Mess-ID ${GA_MEASUREMENT_ID}, geladen von googletagmanager.com. Google setzt dabei eigene Cookies, deren Namen mit _ga beginnen. Ohne diese Zustimmung bleibt das Skript aus. Eine Speicherdauer bei Google ist in diesem Projekt nicht festgelegt.`
            : `Optional. Only after “Alle akzeptieren”. Google tag (gtag.js), measurement ID ${GA_MEASUREMENT_ID}, loaded from googletagmanager.com. Google then sets its own cookies whose names start with _ga. Without that consent the script stays unloaded. A retention period at Google is not set in this project.`,
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

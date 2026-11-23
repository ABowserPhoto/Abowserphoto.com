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
            ? `Die ${LEGAL_NAME} ist nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.`
            : `${LEGAL_NAME} is not willing to take part in dispute-resolution proceedings before a consumer conciliation body.`,
        ],
      },
    ],
  };
}

const STUDIO_DOMAIN = "aaronbowser-photography.com";
const directorMailbox = `${director.split(" ")[0]?.toLowerCase() ?? "studio"}@${STUDIO_DOMAIN}`;
const billingMailbox = `rechnung@${STUDIO_DOMAIN}`;

const VERCEL_DPA = "https://vercel.com/legal/dpa";
const VERCEL_SUBPROCESSORS = "https://security.vercel.com";
const SUPABASE_DPA = "https://supabase.com/legal/customer-resources/data-processing-addendum";
const SUPABASE_RESIDENCY = "https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq";
const GOOGLE_FRAMEWORKS = "https://policies.google.com/privacy/frameworks";
const GOOGLE_ANALYTICS_TERMS = "https://support.google.com/analytics/answer/3379636";
const CLOUDFLARE_DPA = "https://www.cloudflare.com/cloudflare-customer-dpa/";
const WHATSAPP_PRIVACY = "https://www.whatsapp.com/legal/privacy-policy-eea";
const EPASS_IMPRESSUM = "https://www.e-passtransfer.de/impressum/";
const EPASS_PRIVACY = "https://www.e-passtransfer.de/datenschutz/";

function datenschutz(locale: Locale): LegalDocument {
  const de = locale === "de";
  const hosting = HOSTING_PROVIDER ?? "Vercel";
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
            ? `Diese Website wird bei ${hosting} gehostet. Beim Aufruf verarbeitet ${hosting} die für die Verbindung nötigen Zugriffsdaten, darunter IP-Adresse, Zeitpunkt, die aufgerufene Adresse und Angaben zum Browser. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, das Interesse am sicheren Betrieb der Website.`
            : `This website is hosted by ${hosting}. When you open a page, ${hosting} processes the access data the connection needs, including IP address, time, the address requested, and browser details. The legal basis is Article 6 (1) (f) GDPR, the interest in running the site securely.`,
          de
            ? `Für den Pro-Tarif gilt der Standard-Auftragsverarbeitungsvertrag von Vercel als Teil der Kundenbedingungen. Danach liegen die primären Verarbeitungsstandorte in den Vereinigten Staaten. Daten können auch dort verarbeitet werden, wo Vercel oder seine Unterauftragsverarbeiter tätig sind. Übermittlungen stützt dieser Vertrag auf die EU-Standardvertragsklauseln. Der veröffentlichte Text stützt sie nicht auf das EU-U.S. Data Privacy Framework. Vertrag: ${VERCEL_DPA} Unterauftragsverarbeiter: ${VERCEL_SUBPROCESSORS}`
            : `On the Pro plan, Vercel’s standard data-processing addendum applies as part of the customer terms. Under that addendum the primary processing facilities are in the United States. Data may also be processed wherever Vercel or its subprocessors operate. The addendum uses the EU Standard Contractual Clauses for transfers. The published text does not rely on the EU-U.S. Data Privacy Framework. Addendum: ${VERCEL_DPA} Subprocessors: ${VERCEL_SUBPROCESSORS}`,
        ],
      },
      {
        heading: "Cloudflare",
        paragraphs: [
          de
            ? `Besucher von abowserphoto.com und www.abowserphoto.com werden über Cloudflare (CDN und DNS) geleitet. Cloudflare, Inc. kann dabei Verbindungsdaten auch außerhalb des Europäischen Wirtschaftsraums verarbeiten, unter anderem in den USA. Die Übermittlungssicherungen stehen im Kunden-DPA von Cloudflare (Version 6.4, Stand 3. April 2026), der für solche Übermittlungen EU-Standardvertragsklauseln vorsieht: ${CLOUDFLARE_DPA}`
            : `Visitors to abowserphoto.com and www.abowserphoto.com pass through Cloudflare (CDN and DNS). Cloudflare, Inc. may process connection data outside the European Economic Area, including in the United States. The transfer safeguards are those in Cloudflare’s customer DPA (version 6.4, 3 April 2026), which provides EU Standard Contractual Clauses for those transfers: ${CLOUDFLARE_DPA}`,
        ],
      },
      {
        heading: de ? "Konto, Buchung und Anfrage ohne Konto" : "Account, booking, and enquiry without an account",
        paragraphs: [
          de
            ? "Wenn Sie ein Kundenkonto anlegen, verarbeiten wir Name, E-Mail, Telefon, Firma und Anschrift. Anmeldung, Konto und die dazugehörigen Dateien laufen über Supabase, Projekt „Photoshoot App“. Die primäre Datenbank, Auth und Storage liegen in der AWS-Region eu-west-1 (West-EU, Irland). Support, Abrechnung, Telemetrie, Logs und über ein CDN zwischengespeicherte Storage-Dateien können außerhalb dieser Region verarbeitet werden. Logs werden nach den Angaben von Supabase in Rechenzentren in der EU aufgenommen und gespeichert. Ein Kundenkonto wird von Hand freigeschaltet, bevor darüber gebucht werden kann."
            : "If you create a client account, we process your name, email, phone, company, and address. Sign-in, the account, and the files that belong to it run through Supabase, project “Photoshoot App”. The primary database, Auth, and Storage stay in the AWS region eu-west-1 (West EU, Ireland). Support, billing, telemetry, logs, and CDN-cached Storage files may be processed outside that region. Supabase describes logs as ingested and stored in data centres in the EU. An account is approved by hand before it can be used to book.",
          de
            ? `Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Angaben einen Vertrag vorbereiten oder durchführen. Es gilt der Standard-DPA von Supabase als Teil der Kundenbedingungen, einschließlich der EU-Standardvertragsklauseln für Übermittlungen an Supabase: ${SUPABASE_DPA} Zum Speicherort: ${SUPABASE_RESIDENCY}`
            : `The legal basis is Article 6 (1) (b) GDPR where the details prepare or perform a contract. Supabase’s standard DPA applies as part of the customer terms, including the EU Standard Contractual Clauses for transfers to Supabase: ${SUPABASE_DPA} On location: ${SUPABASE_RESIDENCY}`,
          de
            ? "Eine Shoot-Anfrage aus einem freigeschalteten Konto enthält dazu Datum, Uhrzeit, den Ort des Shootings und Ihre Nachricht. Eine Anfrage ohne Konto enthält Name, E-Mail, Telefon, Thema und Nachricht und wird per E-Mail an das Studio gesendet. Sie legt kein Kundenkonto an und zeigt keine Preise."
            : "A shoot enquiry from an approved account also includes the date, the time, the place of the shoot, and your message. An enquiry without an account contains name, email, phone, topic, and message, and is emailed to the studio. It does not create an account and it does not show prices.",
        ],
      },
      {
        heading: de ? "Fotos und Filme" : "Photographs and films",
        paragraphs: [
          de
            ? "Für ein beauftragtes Shooting verarbeiten wir die dafür nötigen Angaben und die entstehenden Fotos und Filme, um sie zu erstellen, zu bearbeiten und zu liefern. Die Lieferung erfolgt über den Kundenbereich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung den Auftrag vorbereitet oder durchführt. Wir bewahren diese Daten für die Dauer des Auftrags und danach nur, soweit eine gesetzliche Pflicht das verlangt."
            : "For a commissioned shoot we process the details the work needs and the photographs and films that result, in order to create, edit, and deliver them. Delivery is through the client area. The legal basis is Article 6 (1) (b) GDPR where the processing prepares or performs the commission. We keep this data for the life of the commission and after that only where a statutory duty requires it.",
        ],
      },
      {
        heading: de ? "Digitale Passbilder" : "Digital passport photos",
        paragraphs: [
          de
            ? `Digitale Passbilder, die wir für Sie an deutsche Behörden übermitteln, laufen über den Dienst e-passtransfer der e-passtransfer GmbH. Zweck ist diese Übermittlung. Die Bilddaten gehen an die e-passtransfer GmbH und von dort an die zuständigen Behörden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Übermittlung zum Passbildauftrag gehört. Impressum des Dienstes: ${EPASS_IMPRESSUM} Dessen öffentliche Datenschutzerklärung beschreibt das Studio als Verantwortlichen und die e-passtransfer GmbH als technische Übermittlerin: ${EPASS_PRIVACY}`
            : `Digital passport photos that we submit for you to German authorities go through the e-passtransfer service of e-passtransfer GmbH. The purpose is that submission. The image data is sent to e-passtransfer GmbH and from there to the competent authorities. The legal basis is Article 6 (1) (b) GDPR where the submission is part of the passport-photo commission. The service’s legal notice: ${EPASS_IMPRESSUM} Its public privacy notice describes the studio as controller and e-passtransfer GmbH as the technical transmitter: ${EPASS_PRIVACY}`,
        ],
      },
      {
        heading: de ? "E-Mail" : "Email",
        paragraphs: [
          de
            ? `Die geschäftliche E-Mail des Studios, darunter ${CONTACT_EMAIL}, ${directorMailbox} und ${billingMailbox}, wird über Google Workspace geführt. Anfragen, die die Website per E-Mail an das Studio sendet, gehen an diese Postfächer. Empfänger sind Google Ireland Limited und, soweit eine Übermittlung stattfindet, Google LLC. Übermittlungen in die USA stützt Google auf das EU-U.S. Data Privacy Framework, soweit Google LLC danach zertifiziert ist, und im Übrigen auf Standardvertragsklauseln: ${GOOGLE_FRAMEWORKS}`
            : `The studio’s business email, including ${CONTACT_EMAIL}, ${directorMailbox}, and ${billingMailbox}, is provided by Google Workspace. Enquiries the website emails to the studio go to these mailboxes. The recipients are Google Ireland Limited and, where a transfer takes place, Google LLC. For transfers to the United States, Google relies on the EU-U.S. Data Privacy Framework where Google LLC is certified under it, and otherwise on Standard Contractual Clauses: ${GOOGLE_FRAMEWORKS}`,
        ],
      },
      {
        heading: de ? "Kalender" : "Calendar",
        paragraphs: [
          de
            ? "Wenn ein freigeschaltetes Konto freie Zeiten abfragt, wird das Datum mit dem Studio-Kalender bei Google abgeglichen. Übermittelt werden das Datum und die geprüften Uhrzeiten, nicht der Text Ihrer Nachricht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, weil die Abfrage einen Termin vorbereitet. Empfänger und Übermittlungen in die USA sind dieselben wie im Abschnitt E-Mail. Die Anfrage ohne Konto fragt den Kalender nicht ab."
            : "When an approved account asks which times are free, the date is checked against the studio calendar at Google. The date and the times being checked are sent, not the text of your message. The legal basis is Article 6 (1) (b) GDPR, because the check prepares an appointment. Recipients and transfers to the United States are the same as in the email section. An enquiry without an account does not query the calendar.",
        ],
      },
      {
        heading: "WhatsApp",
        paragraphs: [
          de
            ? `Die Website verlinkt WhatsApp über wa.me. Daten gehen an WhatsApp erst, wenn Sie den Link öffnen. Für Nutzer im Europäischen Wirtschaftsraum stellt WhatsApp Ireland Limited den Dienst bereit und kann Angaben außerhalb des EWR verarbeiten, auch in den USA: ${WHATSAPP_PRIVACY}`
            : `The website links to WhatsApp with wa.me. Data goes to WhatsApp only when you open the link. For people in the European Economic Area, WhatsApp Ireland Limited provides the service and may process information outside the EEA, including in the United States: ${WHATSAPP_PRIVACY}`,
        ],
      },
      {
        heading: "Google Maps",
        paragraphs: [
          de
            ? "Links zu Google Maps öffnen den Kartendienst erst, wenn Sie sie anklicken. Danach verarbeitet Google die dabei anfallenden Daten. Empfänger und Übermittlungen sind dieselben wie im Abschnitt E-Mail."
            : "Links to Google Maps open the map service only when you click them. Google then processes the data that click produces. Recipients and transfers are the same as in the email section.",
        ],
      },
      {
        heading: de ? "Cookies und lokaler Speicher" : "Cookies and local storage",
        paragraphs: [
          de
            ? `Die Website setzt ein Cookie namens NEXT_LOCALE, um die gewählte Sprache für bis zu einem Jahr zu speichern. Wenn Sie sich anmelden, setzt Supabase Sitzungs-Cookies. Die Cookie-Auswahl liegt im lokalen Speicher unter dem Schlüssel ${COOKIE_CONSENT_STORAGE_KEY}. Sie können die Auswahl über das Cookie-Symbol erneut öffnen. Eine Reichweitenmessung startet erst nach „Alle akzeptieren“.`
            : `The site sets a cookie named NEXT_LOCALE to remember the chosen language for up to one year. When you sign in, Supabase sets session cookies. The cookie choice is stored locally under the key ${COOKIE_CONSENT_STORAGE_KEY}. You can open the choice again with the cookie icon. Analytics starts only after “Alle akzeptieren”.`,
        ],
      },
      {
        heading: "Google Analytics 4",
        paragraphs: [
          de
            ? `Wenn Sie „Alle akzeptieren“ wählen, lädt die Website Google Analytics 4 (Mess-ID ${GA_MEASUREMENT_ID}). Das Skript kommt von https://www.googletagmanager.com/gtag/js und sendet Nutzungsdaten an Google, darunter die aufgerufene Seite, den Seitentitel und technische Angaben des Browsers. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO. „Nur essenzielle“ lädt das Skript nicht.`
            : `If you choose “Alle akzeptieren”, the site loads Google Analytics 4 (measurement ID ${GA_MEASUREMENT_ID}). The script is loaded from https://www.googletagmanager.com/gtag/js and sends usage data to Google, including the page, the page title, and technical browser details. The legal basis is Article 6 (1) (a) GDPR. “Nur essenzielle” does not load the script.`,
          de
            ? `Wechseln Sie später auf „Nur essenzielle“, stoppt die weitere Messung und die Website löscht die Google-Analytics-Cookies, die sie im Browser erreichen kann (Namen beginnend mit _ga). Google speichert nutzer- und ereignisbezogene Analytics-Daten für die Aufbewahrungsfrist, die in der GA4-Property eingestellt ist. Empfänger und Übermittlungen in die USA sind dieselben wie im Abschnitt E-Mail. Für Einrichtungen im EWR sind die Datenverarbeitungsbedingungen von Google einbezogen: ${GOOGLE_ANALYTICS_TERMS}`
            : `If you later choose “Nur essenzielle”, further measurement stops and the site deletes the Google Analytics cookies it can reach in the browser (names starting with _ga). Google stores user-level and event-level Analytics data for the retention period configured in the GA4 property. Recipients and transfers to the United States are the same as in the email section. For establishments in the EEA, Google’s data-processing terms are incorporated: ${GOOGLE_ANALYTICS_TERMS}`,
        ],
      },
      {
        heading: de ? "Speicherdauer" : "Retention",
        paragraphs: [
          de
            ? "Personenbezogene Daten speichern wir, solange der Zweck der Verarbeitung besteht, und danach nur, soweit eine gesetzliche Aufbewahrungspflicht gilt."
            : "We keep personal data for as long as the purpose of the processing lasts, and after that only where a statutory retention duty applies.",
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
        heading: de ? "Cookie-Auswahl (lokaler Speicher)" : "Cookie choice (local storage)",
        paragraphs: [
          de
            ? `Liegt im lokalen Speicher, nicht als Cookie, unter dem Schlüssel ${COOKIE_CONSENT_STORAGE_KEY}. Merkt sich, ob Sie alle oder nur essenzielle Speicherungen gewählt haben. Die gespeicherte Auswahl selbst erzeugt kein Profil.`
            : `Stored in local storage, not as a cookie, under the key ${COOKIE_CONSENT_STORAGE_KEY}. It remembers whether you chose all stores or essential ones only. The stored choice itself does not create a profile.`,
        ],
      },
      {
        heading: "Google Analytics 4",
        paragraphs: [
          de
            ? `Optional. Nur nach „Alle akzeptieren“. Google tag (gtag.js), Mess-ID ${GA_MEASUREMENT_ID}, geladen von googletagmanager.com. Google setzt dabei eigene Cookies, deren Namen mit _ga beginnen. Ohne diese Zustimmung bleibt das Skript aus. Google speichert nutzer- und ereignisbezogene Analytics-Daten für die Aufbewahrungsfrist, die in der GA4-Property eingestellt ist.`
            : `Optional. Only after “Alle akzeptieren”. Google tag (gtag.js), measurement ID ${GA_MEASUREMENT_ID}, loaded from googletagmanager.com. Google then sets its own cookies whose names start with _ga. Without that consent the script stays unloaded. Google stores user-level and event-level Analytics data for the retention period configured in the GA4 property.`,
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

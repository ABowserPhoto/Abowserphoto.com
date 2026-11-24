import type { Locale } from "./i18n/config";

export type HomeLongCopy = {
  summary: string;
  eyebrow: string;
  packageTitle: string;
  aboutTitle: string;
  paragraphs: string[];
};

const GERMAN: HomeLongCopy = {
  summary: "Mehr über Aaron Bowser Photography",
  eyebrow: "Für Unternehmen und Marken",
  packageTitle: "Ein Ansprechpartner für Ihr komplettes Bildmaterial",
  aboutTitle: "Hinter der Kamera",
  paragraphs: [
    "Ich bin Aaron Bowser, Fotograf und Videograf aus Hagen. Ich fotografiere und filme Hochzeiten, Immobilien, Marken und Unternehmen in ganz NRW, mit einem Anspruch: It's not just a photo, it's A. Bowser Photo.",
    "Sie verkaufen ein Produkt oder eine Dienstleistung? Dann brauchen Sie mehr als ein einzelnes Foto. Ich liefere Ihnen alles aus einer Hand: Produktfotos, Content für Social Media, Werbebilder, Business-Porträts, Bilder Ihres Unternehmens und Standorts, Imagefilme und Lifestyle-Aufnahmen. Ein Ansprechpartner, eine Bildsprache und ein Marketing- und Branding-Paket, das auf Website, Social Media und in der Werbung zusammenpasst.",
    "Für Unternehmen bin ich der Ansprechpartner für das komplette Bildmaterial: Produktfotos, Social-Media-Content, Werbebilder, Business-Porträts, Bilder vom Standort, Imagefilme und Lifestyle-Aufnahmen aus einer Hand. Paare begleite ich vom Standesamt bis zur Feier, Makler bekommen Exposé-Fotos, Videos und Drohnenaufnahmen aus einem Termin.",
    "Das Paket umfasst Produktfotos, Social-Media-Content, Werbefotografie, Business-Porträts, Bilder von Unternehmen und Standort, Imagefilm und Video, und Lifestyle-Aufnahmen. Produktfotos zeigen Material und Form, klar für den Shop oder inszeniert für eine Kampagne. Social-Media-Content liefert die Bilder und kurzen Clips, aus denen ein Redaktionsplan wird. Werbefotografie gibt der Kampagne ein Bild, das in Anzeige und Lookbook trägt. Business-Porträts zeigen die Menschen im Unternehmen, für die Website und für Profile. Bilder von Unternehmen und Standort erklären, wo Sie arbeiten. Imagefilm und Video erzählen dasselbe in Bewegung, vom Reel bis zum Film auf der Startseite. Lifestyle-Aufnahmen setzen Menschen und Produkt in einen Alltag, den Ihre Kunden wiedererkennen. Jedes Motiv folgt derselben Bildsprache.",
    "Paare begleite ich als Reportage. Der Tag kann am Standesamt beginnen, eine freie Trauung umfassen oder die ganze Feier. Foto und Film können am selben Tag entstehen, in derselben Bildsprache. Vor der Hochzeit lernen wir uns im Gespräch kennen, auf Wunsch bei einem Paarshooting.",
    "Makler in Hagen, Solingen und NRW bekommen Exposé-Fotos, ein Walk Thru Video und Drohnenaufnahmen aus einem Termin. Die Drohne ist registriert und versichert. Ein Agent Branding Video zeigt Sie als Ansprechpartner. Das Fotopaket richtet sich nach der Größe des Objekts, und einzelne Fotos lassen sich ergänzen, wenn nur ein Raum oder die Außenansicht fehlt.",
    "Kleinere Sets, Porträts und Produktaufnahmen haben im Studio Hagen Platz. Das Studio in Solingen bietet rund 100 Quadratmeter für größere Produktionen, Projekte und Teams: Teamshootings, Commercial- und Fashion-Sets, Food-Aufbauten und Videodrehs. Einen Termin dort sprechen wir vorher ab, per Telefon, E-Mail oder WhatsApp. Das Studio kann auch für die eigene Produktion gemietet werden. Gearbeitet wird in Hagen, Wuppertal, Solingen, Düsseldorf, Köln und im Ruhrgebiet, im Studio oder bei Ihnen vor Ort.",
    "Ein Angebot erhalten Sie per Kontaktformular, E-Mail oder WhatsApp. Mit einem kostenlosen Kundenkonto sehen Sie Ihre Pakete an einem Ort und buchen Termine online. Für Social Media beginnt die Zusammenarbeit mit einer Beratung. So bleibt ein Ansprechpartner für das ganze Bildmaterial, von der ersten Idee bis zur Datei, die auf der Website, in den Kanälen und in der Werbung steht.",
  ],
};

const ENGLISH: HomeLongCopy = {
  summary: "More about Aaron Bowser Photography",
  eyebrow: "For companies and brands",
  packageTitle: "One contact for all your visual content",
  aboutTitle: "Behind the camera",
  paragraphs: [
    "I'm Aaron Bowser, a photographer and videographer from Hagen. I photograph and film weddings, real estate, brands and companies across NRW, with one standard: It's not just a photo, it's A. Bowser Photo.",
    "Selling a product or a service? You need more than a single photo. I deliver everything from one source: product shots, social media content, commercial images, business portraits, pictures of your company and location, brand films and lifestyle images. One contact, one visual language and a marketing and branding package that works together on your website, on social media and in advertising.",
    "For companies I am the contact for the whole set of pictures: product shots, social media content, commercial images, business portraits, pictures of the location, brand films and lifestyle images from one source. I follow couples from the registry office through to the celebration, and agents receive listing photos, video and drone footage from one appointment.",
    "The package covers product shots, social media content, commercial images, business portraits, pictures of the company and location, brand film and video, and lifestyle images. Product shots show material and form. Social content supplies the pictures and short clips a plan is built from. Commercial images give a campaign a picture for the advert and the lookbook. Business portraits show the people in the company. Pictures of the company and the location explain where you work. Brand film and video tell the same story in motion. Lifestyle images place people and product in a scene your customers recognise. Every picture follows the same visual language.",
    "I follow couples as a reportage. The day can start at the registry office, include a symbolic ceremony, or cover the whole celebration. Photographs and film can be made on the same day, in the same visual language. Before the wedding we meet for a conversation, and for a couple session if you want one.",
    "Agents in Hagen, Solingen and NRW receive listing photos, a walk-thru video and drone footage from one appointment. The drone is registered and insured. An agent branding video shows you as the contact. The photo package follows the size of the property, and individual photos can be added when only one room or the exterior is missing.",
    "Smaller sets, portraits and product photographs have room at the Hagen studio. The studio in Solingen offers about 100 square metres for larger productions, projects and teams: team shoots, commercial and fashion sets, food builds and video. We agree a time there beforehand, by phone, email or WhatsApp. The studio can also be rented for your own production. The work happens in Hagen, Wuppertal, Solingen, Düsseldorf, Cologne and the Ruhr, at the studio or on location with you.",
    "A quote comes by contact form, email or WhatsApp. With a free client account you see your packages in one place and book appointments online. For social media the work starts with a consultation.",
  ],
};

export function homeLongCopy(locale: Locale): HomeLongCopy {
  return locale === "de" ? GERMAN : ENGLISH;
}

export function homeLongPlainText(locale: Locale) {
  const copy = homeLongCopy(locale);
  return [copy.summary, copy.eyebrow, copy.packageTitle, copy.aboutTitle, ...copy.paragraphs].join(" ");
}

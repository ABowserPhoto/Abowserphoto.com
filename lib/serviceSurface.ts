import type { FAQItem, CategorySlug } from "./content";
import { HAGEN_ADDRESS } from "./contact";
import type { Locale } from "./i18n/config";
import { withLocale } from "./i18n/config";
import { categoryPath, solingenStudioPath } from "./routes";
import { studioSittingPriceAnswer } from "./site";
import { nicheHostForHostname, portalCategoryUrl } from "./subdomains";

export type Surface = "niche" | "www";

export type SurfaceLink = {
  label: string;
  href: string;
};

export type SurfaceCopy = {
  surface: Surface;
  title: string;
  description: string;
  h1: string;
  subline?: string;
  intro: string;
  faqs: FAQItem[];
  links: SurfaceLink[];
};

type Pair = Record<Locale, Omit<SurfaceCopy, "surface" | "links"> & { links?: SurfaceLink[] }>;

function faq(question: string, answer: string): FAQItem {
  return { question, answer };
}

function filmHref(locale: Locale, host?: string | null) {
  return portalCategoryUrl("cinematography", { host, locale });
}

function weddingHref(locale: Locale, host?: string | null) {
  return portalCategoryUrl("wedding", { host, locale });
}

function immoHref(locale: Locale, host?: string | null) {
  return portalCategoryUrl("real-estate", { host, locale });
}

function foodHref(locale: Locale, host?: string | null) {
  return portalCategoryUrl("food", { host, locale });
}

function socialHref(locale: Locale, host?: string | null) {
  return portalCategoryUrl("social-media-management", { host, locale });
}

function businessHref(locale: Locale, host?: string | null) {
  return portalCategoryUrl("business-portraits", { host, locale });
}

function commercialNicheHref(locale: Locale, host?: string | null) {
  return portalCategoryUrl("commercial", { host, locale });
}

function studioHref(locale: Locale, host?: string | null) {
  return portalCategoryUrl("studio", { host, locale });
}

function wwwPath(locale: Locale, slug: CategorySlug) {
  return withLocale(categoryPath(slug, locale), locale);
}

function solingenHref(locale: Locale) {
  return withLocale(solingenStudioPath(locale), locale);
}

const weddingNiche: Pair = {
  de: {
    title: "Hochzeitsfotograf Hagen & Solingen | Standesamt & Feier",
    description:
      "Hochzeitsfotograf für Hagen, Solingen, Wuppertal & NRW: Standesamt, freie Trauung oder ganzer Tag als ruhige Reportage. Jetzt Shooting buchen.",
    h1: "Hochzeitsfotograf für Hagen, Solingen & NRW",
    subline: "Standesamt, freie Trauung oder der ganze Tag, ehrlich erzählt.",
    intro:
      "Sie suchen einen Hochzeitsfotografen in Hagen, Solingen oder Wuppertal? Ich begleite Ihre Hochzeit so, wie sie ist: ruhig, nah und ohne gestellte Szenen. Das kann nur die standesamtliche Trauung sein, eine freie Trauung oder der ganze Tag, von der Vorbereitung bis zur Feier. Vorher lernen wir uns kennen, auf Wunsch bei einem Paarshooting. Danach bekommen Sie eine sorgfältige Auswahl Ihrer Bilder, gern auch als gedrucktes Album. Ein Hochzeitsfilm vom selben Tag lässt sich dazubuchen, mit derselben ruhigen Bildsprache. Ich fotografiere am Standesamt Hagen und am Standesamt Solingen und überall in NRW, wo Sie heiraten.",
    faqs: [
      faq(
        "Was kostet ein Hochzeitsfotograf?",
        "Das hängt von Dauer, Ort und Umfang ab: nur Standesamt, freie Trauung oder ganzer Tag, mit oder ohne Hochzeitsfilm. Schicken Sie uns Datum und Ort, dann bekommen Sie ein passendes Angebot."
      ),
      faq(
        "Wie früh sollten wir den Hochzeitsfotografen buchen?",
        "Beliebte Samstage sind oft mehrere Monate im Voraus vergeben. Fragen Sie am besten an, sobald Datum und Location feststehen."
      ),
      faq(
        "Fotografieren Sie auch nur das Standesamt?",
        "Ja. Eine standesamtliche Trauung in Hagen, Solingen oder Umgebung kann ein eigener Termin sein. Die Feier lässt sich später dazubuchen."
      ),
      faq(
        "Gibt es auch ein Hochzeitsvideo?",
        "Ja. Der Hochzeitsfilm entsteht am selben Tag wie die Fotos. Foto und Film planen wir in einem Gespräch."
      ),
      faq(
        "Lernen wir uns vor der Hochzeit kennen?",
        "Ja, in einem Vorgespräch und auf Wunsch bei einem Paarshooting."
      ),
      faq(
        "Kommen Sie auch außerhalb von Hagen und Solingen?",
        "Ja, in ganz NRW regelmäßig, weiter entfernt nach Absprache. Fahrtkosten stehen im Angebot."
      ),
    ],
  },
  en: {
    title: "Wedding Photographer Hagen & Solingen | Registry & Day",
    description:
      "Wedding photographer for Hagen, Solingen, Wuppertal & NRW: registry office, symbolic ceremony or the full day as calm reportage. Book a shoot.",
    h1: "Wedding Photographer for Hagen, Solingen & NRW",
    subline: "Registry office, a symbolic ceremony, or the full day, told honestly.",
    intro:
      "Looking for a wedding photographer in Hagen, Solingen or Wuppertal? I follow the day as it is: calm, close, and without staged scenes. That can be the registry office only, a symbolic ceremony, or the full day from getting ready to the celebration. We meet beforehand, with a couple session if you like. Afterwards you receive a careful edit of the pictures, and a printed album if you want one. A wedding film from the same day can be added, in the same calm visual language. I photograph at the registry office in Hagen and in Solingen, and anywhere in NRW where you marry.",
    faqs: [
      faq(
        "What does a wedding photographer cost?",
        "It depends on the length, the place and the scope: the registry office only, a symbolic ceremony, or the full day, with or without a wedding film. Send the date and the place, and you receive a fitting quote."
      ),
      faq(
        "How early should we book?",
        "Popular Saturdays are often taken several months ahead. It is worth writing once the date and the venue are set."
      ),
      faq(
        "Do you cover only the civil ceremony?",
        "Yes. A registry-office ceremony in Hagen, Solingen or nearby can be its own booking. The celebration can be added later."
      ),
      faq(
        "Is there also a wedding film?",
        "Yes. The wedding film is made on the same day as the photographs. We plan photographs and film in one conversation."
      ),
      faq(
        "Do we meet before the wedding?",
        "Yes, in a conversation beforehand and, if you want, at a couple session."
      ),
      faq(
        "Do you travel beyond Hagen and Solingen?",
        "Yes, regularly across NRW, and further by arrangement. Travel costs are part of the quote."
      ),
    ],
  },
};

const weddingWww: Pair = {
  de: {
    title: "Hochzeitsfotograf NRW | Düsseldorf, Köln & Ruhrgebiet",
    description:
      "Hochzeitsfotografie für Paare in ganz NRW: Düsseldorf, Köln, Wuppertal und Ruhrgebiet. Filmische Reportage, auf Wunsch mit Hochzeitsfilm. Shooting buchen.",
    h1: "Hochzeitsfotografie in ganz NRW",
    intro:
      "Für Paare, die in Düsseldorf, Köln, Wuppertal oder im Ruhrgebiet heiraten und Bilder mit filmischer Ruhe suchen: Ich begleite Hochzeiten in ganz NRW, vom Getting Ready über die freie Trauung bis zum letzten Tanz. Die Bilder erzählen den Tag in einer klaren Abfolge, keine lose Sammlung. Wer möchte, ergänzt sie um einen Hochzeitsfilm vom selben Tag und ein gedrucktes Album. Für Hochzeiten in Hagen und Solingen, auch nur am Standesamt, finden Sie alle Details auf meiner Seite für Hochzeitsfotografie in Hagen & Solingen.",
    faqs: [
      faq(
        "Fotografieren Sie Hochzeiten in Düsseldorf und Köln?",
        "Ja, in ganz NRW regelmäßig. Fahrtkosten stehen transparent im Angebot."
      ),
      faq(
        "Können wir Fotos und Hochzeitsfilm zusammen buchen?",
        "Ja. Beides entsteht am selben Tag mit derselben Bildsprache, und Sie bekommen ein gemeinsames Angebot."
      ),
      faq(
        "Bieten Sie ein Hochzeitsalbum an?",
        "Ja, ein gedrucktes Album mit einer klaren Abfolge Ihres Tages."
      ),
      faq(
        "Gibt es ein Paarshooting vor der Hochzeit?",
        "Ja, an einem Ort, der zu Ihnen passt. So lernen wir uns vor dem großen Tag kennen."
      ),
    ],
  },
  en: {
    title: "Wedding Photographer NRW | Düsseldorf, Cologne & Ruhr",
    description:
      "Wedding photography across NRW: Düsseldorf, Cologne, Wuppertal and the Ruhr. Cinematic reportage, with an optional wedding film. Book a shoot.",
    h1: "Wedding Photography Across NRW",
    intro:
      "For couples marrying in Düsseldorf, Cologne, Wuppertal or the Ruhr who want pictures with a cinematic calm: I photograph weddings across NRW, from getting ready through the ceremony to the last dance. The pictures tell the day in a clear order, not as a loose collection. A wedding film from the same day and a printed album can be added. For weddings in Hagen and Solingen, including the registry office only, the details are on the page for wedding photography in Hagen and Solingen.",
    faqs: [
      faq(
        "Do you photograph weddings in Düsseldorf and Cologne?",
        "Yes, regularly across NRW. Travel costs are set out in the quote."
      ),
      faq(
        "Can we book photographs and a wedding film together?",
        "Yes. Both are made on the same day in the same visual language, and you receive one quote."
      ),
      faq("Do you offer a wedding album?", "Yes, a printed album with a clear order of your day."),
      faq(
        "Is there a couple session before the wedding?",
        "Yes, at a place that suits you. That is how we meet before the day."
      ),
    ],
  },
};

const immoNiche: Pair = {
  de: {
    title: "Immobilienfotograf Hagen | Exposé-Fotos NRW",
    description:
      "Immobilienfotos und -videos für Makler in NRW: Fotopaket, Walk-Thru-Video, Agent-Branding-Video und Drohne. Registriert & versichert. Shooting buchen.",
    h1: "Immobilienfotograf für Makler in NRW",
    subline: "Immobilienfotos, die Besichtigungen bringen",
    intro:
      "Mehr Anfragen, schnellere Besichtigungen: Exposé-Fotos und Videos für Makler in NRW. Sie wählen das Fotopaket, das zum Objekt passt, von der kompakten Wohnung bis zum großen Haus. Fehlt nur ein Raum oder die Außenansicht, ergänzen Sie einzelne Fotos. Als Extras gibt es Walk Thru Video und Agent Branding Video. Mit Premium Home bekommen Sie Fotopaket, Highlight-Video und Drohne aus einem Termin. Luxury Makler setzt Sie selbst im Video in Szene. Die Drohne ist beim Luftfahrt-Bundesamt registriert und versichert. Im Einsatz in Hagen, Wuppertal, Solingen, Düsseldorf, Köln und im Ruhrgebiet.",
    faqs: [
      faq(
        "Wie viele Fotos braucht ein Exposé?",
        "Das hängt von Größe und Art des Objekts ab. Eine Wohnung braucht weniger Motive als ein Einfamilienhaus mit Garten. Sie wählen das Fotopaket passend zum Objekt und können einzelne Fotos ergänzen. Wir beraten Sie gern vorab."
      ),
      faq(
        "Was kostet ein Immobilienfotograf?",
        "Das hängt vom Fotopaket und den Extras ab. Fordern Sie ein Angebot per Kontaktformular, E-Mail oder WhatsApp an. Mit einem kostenlosen Kundenkonto sehen Sie Ihre Pakete auf einen Blick und buchen Termine direkt online."
      ),
      faq(
        "Sind Drohnenaufnahmen möglich?",
        "Ja. Die Drohne ist beim Luftfahrt-Bundesamt registriert und versichert. Für den Überflug brauchen wir die Zustimmung des Eigentümers, das klären wir vor dem Termin."
      ),
      faq(
        "Was ist der Unterschied zwischen Premium Home und Luxury Makler?",
        "Beide enthalten ein Fotopaket Ihrer Wahl und Drohnenaufnahmen. Premium Home ergänzt ein Highlight-Video der Immobilie. Luxury Makler ergänzt ein Walk Thru Video, in dem Sie als Makler durch das Objekt führen."
      ),
      faq(
        "Sind die Bilder für ImmoScout24 und Immowelt geeignet?",
        "Ja, Sie erhalten Exporte für ImmoScout24, Immowelt, Ihre Website und Social Media."
      ),
      faq(
        "Ist virtuelles Homestaging erlaubt?",
        "Ja, wenn es gekennzeichnet ist. Virtuell eingerichtete Bilder markieren wir sichtbar mit „Virtuell eingerichtet“ und verändern keine Bausubstanz."
      ),
      faq(
        "Wie bereite ich die Immobilie vor?",
        "Räume aufräumen, Licht an, persönliche Dinge und Autos vor dem Haus wegräumen."
      ),
    ],
  },
  en: {
    title: "Real Estate Photographer Hagen | Listing Photos NRW",
    description:
      "Real estate photos and video for agents in NRW: photo package, walk-thru video, agent branding video and drone. Registered and insured. Book a shoot.",
    h1: "Real Estate Photographer for Agents in NRW",
    subline: "Property photos that bring viewings",
    intro:
      "More enquiries, and viewings that happen sooner: listing photos and videos for agents in NRW. You choose the photo package that fits the property, from a compact flat to a large house. If only one room or the exterior is missing, you add individual photos. Walk Thru Video and Agent Branding Video are extras. Premium Home is the photo package, a highlight video and drone from one appointment. Luxury Makler puts you in the video. The drone is registered with the aviation authority and insured. In use in Hagen, Wuppertal, Solingen, Düsseldorf, Cologne and the Ruhr.",
    faqs: [
      faq(
        "How many photos does a listing need?",
        "It depends on the size and the kind of property. A flat needs fewer pictures than a house with a garden. You choose the photo package that fits the property, and individual photos can be added. We are glad to advise you beforehand."
      ),
      faq(
        "What does a property photographer cost?",
        "It depends on the photo package and the extras. Request a quote by contact form, email or WhatsApp. With a free client account you see your packages in one place and book appointments online."
      ),
      faq(
        "Is drone photography possible?",
        "Yes. The drone is registered and insured. We need the owner's consent for the flight, and we arrange that before the appointment."
      ),
      faq(
        "What is the difference between Premium Home and Luxury Makler?",
        "Both include a photo package of your choice and drone footage. Premium Home adds a highlight video of the property. Luxury Makler adds a Walk Thru Video in which you, the agent, lead the viewer through the property."
      ),
      faq(
        "How should I prepare the property?",
        "Tidy the rooms, turn the lights on, and move personal items and cars away from the front of the house."
      ),
      faq(
        "Will the files work on ImmoScout24 and Immowelt?",
        "Yes. You receive exports for ImmoScout24, Immowelt, your website and social media."
      ),
      faq(
        "Is virtual staging allowed?",
        "Yes, when it is labelled. Virtually staged pictures are marked in the image as “Virtuell eingerichtet”, and the building itself is not changed."
      ),
    ],
  },
};

const immoWww: Pair = {
  de: {
    title: "Immobilienvideo & Drohne für Makler NRW | Aaron Bowser",
    description:
      "Walk Thru Video, Agent Branding Video und Drohnenaufnahmen für Makler in NRW, als Premium Home oder Luxury Makler. Shooting buchen.",
    h1: "Immobilienvideos & Drohnenaufnahmen für Makler in NRW",
    intro:
      "Ein Exposé mit Video bleibt länger im Kopf. Für Makler in NRW produziere ich Walk Thru Videos, die Interessenten durch die Immobilie führen, und Agent Branding Videos, die Sie als Ansprechpartner zeigen. Drohnenaufnahmen zeigen Lage, Grundstück und Umfeld. Die Drohne ist beim Luftfahrt-Bundesamt registriert und versichert. Am einfachsten buchen Sie alles in einem Termin: Premium Home kombiniert Fotopaket, Highlight-Video und Drohne, Luxury Makler setzt Sie im Video in Szene. Alle Fotopakete im Überblick finden Sie auf meiner Seite für Immobilienfotografie in Hagen. Ein Angebot erhalten Sie per Formular, E-Mail oder WhatsApp.",
    faqs: [
      faq(
        "Was ist ein Walk Thru Video?",
        "Ein ruhiger Rundgang durch die Immobilie für Portale, Website und Social Media."
      ),
      faq(
        "Muss ich als Makler im Video auftreten?",
        "Nein. Nur bei Luxury Makler und beim Agent Branding Video stehen Sie im Fokus."
      ),
      faq(
        "Ist die Drohne erlaubt und versichert?",
        "Ja, beim Luftfahrt-Bundesamt registriert und haftpflichtversichert. Die Zustimmung des Eigentümers klären wir vorab."
      ),
    ],
  },
  en: {
    title: "Real Estate Video & Drone for Agents NRW | Aaron Bowser",
    description:
      "Walk Thru Video, Agent Branding Video and drone footage for agents in NRW, as Premium Home or Luxury Makler. Book a shoot.",
    h1: "Real Estate Video & Drone for Agents in NRW",
    intro:
      "A listing with video stays in mind longer. For agents in NRW I produce Walk Thru Videos that lead viewers through the property, and Agent Branding Videos that show you as the contact. Drone footage shows the setting, the plot and the surroundings. The drone is registered and insured. The simplest booking is one appointment: Premium Home combines the photo package, a highlight video and drone, and Luxury Makler puts you in the video. The photo packages are set out on the Hagen property page. A quote comes by form, email or WhatsApp.",
    faqs: [
      faq(
        "What is a Walk Thru Video?",
        "A calm walk through the property for portals, your website and social media."
      ),
      faq(
        "Do I have to appear in the video?",
        "No. You are the focus only in Luxury Makler and in the Agent Branding Video."
      ),
      faq(
        "Is the drone permitted and insured?",
        "Yes. It is registered and insured. We arrange the owner's consent beforehand."
      ),
    ],
  },
};

const filmNiche: Pair = {
  de: {
    title: "Videograf Hagen | Imagefilm, Hochzeitsfilm & Reels",
    description:
      "Videograf aus Hagen für NRW: Imagefilme für Unternehmen, Hochzeitsfilme und Social-Media-Reels. Konzept, Dreh und Schnitt aus einer Hand. Shooting buchen.",
    h1: "Videograf in Hagen: Imagefilme, Hochzeitsfilme & Reels",
    intro:
      "Ich bin Aaron Bowser, Videograf aus Hagen, und produziere Filme für Unternehmen und Paare in ganz NRW. Imagefilme zeigen Ihr Unternehmen, Ihr Team und Ihre Arbeit mit einer klaren Erzählung. Hochzeitsfilme halten Standesamt, freie Trauung oder den ganzen Tag in ruhigen, filmischen Bildern fest. Social-Media-Reels liefern kurze Schnitte im Hochformat für Instagram, TikTok und LinkedIn. Konzept, Dreh, Schnitt und Color Grading kommen aus einer Hand. Gedreht wird bei Ihnen vor Ort oder für größere Sets im Studio Solingen mit rund 100 m².",
    faqs: [
      faq(
        "Was kostet ein Imagefilm?",
        "Das hängt von Konzept, Anzahl der Drehtage und Umfang des Schnitts ab. Beschreiben Sie kurz Ziel, Länge und Einsatzort, dann bekommen Sie ein Angebot."
      ),
      faq(
        "Wie läuft eine Filmproduktion ab?",
        "Briefing und Konzept, Drehplanung, Drehtag, danach Schnitt, Color Grading und Ton. Sie geben die Schnittfassung frei, bevor der finale Film ausgeliefert wird."
      ),
      faq("Ist der Schnitt inklusive?", "Ja, Schnitt und Color Grading gehören zur Produktion."),
      faq(
        "Bekommen wir auch Hochformat-Versionen für Reels?",
        "Ja, Hochformat, Quadrat und Querformat sind möglich."
      ),
      faq(
        "Kann ich Hochzeitsfilm und Hochzeitsfotos zusammen buchen?",
        "Ja. Beides entsteht am selben Tag mit derselben Bildsprache."
      ),
      faq(
        "Sind Drohnenaufnahmen möglich?",
        "Ja, mit registrierter und versicherter Drohne, für Luftbilder von Gebäude, Gelände und Umgebung."
      ),
    ],
  },
  en: {
    title: "Videographer Hagen | Brand Films, Wedding Films & Reels",
    description:
      "Videographer from Hagen for NRW: brand films for companies, wedding films and social media reels. Concept, shoot and edit in one place. Book a shoot.",
    h1: "Videographer in Hagen: Brand Films, Wedding Films & Reels",
    intro:
      "I am Aaron Bowser, a videographer from Hagen, and I produce films for companies and couples across NRW. Brand films show your company, your team and your work with a clear story. Wedding films hold the registry office, a symbolic ceremony or the full day in calm, cinematic pictures. Social reels are short vertical cuts for Instagram, TikTok and LinkedIn. Concept, shoot, edit and grade come from one place. We film on location, or for larger sets at the Solingen studio of about 100 m².",
    faqs: [
      faq(
        "What does a brand film cost?",
        "It depends on the concept, the number of shoot days and the edit. Describe the aim, the length and where it will be used, and you receive a quote."
      ),
      faq(
        "How does a production run?",
        "Brief and concept, the shoot plan, the shoot day, then the edit, the grade and the sound. You approve the cut before the final film is delivered."
      ),
      faq("Is the edit included?", "Yes. The edit and the grade are part of the production."),
      faq("Do we also get vertical versions for reels?", "Yes. Vertical, square and widescreen are possible."),
      faq(
        "Can I book a wedding film and the photographs together?",
        "Yes. Both are made on the same day in the same visual language."
      ),
      faq(
        "Is drone footage possible?",
        "Yes, with a registered and insured drone, for aerial views of a building, the grounds and the surroundings."
      ),
    ],
  },
};

const filmWww: Pair = {
  de: {
    title: "Imagefilm-Produktion NRW | Aaron Bowser Photography",
    description:
      "Imagefilme und Markenfilme für Unternehmen in Düsseldorf, Köln, Wuppertal und im Ruhrgebiet. Filmische Erzählung, Dreh und Schnitt. Shooting buchen.",
    h1: "Imagefilme für Unternehmen in NRW",
    intro:
      "Ein Imagefilm muss in den ersten Sekunden tragen. Für Unternehmen in Düsseldorf, Köln, Wuppertal und im Ruhrgebiet produziere ich Image- und Markenfilme mit einer klaren Erzählung, ruhiger Kameraführung und sorgfältigem Color Grading, damit der Film filmisch wirkt und im Marketing funktioniert. Aus demselben Dreh entstehen auf Wunsch kurze Reels im Hochformat für Social Media. Gedreht wird bei Ihnen vor Ort oder für größere Sets im Studio Solingen.",
    faqs: [
      faq(
        "Wofür setze ich einen Imagefilm ein?",
        "Auf Website, Messe, Recruiting und Social Media. Wir planen die Formate dafür von Anfang an mit."
      ),
      faq(
        "Können aus dem Imagefilm auch Reels entstehen?",
        "Ja, aus demselben Dreh lassen sich kurze Hochformat-Schnitte erstellen."
      ),
      faq(
        "Wo wird gedreht?",
        "Bei Ihnen im Unternehmen in ganz NRW oder im Studio Solingen (ca. 100 m²)."
      ),
      faq(
        "Sind Drohnenaufnahmen möglich?",
        "Ja, mit registrierter und versicherter Drohne, für Luftbilder von Gebäude, Gelände und Umgebung."
      ),
      faq(
        "Wie bereiten wir uns vor?",
        "Ein kurzes Briefing zu Ziel, Zielgruppe und Einsatzort genügt. Den Rest erarbeiten wir im Konzept."
      ),
    ],
  },
  en: {
    title: "Brand Film Production NRW | Aaron Bowser Photography",
    description:
      "Brand and company films for businesses in Düsseldorf, Cologne, Wuppertal and the Ruhr. Cinematic storytelling, shoot and edit. Book a shoot.",
    h1: "Brand Films for Companies in NRW",
    intro:
      "A brand film has to carry in the first seconds. For companies in Düsseldorf, Cologne, Wuppertal and the Ruhr I produce brand films with a clear story, a calm camera and a careful grade, so the film feels cinematic and works in marketing. Short vertical reels can come from the same shoot. We film at your company or, for larger sets, at the Solingen studio.",
    faqs: [
      faq(
        "Where is a brand film used?",
        "On the website, at a fair, in recruiting and on social media. We plan those formats from the start."
      ),
      faq(
        "Can reels come from the brand film?",
        "Yes. Short vertical cuts can be made from the same shoot."
      ),
      faq(
        "Where do you film?",
        "At your company anywhere in NRW, or at the Solingen studio (about 100 m²)."
      ),
      faq(
        "Is drone footage possible?",
        "Yes, with a registered and insured drone, for aerial views of a building, the grounds and the surroundings."
      ),
      faq(
        "How do we prepare?",
        "A short brief on the aim, the audience and where the film will be used is enough. The rest is worked out in the concept."
      ),
    ],
  },
};

const commercialNiche: Pair = {
  de: {
    title: "Werbefotograf Hagen | Produktfotografie NRW",
    description:
      "Werbe- und Produktfotografie für Marken in Hagen, Wuppertal und NRW: Packshot, Lookbook, Beauty, Kampagne. Studio oder vor Ort. Shooting buchen.",
    h1: "Werbe- und Produktfotografie in Hagen & NRW",
    intro:
      "Das Produktbild ist oft der erste Kontakt mit Ihrer Marke. Als Werbefotograf aus Hagen fotografiere ich klare Packshots für den Shop, inszenierte Produktsets für Kampagnen, Lookbooks, Beauty- und Editorial-Strecken. Kleinere Produktionen entstehen im Studio Hagen. Für große Sets steht das Studio in Solingen mit rund 100 m² bereit, oder ich komme zu Ihnen. Hair, Make-up, Styling und Models stelle ich auf Wunsch aus einem festen Netzwerk in NRW zusammen.",
    faqs: [
      faq(
        "Was kostet ein Produkt- oder Werbeshooting?",
        "Jedes Projekt ist anders, deshalb bekommen Sie ein individuelles Angebot. Nennen Sie Umfang und die geplante Nutzung."
      ),
      faq(
        "Wie funktionieren Nutzungsrechte?",
        "Sie erhalten eine Lizenz für den vereinbarten Zweck, je nach Medium, Laufzeit und Gebiet. Das klären wir vor dem Angebot."
      ),
      faq(
        "Stellen Sie Hair, Make-up und Styling?",
        "Ja, aus einem festen Netzwerk in NRW. Ihr eigenes Team ist ebenso willkommen."
      ),
      faq(
        "Wo findet das Shooting statt?",
        "Im Studio Hagen, im Studio Solingen (ca. 100 m²) oder vor Ort in NRW, etwa in Wuppertal, Düsseldorf und Köln."
      ),
      faq(
        "Bekommen wir auch Video und Social-Media-Content?",
        "Ja. Aus derselben Produktion entstehen auf Wunsch Kurzvideos, Reels und Content für Ihre Kanäle, alles aus einer Hand."
      ),
    ],
  },
  en: {
    title: "Advertising & Product Photographer Hagen | NRW",
    description:
      "Advertising and product photography for brands in Hagen, Wuppertal and NRW: packshots, lookbooks, beauty, campaigns. Studio or on location. Book a shoot.",
    h1: "Advertising and Product Photography in Hagen & NRW",
    intro:
      "The product picture is often the first contact with your brand. As an advertising photographer from Hagen I photograph clear packshots for the shop, staged product sets for campaigns, lookbooks, beauty and editorial series. Smaller productions are made at the Hagen studio. Large sets use the Solingen studio of about 100 m², or I come to you. Hair, make-up, styling and models can be brought from a regular network in NRW.",
    faqs: [
      faq(
        "What does a product or advertising shoot cost?",
        "Every project is different, so you receive an individual quote. Tell us the scope and how you plan to use the pictures."
      ),
      faq(
        "How do usage rights work?",
        "You receive a licence for the agreed purpose, depending on the medium, the term and the territory. We settle that before the quote."
      ),
      faq(
        "Do you provide hair, make-up and styling?",
        "Yes, from a regular network in NRW. Your own team is welcome too."
      ),
      faq(
        "Where does the shoot take place?",
        "At the Hagen studio, at the Solingen studio (about 100 m²), or on location in NRW, including Wuppertal, Düsseldorf and Cologne."
      ),
      faq(
        "Can we also have video and social content?",
        "Yes. From the same production we can make short videos, reels and content for your channels, all from one contact."
      ),
    ],
  },
};

const commercialWww: Pair = {
  de: {
    title: "Commercial-Fotograf NRW | Fashion, Beauty & Editorial",
    description:
      "Fashion-, Beauty- und Editorial-Fotografie für Marken, Designer und Agenturen in Düsseldorf, Köln und NRW. Filmisch und publikationsreif. Shooting buchen.",
    h1: "Fashion-, Beauty- & Editorial-Fotografie in NRW",
    intro:
      "Für Marken, Designer und Agenturen, die in einem vollen Markt erkennbar bleiben wollen: Ich fotografiere Fashion-Kampagnen, Lookbooks, Beauty und Editorial-Serien mit filmischer Haltung, präzise und publikationsreif. Für Models entstehen Portfolios, die Agenturen und Art Directors ernst nehmen. Produziert wird in Düsseldorf, Köln und ganz NRW vor Ort oder im 100-m²-Studio in Solingen, auf Wunsch mit Hair, Make-up und Styling aus einem festen Netzwerk.",
    faqs: [
      faq(
        "Fotografieren Sie für Magazine und Editorials?",
        "Ja, publikationsreife Editorial-Strecken gehören zum Kern meiner Arbeit."
      ),
      faq(
        "Lassen sich Editorial und Kampagne in einem Projekt verbinden?",
        "Ja, aus einer Produktion entstehen erzählerische Serien und kampagnenfertige Motive."
      ),
      faq(
        "Erstellen Sie Model-Portfolios?",
        "Ja, mit individuellen Porträts und editorialen Serien, die Ihre Bandbreite zeigen."
      ),
      faq(
        "Wo wird produziert?",
        "Vor Ort in NRW oder im Studio Solingen mit rund 100 m²."
      ),
      faq(
        "Bekommen wir auch Video und Social-Media-Content?",
        "Ja. Aus derselben Produktion entstehen auf Wunsch Kurzvideos, Reels und Content für Ihre Kanäle, alles aus einer Hand."
      ),
    ],
  },
  en: {
    title: "Commercial Photographer NRW | Fashion, Beauty & Editorial",
    description:
      "Fashion, beauty and editorial photography for brands, designers and agencies in Düsseldorf, Cologne and NRW. Cinematic and publication-ready. Book a shoot.",
    h1: "Fashion, Beauty & Editorial Photography in NRW",
    intro:
      "For brands, designers and agencies that need to stay recognisable in a crowded market: I photograph fashion campaigns, lookbooks, beauty and editorial series with a cinematic approach, precise and publication-ready. For models I make portfolios that agencies and art directors take seriously. The work is made on location in Düsseldorf, Cologne and across NRW, or at the 100 m² studio in Solingen, with hair, make-up and styling from a regular network if you want it.",
    faqs: [
      faq(
        "Do you photograph for magazines and editorials?",
        "Yes. Publication-ready editorial series are a core part of the work."
      ),
      faq(
        "Can an editorial and a campaign come from one project?",
        "Yes. One production can yield a narrative series and campaign-ready pictures."
      ),
      faq(
        "Do you make model portfolios?",
        "Yes, with individual portraits and editorial series that show your range."
      ),
      faq("Where is the work produced?", "On location in NRW, or at the Solingen studio of about 100 m²."),
      faq(
        "Can we also have video and social content?",
        "Yes. From the same production we can make short videos, reels and content for your channels, all from one contact."
      ),
    ],
  },
};

const businessNiche: Pair = {
  de: {
    title: "Mitarbeiterfotos Hagen | Business-Porträts",
    description:
      "Business-Porträts, Mitarbeiter- und Teamfotos für Unternehmen in Hagen, Solingen und Wuppertal. Im Studio oder in Ihrem Büro. Shooting buchen.",
    h1: "Mitarbeiterfotos und Business-Porträts",
    intro:
      "Einheitliche Mitarbeiterfotos lassen Ihre Teamseite wirken wie aus einem Guss. Ich fotografiere Business-Porträts, Executive-Headshots, Teamfotos und LinkedIn-Profilbilder für Unternehmen und Selbstständige in Hagen, Solingen, Wuppertal und NRW. Einzelporträts entstehen im Fotostudio Hagen, größere Teams im Studio Solingen mit rund 100 m², oder ich baue das Licht direkt in Ihrem Büro auf. Vorher klären wir, wo die Bilder erscheinen. Während der Sitzung leite ich Haltung und Ausdruck an, damit Website, LinkedIn und Presse dieselbe ruhige Bildsprache tragen.",
    faqs: [
      faq(
        "Was kostet ein Business-Shooting?",
        "Das hängt von Personenzahl, Ort und Umfang ab. Sie bekommen ein individuelles Angebot."
      ),
      faq(
        "Können Sie bei uns im Büro fotografieren?",
        "Ja, ich bringe Licht und Hintergrund mit, in ganz NRW."
      ),
      faq(
        "Können wir ein ganzes Team an einem Tag fotografieren?",
        "Ja. Die Termine liegen nacheinander, jedes Porträt dauert nur kurz. Wie viele Personen an einen Tag passen, legen wir vorher fest."
      ),
      faq("Helfen Sie beim Posing?", "Ja, Haltung und Ausdruck leite ich in jeder Sitzung an."),
      faq(
        "Was ziehe ich an?",
        "Kleidung, in der Sie auch Kunden begegnen, in ruhigen Farben ohne große Muster. Für das Team stimmen wir einen gemeinsamen Look ab."
      ),
    ],
  },
  en: {
    title: "Staff Photos Hagen | Business Headshots",
    description:
      "Business portraits, staff and team photos for companies in Hagen, Solingen and Wuppertal. In the studio or at your office. Book a shoot.",
    h1: "Staff Photos and Business Portraits",
    intro:
      "Consistent staff photographs make a team page look like one sitting. I photograph business portraits, executive headshots, team photographs and LinkedIn pictures for companies and self-employed people in Hagen, Solingen, Wuppertal and NRW. Individual portraits are made at the Hagen studio, larger teams at the Solingen studio of about 100 m², or I set the light up in your office. Beforehand we agree where the pictures will appear. During the sitting I direct posture and expression, so the website, LinkedIn and press share one calm visual language.",
    faqs: [
      faq(
        "What does a business shoot cost?",
        "It depends on the number of people, the place and the scope. You receive an individual quote."
      ),
      faq("Can you photograph at our office?", "Yes. I bring light and a background, anywhere in NRW."),
      faq(
        "Can a whole team be photographed in one day?",
        "Yes. Sittings run one after another, and each portrait stays short. How many people fit in a day is agreed beforehand."
      ),
      faq("Do you help with posing?", "Yes. I direct posture and expression in every sitting."),
      faq(
        "What should I wear?",
        "Clothes you would meet a client in, in calm colours without a large pattern. For a team we agree a shared look."
      ),
    ],
  },
};

const businessWww: Pair = {
  de: {
    title: "Business-Fotograf NRW | Executive- & Corporate-Porträts",
    description:
      "Executive- und Corporate-Porträts für Geschäftsführung und Führungsteams in Düsseldorf, Köln und NRW. Studio oder vor Ort. Shooting buchen.",
    h1: "Executive- & Corporate-Porträts in NRW",
    intro:
      "Für Geschäftsführung, Partner und Führungsteams, die auf Website, im Geschäftsbericht und auf LinkedIn als dieselbe Person erkennbar sein wollen: Ich fotografiere Executive- und Corporate-Porträts in Düsseldorf, Köln und ganz NRW, bei Ihnen vor Ort oder im Studio. Licht, Haltung und Ausdruck werden so geführt, dass Ihr Porträt souverän und nahbar wirkt. Mitarbeiter- und Teamfotos für ganze Abteilungen finden Sie auf meiner Seite für Mitarbeiterfotos.",
    faqs: [
      faq("Kommen Sie zu uns ins Unternehmen?", "Ja, in ganz NRW."),
      faq(
        "Bekommen wir einheitliche Bilder für den ganzen Vorstand?",
        "Ja, mit gleichem Licht, Ausschnitt und Ton."
      ),
      faq(
        "Wofür können wir die Bilder nutzen?",
        "Website, LinkedIn, Presse und Geschäftsbericht. Den Nutzungsumfang legen wir im Angebot fest."
      ),
    ],
  },
  en: {
    title: "Business Photographer NRW | Executive & Corporate Portraits",
    description:
      "Executive and corporate portraits for leadership teams in Düsseldorf, Cologne and NRW. In the studio or on location. Book a shoot.",
    h1: "Executive & Corporate Portraits in NRW",
    intro:
      "For leadership, partners and management teams who need to be recognisable as the same person on the website, in the annual report and on LinkedIn: I photograph executive and corporate portraits in Düsseldorf, Cologne and across NRW, at your office or in the studio. Light, posture and expression are directed so the portrait feels assured and approachable. Staff and team photographs for whole departments are on the staff-photos page.",
    faqs: [
      faq("Do you come to our company?", "Yes, anywhere in NRW."),
      faq(
        "Can the whole board have a consistent set?",
        "Yes, with the same light, crop and tone."
      ),
      faq(
        "Where can we use the pictures?",
        "Website, LinkedIn, press and the annual report. The scope of use is set in the quote."
      ),
    ],
  },
};

const foodNiche: Pair = {
  de: {
    title: "Food-Fotograf Hagen | Restaurants & Speisekarten",
    description:
      "Food-Fotografie für Restaurants, Cafés und Lebensmittelmarken in Hagen, Wuppertal und NRW: Speisekarte, Website, Social Media. Shooting buchen.",
    h1: "Food-Fotografie für Restaurants und Marken",
    intro:
      "Gute Food-Fotos machen Lust, sofort zu bestellen. Ich fotografiere für Restaurants, Cafés, Lebensmittelmarken und Produzenten in Hagen, Wuppertal und ganz NRW, direkt bei Ihnen in der Küche oder im Studio. Es entstehen Bilder für Speisekarte, Website und Lieferportale, inszenierte Produktsets für Verpackung und Kampagne und wiederkehrende Serien für Social Media. Textur, Licht und Atmosphäre stehen dabei im Mittelpunkt, vom Styling bis zur finalen Farbbearbeitung.",
    faqs: [
      faq("Können Sie in unserer Küche fotografieren?", "Ja, vor Ort im Restaurant oder im Studio."),
      faq("Unterstützen Sie beim Food-Styling?", "Ja, Styling und Requisitenplanung können dazugehören."),
      faq(
        "Was kostet ein Food-Shooting?",
        "Das hängt von Ort und Nutzung ab. Sie bekommen ein individuelles Angebot."
      ),
      faq(
        "Bekommen wir Bilder für Social Media im Hochformat?",
        "Ja, die Formate planen wir passend zu Ihren Kanälen."
      ),
    ],
  },
  en: {
    title: "Food Photographer Hagen | Restaurants & Menus",
    description:
      "Food photography for restaurants, cafés and food brands in Hagen, Wuppertal and NRW: menus, website, social media. Book a shoot.",
    h1: "Food Photography for Restaurants and Brands",
    intro:
      "Good food photographs make people want to order. I photograph for restaurants, cafés, food brands and producers in Hagen, Wuppertal and across NRW, in your kitchen or in the studio. The pictures are for the menu, the website and delivery platforms, staged product sets for packaging and campaigns, and repeating series for social media. Texture, light and atmosphere are the point, from styling through to the final colour.",
    faqs: [
      faq("Can you photograph in our kitchen?", "Yes, at the restaurant or in the studio."),
      faq("Do you help with food styling?", "Yes. Styling and prop planning can be included."),
      faq(
        "What does a food shoot cost?",
        "It depends on the place and the use. You receive an individual quote."
      ),
      faq(
        "Do we get vertical pictures for social media?",
        "Yes. The formats are planned for your channels."
      ),
    ],
  },
};

const foodWww: Pair = {
  de: {
    title: "Food-Fotografie NRW | Kampagne, Verpackung & Getränke",
    description:
      "Food- und Getränkefotografie für Marken und Produzenten in NRW: Verpackung, Kampagne, Werbung. Inszenierte Sets im Studio Solingen. Shooting buchen.",
    h1: "Food- & Getränkefotografie für Marken in NRW",
    intro:
      "Für Lebensmittel- und Getränkemarken, deren Produkt auf Verpackung, Plakat und im Onlineshop überzeugen muss: Ich fotografiere inszenierte Food- und Getränkesets mit klarer Farbe und ruhiger Fläche, im Studio Solingen mit rund 100 m² oder bei Ihnen vor Ort in NRW. Restaurants, die Fotos für Speisekarte und Website suchen, finden alles Weitere auf meiner Seite für Food-Fotografie in Hagen. Auf Wunsch stelle ich Styling und Requisiten für die Produktion zusammen.",
    faqs: [
      faq("Fotografieren Sie auch Getränke?", "Ja."),
      faq("Wo finden Produktionen statt?", "Im Studio oder vor Ort."),
      faq(
        "Wie werden Nutzungsrechte geregelt?",
        "Per Lizenz nach Medium, Laufzeit und Gebiet."
      ),
      faq("Gibt es Food-Styling?", "Ja, Styling und Requisiten können dazugehören."),
    ],
  },
  en: {
    title: "Food Photography NRW | Campaigns, Packaging & Drinks",
    description:
      "Food and drink photography for brands and producers in NRW: packaging, campaigns, advertising. Styled sets at the Solingen studio. Book a shoot.",
    h1: "Food & Drink Photography for Brands in NRW",
    intro:
      "For food and drink brands whose product has to convince on the pack, the poster and the shop: I photograph staged food and drink sets with clear colour and a calm surface, at the Solingen studio of about 100 m² or on location in NRW. Restaurants looking for menu and website pictures will find the rest on the food photography page for Hagen. Styling and props can be arranged for the production.",
    faqs: [
      faq("Do you also photograph drinks?", "Yes."),
      faq("Where do productions take place?", "In the studio or on location."),
      faq("How are usage rights handled?", "By a licence for the medium, the term and the territory."),
      faq("Is there food styling?", "Yes. Styling and props can be included."),
    ],
  },
};

const socialNiche: Pair = {
  de: {
    title: "Social-Media-Betreuung Hagen | Content & Management",
    description:
      "Social-Media-Management für Unternehmen in Hagen und NRW: Redaktionsplan, eigene Fotos und Videos, Posting und Auswertung. Jetzt Beratung anfragen.",
    h1: "Social-Media-Betreuung für Unternehmen in Hagen & NRW",
    intro:
      "Ihr Auftritt auf Instagram, TikTok, LinkedIn und Facebook soll regelmäßig, stimmig und messbar sein, ohne dass Sie sich jede Woche selbst darum kümmern? Ich betreue Social-Media-Kanäle für Unternehmen und Marken in Hagen und NRW. Der Unterschied: Fotos und Videos produziere ich selbst. Dazu kommen ein monatlicher Redaktionsplan, Texte und Hashtags, Veröffentlichung, Community-Pflege und eine Auswertung, die zeigt, was funktioniert und was als Nächstes angepasst wird.",
    faqs: [
      faq("Welche Plattformen betreuen Sie?", "Instagram, TikTok, LinkedIn und Facebook."),
      faq("Schreiben Sie auch Texte und Hashtags?", "Ja, jeder Beitrag bekommt passende Texte und Hashtags."),
      faq(
        "Woher kommen die Fotos und Videos?",
        "Aus eigener Produktion, also Fotos und Reels, die für Ihre Marke entstehen."
      ),
      faq(
        "Wie messen Sie den Erfolg?",
        "Mit einer regelmäßigen Auswertung, die zeigt, was getragen hat und was wir anpassen."
      ),
      faq(
        "Was kostet Social-Media-Betreuung?",
        "Das hängt von Kanälen, Beitragsfrequenz und Produktionsumfang ab. Sie bekommen ein individuelles Angebot."
      ),
    ],
  },
  en: {
    title: "Social Media Management Hagen | Content & Posting",
    description:
      "Social media management for businesses in Hagen and NRW: content plan, our own photos and videos, posting and reporting. Request a consultation.",
    h1: "Social Media Management for Businesses in Hagen & NRW",
    intro:
      "Should your presence on Instagram, TikTok, LinkedIn and Facebook stay regular, coherent and measurable, without you handling it every week? I look after social channels for companies and brands in Hagen and NRW. The difference: I produce the photographs and videos myself. Added to that are a monthly content plan, captions and hashtags, publishing, community care, and a report that shows what worked and what to adjust next.",
    faqs: [
      faq("Which platforms do you manage?", "Instagram, TikTok, LinkedIn and Facebook."),
      faq("Do you write captions and hashtags?", "Yes. Every post gets fitting copy and hashtags."),
      faq(
        "Where do the photographs and videos come from?",
        "From our own production: photographs and reels made for your brand."
      ),
      faq(
        "How do you measure the result?",
        "With a regular report that shows what carried and what we will adjust."
      ),
      faq(
        "What does social media management cost?",
        "It depends on the channels, how often you post, and how much is produced. You receive an individual quote."
      ),
    ],
  },
};

const socialWww: Pair = {
  de: {
    title: "Social-Media-Content NRW | Fotos, Reels & Strategie",
    description:
      "Content-Produktion und Strategie für Marken in Düsseldorf, Köln und NRW: Fotos, Reels, Redaktionsplan und Reporting aus einer Hand. Beratung anfragen.",
    h1: "Social-Media-Content & Strategie für Marken in NRW",
    intro:
      "Marken mit einem starken visuellen Auftritt brauchen Content, der zu ihnen passt, und einen Plan dahinter. Ich verbinde professionelle Foto- und Videoproduktion mit Strategie: vom Content-Shooting über Reels im Hochformat bis zum Redaktionsplan und Reporting, für Marken in Düsseldorf, Köln und ganz NRW. So entsteht ein Auftritt, der auf Instagram, TikTok und LinkedIn wiedererkennbar bleibt. Laufende Betreuung Ihrer Kanäle finden Sie auf meiner Seite für Social-Media-Betreuung.",
    faqs: [
      faq("Welche Formate entstehen?", "Fotos, Reels im Hochformat, quadratische Posts."),
      faq("Wie oft wird produziert?", "Nach Redaktionsplan, abgestimmt auf Ihre Frequenz."),
    ],
  },
  en: {
    title: "Social Media Content NRW | Photos, Reels & Strategy",
    description:
      "Content production and strategy for brands in Düsseldorf, Cologne and NRW: photos, reels, content plan and reporting in one place. Request a consultation.",
    h1: "Social Media Content & Strategy for Brands in NRW",
    intro:
      "Brands with a strong visual presence need content that belongs to them, and a plan behind it. I combine professional photography and film with strategy: from the content shoot through vertical reels to the content plan and the reporting, for brands in Düsseldorf, Cologne and across NRW. The result is a presence that stays recognisable on Instagram, TikTok and LinkedIn. Ongoing channel care is on the social media management page.",
    faqs: [
      faq("Which formats do you make?", "Photographs, vertical reels and square posts."),
      faq("How often is content produced?", "On a content plan, matched to your frequency."),
    ],
  },
};

const studioNiche: Pair = {
  de: {
    title: "Bewerbungsfotos & Passbilder Hagen | Fotostudio",
    description:
      `Bewerbungsfoto 29 €, biometrisches Passbild 15 € im Fotostudio Hagen, ${HAGEN_ADDRESS.street}. Mo–Sa 10–20 Uhr, So 09–12 Uhr. Jetzt Termin buchen.`,
    h1: "Bewerbungsfotos und Passbilder in Hagen",
    intro:
      `Bewerbungsfotos und biometrische Passbilder in Hagen, im Fotostudio an der ${HAGEN_ADDRESS.street}, Mo–Sa 10–20 Uhr und So 09–12 Uhr. Ein Bewerbungsfoto kostet 29 € für 1 digitales Foto, ein biometrisches Passbild 15 €, alle Preise inkl. 19 % MwSt. Für Ihr Bewerbungsfoto klären wir zuerst, wo es erscheinen soll: Lebenslauf, LinkedIn oder Xing. Dann leite ich Haltung und Ausdruck an, damit Sie natürlich und sympathisch wirken. Das Passbild entsteht nach den aktuellen biometrischen Vorgaben für Reisepass, Personalausweis und Visum. Beides geht in einem Termin. Das Studio ist Mo–Sa 10–20 Uhr und So 09–12 Uhr geöffnet.`,
    faqs: [
      faq("Was kostet ein Bewerbungsfoto?", studioSittingPriceAnswer("de")),
      faq(
        "Was ziehe ich zum Bewerbungsfoto an?",
        "Kleidung, die zur Stelle passt, in ruhigen, einfarbigen Tönen. Bringen Sie gern zwei Oberteile mit, wir wählen im Studio gemeinsam."
      ),
      faq(
        "Darf ich auf dem Passbild lächeln?",
        "Nein, für Reisepass und Personalausweis gilt ein neutraler Ausdruck mit geschlossenem Mund. Beim Bewerbungsfoto dürfen Sie natürlich lächeln."
      ),
      faq(
        "Wo entstehen Bewerbungsfotos und Passbilder?",
        `Im Fotostudio Hagen, ${HAGEN_ADDRESS.street}, ${HAGEN_ADDRESS.postalCode} Hagen. Mo–Sa 10–20 Uhr, So 09–12 Uhr.`
      ),
      faq(
        "Kann ich im selben Termin ein LinkedIn-Foto machen lassen?",
        "Ja, LinkedIn- und Xing-Porträts können Sie im selben Termin dazubuchen. Sprechen Sie uns einfach an."
      ),
    ],
  },
  en: {
    title: "Application & Passport Photos Hagen | Photo Studio",
    description:
      `Application photo €29, biometric passport photo €15 at the Hagen photo studio, ${HAGEN_ADDRESS.street}. Mon–Sat 10–20, Sun 09–12. Book now.`,
    h1: "Application Photos and Passport Photos in Hagen",
    intro:
      `Application photos and biometric passport photos in Hagen, at the studio on ${HAGEN_ADDRESS.street}, Mon–Sat 10–20 and Sun 09–12. An application photo is €29 for 1 digital photo, a biometric passport photo is €15, all prices include 19% VAT. For the application photo we first agree where it will appear: a CV, LinkedIn or Xing. Then I direct posture and expression so you look natural and approachable. The passport photo follows the current biometric rules for passports, ID cards and visas. Both can be made in one visit. The studio is open Mon–Sat 10–20 and Sun 09–12.`,
    faqs: [
      faq("What does an application photo cost?", studioSittingPriceAnswer("en")),
      faq(
        "What should I wear?",
        "Clothes that suit the role, in calm, plain colours. Bring two tops if you like, and we choose together in the studio."
      ),
      faq(
        "May I smile in the passport photo?",
        "No. A passport or ID photo needs a neutral expression with a closed mouth. In an application photo you may smile."
      ),
      faq(
        "Where are application and passport photos taken?",
        `At the Hagen photo studio, ${HAGEN_ADDRESS.street}, ${HAGEN_ADDRESS.postalCode} Hagen. Mon–Sat 10–20, Sun 09–12.`
      ),
      faq(
        "Can I add a LinkedIn photo in the same visit?",
        "Yes. LinkedIn and Xing portraits can be added in the same visit. Just tell us."
      ),
    ],
  },
};

const BY_SLUG: Record<CategorySlug, { niche: Pair; www?: Pair }> = {
  wedding: { niche: weddingNiche, www: weddingWww },
  "real-estate": { niche: immoNiche, www: immoWww },
  cinematography: { niche: filmNiche, www: filmWww },
  commercial: { niche: commercialNiche, www: commercialWww },
  "business-portraits": { niche: businessNiche, www: businessWww },
  food: { niche: foodNiche, www: foodWww },
  "social-media-management": { niche: socialNiche, www: socialWww },
  studio: { niche: studioNiche },
};

export function surfaceFor(slug: CategorySlug, host?: string | null): Surface {
  const niche = host ? nicheHostForHostname(host) : null;
  return niche?.slug === slug ? "niche" : "www";
}

function linksFor(slug: CategorySlug, locale: Locale, surface: Surface, host?: string | null): SurfaceLink[] {
  const de = locale === "de";
  if (slug === "wedding" && surface === "niche") {
    return [
      { label: de ? "Hochzeitsfilm" : "Wedding film", href: filmHref(locale, host) },
      { label: de ? "Start" : "Home", href: withLocale("/", locale) },
    ];
  }
  if (slug === "wedding" && surface === "www") {
    return [
      {
        label: de ? "Hochzeitsfotograf Hagen & Solingen" : "Wedding photographer Hagen & Solingen",
        href: weddingHref(locale, host),
      },
      { label: de ? "Hochzeitsfilm" : "Wedding film", href: filmHref(locale, host) },
    ];
  }
  if (slug === "real-estate" && surface === "www") {
    return [
      {
        label: de ? "Immobilienfotograf Hagen – Fotopakete" : "Property photographer Hagen",
        href: immoHref(locale, host),
      },
    ];
  }
  if (slug === "cinematography" && surface === "niche") {
    return [
      { label: de ? "Hochzeitsfotograf" : "Wedding photographer", href: weddingHref(locale, host) },
      { label: de ? "Social-Media-Betreuung" : "Social media management", href: socialHref(locale, host) },
    ];
  }
  if (slug === "cinematography" && surface === "www") {
    return [
      { label: de ? "Videograf Hagen" : "Videographer Hagen", href: filmHref(locale, host) },
      { label: de ? "Fotostudio Solingen" : "Solingen studio", href: solingenHref(locale) },
    ];
  }
  if (slug === "commercial" && surface === "niche") {
    return [
      { label: de ? "Fotostudio Solingen" : "Solingen studio", href: solingenHref(locale) },
      {
        label: de ? "Portfolio" : "Portfolio",
        href: withLocale(`${categoryPath("commercial", locale)}/portfolio`, locale),
      },
    ];
  }
  if (slug === "commercial" && surface === "www") {
    return [
      { label: de ? "Produktfotografie Hagen" : "Product photography Hagen", href: commercialNicheHref(locale, host) },
      {
        label: de ? "Portfolio" : "Portfolio",
        href: withLocale(`${categoryPath("commercial", locale)}/portfolio`, locale),
      },
      { label: de ? "Fotostudio Solingen" : "Solingen studio", href: solingenHref(locale) },
    ];
  }
  if (slug === "business-portraits" && surface === "niche") {
    return [{ label: de ? "Fotostudio Solingen" : "Solingen studio", href: solingenHref(locale) }];
  }
  if (slug === "business-portraits" && surface === "www") {
    return [{ label: de ? "Mitarbeiterfotos Hagen" : "Staff photos Hagen", href: businessHref(locale, host) }];
  }
  if (slug === "food" && surface === "niche") {
    return [{ label: de ? "Social-Media-Betreuung" : "Social media management", href: socialHref(locale, host) }];
  }
  if (slug === "food" && surface === "www") {
    return [
      { label: de ? "Food-Fotografie Hagen" : "Food photography Hagen", href: foodHref(locale, host) },
      { label: de ? "Fotostudio Solingen" : "Solingen studio", href: solingenHref(locale) },
    ];
  }
  if (slug === "social-media-management" && surface === "niche") {
    return [{ label: de ? "Reels" : "Reels", href: filmHref(locale, host) }];
  }
  if (slug === "social-media-management" && surface === "www") {
    return [
      { label: de ? "Social-Media-Betreuung" : "Social media management", href: socialHref(locale, host) },
      { label: de ? "Videograf Hagen" : "Videographer Hagen", href: filmHref(locale, host) },
    ];
  }
  if (slug === "studio") {
    return [{ label: de ? "Termin buchen" : "Book a time", href: studioHref(locale, host) }];
  }
  return [];
}

export function serviceSurfaceCopy(
  slug: CategorySlug,
  locale: Locale,
  host?: string | null
): SurfaceCopy | null {
  const entry = BY_SLUG[slug];
  const requested = surfaceFor(slug, host);
  const surface: Surface = requested === "www" && entry.www ? "www" : "niche";
  const pair = surface === "niche" ? entry.niche : entry.www;
  if (!pair) return null;
  const copy = pair[locale];
  return {
    surface,
    title: copy.title,
    description: copy.description,
    h1: copy.h1,
    subline: copy.subline,
    intro: copy.intro,
    faqs: copy.faqs,
    links: linksFor(slug, locale, surface, host),
  };
}

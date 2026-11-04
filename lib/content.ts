import { appointmentOnlyLabel, formatAddressLine, HAGEN_ADDRESS } from "./contact";
import { applicationPhotoPriceLine, passportPhotoPriceLine, studioSittingPriceAnswer } from "./site";

export type VirtualTourItem = {
  title: string;
  url: string;
};

export type ServiceItem = {
  title: string;
  description: string;
  image?: string;
  mediaType?: "embed" | "video";
  embedUrl?: string;
  videoUrl?: string;
  tours?: VirtualTourItem[];
  videos?: VirtualTourItem[];
  beforeImage?: string;
  afterImage?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
  linkHref?: string;
  linkLabel?: string;
};

export type CategoryContent = {
  slug: string;
  navLabel: string;
  title: string;
  subtitle: string;
  themeColor: string;
  heroImage: string;
  heroVideo?: string;
  portfolioImages: string[];
  services: ServiceItem[];
  aboutText: string;
  aboutImage: string;
  faq: FAQItem[];
};

export type CategorySlug =
  | "wedding"
  | "real-estate"
  | "business-portraits"
  | "studio"
  | "food"
  | "cinematography"
  | "social-media-management"
  | "commercial";

export const sharedAbout = {
  title: "About Me",
};

function buildPortfolio(seed: string) {
  return Array.from({ length: 6 }).map(
    (_, index) => `https://picsum.photos/seed/${seed}-${index + 1}/1200/900`
  );
}

export const categoryContentMap: Record<CategorySlug, CategoryContent> = {
  wedding: {
    slug: "wedding",
    navLabel: "Wedding",
    title: "Wedding Photography",
    subtitle: "Timeless storytelling for intimate moments and grand celebrations.",
    themeColor: "#ABD3D9",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80",
    portfolioImages: buildPortfolio("wedding"),
    services: [
      {
        title: "Full-Day Coverage",
        description: "Editorial and candid coverage from prep to reception.",
      },
      {
        title: "Civil Ceremony",
        description:
          "Quiet coverage of the registry-office ceremony in Solingen, Hagen, and nearby towns. A short presence that follows the order of the day rather than staging it.",
      },
      {
        title: "Engagement Session",
        description: "Pre-wedding portraits tailored to your personal story.",
      },
      {
        title: "Album Design",
        description: "Fine-art printed albums with curated narrative flow.",
      },
      {
        title: "Wedding Film",
        description:
          "A film from the same day as the photographs: the registry office, a symbolic ceremony, or the full day. The cut stays calm and is made with the film work.",
      },
    ],
    aboutText: `I'm Aaron Bowser, a wedding photographer based in Hagen, photographing couples in Hagen, Solingen and across North Rhine-Westphalia. Civil ceremony, symbolic ceremony or the full day: I work calmly and close, with a cinematic eye for honest moments and the details that belong to you.

Before the day we get to know each other, with an engagement shoot if you like. What you receive is the story of your day, also as a printed album. A wedding film can follow the same day, produced as its own film rather than cut from the stills.`,
    aboutImage:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1000&q=80",
    faq: [
      { question: "How far in advance should we book?", answer: "Most couples book between 6 and 12 months ahead." },
      { question: "Do you travel for destination weddings?", answer: "Yes, destination coverage is available with custom travel packages." },
    ],
  },
  "real-estate": {
    slug: "real-estate",
    navLabel: "Real Estate",
    title: "Real Estate Photography",
    subtitle: "Property visuals designed to elevate listings and speed up buyer interest.",
    themeColor: "#E18400",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
    portfolioImages: buildPortfolio("real-estate"),
    services: [
      {
        title: "Interior Photography",
        description:
          "Showcase the flow, natural light, and architectural details of every room. We create bright, inviting spaces that allow buyers to truly visualize themselves living in the home.",
        image: "/real-estate/services/innenaufnahmen-immobilie.webp",
      },
      {
        title: "Exterior Photography",
        description:
          "Maximize curb appeal by highlighting the property’s architecture, landscaping, and surrounding environment with perfect angles and optimal natural lighting.",
        image: "/real-estate/services/aussenaufnahmen-immobilie.webp",
      },
      {
        title: "Twilight Sessions",
        description: "Golden-hour and evening looks for high-impact listing hero shots.",
        image: "/real-estate/services/twilight-immobilie.webp",
      },
      {
        title: "Agent Branding",
        description: "Portrait and lifestyle content for real estate professionals.",
        image: "/real-estate/services/makler-branding.webp",
      },
      {
        title: "Drone Photography",
        description:
          "Capture sweeping aerial perspectives to showcase property boundaries, surrounding landscapes, and unique architectural angles from above.",
        image: "/real-estate/services/drohnenfotografie-immobilie.webp",
      },
      {
        title: "360° Virtual Tours",
        description:
          "Provide immersive, interactive walkthroughs that allow prospective buyers to explore every room in detail from anywhere in the world.",
        image: "/real-estate/services/360-grad-rundgang.webp",
        mediaType: "embed",
        tours: [
          { title: "Primary Property", url: "https://abowser-360tour.netlify.app/" },
          { title: "Secondary Property", url: "https://www.3dvista.com/samples/living_room.html" },
        ],
      },
      {
        title: "Cinematic Highlight Videos",
        description:
          "Deliver premium, emotionally engaging video tours that highlight the flow, atmosphere, and finest details of the property.",
        image: "/real-estate/services/highlight-video-immobilie.webp",
        mediaType: "video",
        videos: [
          {
            title: "Exterior & Drone",
            url: "https://youtu.be/8nPB8MCfO30",
          },
          { title: "Exterior & Drone", url: "https://youtu.be/pWVGs4TKYRk" },
        ],
      },
      {
        title: "Digital Room Staging",
        description:
          "Transform empty spaces into warm, inviting homes with hyper-realistic digital furniture and decor staging, helping buyers visualize the property's full potential.",
        image: "/real-estate/services/digitales-homestaging.webp",
        beforeImage: "/real-estate/services/homestaging-vorher.webp",
        afterImage: "/real-estate/services/homestaging-nachher.webp",
      },
    ],
    aboutText: `I'm Aaron Bowser, a real estate photographer based in Hagen, photographing apartments, houses and commercial spaces in Hagen, Solingen and across North Rhine-Westphalia. I focus on space, light and perspective, so every property looks inviting and true to what buyers see at a viewing.

I work with agents, developers, property managers and owners. Alongside interior and exterior photography I offer twilight shots, drone photography, 360° virtual tours, short highlight videos and virtual staging, delivering listing-ready images for exposés and property portals, quickly and reliably.`,
    aboutImage:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80",
    faq: [
      { question: "What is your delivery turnaround?", answer: "Typical delivery is within 24 to 48 hours." },
      { question: "Can files be MLS-ready?", answer: "Yes, exports can be tailored for MLS, web, and social formats." },
    ],
  },
  "business-portraits": {
    slug: "business-portraits",
    navLabel: "Business Portraits",
    title: "Business Portraits in Hagen and Solingen",
    subtitle: "Executive headshots, staff photographs, and LinkedIn portraits for companies in Hagen, Solingen, and North Rhine-Westphalia.",
    themeColor: "#446E8B",
    heroImage:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1920&q=80",
    portfolioImages: buildPortfolio("business-portraits"),
    services: [
      {
        title: "Executive Headshots",
        description:
          "Portraits for founders and leadership. Light, posture, and expression are directed so the same person reads clearly on a company website, in a deck, and on LinkedIn.",
        image: "/business-portraits/portfolio/executive-portrait-frau-roter-anzug.webp",
      },
      {
        title: "Staff Portraits",
        description:
          "Individual staff portraits with one shared light, crop, and tone—so every person on the company page looks like they belong to the same session.",
        image: "/business-portraits/portfolio/mitarbeiterfoto-frau-sitzend-grau.webp",
      },
      {
        title: "Team Photographs",
        description:
          "Group and team photographs for the website, proposals, and press—photographed when the team is together, in the studio or at the office.",
        image: "/business-portraits/portfolio/firmenportrait-frau-roter-hosenanzug-stehend.webp",
      },
      {
        title: "LinkedIn Profile Pictures",
        description:
          "Corporate headshots that work as a LinkedIn profile picture and still match the portrait on your own website—for consultants, speakers, and specialists.",
        image: "/business-portraits/portfolio/linkedin-foto-frau-grauer-hintergrund.webp",
      },
      {
        title: "Business Portraits at Your Office",
        description:
          "When the team cannot come to the studio, the light is set up in your office in Hagen, Solingen, and across North Rhine-Westphalia—one consistent series on location.",
        image: "/business-portraits/portfolio/business-fotografie-frau-hellblauer-anzug.webp",
      },
    ],
    aboutText: `I'm Aaron Bowser, photographing business portraits, staff and team photos and LinkedIn headshots for companies and professionals in Hagen, Solingen and across NRW. My Hagen studio (${HAGEN_ADDRESS.street}, about 40 m²) is where I work every day and where most portrait sessions take place. Larger teams and bigger set-ups use the Solingen studio, about 100 m², by appointment – or I bring the lighting to your office.

Before the session we agree where the portraits will be used and who should be in them. During the sitting I guide posture and expression, so your website, LinkedIn and press share one calm, consistent look.`,
    aboutImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
    faq: [
      { question: "Do you coach posing?", answer: "Yes, complete posing direction is included in every session." },
      { question: "Can sessions happen at our office?", answer: "Yes, on-site sessions are available for teams and individuals." },
    ],
  },
  studio: {
    slug: "studio",
    navLabel: "Application Photos",
    title: "Application Photos and Passport Photos in Hagen",
    subtitle: `Application photos and biometric passport photos at the Hagen studio, ${HAGEN_ADDRESS.street}. An application photo is ${applicationPhotoPriceLine("en")}. A biometric passport photo is ${passportPhotoPriceLine()}.`,
    themeColor: "#446E8B",
    heroImage: "/business-portraits/hero/businessportrait-hero-frau-flieder-blazer.webp",
    portfolioImages: buildPortfolio("studio"),
    services: [
      {
        title: "Application Photos",
        description: `An application photo is ${applicationPhotoPriceLine("en")}. Portraits for a job application, a CV, and a company profile. Light, background, and expression are set for the place the picture will be used.`,
        image: "/business-portraits/portfolio/businessfoto-frau-weisse-bluse-studio.webp",
      },
      {
        title: "Passport Photos",
        description: `A biometric passport photo is ${passportPhotoPriceLine()}. Photographs for a German passport, an identity card, and a visa. The portrait is frontal, with a neutral expression, on a plain background, following the current official rules.`,
        image: "/business-portraits/portfolio/linkedin-foto-frau-grauer-hintergrund.webp",
      },
      {
        title: "LinkedIn and Xing Portraits",
        description:
          "A portrait from the same sitting that still works as a profile picture, so the person on the application and the person on the profile are recognisably the same.",
        image: "/business-portraits/portfolio/mitarbeiterfoto-frau-sitzend-grau.webp",
      },
    ],
    aboutText: `I'm Aaron Bowser. I take application photos and biometric passport photos at my Hagen studio, ${HAGEN_ADDRESS.street}, about 40 m², where I work every day and where these sessions are booked.

For your application photo we first agree where it will be used – CV, LinkedIn or Xing – and then I guide posture and expression so you look natural and approachable. Passport photos follow the current biometric rules for passports, ID cards and visas. Both can be done in one visit.

An application photo is ${applicationPhotoPriceLine("en")}. A biometric passport photo is ${passportPhotoPriceLine()}.`,
    aboutImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
    faq: [
      {
        question: "Where are application and passport photos taken?",
        answer: `At the Hagen studio, ${formatAddressLine(HAGEN_ADDRESS)}.`,
      },
      {
        question: "What does a sitting cost?",
        answer: studioSittingPriceAnswer("en"),
      },
    ],
  },
  food: {
    slug: "food",
    navLabel: "Food",
    title: "Food Photography",
    subtitle: "Flavor-forward images for restaurants, brands, and product launches.",
    themeColor: "#E2A121",
    heroImage: "/food/hero/food-hero-1-desktop.jpg",
    portfolioImages: [
      "/food/portfolio/food-asian-spread-1.jpg",
      "/food/portfolio/food-asian-spread-2.jpg",
      "/food/portfolio/food-bowl-falafel.jpg",
      "/food/portfolio/food-bowl-kofta-feta.jpg",
      "/food/portfolio/food-bowls-burger-spread.jpg",
      "/food/portfolio/food-bowls-overhead.jpg",
      "/food/portfolio/food-chicken-fried-closeup.jpg",
      "/food/portfolio/food-chicken-fried-salt.jpg",
      "/food/portfolio/food-pizza-closeup.jpg",
      "/food/portfolio/food-pizza-spread.jpg",
      "/food/portfolio/food-platter-falafel.jpg",
      "/food/portfolio/food-platter-spread.jpg",
      "/food/portfolio/food-salad-pasta-table.jpg",
      "/food/portfolio/food-spaghetti-pomodoro.jpg",
      "/food/portfolio/food-tempura-curry.jpg",
      "/food/portfolio/food-tempura-shrimp.jpg",
    ],
    services: [
      {
        title: "Menu Photography",
        description: "Appetizing imagery optimized for print and digital menus.",
      },
      {
        title: "Styled Product Sets",
        description: "Color-rich compositions for campaigns and packaging.",
      },
      {
        title: "Social Content Packs",
        description: "Recurring short-form sets tailored for social growth.",
      },
    ],
    aboutText: `I'm Aaron Bowser, a food photographer based in Hagen, working with restaurants, cafés, food brands and producers in Hagen, Solingen and across NRW. I care about texture, light and atmosphere – images that make people want to taste right away.

From styling to final colour grading, I create food photography for menus, packaging, websites and social media, in my Hagen studio or on location in your kitchen.`,
    aboutImage: "/food/portfolio/food-bowls-overhead.jpg",
    faq: [
      { question: "Can you shoot in our kitchen?", answer: "Yes, sessions can be run on location or in a controlled studio setup." },
      { question: "Do you provide styling support?", answer: "Yes, styling direction and prop planning can be included." },
    ],
  },
  cinematography: {
    slug: "cinematography",
    navLabel: "Cinematography",
    title: "Cinematography",
    subtitle: "Motion storytelling for brands, events, and visual campaigns.",
    themeColor: "#27AAE1",
    heroImage:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1920&q=80",
    portfolioImages: buildPortfolio("cinematography"),
    services: [
      {
        title: "Brand Films",
        description: "Narrative-driven films crafted for brand identity and launch campaigns.",
      },
      {
        title: "Event Coverage",
        description: "Highlight edits and documentary-style event motion coverage.",
      },
      {
        title: "Social Reels",
        description: "Short cinematic edits optimized for social platforms.",
      },
    ],
    aboutText: `I'm Aaron Bowser, producing brand films, corporate videos, event films and social reels for companies and brands in Hagen, Solingen and across NRW. I focus on clear storytelling, intentional pacing, calm camera movement and careful colour grading, so every film feels cinematic and works hard for your marketing.

We film on location, at your event, or for larger set-ups in the Solingen studio (about 100 m²) by appointment.`,
    aboutImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    faq: [
      { question: "Do you deliver vertical edits?", answer: "Yes, vertical, square, and widescreen edits are all supported." },
      { question: "Is editing included?", answer: "Yes, post-production and grading are included in standard packages." },
    ],
  },
  "social-media-management": {
    slug: "social-media-management",
    navLabel: "Social Media Management",
    title: "Social Media Management",
    subtitle: "Strategy-driven content planning, publishing, and optimization.",
    themeColor: "#818B68",
    heroImage:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1920&q=80",
    portfolioImages: buildPortfolio("social-media-management"),
    services: [
      {
        title: "Content Calendars",
        description: "Monthly publishing strategy tailored to your audience and goals.",
      },
      {
        title: "Platform Management",
        description: "Hands-on posting, copywriting, and community support.",
      },
      {
        title: "Performance Reports",
        description: "Actionable analytics with content and campaign recommendations.",
      },
    ],
    aboutText: `I'm Aaron Bowser, managing social media for companies and brands in Hagen, Solingen and across NRW. I combine my own photo and video production with strategy: content calendars, publishing, copywriting, community management and reporting that shows what works.

Your presence on Instagram, LinkedIn and beyond stays consistent, visually coherent and measurable – without you having to handle it every week.`,
    aboutImage:
      "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=1000&q=80",
    faq: [
      { question: "Which platforms do you manage?", answer: "Instagram, TikTok, LinkedIn, and Facebook management are available." },
      { question: "Do you provide captions and hashtags?", answer: "Yes, every managed post includes tailored copy and hashtag support." },
    ],
  },
  commercial: {
    slug: "commercial",
    navLabel: "Commercial",
    title: "Commercial & Editorial",
    subtitle: `Commercial and editorial photography for brands in North Rhine-Westphalia. The main studio is in Hagen. Larger productions use the Solingen studio, ${appointmentOnlyLabel("en", { sentence: false })}.`,
    themeColor: "#FFB70F",
    heroImage:
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1920&q=80",
    heroVideo: "/portfolio/commercial/hero-video.mp4",
    portfolioImages: buildPortfolio("commercial"),
    services: [
      {
        title: "Portraits & Model Portfolios",
        description: "Standard headshots don't capture true artistic identity. I specialize in highly individualized portrait sessions and dynamic editorial-style photoshoots designed to showcase your full range. Whether you are breaking into the modeling industry or building your creative brand, we will craft a standout portfolio that agencies and art directors notice.",
        image: "/commercial/services/portraet-und-modelportfolio.webp",
      },
      {
        title: "Fashion Photography",
        description: "From striking lookbooks to full-scale brand campaigns, I produce trend-forward fashion photography that brings your garments and vision to life. Emphasizing style, movement, and narrative, these sessions are designed to elevate fashion brands and designers in a competitive market.",
        image: "/commercial/services/fashion-fotografie.webp",
      },
      {
        title: "Beauty",
        description: "Beauty photography demands flawless lighting and an eye for intricate detail. I create crisp, high-impact macro and beauty imagery perfect for cosmetics brands, skincare lines, and makeup artists looking to showcase texture, color, and technique at the highest level.",
        image: "/commercial/services/beauty-fotografie.webp",
      },
      {
        title: "Product Photography",
        description: "The imagery representing your product is often your first impression with a potential client. I shoot bold, high-quality product photography—from clean e-commerce shots to stylized, creative setups—that serves as the face of your brand and drives engagement across your digital platforms.",
        image: "/commercial/services/produktfotografie.webp",
      },
      {
        title: "Editorial",
        description: "More than just a beautiful image, editorial photography tells a compelling story. We collaborate to build conceptual, magazine-quality visual narratives perfect for publications, unique brand storytelling, or artistic campaigns that require a deeper, cinematic approach.",
        image: "/commercial/services/editorial-fotografie.webp",
      }
    ],
    aboutText: `I'm Aaron Bowser, photographing fashion, beauty, product, editorial and model portfolios for brands, designers and agencies in North Rhine-Westphalia. My commercial work blends editorial storytelling with a clean fashion aesthetic – cinematic, precise and publication-ready.

Smaller productions happen at my Hagen studio, about 40 m², where I work every day. For larger sets and campaigns, the Solingen studio (about 100 m²) is available by appointment and can also be rented for your own productions. On-location shoots are possible too.`,
    aboutImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80",
    faq: [
      { question: "Do you shoot for magazine and editorial use?", answer: "Yes, editorial and publication-ready productions are a core focus of this category." },
      { question: "Can editorial and commercial assets be combined?", answer: "Yes, I can deliver both narrative editorial sets and campaign-ready commercial outputs in one project." },
    ],
  },
};

export const categoryNavigation = (Object.keys(categoryContentMap) as CategorySlug[]).map((slug) => ({
  slug,
  label: categoryContentMap[slug].navLabel,
}));

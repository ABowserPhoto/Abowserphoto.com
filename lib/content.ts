export type ServiceItem = {
  name: string;
  description: string;
  image: string;
};

export type FAQItem = {
  question: string;
  answer: string;
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
  | "food"
  | "cinematography"
  | "social-media-management"
  | "commercial";

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
        name: "Full-Day Coverage",
        description: "Editorial and candid coverage from prep to reception.",
        image:
          "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Engagement Session",
        description: "Pre-wedding portraits tailored to your personal story.",
        image:
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Album Design",
        description: "Fine-art printed albums with curated narrative flow.",
        image:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    aboutText:
      "I photograph weddings with a cinematic yet honest approach, preserving natural emotions and thoughtful details from every chapter of your day.",
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
        name: "Interior and Exterior",
        description: "Balanced, clean imagery for complete listing coverage.",
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Twilight Sessions",
        description: "Golden-hour and evening looks for high-impact listing hero shots.",
        image:
          "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Agent Branding",
        description: "Portrait and lifestyle content for real estate professionals.",
        image:
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    aboutText:
      "My real estate work focuses on space, light, and perspective to ensure each property feels inviting, accurate, and premium across platforms.",
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
    title: "Business Portraits",
    subtitle: "Professional headshots and branding portraits for modern teams.",
    themeColor: "#446E8B",
    heroImage:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1920&q=80",
    portfolioImages: buildPortfolio("business-portraits"),
    services: [
      {
        name: "Executive Headshots",
        description: "Confident and polished portraits for leadership profiles.",
        image:
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Team Sessions",
        description: "Consistent visual style for company-wide profile imagery.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Personal Branding",
        description: "Authentic portraits for entrepreneurs and consultants.",
        image:
          "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    aboutText:
      "I guide clients through lighting, expression, and posture to create portraits that communicate trust, clarity, and professional presence.",
    aboutImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
    faq: [
      { question: "Do you coach posing?", answer: "Yes, complete posing direction is included in every session." },
      { question: "Can sessions happen at our office?", answer: "Yes, on-site sessions are available for teams and individuals." },
    ],
  },
  food: {
    slug: "food",
    navLabel: "Food",
    title: "Food Photography",
    subtitle: "Flavor-forward images for restaurants, brands, and product launches.",
    themeColor: "#E2A121",
    heroImage:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1920&q=80",
    portfolioImages: buildPortfolio("food"),
    services: [
      {
        name: "Menu Photography",
        description: "Appetizing imagery optimized for print and digital menus.",
        image:
          "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Styled Product Sets",
        description: "Color-rich compositions for campaigns and packaging.",
        image:
          "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Social Content Packs",
        description: "Recurring short-form sets tailored for social growth.",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    aboutText:
      "From styling to final color grading, I craft food visuals that highlight texture, atmosphere, and appetite appeal across every channel.",
    aboutImage:
      "https://images.unsplash.com/photo-1488992783499-418eb1f62d08?auto=format&fit=crop&w=1000&q=80",
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
        name: "Brand Films",
        description: "Narrative-driven films crafted for brand identity and launch campaigns.",
        image:
          "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Event Coverage",
        description: "Highlight edits and documentary-style event motion coverage.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Social Reels",
        description: "Short cinematic edits optimized for social platforms.",
        image:
          "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    aboutText:
      "I design motion sequences with intentional pacing, camera movement, and grading so each frame feels cinematic and commercially useful.",
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
        name: "Content Calendars",
        description: "Monthly publishing strategy tailored to your audience and goals.",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Platform Management",
        description: "Hands-on posting, copywriting, and community support.",
        image:
          "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Performance Reports",
        description: "Actionable analytics with content and campaign recommendations.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    aboutText:
      "I combine creative production with practical strategy to help brands publish consistently and grow with measurable content performance.",
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
    subtitle: "Editorial storytelling, high-fashion portraiture, and magazine-grade aesthetics.",
    themeColor: "#FFB70F",
    heroImage:
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1920&q=80",
    heroVideo: "/portfolio/commercial/hero-video.mp4",
    portfolioImages: buildPortfolio("commercial"),
    services: [
      {
        name: "Editorial Portraits",
        description: "Narrative-driven portraiture crafted for magazines, lookbooks, and cultural campaigns.",
        image:
          "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "High-Fashion Sets",
        description: "Magazine-style lighting and direction that elevates fashion, beauty, and personal brand stories.",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Editorial Campaigns",
        description: "Cohesive visual narratives designed for editorial spreads, premium branding, and art direction.",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    aboutText:
      "My commercial work is rooted in editorial storytelling—blending high-fashion sensibility with intentional narrative to create portraits that feel cinematic, refined, and publication-ready.",
    aboutImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80",
    faq: [
      { question: "Do you shoot for magazine and editorial use?", answer: "Yes, editorial and publication-ready productions are a core focus of this category." },
      { question: "Can editorial and commercial assets be combined?", answer: "Yes, I can deliver both narrative editorial sets and campaign-ready commercial outputs in one project." },
    ],
  },
};

export const categoryNavigation = Object.values(categoryContentMap).map((category) => ({
  slug: category.slug,
  label: category.navLabel,
}));

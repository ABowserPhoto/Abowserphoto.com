export type CategoryTheme = {
  slug: string;
  label: string;
  primary: string;
  palette: string[];
  heroImage: string;
  heroTagline: string;
  services: string[];
  about: string;
  faqs: { question: string; answer: string }[];
  headshot: string;
};

export const themeConfig: Record<string, CategoryTheme> = {
  "business-portraits": {
    slug: "business-portraits",
    label: "Business Portraits",
    primary: "#446E8B",
    palette: ["#446E8B", "#322B2B", "#8B9DA4", "#F4F1ED"],
    heroImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=80",
    heroTagline: "Professional imagery that elevates your brand presence.",
    services: ["Executive Headshots", "LinkedIn Portraits", "Team Branding Sessions"],
    about:
      "I create polished business portraits with direction and lighting that reflect confidence, personality, and professionalism.",
    faqs: [
      {
        question: "How long is a portrait session?",
        answer: "Most business portrait sessions run between 45 and 90 minutes.",
      },
      {
        question: "Do you help with posing?",
        answer: "Yes, I guide every client through natural and confident poses.",
      },
    ],
    headshot: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  },
  "real-estate": {
    slug: "real-estate",
    label: "Real Estate",
    primary: "#007193",
    palette: ["#007193", "#05101B", "#353C44", "#5E8C93", "#F6E7D1"],
    heroImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    heroTagline: "Property visuals engineered to attract buyers faster.",
    services: ["Interior/Exterior Photography", "Twilight Shoots", "Listing Media Packages"],
    about:
      "I focus on clean composition and true-to-space storytelling that helps agents and developers present properties at their best.",
    faqs: [
      {
        question: "Do you deliver MLS-ready files?",
        answer: "Yes, all files can be exported in MLS-friendly and web-ready formats.",
      },
      {
        question: "How quickly do you deliver?",
        answer: "Standard delivery is within 24 to 48 hours depending on project size.",
      },
    ],
    headshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  food: {
    slug: "food",
    label: "Food",
    primary: "#F77800",
    palette: ["#F77800", "#FFB70F", "#BA1F00", "#9E9900", "#F4F1ED"],
    heroImage: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1600&q=80",
    heroTagline: "Mouthwatering visuals crafted for menus, campaigns, and social.",
    services: ["Menu Photography", "Product Styling", "Social Media Food Content"],
    about:
      "I collaborate with chefs and brands to capture texture, color, and atmosphere that make dishes irresistible on every screen.",
    faqs: [
      {
        question: "Do you work on location?",
        answer: "Yes, I shoot in restaurants, studios, and kitchens based on project needs.",
      },
      {
        question: "Can you include styling support?",
        answer: "Yes, styling and prop direction can be included in custom packages.",
      },
    ],
    headshot: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
  },
  wedding: {
    slug: "wedding",
    label: "Wedding",
    primary: "#5E8C93",
    palette: ["#5E8C93", "#ABD3D9", "#F5CEEC", "#F7DEEB", "#FFFFFF"],
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    heroTagline: "Emotional storytelling for your most unforgettable day.",
    services: ["Full-Day Coverage", "Engagement Sessions", "Fine Art Albums"],
    about:
      "I document weddings with a mix of editorial beauty and candid moments so your memories feel timeless and personal.",
    faqs: [
      {
        question: "Do you offer destination weddings?",
        answer: "Yes, destination bookings are available with custom travel packages.",
      },
      {
        question: "How many photos are delivered?",
        answer: "Typical wedding galleries include 500 to 900 edited images.",
      },
    ],
    headshot: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
  },
  "creative-commercial": {
    slug: "creative-commercial",
    label: "Creative & Commercial",
    primary: "#FFB70F",
    palette: ["#FFB70F", "#F77800", "#BA1F00", "#9E9900", "#27AAE1"],
    heroImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
    heroTagline: "Bold visual campaigns for products, fashion, and brands.",
    services: ["Campaign Shoots", "E-Commerce Sets", "Creative Direction"],
    about:
      "I build commercial visuals that blend strategy with high-impact creativity to make products and people stand out.",
    faqs: [
      {
        question: "Do you provide concept development?",
        answer: "Yes, I can support treatment decks, moodboards, and shot lists.",
      },
      {
        question: "Can teams be on set?",
        answer: "Absolutely, teams are welcome to collaborate during production.",
      },
    ],
    headshot: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
  cinematography: {
    slug: "cinematography",
    label: "Cinematography",
    primary: "#05101B",
    palette: ["#05101B", "#007193", "#353C44", "#5E8C93", "#27AAE1"],
    heroImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    heroTagline: "Cinematic motion content for stories, brands, and events.",
    services: ["Brand Films", "Event Cinematography", "Social Video Edits"],
    about:
      "I produce cinematic sequences with careful framing, movement, and color to deliver emotional and commercial impact.",
    faqs: [
      {
        question: "Do you deliver vertical videos?",
        answer: "Yes, vertical, square, and widescreen exports are all available.",
      },
      {
        question: "What is included post-production?",
        answer: "Editing, color grading, and delivery optimization are included in each package.",
      },
    ],
    headshot: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
};

export const categoryList = Object.values(themeConfig).map((category) => ({
  slug: category.slug,
  label: category.label,
}));

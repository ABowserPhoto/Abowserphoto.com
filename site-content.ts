// config/site-content.ts

export const siteContent = {
  immo: {
    title: "Editorial Real Estate Photography",
    subtitle: "Elevating properties with cinematic light and precision.",
    services: [
      {
        id: "interior",
        title: "Interior & Exterior Stills",
        description: "High-end editorial photography designed to sell properties faster.",
        price: "Starting at €250",
      },
      {
        id: "drone",
        title: "Aerial Photography",
        description: "Showcase the property's footprint and surrounding landscape.",
        price: "Starting at €150",
      }
    ],
    bookingText: "Book your real estate shoot today.",
  },
  wedding: {
    title: "Documentary Wedding Photography",
    subtitle: "Capturing the raw, unscripted moments of your day.",
    services: [
      {
        id: "full-day",
        title: "Full Day Coverage",
        description: "From getting ready to the last dance. Nothing missed.",
        price: "Starting at €2,500",
      },
      {
        id: "elopement",
        title: "Intimate Elopements",
        description: "For couples who want a private, cinematic experience.",
        price: "Starting at €1,200",
      }
    ],
    bookingText: "Secure your wedding date.",
  },
  // Add food, business, etc. here...
};

// Create a type so TypeScript helps you avoid typos
export type Category = keyof typeof siteContent;
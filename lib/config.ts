/**
 * TRUST Platform Configuration
 *
 * Minimal white-label config.
 * Change this file to rebrand the entire platform.
 */

export const platformConfig = {
  // Brand
  name: "TRUST",
  tagline: "PLATFORM",
  fullName: "TRUST PLATFORM",
  description: "الثقة هي أساسنا",

  // Colors (CSS variable names defined in globals.css)
  colors: {
    primary: "#D4AF37", // brand-gold
    background: "#000000",
    surface: "#0A0A0A",
  },

  // Links
  links: {
    whatsapp: "https://wa.me/201095528015",
    website: "https://trust-platform-omega.vercel.app",
  },

  // Developer Credit
  developer: {
    name: "Youssef Elkhouly",
    nameAr: "يوسف الخولي",
  },
} as const;

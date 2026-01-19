// System Settings - Centralized configuration for admin and contact routing
// All contact form submissions and system notifications route to admin

export const SYSTEM_SETTINGS = {
  // Admin account - hardcoded for security
  adminEmail: "hosturserver@gmail.com",
  
  // Contact routing
  contactEmail: "hosturserver@gmail.com",
  
  // Company information (for legal pages)
  company: {
    name: "BuildQuote",
    registeredName: "BuildQuote Limited",
    registration: "Registered in England & Wales",
  },
  
  // Support
  supportChannels: {
    primary: "AI Chat Widget",
    secondary: "Contact Form",
  },
  
  // Credit usage tiers
  creditFeatures: {
    free: [
      "Core calculations",
      "Materials lists",
      "Compliance checks",
      "Trade pricing",
      "Quote generation",
    ],
    premium: [
      "BIM exports",
      "CAD drawings",
      "Investor reports",
      "Regulatory certificates",
      "Financial models",
      "AI forecasting",
    ],
  },
} as const;

export type SystemSettings = typeof SYSTEM_SETTINGS;

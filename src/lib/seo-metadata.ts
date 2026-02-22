// SEO Metadata Engine - Dynamic per-route metadata for BuildQuote UK
// Generates unique title, description, canonical, OG, and structured data per route

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  keywords?: string;
  structuredData?: Record<string, any>;
}

const BASE_URL = "https://buildquote.lovable.app";

export const ROUTE_METADATA: Record<string, PageMeta> = {
  "/": {
    title: "BuildQuote UK | Construction Quotes, CAD & Compliance 2026",
    description: "UK's leading construction platform. Generate BCIS-accurate quotes, compliance reports, trade calculators & procurement lists. Built for UK contractors, landlords & developers.",
    canonical: BASE_URL,
    ogType: "website",
    keywords: "construction quotes UK, building cost calculator, BCIS rates 2026, contractor software, building regulations checker",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "BuildQuote UK",
      "description": "Construction project management, quoting, and compliance platform for UK contractors",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": { "@type": "Offer", "price": "5.99", "priceCurrency": "GBP", "name": "Pro Monthly" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "150" }
    }
  },
  "/calculators": {
    title: "UK Construction Calculators | Extension, Plumbing & Electrical Costs 2026",
    description: "Free UK construction cost calculators. Estimate extension costs, plumbing quotes, electrical pricing, roofing costs & more using 2026 BCIS rates with regional adjustments.",
    canonical: `${BASE_URL}/calculators`,
    keywords: "extension cost calculator UK, plumbing cost calculator, electrical quote calculator 2026, building cost estimator",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Calculate UK Construction Costs",
      "description": "Use BuildQuote's free calculators to estimate construction costs across all UK regions using 2026 BCIS rates.",
      "step": [
        { "@type": "HowToStep", "name": "Select project type", "text": "Choose from extensions, renovations, loft conversions, or new builds." },
        { "@type": "HowToStep", "name": "Enter dimensions", "text": "Input floor area, wall lengths, and room configurations." },
        { "@type": "HowToStep", "name": "Get instant quote", "text": "Receive a detailed cost breakdown with materials, labour, and compliance." }
      ]
    }
  },
  "/contact": {
    title: "Contact BuildQuote UK | Construction Software Support",
    description: "Get in touch with the BuildQuote team for support, partnerships, or enterprise enquiries. UK-based construction technology company.",
    canonical: `${BASE_URL}/contact`,
    keywords: "BuildQuote contact, construction software support UK"
  },
  "/terms": {
    title: "Terms of Service | BuildQuote UK",
    description: "BuildQuote UK terms of service. Read our terms governing use of the construction quoting, compliance, and project management platform.",
    canonical: `${BASE_URL}/terms`
  },
  "/privacy": {
    title: "Privacy Policy | BuildQuote UK",
    description: "BuildQuote UK privacy policy. How we collect, use, and protect your data on our construction management platform.",
    canonical: `${BASE_URL}/privacy`
  },
  "/login": {
    title: "Login | BuildQuote UK Construction Platform",
    description: "Sign in to your BuildQuote account. Access construction quotes, project management, trade calculators, and compliance tools.",
    canonical: `${BASE_URL}/login`
  },
  "/signup": {
    title: "Sign Up Free | BuildQuote UK Construction Software",
    description: "Create your free BuildQuote account. Start generating construction quotes, compliance reports, and managing projects in minutes.",
    canonical: `${BASE_URL}/signup`
  },
  "/dashboard": {
    title: "Dashboard | BuildQuote UK",
    description: "Your BuildQuote dashboard. Overview of projects, quotes, compliance, and trade analytics.",
    canonical: `${BASE_URL}/dashboard`
  },
  "/dashboard/projects": {
    title: "Projects | BuildQuote UK",
    description: "Manage all your construction projects. Track costs, schedules, compliance, and materials across your portfolio.",
    canonical: `${BASE_URL}/dashboard/projects`
  },
  "/dashboard/trade-jobs": {
    title: "Trade Job Calculator | BuildQuote UK",
    description: "Calculate trade job costs with detailed Bill of Materials. Plumbing, electrical, carpentry, glazing & more with 2026 UK trade rates.",
    canonical: `${BASE_URL}/dashboard/trade-jobs`
  },
  "/dashboard/compliance": {
    title: "Building Regulations Compliance | BuildQuote UK 2026",
    description: "Automated UK building regulations compliance checking. Part A-P checks, fire safety, accessibility, and energy performance against Feb 2026 standards.",
    canonical: `${BASE_URL}/dashboard/compliance`
  },
  "/dashboard/marketplace": {
    title: "Trade Marketplace | Find Verified UK Contractors",
    description: "Find verified UK contractors and tradespeople. Post jobs, receive bids, and read verified reviews. Gas Safe, NICEIC, and CSCS verified.",
    canonical: `${BASE_URL}/dashboard/marketplace`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "BuildQuote Trade Marketplace",
      "description": "Find and hire verified UK construction trades",
      "applicationCategory": "BusinessApplication"
    }
  },
  "/dashboard/electrical": {
    title: "Electrical Cost Calculator UK | BuildQuote 2026",
    description: "Calculate UK electrical installation costs. Consumer units, circuits, lighting, sockets with 2026 JIB rates and full Bill of Materials.",
    canonical: `${BASE_URL}/dashboard/electrical`
  },
  "/dashboard/plumbing": {
    title: "Plumbing & Gas Cost Calculator UK | BuildQuote 2026",
    description: "Calculate UK plumbing and gas costs. Boiler installations, heating systems, bathrooms with 2026 Gas Safe rates and full BoM.",
    canonical: `${BASE_URL}/dashboard/plumbing`
  },
  "/dashboard/carpentry": {
    title: "Carpentry Cost Calculator UK | BuildQuote 2026",
    description: "Calculate UK carpentry costs. Doors, flooring, staircases, kitchens with 2026 trade rates and full Bill of Materials.",
    canonical: `${BASE_URL}/dashboard/carpentry`
  },
  "/dashboard/glazing": {
    title: "Glazing Cost Calculator UK | BuildQuote 2026",
    description: "Calculate UK glazing costs. uPVC windows, bifold doors, Velux skylights with 2026 trade rates and U-value compliance.",
    canonical: `${BASE_URL}/dashboard/glazing`
  },
  "/dashboard/renewables": {
    title: "Renewables Calculator UK | Solar, Heat Pumps, EV Chargers 2026",
    description: "Calculate UK renewable energy costs. Solar PV, battery storage, heat pumps, EV chargers with MCS rates and ROI modelling.",
    canonical: `${BASE_URL}/dashboard/renewables`
  },
  "/dashboard/tenancy": {
    title: "Landlord Legal & HMO Compliance | BuildQuote UK 2026",
    description: "UK landlord compliance tools. HMO licensing, fire safety, HHSRS, EPC pathways, Section 8, and court forms aligned to Renters' Rights Act 2025.",
    canonical: `${BASE_URL}/dashboard/tenancy`
  },
  "/dashboard/landlord-obligations": {
    title: "Landlord Obligations UK 2026 | BuildQuote",
    description: "Complete guide to UK landlord obligations 2026. Gas safety, EICR, EPC, fire safety, deposit protection, and licensing requirements.",
    canonical: `${BASE_URL}/dashboard/landlord-obligations`
  },
  "/dashboard/finance": {
    title: "Property Finance Calculator UK | SDLT, BTL, HMO Yields 2026",
    description: "UK property finance tools. SDLT calculator, BTL stress test, HMO yield modelling, development finance, and SPV analysis.",
    canonical: `${BASE_URL}/dashboard/finance`
  },
  "/dashboard/invoices": {
    title: "Construction Invoicing | BuildQuote UK",
    description: "Generate JCT-compliant construction invoices. VAT tracking, retention management, and milestone billing.",
    canonical: `${BASE_URL}/dashboard/invoices`
  },
  "/dashboard/schedules": {
    title: "Construction Scheduling | Gantt Charts & Critical Path",
    description: "Automated construction scheduling with Gantt charts, critical path analysis, trade dependencies, and resource allocation.",
    canonical: `${BASE_URL}/dashboard/schedules`
  },
  "/dashboard/materials": {
    title: "Materials Procurement | BuildQuote UK",
    description: "Consolidated materials shopping lists with supplier comparison, lead times, and bulk discount alerts.",
    canonical: `${BASE_URL}/dashboard/materials`
  },
  "/dashboard/receipts": {
    title: "Receipt Management | BuildQuote UK",
    description: "Track trade receipts and expenses. OCR scanning, VAT categorisation, and tax year organisation.",
    canonical: `${BASE_URL}/dashboard/receipts`
  },
  "/dashboard/tax-returns": {
    title: "Tax Returns for Contractors | BuildQuote UK",
    description: "Self-assessment preparation for UK contractors. Income, expenses, VAT liability, and NI calculations.",
    canonical: `${BASE_URL}/dashboard/tax-returns`
  },
};

export function getPageMeta(pathname: string): PageMeta {
  return ROUTE_METADATA[pathname] || {
    title: "BuildQuote UK | Construction Quotes & Compliance",
    description: "UK construction platform for quotes, compliance, scheduling, and trade management.",
    canonical: `${BASE_URL}${pathname}`
  };
}

// Generate FAQ structured data for landing page
export const FAQ_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a single storey extension cost in the UK in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A single storey rear extension typically costs between £1,800-£2,800 per sqm in 2026, depending on region, specification, and build quality. Use BuildQuote's free calculator for an accurate estimate with full materials and labour breakdown."
      }
    },
    {
      "@type": "Question",
      "name": "What building regulations apply to UK extensions in 2026?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "UK extensions must comply with Building Regulations Parts A (Structure), B (Fire Safety), L (Conservation of Energy), M (Access), and P (Electrical Safety). BuildQuote automatically checks compliance against all applicable Approved Documents."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need planning permission for a rear extension?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many rear extensions fall under Permitted Development rights, allowing up to 3m (attached) or 4m (detached) without full planning permission, subject to conditions. BuildQuote checks PD eligibility automatically."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get accurate construction quotes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BuildQuote generates BCIS-accurate quotes using Jan 2026 indexed rates with regional adjustments across 14 UK regions. Enter project dimensions and specifications to get instant, detailed cost breakdowns."
      }
    }
  ]
};

// Organization structured data
export const ORG_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BuildQuote UK",
  "url": "https://buildquote.lovable.app",
  "description": "UK Construction Compliance & Quoting Software",
  "foundingDate": "2024",
  "areaServed": { "@type": "Country", "name": "United Kingdom" },
  "knowsAbout": ["Construction", "Building Regulations", "Cost Estimation", "Project Management"]
};

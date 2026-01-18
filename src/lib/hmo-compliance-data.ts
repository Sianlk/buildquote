// Comprehensive HMO, Landlord Compliance, and Property Finance Data
// UK Regulations as of January 2026 - Updated to Renters' Rights Act 2025

export interface HMOLicenseType {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  requirements: string[];
  penalties: string[];
  fees: { min: number; max: number };
  duration: string;
}

export interface FireSafetyRequirement {
  category: string;
  items: {
    name: string;
    requirement: string;
    mandatory: boolean;
    reference: string;
  }[];
}

export interface CompliancePathway {
  id: string;
  name: string;
  description: string;
  steps: {
    step: number;
    title: string;
    description: string;
    documents: string[];
    timeline: string;
  }[];
}

export interface PropertyFinanceOption {
  id: string;
  name: string;
  description: string;
  typicalLTV: string;
  typicalRate: string;
  criteria: string[];
  bestFor: string;
}

// HMO License Types - Updated January 2026
export const HMO_LICENSE_TYPES: HMOLicenseType[] = [
  {
    id: 'mandatory',
    name: 'Mandatory HMO Licence',
    description: 'Required for properties with 5+ people from 2+ households sharing facilities (national requirement)',
    criteria: [
      '5 or more tenants forming 2 or more households',
      'Sharing basic amenities (kitchen, bathroom, toilet)',
      'Main or only residence for occupants',
      'Applies to ALL properties meeting criteria (any number of storeys since Oct 2018)',
    ],
    requirements: [
      'Fit and proper person test for landlord/manager',
      'Satisfactory management arrangements',
      'Suitable property for number of occupants',
      'Bedroom sizes: 6.51m² (1 person), 10.22m² (2 persons)',
      'Kitchen: 7m² for up to 5 people; 10m² for 6-10 people',
      'Bathroom: Minimum 1 per 5 tenants',
      'Valid Gas Safety Certificate (annual)',
      '5-yearly EICR (Electrical Installation Condition Report)',
      'Mains-wired interlinked smoke/heat alarms',
      'Fire doors FD30S on all bedrooms and kitchens',
      'Emergency lighting on escape routes',
    ],
    penalties: [
      'Civil penalty up to £40,000 per offence (increased 2025)',
      'Criminal prosecution with unlimited fine',
      'Rent repayment order (up to 12 months\' rent)',
      'Banning order possibility',
      'Cannot serve Section 8 eviction notices',
    ],
    fees: { min: 500, max: 1500 },
    duration: '5 years'
  },
  {
    id: 'additional',
    name: 'Additional HMO Licensing',
    description: 'Local authority scheme for smaller HMOs in designated areas (3-4 tenants from 2+ households)',
    criteria: [
      '3 or more tenants from 2 or more households',
      'In an area designated by the local council',
      'Many councils (e.g., Brent from Feb 2, 2026) now require this',
      'Check with your local authority if applicable',
    ],
    requirements: [
      'Similar to mandatory licensing requirements',
      'May have additional local conditions',
      'Property inspection usually required before licence granted',
      'Bedroom sizes: 6.51m² (1 person), 10.22m² (2 persons)',
      'Full fire safety compliance',
    ],
    penalties: [
      'Same as mandatory licensing',
      'Civil penalty up to £40,000',
      'Criminal prosecution',
      'Rent repayment orders',
    ],
    fees: { min: 400, max: 1200 },
    duration: '5 years'
  },
  {
    id: 'selective',
    name: 'Selective Licensing',
    description: 'All privately rented properties in designated areas require a licence (not just HMOs)',
    criteria: [
      'Property in a designated selective licensing area',
      'Any private rental property (single lets included)',
      'Check with local authority for designated areas',
      'Expanding rapidly across UK councils in 2026',
    ],
    requirements: [
      'Valid Gas Safety Certificate (annual)',
      'Mains-wired smoke alarms on each floor (interlinked)',
      'CO alarm where fixed combustion appliances installed',
      'Valid AST tenancy agreement',
      'Proof of deposit protection in government scheme',
      'Fit and proper person test passed',
      '5-yearly EICR',
    ],
    penalties: [
      'Civil penalty up to £40,000',
      'Cannot serve Section 8 notices',
      'Rent repayment orders',
      'Criminal prosecution',
    ],
    fees: { min: 300, max: 900 },
    duration: 'Up to 5 years'
  }
];

// Renters' Rights Act 2025 - Key Provisions (Effective May 1, 2026)
export const RENTERS_RIGHTS_ACT_2025 = {
  effectiveDate: '2026-05-01',
  keyChanges: [
    {
      change: 'Abolition of Section 21',
      description: 'No-fault evictions banned from May 1, 2026. All evictions must use Section 8 grounds.',
      impact: 'Landlords must prove specific grounds (arrears, selling, moving in, breach) to evict.',
    },
    {
      change: 'Assured Periodic Tenancies (APTs)',
      description: 'Fixed-term contracts abolished. All new tenancies are monthly rolling contracts.',
      impact: 'Tenants can leave with 2 months notice at any time. No break clauses needed.',
    },
    {
      change: 'Rent Increase Restrictions',
      description: 'Rent can only be increased once per year via formal Section 13 notice with 2 months notice.',
      impact: 'Landlords must give proper notice. Tenants can challenge at First-tier Tribunal.',
    },
    {
      change: 'Bidding Wars Banned',
      description: 'Landlords cannot accept offers above the advertised rental price.',
      impact: 'All properties must be marketed at fixed price. No best offers.',
    },
    {
      change: 'Advance Rent Cap',
      description: 'Advance rent payments capped at one month maximum.',
      impact: 'Cannot request 6 months rent upfront regardless of circumstances.',
    },
    {
      change: 'Pet Rights',
      description: 'Tenants have statutory right to request pets. Landlords must respond within 28 days and cannot unreasonably refuse.',
      impact: 'Landlords can require pet damage insurance but cannot blanket ban pets.',
    },
  ],
  section8Grounds: [
    { ground: 1, description: 'Landlord requires property as main residence (after 12 months)', notice: '4 months' },
    { ground: '1A', description: 'Landlord intends to sell the property (after 12 months)', notice: '4 months' },
    { ground: '1B', description: 'Property required for family member (after 12 months)', notice: '4 months' },
    { ground: 2, description: 'Mortgage lender requires possession', notice: '2 months' },
    { ground: 6, description: 'Landlord intends to demolish/reconstruct', notice: '4 months' },
    { ground: 8, description: 'Serious rent arrears (8+ weeks/2+ months)', notice: '2 weeks' },
    { ground: 10, description: 'Some rent arrears (discretionary)', notice: '2 weeks' },
    { ground: 12, description: 'Breach of tenancy obligation', notice: '2 weeks' },
    { ground: 14, description: 'Anti-social behaviour', notice: 'Immediate' },
    { ground: 17, description: 'Tenancy obtained by false statement', notice: '2 weeks' },
  ],
};

// National Registers - 2026 Requirements
export const NATIONAL_REGISTERS_2026 = {
  prsDatabase: {
    name: 'National Private Rented Sector Database',
    launchDate: 'Late 2026 (rolling out)',
    requirement: 'Mandatory registration for all private landlords and every rental property',
    penalties: 'Civil penalties for non-compliance',
    information: [
      'Landlord contact details and identity verification',
      'Property address and type',
      'Current tenancy details',
      'Safety certificate status (Gas, EICR)',
      'EPC rating',
      'HMO licence status if applicable',
    ],
  },
  landlordOmbudsman: {
    name: 'Private Rented Sector Ombudsman',
    startDate: '2028',
    requirement: 'Mandatory membership for all private landlords',
    purpose: 'Handle tenant complaints, ensure dispute resolution',
  },
  shortLetRegister: {
    name: 'National Register for Short-Term Lets',
    launchDate: 'Summer 2026',
    requirement: 'Hosts must display Unique Registration Number on all platforms',
    impact: 'Cannot advertise on Airbnb, Booking.com etc. without registration number',
  },
};

// Fire Safety Requirements - Updated Jan 2026
export const FIRE_SAFETY_REQUIREMENTS: FireSafetyRequirement[] = [
  {
    category: 'Detection & Alarms',
    items: [
      { name: 'Smoke Alarms', requirement: 'Mains-wired interlinked smoke alarms on every floor (LD2 grade for HMOs)', mandatory: true, reference: 'Smoke and CO Alarm Regulations 2022' },
      { name: 'Heat Detector', requirement: 'In kitchens - heat detector not smoke detector to prevent false alarms', mandatory: true, reference: 'BS 5839-6:2019' },
      { name: 'CO Alarms', requirement: 'In all rooms with fixed combustion appliances (except gas cookers)', mandatory: true, reference: 'Smoke and CO Alarm Regulations 2022' },
      { name: 'Interlinked System', requirement: 'All alarms must be interlinked (Grade D1 minimum for HMOs)', mandatory: true, reference: 'LACORS Fire Safety Guide' },
      { name: 'Manual Call Points', requirement: 'Required for HMOs with more than 2 floors above ground level', mandatory: false, reference: 'BS 5839-6:2019' },
    ]
  },
  {
    category: 'Fire Doors',
    items: [
      { name: 'Bedroom Doors', requirement: 'FD30S fire doors (30-min rated with smoke seals) on all lettable rooms', mandatory: true, reference: 'LACORS Guide / Building Regs Part B' },
      { name: 'Kitchen Door', requirement: 'FD30S fire door if kitchen opens to escape route', mandatory: true, reference: 'Building Regs Part B' },
      { name: 'Door Closers', requirement: 'Self-closing devices on all fire doors (overhead or concealed)', mandatory: true, reference: 'Regulatory Reform (Fire Safety) Order 2005' },
      { name: 'Intumescent Strips & Smoke Seals', requirement: 'Combined intumescent/cold smoke seals on all fire doors', mandatory: true, reference: 'BS 476' },
      { name: 'Fire Door Gaps', requirement: 'Max 3mm gap at top/sides, 8-10mm at bottom for ventilation', mandatory: true, reference: 'BS 8214:2016' },
      { name: 'Fire Door Certification', requirement: 'Third-party certification (BWF Certifire or similar) required', mandatory: true, reference: 'Fire Safety (England) Regulations 2022' },
    ]
  },
  {
    category: 'Escape Routes',
    items: [
      { name: 'Protected Route', requirement: 'Clear unobstructed route from all rooms to final exit (30-min protection)', mandatory: true, reference: 'Regulatory Reform Order 2005' },
      { name: 'Emergency Lighting', requirement: 'Required for HMOs with 3+ floors or basement lettings', mandatory: true, reference: 'BS 5266-1:2016' },
      { name: 'Fire Exit Signs', requirement: 'Photoluminescent signs at all changes of direction in larger HMOs', mandatory: false, reference: 'Health & Safety Regs' },
      { name: 'Inner Room Escape', requirement: 'Escape windows (450x450mm min) or alternative route for inner rooms', mandatory: true, reference: 'Building Regs Part B' },
      { name: 'Travel Distance', requirement: 'Max 9m single direction, 18m multi-direction to protected escape', mandatory: true, reference: 'LACORS Guide' },
    ]
  },
  {
    category: 'Fire Fighting Equipment',
    items: [
      { name: 'Fire Blanket', requirement: 'Minimum 1.1m x 1.1m to BS EN 1869 in all shared kitchens', mandatory: true, reference: 'LACORS Guide' },
      { name: 'Fire Extinguisher', requirement: 'Recommended for larger HMOs - not mandatory for smaller', mandatory: false, reference: 'RRO 2005' },
      { name: 'Fire Action Notices', requirement: 'Posted in common areas with evacuation instructions', mandatory: true, reference: 'RRO 2005' },
    ]
  }
];

// HHSRS Hazards - Updated
export const HHSRS_HAZARDS = [
  {
    category: 'Physiological Requirements',
    hazards: [
      { name: 'Damp and Mould Growth', description: 'Condensation, penetrating damp, rising damp, or persistent mould - Now covered by Awaab\'s Law with strict timelines', severity: 'critical' },
      { name: 'Excess Cold', description: 'Inadequate heating or insulation leading to cold internal temperatures (<18°C)', severity: 'high' },
      { name: 'Excess Heat', description: 'Poor ventilation or excessive solar gain - Part O compliance now required for new builds', severity: 'medium' },
      { name: 'Asbestos', description: 'Presence of asbestos-containing materials in poor condition (pre-2000 properties)', severity: 'high' },
      { name: 'Carbon Monoxide', description: 'Risk from faulty combustion appliances - CO alarms now mandatory', severity: 'critical' },
      { name: 'Lead', description: 'Lead in paint, water pipes, or other sources (pre-1970 properties)', severity: 'medium' },
      { name: 'Radon', description: 'Radon gas in high-risk areas (South West, East Midlands, parts of Wales)', severity: 'medium' },
    ]
  },
  {
    category: 'Psychological Requirements',
    hazards: [
      { name: 'Crowding and Space', description: 'Overcrowding - Bedrooms must meet minimum size (6.51m² single, 10.22m² double)', severity: 'high' },
      { name: 'Entry by Intruders', description: 'Inadequate security measures (locks, window locks, door strength)', severity: 'medium' },
      { name: 'Lighting', description: 'Inadequate natural or artificial lighting (Part L and Part M compliance)', severity: 'low' },
      { name: 'Noise', description: 'Excessive noise from internal or external sources', severity: 'low' },
    ]
  },
  {
    category: 'Protection Against Infection',
    hazards: [
      { name: 'Domestic Hygiene', description: 'Inadequate kitchen facilities - HMOs need specific ratios per occupants', severity: 'medium' },
      { name: 'Personal Hygiene', description: 'Inadequate bathroom/toilet facilities - Min 1 bathroom per 5 persons', severity: 'medium' },
      { name: 'Water Supply', description: 'Contaminated water or inadequate hot water (48°C max at outlets)', severity: 'high' },
      { name: 'Pests', description: 'Infestation by rats, mice, insects, or birds', severity: 'medium' },
    ]
  },
  {
    category: 'Protection Against Accidents',
    hazards: [
      { name: 'Falls on Stairs', description: 'Steep, uneven, or unlit stairs without handrails (min 900mm balustrade)', severity: 'high' },
      { name: 'Falls Between Levels', description: 'Inadequate window restrictors (max 100mm) or balcony guarding (1100mm min)', severity: 'high' },
      { name: 'Electrical Hazards', description: 'Faulty wiring, overloaded sockets - 5-yearly EICR mandatory', severity: 'critical' },
      { name: 'Fire', description: 'Inadequate fire detection, escape routes, or separation', severity: 'critical' },
      { name: 'Hot Surfaces', description: 'Risk of burns from exposed pipes or radiators over 43°C', severity: 'medium' },
    ]
  }
];

// EPC and Retrofit Requirements - Updated Jan 2026
export const EPC_REQUIREMENTS = {
  currentMinimum: 'E',
  proposedMinimum: 'C',
  proposedDate: 'EPC C required for new tenancies by 2028, all tenancies by 2030',
  proposedDeadlines: {
    newTenancies: '2028',
    existingTenancies: '2030',
  },
  costCap: 3500, // Maximum landlord spend required
  exemptions: [
    'High cost exemption (works over £3,500 cap with valid quotes)',
    'Wall insulation exemption (technical barriers - cavity width, conservation area)',
    'Devaluation exemption (property value reduction over 5%)',
    'New landlord exemption (6 months grace period)',
    'Temporary exemption (tenant consent issues - documented)',
    'Listed building exemption (where works would unacceptably alter character)',
  ],
  retrofitMeasures: [
    { measure: 'Loft Insulation (300mm mineral wool)', cost: { min: 350, max: 700 }, savingsPerYear: 220, epcImpact: '+5-12 points' },
    { measure: 'Cavity Wall Insulation', cost: { min: 600, max: 1800 }, savingsPerYear: 180, epcImpact: '+5-15 points' },
    { measure: 'Solid Wall Insulation (Internal)', cost: { min: 6000, max: 12000 }, savingsPerYear: 350, epcImpact: '+10-20 points' },
    { measure: 'Solid Wall Insulation (External)', cost: { min: 12000, max: 25000 }, savingsPerYear: 450, epcImpact: '+15-25 points' },
    { measure: 'Double/Triple Glazing (A-rated)', cost: { min: 5000, max: 10000 }, savingsPerYear: 120, epcImpact: '+3-8 points' },
    { measure: 'Combi Boiler Upgrade (92%+ ErP)', cost: { min: 2800, max: 5000 }, savingsPerYear: 250, epcImpact: '+5-15 points' },
    { measure: 'Air Source Heat Pump', cost: { min: 10000, max: 18000 }, savingsPerYear: 400, epcImpact: '+15-25 points' },
    { measure: 'Solar PV Panels (4kW system)', cost: { min: 6000, max: 10000 }, savingsPerYear: 500, epcImpact: '+5-15 points' },
    { measure: 'LED Lighting Throughout', cost: { min: 250, max: 600 }, savingsPerYear: 60, epcImpact: '+1-3 points' },
    { measure: 'Smart Heating Controls', cost: { min: 250, max: 700 }, savingsPerYear: 100, epcImpact: '+2-5 points' },
    { measure: 'Hot Water Cylinder Insulation', cost: { min: 50, max: 150 }, savingsPerYear: 40, epcImpact: '+1-2 points' },
    { measure: 'Draught Proofing', cost: { min: 150, max: 400 }, savingsPerYear: 50, epcImpact: '+1-3 points' },
  ]
};

// Awaab's Law - Damp & Mould Standards (Extended to Private Sector 2026)
export const AWAABS_LAW = {
  name: "Awaab's Law",
  legislation: 'Social Housing Regulation Act 2023 (extended to PRS 2026)',
  background: 'Named after Awaab Ishak who died in 2020 from respiratory condition caused by mould',
  applicableTo: 'Social housing (from 2024), Private rented sector (expected 2026)',
  strictTimelines: {
    investigation: '14 calendar days from report to complete investigation',
    repairsStart: '7 calendar days from investigation to begin repairs',
    emergencyRepairs: '24 hours for emergency hazards (risk to life)',
    completion: 'Reasonable timeframe based on complexity',
  },
  landlordObligations: [
    'Respond to tenant reports within 48 hours',
    'Conduct formal damp/mould survey within 14 days',
    'Identify root cause (condensation, penetrating, rising damp)',
    'Provide written action plan to tenant',
    'Begin remediation within 7 days of assessment',
    'Complete works within reasonable timeframe',
    'Follow up to ensure problem resolved',
    'Document all actions and communications',
    'Cannot blame tenant lifestyle without evidence',
  ],
  tenantResponsibilities: [
    'Adequate ventilation (use extractors, open windows occasionally)',
    'Reasonable heating during cold weather',
    'Report any damp or mould immediately in writing',
    'Not permanently block air vents or trickle vents',
    'Allow access for inspections and repairs',
    'Dry clothes outside or in well-ventilated areas where possible',
  ],
  penalties: [
    'Unlimited fines for serious failures',
    'Banning orders for repeat offenders',
    'Rent repayment orders',
    'Criminal prosecution for serious cases',
  ],
};

// Export alias for DAMP_MOULD_STANDARDS (same as AWAABS_LAW for compatibility)
export const DAMP_MOULD_STANDARDS = AWAABS_LAW;

// Short-Term Lets & Airbnb Regulations 2026
export const SHORT_TERM_LET_REGULATIONS = {
  nationalRegister: {
    name: 'National Short-Term Let Registration Scheme',
    launchDate: 'Summer 2026',
    requirement: 'All short-term let hosts must register and display Unique Registration Number',
    whereToDisplay: ['Airbnb listing', 'Booking.com', 'Vrbo', 'All OTA platforms', 'Direct booking websites'],
    penalties: 'Fines and removal from platforms for non-compliance',
  },
  planningClass: {
    name: 'Use Class C5 (Short-Term Lets)',
    description: 'New planning use class specifically for short-term lets',
    impact: [
      'Existing short-term lets automatically reclassified to C5',
      'New short-term lets in designated areas may require planning permission',
      'Councils can use Article 4 directions to require permission',
    ],
  },
  nightLimits: {
    london: {
      limit: 90,
      unit: 'nights per year',
      applies: 'Entire property lets only',
      enforcement: 'Platform blocking after limit reached',
    },
    national: {
      description: '90-night rule being considered for national rollout via Article 4',
      status: 'Local council discretion',
    },
  },
  lodgerExemption: {
    description: 'Live-in lodgers remain "excluded occupiers" with fewer rights than AST tenants',
    rentARoomAllowance: 7500, // Tax-free income
    requirements: [
      'Landlord must live in the property',
      'Lodger occupies part of the property',
      'Shared facilities with landlord',
    ],
  },
};

// Tax & Finance - Updated Jan 2026
export const TAX_FINANCE_2026 = {
  makingTaxDigital: {
    name: 'Making Tax Digital for Income Tax',
    mandatoryFrom: '2026-04-06',
    threshold: 50000, // Income over this requires digital submission
    requirements: [
      'Quarterly digital updates to HMRC',
      'Use MTD-compatible software',
      'Digital record keeping',
      'End of period statement',
      'Final declaration',
    ],
    softwareOptions: ['Xero', 'QuickBooks', 'FreeAgent', 'Sage', 'Hammock'],
    penalties: 'Points-based penalty system for late submissions',
  },
  mortgageInterestRelief: {
    personal: {
      description: 'Individual landlords - mortgage interest relief restricted to 20% tax credit',
      impact: 'Higher rate taxpayers effectively pay more tax on rental income',
    },
    spv: {
      description: 'SPV (Limited Company) - full mortgage interest deduction against profits',
      benefit: 'Corporation tax at 25% vs up to 45% personal tax',
      considerations: [
        'Higher mortgage rates for SPV purchases',
        'Annual accounts and filing requirements',
        'Extraction of profits taxed as dividends/salary',
        'Capital gains on sale different treatment',
      ],
    },
  },
  capitalVsRevenue: {
    capital: {
      description: 'Improvements that enhance the property (not tax deductible against income)',
      examples: ['Extensions', 'New kitchen (not replacement)', 'Conservatory', 'Loft conversion', 'Additional bathroom'],
      taxTreatment: 'Offset against Capital Gains Tax on sale',
    },
    revenue: {
      description: 'Repairs and maintenance (fully tax deductible against rental income)',
      examples: ['Like-for-like boiler replacement', 'Repainting', 'Roof repairs', 'Plumbing repairs', 'Replacing worn carpet'],
      taxTreatment: 'Deduct from rental income in year incurred',
    },
  },
  stampDuty: {
    additionalProperty: 0.05, // 5% surcharge on additional properties
    thresholds: [
      { band: 0, rate: 0, upTo: 250000 },
      { band: 250001, rate: 0.05, upTo: 925000 },
      { band: 925001, rate: 0.10, upTo: 1500000 },
      { band: 1500001, rate: 0.12, upTo: Infinity },
    ],
  },
};

// Property Finance Options - Updated Jan 2026
export const PROPERTY_FINANCE_OPTIONS: PropertyFinanceOption[] = [
  {
    id: 'btl_mortgage',
    name: 'Buy-to-Let Mortgage',
    description: 'Standard mortgage for single residential rental properties',
    typicalLTV: '65-75%',
    typicalRate: '5.5-7.0% (Jan 2026)',
    criteria: [
      'Minimum income £25,000-£30,000 (varies by lender)',
      'Rental coverage 125-145% of mortgage payment at stressed rate (typically 5.5-6.5%)',
      'Property EPC rating E or above (C by 2028 for new lets)',
      'Age limits typically 25-80',
      'UK resident (some lenders accept expats)',
    ],
    bestFor: 'Individual rental properties, first-time landlords'
  },
  {
    id: 'hmo_mortgage',
    name: 'HMO Mortgage',
    description: 'Specialist mortgage for Houses in Multiple Occupation',
    typicalLTV: '65-75%',
    typicalRate: '6.0-8.0% (Jan 2026)',
    criteria: [
      'HMO licence in place or application submitted',
      'Rental coverage typically 125-145% ICR',
      'Property in acceptable condition (survey required)',
      'Landlord experience often required (2+ years)',
      'Fire safety compliance demonstrated',
      'Maximum number of units (typically 6-10 depending on lender)',
    ],
    bestFor: 'Multi-tenant properties, higher yield strategy, experienced investors'
  },
  {
    id: 'bridging_loan',
    name: 'Bridging Finance',
    description: 'Short-term finance for purchases, refurbishments, or bridging gaps',
    typicalLTV: '70-80% of purchase price',
    typicalRate: '0.55-1.25% per month (Jan 2026)',
    criteria: [
      'Clear exit strategy required (remortgage, sale, development loan)',
      'Valuation and legal fees upfront',
      'Faster completion than mortgages (7-21 days)',
      'Works for unmortgageable properties',
      'Regulated or unregulated options available',
    ],
    bestFor: 'Auction purchases, refurbishment projects, quick chain-free purchases, HMO conversions'
  },
  {
    id: 'development_finance',
    name: 'Development Finance',
    description: 'Finance for property development projects (conversions, new builds)',
    typicalLTV: '65-70% of GDV (Gross Development Value)',
    typicalRate: '8-14% (varies by project risk)',
    criteria: [
      'Detailed project plan and costings required',
      'Planning permission in place (or pre-app advice)',
      'Development experience preferred (JV options for new developers)',
      'Quantity surveyor reports for larger schemes',
      'Staged drawdowns during build',
      'Personal guarantee usually required',
    ],
    bestFor: 'HMO conversions, office-to-resi (Class MA), extensions, new builds, major refurbishments'
  },
  {
    id: 'commercial_mortgage',
    name: 'Commercial Mortgage',
    description: 'For commercial properties or mixed-use buildings',
    typicalLTV: '60-70%',
    typicalRate: '6.0-9.0% (Jan 2026)',
    criteria: [
      'Commercial lease in place preferred (or strong business plan)',
      'Property in good condition',
      'Tenant covenant strength considered',
      'Personal guarantee may be required',
      'Minimum loan typically £50k-£100k',
    ],
    bestFor: 'Shops with flats above, office buildings, commercial investments, mixed-use'
  },
  {
    id: 'remortgage',
    name: 'Remortgage/Refinance',
    description: 'Release equity from existing property or switch to better rate',
    typicalLTV: '65-75%',
    typicalRate: '5.0-6.5% (Jan 2026)',
    criteria: [
      'Existing equity in property (current value less mortgage)',
      'Property revaluation required',
      'Rental coverage requirements apply (ICR)',
      'No early repayment penalties (or factored into decision)',
      'Property must meet current EPC requirements',
    ],
    bestFor: 'Releasing equity for next purchase, rate improvement, consolidation'
  }
];

// Compliance Pathways - Step-by-Step Guides
export const COMPLIANCE_PATHWAYS: CompliancePathway[] = [
  {
    id: 'hmo_conversion',
    name: 'HMO Conversion Guide',
    description: 'Complete guide to converting a property into a licensed HMO',
    steps: [
      {
        step: 1,
        title: 'Feasibility Assessment',
        description: 'Check if property is suitable and what permissions are needed',
        documents: ['Title deeds (check for restrictive covenants)', 'Property measurements', 'Local plan/Article 4 check', 'Initial room size calculations'],
        timeline: '1-2 weeks'
      },
      {
        step: 2,
        title: 'Planning Permission (if required)',
        description: 'Apply for C3 to C4 (or sui generis for large HMOs) change of use if in Article 4 area',
        documents: ['Planning application form', 'Floor plans (existing and proposed)', 'Design & access statement', 'Site location plan'],
        timeline: '8-13 weeks for decision'
      },
      {
        step: 3,
        title: 'Building Regulations Approval',
        description: 'Submit full plans for fire safety, means of escape, sound insulation, and structural works',
        documents: ['Building control application', 'Fire strategy/risk assessment', 'Structural calculations', 'Sound insulation details', 'Ventilation calculations'],
        timeline: '4-8 weeks for approval'
      },
      {
        step: 4,
        title: 'Conversion Works',
        description: 'Carry out all construction, fire safety, and installation works',
        documents: ['Contractor quotes (min 3)', 'Building control inspection sign-offs', 'Progress photos', 'Variation orders if applicable'],
        timeline: '4-16 weeks depending on scope'
      },
      {
        step: 5,
        title: 'Safety Certifications',
        description: 'Obtain all required safety certificates before occupation',
        documents: ['Gas Safety Certificate (CP12)', 'EICR (Electrical)', 'Fire alarm installation certificate', 'Emergency lighting certificate', 'Fire door certification'],
        timeline: '1-2 weeks'
      },
      {
        step: 6,
        title: 'HMO Licence Application',
        description: 'Submit licence application to local authority with all supporting documents',
        documents: ['Licence application form', 'Floor plans with room sizes', 'All safety certificates', 'Management plan', 'Fee payment', 'DBS check (some councils)'],
        timeline: '8-16 weeks for decision'
      },
      {
        step: 7,
        title: 'Final Compliance & Letting',
        description: 'Final inspection, licence issue, and begin letting rooms',
        documents: ['Completion certificate (Building Control)', 'HMO licence', 'Tenancy agreements', 'Deposit protection certificates', 'How to Rent guide', 'EPC'],
        timeline: '1-2 weeks'
      }
    ]
  },
  {
    id: 'btl_purchase',
    name: 'Buy-to-Let Purchase Guide',
    description: 'Step-by-step guide to purchasing a buy-to-let property',
    steps: [
      {
        step: 1,
        title: 'Financial Preparation',
        description: 'Get mortgage agreement in principle and confirm deposit',
        documents: ['ID verification', 'Proof of address', 'Bank statements (3-6 months)', 'Tax returns/SA302', 'Existing portfolio schedule'],
        timeline: '1-2 weeks'
      },
      {
        step: 2,
        title: 'Property Search & Offer',
        description: 'Find property, conduct viewings, make offer',
        documents: ['Area research', 'Rental comparables', 'Yield calculations', 'Offer letter'],
        timeline: '2-8 weeks'
      },
      {
        step: 3,
        title: 'Legal & Survey',
        description: 'Instruct solicitor, arrange survey, mortgage application',
        documents: ['Full mortgage application', 'Survey report', 'Searches (local, drainage, environmental)', 'Title review'],
        timeline: '6-12 weeks'
      },
      {
        step: 4,
        title: 'Exchange & Completion',
        description: 'Exchange contracts and complete purchase',
        documents: ['Signed contracts', 'Completion statement', 'Transfer deed', 'SDLT return', 'Land Registry application'],
        timeline: '1-4 weeks after exchange'
      },
      {
        step: 5,
        title: 'Prepare for Letting',
        description: 'Get property ready and compliant for tenants',
        documents: ['Gas Safety Certificate', 'EICR', 'EPC', 'Smoke/CO alarm certificates', 'Landlord insurance', 'Legionella risk assessment'],
        timeline: '1-3 weeks'
      }
    ]
  },
  {
    id: 'refinance_equity',
    name: 'Remortgage & Equity Release',
    description: 'Guide to refinancing and releasing equity for portfolio growth',
    steps: [
      {
        step: 1,
        title: 'Portfolio Review',
        description: 'Assess current values, equity, and refinance options',
        documents: ['Current mortgage statements', 'Recent rental figures', 'Property valuations (informal)', 'ERC check'],
        timeline: '1 week'
      },
      {
        step: 2,
        title: 'Broker Consultation',
        description: 'Speak to specialist BTL broker about options',
        documents: ['Portfolio schedule', 'Income evidence', 'Target LTV discussion', 'Rate comparisons'],
        timeline: '1-2 weeks'
      },
      {
        step: 3,
        title: 'Application & Valuation',
        description: 'Submit remortgage application and arrange valuation',
        documents: ['Remortgage application', 'Valuation fee', 'Current lender redemption quote'],
        timeline: '3-6 weeks'
      },
      {
        step: 4,
        title: 'Completion',
        description: 'Complete refinance and receive equity release funds',
        documents: ['Mortgage offer', 'Solicitor undertakings', 'Completion funds', 'New mortgage deed'],
        timeline: '2-4 weeks'
      }
    ]
  }
];

// Landlord Risk Protection
export const LANDLORD_RISK_PROTECTION = {
  insurance: [
    { type: 'Landlord Buildings Insurance', description: 'Covers structure damage, fire, flood, subsidence', essential: true, recommended: true, coverage: '£500k-£2m rebuild cost' },
    { type: 'Landlord Contents Insurance', description: 'For furnished properties - covers your contents', essential: false, recommended: true, coverage: '£10k-£50k contents value' },
    { type: 'Rent Guarantee Insurance', description: 'Covers unpaid rent (typically 6-12 months)', essential: true, recommended: true, coverage: '£2,500-£5,000/month for 6-12 months' },
    { type: 'Legal Expenses Insurance', description: 'Covers eviction and legal costs (often bundled with RGI)', essential: true, recommended: true, coverage: '£50k-£100k legal costs' },
    { type: 'Public Liability Insurance', description: 'Covers injury claims from tenants/visitors', essential: true, recommended: true, coverage: '£2m-£5m public liability' },
    { type: 'Pet Damage Insurance', description: 'Required if allowing pets under Renters Rights Act', essential: false, recommended: false, coverage: '£1k-£3k pet damage' },
  ],
  tenantReferencing: [
    'Credit check (Experian/Equifax/TransUnion)',
    'Employer reference',
    'Previous landlord reference',
    'Right to Rent check (immigration status)',
    'Affordability assessment (rent max 40-45% of income)',
    'Bank statement review',
  ],
  documentation: [
    'AST (Assured Shorthold Tenancy) agreement - use government template updated for Renters Rights Act',
    'Prescribed information for deposit protection (within 30 days)',
    'Gas Safety Certificate (provided before occupation)',
    'EICR (provided before occupation)',
    'EPC (provided before occupation)',
    'How to Rent guide (government version)',
    'Deposit protection certificate and scheme details',
  ],
  enforcementAvoidance: [
    'Maintain all safety certificates up to date',
    'Respond to maintenance requests within 48 hours (document everything)',
    'Keep deposit in protected scheme (3 schemes: DPS, MyDeposits, TDS)',
    'Serve all notices correctly using prescribed forms',
    'Maintain property to HHSRS standards',
    'Address damp/mould within Awaab\'s Law timeframes',
    'Register on landlord database when live',
    'Keep photographic inventory at start/end of tenancy',
  ],
};

// Building Regulations 2026 Standards
export const BUILDING_REGS_2026 = {
  partL: {
    name: 'Conservation of Fuel and Power',
    uValues: {
      walls: 0.18,
      floor: 0.13,
      roof: 0.11,
      windows: 1.2,
      doors: 1.0,
    },
    requirements: [
      'EPC rating to be achieved as designed',
      'BREL (Building Regulations England Part L) report required',
      'Air tightness testing for larger extensions',
      'TER/DER calculations for new builds',
    ],
  },
  partO: {
    name: 'Overheating (Residential)',
    description: 'New requirement for all new residential buildings and extensions',
    requirements: [
      'Simplified or dynamic overheating assessment',
      'Cross-ventilation provisions',
      'Solar shading consideration',
      'Glazing ratios on exposed facades',
    ],
  },
  partS: {
    name: 'Infrastructure for Charging Electric Vehicles',
    requirements: [
      'New residential - EV charge point per dwelling with parking',
      'Minimum 7kW smart charger',
      'Cable routes for buildings without parking',
    ],
  },
  partM: {
    name: 'Access',
    requirements: [
      'Level or ramped approach (1:12 max)',
      'Door widths min 775mm clear opening',
      'Step-free access to principal entrance',
      'Accessible WC on entry storey (new builds)',
    ],
  },
  partB: {
    name: 'Fire Safety',
    requirements: [
      'Interlinked smoke/heat alarms (new builds/conversions)',
      'Fire doors FD30 where required',
      'Protected escape routes',
      'External fire spread considerations',
    ],
  },
};

// Utility Functions
export function estimateLicenseFees(councilName: string, type: 'mandatory' | 'additional' | 'selective'): { min: number; max: number; note: string } {
  const licenseType = HMO_LICENSE_TYPES.find(l => l.id === type);
  const baseFees = licenseType?.fees || { min: 400, max: 1000 };
  
  // London boroughs typically higher
  const londonBoroughs = ['westminster', 'kensington', 'camden', 'islington', 'hackney', 'tower hamlets', 'southwark', 'lambeth', 'brent', 'newham', 'barnet'];
  const isLondon = londonBoroughs.some(b => councilName.toLowerCase().includes(b));
  
  if (isLondon) {
    return {
      min: Math.round(baseFees.min * 1.4),
      max: Math.round(baseFees.max * 1.6),
      note: 'London borough - fees typically 40-60% higher. Check council website for exact fees.'
    };
  }
  
  return {
    ...baseFees,
    note: 'Fees vary by council. Check your local authority website for exact fees and any early bird discounts.'
  };
}

export function calculateEPCUpgradePath(currentRating: string, targetRating: string = 'C'): { 
  measures: typeof EPC_REQUIREMENTS.retrofitMeasures; 
  totalCost: { min: number; max: number }; 
  totalSavings: number;
  withinCap: boolean;
} {
  const ratingOrder = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
  const currentIndex = ratingOrder.indexOf(currentRating.toUpperCase());
  const targetIndex = ratingOrder.indexOf(targetRating.toUpperCase());
  
  if (currentIndex === -1 || targetIndex === -1 || currentIndex >= targetIndex) {
    return { 
      measures: [], 
      totalCost: { min: 0, max: 0 }, 
      totalSavings: 0,
      withinCap: true,
    };
  }
  
  const stepsNeeded = targetIndex - currentIndex;
  
  // Recommend measures based on improvement needed
  const allMeasures = EPC_REQUIREMENTS.retrofitMeasures;
  let recommendedMeasures = [];
  
  // Start with quick wins
  if (stepsNeeded >= 1) {
    recommendedMeasures.push(allMeasures.find(m => m.measure.includes('Loft'))!);
    recommendedMeasures.push(allMeasures.find(m => m.measure.includes('LED'))!);
    recommendedMeasures.push(allMeasures.find(m => m.measure.includes('Draught'))!);
  }
  if (stepsNeeded >= 2) {
    recommendedMeasures.push(allMeasures.find(m => m.measure.includes('Cavity'))!);
    recommendedMeasures.push(allMeasures.find(m => m.measure.includes('Smart Heating'))!);
  }
  if (stepsNeeded >= 3) {
    recommendedMeasures.push(allMeasures.find(m => m.measure.includes('Combi'))!);
  }
  if (stepsNeeded >= 4) {
    recommendedMeasures.push(allMeasures.find(m => m.measure.includes('Double'))!);
  }
  
  recommendedMeasures = recommendedMeasures.filter(Boolean);
  
  const totalCost = recommendedMeasures.reduce((acc, m) => ({
    min: acc.min + m.cost.min,
    max: acc.max + m.cost.max,
  }), { min: 0, max: 0 });
  
  const totalSavings = recommendedMeasures.reduce((sum, m) => sum + m.savingsPerYear, 0);
  
  return {
    measures: recommendedMeasures,
    totalCost,
    totalSavings,
    withinCap: totalCost.min <= EPC_REQUIREMENTS.costCap,
  };
}

export function calculateStampDuty(purchasePrice: number, isAdditionalProperty: boolean = true): number {
  const { thresholds, additionalProperty } = TAX_FINANCE_2026.stampDuty;
  let duty = 0;
  let remaining = purchasePrice;
  
  for (let i = 0; i < thresholds.length; i++) {
    const { band, rate, upTo } = thresholds[i];
    const nextBand = thresholds[i + 1]?.band || Infinity;
    const taxableInBand = Math.min(remaining, upTo - band);
    
    if (taxableInBand > 0) {
      duty += taxableInBand * rate;
      remaining -= taxableInBand;
    }
    
    if (remaining <= 0) break;
  }
  
  if (isAdditionalProperty) {
    duty += purchasePrice * additionalProperty;
  }
  
  return Math.round(duty);
}

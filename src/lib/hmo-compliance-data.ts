// Comprehensive HMO, Landlord Compliance, and Property Finance Data
// UK Regulations as of January 2026

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

// HMO License Types
export const HMO_LICENSE_TYPES: HMOLicenseType[] = [
  {
    id: 'mandatory',
    name: 'Mandatory HMO License',
    description: 'Required for properties with 5+ tenants from 2+ households, regardless of storeys',
    criteria: [
      '5 or more tenants forming 2 or more households',
      'Sharing basic amenities (kitchen, bathroom, toilet)',
      'Main or only residence for occupants',
      'Applies to ALL properties meeting criteria (not just 3+ storeys since 2018)',
    ],
    requirements: [
      'Fit and proper person test for landlord/manager',
      'Satisfactory management arrangements',
      'Suitable property for number of occupants',
      'Adequate amenities (kitchens, bathrooms, WCs)',
      'Valid gas safety certificate',
      '5-yearly EICR',
      'Fire safety measures in place',
      'Minimum bedroom sizes met',
    ],
    penalties: [
      'Civil penalty up to £30,000 per offence',
      'Criminal prosecution with unlimited fine',
      'Rent repayment order (up to 12 months\' rent)',
      'Banning order possibility',
      'Cannot use Section 21 eviction',
    ],
    fees: { min: 500, max: 1500 },
    duration: '5 years'
  },
  {
    id: 'additional',
    name: 'Additional HMO Licensing',
    description: 'Local authority scheme for smaller HMOs in designated areas',
    criteria: [
      '3+ tenants from 2+ households',
      'In an area designated by the local council',
      'Check with your local authority if applicable',
    ],
    requirements: [
      'Similar to mandatory licensing',
      'May have additional local conditions',
      'Property inspection usually required',
    ],
    penalties: [
      'Same as mandatory licensing',
      'Civil penalty up to £30,000',
      'Criminal prosecution',
    ],
    fees: { min: 400, max: 1200 },
    duration: '5 years'
  },
  {
    id: 'selective',
    name: 'Selective Licensing',
    description: 'All privately rented properties in designated areas require a license',
    criteria: [
      'Property in a designated selective licensing area',
      'Any private rental property (not just HMOs)',
      'Check with local authority for designated areas',
    ],
    requirements: [
      'Valid gas safety certificate',
      'Smoke alarms on each floor',
      'CO alarm where solid fuel used',
      'Valid tenancy agreement',
      'Proof of deposit protection',
      'Fit and proper person test',
    ],
    penalties: [
      'Civil penalty up to £30,000',
      'Cannot serve Section 21',
      'Rent repayment orders',
    ],
    fees: { min: 300, max: 900 },
    duration: 'Up to 5 years'
  }
];

// Fire Safety Requirements
export const FIRE_SAFETY_REQUIREMENTS: FireSafetyRequirement[] = [
  {
    category: 'Detection & Alarms',
    items: [
      { name: 'Smoke Alarms', requirement: 'At least one per floor (mains-wired interlinked for HMOs)', mandatory: true, reference: 'Smoke and CO Alarm Regulations 2022' },
      { name: 'Heat Detector', requirement: 'In kitchens (not smoke alarms due to false alarms)', mandatory: true, reference: 'BS 5839-6' },
      { name: 'CO Alarms', requirement: 'In rooms with fixed combustion appliances (exc. gas cookers)', mandatory: true, reference: 'Smoke and CO Alarm Regulations 2022' },
      { name: 'Interlinked System', requirement: 'All alarms interlinked for HMOs (Grade D minimum)', mandatory: true, reference: 'LACORS Fire Safety Guide' },
      { name: 'Manual Call Points', requirement: 'Required for HMOs with more than 2 floors above ground', mandatory: false, reference: 'BS 5839-6' },
    ]
  },
  {
    category: 'Fire Doors',
    items: [
      { name: 'Bedroom Doors', requirement: 'FD30S fire doors on all sleeping rooms in HMOs', mandatory: true, reference: 'LACORS Guide' },
      { name: 'Kitchen Door', requirement: 'FD30S fire door if kitchen opens to escape route', mandatory: true, reference: 'Building Regs Part B' },
      { name: 'Door Closers', requirement: 'Self-closing devices on all fire doors', mandatory: true, reference: 'Regulatory Reform (Fire Safety) Order 2005' },
      { name: 'Intumescent Strips', requirement: 'Smoke seals and intumescent strips on all fire doors', mandatory: true, reference: 'BS 476' },
      { name: 'Fire Door Gaps', requirement: 'Max 3mm gap at top/sides, 8-10mm at bottom', mandatory: true, reference: 'BS 8214' },
    ]
  },
  {
    category: 'Escape Routes',
    items: [
      { name: 'Protected Route', requirement: 'Clear unobstructed route from all rooms to final exit', mandatory: true, reference: 'Regulatory Reform Order' },
      { name: 'Emergency Lighting', requirement: 'Required for HMOs with 3+ floors or basement', mandatory: false, reference: 'BS 5266' },
      { name: 'Fire Exit Signs', requirement: 'Photoluminescent signs for larger HMOs', mandatory: false, reference: 'Health & Safety Regs' },
      { name: 'Inner Room Escape', requirement: 'Escape windows or alternative route for inner rooms', mandatory: true, reference: 'Part B' },
      { name: 'Travel Distance', requirement: 'Max 9m single direction, 18m multi-direction', mandatory: true, reference: 'LACORS' },
    ]
  },
  {
    category: 'Fire Fighting Equipment',
    items: [
      { name: 'Fire Blanket', requirement: 'Minimum 1m x 1m in all shared kitchens', mandatory: true, reference: 'LACORS Guide' },
      { name: 'Fire Extinguisher', requirement: 'Recommended for larger HMOs (not mandatory for smaller)', mandatory: false, reference: 'RRO 2005' },
      { name: 'Signage', requirement: 'Fire action notices in common areas of HMOs', mandatory: true, reference: 'RRO 2005' },
    ]
  }
];

// HHSRS (Housing Health and Safety Rating System) Hazards
export const HHSRS_HAZARDS = [
  {
    category: 'Physiological Requirements',
    hazards: [
      { name: 'Damp and Mould Growth', description: 'Condensation, penetrating damp, rising damp, or persistent mould', severity: 'high' },
      { name: 'Excess Cold', description: 'Inadequate heating or insulation leading to cold internal temperatures', severity: 'high' },
      { name: 'Excess Heat', description: 'Poor ventilation or excessive solar gain causing overheating', severity: 'medium' },
      { name: 'Asbestos', description: 'Presence of asbestos-containing materials in poor condition', severity: 'high' },
      { name: 'Biocides', description: 'Exposure to chemicals used for pest control or timber treatment', severity: 'low' },
      { name: 'Carbon Monoxide', description: 'Risk from faulty combustion appliances', severity: 'high' },
      { name: 'Lead', description: 'Lead in paint, water pipes, or other sources', severity: 'medium' },
      { name: 'Radiation', description: 'Radon gas in high-risk areas', severity: 'medium' },
      { name: 'Uncombusted Fuel Gas', description: 'Risk of gas leaks', severity: 'high' },
      { name: 'Volatile Organic Compounds', description: 'Fumes from paints, adhesives, or furnishings', severity: 'low' },
    ]
  },
  {
    category: 'Psychological Requirements',
    hazards: [
      { name: 'Crowding and Space', description: 'Overcrowding or inadequate living space', severity: 'medium' },
      { name: 'Entry by Intruders', description: 'Inadequate security measures', severity: 'medium' },
      { name: 'Lighting', description: 'Inadequate natural or artificial lighting', severity: 'low' },
      { name: 'Noise', description: 'Excessive noise from internal or external sources', severity: 'low' },
    ]
  },
  {
    category: 'Protection Against Infection',
    hazards: [
      { name: 'Domestic Hygiene', description: 'Inadequate facilities for food storage/preparation or refuse disposal', severity: 'medium' },
      { name: 'Personal Hygiene', description: 'Inadequate bathroom or toilet facilities', severity: 'medium' },
      { name: 'Water Supply', description: 'Contaminated water or inadequate hot water', severity: 'high' },
      { name: 'Pests', description: 'Infestation by rats, mice, insects, or birds', severity: 'medium' },
    ]
  },
  {
    category: 'Protection Against Accidents',
    hazards: [
      { name: 'Falls on Stairs', description: 'Steep, uneven, or unlit stairs without handrails', severity: 'high' },
      { name: 'Falls on Level', description: 'Uneven floors, trip hazards, or slippery surfaces', severity: 'medium' },
      { name: 'Falls Between Levels', description: 'Inadequate window restrictors or balcony guarding', severity: 'high' },
      { name: 'Electrical Hazards', description: 'Faulty wiring, overloaded sockets, or exposed cables', severity: 'high' },
      { name: 'Fire', description: 'Inadequate fire detection, escape routes, or separation', severity: 'high' },
      { name: 'Hot Surfaces', description: 'Risk of burns from exposed pipes or radiators', severity: 'medium' },
      { name: 'Collision and Entrapment', description: 'Low headroom, glass in doors, or trapping hazards', severity: 'low' },
      { name: 'Explosions', description: 'Risk from faulty boilers or gas appliances', severity: 'high' },
    ]
  }
];

// EPC and Retrofit Requirements
export const EPC_REQUIREMENTS = {
  currentMinimum: 'E',
  proposedMinimum: 'C',
  proposedDate: '2028 (new tenancies), 2030 (existing)',
  exemptions: [
    'High cost exemption (works over £3,500 cap)',
    'Wall insulation exemption (technical barriers)',
    'Devaluation exemption (property value reduction)',
    'New landlord exemption (6 months grace)',
    'Temporary exemption (consent issues)',
  ],
  retrofitMeasures: [
    { measure: 'Loft Insulation (300mm)', cost: { min: 300, max: 600 }, savingsPerYear: 200, epcImpact: '+5-10 points' },
    { measure: 'Cavity Wall Insulation', cost: { min: 500, max: 1500 }, savingsPerYear: 150, epcImpact: '+5-15 points' },
    { measure: 'Solid Wall Insulation (Internal)', cost: { min: 5000, max: 10000 }, savingsPerYear: 300, epcImpact: '+10-20 points' },
    { measure: 'Solid Wall Insulation (External)', cost: { min: 10000, max: 22000 }, savingsPerYear: 400, epcImpact: '+15-25 points' },
    { measure: 'Double/Triple Glazing', cost: { min: 4000, max: 8000 }, savingsPerYear: 100, epcImpact: '+3-8 points' },
    { measure: 'Combi Boiler Upgrade', cost: { min: 2500, max: 4500 }, savingsPerYear: 200, epcImpact: '+5-15 points' },
    { measure: 'Heat Pump (ASHP)', cost: { min: 8000, max: 15000 }, savingsPerYear: 300, epcImpact: '+10-20 points' },
    { measure: 'Solar PV Panels', cost: { min: 5000, max: 9000 }, savingsPerYear: 400, epcImpact: '+5-15 points' },
    { measure: 'LED Lighting Throughout', cost: { min: 200, max: 500 }, savingsPerYear: 50, epcImpact: '+1-3 points' },
    { measure: 'Smart Heating Controls', cost: { min: 200, max: 600 }, savingsPerYear: 80, epcImpact: '+2-5 points' },
  ]
};

// Damp & Mould Standards (Awaab's Law)
export const DAMP_MOULD_STANDARDS = {
  law: "Awaab's Law (Social Housing Regulation Act 2023)",
  applicableTo: 'Social housing initially, expected to extend to private sector',
  requirements: [
    'Landlords must investigate hazards within 14 days',
    'Must start repairs within 7 days of investigation',
    'Emergency repairs within 24 hours',
    'Record keeping for all reports and actions',
    'Regular property inspections',
  ],
  landlordActions: [
    'Respond to tenant reports within 48 hours',
    'Conduct damp/mould survey if reported',
    'Identify root cause (condensation, penetrating, rising)',
    'Carry out appropriate remediation',
    'Follow up to ensure problem resolved',
    'Document all actions and communications',
  ],
  tenantResponsibilities: [
    'Adequate ventilation (use extractors, open windows)',
    'Reasonable heating during cold weather',
    'Report any damp or mould immediately',
    'Not block air vents or trickle vents',
    'Dry clothes outside or in well-ventilated areas',
  ],
};

// Property Finance Pathways
export const PROPERTY_FINANCE_OPTIONS: PropertyFinanceOption[] = [
  {
    id: 'btl_mortgage',
    name: 'Buy-to-Let Mortgage',
    description: 'Standard mortgage for single residential rental properties',
    typicalLTV: '60-75%',
    typicalRate: '5.0-6.5%',
    criteria: [
      'Minimum income £25,000 (varies by lender)',
      'Rental coverage 125-145% of mortgage payment',
      'Stress tested at higher rates',
      'Property EPC rating E or above',
      'Experienced landlord preferred but not required',
    ],
    bestFor: 'Individual rental properties, first-time landlords'
  },
  {
    id: 'hmo_mortgage',
    name: 'HMO Mortgage',
    description: 'Specialist mortgage for Houses in Multiple Occupation',
    typicalLTV: '65-75%',
    typicalRate: '5.5-7.5%',
    criteria: [
      'HMO license in place or application submitted',
      'Rental coverage typically 130-150%',
      'Property in acceptable condition',
      'Landlord experience often required',
      'Fire safety compliance demonstrated',
    ],
    bestFor: 'Multi-tenant properties, higher yield strategy'
  },
  {
    id: 'bridging_loan',
    name: 'Bridging Finance',
    description: 'Short-term finance for purchases, refurbishments, or bridging gaps',
    typicalLTV: '70-80% of purchase price',
    typicalRate: '0.5-1.5% per month',
    criteria: [
      'Clear exit strategy required',
      'Valuation and legal fees upfront',
      'Faster completion than mortgages',
      'Works for unmortgageable properties',
      'Regulated or unregulated options',
    ],
    bestFor: 'Auction purchases, refurbishment projects, quick purchases'
  },
  {
    id: 'development_finance',
    name: 'Development Finance',
    description: 'Finance for property development projects (conversions, new builds)',
    typicalLTV: '65-70% of GDV (Gross Development Value)',
    typicalRate: '7-12% (varies by project)',
    criteria: [
      'Detailed project plan and costings',
      'Planning permission in place',
      'Development experience preferred',
      'Quantity surveyor reports',
      'Staged drawdowns during build',
    ],
    bestFor: 'Office conversions, HMO conversions, extensions, new builds'
  },
  {
    id: 'commercial_mortgage',
    name: 'Commercial Mortgage',
    description: 'For commercial properties or mixed-use buildings',
    typicalLTV: '60-70%',
    typicalRate: '5.5-8%',
    criteria: [
      'Commercial lease in place preferred',
      'Property in good condition',
      'Tenant covenant strength considered',
      'Personal guarantee may be required',
    ],
    bestFor: 'Shops with flats above, office buildings, commercial investments'
  },
  {
    id: 'remortgage',
    name: 'Remortgage/Refinance',
    description: 'Release equity from existing property or switch to better rate',
    typicalLTV: '60-75%',
    typicalRate: '4.5-6%',
    criteria: [
      'Existing equity in property',
      'Property revaluation required',
      'Rental coverage requirements apply',
      'No early repayment penalties (or factored in)',
    ],
    bestFor: 'Releasing equity for next purchase, rate improvement'
  }
];

// Step-by-step pathways
export const COMPLIANCE_PATHWAYS: CompliancePathway[] = [
  {
    id: 'hmo_conversion',
    name: 'HMO Conversion Pathway',
    description: 'Complete guide to converting a property into a licensed HMO',
    steps: [
      {
        step: 1,
        title: 'Feasibility & Planning',
        description: 'Check if property is suitable and what permissions are needed',
        documents: ['Title deeds', 'Property measurements', 'Local plan check'],
        timeline: '1-2 weeks'
      },
      {
        step: 2,
        title: 'Planning Permission (if required)',
        description: 'Apply for planning if changing use class or creating large HMO',
        documents: ['Planning application', 'Floor plans', 'Design statement'],
        timeline: '8-13 weeks'
      },
      {
        step: 3,
        title: 'Building Regulations Approval',
        description: 'Submit plans for fire safety, means of escape, and structural works',
        documents: ['Building control application', 'Fire strategy', 'Structural calcs'],
        timeline: '4-8 weeks'
      },
      {
        step: 4,
        title: 'Conversion Works',
        description: 'Carry out all construction and installation works',
        documents: ['Contractor quotes', 'Building control inspections', 'Certificates'],
        timeline: '4-12 weeks'
      },
      {
        step: 5,
        title: 'Safety Certifications',
        description: 'Obtain all required safety certificates',
        documents: ['Gas safety cert', 'EICR', 'Fire alarm cert', 'Emergency lighting cert'],
        timeline: '1-2 weeks'
      },
      {
        step: 6,
        title: 'HMO License Application',
        description: 'Submit license application to local authority',
        documents: ['License application', 'Floor plans', 'All certificates', 'Fee payment'],
        timeline: '8-16 weeks for decision'
      },
      {
        step: 7,
        title: 'Final Inspection & Compliance',
        description: 'Council inspection and any conditions to address',
        documents: ['Inspection report', 'Compliance confirmation', 'License certificate'],
        timeline: '2-4 weeks'
      }
    ]
  },
  {
    id: 'btl_purchase',
    name: 'Buy-to-Let Purchase Pathway',
    description: 'Complete guide to purchasing a rental investment property',
    steps: [
      {
        step: 1,
        title: 'Financial Preparation',
        description: 'Arrange deposit, get mortgage agreement in principle',
        documents: ['Bank statements', 'Tax returns', 'AIP certificate'],
        timeline: '1-2 weeks'
      },
      {
        step: 2,
        title: 'Property Search & Offer',
        description: 'Find suitable property and make offer',
        documents: ['Property details', 'Rental comparables', 'Offer letter'],
        timeline: '2-8 weeks'
      },
      {
        step: 3,
        title: 'Mortgage Application',
        description: 'Full mortgage application and valuation',
        documents: ['Full application', 'Valuation report', 'Mortgage offer'],
        timeline: '3-6 weeks'
      },
      {
        step: 4,
        title: 'Legal Conveyancing',
        description: 'Solicitor searches, enquiries, and contract exchange',
        documents: ['Searches', 'Contract pack', 'ID verification'],
        timeline: '6-12 weeks'
      },
      {
        step: 5,
        title: 'Completion',
        description: 'Complete purchase and receive keys',
        documents: ['Completion statement', 'Transfer deed', 'Keys'],
        timeline: '1-2 weeks after exchange'
      },
      {
        step: 6,
        title: 'Compliance Setup',
        description: 'Arrange all required safety certificates and registrations',
        documents: ['Gas safety', 'EICR', 'EPC', 'Deposit registration'],
        timeline: '1-2 weeks'
      },
      {
        step: 7,
        title: 'Find Tenants',
        description: 'Market property and reference tenants',
        documents: ['Tenancy agreement', 'Inventory', 'Right to rent checks'],
        timeline: '2-4 weeks'
      }
    ]
  }
];

// Landlord Risk Protection Strategies
export const LANDLORD_RISK_PROTECTION = {
  insurance: [
    { type: 'Landlord Buildings Insurance', coverage: 'Structure, fixtures, fittings', recommended: true },
    { type: 'Landlord Contents Insurance', coverage: 'Furnished property items', recommended: true },
    { type: 'Rent Guarantee Insurance', coverage: '6-12 months unpaid rent', recommended: true },
    { type: 'Legal Expenses Insurance', coverage: 'Eviction costs, disputes', recommended: true },
    { type: 'Emergency Home Cover', coverage: 'Boiler, plumbing, electrics emergencies', recommended: false },
    { type: 'Unoccupied Property Insurance', coverage: 'Void periods over 30 days', recommended: false },
  ],
  tenantReferencing: [
    'Credit check (CCJs, bankruptcies, defaults)',
    'Employment verification and income check',
    'Previous landlord references',
    'Right to Rent immigration check',
    'Affordability assessment (rent vs income)',
  ],
  documentation: [
    'Comprehensive tenancy agreement',
    'Detailed inventory with photos/video',
    'Check-in and check-out reports',
    'Prescribed information for deposit',
    'How to Rent guide acknowledgement',
    'Gas safety certificate copy to tenant',
    'EPC provided before tenancy',
    'EICR copy to tenant',
  ],
  enforcementAvoidance: [
    'Respond to repairs within 14 days',
    'Keep detailed records of all communications',
    'Never discriminate in tenant selection',
    'Serve notices correctly (method and timing)',
    'Maintain all certifications current',
    'License property if required',
    'Protect deposit within 30 days',
    'Provide all prescribed documents',
  ]
};

// Calculate license fees
export function estimateLicenseFees(councilName: string, type: 'mandatory' | 'additional' | 'selective'): { min: number; max: number; note: string } {
  const baseRanges = {
    mandatory: { min: 500, max: 1500 },
    additional: { min: 400, max: 1200 },
    selective: { min: 300, max: 900 }
  };
  
  return {
    ...baseRanges[type],
    note: `Actual fees vary by council. Check ${councilName || 'your local authority'} website for exact fees.`
  };
}

// Calculate EPC improvement pathway
export function calculateEPCUpgradePath(currentRating: string, targetRating: string = 'C'): { measures: typeof EPC_REQUIREMENTS.retrofitMeasures; totalCost: { min: number; max: number }; totalSavings: number } {
  const ratingValues: Record<string, number> = { A: 92, B: 81, C: 69, D: 55, E: 39, F: 21, G: 1 };
  const currentValue = ratingValues[currentRating.toUpperCase()] || 39;
  const targetValue = ratingValues[targetRating.toUpperCase()] || 69;
  
  const pointsNeeded = targetValue - currentValue;
  
  // Select measures that make sense for the improvement needed
  const recommendedMeasures = EPC_REQUIREMENTS.retrofitMeasures.filter(m => {
    const avgImpact = parseInt(m.epcImpact.split('-')[1]) || 10;
    return avgImpact > 0;
  });
  
  return {
    measures: recommendedMeasures,
    totalCost: {
      min: recommendedMeasures.reduce((sum, m) => sum + m.cost.min, 0),
      max: recommendedMeasures.reduce((sum, m) => sum + m.cost.max, 0)
    },
    totalSavings: recommendedMeasures.reduce((sum, m) => sum + m.savingsPerYear, 0)
  };
}

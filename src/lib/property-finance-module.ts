// Property Finance Module - Development Finance, BTL, HMO, SPV (Jan 2026)
// Complex underwriting logic, SDLT, mortgage calculations

export const FINANCE_VERSION = "2026.01";

// Stamp Duty Land Tax Rates (2026)
export const SDLT_RATES = {
  residential: {
    standard: [
      { threshold: 250000, rate: 0 },
      { threshold: 925000, rate: 0.05 },
      { threshold: 1500000, rate: 0.10 },
      { threshold: Infinity, rate: 0.12 },
    ],
    additionalDwelling: [
      { threshold: 250000, rate: 0.05 },
      { threshold: 925000, rate: 0.10 },
      { threshold: 1500000, rate: 0.15 },
      { threshold: Infinity, rate: 0.17 },
    ],
    firstTimeBuyer: [
      { threshold: 425000, rate: 0 },
      { threshold: 625000, rate: 0.05 },
    ],
  },
  commercial: [
    { threshold: 150000, rate: 0 },
    { threshold: 250000, rate: 0.02 },
    { threshold: Infinity, rate: 0.05 },
  ],
};

// Company SDLT (higher rates always apply)
export const COMPANY_SDLT_SURCHARGE = 0.02; // Additional 2% for company purchases over £500k

// Calculate SDLT
export interface SDLTCalculation {
  purchasePrice: number;
  taxable: number;
  standardRate: number;
  additionalDwellingSurcharge: number;
  companySurcharge: number;
  total: number;
  effectiveRate: number;
}

export function calculateSDLT(
  purchasePrice: number,
  options: {
    additionalDwelling?: boolean;
    firstTimeBuyer?: boolean;
    companyPurchase?: boolean;
    commercial?: boolean;
  } = {}
): SDLTCalculation {
  const { additionalDwelling = false, firstTimeBuyer = false, companyPurchase = false, commercial = false } = options;

  let rates: { threshold: number; rate: number }[];
  let standardRate = 0;
  let additionalDwellingSurcharge = 0;
  let companySurcharge = 0;

  if (commercial) {
    rates = SDLT_RATES.commercial;
  } else if (firstTimeBuyer && purchasePrice <= 625000) {
    rates = SDLT_RATES.residential.firstTimeBuyer;
  } else if (additionalDwelling || companyPurchase) {
    rates = SDLT_RATES.residential.additionalDwelling;
  } else {
    rates = SDLT_RATES.residential.standard;
  }

  // Calculate tax in bands
  let remaining = purchasePrice;
  let prevThreshold = 0;
  
  for (const band of rates) {
    if (remaining <= 0) break;
    
    const bandSize = Math.min(remaining, band.threshold - prevThreshold);
    const tax = bandSize * band.rate;
    
    if (additionalDwelling && !commercial) {
      additionalDwellingSurcharge += bandSize * 0.05;
    }
    
    standardRate += tax;
    remaining -= bandSize;
    prevThreshold = band.threshold;
  }

  // Company surcharge (2% on properties over £500k)
  if (companyPurchase && purchasePrice > 500000) {
    companySurcharge = purchasePrice * COMPANY_SDLT_SURCHARGE;
  }

  const total = standardRate + companySurcharge;
  const effectiveRate = (total / purchasePrice) * 100;

  return {
    purchasePrice,
    taxable: purchasePrice,
    standardRate: Math.round(standardRate),
    additionalDwellingSurcharge: 0, // Already included in rates for additional dwelling
    companySurcharge: Math.round(companySurcharge),
    total: Math.round(total),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
  };
}

// Development Finance
export interface DevelopmentFinanceResult {
  purchasePrice: number;
  buildCosts: number;
  totalProjectCost: number;
  gdv: number; // Gross Development Value
  ltc: number; // Loan to Cost ratio
  ltgdv: number; // Loan to GDV ratio
  maxLoan: number;
  equity: number;
  interestRate: number;
  termMonths: number;
  rolledInterest: number;
  totalFacility: number;
  exitValue: number;
  profitBeforeFinance: number;
  profitAfterFinance: number;
  profitOnCost: number;
  profitOnGDV: number;
  viable: boolean;
  notes: string[];
}

export function calculateDevelopmentFinance(params: {
  purchasePrice: number;
  buildCosts: number;
  gdv: number;
  termMonths?: number;
  maxLTC?: number;
  maxLTGDV?: number;
  interestRate?: number;
}): DevelopmentFinanceResult {
  const {
    purchasePrice,
    buildCosts,
    gdv,
    termMonths = 18,
    maxLTC = 0.75,
    maxLTGDV = 0.65,
    interestRate = 0.12,
  } = params;

  const totalProjectCost = purchasePrice + buildCosts;
  const notes: string[] = [];

  // Calculate max loan based on LTC and LTGDV
  const maxByLTC = totalProjectCost * maxLTC;
  const maxByLTGDV = gdv * maxLTGDV;
  const maxLoan = Math.min(maxByLTC, maxByLTGDV);

  const equity = totalProjectCost - maxLoan;
  const ltc = maxLoan / totalProjectCost;
  const ltgdv = maxLoan / gdv;

  // Calculate rolled interest (compound monthly)
  const monthlyRate = interestRate / 12;
  const avgDrawdown = maxLoan * 0.6; // Assume 60% average drawdown
  const rolledInterest = avgDrawdown * (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalFacility = maxLoan + rolledInterest;

  // Profit calculations
  const exitValue = gdv;
  const profitBeforeFinance = gdv - totalProjectCost;
  const profitAfterFinance = gdv - totalProjectCost - rolledInterest;
  const profitOnCost = (profitAfterFinance / totalProjectCost) * 100;
  const profitOnGDV = (profitAfterFinance / gdv) * 100;

  // Viability check (min 20% profit on cost)
  const viable = profitOnCost >= 20;

  if (!viable) {
    notes.push("Project may not be viable - profit on cost below 20%");
  }
  if (ltgdv > 0.65) {
    notes.push("LTGDV exceeds typical 65% threshold - may require additional security");
  }
  if (equity < totalProjectCost * 0.25) {
    notes.push("Equity below 25% - lender may require additional deposit");
  }

  return {
    purchasePrice,
    buildCosts,
    totalProjectCost,
    gdv,
    ltc: Math.round(ltc * 1000) / 10,
    ltgdv: Math.round(ltgdv * 1000) / 10,
    maxLoan: Math.round(maxLoan),
    equity: Math.round(equity),
    interestRate,
    termMonths,
    rolledInterest: Math.round(rolledInterest),
    totalFacility: Math.round(totalFacility),
    exitValue,
    profitBeforeFinance: Math.round(profitBeforeFinance),
    profitAfterFinance: Math.round(profitAfterFinance),
    profitOnCost: Math.round(profitOnCost * 10) / 10,
    profitOnGDV: Math.round(profitOnGDV * 10) / 10,
    viable,
    notes,
  };
}

// BTL Mortgage Calculator
export interface BTLMortgageResult {
  propertyValue: number;
  purchasePrice: number;
  ltv: number;
  mortgageAmount: number;
  monthlyRent: number;
  annualRent: number;
  stressTestRate: number;
  icr: number; // Interest Coverage Ratio
  requiredRent: number;
  maxLoan: number;
  monthlyPayment: number;
  annualYield: number;
  cashflow: number;
  meetsStressTest: boolean;
  portfolioLandlord: boolean;
  notes: string[];
}

export function calculateBTLMortgage(params: {
  propertyValue: number;
  purchasePrice?: number;
  monthlyRent: number;
  ltv?: number;
  interestRate?: number;
  stressTestRate?: number;
  icrRequired?: number;
  portfolioLandlord?: boolean;
}): BTLMortgageResult {
  const {
    propertyValue,
    purchasePrice = propertyValue,
    monthlyRent,
    ltv = 0.75,
    interestRate = 0.055,
    stressTestRate = 0.075,
    icrRequired = 1.45,
    portfolioLandlord = false,
  } = params;

  const notes: string[] = [];
  const annualRent = monthlyRent * 12;
  const annualYield = (annualRent / purchasePrice) * 100;

  // Calculate mortgage amount
  let mortgageAmount = propertyValue * ltv;

  // Stress test calculation
  // ICR = Annual Rent / (Mortgage × Stress Rate)
  const monthlyStressPayment = (mortgageAmount * stressTestRate) / 12;
  const annualStressPayment = mortgageAmount * stressTestRate;
  const icr = annualRent / annualStressPayment;

  // Calculate max loan based on ICR
  const maxLoan = annualRent / (stressTestRate * icrRequired);
  
  // Adjust mortgage if doesn't meet stress test
  if (mortgageAmount > maxLoan) {
    mortgageAmount = maxLoan;
    notes.push(`Mortgage reduced to £${Math.round(maxLoan).toLocaleString()} to meet stress test`);
  }

  const meetsStressTest = icr >= icrRequired;

  // Required rent to meet stress test at requested LTV
  const requiredRent = (propertyValue * ltv * stressTestRate * icrRequired) / 12;

  // Monthly payment
  const monthlyPayment = (mortgageAmount * interestRate) / 12;
  
  // Cashflow
  const cashflow = monthlyRent - monthlyPayment;

  // Portfolio landlord rules (4+ properties)
  if (portfolioLandlord) {
    notes.push("Portfolio landlord rules apply - full portfolio assessment required");
  }

  if (!meetsStressTest) {
    notes.push(`ICR ${icr.toFixed(2)} below ${icrRequired} threshold`);
  }

  return {
    propertyValue,
    purchasePrice,
    ltv: Math.round((mortgageAmount / propertyValue) * 1000) / 10,
    mortgageAmount: Math.round(mortgageAmount),
    monthlyRent,
    annualRent,
    stressTestRate,
    icr: Math.round(icr * 100) / 100,
    requiredRent: Math.round(requiredRent),
    maxLoan: Math.round(maxLoan),
    monthlyPayment: Math.round(monthlyPayment),
    annualYield: Math.round(annualYield * 10) / 10,
    cashflow: Math.round(cashflow),
    meetsStressTest,
    portfolioLandlord,
    notes,
  };
}

// HMO Finance Calculator
export interface HMORoomYield {
  roomCount: number;
  avgRoomRent: number;
  totalMonthlyRent: number;
  totalAnnualRent: number;
  grossYield: number;
  voids: number;
  netRent: number;
  managementCost: number;
  utilities: number;
  maintenance: number;
  netOperatingIncome: number;
  netYield: number;
}

export function calculateHMOYield(params: {
  propertyValue: number;
  roomCount: number;
  avgRoomRent: number;
  voidRate?: number;
  managementRate?: number;
  utilitiesPerRoom?: number;
  maintenanceRate?: number;
}): HMORoomYield {
  const {
    propertyValue,
    roomCount,
    avgRoomRent,
    voidRate = 0.05,
    managementRate = 0.12,
    utilitiesPerRoom = 150,
    maintenanceRate = 0.05,
  } = params;

  const totalMonthlyRent = roomCount * avgRoomRent;
  const totalAnnualRent = totalMonthlyRent * 12;
  const grossYield = (totalAnnualRent / propertyValue) * 100;

  const voids = totalAnnualRent * voidRate;
  const netRent = totalAnnualRent - voids;

  const managementCost = netRent * managementRate;
  const utilities = utilitiesPerRoom * roomCount * 12;
  const maintenance = propertyValue * maintenanceRate;

  const netOperatingIncome = netRent - managementCost - utilities - maintenance;
  const netYield = (netOperatingIncome / propertyValue) * 100;

  return {
    roomCount,
    avgRoomRent,
    totalMonthlyRent: Math.round(totalMonthlyRent),
    totalAnnualRent: Math.round(totalAnnualRent),
    grossYield: Math.round(grossYield * 10) / 10,
    voids: Math.round(voids),
    netRent: Math.round(netRent),
    managementCost: Math.round(managementCost),
    utilities: Math.round(utilities),
    maintenance: Math.round(maintenance),
    netOperatingIncome: Math.round(netOperatingIncome),
    netYield: Math.round(netYield * 10) / 10,
  };
}

// SPV Corporation Tax & Dividend
export interface SPVTaxCalculation {
  grossRent: number;
  mortgageInterest: number;
  allowableExpenses: number;
  taxableProfit: number;
  corporationTax: number;
  profitAfterTax: number;
  dividendGross: number;
  dividendTax: number;
  netDividend: number;
  effectiveTaxRate: number;
  retainedProfitOption: {
    retained: number;
    dividendSmall: number;
    dividendTax: number;
    netReceived: number;
  };
}

export function calculateSPVTax(params: {
  grossRent: number;
  mortgageInterest: number;
  allowableExpenses: number;
  dividendRate?: "basic" | "higher" | "additional";
  retainedPercent?: number;
}): SPVTaxCalculation {
  const {
    grossRent,
    mortgageInterest,
    allowableExpenses,
    dividendRate = "higher",
    retainedPercent = 0,
  } = params;

  // Corporation tax rate (25% for 2026)
  const corpTaxRate = 0.25;
  
  // Dividend tax rates
  const dividendRates = {
    basic: 0.0875, // 8.75%
    higher: 0.3375, // 33.75%
    additional: 0.3935, // 39.35%
  };

  // Full interest relief in SPV
  const taxableProfit = grossRent - mortgageInterest - allowableExpenses;
  const corporationTax = Math.max(0, taxableProfit * corpTaxRate);
  const profitAfterTax = taxableProfit - corporationTax;

  // Full extraction as dividend
  const dividendGross = profitAfterTax;
  const dividendTax = dividendGross * dividendRates[dividendRate];
  const netDividend = dividendGross - dividendTax;

  // Effective tax rate
  const totalTax = corporationTax + dividendTax;
  const effectiveTaxRate = (totalTax / taxableProfit) * 100;

  // Retained profit strategy
  const retained = profitAfterTax * (retainedPercent / 100);
  const dividendSmall = profitAfterTax - retained;
  const dividendTaxSmall = dividendSmall * dividendRates[dividendRate];

  return {
    grossRent,
    mortgageInterest,
    allowableExpenses,
    taxableProfit: Math.round(taxableProfit),
    corporationTax: Math.round(corporationTax),
    profitAfterTax: Math.round(profitAfterTax),
    dividendGross: Math.round(dividendGross),
    dividendTax: Math.round(dividendTax),
    netDividend: Math.round(netDividend),
    effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
    retainedProfitOption: {
      retained: Math.round(retained),
      dividendSmall: Math.round(dividendSmall),
      dividendTax: Math.round(dividendTaxSmall),
      netReceived: Math.round(dividendSmall - dividendTaxSmall),
    },
  };
}

// SIC Code Enforcement
export const SIC_CODES = {
  "68100": { name: "Buying and selling own real estate", mortgageRisk: "standard" },
  "68201": { name: "Renting and operating own or leased real estate (excl. HMO)", mortgageRisk: "standard" },
  "68209": { name: "Other letting of own property", mortgageRisk: "higher" },
  "68310": { name: "Real estate agencies", mortgageRisk: "higher" },
  "68320": { name: "Management of real estate on fee/contract", mortgageRisk: "higher" },
  "55201": { name: "Holiday centres & villages", mortgageRisk: "specialist" },
  "55209": { name: "Other holiday/short-stay accommodation", mortgageRisk: "specialist" },
} as const;

export function validateSICCode(sicCode: string): {
  valid: boolean;
  name: string;
  mortgageRisk: string;
  notes: string[];
} {
  const code = SIC_CODES[sicCode as keyof typeof SIC_CODES];
  const notes: string[] = [];

  if (!code) {
    return {
      valid: false,
      name: "Unknown",
      mortgageRisk: "restricted",
      notes: ["SIC code not recognised - may restrict mortgage options"],
    };
  }

  if (code.mortgageRisk === "higher") {
    notes.push("Higher risk SIC code - may face stricter underwriting");
  }
  if (code.mortgageRisk === "specialist") {
    notes.push("Specialist lender required - limited mortgage options");
  }

  return {
    valid: true,
    name: code.name,
    mortgageRisk: code.mortgageRisk,
    notes,
  };
}

// Legal Fees Calculator
export interface LegalFeesEstimate {
  purchasePrice: number;
  conveyancing: number;
  searches: number;
  landRegistry: number;
  bankTransfer: number;
  stampDuty: number;
  total: number;
}

export function calculateLegalFees(
  purchasePrice: number,
  options: {
    leasehold?: boolean;
    newBuild?: boolean;
    additionalDwelling?: boolean;
    companyPurchase?: boolean;
  } = {}
): LegalFeesEstimate {
  const { leasehold = false, newBuild = false, additionalDwelling = false, companyPurchase = false } = options;

  // Base conveyancing (varies by price)
  let conveyancing = 1200;
  if (purchasePrice > 500000) conveyancing = 1500;
  if (purchasePrice > 1000000) conveyancing = 2000;
  if (leasehold) conveyancing += 300;
  if (newBuild) conveyancing += 200;
  if (companyPurchase) conveyancing += 400;

  // Searches
  const searches = 350;

  // Land Registry (scale fee)
  let landRegistry = 150;
  if (purchasePrice > 200000) landRegistry = 295;
  if (purchasePrice > 500000) landRegistry = 495;
  if (purchasePrice > 1000000) landRegistry = 910;

  // Bank transfer fees
  const bankTransfer = 45;

  // SDLT
  const sdlt = calculateSDLT(purchasePrice, { additionalDwelling, companyPurchase });

  return {
    purchasePrice,
    conveyancing,
    searches,
    landRegistry,
    bankTransfer,
    stampDuty: sdlt.total,
    total: conveyancing + searches + landRegistry + bankTransfer + sdlt.total,
  };
}

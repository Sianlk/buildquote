// Tenancy & Legal Module Data - Document Templates & Compliance

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  requiredFields: string[];
  legalReferences: string[];
}

// Renters Reform Act 2024 compliant templates
export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'ast_agreement',
    name: 'Assured Shorthold Tenancy Agreement',
    category: 'tenancy',
    description: 'Standard AST compliant with Renters Reform Act 2024 and Housing Act 1988',
    requiredFields: ['landlordName', 'landlordAddress', 'tenantName', 'propertyAddress', 'rent', 'depositAmount', 'startDate'],
    legalReferences: ['Housing Act 1988', 'Renters Reform Act 2024', 'Tenant Fees Act 2019']
  },
  {
    id: 'section_21',
    name: 'Section 21 Notice (Form 6A)',
    category: 'notice',
    description: 'No-fault eviction notice - IMPORTANT: Being phased out under Renters Reform Act',
    requiredFields: ['landlordName', 'tenantName', 'propertyAddress', 'dateServed'],
    legalReferences: ['Housing Act 1988 s21', 'Deregulation Act 2015']
  },
  {
    id: 'section_8',
    name: 'Section 8 Notice',
    category: 'notice',
    description: 'Notice seeking possession on statutory grounds',
    requiredFields: ['landlordName', 'tenantName', 'propertyAddress', 'grounds', 'dateServed'],
    legalReferences: ['Housing Act 1988 s8', 'Schedule 2 Grounds']
  },
  {
    id: 'inventory',
    name: 'Property Inventory & Condition Report',
    category: 'inventory',
    description: 'Detailed inventory with photographic evidence',
    requiredFields: ['propertyAddress', 'rooms', 'items', 'condition'],
    legalReferences: ['Tenant Fees Act 2019']
  },
  {
    id: 'deposit_prescribed',
    name: 'Deposit Protection Certificate',
    category: 'deposit',
    description: 'Prescribed information for deposit protection',
    requiredFields: ['depositAmount', 'scheme', 'landlordDetails', 'tenantDetails'],
    legalReferences: ['Housing Act 2004', 'Tenancy Deposit Schemes']
  },
  {
    id: 'gas_safety',
    name: 'Gas Safety Record',
    category: 'safety',
    description: 'Annual gas safety certificate requirement',
    requiredFields: ['engineerName', 'gasafeNumber', 'applianceDetails', 'results'],
    legalReferences: ['Gas Safety Regulations 1998']
  },
  {
    id: 'eicr',
    name: 'Electrical Installation Condition Report',
    category: 'safety',
    description: '5-yearly electrical safety certification',
    requiredFields: ['electricianName', 'registrationNumber', 'installationDetails', 'results'],
    legalReferences: ['Electrical Safety Standards Regulations 2020']
  },
  {
    id: 'epc',
    name: 'Energy Performance Certificate',
    category: 'safety',
    description: 'Valid EPC with minimum rating E',
    requiredFields: ['assessorName', 'rating', 'recommendations'],
    legalReferences: ['MEES Regulations 2015', 'Energy Efficiency Regulations']
  },
  {
    id: 'how_to_rent',
    name: 'How to Rent Checklist',
    category: 'checklist',
    description: 'Government checklist for tenants',
    requiredFields: ['dateProvided', 'tenantAcknowledgement'],
    legalReferences: ['Deregulation Act 2015']
  },
  {
    id: 'right_to_rent',
    name: 'Right to Rent Check',
    category: 'checklist',
    description: 'Immigration status verification',
    requiredFields: ['tenantName', 'documentType', 'checkDate', 'validUntil'],
    legalReferences: ['Immigration Act 2014']
  },
  {
    id: 'rent_increase',
    name: 'Section 13 Rent Increase Notice',
    category: 'notice',
    description: 'Formal notice for rent increase',
    requiredFields: ['currentRent', 'proposedRent', 'effectiveDate', 'tenantName'],
    legalReferences: ['Housing Act 1988 s13']
  },
  {
    id: 'licence_occupy',
    name: 'Licence to Occupy',
    category: 'tenancy',
    description: 'Non-exclusive occupation agreement for lodgers',
    requiredFields: ['licensorName', 'licenseeName', 'room', 'fee'],
    legalReferences: ['Common Law']
  },
];

// Section 8 grounds for possession
export const SECTION_8_GROUNDS = {
  mandatory: [
    { ground: 1, description: 'Owner-occupier: Landlord previously occupied or intends to occupy', notice: '2 months' },
    { ground: 2, description: 'Mortgagee requiring possession', notice: '2 months' },
    { ground: 3, description: 'Out of season holiday let', notice: '2 weeks' },
    { ground: 4, description: 'Student accommodation', notice: '2 weeks' },
    { ground: 5, description: 'Minister of religion accommodation', notice: '2 months' },
    { ground: 6, description: 'Demolition or substantial works', notice: '2 months' },
    { ground: 7, description: 'Death of periodic tenant', notice: '2 months' },
    { ground: '7A', description: 'Conviction for serious offence', notice: '1 month' },
    { ground: '7B', description: 'Breach of immigration rules', notice: '2 weeks' },
    { ground: 8, description: 'At least 2 months\' rent arrears', notice: '2 weeks' },
  ],
  discretionary: [
    { ground: 9, description: 'Suitable alternative accommodation available', notice: '2 months' },
    { ground: 10, description: 'Some rent arrears', notice: '2 weeks' },
    { ground: 11, description: 'Persistent delay in paying rent', notice: '2 weeks' },
    { ground: 12, description: 'Breach of tenancy obligation', notice: '2 weeks' },
    { ground: 13, description: 'Deterioration of property', notice: '2 weeks' },
    { ground: 14, description: 'Nuisance/antisocial behaviour', notice: 'Immediately' },
    { ground: '14A', description: 'Domestic violence', notice: '2 weeks' },
    { ground: 15, description: 'Deterioration of furniture', notice: '2 weeks' },
    { ground: 16, description: 'Former employee tenant', notice: '2 months' },
    { ground: 17, description: 'False statement induced grant', notice: '2 weeks' },
  ]
};

// Landlord compliance checklist
export const LANDLORD_COMPLIANCE_CHECKLIST = [
  {
    category: 'Before Letting',
    items: [
      { id: 'epc', name: 'Valid EPC (Rating E or above)', required: true, frequency: '10 years' },
      { id: 'gas_safety', name: 'Gas Safety Certificate', required: true, frequency: 'Annual' },
      { id: 'eicr', name: 'EICR Certificate', required: true, frequency: '5 years' },
      { id: 'smoke_alarms', name: 'Smoke alarms on every floor', required: true, frequency: 'Check at tenancy start' },
      { id: 'co_alarms', name: 'CO alarms where solid fuel', required: true, frequency: 'Check at tenancy start' },
      { id: 'deposit_protection', name: 'Deposit protected within 30 days', required: true, frequency: 'Per tenancy' },
      { id: 'right_to_rent', name: 'Right to Rent check completed', required: true, frequency: 'Per tenant' },
      { id: 'how_to_rent', name: 'How to Rent guide provided', required: true, frequency: 'Per tenancy' },
    ]
  },
  {
    category: 'During Tenancy',
    items: [
      { id: 'repairs', name: 'Respond to repair requests promptly', required: true, frequency: 'Ongoing' },
      { id: 'inspection', name: 'Property inspections (with notice)', required: false, frequency: 'Quarterly recommended' },
      { id: 'gas_annual', name: 'Annual gas safety check', required: true, frequency: 'Annual' },
      { id: 'insurance', name: 'Landlord insurance maintained', required: false, frequency: 'Annual' },
      { id: 'rent_records', name: 'Maintain rent payment records', required: true, frequency: 'Ongoing' },
      { id: 'licensing', name: 'Property license (if required)', required: 'Where applicable', frequency: '5 years' },
    ]
  },
  {
    category: 'End of Tenancy',
    items: [
      { id: 'notice', name: 'Serve correct notice period', required: true, frequency: 'Per tenancy end' },
      { id: 'checkout', name: 'Conduct checkout inspection', required: true, frequency: 'Per tenancy end' },
      { id: 'deposit_return', name: 'Return deposit within 10 days', required: true, frequency: 'Per tenancy end' },
      { id: 'meter_readings', name: 'Final meter readings taken', required: true, frequency: 'Per tenancy end' },
    ]
  }
];

// HMO requirements
export const HMO_REQUIREMENTS = {
  mandatory: [
    'Property of 3+ storeys with 5+ tenants forming 2+ households',
    'Minimum bedroom sizes: 6.51m² (1 person), 10.22m² (2 persons)',
    'Adequate kitchen facilities',
    'Adequate bathroom/WC facilities',
    'Fire safety measures and fire doors',
    'Annual gas safety certificate',
    '5-yearly EICR',
    'Written statement of terms',
  ],
  additional: [
    'Display license in property',
    'Maximum occupancy compliance',
    'Provide refuse facilities',
    'Keep common areas clean and in repair',
    'Maintain fire escape routes',
    'Provide fire blankets in kitchens',
  ]
};

// Generate AST agreement template
export function generateASTTemplate(data: {
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  propertyAddress: string;
  rent: number;
  depositAmount: number;
  startDate: string;
  paymentDay: number;
}): string {
  return `
ASSURED SHORTHOLD TENANCY AGREEMENT
Compliant with Housing Act 1988 (as amended) and Renters Reform Act 2024

THIS AGREEMENT is made on ${new Date().toLocaleDateString('en-GB')}

BETWEEN:
LANDLORD: ${data.landlordName}
Address: ${data.landlordAddress}

AND

TENANT: ${data.tenantName}

PROPERTY: ${data.propertyAddress}

1. TERM
This tenancy shall commence on ${new Date(data.startDate).toLocaleDateString('en-GB')} and continue as a periodic tenancy.

2. RENT
The rent is £${data.rent.toFixed(2)} per calendar month, payable in advance on the ${data.paymentDay}${getOrdinalSuffix(data.paymentDay)} day of each month.

3. DEPOSIT
A deposit of £${data.depositAmount.toFixed(2)} has been paid and will be protected in a government-approved scheme within 30 days.

4. TENANT'S OBLIGATIONS
The Tenant agrees to:
- Pay rent on the due date
- Keep the property clean and in good condition
- Not cause nuisance to neighbours
- Not sublet without written permission
- Allow access for inspections with 24 hours' notice
- Report any damage or repairs needed promptly

5. LANDLORD'S OBLIGATIONS
The Landlord agrees to:
- Keep the property in good repair
- Maintain the structure and exterior
- Keep heating and hot water systems in working order
- Comply with all gas and electrical safety requirements
- Protect the deposit in an approved scheme
- Give reasonable notice before inspections

6. TERMINATION
Either party may terminate this agreement by giving at least 2 months' written notice.

SIGNATURES:

Landlord: _________________________ Date: _____________

Tenant: _________________________ Date: _____________

---
DISCLAIMER: This template is provided for guidance only. Professional legal advice should be sought before use.
`;
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// Generate Section 21 notice (Form 6A)
export function generateSection21Notice(data: {
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  propertyAddress: string;
  dateServed: string;
}): string {
  return `
HOUSING ACT 1988 SECTION 21(1) AND (4)
NOTICE REQUIRING POSSESSION OF A PROPERTY LET ON AN ASSURED SHORTHOLD TENANCY

FORM 6A

To: ${data.tenantName}
Of: ${data.propertyAddress}

IMPORTANT: THIS NOTICE MAY BE INVALID IF REQUIREMENTS ARE NOT MET

1. The landlord of the property described below requires possession of it.

2. Property: ${data.propertyAddress}

3. Landlord: ${data.landlordName}
   Address: ${data.landlordAddress}

4. Date after which possession is required: ${addMonths(new Date(data.dateServed), 2).toLocaleDateString('en-GB')}

5. This notice is given under section 21(1)/21(4) of the Housing Act 1988.

Date: ${new Date(data.dateServed).toLocaleDateString('en-GB')}

Signed: _________________________

NOTES FOR TENANTS:
• You do not have to leave your home on the date given above
• You should seek legal advice immediately
• Contact Shelter or Citizens Advice for free help
• The landlord must obtain a court order before you can be evicted

WARNING: This form may not be valid if:
- The deposit was not protected within 30 days
- Required documents were not provided (How to Rent guide, EPC, Gas Safety)
- The property requires a license that has not been obtained
- The notice period is less than 2 months
- You have made a complaint about property conditions

---
DISCLAIMER: Professional legal advice should be sought. Section 21 is being reformed under the Renters Reform Act 2024.
`;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

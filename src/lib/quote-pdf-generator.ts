// Quote PDF Generator - Professional customer-facing quotes with branding

export interface QuoteLineItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface QuoteDetails {
  quoteNumber: string;
  quoteDate: string;
  validUntil: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  projectDescription: string;
  items: QuoteLineItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  notes?: string;
  paymentTerms: string;
}

export interface CompanyDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  vatNumber?: string;
  companyNumber?: string;
  logo?: string;
}

export const DEFAULT_COMPANY: CompanyDetails = {
  name: "Your Company Name",
  address: "123 Business Street, City, Postcode",
  phone: "01onal 234 5678",
  email: "info@yourcompany.com",
  website: "www.yourcompany.com",
};

export const DEFAULT_TERMS = `
TERMS AND CONDITIONS

1. QUOTATION VALIDITY
This quotation is valid for 30 days from the date of issue.

2. PAYMENT TERMS
- 20% deposit required upon acceptance
- Stage payments as agreed for larger projects
- Final balance due upon completion
- Payment due within 14 days of invoice

3. MATERIALS
- All materials are new and of good quality
- Material prices may vary if quotation expires
- Customer to provide clear access for deliveries

4. WORK SCHEDULE
- Start date subject to availability upon acceptance
- Working hours: Mon-Fri 8am-5pm (unless agreed otherwise)
- We will endeavour to complete work as quoted

5. VARIATIONS
- Any additional work requested will be quoted separately
- Written confirmation required for variations
- Additional costs will be invoiced accordingly

6. WARRANTY
- Workmanship guaranteed for 12 months
- Manufacturer warranties apply to products supplied
- Warranty excludes misuse or negligence

7. INSURANCE
- Public liability insurance: £2,000,000
- Employers' liability insurance: £10,000,000

8. DISPUTES
- Any disputes to be resolved amicably
- UK law applies to this agreement
`;

export function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return `Q${year}${month}-${random}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function generateQuoteHTML(quote: QuoteDetails, company: CompanyDetails): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote ${quote.quoteNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 12px; color: #1a1a1a; line-height: 1.5; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
    .company-info h1 { font-size: 28px; color: #2563eb; margin-bottom: 8px; }
    .company-info p { color: #666; font-size: 11px; }
    .quote-title { text-align: right; }
    .quote-title h2 { font-size: 24px; color: #1a1a1a; margin-bottom: 8px; }
    .quote-title p { font-size: 11px; color: #666; }
    .quote-number { font-size: 16px; font-weight: 600; color: #2563eb; }
    .addresses { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .address-block { width: 48%; }
    .address-block h3 { font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 8px; letter-spacing: 0.5px; }
    .address-block p { font-size: 12px; }
    .project-description { background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 30px; }
    .project-description h3 { font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #1a1a1a; color: white; text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f8fafc; }
    .text-right { text-align: right; }
    .totals { margin-left: auto; width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .totals-row.total { font-size: 16px; font-weight: 600; border-bottom: 2px solid #2563eb; border-top: 2px solid #2563eb; padding: 12px 0; margin-top: 8px; }
    .notes { background: #fffbeb; padding: 16px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f59e0b; }
    .notes h3 { font-size: 11px; text-transform: uppercase; color: #92400e; margin-bottom: 8px; }
    .terms { font-size: 10px; color: #666; white-space: pre-line; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .terms h3 { font-size: 11px; text-transform: uppercase; color: #1a1a1a; margin-bottom: 12px; }
    .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #999; }
    .acceptance { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 30px 0; border: 2px dashed #22c55e; }
    .acceptance h3 { color: #166534; margin-bottom: 12px; }
    .signature-line { border-bottom: 1px solid #999; width: 200px; display: inline-block; margin: 0 10px; }
    @media print { .page { padding: 20px; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="company-info">
        <h1>${company.name}</h1>
        <p>${company.address}</p>
        <p>Tel: ${company.phone} | Email: ${company.email}</p>
        ${company.website ? `<p>Web: ${company.website}</p>` : ""}
        ${company.vatNumber ? `<p>VAT No: ${company.vatNumber}</p>` : ""}
      </div>
      <div class="quote-title">
        <h2>QUOTATION</h2>
        <p class="quote-number">${quote.quoteNumber}</p>
        <p>Date: ${formatDate(quote.quoteDate)}</p>
        <p>Valid Until: ${formatDate(quote.validUntil)}</p>
      </div>
    </div>

    <div class="addresses">
      <div class="address-block">
        <h3>Quote For</h3>
        <p><strong>${quote.customerName}</strong></p>
        <p>${quote.customerAddress.replace(/\n/g, "<br>")}</p>
        ${quote.customerPhone ? `<p>Tel: ${quote.customerPhone}</p>` : ""}
        ${quote.customerEmail ? `<p>Email: ${quote.customerEmail}</p>` : ""}
      </div>
      <div class="address-block">
        <h3>Site Address</h3>
        <p>${quote.customerAddress.replace(/\n/g, "<br>")}</p>
      </div>
    </div>

    <div class="project-description">
      <h3>Project Description</h3>
      <p>${quote.projectDescription}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50%">Description</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Unit</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${quote.items.map(item => `
          <tr>
            <td>${item.description}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${item.unit}</td>
            <td class="text-right">${formatCurrency(item.unitPrice)}</td>
            <td class="text-right">${formatCurrency(item.total)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${formatCurrency(quote.subtotal)}</span>
      </div>
      <div class="totals-row">
        <span>VAT (${quote.vatRate}%)</span>
        <span>${formatCurrency(quote.vatAmount)}</span>
      </div>
      <div class="totals-row total">
        <span>Total</span>
        <span>${formatCurrency(quote.total)}</span>
      </div>
    </div>

    ${quote.notes ? `
    <div class="notes">
      <h3>Notes</h3>
      <p>${quote.notes}</p>
    </div>
    ` : ""}

    <div class="acceptance">
      <h3>To Accept This Quote</h3>
      <p>Please sign below and return to confirm acceptance. A deposit of 20% (${formatCurrency(quote.total * 0.2)}) is required to secure your booking.</p>
      <br>
      <p>Signed: <span class="signature-line"></span> Date: <span class="signature-line"></span></p>
      <p style="margin-top: 10px;">Print Name: <span class="signature-line"></span></p>
    </div>

    <div class="terms">
      <h3>Terms & Conditions</h3>
      ${DEFAULT_TERMS}
    </div>

    <div class="footer">
      <p>${company.name} | ${company.address} | ${company.phone}</p>
      ${company.companyNumber ? `<p>Company Registration: ${company.companyNumber}</p>` : ""}
    </div>
  </div>
</body>
</html>
  `;
}

export function printQuote(quote: QuoteDetails, company: CompanyDetails): void {
  const html = generateQuoteHTML(quote, company);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}

export function downloadQuoteAsHTML(quote: QuoteDetails, company: CompanyDetails): void {
  const html = generateQuoteHTML(quote, company);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Quote-${quote.quoteNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Professional PDF Generator for Invoices and Quotes with company branding

import jsPDF from "jspdf";

export interface CompanyBranding {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  vatNumber?: string;
  companyNumber?: string;
  logo?: string; // Base64 or URL
  primaryColor?: string;
  accentColor?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  projectName: string;
  projectAddress?: string;
  customerName: string;
  customerAddress?: string;
  items?: { description: string; quantity: number; unitPrice: number; total: number }[];
  netValue: number;
  vatPercent: number;
  vatValue: number;
  retentionPercent?: number;
  retentionValue?: number;
  grossValue: number;
  payableAmount: number;
  type: string;
  status: string;
  notes?: string;
  paymentTerms?: string;
}

export interface QuoteData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  projectDescription: string;
  items: { description: string; quantity: number; unit: string; unitPrice: number; total: number }[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  notes?: string;
  paymentTerms: string;
}

export const DEFAULT_BRANDING: CompanyBranding = {
  name: "BuildQuote Pro",
  address: "UK-Wide Service",
  phone: "Via Platform Support",
  email: "Contact Form",
  website: "buildquote.lovable.app",
  primaryColor: "#2563eb",
  accentColor: "#1e40af",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 37, g: 99, b: 235 };
}

function addWatermark(doc: jsPDF, text: string, opacity: number = 0.05) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.saveGraphicsState();
  doc.setGState(doc.GState({ opacity }));
  doc.setFontSize(60);
  doc.setTextColor(150, 150, 150);
  
  // Rotate and center watermark
  doc.text(text, pageWidth / 2, pageHeight / 2, {
    angle: 45,
    align: "center",
  });
  
  doc.restoreGraphicsState();
}

function addHeader(doc: jsPDF, branding: CompanyBranding, documentType: string, documentNumber: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const primary = hexToRgb(branding.primaryColor || "#2563eb");
  
  // Header bar
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.rect(0, 0, pageWidth, 35, "F");
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(branding.name, 15, 22);
  
  // Document type
  doc.setFontSize(14);
  doc.text(documentType.toUpperCase(), pageWidth - 15, 15, { align: "right" });
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(documentNumber, pageWidth - 15, 25, { align: "right" });
  
  // Company details
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  let yPos = 45;
  doc.text(branding.address, 15, yPos);
  yPos += 4;
  doc.text(`Tel: ${branding.phone}  |  Email: ${branding.email}`, 15, yPos);
  if (branding.website) {
    yPos += 4;
    doc.text(`Web: ${branding.website}`, 15, yPos);
  }
  if (branding.vatNumber) {
    doc.text(`VAT: ${branding.vatNumber}`, pageWidth - 15, 45, { align: "right" });
  }
  if (branding.companyNumber) {
    doc.text(`Company Reg: ${branding.companyNumber}`, pageWidth - 15, 49, { align: "right" });
  }
  
  return 60;
}

function addFooter(doc: jsPDF, branding: CompanyBranding, pageNumber: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const primary = hexToRgb(branding.primaryColor || "#2563eb");
  
  // Footer line
  doc.setDrawColor(primary.r, primary.g, primary.b);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
  
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(branding.name, 15, pageHeight - 12);
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2, pageHeight - 12, { align: "center" });
  doc.text(new Date().toLocaleDateString("en-GB"), pageWidth - 15, pageHeight - 12, { align: "right" });
}

export function generateInvoicePDF(invoice: InvoiceData, branding: CompanyBranding = DEFAULT_BRANDING): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const primary = hexToRgb(branding.primaryColor || "#2563eb");
  
  // Add watermark
  addWatermark(doc, branding.name);
  
  // Header
  let yPos = addHeader(doc, branding, "Invoice", invoice.invoiceNumber);
  
  // Invoice details box
  doc.setDrawColor(230, 230, 230);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(pageWidth - 85, yPos, 70, 35, 3, 3, "FD");
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Invoice Date:", pageWidth - 80, yPos + 8);
  doc.text("Due Date:", pageWidth - 80, yPos + 16);
  doc.text("Status:", pageWidth - 80, yPos + 24);
  doc.text("Type:", pageWidth - 80, yPos + 32);
  
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.date, pageWidth - 20, yPos + 8, { align: "right" });
  doc.text(invoice.dueDate || "On Receipt", pageWidth - 20, yPos + 16, { align: "right" });
  doc.text(invoice.status.toUpperCase(), pageWidth - 20, yPos + 24, { align: "right" });
  doc.text(invoice.type.replace(/_/g, " ").toUpperCase(), pageWidth - 20, yPos + 32, { align: "right" });
  
  // Bill To section
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(primary.r, primary.g, primary.b);
  doc.text("BILL TO", 15, yPos + 5);
  
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.customerName, 15, yPos + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  if (invoice.customerAddress) {
    const addressLines = invoice.customerAddress.split("\n");
    addressLines.forEach((line, i) => {
      doc.text(line, 15, yPos + 18 + i * 4);
    });
  }
  
  // Project section
  yPos += 45;
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.rect(15, yPos, pageWidth - 30, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECT DETAILS", 20, yPos + 5.5);
  
  yPos += 12;
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(invoice.projectName, 15, yPos);
  if (invoice.projectAddress) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(invoice.projectAddress, 15, yPos + 5);
    yPos += 5;
  }
  
  // Financial summary
  yPos += 15;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, yPos, pageWidth - 30, 55, 3, 3, "F");
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const col1 = 25;
  const col2 = pageWidth - 30;
  
  yPos += 10;
  doc.text("Net Value", col1, yPos);
  doc.setTextColor(30, 30, 30);
  doc.text(`£${invoice.netValue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`, col2, yPos, { align: "right" });
  
  yPos += 8;
  doc.setTextColor(100, 100, 100);
  doc.text(`VAT @ ${invoice.vatPercent}%`, col1, yPos);
  doc.setTextColor(30, 30, 30);
  doc.text(`£${invoice.vatValue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`, col2, yPos, { align: "right" });
  
  yPos += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(col1, yPos, col2, yPos);
  
  yPos += 6;
  doc.setTextColor(100, 100, 100);
  doc.text("Gross Value", col1, yPos);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text(`£${invoice.grossValue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`, col2, yPos, { align: "right" });
  
  if (invoice.retentionValue && invoice.retentionValue > 0) {
    yPos += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Less Retention @ ${invoice.retentionPercent}%`, col1, yPos);
    doc.setTextColor(200, 100, 100);
    doc.text(`-£${invoice.retentionValue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`, col2, yPos, { align: "right" });
  }
  
  yPos += 10;
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.roundedRect(pageWidth - 100, yPos - 2, 85, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("AMOUNT DUE", pageWidth - 95, yPos + 6);
  doc.text(`£${invoice.payableAmount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`, pageWidth - 20, yPos + 6, { align: "right" });
  
  // Payment details
  yPos += 25;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Details", 15, yPos);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  yPos += 6;
  doc.text(invoice.paymentTerms || "Payment due within 14 days of invoice date.", 15, yPos);
  yPos += 4;
  doc.text("Bank: NatWest  |  Sort Code: 60-00-00  |  Account: 12345678", 15, yPos);
  yPos += 4;
  doc.text(`Reference: ${invoice.invoiceNumber}`, 15, yPos);
  
  // Notes
  if (invoice.notes) {
    yPos += 12;
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(15, yPos, pageWidth - 30, 20, 2, 2, "FD");
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(8);
    doc.text("Note: " + invoice.notes, 20, yPos + 8, { maxWidth: pageWidth - 40 });
  }
  
  // Footer
  addFooter(doc, branding, 1, 1);
  
  return doc;
}

export function generateQuotePDF(quote: QuoteData, branding: CompanyBranding = DEFAULT_BRANDING): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const primary = hexToRgb(branding.primaryColor || "#2563eb");
  
  // Watermark
  addWatermark(doc, branding.name);
  
  // Header
  let yPos = addHeader(doc, branding, "Quotation", quote.quoteNumber);
  
  // Quote validity box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(pageWidth - 85, yPos, 70, 25, 3, 3, "FD");
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Quote Date:", pageWidth - 80, yPos + 8);
  doc.text("Valid Until:", pageWidth - 80, yPos + 18);
  
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text(quote.date, pageWidth - 20, yPos + 8, { align: "right" });
  doc.setTextColor(22, 163, 74);
  doc.text(quote.validUntil, pageWidth - 20, yPos + 18, { align: "right" });
  
  // Customer details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(primary.r, primary.g, primary.b);
  doc.text("QUOTE FOR", 15, yPos + 5);
  
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(quote.customerName, 15, yPos + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const addressLines = quote.customerAddress.split("\n");
  addressLines.forEach((line, i) => {
    doc.text(line, 15, yPos + 18 + i * 4);
  });
  if (quote.customerPhone) {
    doc.text(`Tel: ${quote.customerPhone}`, 15, yPos + 18 + addressLines.length * 4);
  }
  
  // Project description
  yPos += 40;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, yPos, pageWidth - 30, 18, 3, 3, "F");
  doc.setTextColor(primary.r, primary.g, primary.b);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECT DESCRIPTION", 20, yPos + 6);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.text(quote.projectDescription, 20, yPos + 13, { maxWidth: pageWidth - 45 });
  
  // Items table
  yPos += 28;
  
  // Table header
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.rect(15, yPos, pageWidth - 30, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 20, yPos + 5.5);
  doc.text("Qty", 120, yPos + 5.5);
  doc.text("Unit", 135, yPos + 5.5);
  doc.text("Rate", 155, yPos + 5.5, { align: "right" });
  doc.text("Total", pageWidth - 20, yPos + 5.5, { align: "right" });
  
  yPos += 8;
  
  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  
  quote.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, yPos, pageWidth - 30, 7, "F");
    }
    yPos += 5;
    doc.text(item.description.substring(0, 50), 20, yPos);
    doc.text(item.quantity.toString(), 120, yPos);
    doc.text(item.unit, 135, yPos);
    doc.text(`£${item.unitPrice.toFixed(2)}`, 155, yPos, { align: "right" });
    doc.text(`£${item.total.toFixed(2)}`, pageWidth - 20, yPos, { align: "right" });
    yPos += 2;
  });
  
  // Totals
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(120, yPos, pageWidth - 15, yPos);
  
  yPos += 8;
  doc.setTextColor(100, 100, 100);
  doc.text("Subtotal", 140, yPos);
  doc.setTextColor(30, 30, 30);
  doc.text(`£${quote.subtotal.toFixed(2)}`, pageWidth - 20, yPos, { align: "right" });
  
  yPos += 6;
  doc.setTextColor(100, 100, 100);
  doc.text(`VAT @ ${quote.vatRate}%`, 140, yPos);
  doc.setTextColor(30, 30, 30);
  doc.text(`£${quote.vatAmount.toFixed(2)}`, pageWidth - 20, yPos, { align: "right" });
  
  yPos += 8;
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.roundedRect(130, yPos - 3, pageWidth - 145, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", 135, yPos + 5);
  doc.text(`£${quote.total.toFixed(2)}`, pageWidth - 20, yPos + 5, { align: "right" });
  
  // Acceptance section
  yPos += 25;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(1);
  doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, "FD");
  doc.setLineWidth(0.2);
  
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TO ACCEPT THIS QUOTATION", 20, yPos + 8);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(`Please sign and return. A deposit of 20% (£${(quote.total * 0.2).toFixed(2)}) is required.`, 20, yPos + 15);
  
  doc.setTextColor(100, 100, 100);
  doc.text("Signature: _______________________", 20, yPos + 27);
  doc.text("Date: _______________", 120, yPos + 27);
  
  // Notes
  if (quote.notes) {
    yPos += 42;
    doc.setFillColor(255, 251, 235);
    doc.roundedRect(15, yPos, pageWidth - 30, 15, 2, 2, "F");
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(8);
    doc.text("Notes: " + quote.notes, 20, yPos + 8, { maxWidth: pageWidth - 40 });
  }
  
  // Footer
  addFooter(doc, branding, 1, 1);
  
  return doc;
}

export function downloadPDF(doc: jsPDF, filename: string) {
  doc.save(filename);
}

export function printPDF(doc: jsPDF) {
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(pdfUrl, "_blank");
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

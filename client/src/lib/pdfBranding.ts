import { jsPDF } from 'jspdf';

export interface BrandingConfig {
  companyName?: string | null;
  whitelabelBrandingActive?: boolean | null;
  brandingLogoUrl?: string | null;
  brandingColors?: string[] | null;
}

export interface BrandingResult {
  headerHeight: number;
  contentStartY: number;
  primaryColor: { r: number; g: number; b: number };
  secondaryColor: { r: number; g: number; b: number };
  accentColor: { r: number; g: number; b: number };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

function darkenColor(color: { r: number; g: number; b: number }, factor: number = 0.2): { r: number; g: number; b: number } {
  return {
    r: Math.max(0, Math.round(color.r * (1 - factor))),
    g: Math.max(0, Math.round(color.g * (1 - factor))),
    b: Math.max(0, Math.round(color.b * (1 - factor)))
  };
}

function lightenColor(color: { r: number; g: number; b: number }, factor: number = 0.3): { r: number; g: number; b: number } {
  return {
    r: Math.min(255, Math.round(color.r + (255 - color.r) * factor)),
    g: Math.min(255, Math.round(color.g + (255 - color.g) * factor)),
    b: Math.min(255, Math.round(color.b + (255 - color.b) * factor))
  };
}

const DEFAULT_PRIMARY = { r: 23, g: 37, b: 84 }; // Dark blue fallback
const DEFAULT_SECONDARY = { r: 59, g: 130, b: 246 }; // Blue fallback
const DEFAULT_ACCENT = { r: 147, g: 197, b: 253 }; // Light blue fallback

export function getBrandColors(brandingColors?: string[] | null): {
  primaryColor: { r: number; g: number; b: number };
  secondaryColor: { r: number; g: number; b: number };
  accentColor: { r: number; g: number; b: number };
} {
  if (!brandingColors || brandingColors.length === 0) {
    return {
      primaryColor: DEFAULT_PRIMARY,
      secondaryColor: DEFAULT_SECONDARY,
      accentColor: DEFAULT_ACCENT
    };
  }

  const primaryColor = hexToRgb(brandingColors[0]);
  const secondaryColor = brandingColors.length > 1 
    ? hexToRgb(brandingColors[1]) 
    : lightenColor(primaryColor, 0.5);
  const accentColor = brandingColors.length > 2 
    ? hexToRgb(brandingColors[2]) 
    : darkenColor(primaryColor, 0.3);

  return { primaryColor, secondaryColor, accentColor };
}

export async function loadLogoAsBase64(logoUrl: string): Promise<string | null> {
  try {
    const fullUrl = logoUrl.startsWith('http') ? logoUrl : `${window.location.origin}${logoUrl}`;
    const response = await fetch(fullUrl);
    if (!response.ok) return null;
    
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function addProfessionalHeader(
  doc: jsPDF,
  title: string,
  subtitle: string,
  branding: BrandingConfig
): Promise<BrandingResult> {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  
  const { primaryColor, secondaryColor, accentColor } = getBrandColors(branding.brandingColors);
  const showBranding = branding.whitelabelBrandingActive && branding.companyName;
  
  let headerHeight = 45;
  let logoLoaded = false;
  let logoBase64: string | null = null;

  if (showBranding && branding.brandingLogoUrl) {
    logoBase64 = await loadLogoAsBase64(branding.brandingLogoUrl);
    if (logoBase64) {
      logoLoaded = true;
      headerHeight = 55;
    }
  }

  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  doc.setFillColor(accentColor.r, accentColor.g, accentColor.b);
  doc.rect(0, headerHeight, pageWidth, 3, 'F');

  if (showBranding) {
    if (logoLoaded && logoBase64) {
      try {
        const logoHeight = 20;
        const logoWidth = 40;
        doc.addImage(logoBase64, 'PNG', margin, 8, logoWidth, logoHeight);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(branding.companyName!.toUpperCase(), margin + logoWidth + 8, 18);
        
        doc.setFontSize(18);
        doc.text(title, pageWidth / 2, 38, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(subtitle, pageWidth / 2, 48, { align: 'center' });
      } catch {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(branding.companyName!.toUpperCase(), pageWidth / 2, 10, { align: 'center' });
        
        doc.setFontSize(18);
        doc.text(title, pageWidth / 2, 24, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(subtitle, pageWidth / 2, 34, { align: 'center' });
        headerHeight = 45;
      }
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(branding.companyName!.toUpperCase(), pageWidth / 2, 10, { align: 'center' });
      
      doc.setFontSize(18);
      doc.text(title, pageWidth / 2, 24, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, pageWidth / 2, 34, { align: 'center' });
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, pageWidth / 2, 30, { align: 'center' });
    headerHeight = 40;
  }

  return {
    headerHeight: headerHeight + 3,
    contentStartY: headerHeight + 12,
    primaryColor,
    secondaryColor,
    accentColor
  };
}

export function addSectionHeader(
  doc: jsPDF,
  text: string,
  yPosition: number,
  primaryColor: { r: number; g: number; b: number }
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.rect(margin, yPosition, pageWidth - (margin * 2), 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(text.toUpperCase(), margin + 4, yPosition + 5.5);
  
  return yPosition + 12;
}

export function addInfoRow(
  doc: jsPDF,
  label: string,
  value: string,
  yPosition: number,
  margin: number = 15
): number {
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(label, margin, yPosition);
  
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(value || 'N/A', margin + 45, yPosition);
  
  return yPosition + 6;
}

export function addFooter(
  doc: jsPDF,
  branding: BrandingConfig,
  accentColor: { r: number; g: number; b: number }
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  
  doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const footerText = branding.whitelabelBrandingActive && branding.companyName
    ? `${branding.companyName} - Official Document`
    : 'Official Safety Document';
  
  doc.text(footerText, margin, pageHeight - 12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, pageHeight - 12, { align: 'right' });
}

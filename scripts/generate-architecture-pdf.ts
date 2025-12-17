import { jsPDF } from 'jspdf';
import * as fs from 'fs';
import * as path from 'path';

const doc = new jsPDF({
  orientation: 'landscape',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = 297;
const pageHeight = 210;

doc.setFillColor(15, 23, 42);
doc.rect(0, 0, pageWidth, pageHeight, 'F');

doc.setFontSize(22);
doc.setTextColor(96, 165, 250);
doc.text('OnRopePro System Architecture', pageWidth / 2, 18, { align: 'center' });

doc.setFontSize(11);
doc.setTextColor(148, 163, 184);
doc.text('Building Maintenance Management Platform - Entity Relationships', pageWidth / 2, 26, { align: 'center' });

const centerX = pageWidth / 2;
const centerY = 100;

function drawBox(x: number, y: number, w: number, h: number, color: [number, number, number], title: string, items: string[]) {
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(x, y, w, h, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x + w / 2, y + 8, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 220, 220);
  items.forEach((item, i) => {
    doc.text(item, x + w / 2, y + 15 + (i * 5), { align: 'center' });
  });
}

function drawLine(x1: number, y1: number, x2: number, y2: number) {
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(x1, y1, x2, y2);
}

drawBox(centerX - 25, centerY - 15, 50, 35, [59, 130, 246], 'PROJECTS', ['Central Hub', 'Jobs & Assignments', 'Progress Tracking']);

drawLine(centerX, centerY - 15, centerX - 60, 55);
drawBox(centerX - 90, 40, 60, 30, [236, 72, 153], 'CLIENTS', ['Companies', 'Contacts', 'Prop. Managers']);

drawLine(centerX - 60, 68, centerX - 60, 85);
drawBox(centerX - 90, 85, 60, 25, [219, 39, 119], 'BUILDINGS', ['Addresses', 'Anchors']);

drawLine(centerX, centerY - 15, centerX + 60, 55);
drawBox(centerX + 30, 40, 60, 35, [16, 185, 129], 'TECHNICIANS', ['IRATA/SPRAT Certs', 'Employees', 'Job Profiles']);

drawLine(centerX - 25, centerY + 5, centerX - 70, centerY + 35);
drawBox(centerX - 115, centerY + 25, 65, 40, [245, 158, 11], 'SAFETY', ['Harness Insp.', 'Toolbox Meetings', 'FLHA Forms', 'Incidents']);

drawLine(centerX + 25, centerY, centerX + 60, centerY);
drawBox(centerX + 60, centerY - 15, 55, 35, [71, 85, 105], 'WORK SESSIONS', ['Clock In/Out', 'Drop Logs', 'GPS']);

drawLine(centerX + 115, centerY, centerX + 145, centerY);
drawBox(centerX + 145, centerY - 15, 50, 35, [139, 92, 246], 'PAYROLL', ['Hours Tracking', 'Pay Periods', 'Exports']);

drawLine(centerX + 90, centerY + 20, centerX + 110, centerY + 55);
drawBox(centerX + 85, centerY + 50, 60, 35, [6, 182, 212], 'INVENTORY', ['Gear Items', 'Serial Numbers', 'Assignments']);

drawLine(centerX - 25, centerY + 20, centerX - 50, centerY + 55);
drawBox(centerX - 85, centerY + 50, 55, 30, [124, 58, 237], 'QUOTES', ['Labor Costs', 'Services', 'Tax Calc']);

drawLine(centerX + 10, centerY + 20, centerX + 30, centerY + 55);
drawBox(centerX, centerY + 50, 60, 30, [244, 63, 94], 'COMMS', ['Work Notices', 'Complaints']);

drawLine(centerX, centerY - 15, centerX, 55);
drawBox(centerX - 25, 40, 50, 25, [71, 85, 105], 'SCHEDULING', ['Calendars', 'Assignments']);

drawBox(centerX - 30, pageHeight - 35, 60, 20, [107, 33, 168], 'BILLING', ['Stripe', 'Subscriptions']);

doc.setFontSize(7);
doc.setTextColor(148, 163, 184);
const legendY = pageHeight - 12;
const legendItems = [
  { color: [59, 130, 246] as [number, number, number], label: 'Core Ops' },
  { color: [16, 185, 129] as [number, number, number], label: 'Workforce' },
  { color: [245, 158, 11] as [number, number, number], label: 'Safety' },
  { color: [139, 92, 246] as [number, number, number], label: 'Finance' },
  { color: [236, 72, 153] as [number, number, number], label: 'Clients' },
  { color: [6, 182, 212] as [number, number, number], label: 'Inventory' },
  { color: [244, 63, 94] as [number, number, number], label: 'Comms' },
];

let legendX = 20;
legendItems.forEach(item => {
  doc.setFillColor(item.color[0], item.color[1], item.color[2]);
  doc.rect(legendX, legendY - 3, 4, 4, 'F');
  doc.text(item.label, legendX + 6, legendY, { align: 'left' });
  legendX += 35;
});

doc.setFontSize(7);
doc.setTextColor(100, 116, 139);
doc.text(`Generated: ${new Date().toLocaleDateString()}`, 10, pageHeight - 5);
doc.text('OnRopePro - Rope Access Management Platform', pageWidth - 10, pageHeight - 5, { align: 'right' });

const outputPath = path.join(process.cwd(), 'docs', 'OnRopePro-Architecture-Diagram.pdf');
const docsDir = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const pdfOutput = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(pdfOutput));

console.log(`PDF saved to: ${outputPath}`);

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
const margin = 12;

doc.setFillColor(15, 23, 42);
doc.rect(0, 0, pageWidth, pageHeight, 'F');

doc.setFontSize(18);
doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'bold');
doc.text('OnRopePro System Architecture', pageWidth / 2, 14, { align: 'center' });

doc.setFontSize(9);
doc.setTextColor(148, 163, 184);
doc.setFont('helvetica', 'normal');
doc.text('Enterprise Building Maintenance Management Platform', pageWidth / 2, 20, { align: 'center' });

const colors = {
  core: [59, 130, 246] as [number, number, number],
  clients: [236, 72, 153] as [number, number, number],
  workforce: [16, 185, 129] as [number, number, number],
  safety: [245, 158, 11] as [number, number, number],
  inventory: [6, 182, 212] as [number, number, number],
  finance: [139, 92, 246] as [number, number, number],
  comms: [244, 63, 94] as [number, number, number],
  platform: [100, 116, 139] as [number, number, number],
  analytics: [34, 197, 94] as [number, number, number],
};

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  color: [number, number, number];
  title: string;
  items: string[];
  id: string;
}

const boxes: Box[] = [];

function addBox(id: string, x: number, y: number, w: number, h: number, color: [number, number, number], title: string, items: string[]) {
  boxes.push({ id, x, y, w, h, color, title, items });
}

function drawBox(box: Box) {
  const { x, y, w, h, color, title, items } = box;
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(x, y, w, h, 2, 2, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x + w / 2, y + 6, { align: 'center' });
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(230, 230, 230);
  items.forEach((item, i) => {
    doc.text(item, x + w / 2, y + 11 + (i * 4), { align: 'center' });
  });
}

function drawConnection(fromId: string, toId: string, label?: string, bidirectional?: boolean) {
  const from = boxes.find(b => b.id === fromId);
  const to = boxes.find(b => b.id === toId);
  if (!from || !to) return;

  const fromCenterX = from.x + from.w / 2;
  const fromCenterY = from.y + from.h / 2;
  const toCenterX = to.x + to.w / 2;
  const toCenterY = to.y + to.h / 2;

  const angle = Math.atan2(toCenterY - fromCenterY, toCenterX - fromCenterX);
  
  const startX = fromCenterX + Math.cos(angle) * (from.w / 2);
  const startY = fromCenterY + Math.sin(angle) * (from.h / 2);
  const endX = toCenterX - Math.cos(angle) * (to.w / 2);
  const endY = toCenterY - Math.sin(angle) * (to.h / 2);

  doc.setDrawColor(80, 100, 120);
  doc.setLineWidth(0.3);
  doc.line(startX, startY, endX, endY);

  const arrowSize = 2;
  const arrowAngle = Math.PI / 6;
  doc.line(
    endX,
    endY,
    endX - arrowSize * Math.cos(angle - arrowAngle),
    endY - arrowSize * Math.sin(angle - arrowAngle)
  );
  doc.line(
    endX,
    endY,
    endX - arrowSize * Math.cos(angle + arrowAngle),
    endY - arrowSize * Math.sin(angle + arrowAngle)
  );

  if (bidirectional) {
    doc.line(
      startX,
      startY,
      startX + arrowSize * Math.cos(angle - arrowAngle),
      startY + arrowSize * Math.sin(angle - arrowAngle)
    );
    doc.line(
      startX,
      startY,
      startX + arrowSize * Math.cos(angle + arrowAngle),
      startY + arrowSize * Math.sin(angle + arrowAngle)
    );
  }

  if (label) {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    doc.setFontSize(4.5);
    doc.setTextColor(120, 140, 160);
    doc.text(label, midX, midY - 1, { align: 'center' });
  }
}

const centerX = pageWidth / 2;
const centerY = 95;

addBox('projects', centerX - 22, centerY - 14, 44, 28, colors.core, 'PROJECTS', ['Jobs & Scheduling', 'Progress Tracking', 'Documents & Plans']);

addBox('clients', margin + 5, 28, 40, 26, colors.clients, 'CLIENTS', ['Companies', 'Contacts', 'Property Managers']);
addBox('buildings', margin + 5, 58, 40, 26, colors.clients, 'BUILDINGS', ['Addresses', 'Anchors', 'Instructions']);
addBox('residents', margin + 5, 88, 40, 24, colors.clients, 'RESIDENTS', ['Portal Access', 'Unit Links']);

addBox('technicians', pageWidth - margin - 45, 28, 40, 28, colors.workforce, 'TECHNICIANS', ['IRATA/SPRAT Certs', 'Profiles & Resumes', 'Employer Connections']);
addBox('jobboard', pageWidth - margin - 45, 60, 40, 24, colors.workforce, 'JOB BOARD', ['Postings', 'Applications', 'Offers']);
addBox('employees', pageWidth - margin - 45, 88, 40, 24, colors.workforce, 'EMPLOYEES', ['Roles & Permissions', 'Referral Tracking']);

addBox('sessions', centerX + 50, centerY - 10, 38, 22, colors.platform, 'WORK SESSIONS', ['Clock In/Out', 'GPS Tracking']);
addBox('droplogs', centerX + 50, centerY + 16, 38, 20, colors.platform, 'DROP LOGS', ['Progress Data', 'Completion']);

addBox('scheduling', centerX - 20, 32, 40, 22, colors.core, 'SCHEDULING', ['Calendars', 'Job Assignments']);

addBox('harness', margin + 50, 120, 36, 22, colors.safety, 'HARNESS INSP.', ['Inspections', 'Expirations']);
addBox('toolbox', margin + 90, 120, 36, 22, colors.safety, 'TOOLBOX MTG', ['Daily Meetings', 'Attendance']);
addBox('flha', margin + 130, 120, 36, 22, colors.safety, 'FLHA FORMS', ['Hazard Analysis', 'Signatures']);
addBox('incidents', margin + 170, 120, 36, 22, colors.safety, 'INCIDENTS', ['Reports', 'Follow-ups']);
addBox('methods', margin + 90, 145, 36, 18, colors.safety, 'METHOD STMT', ['Safe Procedures']);
addBox('docreq', margin + 130, 145, 36, 18, colors.safety, 'DOC REQUESTS', ['Certifications']);

addBox('gear', pageWidth - margin - 85, 120, 38, 24, colors.inventory, 'GEAR ITEMS', ['Equipment Types', 'Serial Numbers']);
addBox('assignments', pageWidth - margin - 85, 148, 38, 20, colors.inventory, 'ASSIGNMENTS', ['To Projects', 'To Technicians']);
addBox('damage', pageWidth - margin - 43, 120, 38, 24, colors.inventory, 'DAMAGE RPT', ['Reports', 'Retirement']);
addBox('catalog', pageWidth - margin - 43, 148, 38, 20, colors.inventory, 'CATALOG', ['Industry Equip.']);

addBox('quotes', margin + 5, 145, 38, 24, colors.finance, 'QUOTES', ['Services', 'Labor Costs', 'Tax Calc']);
addBox('payroll', margin + 5, 173, 38, 22, colors.finance, 'PAYROLL', ['Hours', 'Exports', 'Adjustments']);
addBox('billing', margin + 47, 173, 38, 22, colors.finance, 'BILLING', ['Stripe', 'Subscriptions']);

addBox('notices', centerX - 55, 145, 38, 22, colors.comms, 'WORK NOTICES', ['Resident Alerts', 'White Label']);
addBox('complaints', centerX - 55, 171, 38, 22, colors.comms, 'COMPLAINTS', ['Submissions', 'Responses']);
addBox('notifications', centerX - 13, 171, 38, 20, colors.comms, 'NOTIFICATIONS', ['System Alerts']);

addBox('analytics', centerX + 30, 155, 40, 20, colors.analytics, 'ANALYTICS', ['Performance', 'PSR Scores']);
addBox('safetyrating', centerX + 30, 178, 40, 18, colors.analytics, 'SAFETY RATING', ['CSR Metrics']);

addBox('licensing', pageWidth - margin - 80, 173, 36, 22, colors.finance, 'LICENSING', ['Keys', 'Add-ons']);
addBox('whitelabel', pageWidth - margin - 40, 173, 36, 22, colors.platform, 'WHITE LABEL', ['Logos', 'Branding']);

addBox('superuser', centerX + 75, 155, 36, 20, colors.platform, 'SUPERUSER', ['Admin Tools', 'Impersonation']);
addBox('globalbuildings', centerX + 75, 178, 36, 18, colors.platform, 'GLOBAL DB', ['All Buildings']);

boxes.forEach(drawBox);

drawConnection('projects', 'clients', 'client link', true);
drawConnection('projects', 'buildings', 'location', true);
drawConnection('buildings', 'residents', 'units');
drawConnection('projects', 'scheduling', 'schedules', true);
drawConnection('scheduling', 'technicians', 'assigns');
drawConnection('projects', 'technicians', 'workers', true);
drawConnection('projects', 'sessions', 'tracks');
drawConnection('sessions', 'droplogs', 'logs');
drawConnection('sessions', 'payroll', 'hours');
drawConnection('projects', 'quotes', 'estimates');
drawConnection('quotes', 'clients', 'for client');

drawConnection('projects', 'harness', 'requires');
drawConnection('projects', 'toolbox', 'daily');
drawConnection('projects', 'flha', 'hazards');
drawConnection('projects', 'incidents', 'reports');
drawConnection('toolbox', 'technicians', 'attendees');
drawConnection('harness', 'technicians', 'inspector');
drawConnection('flha', 'technicians', 'submitter');
drawConnection('methods', 'projects', 'procedures');
drawConnection('docreq', 'technicians', 'requests');

drawConnection('gear', 'assignments', 'assigned');
drawConnection('assignments', 'projects', 'to project');
drawConnection('assignments', 'technicians', 'to tech');
drawConnection('gear', 'damage', 'reports');
drawConnection('catalog', 'gear', 'types');

drawConnection('technicians', 'jobboard', 'profiles');
drawConnection('jobboard', 'employees', 'applications');
drawConnection('employees', 'technicians', 'links');

drawConnection('projects', 'notices', 'alerts');
drawConnection('notices', 'residents', 'notifies');
drawConnection('complaints', 'residents', 'from');
drawConnection('complaints', 'projects', 'about');
drawConnection('notifications', 'technicians', 'to users');

drawConnection('sessions', 'analytics', 'metrics');
drawConnection('analytics', 'safetyrating', 'scores');
drawConnection('harness', 'safetyrating', 'compliance');
drawConnection('toolbox', 'safetyrating', 'compliance');
drawConnection('incidents', 'safetyrating', 'impacts');

drawConnection('billing', 'licensing', 'manages');
drawConnection('licensing', 'whitelabel', 'enables');
drawConnection('whitelabel', 'notices', 'branding');

drawConnection('superuser', 'globalbuildings', 'manages');
drawConnection('superuser', 'licensing', 'controls');
drawConnection('globalbuildings', 'buildings', 'central');

doc.setDrawColor(60, 70, 80);
doc.setLineWidth(0.2);
doc.roundedRect(margin, 26, 48, 92, 2, 2, 'S');
doc.roundedRect(pageWidth - margin - 48, 26, 48, 92, 2, 2, 'S');
doc.roundedRect(margin + 48, 116, 162, 52, 2, 2, 'S');
doc.roundedRect(pageWidth - margin - 88, 116, 88, 56, 2, 2, 'S');

doc.setFontSize(6);
doc.setTextColor(80, 90, 100);
doc.text('CLIENT & PROPERTY', margin + 24, 24, { align: 'center' });
doc.text('WORKFORCE', pageWidth - margin - 24, 24, { align: 'center' });
doc.text('SAFETY & COMPLIANCE', margin + 129, 114, { align: 'center' });
doc.text('EQUIPMENT & INVENTORY', pageWidth - margin - 44, 114, { align: 'center' });

const legendY = pageHeight - 8;
const legendItems = [
  { color: colors.core, label: 'Core Operations' },
  { color: colors.clients, label: 'Clients & Property' },
  { color: colors.workforce, label: 'Workforce' },
  { color: colors.safety, label: 'Safety' },
  { color: colors.inventory, label: 'Inventory' },
  { color: colors.finance, label: 'Finance' },
  { color: colors.comms, label: 'Communications' },
  { color: colors.analytics, label: 'Analytics' },
  { color: colors.platform, label: 'Platform' },
];

doc.setFontSize(5);
let legendX = margin;
legendItems.forEach(item => {
  doc.setFillColor(item.color[0], item.color[1], item.color[2]);
  doc.rect(legendX, legendY - 2, 3, 3, 'F');
  doc.setTextColor(148, 163, 184);
  doc.text(item.label, legendX + 4, legendY, { align: 'left' });
  legendX += 30;
});

doc.setFontSize(5);
doc.setTextColor(80, 90, 100);
doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pageHeight - 3);
doc.text('OnRopePro - Enterprise Rope Access Management Platform', pageWidth - margin, pageHeight - 3, { align: 'right' });

const outputPath = path.join(process.cwd(), 'docs', 'OnRopePro-Architecture-Diagram.pdf');
const docsDir = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const pdfOutput = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(pdfOutput));

console.log(`Professional architecture PDF saved to: ${outputPath}`);

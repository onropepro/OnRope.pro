import { instance } from "@viz-js/viz";
import * as fs from "fs";
import * as path from "path";

async function generateArchitectureDiagram() {
  const viz = await instance();

  const dotSource = `
digraph OnRopeProArchitecture {
  // Graph settings for clean layout
  graph [
    rankdir=TB
    splines=ortho
    nodesep=0.8
    ranksep=1.0
    bgcolor="#0f172a"
    fontname="Arial"
    pad=0.5
    dpi=150
  ]
  
  node [
    shape=box
    style="filled,rounded"
    fontname="Arial"
    fontsize=11
    fontcolor="white"
    penwidth=0
    margin="0.3,0.15"
  ]
  
  edge [
    color="#475569"
    penwidth=1.5
    arrowsize=0.7
  ]

  // ==================== LAYER 1: EXTERNAL STAKEHOLDERS ====================
  subgraph cluster_external {
    label="External Stakeholders"
    labelloc=t
    fontcolor="#94a3b8"
    fontsize=12
    fontname="Arial Bold"
    style=invis
    
    subgraph cluster_clients_property {
      label=""
      style=invis
      
      CLIENTS [label="CLIENTS\\nCompanies\\nContacts\\nProperty Managers" fillcolor="#ec4899"]
      BUILDINGS [label="BUILDINGS\\nAddresses\\nAnchors\\nInstructions" fillcolor="#ec4899"]
      RESIDENTS [label="RESIDENTS\\nPortal Access\\nUnit Links" fillcolor="#ec4899"]
    }
    
    subgraph cluster_technicians {
      label=""
      style=invis
      
      TECHNICIANS [label="TECHNICIANS\\nIRATA/SPRAT Certs\\nProfiles & Resumes\\nEmployer Connections" fillcolor="#06b6d4"]
      PM [label="PROPERTY\\nMANAGERS\\nBuilding Access\\nVendor Views" fillcolor="#ec4899"]
    }
  }

  // ==================== LAYER 2: CORE OPERATIONS ====================
  subgraph cluster_core {
    label="Core Operations"
    labelloc=t
    fontcolor="#94a3b8"
    fontsize=12
    fontname="Arial Bold"
    style=invis
    
    SCHEDULING [label="SCHEDULING\\nCalendars\\nJob Assignments\\nConflict Detection" fillcolor="#3b82f6"]
    PROJECTS [label="PROJECTS\\n10 Job Types\\nProgress Tracking\\nDocuments & Plans" fillcolor="#3b82f6"]
    WORK_SESSIONS [label="WORK SESSIONS\\nClock In/Out\\nGPS Tracking\\nDrop Logs" fillcolor="#3b82f6"]
  }

  // ==================== LAYER 3: WORKFORCE ====================
  subgraph cluster_workforce {
    label="Workforce Management"
    labelloc=t
    fontcolor="#94a3b8"
    fontsize=12
    fontname="Arial Bold"
    style=invis
    
    EMPLOYEES [label="EMPLOYEES\\nRoles & Permissions\\nReferral Tracking" fillcolor="#06b6d4"]
    JOB_BOARD [label="JOB BOARD\\nPostings\\nApplications\\nTalent Browse" fillcolor="#06b6d4"]
  }

  // ==================== LAYER 4: SAFETY & COMPLIANCE ====================
  subgraph cluster_safety {
    label="Safety & Compliance"
    labelloc=t
    fontcolor="#94a3b8"
    fontsize=12
    fontname="Arial Bold"
    style=invis
    
    HARNESS [label="HARNESS\\nINSPECTIONS\\nDaily Checks\\nExpirations" fillcolor="#f59e0b"]
    TOOLBOX [label="TOOLBOX\\nMEETINGS\\nAttendance\\nTopics" fillcolor="#f59e0b"]
    FLHA [label="FLHA FORMS\\nHazard Analysis\\nSignatures" fillcolor="#f59e0b"]
    INCIDENTS [label="INCIDENTS\\nReports\\nClassifications" fillcolor="#f59e0b"]
  }

  // ==================== LAYER 5: EQUIPMENT & INVENTORY ====================
  subgraph cluster_equipment {
    label="Equipment & Inventory"
    labelloc=t
    fontcolor="#94a3b8"
    fontsize=12
    fontname="Arial Bold"
    style=invis
    
    GEAR [label="GEAR ITEMS\\nSerial Numbers\\nRetirement Tracking" fillcolor="#8b5cf6"]
    ASSIGNMENTS [label="GEAR\\nASSIGNMENTS\\nEmployee Gear" fillcolor="#8b5cf6"]
    DAMAGE [label="DAMAGE\\nREPORTS\\nRetirement" fillcolor="#8b5cf6"]
    CATALOG [label="EQUIPMENT\\nCATALOG\\nIndustry Gear" fillcolor="#8b5cf6"]
  }

  // ==================== LAYER 6: FINANCE ====================
  subgraph cluster_finance {
    label="Financial Operations"
    labelloc=t
    fontcolor="#94a3b8"
    fontsize=12
    fontname="Arial Bold"
    style=invis
    
    QUOTES [label="QUOTES\\nLabor Costs\\nTax Calculation" fillcolor="#10b981"]
    BILLING [label="BILLING\\nStripe\\nSubscriptions" fillcolor="#10b981"]
    PAYROLL [label="PAYROLL\\nHours Export\\nAdjustments" fillcolor="#10b981"]
  }

  // ==================== LAYER 7: COMMUNICATIONS ====================
  subgraph cluster_comms {
    label="Communications"
    labelloc=t
    fontcolor="#94a3b8"
    fontsize=12
    fontname="Arial Bold"
    style=invis
    
    NOTICES [label="WORK NOTICES\\nResident Alerts\\nWhite Label" fillcolor="#f43f5e"]
    COMPLAINTS [label="COMPLAINTS\\nSubmissions\\nResponses" fillcolor="#f43f5e"]
    NOTIFICATIONS [label="SYSTEM\\nNOTIFICATIONS\\nAlerts" fillcolor="#f43f5e"]
  }

  // ==================== LAYER 8: PLATFORM ====================
  subgraph cluster_platform {
    label="Platform Services"
    labelloc=t
    fontcolor="#94a3b8"
    fontsize=12
    fontname="Arial Bold"
    style=invis
    
    ANALYTICS [label="ANALYTICS\\nPerformance\\nPSR Scores" fillcolor="#64748b"]
    SAFETY_RATING [label="SAFETY\\nRATING\\nCSR Metrics" fillcolor="#64748b"]
    SUPERUSER [label="SUPERUSER\\nAdmin Tools\\nImpersonation" fillcolor="#64748b"]
    GLOBAL_DB [label="GLOBAL\\nBUILDING DB\\nAll Buildings" fillcolor="#64748b"]
    WHITE_LABEL [label="WHITE LABEL\\nLogos & Colors\\nPWA Icons" fillcolor="#64748b"]
  }

  // ==================== LAYOUT RANKS ====================
  { rank=same; CLIENTS; BUILDINGS; RESIDENTS; PM; TECHNICIANS }
  { rank=same; SCHEDULING; PROJECTS; WORK_SESSIONS }
  { rank=same; EMPLOYEES; JOB_BOARD }
  { rank=same; HARNESS; TOOLBOX; FLHA; INCIDENTS }
  { rank=same; GEAR; ASSIGNMENTS; DAMAGE; CATALOG }
  { rank=same; QUOTES; BILLING; PAYROLL }
  { rank=same; NOTICES; COMPLAINTS; NOTIFICATIONS }
  { rank=same; ANALYTICS; SAFETY_RATING; SUPERUSER; GLOBAL_DB; WHITE_LABEL }

  // ==================== KEY RELATIONSHIPS ====================
  // External to Core
  CLIENTS -> PROJECTS [color="#ec4899"]
  BUILDINGS -> PROJECTS [color="#ec4899"]
  TECHNICIANS -> EMPLOYEES [color="#06b6d4"]
  
  // Core flow
  PROJECTS -> SCHEDULING [color="#3b82f6"]
  SCHEDULING -> WORK_SESSIONS [color="#3b82f6"]
  EMPLOYEES -> WORK_SESSIONS [color="#06b6d4"]
  
  // Safety connections
  WORK_SESSIONS -> HARNESS [color="#f59e0b"]
  WORK_SESSIONS -> TOOLBOX [color="#f59e0b"]
  PROJECTS -> FLHA [color="#f59e0b"]
  
  // Equipment connections
  EMPLOYEES -> ASSIGNMENTS [color="#8b5cf6"]
  GEAR -> DAMAGE [color="#8b5cf6"]
  
  // Finance connections
  PROJECTS -> QUOTES [color="#10b981"]
  WORK_SESSIONS -> PAYROLL [color="#10b981"]
  
  // Communications
  PROJECTS -> NOTICES [color="#f43f5e"]
  RESIDENTS -> COMPLAINTS [color="#f43f5e"]
  
  // Platform connections
  WORK_SESSIONS -> ANALYTICS [color="#64748b"]
  INCIDENTS -> SAFETY_RATING [color="#64748b"]
  BUILDINGS -> GLOBAL_DB [color="#64748b"]
}
`;

  // Generate SVG
  const svgOutput = viz.renderString(dotSource, { format: "svg" });
  
  // Save SVG
  const docsDir = path.join(process.cwd(), "docs");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  const svgPath = path.join(docsDir, "OnRopePro-Architecture.svg");
  fs.writeFileSync(svgPath, svgOutput);
  
  console.log(`Architecture diagram generated: ${svgPath}`);
  console.log("\nTo view: Open the SVG file in any browser or image viewer");
  console.log("To convert to PDF: Use a browser's print-to-PDF or an online SVG-to-PDF converter");
}

generateArchitectureDiagram().catch(console.error);

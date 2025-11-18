import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, DollarSign } from "lucide-react";
import { hasFinancialAccess } from "@/lib/permissions";

export default function Documents() {
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: projectsData } = useQuery<{ projects: any[] }>({
    queryKey: ["/api/projects"],
  });

  const { data: meetingsData } = useQuery<{ meetings: any[] }>({
    queryKey: ["/api/toolbox-meetings"],
  });

  const { data: inspectionsData } = useQuery<{ inspections: any[] }>({
    queryKey: ["/api/harness-inspections"],
  });

  const { data: quotesData } = useQuery<{ quotes: any[] }>({
    queryKey: ["/api/quotes"],
  });

  const currentUser = userData?.user;
  const canViewFinancials = hasFinancialAccess(currentUser);
  const projects = projectsData?.projects || [];
  const meetings = meetingsData?.meetings || [];
  const inspections = inspectionsData?.inspections || [];
  const quotes = quotesData?.quotes || [];

  // Collect all rope access plan PDFs
  const allDocuments = projects.flatMap(project => 
    (project.documentUrls || []).map((url: string) => ({
      type: 'pdf',
      url,
      projectName: project.buildingName,
      date: project.createdAt
    }))
  );

  const downloadToolboxMeeting = (meeting: any) => {
    const topics = [];
    if (meeting.topicFallProtection) topics.push('Fall Protection and Rescue Procedures');
    if (meeting.topicAnchorPoints) topics.push('Anchor Point Selection and Inspection');
    if (meeting.topicRopeInspection) topics.push('Rope Inspection and Maintenance');
    if (meeting.topicKnotTying) topics.push('Knot Tying and Verification');
    if (meeting.topicPPECheck) topics.push('Personal Protective Equipment (PPE) Check');
    if (meeting.topicWeatherConditions) topics.push('Weather Conditions and Work Stoppage');
    if (meeting.topicCommunication) topics.push('Communication Signals and Procedures');
    if (meeting.topicEmergencyEvacuation) topics.push('Emergency Evacuation Procedures');
    if (meeting.topicHazardAssessment) topics.push('Work Area Hazard Assessment');
    if (meeting.topicLoadCalculations) topics.push('Load Calculations and Weight Limits');
    if (meeting.topicEquipmentCompatibility) topics.push('Equipment Compatibility Check');
    if (meeting.topicDescenderAscender) topics.push('Descender and Ascender Use');
    if (meeting.topicEdgeProtection) topics.push('Edge Protection Requirements');
    if (meeting.topicSwingFall) topics.push('Swing Fall Hazards');
    if (meeting.topicMedicalFitness) topics.push('Medical Fitness and Fatigue Management');
    if (meeting.topicToolDropPrevention) topics.push('Tool Drop Prevention');
    if (meeting.topicRegulations) topics.push('Working at Heights Regulations');
    if (meeting.topicRescueProcedures) topics.push('Rescue Procedures and Equipment');
    if (meeting.topicSiteHazards) topics.push('Site-Specific Hazards');
    if (meeting.topicBuddySystem) topics.push('Buddy System and Supervision');

    const content = `DAILY TOOLBOX MEETING RECORD

Date: ${new Date(meeting.meetingDate).toLocaleDateString()}
Conducted By: ${meeting.conductedByName}
Attendees: ${Array.isArray(meeting.attendees) ? meeting.attendees.join(', ') : meeting.attendees}

TOPICS DISCUSSED:
${topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

${meeting.customTopic ? `\nCustom Topic: ${meeting.customTopic}` : ''}

${meeting.additionalNotes ? `\nAdditional Notes:\n${meeting.additionalNotes}` : ''}

---
This is an official safety meeting record.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Toolbox_Meeting_${new Date(meeting.meetingDate).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadHarnessInspection = (inspection: any) => {
    const content = `ROPE ACCESS EQUIPMENT INSPECTION RECORD

Inspection Date: ${new Date(inspection.inspectionDate).toLocaleDateString()}
Inspector: ${inspection.inspectorName}
Manufacturer: ${inspection.manufacturer || 'N/A'}
Equipment ID: ${inspection.equipmentId || 'N/A'}
Date in Service: ${inspection.dateInService || 'N/A'}

INSPECTION RESULT: ${inspection.overallStatus?.toUpperCase() || 'N/A'}

${inspection.comments ? `\nComments:\n${inspection.comments}` : ''}

---
This is an official equipment inspection record.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Equipment_Inspection_${new Date(inspection.inspectionDate).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Same professional HTML download function as Quotes.tsx
  const downloadQuote = (quote: any) => {
    const serviceNames: Record<string, string> = {
      window_cleaning: "Window Cleaning",
      dryer_vent_cleaning: "Exterior Dryer Vent Cleaning",
      building_wash: "Building Wash - Pressure washing",
      general_pressure_washing: "General Pressure Washing",
      gutter_cleaning: "Gutter Cleaning",
      parkade: "Parkade Cleaning",
      ground_windows: "Ground Windows",
      in_suite: "In-Suite Dryer Vent"
    };

    const grandTotal = quote.services?.reduce((sum: number, s: any) => sum + Number(s.totalCost || 0), 0) || 0;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Quote - ${quote.strataPlanNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 60px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 3px solid #3B82F6; padding-bottom: 30px; margin-bottom: 40px; }
        .header h1 { color: #3B82F6; font-size: 32px; margin-bottom: 8px; }
        .header .subtitle { color: #71717A; font-size: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .info-section h3 { color: #3B82F6; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .info-section p { color: #333; margin-bottom: 5px; }
        .info-section strong { font-weight: 600; }
        .services-section { margin: 40px 0; }
        .services-section h2 { color: #0A0A0A; font-size: 24px; margin-bottom: 25px; border-bottom: 2px solid #E4E4E7; padding-bottom: 10px; }
        .service-item { background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 8px; padding: 25px; margin-bottom: 20px; }
        .service-item h3 { color: #0A0A0A; font-size: 18px; margin-bottom: 15px; }
        .service-details { color: #71717A; font-size: 14px; }
        .service-details p { margin: 8px 0; padding-left: 10px; }
        .pricing-row { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #E4E4E7; }
        .pricing-row strong { color: #0A0A0A; }
        .total-section { background: #3B82F6; color: white; padding: 30px; border-radius: 8px; text-align: right; margin-top: 30px; }
        .total-section h3 { font-size: 16px; margin-bottom: 10px; font-weight: 500; opacity: 0.9; }
        .total-section .amount { font-size: 36px; font-weight: bold; }
        .footer { margin-top: 50px; padding-top: 30px; border-top: 2px solid #E4E4E7; text-align: center; color: #71717A; font-size: 14px; }
        @media print { body { background: white; margin: 0; padding: 0; } .container { box-shadow: none; padding: 40px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SERVICE QUOTE</h1>
            <p class="subtitle">Rope Access & High-Rise Maintenance Services</p>
        </div>

        <div class="info-grid">
            <div class="info-section">
                <h3>Quote Information</h3>
                <p><strong>Quote Date:</strong> ${quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                <p><strong>Quote Number:</strong> ${quote.strataPlanNumber}</p>
                <p><strong>Status:</strong> ${quote.status.toUpperCase()}</p>
            </div>
            <div class="info-section">
                <h3>Property Information</h3>
                <p><strong>Building:</strong> ${quote.buildingName}</p>
                <p><strong>Address:</strong> ${quote.buildingAddress}</p>
                <p><strong>Floors:</strong> ${quote.floorCount}</p>
            </div>
        </div>

        ${quote.strataManagerName || quote.strataManagerAddress ? `
        <div class="info-grid">
            <div class="info-section">
                <h3>Strata Property Manager</h3>
                ${quote.strataManagerName ? `<p><strong>Name:</strong> ${quote.strataManagerName}</p>` : ''}
                ${quote.strataManagerAddress ? `<p><strong>Address:</strong> ${quote.strataManagerAddress}</p>` : ''}
            </div>
        </div>
        ` : ''}

        <div class="services-section">
            <h2>Services Proposed</h2>
            ${quote.services?.map((service: any, index: number) => {
              const serviceName = serviceNames[service.serviceType] || service.serviceType;
              let details = [];

              if (service.dropsNorth || service.dropsEast || service.dropsSouth || service.dropsWest) {
                details.push(`<p><strong>Elevation Drops:</strong> North: ${service.dropsNorth || 0}, East: ${service.dropsEast || 0}, South: ${service.dropsSouth || 0}, West: ${service.dropsWest || 0}</p>`);
                if (service.dropsPerDay) details.push(`<p><strong>Drops per Day:</strong> ${service.dropsPerDay}</p>`);
              }

              if (service.parkadeStalls) details.push(`<p><strong>Parking Stalls:</strong> ${service.parkadeStalls}</p>`);
              if (service.groundWindowHours) details.push(`<p><strong>Estimated Hours:</strong> ${service.groundWindowHours}</p>`);
              if (service.suitesPerDay) details.push(`<p><strong>Suites per Day:</strong> ${service.suitesPerDay}</p>`);
              if (service.floorsPerDay) details.push(`<p><strong>Floors per Day:</strong> ${service.floorsPerDay}</p>`);

              return `
                <div class="service-item">
                    <h3>${index + 1}. ${serviceName}</h3>
                    <div class="service-details">
                        ${details.join('')}
                        ${canViewFinancials && service.totalHours ? `<p><strong>Total Hours:</strong> ${service.totalHours}</p>` : ''}
                        ${canViewFinancials && service.pricePerHour ? `<p><strong>Hourly Rate:</strong> $${Number(service.pricePerHour).toFixed(2)}/hour</p>` : ''}
                        ${canViewFinancials && service.pricePerStall ? `<p><strong>Price per Stall:</strong> $${Number(service.pricePerStall).toFixed(2)}</p>` : ''}
                    </div>
                    ${canViewFinancials && service.totalCost ? `
                    <div class="pricing-row">
                        <strong>Service Total</strong>
                        <strong>$${Number(service.totalCost).toFixed(2)}</strong>
                    </div>
                    ` : ''}
                </div>
              `;
            }).join('') || ''}
        </div>

        ${canViewFinancials ? `
        <div class="total-section">
            <h3>TOTAL INVESTMENT</h3>
            <div class="amount">$${grandTotal.toFixed(2)}</div>
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>Professional Rope Access Services</strong></p>
            <p>High-Rise Maintenance & Building Services</p>
            <p style="margin-top: 15px; font-size: 12px;">This quote is valid for 30 days from the date of issue. All work will be completed in accordance with IRATA standards and local safety regulations.</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quote_${quote.strataPlanNumber}_${new Date(quote.createdAt || Date.now()).toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">All company documents and safety records</p>
        </div>

        {/* Rope Access Plans */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Rope Access Plans
              <Badge variant="secondary" className="ml-auto">
                {allDocuments.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allDocuments.length > 0 ? (
              <div className="space-y-2">
                {allDocuments.map((doc, index) => {
                  const filename = doc.url.split('/').pop() || 'Document';
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{doc.projectName}</div>
                        <div className="text-sm text-muted-foreground">{filename}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.url, '_blank')}
                        data-testid={`download-pdf-${index}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No rope access plans uploaded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Toolbox Meetings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Toolbox Meeting Records
              <Badge variant="secondary" className="ml-auto">
                {meetings.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {meetings.length > 0 ? (
              <div className="space-y-2">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        {new Date(meeting.meetingDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Conducted by: {meeting.conductedByName}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadToolboxMeeting(meeting)}
                      data-testid={`download-meeting-${meeting.id}`}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No toolbox meetings recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Harness Inspections */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-xl">verified_user</span>
              Equipment Inspection Records
              <Badge variant="secondary" className="ml-auto">
                {inspections.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inspections.length > 0 ? (
              <div className="space-y-2">
                {inspections.map((inspection) => (
                  <div key={inspection.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                    <span className="material-icons text-primary flex-shrink-0">verified_user</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        {new Date(inspection.inspectionDate).toLocaleDateString()} - {inspection.inspectorName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {inspection.manufacturer || 'Equipment inspection'}
                      </div>
                    </div>
                    <Badge variant={inspection.overallStatus === 'pass' ? 'default' : 'destructive'}>
                      {inspection.overallStatus || 'N/A'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadHarnessInspection(inspection)}
                      data-testid={`download-inspection-${inspection.id}`}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No equipment inspections recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Service Quotes */}
        {canViewFinancials && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Service Quotes
                <Badge variant="secondary" className="ml-auto">
                  {quotes.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotes.length > 0 ? (
                <div className="space-y-2">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                      <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{quote.buildingName}</div>
                        <div className="text-sm text-muted-foreground">
                          {quote.strataPlanNumber} • {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : ''}
                        </div>
                      </div>
                      <Badge variant={quote.status === 'open' ? 'default' : 'secondary'}>
                        {quote.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadQuote(quote)}
                        data-testid={`download-quote-${quote.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No quotes created yet
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

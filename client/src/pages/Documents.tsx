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

  const downloadQuote = (quote: any) => {
    const serviceNames: Record<string, string> = {
      window_cleaning: "Window Cleaning",
      dryer_vent_cleaning: "Exterior Dryer Vent Cleaning",
      pressure_washing: "Pressure Washing",
      general_pressure_washing: "General Pressure Washing",
      gutter_cleaning: "Gutter Cleaning",
      parkade: "Parkade Cleaning",
      ground_windows: "Ground Windows",
      in_suite: "In-Suite Dryer Vent"
    };

    let content = `SERVICE QUOTE

Building: ${quote.buildingName}
Strata Plan: ${quote.strataPlanNumber}
Address: ${quote.buildingAddress}
Floors: ${quote.floorCount}
Status: ${quote.status.toUpperCase()}
${quote.createdAt ? `Created: ${new Date(quote.createdAt).toLocaleDateString()}` : ''}

SERVICES:
${quote.services.map((service: any, index: number) => {
  let serviceDetails = `\n${index + 1}. ${serviceNames[service.serviceType] || service.serviceType}\n`;
  
  if (service.dropsNorth || service.dropsEast || service.dropsSouth || service.dropsWest) {
    serviceDetails += `   Drops: N:${service.dropsNorth || 0} E:${service.dropsEast || 0} S:${service.dropsSouth || 0} W:${service.dropsWest || 0}\n`;
    if (service.dropsPerDay) serviceDetails += `   Drops per day: ${service.dropsPerDay}\n`;
  }
  
  if (service.parkadeStalls) {
    serviceDetails += `   Stalls: ${service.parkadeStalls}\n`;
    if (canViewFinancials && service.pricePerStall) {
      serviceDetails += `   Price per stall: $${Number(service.pricePerStall).toFixed(2)}\n`;
    }
  }
  
  if (service.groundWindowHours) {
    serviceDetails += `   Hours: ${service.groundWindowHours}\n`;
  }
  
  if (service.suitesPerDay) {
    serviceDetails += `   Suites per day: ${service.suitesPerDay}\n`;
  }
  
  if (service.floorsPerDay) {
    serviceDetails += `   Floors per day: ${service.floorsPerDay}\n`;
  }
  
  if (canViewFinancials) {
    if (service.totalHours) serviceDetails += `   Total hours: ${service.totalHours}\n`;
    if (service.pricePerHour) serviceDetails += `   Rate: $${Number(service.pricePerHour).toFixed(2)}/hr\n`;
    if (service.totalCost) serviceDetails += `   Total: $${Number(service.totalCost).toFixed(2)}\n`;
  }
  
  return serviceDetails;
}).join('')}

${canViewFinancials ? `\nGRAND TOTAL: $${quote.services.reduce((sum: number, s: any) => sum + Number(s.totalCost || 0), 0).toFixed(2)}` : ''}

---
This is an official service quote.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quote_${quote.strataPlanNumber}_${new Date(quote.createdAt || Date.now()).toISOString().split('T')[0]}.txt`;
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

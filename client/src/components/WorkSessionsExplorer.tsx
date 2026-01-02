import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import { format, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Download, 
  FileText,
  Filter, 
  Printer, 
  Search, 
  User, 
  Users,
  Building2,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { addProfessionalHeader, addSectionHeader, addFooter, getBrandColors, BrandingConfig } from "@/lib/pdfBranding";
import { cn } from "@/lib/utils";

interface WorkSession {
  id: string;
  projectId: string;
  employeeId: string;
  companyId: string;
  workDate: string;
  startTime: string;
  endTime: string | null;
  regularHours: string | null;
  overtimeHours: string | null;
  doubleTimeHours: string | null;
  dropsCompletedNorth: number | null;
  dropsCompletedEast: number | null;
  dropsCompletedSouth: number | null;
  dropsCompletedWest: number | null;
  shortfallReason: string | null;
  employeeName: string | null;
  employeeRole: string | null;
  projectName: string | null;
  projectAddress: string | null;
  dailyDropTarget: number | null;
}

interface ProjectGroup {
  projectId: string;
  projectName: string;
  sessions: WorkSession[];
  totalHours: number;
}

interface MonthGroup {
  month: number;
  monthName: string;
  projects: ProjectGroup[];
  totalHours: number;
}

interface YearGroup {
  year: number;
  months: MonthGroup[];
  totalHours: number;
}

interface HierarchyResponse {
  hierarchy: YearGroup[];
  totalSessions: number;
  sessions: WorkSession[];
}

interface Employee {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  status: string;
}

interface WorkSessionsExplorerProps {
  branding?: BrandingConfig;
}

export function WorkSessionsExplorer({ branding }: WorkSessionsExplorerProps) {
  const { t } = useTranslation();
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeSearchOpen, setEmployeeSearchOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (selectedEmployee) {
      params.append('employeeId', selectedEmployee.id);
    }
    if (fromDate) {
      params.append('from', fromDate.toISOString());
    }
    if (toDate) {
      params.append('to', toDate.toISOString());
    }
    return params.toString();
  };

  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery<{ employees: Employee[] }>({
    queryKey: ["/api/performance/work-sessions/employees"],
  });

  const queryParams = buildQueryParams();
  const { data: sessionsData, isLoading: isLoadingSessions } = useQuery<HierarchyResponse>({
    queryKey: ["/api/performance/work-sessions", queryParams],
    queryFn: async () => {
      const url = queryParams 
        ? `/api/performance/work-sessions?${queryParams}` 
        : "/api/performance/work-sessions";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch work sessions");
      return res.json();
    },
  });

  const employees = employeesData?.employees || [];
  const hierarchy = sessionsData?.hierarchy || [];
  const allSessions = sessionsData?.sessions || [];
  const totalSessions = sessionsData?.totalSessions || 0;

  const totalHours = useMemo(() => {
    return hierarchy.reduce((sum, year) => sum + year.totalHours, 0);
  }, [hierarchy]);

  const applyQuickFilter = (filter: 'thisMonth' | 'lastMonth' | 'thisYear' | 'last3Months' | 'clear') => {
    const now = new Date();
    switch (filter) {
      case 'thisMonth':
        setFromDate(startOfMonth(now));
        setToDate(endOfMonth(now));
        break;
      case 'lastMonth':
        const lastMonth = subMonths(now, 1);
        setFromDate(startOfMonth(lastMonth));
        setToDate(endOfMonth(lastMonth));
        break;
      case 'thisYear':
        setFromDate(startOfYear(now));
        setToDate(endOfYear(now));
        break;
      case 'last3Months':
        setFromDate(startOfMonth(subMonths(now, 2)));
        setToDate(endOfMonth(now));
        break;
      case 'clear':
        setFromDate(undefined);
        setToDate(undefined);
        setSelectedEmployee(null);
        break;
    }
  };

  const formatDuration = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const calculateSessionHours = (session: WorkSession): number => {
    const regular = parseFloat(session.regularHours || '0') || 0;
    const overtime = parseFloat(session.overtimeHours || '0') || 0;
    const doubleTime = parseFloat(session.doubleTimeHours || '0') || 0;
    return regular + overtime + doubleTime;
  };

  const handleExportPDF = async () => {
    if (allSessions.length === 0) return;
    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;

      const filterSummary = [];
      if (selectedEmployee) {
        filterSummary.push(`Employee: ${selectedEmployee.name || selectedEmployee.email}`);
      }
      if (fromDate && toDate) {
        filterSummary.push(`Date Range: ${format(fromDate, 'MMM d, yyyy')} - ${format(toDate, 'MMM d, yyyy')}`);
      } else if (fromDate) {
        filterSummary.push(`From: ${format(fromDate, 'MMM d, yyyy')}`);
      } else if (toDate) {
        filterSummary.push(`To: ${format(toDate, 'MMM d, yyyy')}`);
      }
      if (filterSummary.length === 0) {
        filterSummary.push('All Work Sessions');
      }

      const subtitle = filterSummary.join(' | ');
      const headerResult = await addProfessionalHeader(
        doc, 
        t('performance.workSessionsReport', 'Work Sessions Report'),
        subtitle,
        branding || {}
      );

      let yPos = headerResult.contentStartY;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Total Sessions: ${totalSessions}`, margin, yPos);
      doc.text(`Total Hours: ${formatDuration(totalHours)}`, pageWidth / 2, yPos);
      yPos += 10;

      for (const yearData of hierarchy) {
        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 20;
        }

        yPos = addSectionHeader(doc, `${yearData.year} - ${formatDuration(yearData.totalHours)}`, yPos, headerResult.primaryColor);

        for (const monthData of yearData.months) {
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 30, 30);
          doc.text(`${monthData.monthName} - ${formatDuration(monthData.totalHours)}`, margin, yPos);
          yPos += 8;

          for (const projectData of monthData.projects) {
            if (yPos > pageHeight - 35) {
              doc.addPage();
              yPos = 20;
            }

            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(80, 80, 80);
            doc.text(`${projectData.projectName} (${projectData.sessions.length} sessions, ${formatDuration(projectData.totalHours)})`, margin + 5, yPos);
            yPos += 6;

            const headers = ['Date', 'Employee', 'Clock In', 'Clock Out', 'Hours', 'Drops', 'Status'];
            const colWidths = [22, 38, 22, 22, 18, 18, 25];

            doc.setFillColor(240, 240, 240);
            doc.rect(margin, yPos - 4, pageWidth - margin * 2, 7, 'F');

            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(60, 60, 60);
            let xPos = margin + 2;
            headers.forEach((header, i) => {
              doc.text(header, xPos, yPos);
              xPos += colWidths[i];
            });
            yPos += 8;

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(40, 40, 40);

            const maxSessionsToShow = Math.min(projectData.sessions.length, 50);
            for (let i = 0; i < maxSessionsToShow; i++) {
              const session = projectData.sessions[i];
              if (yPos > pageHeight - 25) {
                doc.addPage();
                yPos = 20;
              }

              const sessionHours = calculateSessionHours(session);
              const workDate = format(new Date(session.workDate), 'MMM d');
              const clockIn = session.startTime ? format(new Date(session.startTime), 'HH:mm') : '-';
              const clockOut = session.endTime ? format(new Date(session.endTime), 'HH:mm') : 'Active';
              
              // Calculate total drops for this session
              const totalDrops = (session.dropsCompletedNorth || 0) + 
                                 (session.dropsCompletedEast || 0) + 
                                 (session.dropsCompletedSouth || 0) + 
                                 (session.dropsCompletedWest || 0);
              
              // Determine target met status
              const dailyTarget = session.dailyDropTarget || 0;
              let targetStatus = '-';
              if (dailyTarget > 0) {
                if (totalDrops >= dailyTarget) {
                  targetStatus = 'Met';
                } else if (session.shortfallReason) {
                  targetStatus = 'Valid Reason';
                } else {
                  targetStatus = 'Below';
                }
              }
              
              xPos = margin + 2;
              doc.text(workDate, xPos, yPos);
              xPos += colWidths[0];
              
              const employeeName = session.employeeName || 'Unknown';
              doc.text(employeeName.substring(0, 15), xPos, yPos);
              xPos += colWidths[1];
              
              doc.text(clockIn, xPos, yPos);
              xPos += colWidths[2];
              
              doc.text(clockOut, xPos, yPos);
              xPos += colWidths[3];
              
              doc.text(formatDuration(sessionHours), xPos, yPos);
              xPos += colWidths[4];
              
              doc.text(totalDrops > 0 ? totalDrops.toString() : '-', xPos, yPos);
              xPos += colWidths[5];
              
              // Set color based on status
              if (targetStatus === 'Met') {
                doc.setTextColor(34, 139, 34); // Green
              } else if (targetStatus === 'Valid Reason') {
                doc.setTextColor(218, 165, 32); // Yellow/Gold
              } else if (targetStatus === 'Below') {
                doc.setTextColor(220, 53, 69); // Red
              }
              doc.text(targetStatus, xPos, yPos);
              doc.setTextColor(40, 40, 40); // Reset color
              yPos += 5;
            }

            if (projectData.sessions.length > 50) {
              doc.setFontSize(8);
              doc.setTextColor(100, 100, 100);
              doc.text(`... and ${projectData.sessions.length - 50} more sessions`, margin + 5, yPos);
              yPos += 5;
            }

            yPos += 5;
          }
          yPos += 5;
        }
      }

      addFooter(doc, branding || {}, headerResult.accentColor);

      const dateStr = format(new Date(), 'yyyy-MM-dd');
      doc.save(`work-sessions-report-${dateStr}.pdf`);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoadingEmployees || isLoadingSessions) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t('performance.filters', 'Filters')}
              </CardTitle>
              <CardDescription>
                {t('performance.filterDescription', 'Filter work sessions by employee or date range')}
              </CardDescription>
            </div>
            {(selectedEmployee || fromDate || toDate) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => applyQuickFilter('clear')}
                data-testid="button-clear-filters"
              >
                <X className="w-4 h-4 mr-1" />
                {t('common.clearFilters', 'Clear Filters')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyQuickFilter('thisMonth')}
              data-testid="button-filter-this-month"
            >
              {t('performance.thisMonth', 'This Month')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyQuickFilter('lastMonth')}
              data-testid="button-filter-last-month"
            >
              {t('performance.lastMonth', 'Last Month')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyQuickFilter('last3Months')}
              data-testid="button-filter-last-3-months"
            >
              {t('performance.last3Months', 'Last 3 Months')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => applyQuickFilter('thisYear')}
              data-testid="button-filter-this-year"
            >
              {t('performance.thisYear', 'This Year')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('performance.employee', 'Employee')}</Label>
              <Popover open={employeeSearchOpen} onOpenChange={setEmployeeSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={employeeSearchOpen}
                    className="w-full justify-between"
                    data-testid="button-select-employee"
                  >
                    {selectedEmployee ? (
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {selectedEmployee.name || selectedEmployee.email}
                        {selectedEmployee.status === 'terminated' && (
                          <Badge variant="secondary" className="text-xs">
                            {t('common.archived', 'Archived')}
                          </Badge>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {t('performance.allEmployees', 'All Employees')}
                      </span>
                    )}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t('performance.searchEmployee', 'Search employee...')} />
                    <CommandList>
                      <CommandEmpty>{t('common.noResults', 'No results found.')}</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all-employees"
                          onSelect={() => {
                            setSelectedEmployee(null);
                            setEmployeeSearchOpen(false);
                          }}
                          data-testid="employee-option-all"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          {t('performance.allEmployees', 'All Employees')}
                        </CommandItem>
                      </CommandGroup>
                      <CommandGroup heading={t('performance.activeEmployees', 'Active Employees')}>
                        {employees.filter(e => e.status === 'active').map((employee) => (
                          <CommandItem
                            key={employee.id}
                            value={employee.name || employee.email || employee.id}
                            onSelect={() => {
                              setSelectedEmployee(employee);
                              setEmployeeSearchOpen(false);
                            }}
                            data-testid={`employee-option-${employee.id}`}
                          >
                            <User className="mr-2 h-4 w-4" />
                            {employee.name || employee.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {employees.some(e => e.status !== 'active') && (
                        <CommandGroup heading={t('performance.archivedEmployees', 'Archived Employees')}>
                          {employees.filter(e => e.status !== 'active').map((employee) => (
                            <CommandItem
                              key={employee.id}
                              value={employee.name || employee.email || employee.id}
                              onSelect={() => {
                                setSelectedEmployee(employee);
                                setEmployeeSearchOpen(false);
                              }}
                              data-testid={`employee-option-archived-${employee.id}`}
                            >
                              <User className="mr-2 h-4 w-4 opacity-50" />
                              <span className="opacity-70">{employee.name || employee.email}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {t('common.archived', 'Archived')}
                              </Badge>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t('performance.fromDate', 'From Date')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    data-testid="button-from-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, 'MMM d, yyyy') : t('common.selectDate', 'Select date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t('performance.toDate', 'To Date')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    data-testid="button-to-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, 'MMM d, yyyy') : t('common.selectDate', 'Select date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('performance.workSessions', 'Work Sessions')}
              </CardTitle>
              <CardDescription>
                {totalSessions > 0 
                  ? t('performance.sessionsSummary', '{{count}} sessions totaling {{hours}}', {
                      count: totalSessions,
                      hours: formatDuration(totalHours)
                    })
                  : t('performance.noSessions', 'No work sessions found')
                }
              </CardDescription>
            </div>
            {totalSessions > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  data-testid="button-print"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  {t('common.print', 'Print')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  data-testid="button-export-pdf"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting 
                    ? t('common.exporting', 'Exporting...') 
                    : t('common.exportPDF', 'Export PDF')
                  }
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hierarchy.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {t('performance.noSessionsFound', 'No work sessions found for the selected filters.')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('performance.tryDifferentFilters', 'Try adjusting your filters or date range.')}
              </p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {hierarchy.map((yearData) => (
                <AccordionItem key={yearData.year} value={`year-${yearData.year}`}>
                  <AccordionTrigger className="hover:no-underline" data-testid={`accordion-year-${yearData.year}`}>
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="font-semibold">{yearData.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {yearData.months.reduce((sum, m) => sum + m.projects.reduce((ps, p) => ps + p.sessions.length, 0), 0)} sessions
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(yearData.totalHours)}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 border-l-2 border-muted space-y-2">
                      {yearData.months.map((monthData) => (
                        <Accordion key={monthData.month} type="multiple" className="w-full">
                          <AccordionItem value={`month-${yearData.year}-${monthData.month}`} className="border-b-0">
                            <AccordionTrigger className="hover:no-underline py-2" data-testid={`accordion-month-${yearData.year}-${monthData.month}`}>
                              <div className="flex items-center justify-between w-full pr-4">
                                <span className="font-medium">{monthData.monthName}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {monthData.projects.reduce((sum, p) => sum + p.sessions.length, 0)} sessions
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {formatDuration(monthData.totalHours)}
                                  </Badge>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-4 space-y-3">
                                {monthData.projects.map((projectData) => (
                                  <Accordion key={projectData.projectId} type="multiple" className="w-full">
                                    <AccordionItem value={`project-${projectData.projectId}`} className="border rounded-md">
                                      <AccordionTrigger className="hover:no-underline px-3 py-2" data-testid={`accordion-project-${projectData.projectId}`}>
                                        <div className="flex items-center justify-between w-full pr-4">
                                          <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{projectData.projectName}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                              {projectData.sessions.length}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                              {formatDuration(projectData.totalHours)}
                                            </Badge>
                                          </div>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <ScrollArea className="max-h-[400px]">
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>{t('common.date', 'Date')}</TableHead>
                                                <TableHead>{t('common.employee', 'Employee')}</TableHead>
                                                <TableHead>{t('performance.clockIn', 'Clock In')}</TableHead>
                                                <TableHead>{t('performance.clockOut', 'Clock Out')}</TableHead>
                                                <TableHead className="text-right">{t('performance.hours', 'Hours')}</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {projectData.sessions.map((session) => {
                                                const sessionHours = calculateSessionHours(session);
                                                return (
                                                  <TableRow key={session.id} data-testid={`row-session-${session.id}`}>
                                                    <TableCell>
                                                      {format(new Date(session.workDate), 'MMM d, yyyy')}
                                                    </TableCell>
                                                    <TableCell>
                                                      <div className="flex items-center gap-2">
                                                        <User className="w-3 h-3 text-muted-foreground" />
                                                        {session.employeeName || 'Unknown'}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell>
                                                      {session.startTime 
                                                        ? format(new Date(session.startTime), 'h:mm a')
                                                        : '-'
                                                      }
                                                    </TableCell>
                                                    <TableCell>
                                                      {session.endTime 
                                                        ? format(new Date(session.endTime), 'h:mm a')
                                                        : <Badge variant="outline" className="text-xs">{t('common.active', 'Active')}</Badge>
                                                      }
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                      {formatDuration(sessionHours)}
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}
                                            </TableBody>
                                          </Table>
                                        </ScrollArea>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

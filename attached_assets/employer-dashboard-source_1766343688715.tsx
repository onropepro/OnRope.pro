// EMPLOYER DASHBOARD - SOURCE REFERENCE
// This is a design reference implementation. Adapt patterns to your existing codebase.
// Do not copy-paste directly - use this to understand structure and styling decisions.

import { useState } from 'react'
import { 
  Users, 
  FolderKanban, 
  Calendar, 
  Package, 
  Shield, 
  DollarSign,
  FileText,
  Clock,
  Building2,
  MessageSquare,
  Settings,
  ChevronRight,
  AlertTriangle,
  BarChart3,
  Award,
  Wrench,
  Bell,
  Search,
  Plus,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  Briefcase,
  HardHat,
  ClipboardList
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// =============================================================================
// NAVIGATION STRUCTURE
// Key insight: Group modules by function, not by arbitrary categories
// =============================================================================
const navSections = [
  {
    title: 'Operations',
    items: [
      { id: 'projects', label: 'Projects', icon: FolderKanban, badge: 5 },
      { id: 'schedule', label: 'Schedule', icon: Calendar },
      { id: 'timesheets', label: 'Timesheets', icon: Clock, badge: 8, badgeType: 'alert' as const },
    ]
  },
  {
    title: 'Team',
    items: [
      { id: 'employees', label: 'Employees', icon: Users, badge: 3, badgeType: 'alert' as const },
      { id: 'certifications', label: 'Certifications', icon: Award },
      { id: 'job-board', label: 'Job Board', icon: Briefcase },
    ]
  },
  {
    title: 'Equipment',
    items: [
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'inspections', label: 'Inspections', icon: Shield, badge: 12, badgeType: 'alert' as const },
      { id: 'gear', label: 'Gear Management', icon: HardHat },
    ]
  },
  {
    title: 'Safety',
    items: [
      { id: 'safety-forms', label: 'Safety Forms', icon: ClipboardList, badge: 4, badgeType: 'alert' as const },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'training', label: 'Training', icon: Award },
    ]
  },
  {
    title: 'Financial',
    items: [
      { id: 'payroll', label: 'Payroll', icon: DollarSign },
      { id: 'quotes', label: 'Quotes & CRM', icon: FileText },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ]
  },
  {
    title: 'Communication',
    items: [
      { id: 'clients', label: 'Property Managers', icon: Building2 },
      { id: 'residents', label: 'Residents', icon: Home },
      { id: 'feedback', label: 'Feedback', icon: MessageSquare, badge: 2 },
    ]
  }
]

// =============================================================================
// ALERT DATA STRUCTURE
// Alerts should be clickable and lead directly to resolution
// =============================================================================
const alerts = [
  {
    id: '1',
    type: 'critical' as const,
    title: 'Expiring Certifications',
    description: '3 team members need renewal within 30 days',
    count: 3,
    action: 'Review',
    icon: Award
  },
  {
    id: '2',
    type: 'critical' as const,
    title: 'Overdue Inspections',
    description: '12 equipment items past due date',
    count: 12,
    action: 'Inspect',
    icon: Shield
  },
  {
    id: '3',
    type: 'warning' as const,
    title: 'Pending Timesheets',
    description: '8 submissions awaiting approval',
    count: 8,
    action: 'Approve',
    icon: Clock
  },
  {
    id: '4',
    type: 'warning' as const,
    title: 'Unsigned Documents',
    description: '4 safety forms need signatures',
    count: 4,
    action: 'Send',
    icon: FileText
  }
]

// =============================================================================
// METRICS - Show business health at a glance
// =============================================================================
const metrics = [
  { label: 'Active Projects', value: '12', change: 2, changeLabel: 'from last month' },
  { label: 'Team Utilization', value: '87%', change: 5, changeLabel: 'from last week' },
  { label: 'Revenue MTD', value: '$124.5K', change: 12, changeLabel: 'vs target' },
  { label: 'Safety Rating', value: '82%', change: -2, changeLabel: 'from last month' },
]

// =============================================================================
// PROJECTS - Active work front and center
// =============================================================================
const projects = [
  { id: '1', name: 'Pacific Centre Tower A', client: 'CBRE Property Management', status: 'active' as const, progress: 68, dueDate: 'Dec 28', team: 4 },
  { id: '2', name: 'Bentall 5 Annual', client: 'Brookfield Properties', status: 'active' as const, progress: 45, dueDate: 'Jan 5', team: 6 },
  { id: '3', name: 'Marine Building Facade', client: 'Oxford Properties', status: 'scheduled' as const, progress: 0, dueDate: 'Jan 12', team: 3 },
  { id: '4', name: 'TD Tower Q1 Maintenance', client: 'Cadillac Fairview', status: 'scheduled' as const, progress: 0, dueDate: 'Jan 20', team: 5 },
]

// =============================================================================
// TEAM ALERTS - People issues that need attention
// =============================================================================
const teamAlerts = [
  { name: 'Marcus Chen', initials: 'MC', issue: 'IRATA L2 expires Jan 15', daysLeft: 25 },
  { name: 'Sarah Williams', initials: 'SW', issue: 'First Aid expires Dec 30', daysLeft: 9 },
  { name: 'Jake Morrison', initials: 'JM', issue: 'SPRAT L3 expires Jan 8', daysLeft: 18 },
]

// =============================================================================
// TODAY'S SCHEDULE - What's happening right now
// =============================================================================
const todaySchedule = [
  { time: '07:00', project: 'Pacific Centre Tower A', task: 'Window cleaning - Floors 20-25', team: ['MC', 'SW'] },
  { time: '08:30', project: 'Bentall 5 Annual', task: 'Facade inspection - East side', team: ['JM', 'TK', 'AR'] },
  { time: '13:00', project: 'Pacific Centre Tower A', task: 'Window cleaning - Floors 26-30', team: ['MC', 'SW'] },
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================
function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [isLicenseValid] = useState(false)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased">
        
        {/* ================================================================= */}
        {/* SIDEBAR - Fixed left navigation                                   */}
        {/* Width: 240px (w-60), White background, subtle border              */}
        {/* ================================================================= */}
        <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col fixed h-full z-20">
          
          {/* Logo Area */}
          <div className="h-14 px-5 flex items-center border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#0B64A3] flex items-center justify-center">
                <span className="text-white font-bold text-xs">OR</span>
              </div>
              <span className="font-semibold text-slate-800 text-[15px]">OnRopePro</span>
            </div>
          </div>

          {/* Company Selector - Shows current company context */}
          <div className="px-3 py-3 border-b border-slate-100">
            <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                  AR
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800 leading-tight">Apex Rope Access</p>
                  <p className="text-[11px] text-slate-400">12 employees</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
            {/* Dashboard - Primary action, highlighted when active */}
            <button
              onClick={() => setActiveNav('dashboard')}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-all mb-3",
                activeNav === 'dashboard' 
                  ? "bg-[#0B64A3] text-white shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>

            {/* Grouped Navigation Sections */}
            {navSections.map((section) => (
              <div key={section.title} className="mb-4">
                <p className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </p>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] transition-all",
                      activeNav === item.id 
                        ? "bg-slate-100 text-slate-900 font-medium" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    {/* Badge for items needing attention */}
                    {item.badge && (
                      <span className={cn(
                        "min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold rounded",
                        item.badgeType === 'alert' 
                          ? "bg-rose-500 text-white" 
                          : "bg-slate-200 text-slate-600"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Settings at bottom */}
          <div className="p-3 border-t border-slate-100">
            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </aside>

        {/* ================================================================= */}
        {/* MAIN CONTENT AREA                                                 */}
        {/* Offset by sidebar width (ml-60)                                   */}
        {/* ================================================================= */}
        <main className="flex-1 ml-60">
          
          {/* Top Header Bar - Sticky */}
          <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-10">
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search projects, employees, equipment..." 
                  className="w-80 h-9 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B64A3]/20 focus:border-[#0B64A3] placeholder:text-slate-400"
                />
              </div>
            </div>
            
            {/* Right side: CSR, Notifications, User */}
            <div className="flex items-center gap-3">
              {/* CSR Score with Tooltip breakdown */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 transition-colors">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[13px] font-semibold text-emerald-700">82%</span>
                    <span className="text-[11px] text-emerald-600">CSR</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="p-4 w-56">
                  <p className="font-semibold text-slate-900 mb-3">Company Safety Rating</p>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Documentation</span>
                        <span className="font-medium text-slate-900">100%</span>
                      </div>
                      <Progress value={100} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Toolbox Meetings</span>
                        <span className="font-medium text-slate-900">67%</span>
                      </div>
                      <Progress value={67} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Inspections</span>
                        <span className="font-medium text-slate-900">79%</span>
                      </div>
                      <Progress value={79} className="h-1.5" />
                    </div>
                  </div>
                  <button className="w-full mt-3 pt-3 border-t border-slate-100 text-sm text-[#0B64A3] font-medium text-center hover:underline">
                    View CSR Details
                  </button>
                </TooltipContent>
              </Tooltip>

              {/* Notifications */}
              <button className="relative p-2 rounded-md hover:bg-slate-100 transition-colors">
                <Bell className="w-[18px] h-[18px] text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-[#0B64A3] flex items-center justify-center">
                  <span className="text-white text-sm font-medium">CO</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800 leading-tight">Company Owner</p>
                  <p className="text-[11px] text-slate-400">Admin</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            
            {/* =========================================================== */}
            {/* LICENSE WARNING BANNER                                       */}
            {/* Only show when license needs verification                    */}
            {/* =========================================================== */}
            {!isLicenseValid && (
              <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">Account in read-only mode</p>
                    <p className="text-sm text-amber-700">Verify your license to enable editing. Your team cannot log hours until verified.</p>
                  </div>
                </div>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white flex-shrink-0">
                  Verify License
                </Button>
              </div>
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Sunday, December 21, 2025</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
                  <Plus className="w-4 h-4" />
                  Quick Add
                </Button>
              </div>
            </div>

            {/* =========================================================== */}
            {/* ATTENTION REQUIRED - Alert Cards                             */}
            {/* Critical items use rose, warnings use amber                  */}
            {/* Each card is clickable and leads to resolution               */}
            {/* =========================================================== */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attention Required</h2>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {alerts.map((alert) => (
                  <button 
                    key={alert.id}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all hover:shadow-md group",
                      alert.type === 'critical' 
                        ? "bg-white border-rose-200 hover:border-rose-300" 
                        : "bg-white border-amber-200 hover:border-amber-300"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        alert.type === 'critical' ? "bg-rose-100" : "bg-amber-100"
                      )}>
                        <alert.icon className={cn(
                          "w-4 h-4",
                          alert.type === 'critical' ? "text-rose-600" : "text-amber-600"
                        )} />
                      </div>
                      <span className={cn(
                        "text-2xl font-bold",
                        alert.type === 'critical' ? "text-rose-600" : "text-amber-600"
                      )}>
                        {alert.count}
                      </span>
                    </div>
                    <p className="font-medium text-slate-800 text-sm mb-0.5">{alert.title}</p>
                    <p className="text-xs text-slate-500 mb-2">{alert.description}</p>
                    <span className={cn(
                      "text-xs font-medium flex items-center gap-1 group-hover:underline",
                      alert.type === 'critical' ? "text-rose-600" : "text-amber-600"
                    )}>
                      {alert.action}
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* =========================================================== */}
            {/* METRICS ROW                                                  */}
            {/* Key business indicators at a glance                          */}
            {/* =========================================================== */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {metrics.map((metric) => (
                <div key={metric.label} className="p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">{metric.label}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-semibold text-slate-900">{metric.value}</span>
                    <div className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      metric.change >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {metric.change >= 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {Math.abs(metric.change)}%
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{metric.changeLabel}</p>
                </div>
              ))}
            </div>

            {/* =========================================================== */}
            {/* MAIN CONTENT GRID                                            */}
            {/* 7-column projects list, 5-column right sidebar               */}
            {/* =========================================================== */}
            <div className="grid grid-cols-12 gap-5">
              
              {/* Active Projects List */}
              <div className="col-span-7 bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm">Active Projects</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 hover:text-slate-700">
                      View all
                    </Button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {projects.map((project) => (
                    <div key={project.id} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            project.status === 'active' ? "bg-emerald-500" : "bg-slate-300"
                          )} />
                          <span className="font-medium text-slate-800 text-sm">{project.name}</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pl-3.5">
                        <span className="text-xs text-slate-500">{project.client}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Users className="w-3 h-3" />
                            {project.team}
                          </div>
                          <span className="text-xs text-slate-400">Due {project.dueDate}</span>
                          {project.status === 'active' && (
                            <div className="flex items-center gap-1.5 w-20">
                              <Progress value={project.progress} className="h-1" />
                              <span className="text-xs text-slate-500 w-7">{project.progress}%</span>
                            </div>
                          )}
                          {project.status === 'scheduled' && (
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-slate-200 text-slate-500">
                              Scheduled
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Schedule & Team Alerts */}
              <div className="col-span-5 space-y-5">
                
                {/* Today's Schedule */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 text-sm">Today's Schedule</h3>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 hover:text-slate-700">
                      Full calendar
                    </Button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {todaySchedule.map((item, idx) => (
                      <div key={idx} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-medium text-slate-400 w-10 pt-0.5">{item.time}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{item.task}</p>
                            <p className="text-xs text-slate-500">{item.project}</p>
                            <div className="flex items-center gap-1 mt-1.5">
                              {item.team.map((member, i) => (
                                <div key={i} className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-medium text-slate-600 -ml-1 first:ml-0 border border-white">
                                  {member}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certification Alerts */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 text-sm">Certification Alerts</h3>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 hover:text-slate-700">
                      View all
                    </Button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {teamAlerts.map((alert, idx) => (
                      <div key={idx} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                            alert.daysLeft <= 10 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {alert.initials}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{alert.name}</p>
                            <p className="text-xs text-slate-500">{alert.issue}</p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "text-[10px] h-5 px-1.5",
                            alert.daysLeft <= 10 
                              ? "border-rose-200 text-rose-600 bg-rose-50" 
                              : "border-amber-200 text-amber-600 bg-amber-50"
                          )}>
                            {alert.daysLeft}d left
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================== */}
            {/* QUICK ACTIONS - Common workflows                             */}
            {/* =========================================================== */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
                  <Plus className="w-3.5 h-3.5" />
                  Add Employee
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5" />
                  Review Timesheets
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
                  <Shield className="w-3.5 h-3.5" />
                  Run Inspection
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
                  <FileText className="w-3.5 h-3.5" />
                  Create Quote
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-slate-600">
                  <FolderKanban className="w-3.5 h-3.5" />
                  New Project
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

export default App

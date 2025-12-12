import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Home,
  MessageSquare,
  Image,
  Link as LinkIcon,
  ArrowRight,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  Key,
  Users,
  Bell,
  Send,
  ThumbsUp,
  XCircle,
  Clock,
  Building2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ResidentPortalGuide() {
  return (
    <ChangelogGuideLayout 
      title="Resident Portal Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Resident Portal provides building residents with direct access to view project progress, submit feedback, and communicate with management. Residents link their accounts using a <strong>unique building code</strong> provided by the property manager or company.
          </p>
        </section>

        {/* THE GOLDEN RULE */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Key className="w-5 h-5" />
                The Golden Rule: Codes Link Residents
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Resident Code = Building Access
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Residents must link their accounts to view project information.</strong> The linking process requires:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Resident Account</strong>: Created with role "resident" at registration</li>
                  <li><strong>Building Code</strong>: Unique code generated per project</li>
                  <li><strong>Link Action</strong>: Resident enters code in Profile to connect</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Code Distribution
                </p>
                <p className="mt-1">Building codes are displayed on the project detail page. Property managers or company owners should share these codes with building residents through notices or strata communications.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Project Code</p>
                  <p className="font-bold">Tower West</p>
                  <p className="text-lg font-mono">ABC123</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Resident Links</p>
                  <p className="font-bold">Profile Page</p>
                  <p className="text-lg font-mono">Enter Code</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Access Granted</p>
                  <p className="font-bold">View Progress</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Submit Feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Problems Solved */}
        <section className="space-y-4">
          <Card className="border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2 text-green-900 dark:text-green-100">
                <CheckCircle2 className="w-5 h-5" />
                Problems Solved
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-900 dark:text-green-100">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Resident communication gaps:</strong> Direct portal access for project updates without phone calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Lost feedback records:</strong> Two-way messaging system with unit tracking and response history</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Work transparency issues:</strong> Photo galleries show before/after progress to residents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Access control complexity:</strong> Simple building codes link residents to their specific project</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Unread message tracking:</strong> Notification badges show pending responses to company staff</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Resident Features */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-action-600 dark:text-action-400" />
            What Residents Can Do
          </h2>
          <p className="text-base text-muted-foreground">Once linked, residents have access to several features:</p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-action-600" />
                  View Project Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                See the current status of maintenance work on their building, including job type, progress percentage, and scheduled dates.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  Submit Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Report issues or concerns about the work. Include their name, unit number, and detailed description of the problem.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Image className="w-4 h-4 text-purple-600" />
                  View Photo Gallery
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Browse before/after photos and progress images uploaded by technicians during the project.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-600" />
                  Communicate with Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                Post comments and receive replies from the management team through the job comments section.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FEEDBACK MANAGEMENT SYSTEM - Comprehensive Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 mb-2">
              <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              Feedback Management System
            </h2>
            <p className="text-muted-foreground">
              The feedback management system is the core communication bridge between building residents and your maintenance operations. It provides accountability, creates a paper trail, and ensures no resident concern goes unaddressed.
            </p>
          </div>

          {/* Problems Solved */}
          <Card className="border-2 border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-950/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Problems This System Solves
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Without This System</p>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>Feedback gets lost in emails or phone calls</li>
                        <li>No record of what was reported or when</li>
                        <li>Residents don't know if anyone is addressing their issue</li>
                        <li>Management can't track response times</li>
                        <li>Property managers have no visibility into tenant concerns</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">With This System</p>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>Every feedback item is logged with timestamp</li>
                        <li>Photo evidence attached to each report</li>
                        <li>Residents see real-time status updates</li>
                        <li>Complete audit trail for accountability</li>
                        <li>Management can track response times and quality</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-orange-900/30 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Bottom Line: This system transforms "he said, she said" disputes into documented, trackable conversations with clear accountability on both sides.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Access & Oversight Hierarchy */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-action-600 dark:text-action-400" />
              Who Can See What: Access Hierarchy
            </h3>
            <p className="text-base text-muted-foreground">
              The feedback system has carefully designed access levels to ensure privacy while maintaining oversight.
            </p>

            <div className="space-y-3">
              {/* Residents */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0">
                      <Home className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">Residents</h4>
                        <Badge variant="secondary" className="text-xs">Limited View</Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Submit new feedback with photos</p>
                        <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> View only their own feedback</p>
                        <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> See replies marked "visible to resident"</p>
                        <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Reopen closed feedback by replying</p>
                        <p className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Cannot see internal staff notes</p>
                        <p className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Cannot close feedback</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Staff */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-action-600 dark:text-action-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">Company Staff</h4>
                        <Badge variant="secondary" className="text-xs bg-action-500/10 text-action-700 dark:text-action-400">Full Access</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Technicians, Supervisors, Operations Managers, Company Owner</p>
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> View all feedback for their company's projects</p>
                        <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Add internal notes (staff-only, not visible to resident)</p>
                        <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Add visible replies (resident can see these)</p>
                        <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Change status: Open or Closed</p>
                        <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> See when feedback was first viewed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Managers */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">Property Managers</h4>
                        <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-400">No Direct Access</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Via "My Vendors" dashboard</p>
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Cannot view resident feedback</p>
                        <p className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Cannot respond to feedback</p>
                        <p className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Cannot see feedback history or notes</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 italic">
                        Feedback management is handled directly between residents and the rope access company. Property managers can view general vendor information through their dashboard but do not have access to feedback data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Two-Track Communication System */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Two-Track Communication System
            </h3>
            <p className="text-base text-muted-foreground">
              Staff can add two types of notes to feedback. This allows internal coordination without exposing sensitive discussions to residents.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-2 border-slate-300 dark:border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    Internal Notes
                    <Badge variant="secondary" className="text-xs">Staff Only</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-base space-y-2">
                  <p className="text-muted-foreground">Private notes visible only to company staff. Use for:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Coordination between team members</li>
                    <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Investigation notes</li>
                    <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Scheduling discussions</li>
                    <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Sensitive information</li>
                  </ul>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded p-2 mt-3">
                    <p className="text-xs font-medium">Example: "Checked with John - issue is from previous contractor, not our work. Need to document for liability."</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-300 dark:border-emerald-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Visible Replies
                    <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Resident Sees</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-base space-y-2">
                  <p className="text-muted-foreground">Responses the resident can read. Use for:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Acknowledging the feedback</li>
                    <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Providing status updates</li>
                    <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Asking follow-up questions</li>
                    <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Confirming resolution</li>
                  </ul>
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded p-2 mt-3">
                    <p className="text-xs font-medium">Example: "Thank you for reporting this. Our team will address the water stain during tomorrow's scheduled visit."</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Feedback Workflow - Enhanced */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Feedback Lifecycle
            </h3>
            <p className="text-base text-muted-foreground">
              Every feedback item goes through a defined lifecycle with clear status indicators at each stage.
            </p>
          </div>

          <div className="space-y-3">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Resident Submits Feedback</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Resident fills out form with name, unit number, phone number, and detailed description. <strong>Can attach photo evidence</strong> (water damage, scratches, etc.).
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">Name</Badge>
                      <Badge variant="outline" className="text-xs">Unit #</Badge>
                      <Badge variant="outline" className="text-xs">Phone</Badge>
                      <Badge variant="outline" className="text-xs">Description</Badge>
                      <Badge variant="outline" className="text-xs">Photo (optional)</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      Feedback Appears in Dashboard
                      <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs">New</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Management sees new feedback in the project's "Resident Feedback" section with "New" badge. Notification badge appears.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      Management Reviews
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Viewed</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      When management opens the feedback, it's marked as "Viewed" with timestamp. They can add replies and update status.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-emerald-500 rotate-[135deg]" />
                <span className="text-xs text-emerald-600 mt-1">Resolve</span>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-action-500 rotate-45" />
                <span className="text-xs text-action-600 mt-1">Reply</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Closed</h3>
                      <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                        Issue resolved. Resident can view final status and visible management replies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-6 h-6 text-action-600 dark:text-action-400 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-action-900 dark:text-action-100">Ongoing Communication</h3>
                      <p className="text-sm text-action-800 dark:text-action-200 mt-1">
                        Two-way messaging continues until issue is resolved.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reopen Flow */}
            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 mt-4">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400 rotate-180" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                      Resident Can Reopen
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">Important</Badge>
                    </h3>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                      If a resident is not satisfied with the resolution, they can <strong>reply to closed feedback</strong>. This automatically reopens the feedback and changes status back to "Open".
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                      This ensures residents always have a way to follow up if issues persist after closure.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Linking Process */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Account Linking Process
          </h2>

          <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-purple-900 dark:text-purple-100">
                      How Residents Link Their Accounts
                    </p>
                    <p className="text-purple-800 dark:text-purple-200">
                      Residents receive a building code from their property manager or strata. They can link using two methods:
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white dark:bg-purple-900 rounded p-3">
                    <p className="font-semibold text-purple-900 dark:text-purple-100">Method 1: Direct Link</p>
                    <p className="mt-2 text-purple-800 dark:text-purple-200">
                      Visit <code className="bg-purple-100 dark:bg-purple-800 px-1 rounded">/link?code=ABC123</code>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Code auto-fills in profile form</p>
                  </div>
                  <div className="bg-white dark:bg-purple-900 rounded p-3">
                    <p className="font-semibold text-purple-900 dark:text-purple-100">Method 2: Profile Page</p>
                    <p className="mt-2 text-purple-800 dark:text-purple-200">
                      Navigate to Profile and enter code in "Link to Company" field
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Click "Update Profile" to link</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Notification System */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
            Notification Badges
          </h2>

          <div className="space-y-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">3</Badge>
                  </div>
                  <div>
                    <p className="font-semibold">New Feedback Badges</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      When new feedback is submitted, a notification badge appears in the project's feedback section. The number indicates unread feedback.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs">New</Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Viewed</Badge>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">Closed</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Each feedback item shows its current status. "New" for unread, "Viewed" when management has opened it, "Closed" when resolved.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quick Reference */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-action-600 dark:text-action-400" />
            Quick Reference
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Feature</th>
                      <th className="text-left py-2 font-semibold">Resident Access</th>
                      <th className="text-left py-2 font-semibold">Management Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Project Progress</td>
                      <td className="py-2">View only</td>
                      <td className="py-2">View and update</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Submit Feedback</td>
                      <td className="py-2">Create and view own</td>
                      <td className="py-2">View all, respond, close</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Photo Gallery</td>
                      <td className="py-2">View only</td>
                      <td className="py-2">Upload and manage</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Job Comments</td>
                      <td className="py-2">Post and view</td>
                      <td className="py-2">Post and view</td>
                    </tr>
                    <tr>
                      <td className="py-2">Building Code</td>
                      <td className="py-2">Use to link account</td>
                      <td className="py-2">Generate and share</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Customer Journeys */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-cyan-700 dark:text-cyan-300">Resident Journey</h3>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 rounded-lg p-6 border border-cyan-200 dark:border-cyan-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Get Code</p>
                      <p className="text-xs text-muted-foreground">From property manager</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-cyan-600 dark:text-cyan-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Link Account</p>
                      <p className="text-xs text-muted-foreground">Enter code in profile</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-cyan-600 dark:text-cyan-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">View Progress</p>
                      <p className="text-xs text-muted-foreground">Track project status</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-cyan-600 dark:text-cyan-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Submit Feedback</p>
                      <p className="text-xs text-muted-foreground">Report issues</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-green-700 dark:text-green-300">Management Response Journey</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Receive Alert</p>
                      <p className="text-xs text-muted-foreground">New feedback badge</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Review Issue</p>
                      <p className="text-xs text-muted-foreground">Mark as viewed</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Respond</p>
                      <p className="text-xs text-muted-foreground">Add reply message</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Close Issue</p>
                      <p className="text-xs text-muted-foreground">Mark resolved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Key className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Code-Based Linking</p>
                <p className="text-base text-muted-foreground">Secure building access via unique codes.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <MessageSquare className="w-5 h-5 text-action-600 dark:text-action-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Two-Way Communication</p>
                <p className="text-base text-muted-foreground">Residents and staff exchange messages with full history.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Image className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Photo Evidence</p>
                <p className="text-base text-muted-foreground">Attach photos to feedback for documentation.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Bell className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Status Tracking</p>
                <p className="text-base text-muted-foreground">New, Viewed, Closed status badges.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Internal Notes</p>
                <p className="text-base text-muted-foreground">Staff-only notes hidden from residents.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 rotate-180" />
              <div>
                <p className="font-semibold">Reopen Feedback</p>
                <p className="text-base text-muted-foreground">Residents can reopen closed issues by replying.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Audit Trail</p>
                <p className="text-base text-muted-foreground">Timestamps for submissions, views, and responses.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Multi-Level Visibility</p>
                <p className="text-base text-muted-foreground">Staff see all, residents see their own.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Quick Links */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/residents">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-residents">

              <div className="text-left">
                <div className="font-semibold">Resident Management</div>
                <div className="text-xs text-muted-foreground">View and manage feedback</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>

            <Link href="/changelog/branding">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-branding-guide">

              <div className="text-left">
                <div className="font-semibold">Branding Guide</div>
                <div className="text-xs text-muted-foreground">White-label customization</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-base text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for the Resident Portal System.</p>
          </CardContent>
        </Card>
      </div>
    </ChangelogGuideLayout>
  );
}

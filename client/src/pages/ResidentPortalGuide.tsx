import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
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

export default function ResidentPortalGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-xl font-bold">Resident Portal Guide</h1>
              <p className="text-xs text-muted-foreground">Resident access, complaints, and communication</p>
            </div>
          </div>
          <MainMenuButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Overview */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Home className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              Resident Portal Overview
            </h2>
            <p className="text-muted-foreground">
              The Resident Portal provides building residents with direct access to view project progress, submit feedback, and communicate with management. Residents link their accounts using a <strong>unique building code</strong> provided by the property manager or company.
            </p>
          </div>
        </section>

        <Separator />

        {/* THE GOLDEN RULE */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Key className="w-5 h-5" />
                The Golden Rule: Codes Link Residents
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-2xl font-mono font-bold">
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

        <Separator />

        {/* Resident Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            What Residents Can Do
          </h2>
          <p className="text-sm text-muted-foreground">Once linked, residents have access to several features:</p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  View Project Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                See the current status of maintenance work on their building, including job type, progress percentage, and scheduled dates.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  Submit Complaints
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
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
              <CardContent className="text-sm text-muted-foreground">
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
              <CardContent className="text-sm text-muted-foreground">
                Post comments and receive replies from the management team through the job comments section.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Complaint Workflow */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Complaint Submission Workflow
          </h2>

          <div className="space-y-3">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Resident Submits Complaint</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Resident fills out complaint form with their name, unit number, contact info, and issue description. Can attach photos.
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
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      Complaint Appears in Feedback
                      <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs">New</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Management sees new complaint in the project's "Resident Feedback" section with "New" badge. Notification badge appears.
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
                      When management opens the complaint, it's marked as "Viewed" with timestamp. They can add replies and update status.
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
                <ArrowRight className="w-5 h-5 text-blue-500 rotate-45" />
                <span className="text-xs text-blue-600 mt-1">Reply</span>
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
                        Issue resolved. Resident can view final status and any management notes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">Ongoing Communication</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                        Two-way messaging continues until issue is resolved.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Linking Process */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
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
          <h2 className="text-xl font-bold flex items-center gap-2">
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
                    <p className="font-semibold">New Complaint Badges</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      When new complaints are submitted, a notification badge appears in the project's feedback section. The number indicates unread complaints.
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
                  Each complaint shows its current status. "New" for unread, "Viewed" when management has opened it, "Closed" when resolved.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quick Reference */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                      <td className="py-2">Submit Complaints</td>
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
          <h2 className="text-xl font-bold flex items-center gap-2">
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
                      <p className="text-xs text-muted-foreground">New complaint badge</p>
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
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Key className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Code-Based Linking</p>
                <p className="text-sm text-muted-foreground">Secure building access via unique codes.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Two-Way Communication</p>
                <p className="text-sm text-muted-foreground">Residents and management can message.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Image className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Photo Gallery Access</p>
                <p className="text-sm text-muted-foreground">View progress and before/after images.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Bell className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Notification Badges</p>
                <p className="text-sm text-muted-foreground">Visual alerts for new complaints.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Quick Links */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/residents")}
              data-testid="link-residents"
            >
              <div className="text-left">
                <div className="font-semibold">Resident Management</div>
                <div className="text-xs text-muted-foreground">View and manage complaints</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/changelog/branding")}
              data-testid="link-branding-guide"
            >
              <div className="text-left">
                <div className="font-semibold">Branding Guide</div>
                <div className="text-xs text-muted-foreground">White-label customization</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for the Resident Portal System.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

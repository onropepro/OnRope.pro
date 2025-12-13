import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  FileText,
  FolderOpen,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Upload,
  Download,
  Eye,
  Lock,
  Users,
  FileCheck,
  Signature,
  AlertTriangle,
  Info,
  Calendar,
  Archive,
  ClipboardCheck,
  BookOpen,
  FileWarning,
  PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentManagementGuide() {
  return (
    <ChangelogGuideLayout 
      title="Document Management Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Document Management system provides centralized storage for all company documents with compliance tracking, employee acknowledgment workflows, and role-based access controls. Access it from the Documents section in your dashboard.
          </p>
        </section>

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Signature className="w-5 h-5" />
                The Golden Rule: Signatures Create Accountability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Document + Signature = Compliance Record
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Every document acknowledgment creates a permanent record.</strong> The system tracks:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Who</strong>: The employee who reviewed and signed</li>
                  <li><strong>When</strong>: Timestamp of acknowledgment</li>
                  <li><strong>What</strong>: The specific document version reviewed</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Audit Trail Protection
                </p>
                <p className="mt-1">Signature records cannot be deleted or modified. This creates an immutable audit trail for safety compliance and regulatory requirements.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved */}
        <section className="space-y-4">
          <Card className="border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-green-900 dark:text-green-100">
                <CheckCircle2 className="w-5 h-5" />
                Problems Solved
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-900 dark:text-green-100">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Missing acknowledgments:</strong> Digital signature tracking ensures every employee has reviewed required policies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Version control chaos:</strong> Centralized document storage with clear ownership and access controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Compliance audit failures:</strong> Immutable audit trail of who signed what and when</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Scattered file storage:</strong> All safety manuals, policies, and training docs in one location</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>CSR impact tracking:</strong> Document acknowledgment rates feed directly into Company Safety Rating</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-action-600 dark:text-action-400" />
            Document Categories
          </h2>
          <p className="text-muted-foreground text-sm">
            Documents are organized into categories with different access levels and workflows.
          </p>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-action-600" />
                  Health & Safety Manual
                </CardTitle>
                <CardDescription>Core safety documentation requiring employee acknowledgment</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Upload company health and safety manual</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Track employee acknowledgment status</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Digital signature capture</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                  Company Policies
                </CardTitle>
                <CardDescription>Policy documents with signature tracking</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Multiple policy document support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Employee signature tracking per document</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Compliance status reporting</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  Certificate of Insurance
                </CardTitle>
                <CardDescription>Restricted access for sensitive documents</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Upload insurance certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Expiration date tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Restricted visibility</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="destructive">Owner/Manager Only</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-orange-600" />
                  Safe Work Procedures
                </CardTitle>
                <CardDescription>10 pre-built templates with PDF generation</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>10 industry-standard procedure templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Professional PDF export</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Customizable content</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Safe Work Practices
                </CardTitle>
                <CardDescription>10 daily safety topics with acknowledgment</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>10 daily safety practice topics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Employee acknowledgment and sign-off</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Contributes to Company Safety Rating (CSR)</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-amber-600" />
                  Damage Reports
                </CardTitle>
                <CardDescription>Equipment damage documentation with serial number linking</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Link to specific equipment serial numbers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Damage description and severity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Follow-up action tracking</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">All Employees</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <PenTool className="w-5 h-5 text-action-600 dark:text-action-400" />
            Document Review Workflow
          </h2>

          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-action-600 dark:text-action-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Manager Uploads Document</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Company owner or operations manager uploads the document with title and description. File type validation ensures only appropriate formats are accepted.
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
                  <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-action-600 dark:text-action-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Employees Access Documents</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Employees navigate to the Documents section and view available documents. Collapsible sections organize documents by category for easy navigation.
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
                  <div className="w-10 h-10 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-action-600 dark:text-action-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Review & Sign</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      After reviewing the document content, employees provide their digital signature to acknowledge understanding. The signature is captured and stored securely.
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
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Compliance Record Created</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A permanent compliance record is created with employee name, signature, and timestamp. Managers can view compliance reports showing who has signed which documents.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-action-600 dark:text-action-400" />
            Export & Reporting
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold">Compliance Reports</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Employee signature status overview</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Missing acknowledgment alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Download signature reports</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-semibold">Bulk Export</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-teal-500" />
                  <span>Date range selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-teal-500" />
                  <span>ZIP file download</span>
                </div>
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-teal-500" />
                  <span>Professional PDF formatting</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Eye className="w-5 h-5 text-action-600 dark:text-action-400" />
            Role-Based Access
          </h2>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 dark:text-action-400 mt-0.5 shrink-0" />
                <div className="space-y-3 text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    Document Visibility Rules
                  </p>
                  <div className="space-y-2 text-blue-800 dark:text-blue-200">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Company Owner</Badge>
                      <span>Full access to all documents including insurance certificates</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Ops Manager</Badge>
                      <span>Access to all documents except restricted financial documents</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Supervisor</Badge>
                      <span>Access to safety documents, procedures, and team compliance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Technician</Badge>
                      <span>Access to safety documents and personal compliance tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Quick Reference
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Document Type</th>
                      <th className="text-left py-2 font-semibold">Requires Signature</th>
                      <th className="text-left py-2 font-semibold">Access Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2">Health & Safety Manual</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Company Policies</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Certificate of Insurance</td>
                      <td className="py-2"><Badge variant="secondary">No</Badge></td>
                      <td className="py-2"><Badge variant="destructive">Restricted</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Safe Work Procedures</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Safe Work Practices</td>
                      <td className="py-2"><Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Yes</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2">Damage Reports</td>
                      <td className="py-2"><Badge variant="secondary">No</Badge></td>
                      <td className="py-2"><Badge variant="outline">All Employees</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

              </div>
    </ChangelogGuideLayout>
  );
}

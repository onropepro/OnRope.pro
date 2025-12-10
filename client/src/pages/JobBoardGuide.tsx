import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase,
  Building2,
  HardHat,
  Eye,
  FileText,
  Award,
  Search,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  XCircle,
  Star,
  Info,
  Users
} from "lucide-react";

export default function JobBoardGuide() {
  return (
    <ChangelogGuideLayout
      title="Job Board Ecosystem Guide"
      version="1.0"
      lastUpdated="December 10, 2025"
    >
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-success-500" />
            <h2 className="text-2xl md:text-3xl font-bold">Job Board Overview</h2>
          </div>
          <p className="text-muted-foreground text-base mb-4">
            The Job Board Ecosystem connects rope access technicians with employment opportunities across the platform. Companies and SuperUsers can post jobs, while technicians can browse listings, apply directly, and make their profiles visible to potential employers.
          </p>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">For Employers</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-action-500" />
                  Posting Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p className="text-muted-foreground">Companies and SuperUsers can create job postings with:</p>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="bg-muted p-3 rounded">
                    <p className="font-semibold text-sm mb-1">Job Details</p>
                    <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                      <li>Job title and description</li>
                      <li>Location (city/region)</li>
                      <li>Salary range (optional)</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="font-semibold text-sm mb-1">Requirements</p>
                    <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                      <li>Required certifications (IRATA/SPRAT)</li>
                      <li>Experience level</li>
                      <li>Special skills</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-warning-500" />
                  Job Types & Employment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Full-time</Badge>
                  <Badge variant="secondary">Part-time</Badge>
                  <Badge variant="secondary">Contract</Badge>
                  <Badge variant="secondary">Seasonal</Badge>
                  <Badge variant="secondary">Project-based</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-success-500" />
                  Candidate Browser
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Browse technicians who have enabled profile visibility:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>View resume/CV documents</li>
                  <li>Safety rating scores</li>
                  <li>Years of experience</li>
                  <li>IRATA/SPRAT certification details</li>
                  <li>Profile photo and contact info</li>
                  <li>Rope access specialties</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <HardHat className="w-6 h-6 text-warning-500" />
            <h2 className="text-xl md:text-2xl font-semibold">For Technicians</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-action-500" />
                  Browsing Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Technicians can search and filter job listings:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Filter by job type (full-time, contract, etc.)</li>
                  <li>Filter by location</li>
                  <li>Filter by required certifications</li>
                  <li>View company details and job requirements</li>
                  <li>See salary ranges when provided</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5 text-success-500" />
                  Applying to Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Direct application submission:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>One-click application with profile data</li>
                  <li>Cover letter option</li>
                  <li>Resume automatically attached</li>
                  <li>Application status tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  Profile Visibility Toggle
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-amber-800 dark:text-amber-200">
                  Technicians can opt-in to make their profile visible to employers:
                </p>
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded">
                  <p className="font-semibold text-sm mb-1">When Visible, Employers See:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Resume/CV documents</li>
                    <li>Safety rating</li>
                    <li>Name and photo</li>
                    <li>Years of experience</li>
                    <li>IRATA/SPRAT certification numbers and levels</li>
                    <li>Rope access specialties</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Application Status Tracking</h2>
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="w-8 h-8 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-action-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Pending</p>
                    <p className="text-muted-foreground text-xs">Application submitted, awaiting review</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-warning-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Reviewed</p>
                    <p className="text-muted-foreground text-xs">Employer has viewed application</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Contacted</p>
                    <p className="text-muted-foreground text-xs">Employer has reached out</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="w-8 h-8 rounded-full bg-rust-100 dark:bg-rust-900 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-rust-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rejected</p>
                    <p className="text-muted-foreground text-xs">Application not selected</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">SuperUser Management</h2>
          </div>

          <Card>
            <CardContent className="pt-4 text-base space-y-3">
              <p className="text-muted-foreground">
                SuperUsers have platform-wide oversight of the job board:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Post platform-wide job listings</li>
                <li>Moderate job postings from companies</li>
                <li>View all applications across the platform</li>
                <li>Access candidate database</li>
                <li>Monitor job board activity and metrics</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Access Requirements</p>
                  <p className="text-base text-muted-foreground">
                    Job posting requires Company Owner or Operations Manager role. All technicians can browse jobs and manage their profile visibility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}

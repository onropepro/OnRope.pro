import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  HardHat,
  User,
  Award,
  MapPin,
  CreditCard,
  Gift,
  Star,
  Shield,
  Bell,
  Building2,
  FileText,
  Eye,
  CheckCircle2,
  Info
} from "lucide-react";

export default function TechnicianRegistrationGuide() {
  return (
    <ChangelogGuideLayout
      title="Technician Self-Registration Guide"
      version="1.0"
      lastUpdated="December 10, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Technician Self-Registration system allows IRATA and SPRAT technicians to create their own accounts on the platform. The streamlined 4-screen registration process collects essential information while minimizing friction.
          </p>
          
          <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-action-900 dark:text-action-100">Simplified Flow</p>
                  <p className="text-base text-action-800 dark:text-action-200">
                    Registration was reduced from 20 screens to just 4 screens, collecting only essential fields upfront. Additional details can be added later in the Technician Portal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Registration Screens</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-action-500" />
                    Screen 1: Personal Info
                  </CardTitle>
                  <Badge variant="secondary">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Full name (first and last)</li>
                  <li>Email address</li>
                  <li>Password (minimum 8 characters)</li>
                  <li>Phone number</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Screen 2: Certification Info
                  </CardTitle>
                  <Badge variant="secondary">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>IRATA certification level (1, 2, or 3)</li>
                  <li>IRATA license number</li>
                  <li>IRATA expiration date</li>
                  <li>Optional: SPRAT certification level and details</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rust-500" />
                    Screen 3: Contact Info
                  </CardTitle>
                  <Badge variant="secondary">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Address with Geoapify autocomplete:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Street address (auto-filled from autocomplete)</li>
                  <li>City</li>
                  <li>Province/State</li>
                  <li>Country</li>
                  <li>Postal/ZIP code</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-success-500" />
                    Screen 4: Financial Info
                  </CardTitle>
                  <Badge variant="secondary">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Payroll-ready information (encrypted at rest):</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Social Insurance Number (SIN) - AES-256-GCM encrypted</li>
                  <li>Banking details for direct deposit</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Referral System</h2>
          </div>

          <Card>
            <CardContent className="pt-4 text-base space-y-3">
              <p className="text-muted-foreground">
                Each registered technician receives a unique 12-character referral code they can share with other technicians.
              </p>
              
              <div className="bg-muted p-3 rounded space-y-2">
                <p className="font-semibold text-sm">How It Works:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Technician shares their referral code with a colleague</li>
                  <li>Colleague enters the code during registration</li>
                  <li>The original technician (code sharer) receives PLUS upgrade</li>
                  <li>One-sided benefit: Only the referrer gets PLUS, not the referee</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-600/20 dark:text-amber-300">
                  Referral Count Tracked
                </Badge>
                <span className="text-muted-foreground text-sm">Technicians can see how many people used their code</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Technician PLUS Access</h2>
          </div>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950 dark:to-amber-900/50 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500 text-white">PRO</Badge>
                <CardTitle className="text-lg">Premium Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-base space-y-3">
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Certification Expiry Alerts</p>
                    <p className="text-muted-foreground text-sm">60-day yellow badge, 30-day red badge with banner warning</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Unlimited Employer Connections</p>
                    <p className="text-muted-foreground text-sm">Connect with multiple companies simultaneously</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Enhanced IRATA Task Logging</p>
                    <p className="text-muted-foreground text-sm">Advanced tracking for certification progression</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Profile Visibility</p>
                    <p className="text-muted-foreground text-sm">Enhanced visibility to employers on Job Board</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-black/20 p-3 rounded mt-3">
                <p className="text-sm text-muted-foreground">
                  PLUS members display a gold "PRO" badge next to their name in both the Technician Portal and Dashboard employee cards.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">After Registration</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Technician Portal Access</CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Personal profile management</li>
                  <li>Resume/CV uploads with preview</li>
                  <li>Certification tracking</li>
                  <li>Logged hours history</li>
                  <li>Personal gear assignments</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Company Invitations</CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>View pending invitations from companies</li>
                  <li>Accept or decline team invitations</li>
                  <li>Once accepted, access Work Dashboard</li>
                  <li>PLUS: Connect with multiple employers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Bilingual Support</p>
                  <p className="text-base text-muted-foreground">
                    The entire registration flow supports English and French. Users can toggle language at any time, and their preference is saved to their profile.
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

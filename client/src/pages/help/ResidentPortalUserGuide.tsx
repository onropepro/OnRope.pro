import { Link } from 'wouter';
import { 
  Home, 
  ArrowLeft, 
  MessageSquare, 
  Camera, 
  Eye,
  Clock,
  Lock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import companyCodeImage from '@assets/residents_company_code.png';
import { PublicHeader } from '@/components/PublicHeader';

export default function ResidentPortalUserGuide() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader activeNav="resident" />
      <div className="bg-gradient-to-br from-[#86A59C] to-[#6B8A80] text-white">
        <div className="container mx-auto px-4 py-8">
          <Link href="/help/for-residents">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 mb-4" data-testid="button-back-residents">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Residents Help
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
              <Home className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Resident Portal User Guide</h1>
              <p className="text-white/80 mt-1">Complete guide to using the Resident Portal</p>
            </div>
          </div>
        </div>
        <div className="h-16 bg-background" style={{ clipPath: 'ellipse(70% 100% at 50% 100%)' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <Card className="border-[#86A59C]/30">
          <CardContent className="pt-6 space-y-6">
            <p className="text-lg leading-relaxed">
              The Resident Portal gives you direct access to view maintenance work progress on your building and communicate directly with the service company. No more wondering when work will be done or whether your concerns were received.
            </p>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-[#86A59C]" />
                Getting Started
              </h2>
              
              <div className="bg-muted/30 rounded-lg p-5 space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-lg">Creating Your Account</h3>
                  <p className="text-muted-foreground mb-3">
                    To sign up for an account, go to: <Link href="/resident"><span className="text-[#86A59C] underline font-medium">onrope.pro/resident</span></Link>
                  </p>
                  <p className="text-muted-foreground mb-2">You'll need to provide:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li><strong>Full name</strong></li>
                    <li><strong>Email</strong></li>
                    <li><strong>Phone number</strong></li>
                    <li><strong>Strata plan / HOA / LMS number</strong> - Your building's strata plan identifier</li>
                    <li><strong>Unit number</strong> - Your apartment or suite number</li>
                    <li><strong>Parking stall</strong> (optional)</li>
                    <li><strong>Password</strong> - Create a secure password for your account</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> If you move to a different unit or building, you can easily update your account by changing your strata plan number and unit number. Your account stays with you.
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-5 space-y-4">
                <h3 className="font-medium text-lg">Entering Your Company Code</h3>
                <p className="text-muted-foreground">
                  After logging in for the first time, you'll need to enter a <strong>10-character Company Code</strong> to complete your portal setup.
                </p>
                <p className="text-muted-foreground">The company code:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                  <li><strong>Binds your account to the company</strong> working on your building</li>
                  <li><strong>Enables you to see active work</strong> - without it, your control panel will be empty</li>
                  <li>Is a 10-character code provided by your building manager or the service company</li>
                </ul>
                
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={companyCodeImage} 
                    alt="Where to add your company code" 
                    className="w-full"
                  />
                  <p className="text-sm text-center text-muted-foreground py-2 bg-muted/50">Where to add your company code</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200">
                    <strong>Important:</strong> Active work and building information won't appear in your control panel until you've entered the company code.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#86A59C]" />
                What You Can Do
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#86A59C]" />
                    View Project Progress
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Real-time progress updates showing which elevations are complete</li>
                    <li>Project schedules with expected completion dates</li>
                    <li>Progress bars for each elevation</li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#86A59C]" />
                    Submit Feedback
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Report issues, concerns, or compliments</li>
                    <li>Attach photos for visual issues</li>
                    <li>Automatically timestamped and tracked</li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#86A59C]" />
                    Track Your Feedback
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>View all your submitted feedback in one place</li>
                    <li>See current status (Open, In Progress, or Closed)</li>
                    <li>View management responses and updates</li>
                  </ul>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#86A59C]" />
                    Photo Evidence
                  </h3>
                  <p className="text-muted-foreground">
                    Clear photos help the team understand and resolve issues faster. Include photos showing the specific area of concern from multiple angles if possible.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Understanding Feedback Status</h2>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Open</span>
                  <span className="text-muted-foreground text-sm">- Awaiting review</span>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="font-medium">In Progress</span>
                  <span className="text-muted-foreground text-sm">- Being resolved</span>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="font-medium">Closed</span>
                  <span className="text-muted-foreground text-sm">- Issue resolved</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Key Benefits</h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Transparency</p>
                    <p className="text-sm text-muted-foreground">Everything is visible, timestamped, and tracked</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Faster Resolution</p>
                    <p className="text-sm text-muted-foreground">Average resolution time drops from 3-5 days to 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Visual Proof</p>
                    <p className="text-sm text-muted-foreground">Photo attachments provide clear evidence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Better Communication</p>
                    <p className="text-sm text-muted-foreground">Direct channel eliminates the telephone game</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Reduced Frustration</p>
                    <p className="text-sm text-muted-foreground">Real-time progress instead of guessing</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#86A59C]" />
                Privacy & Security
              </h2>
              <p className="text-muted-foreground mb-3">Your account and data are protected with:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Encrypted passwords</strong> using industry-standard security</li>
                <li><strong>Secure sessions</strong> with bank-level HTTPS encryption</li>
                <li><strong>Private feedback</strong> visible only to you and authorized management</li>
                <li><strong>Data isolation</strong> keeping your information separate and secure</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/resident">
                <Button className="bg-[#86A59C] hover:bg-[#6B8A80]" data-testid="button-access-portal">
                  Access Resident Portal
                </Button>
              </Link>
              <Link href="/help/for-residents">
                <Button variant="outline" data-testid="button-back-help">
                  Back to Residents Help
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

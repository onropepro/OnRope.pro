import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone,
  Monitor,
  Tablet,
  Hand,
  Menu,
  ArrowLeftRight,
  Maximize2,
  ChevronDown,
  Navigation,
  CheckCircle2
} from "lucide-react";

export default function MobileDesignGuide() {
  return (
    <ChangelogGuideLayout
      title="Mobile-First Design Guide"
      version="1.0"
      lastUpdated="December 10, 2025"
    >
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-action-500" />
            <h2 className="text-2xl md:text-3xl font-bold">Mobile-First Philosophy</h2>
          </div>
          <p className="text-muted-foreground text-base mb-4">
            The platform is designed with a mobile-first approach, recognizing that rope access technicians primarily use their phones in the field for clock in/out, safety forms, and project updates. Every feature is optimized for mobile usage first, then enhanced for larger screens.
          </p>
          
          <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Hand className="w-5 h-5 text-action-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-action-900 dark:text-action-100">Field Worker Focus</p>
                  <p className="text-base text-action-800 dark:text-action-200">
                    Technicians on job sites need quick, thumb-friendly access to essential features. The interface prioritizes large touch targets and minimal typing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <ArrowLeftRight className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Responsive Breakpoints</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-action-500" />
                    Mobile
                  </CardTitle>
                  <Badge variant="secondary">320px - 639px</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Single column layouts</li>
                  <li>Full-width cards and buttons</li>
                  <li>Collapsed navigation (hamburger menu)</li>
                  <li>Bottom navigation for key actions</li>
                  <li>Stacked form fields</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tablet className="w-5 h-5 text-warning-500" />
                    Tablet
                  </CardTitle>
                  <Badge variant="secondary">640px - 1023px</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Two-column layouts where appropriate</li>
                  <li>Side-by-side form fields</li>
                  <li>Expanded navigation sidebar</li>
                  <li>Larger touch targets maintained</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-success-500" />
                    Desktop
                  </CardTitle>
                  <Badge variant="secondary">1024px+</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Multi-column layouts and grids</li>
                  <li>Persistent sidebar navigation</li>
                  <li>Data tables with horizontal scroll</li>
                  <li>Side-by-side panels and split views</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Hand className="w-6 h-6 text-warning-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Touch-Friendly Interface</h2>
          </div>

          <Card>
            <CardContent className="pt-4 text-base space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-semibold mb-2">Button Sizing</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Minimum touch target: 44x44 pixels</li>
                    <li>Primary actions use large buttons</li>
                    <li>Adequate spacing between touch targets</li>
                    <li>Clear visual feedback on tap</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold mb-2">Form Elements</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Large input fields for easy tapping</li>
                    <li>Native date/time pickers on mobile</li>
                    <li>Dropdown selects for limited options</li>
                    <li>Auto-capitalization where appropriate</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Navigation className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Navigation Patterns</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Menu className="w-5 h-5 text-muted-foreground" />
                  Mobile Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Collapsible sidebar with hamburger trigger</li>
                  <li>Bottom navigation bar for key actions</li>
                  <li>Swipe gestures for navigation</li>
                  <li>Back button always accessible</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  Content Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Collapsible sections for long content</li>
                  <li>Expandable cards for details</li>
                  <li>Progressive disclosure of information</li>
                  <li>Pull-to-refresh where applicable</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Maximize2 className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Mobile-Optimized Features</h2>
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Clock In/Out</p>
                    <p className="text-muted-foreground text-base">Large, prominent buttons for starting and ending work sessions. GPS capture happens automatically.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Safety Forms</p>
                    <p className="text-muted-foreground text-base">Streamlined forms with minimal required fields. Digital signatures work with finger or stylus.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Photo Uploads</p>
                    <p className="text-muted-foreground text-base">Direct camera access for capturing work photos and documentation.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Project Cards</p>
                    <p className="text-muted-foreground text-base">Swipeable project cards on dashboard with quick actions accessible via tap.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Dialogs & Sheets</p>
                    <p className="text-muted-foreground text-base">Bottom sheets instead of centered modals for easier thumb reach on mobile.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Testing Approach</p>
                  <p className="text-base text-muted-foreground">
                    All features are developed and tested mobile-first, then verified on tablet and desktop. This ensures the field worker experience is always optimized.
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

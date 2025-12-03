import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/BackButton";
import { MainMenuButton } from "@/components/MainMenuButton";
import {
  Palette,
  Image,
  Paintbrush,
  ArrowRight,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  CreditCard,
  Sparkles,
  RefreshCw,
  Monitor,
  FileText,
  Settings,
  Upload,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BrandingGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton to="/changelog" />
            <div>
              <h1 className="text-xl font-bold">White-Label Branding Guide</h1>
              <p className="text-xs text-muted-foreground">Custom logos and brand color customization</p>
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
              <Palette className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              White-Label Branding Overview
            </h2>
            <p className="text-muted-foreground">
              The White-Label Branding system allows companies to customize the platform with their own logo and brand colors. This subscription-gated feature applies branding <strong>globally across all authenticated pages</strong> and to safety document PDFs. Access branding settings from the Profile page under the "Branding" tab.
            </p>
          </div>
        </section>

        <Separator />

        {/* THE GOLDEN RULE */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <CreditCard className="w-5 h-5" />
                The Golden Rule: Branding Requires Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-2xl font-mono font-bold">
                  Active Add-on = Full Customization
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>White-label branding is a subscription add-on.</strong> When active, you can:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Upload Custom Logo</strong>: Displayed in headers across the platform</li>
                  <li><strong>Select Brand Colors</strong>: Up to unlimited colors for theming</li>
                  <li><strong>PDF Branding</strong>: Company name appears on safety documents</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Subscription Status
                </p>
                <p className="mt-1">If your branding subscription expires or is cancelled, all branding customizations are automatically removed. The platform reverts to default styling.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Add-on Price</p>
                  <p className="font-bold">Monthly</p>
                  <p className="text-lg font-mono">$49/mo</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Logo Upload</p>
                  <p className="font-bold">Any Image</p>
                  <p className="text-lg font-mono">PNG, JPG</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Colors</p>
                  <p className="font-bold">Unlimited</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Custom Palette</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Problems Solved */}
        <section className="space-y-4">
          <Card className="border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-green-900 dark:text-green-100">
                <CheckCircle2 className="w-5 h-5" />
                Problems Solved
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-900 dark:text-green-100">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Generic platform appearance:</strong> Custom logos and colors create a branded experience for your team</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Unprofessional client documents:</strong> Company branding appears on all PDF safety exports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Inconsistent visual identity:</strong> Global CSS application ensures brand colors throughout the platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Costly custom development:</strong> Self-service branding controls eliminate developer dependency</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Subscription management:</strong> Automatic revert to defaults when branding expires</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Branding Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            What's Included
          </h2>
          <p className="text-sm text-muted-foreground">White-label branding customizes multiple areas of the platform:</p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Image className="w-4 h-4 text-blue-600" />
                  Custom Company Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Upload your company logo to display in headers. Supports PNG and JPG formats. Logo appears on all authenticated pages.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Paintbrush className="w-4 h-4 text-purple-600" />
                  Brand Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Select unlimited brand colors. Primary color applies to buttons, links, and accent elements throughout the platform.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-green-600" />
                  Global CSS Application
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Colors are converted to CSS variables and applied globally. Affects charts, progress bars, buttons, and interactive elements.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  PDF Document Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Your company name appears on exported safety documents including harness inspections, toolbox meetings, and incident reports.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Setup Workflow */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Branding Setup Workflow
          </h2>

          <div className="space-y-3">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Subscribe to White-Label Add-on</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Navigate to Profile, then Subscription tab. Add the White-Label Branding add-on ($49/month) to your plan.
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
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      Upload Company Logo
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Go to Profile, then Branding tab. Click the upload area to select your logo file. Recommended size: 200x60 pixels or larger.
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
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      Configure Brand Colors
                      <Paintbrush className="w-4 h-4 text-muted-foreground" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use the color picker to select your brand colors. Add multiple colors for primary, secondary, and accent elements. Click "Save Changes" to apply.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Branding Applied</h3>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                      Your branding is now active across the platform. All employees in your company will see the customized interface.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Color Management */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Paintbrush className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            Managing Brand Colors
          </h2>

          <Card className="bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-pink-900 dark:text-pink-100">
                      How Color Theming Works
                    </p>
                    <p className="text-pink-800 dark:text-pink-200">
                      Brand colors are converted to HSL format and injected as CSS variables. The system overrides default theme colors with your selections.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white dark:bg-pink-900 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Plus className="w-4 h-4 text-pink-600" />
                      <p className="font-semibold text-pink-900 dark:text-pink-100">Add Color</p>
                    </div>
                    <p className="text-pink-800 dark:text-pink-200 text-xs">
                      Click "Add Color" to add another color to your palette. Use color picker or enter hex code.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-pink-900 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="w-4 h-4 text-pink-600" />
                      <p className="font-semibold text-pink-900 dark:text-pink-100">Update Color</p>
                    </div>
                    <p className="text-pink-800 dark:text-pink-200 text-xs">
                      Click on existing color swatch to modify. Changes apply after saving.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-pink-900 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Trash2 className="w-4 h-4 text-pink-600" />
                      <p className="font-semibold text-pink-900 dark:text-pink-100">Remove Color</p>
                    </div>
                    <p className="text-pink-800 dark:text-pink-200 text-xs">
                      Click delete icon next to color to remove. At least one color required.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Color Application */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Monitor className="w-5 h-5 text-green-600 dark:text-green-400" />
            Where Colors Apply
          </h2>

          <div className="space-y-3">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">Color Position</th>
                        <th className="text-left py-2 font-semibold">CSS Variable</th>
                        <th className="text-left py-2 font-semibold">Applied To</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Primary (1st color)</td>
                        <td className="py-2"><code>--primary</code></td>
                        <td className="py-2">Buttons, links, focus rings</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Secondary (2nd color)</td>
                        <td className="py-2"><code>--secondary</code></td>
                        <td className="py-2">Secondary buttons, accents</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Tertiary (3rd color)</td>
                        <td className="py-2"><code>--accent</code></td>
                        <td className="py-2">Highlights, charts</td>
                      </tr>
                      <tr>
                        <td className="py-2">Additional colors</td>
                        <td className="py-2">Chart colors</td>
                        <td className="py-2">Graphs, progress indicators</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Subscription Gate */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Subscription Requirements
          </h2>
          <p className="text-sm text-muted-foreground">White-label branding requires an active subscription add-on:</p>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Subscription Active</p>
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">$49/month</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Full access to logo upload, color customization, and PDF branding</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-gray-400">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                    <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">Subscription Inactive</p>
                      <Badge variant="secondary" className="text-xs">Add-on Required</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Branding settings hidden. Platform shows default styling.</p>
                  </div>
                </div>
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
                      <th className="text-left py-2 font-semibold">Requirement</th>
                      <th className="text-left py-2 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Logo Upload</td>
                      <td className="py-2">Active subscription</td>
                      <td className="py-2">PNG/JPG, any size</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Color Palette</td>
                      <td className="py-2">Active subscription</td>
                      <td className="py-2">Unlimited colors</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">PDF Branding</td>
                      <td className="py-2">Active subscription</td>
                      <td className="py-2">Company name on exports</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Employee View</td>
                      <td className="py-2">Automatic</td>
                      <td className="py-2">All company employees see branding</td>
                    </tr>
                    <tr>
                      <td className="py-2">Resident View</td>
                      <td className="py-2">Automatic</td>
                      <td className="py-2">Linked residents see company branding</td>
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
            <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-sky-700 dark:text-sky-300">Company Admin Journey</h3>
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950 dark:to-blue-950 rounded-lg p-6 border border-sky-200 dark:border-sky-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-sky-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Subscribe</p>
                      <p className="text-xs text-muted-foreground">Add branding add-on</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-sky-600 dark:text-sky-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-sky-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Upload Logo</p>
                      <p className="text-xs text-muted-foreground">Add company logo</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-sky-600 dark:text-sky-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-sky-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Set Colors</p>
                      <p className="text-xs text-muted-foreground">Choose brand palette</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-sky-600 dark:text-sky-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-sky-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Go Live</p>
                      <p className="text-xs text-muted-foreground">Branding applies globally</p>
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
              <Image className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Custom Logo</p>
                <p className="text-sm text-muted-foreground">Upload and display your company logo.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Paintbrush className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unlimited Colors</p>
                <p className="text-sm text-muted-foreground">Select unlimited brand colors.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Monitor className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Global Application</p>
                <p className="text-sm text-muted-foreground">CSS variables apply platform-wide.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">PDF Branding</p>
                <p className="text-sm text-muted-foreground">Company name on safety documents.</p>
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
              onClick={() => navigate("/settings")}
              data-testid="link-settings"
            >
              <div className="text-left">
                <div className="font-semibold">Go to Settings</div>
                <div className="text-xs text-muted-foreground">Access branding configuration</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button 
              variant="outline" 
              className="justify-between h-auto p-4"
              onClick={() => navigate("/changelog/quoting")}
              data-testid="link-quoting-guide"
            >
              <div className="text-left">
                <div className="font-semibold">Quoting Guide</div>
                <div className="text-xs text-muted-foreground">Sales pipeline documentation</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for the White-Label Branding System.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

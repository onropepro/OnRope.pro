import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Globe,
  Languages,
  Settings,
  Users,
  Database,
  ArrowRight,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Calendar,
  Clock,
  FileText,
  ToggleLeft,
  User,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function LanguageGuide() {
  return (
    <ChangelogGuideLayout 
      title="Language & Localization Guide"
      version="2.0"
      lastUpdated="December 5, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The platform supports <strong>full internationalization (i18n)</strong> with language switching, localized date/time formatting, and user language preferences. Currently supporting English and French with infrastructure for additional languages.
          </p>
        </section>

        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Languages className="w-5 h-5" />
                The Golden Rule: User Preference Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  User Setting &gt; Browser &gt; Default
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Language is determined by this priority order:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>User preference</strong>: Saved language choice in profile settings</li>
                  <li><strong>Browser language</strong>: Detected from browser settings</li>
                  <li><strong>Default (English)</strong>: Fallback if no preference set</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Understanding
                </p>
                <p className="mt-1">Language changes affect ALL text in the application including navigation, buttons, labels, and system messages. Dates and times are also formatted according to the selected locale.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">English</p>
                  <p className="font-bold">December 3, 2024</p>
                  <p className="text-lg font-mono">2:30 PM</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">French</p>
                  <p className="font-bold">3 decembre 2024</p>
                  <p className="text-lg font-mono">14h30</p>
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
                  <span><strong>Language barrier issues:</strong> Full French translation enables Quebec-based teams to use native language</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Date format confusion:</strong> Locale-aware date/time formatting matches user expectations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Preference persistence:</strong> Language choice saved to profile and remembered across sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Mixed team support:</strong> Each user can set their own preferred language independently</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span><strong>Incomplete translations:</strong> Fallback system ensures content always displays even if translation missing</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            System Architecture
          </h2>
          <p className="text-base text-muted-foreground">The internationalization system consists of these components:</p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-action-600" />
                  1. Translation Files
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>JSON files containing all translatable strings organized by namespace.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>File Structure:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code>en.json</code> - English translations (default)</li>
                    <li><code>fr.json</code> - French translations</li>
                    <li>Namespaces: common, navigation, forms, errors</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-green-600" />
                  2. i18next Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>React-i18next library handles translation loading and language switching.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Features:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Automatic browser language detection</li>
                    <li>Namespace-based loading for performance</li>
                    <li>Fallback language support</li>
                    <li>Interpolation for dynamic values</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  3. User Preference Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p>Language preference is stored in the user's profile for persistence across sessions.</p>
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <p><strong>Storage Locations:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code>preferredLanguage</code> - User profile field</li>
                    <li><code>localStorage</code> - Browser cache for quick access</li>
                    <li>Synced on login for consistent experience</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Languages className="w-5 h-5 text-action-600 dark:text-action-400" />
            Supported Languages
          </h2>
          <p className="text-base text-muted-foreground">Currently available languages and their coverage:</p>

          <div className="space-y-3">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                    <span className="text-sm font-bold text-action-600 dark:text-action-400">EN</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">English</p>
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                      <Badge className="text-xs bg-green-500">100% Coverage</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Full platform coverage including all features, forms, and system messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-2">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">FR</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">French (Francais)</p>
                      <Badge className="text-xs bg-green-500">100% Coverage</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Complete French translation including Canadian French conventions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-action-600 dark:text-action-400" />
            Workflows
          </h2>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 1</Badge>
                  <CardTitle className="text-base">Change Language</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Click language toggle</p>
                      <p className="text-base text-muted-foreground">Located in header or settings page</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Select desired language</p>
                      <p className="text-base text-muted-foreground">Choose from available options (EN, FR)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Interface updates immediately</p>
                      <p className="text-base text-muted-foreground">All text switches to selected language without page reload</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium">Preference saved</p>
                      <p className="text-base text-muted-foreground">Choice persists across sessions and devices</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 2</Badge>
                  <CardTitle className="text-base">Set Language in Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Navigate to Profile Settings</p>
                      <p className="text-base text-muted-foreground">Access via profile menu or settings page</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Find Language Preference</p>
                      <p className="text-base text-muted-foreground">Located in preferences or display settings section</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Select and save</p>
                      <p className="text-base text-muted-foreground">Choose language and save profile changes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Customer Journeys
          </h2>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-300">User Language Setup Journey</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Login</p>
                      <p className="text-xs text-muted-foreground">Auto-detect browser</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Toggle Language</p>
                      <p className="text-xs text-muted-foreground">Click EN/FR switch</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Interface Updates</p>
                      <p className="text-xs text-muted-foreground">Instant translation</p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-action-600 dark:text-action-400 md:mx-2 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                    <div className="text-center text-sm">
                      <p className="font-semibold">Saved</p>
                      <p className="text-xs text-muted-foreground">Persists forever</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Key Features Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <ToggleLeft className="w-5 h-5 text-action-600 dark:text-action-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Instant Switching</p>
                <p className="text-base text-muted-foreground">No page reload required.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Localized Dates</p>
                <p className="text-base text-muted-foreground">Date/time formats match locale.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <User className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">User Preferences</p>
                <p className="text-base text-muted-foreground">Choice saved to profile.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Smartphone className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Mobile Optimized</p>
                <p className="text-base text-muted-foreground">Works seamlessly on all devices.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Quick Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/profile">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-profile">

              <div className="text-left">
                <div className="font-semibold">Go to Profile</div>
                <div className="text-xs text-muted-foreground">Set language preference</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>

            <Link href="/changelog/gps">
              <Button variant="outline" 
              className="w-full justify-between h-auto p-4"
              data-testid="link-gps-guide">

              <div className="text-left">
                <div className="font-semibold">GPS & Location Guide</div>
                <div className="text-xs text-muted-foreground">Location services documentation</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            </Link>
          </div>
        </section>

        <Card className="border-muted bg-muted/50">
          <CardContent className="pt-6 text-base text-muted-foreground">
            <p><strong>Last updated:</strong> December 3, 2024 | <strong>Version:</strong> 1.0</p>
            <p className="mt-1">This document serves as the authoritative reference for Multi-Language Support.</p>
          </CardContent>
        </Card>
      </div>
    </ChangelogGuideLayout>
  );
}

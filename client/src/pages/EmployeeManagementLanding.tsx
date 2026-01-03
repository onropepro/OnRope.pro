import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import { FreeTrialButton } from "@/components/FreeTrialButton";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { SoftwareReplaces, MODULE_SOFTWARE_MAPPING } from "@/components/SoftwareReplaces";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  HardHat,
  Building2,
  Users,
  Shield,
  Clock,
  AlertTriangle,
  UserCheck,
  ClipboardCheck,
  Key,
  Eye,
  Car,
  FileSignature,
  Trash2,
  Timer,
  DollarSign,
  Calendar,
  Package,
  Layers,
  UserCog,
  IdCard,
  CheckCircle2
} from "lucide-react";

export default function EmployeeManagementLanding() {
  const { t } = useTranslation();
  const { openLogin } = useAuthPortal();
  const [showRegistration, setShowRegistration] = useState(false);
  
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              {t('modules.employees.hero.badge', 'Employee Management Module')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('modules.employees.hero.titleLine1', 'Your New Hire Filled Out This Paperwork')}<br />
              {t('modules.employees.hero.titleLine2', 'Three Employers Ago.')}<br />
              <span className="text-blue-100">{t('modules.employees.hero.titleLine3', 'Why Are You Asking Again?')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('modules.employees.hero.description', 'Portable technician identities that can plug in to your company just by providing an IRATA or SPRAT number, automated certification alerts, and instant onboarding for an industry with a high turnover rate.')}<br /><br />
              <strong>{t('modules.employees.hero.tagline', 'Employee management built by rope access professionals who got tired of the same paperwork dance at every new job.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <FreeTrialButton 
                className="bg-white text-[#0B64A3] hover:bg-blue-50" 
                onClick={() => setShowRegistration(true)} 
                testId="button-hero-trial"
              />
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-hero-signin">
                Sign In
              </Button>
            </div>
            
            <SoftwareReplaces 
              software={MODULE_SOFTWARE_MAPPING["employee-management"]} 
              className="mt-8 bg-white/5 rounded-lg mx-auto max-w-2xl [&_span]:text-blue-100 [&_svg]:text-blue-200"
            />
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      {/* Stats Panel */}
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center" data-testid="stat-onboard-time">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{t('modules.employees.stats.onboardTimeValue', '10 sec')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.employees.stats.onboardTimeLabel', 'Onboard existing users')}</div>
                </div>
                <div className="text-center" data-testid="stat-permissions">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{t('modules.employees.stats.permissionsValue', '44')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.employees.stats.permissionsLabel', 'Configurable permissions')}</div>
                </div>
                <div className="text-center" data-testid="stat-cert-warnings">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{t('modules.employees.stats.certWarningsValue', '30 days')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.employees.stats.certWarningsLabel', 'Advance cert warnings')}</div>
                </div>
                <div className="text-center" data-testid="stat-redundant-paperwork">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">{t('modules.employees.stats.redundantPaperworkValue', 'Zero')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('modules.employees.stats.redundantPaperworkLabel', 'Redundant paperwork')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problem Statement Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.employees.problemStatement.title', 'The Onboarding Problem Nobody Admits')}
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                {t('modules.employees.problemStatement.paragraph1', 'You email the new guy. "Welcome to the team. Please send your IRATA cert, void check, emergency contact, driver\'s license, and fill out these forms."')}
              </p>
              <p className="text-base">
                {t('modules.employees.problemStatement.paragraph2', "He sends half of it. You chase the rest. You manually enter everything into your systems. Three days later, he's finally in the schedule.")}
              </p>
              <p className="text-base">
                {t('modules.employees.problemStatement.paragraph3', 'Then he leaves for a competitor paying $2 more per hour. Eight weeks later, you hire him back. The whole dance starts again. Same guy. Same paperwork. Same wasted hours.')}
              </p>
              <p className="text-base">
                {t('modules.employees.problemStatement.paragraph4', "Meanwhile, somewhere in a spreadsheet you haven't opened since February, someone's IRATA cert expired last month. WorkSafeBC hasn't shown up yet. But they will.")}
              </p>
              <p className="text-base font-medium text-foreground">
                {t('modules.employees.problemStatement.paragraph5', 'OnRopePro treats technicians like what they are: mobile professionals whose complete professional identity should follow them wherever they work. Enter their IRATA number, they accept the connection, and every piece of information from their last three employers transfers instantly. One profile. Every employer. Zero redundant paperwork.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What This Module Does */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.employees.features.title', 'What This Module Does')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.employees.features.subtitle', 'Complete workforce administration for rope access operations, from first-day onboarding to certification compliance to offboarding.')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card data-testid="card-portable-identities">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <IdCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.employees.features.portableIdentities.title', 'Portable Professional Identities')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.employees.features.portableIdentities.description', "Every technician's IRATA or SPRAT certification number becomes their permanent identifier across the OnRopePro network. When they change employers (and they will), their profile travels with them.")}
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.employees.features.portableIdentities.listTitle', 'What transfers automatically:')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('modules.employees.features.portableIdentities.list1', 'Personal and contact information')}</li>
                    <li>{t('modules.employees.features.portableIdentities.list2', 'All certifications with expiration dates')}</li>
                    <li>{t('modules.employees.features.portableIdentities.list3', 'Emergency contact details')}</li>
                    <li>{t('modules.employees.features.portableIdentities.list4', 'Banking and payment information')}</li>
                    <li>{t('modules.employees.features.portableIdentities.list5', 'Complete work history and project records')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-certification-compliance">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.employees.features.certificationCompliance.title', 'Certification Compliance Engine')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.employees.features.certificationCompliance.description', "The system monitors IRATA, SPRAT, driver's licenses, and First Aid certifications. Visual indicators (green, amber, red) make expiring credentials impossible to miss. Automated 30-day warnings give you time to act before problems become crises.")}
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.employees.features.certificationCompliance.listTitle', 'What gets tracked:')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('modules.employees.features.certificationCompliance.list1', 'IRATA certification levels and expiration')}</li>
                    <li>{t('modules.employees.features.certificationCompliance.list2', 'SPRAT certification status')}</li>
                    <li>{t('modules.employees.features.certificationCompliance.list3', "Driver's license validity")}</li>
                    <li>{t('modules.employees.features.certificationCompliance.list4', 'First Aid and safety training dates')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-permission-controls">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Key className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-lg">{t('modules.employees.features.permissionControls.title', 'Granular Permission Controls')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  {t('modules.employees.features.permissionControls.description', 'All roles start with zero permissions except Company Owner. You configure exactly what each person can see and do. Separate operational access from financial visibility. Protect sensitive business data without formal demotions.')}
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">{t('modules.employees.features.permissionControls.listTitle', 'What you control:')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('modules.employees.features.permissionControls.list1', 'Financial data visibility')}</li>
                    <li>{t('modules.employees.features.permissionControls.list2', 'Employee management capabilities')}</li>
                    <li>{t('modules.employees.features.permissionControls.list3', 'Project creation and viewing rights')}</li>
                    <li>{t('modules.employees.features.permissionControls.list4', 'Payroll access levels')}</li>
                    <li>{t('modules.employees.features.permissionControls.list5', 'Client information exposure')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Stakeholder Benefits */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.employees.stakeholders.title', 'Who Benefits From This Module')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.employees.stakeholders.subtitle', 'Every stakeholder gets the workforce visibility and compliance protection they need.')}
          </p>
          
          <div className="space-y-8">
            {/* For Rope Access Company Owners */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-owners">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employees.stakeholders.owners.title', 'For Rope Access Company Owners')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.owners.benefit1Title', 'Protect your operation from compliance disasters before they happen.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.owners.benefit1Desc', 'One certification alert preventing a WorkSafeBC shutdown pays for your entire annual subscription. Beyond direct cost, you avoid project delays, client relationship damage, and liability lawsuits that can reach seven figures.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.owners.benefit2Title', 'Reclaim hours lost to redundant administration.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.owners.benefit2Desc', 'The email chase, the data entry, the follow-ups, the duplicate effort when someone comes back after leaving for another company. Existing OnRopePro users onboard in 10 seconds. New users fill out their information once on their own time.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.owners.benefit3Title', 'Control access without creating HR conflicts.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.owners.benefit3Desc', 'Suspicious your operations manager is talking to competitors? Modify their permissions in real-time without changing their title. Remove financial visibility while maintaining operational function. Document everything for potential legal proceedings.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-technicians">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employees.stakeholders.technicians.title', 'For Technicians')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.technicians.benefit1Title', 'Fill out paperwork once in your career, not once per employer.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.technicians.benefit1Desc', "Your profile follows you. When you join a new company, they enter your IRATA number, you accept, and you're done. No more emailing the same void check to every new employer.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.technicians.benefit2Title', 'Never get blindsided by an expired certification.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.technicians.benefit2Desc', "See your own status. Get notified before expiration. Renew on your schedule instead of scrambling after you've already lost work eligibility.")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.technicians.benefit3Title', 'Log in with your IRATA number.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.technicians.benefit3Desc', 'The credential that defines your profession becomes your universal identifier. One less password to remember.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Operations Managers */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-ops-managers">
              <CardHeader className="bg-sky-50 dark:bg-sky-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <UserCog className="w-5 h-5 text-sky-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employees.stakeholders.opsManagers.title', 'For Operations Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.opsManagers.benefit1Title', "Know who's qualified for what at a glance.")}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.opsManagers.benefit1Desc', 'Scheduling a technical job that needs a Level 3? Filter by certification level. Assigning a company vehicle? Check license status instantly. Stop relying on memory for compliance-critical decisions.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.opsManagers.benefit2Title', 'Onboard new crew members without the email marathon.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.opsManagers.benefit2Desc', "For techs already in OnRopePro, you're not creating records. You're connecting to profiles that already exist. For new users, the system handles the data collection.")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Building Managers */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-building-mgrs">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employees.stakeholders.buildingManagers.title', 'For Building Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.buildingManagers.benefit1Title', 'Verify technician qualifications before anyone touches your building.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.buildingManagers.benefit1Desc', 'Current IRATA certifications. Valid safety training. Proper insurance documentation. Professional operators who can prove compliance on demand.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.buildingManagers.benefit2Title', 'Work with companies that operate like professionals.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.buildingManagers.benefit2Desc', "Organized record-keeping. Documented safety protocols. The kind of operation that doesn't create liability exposure for your property.")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-property-mgrs">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{t('modules.employees.stakeholders.propertyManagers.title', 'For Property Managers')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.propertyManagers.benefit1Title', "Confidence in your vendor's workforce management.")}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.propertyManagers.benefit1Desc', 'When you need to justify your vendor selection to ownership or insurance, you can point to systematic compliance tracking and professional documentation.')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('modules.employees.stakeholders.propertyManagers.benefit2Title', 'Reduce your liability exposure through verified qualifications.')}</h4>
                    <p className="text-base text-muted-foreground">{t('modules.employees.stakeholders.propertyManagers.benefit2Desc', 'Companies using OnRopePro can demonstrate current certifications for every technician on your properties.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features Grid */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.employees.keyFeatures.title', 'Key Features')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.employees.keyFeatures.subtitle', 'Every feature designed around how rope access companies actually operate, not how generic HR software thinks you should.')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.keyFeatures.import.title', '10-Second Employee Import')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.employees.keyFeatures.import.description', 'Existing OnRopePro users plug in instantly. Enter their IRATA number, send a connection request, they accept, done. All personal information, certifications, emergency contacts, and banking details transfer automatically.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.keyFeatures.roles.title', '14 Roles with Custom Permissions')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.employees.keyFeatures.roles.description', 'Management positions and field positions with 44 individual permissions. Every role except Owner starts empty. You grant exactly what each person needs.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.keyFeatures.certStatus.title', 'Visual Certification Status')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.employees.keyFeatures.certStatus.description', 'Green means valid. Amber means expiring within 60 days. Red means expired. No spreadsheet diving. No calendar reminders you might miss. Status is visible wherever you view employee information.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.keyFeatures.driver.title', 'Driver Eligibility Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.employees.keyFeatures.driver.description', 'License expiration dates monitored alongside certifications. Same 30-day warning system. Same visual indicators. Critical for companies assigning technicians to company vehicles.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <FileSignature className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.keyFeatures.safety.title', 'Integrated Safety Document Signing')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.employees.keyFeatures.safety.description', 'New employees automatically receive required company safety documents as part of onboarding. Signatures tracked. Compliance documented. No separate system or email chain required.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.keyFeatures.softDelete.title', 'Soft Delete with Data Preservation')}</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      {t('modules.employees.keyFeatures.softDelete.description', 'Terminated employees lose system access immediately, but historical data remains for compliance and audit purposes. Work sessions, safety documents, equipment assignments, payroll history. All preserved.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problems Solved */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.employees.problemsSolved.title', 'Problems Solved')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.employees.problemsSolved.subtitle', 'Real challenges faced by rope access companies, and how this module addresses each one.')}
          </p>
          
          <Accordion type="multiple" className="space-y-4" data-testid="accordion-problems-solved">
            {/* For Company Owners */}
            <AccordionItem value="owner-problems" className="border rounded-lg px-4" data-testid="accordion-item-owner-problems">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold">{t('modules.employees.problemsSolved.owners.title', 'For Rope Access Company Owners')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.employees.problemsSolved.owners.problem1Title', '"I didn\'t know his cert was expired until WorkSafeBC showed up."')}</h4>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.owners.problem1Desc1', "You're running busy season. Jobs stacked, crews deployed across multiple sites. Tracking when every technician's IRATA expires? It falls through the cracks. You assume they're handling their own renewals. Then WorkSafeBC arrives for a site inspection.")}</p>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.owners.problem1Desc2', 'OnRopePro monitors every certification with automated 30-day warnings and visual status indicators. One alert preventing one shutdown justifies years of subscription costs.')}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.employees.problemsSolved.owners.problem2Title', '"Onboarding takes hours of back-and-forth emails."')}</h4>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.owners.problem2Desc1', 'Every new hire triggers the same dance. Email asking for info, wait, chase missing pieces, manually enter everything, email safety documents, wait for signatures, follow up again. Hours per employee.')}</p>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.owners.problem2Desc2', 'Two pathways eliminate this chaos. Existing OnRopePro user: enter IRATA number, they accept, done. 10 seconds. New user: they fill out their profile once on their own time. You just link them to your company.')}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.employees.problemsSolved.owners.problem3Title', '"My operations manager might be talking to competitors."')}</h4>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.owners.problem3Desc1', "You've given them broad access because they need it to do their job. Now you're suspicious. You can't fire without proof. You can't run operations without someone in that role.")}</p>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.owners.problem3Desc2', 'Granular permissions let you modify access in real-time without changing titles. Remove financial visibility, hide client information, restrict to basic functions. No formal demotion. No HR complications. Immediate protection.')}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.employees.problemsSolved.owners.problem4Title', '"One of my guys drove our truck for two months with an expired license."')}</h4>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.owners.problem4Desc1', "You check licenses at hiring. What happens six months later when they expire? You're not thinking about it. Neither are they. Then they're driving your vehicle without valid credentials.")}</p>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.owners.problem4Desc2', "OnRopePro tracks driver's license expiration alongside certifications. Same 30-day warnings. Same visual indicators. Prevent one insurance claim denial or liability lawsuit and you've justified years of subscription.")}</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Operations Managers */}
            <AccordionItem value="ops-problems" className="border rounded-lg px-4" data-testid="accordion-item-ops-problems">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <UserCog className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="font-semibold">{t('modules.employees.problemsSolved.opsManagers.title', 'For Operations Managers')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.employees.problemsSolved.opsManagers.problem1Title', '"I can\'t remember who\'s certified for what."')}</h4>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.opsManagers.problem1Desc1', "You know Dave is Level 3 and pretty sure Mike is Level 2, but what about the new guys? When scheduling, you're doing mental gymnastics trying to remember who can lead, who needs supervision, who has working at heights training that's still valid.")}</p>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.opsManagers.problem1Desc2', "Filter by certification level, check license status, see first aid expiration. The information exists where you're already making scheduling decisions.")}</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* For Technicians */}
            <AccordionItem value="tech-problems" className="border rounded-lg px-4" data-testid="accordion-item-tech-problems">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-semibold">{t('modules.employees.problemsSolved.technicians.title', 'For Technicians')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.employees.problemsSolved.technicians.problem1Title', '"I have to fill out the same paperwork at every new employer."')}</h4>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.technicians.problem1Desc1', "Rope access has insane turnover. You might work for three companies in one season. Each one wants the same information: IRATA cert, void check, emergency contact, driver's license. You've filled this out a dozen times.")}</p>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.technicians.problem1Desc2', 'Create your OnRopePro profile once. When you join a new company, they enter your IRATA number, you accept, and everything transfers. Your certifications, contacts, banking info, work history. One profile, every employer.')}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">{t('modules.employees.problemsSolved.technicians.problem2Title', '"I never know if my certifications are about to expire."')}</h4>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.technicians.problem2Desc1', "You're focused on the job, not calendar dates. Your IRATA lapses, your first aid expires, and suddenly you can't work until you get recertified. Lost income. Scrambling to schedule training.")}</p>
                  <p className="text-base text-muted-foreground">{t('modules.employees.problemsSolved.technicians.problem2Desc2', 'OnRopePro tracks your certification dates and alerts you before expiration. Proactive renewal instead of reactive scrambling.')}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Measurable Results */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.employees.measurableResults.title', 'Measurable Results')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.employees.measurableResults.subtitle', 'Concrete improvements you can expect from implementing this module.')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t('modules.employees.measurableResults.onboarding.title', 'Onboarding Time Reduction')}</h3>
                    <p className="text-base text-muted-foreground mt-2">{t('modules.employees.measurableResults.onboarding.description', 'Existing OnRopePro users: 10 seconds. New users: 5-10 minutes versus hours of email exchanges. Eliminate 100% of back-and-forth data collection for existing accounts.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t('modules.employees.measurableResults.compliance.title', 'Compliance Protection')}</h3>
                    <p className="text-base text-muted-foreground mt-2">{t('modules.employees.measurableResults.compliance.description', '30-day advance warning on all tracked certifications. Visual status indicators visible across the platform. One certification alert preventing a WorkSafeBC shutdown justifies years of subscription cost.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Timer className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t('modules.employees.measurableResults.admin.title', 'Administrative Hours Reclaimed')}</h3>
                    <p className="text-base text-muted-foreground mt-2">{t('modules.employees.measurableResults.admin.description', 'No more manual entry for returning employees. No separate systems for different data types. One login, one source of truth, one workflow that handles onboarding, compliance, and offboarding.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <Key className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t('modules.employees.measurableResults.permissions.title', 'Permission Precision')}</h3>
                    <p className="text-base text-muted-foreground mt-2">{t('modules.employees.measurableResults.permissions.description', '44 individual permissions across 14 roles. Grant project creation without exposing compensation data. Provide operational access without financial visibility. Respond to trust concerns immediately without HR complications.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Module Integration */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.employees.integration.title', 'Modules This Module Connects With')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.employees.integration.subtitle', 'Employee Management data flows throughout OnRopePro, enabling every other module to function with complete workforce context.')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.integration.workSession.title', 'Work Session Tracking')}</h3>
                    <p className="text-base text-muted-foreground mt-1">{t('modules.employees.integration.workSession.description', 'Employees appear in time tracking. Hourly rates determine labor cost calculations.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.integration.payroll.title', 'Payroll')}</h3>
                    <p className="text-base text-muted-foreground mt-1">{t('modules.employees.integration.payroll.description', 'Compensation feeds directly into payroll calculations. Rate changes mid-period handled automatically.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.integration.projectManagement.title', 'Project Management')}</h3>
                    <p className="text-base text-muted-foreground mt-1">{t('modules.employees.integration.projectManagement.description', 'Employees show up in project assignment lists. Certification levels visible when scheduling.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.integration.safety.title', 'Safety & Compliance')}</h3>
                    <p className="text-base text-muted-foreground mt-1">{t('modules.employees.integration.safety.description', 'Safety document signing integrated into onboarding workflow. Compliance history maintained for audits.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Package className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.integration.inventory.title', 'Inventory')}</h3>
                    <p className="text-base text-muted-foreground mt-1">{t('modules.employees.integration.inventory.description', 'Equipment assignments connect to employee profiles. Track what gear each technician has.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('modules.employees.integration.scheduling.title', 'Scheduling')}</h3>
                    <p className="text-base text-muted-foreground mt-1">{t('modules.employees.integration.scheduling.description', 'Available crew appears in calendar views. Certification filtering enables appropriate assignment.')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Business Improvement */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('modules.employees.businessImprovement.title', 'Stop Managing Paperwork. Start Managing People.')}
          </h2>
          
          <div className="space-y-4 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              {t('modules.employees.businessImprovement.para1', "Right now, you're spending hours on administrative tasks that don't move your business forward. Chasing down documents. Entering the same information multiple times. Manually checking calendars to see if certifications are still valid. Worrying about the compliance gap you might not even know exists.")}
            </p>
            <p className="text-base">
              {t('modules.employees.businessImprovement.para2', "Your operations manager asks if you can take a new project. You have to check six different places to figure out who's available, who's qualified, and whether anyone's cert is about to expire. By the time you have an answer, the opportunity might be gone.")}
            </p>
            <p className="text-base">
              {t('modules.employees.businessImprovement.para3', "Your best technician leaves for $2 more an hour somewhere else. Two months later, he wants to come back. You're thrilled to have him, but now you're doing the whole onboarding dance again. Same guy. Same paperwork. Like the last eight months never happened.")}
            </p>
            <p className="text-base font-medium text-foreground">
              {t('modules.employees.businessImprovement.para4', "With Employee Management, technician profiles are portable. Certifications are monitored automatically. Permissions are configurable without HR complications. When someone joins your company, they're productive on day one. When someone leaves and returns, the connection takes 10 seconds.")}
            </p>
            <p className="text-base">
              {t('modules.employees.businessImprovement.para5', "You get back the hours you're currently spending on administration. You get protection from compliance failures you didn't know were coming. You get control over who sees what without creating workplace drama.")}
            </p>
            <p className="text-lg font-semibold text-foreground">
              {t('modules.employees.businessImprovement.para6', 'You stop managing paperwork and start managing what actually matters: your people, your projects, your business.')}
            </p>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs */}
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('modules.employees.faqs.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            {t('modules.employees.faqs.subtitle', 'Common questions about the Employee Management module.')}
          </p>
          
          <Accordion type="single" collapsible className="space-y-4" data-testid="accordion-faqs">
            <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-item-faq-1">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q1.question', 'Can technicians login with their IRATA number instead of email?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q1.answer', 'Yes. Technicians can log in using either their IRATA/SPRAT certification number or their email address. The certification number serves as a unique identifier across the platform.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-item-faq-2">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q2.question', 'What happens when I hire a tech who already has an OnRopePro account?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q2.answer', 'Enter their IRATA/SPRAT number, send a connection request, and once they accept, their full profile transfers to your company. You only configure their compensation rate. All other information is already complete. Time required: 10 seconds (excluding their acceptance).')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-item-faq-3">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q3.question', 'Are role permissions predefined or do I have to set them up?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q3.answer', 'All roles except Company Owner start with zero permissions. You must explicitly grant each permission the employee needs. This prevents accidental over-permission and allows precise matching of access to job requirements and trust level.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-item-faq-4">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q4.question', "Does the system alert for driver's license expiration too?")}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q4.answer', "Yes. Driver's license expiration dates are tracked and included in the same alert system as IRATA/SPRAT certifications. Visual indicators and notifications function identically.")}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-item-faq-5">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q5.question', 'What happens to data when an employee is terminated?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q5.answer', 'The employee loses system access immediately, but all historical data is preserved. Work sessions, safety documents, equipment assignments, and payroll history remain in the system for compliance and audit purposes. This is a soft delete, not a hard delete.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-item-faq-6">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q6.question', "Can I use this for employees who aren't rope access technicians?")}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q6.answer', 'Yes. While certification tracking is designed for rope access (IRATA/SPRAT), the module supports roles like Labourer, Support Staff, and general support personnel who may not have rope access certifications. Leave certification fields empty for non-certified staff.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-7" className="border rounded-lg px-4" data-testid="accordion-item-faq-7">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q7.question', 'What if I suspect an employee is sharing information with competitors?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q7.answer', 'Modify their permissions immediately. Remove financial access, hide client information, restrict to basic functions. No formal demotion required. Changes take effect instantly. Access modifications are logged for potential legal proceedings.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-8" className="border rounded-lg px-4" data-testid="accordion-item-faq-8">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q8.question', "Can employees see each other's pay rates?")}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q8.answer', 'Only if you grant them that specific permission. Financial visibility is separated from operational access. Your supervisor can create projects and check budgets without seeing what every technician earns.')}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-9" className="border rounded-lg px-4" data-testid="accordion-item-faq-9">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q9.question', 'What certifications are tracked?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q9.answer', "IRATA level and expiration, SPRAT certification, driver's license validity, and First Aid certification. All display visual status indicators (green/amber/red) and trigger 30-day warning alerts before expiration.")}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq-10" className="border rounded-lg px-4" data-testid="accordion-item-faq-10">
              <AccordionTrigger className="hover:no-underline text-left">
                {t('modules.employees.faqs.q10.question', 'How long does onboarding take for a completely new employee?')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t('modules.employees.faqs.q10.answer', '5-10 minutes for data entry, excluding the time the employee spends setting up their own account. New employees receive login credentials via email and can then complete their profile details (emergency contacts, banking information) on their own time.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Footer CTA */}
      <section className="py-16 md:py-24 px-4 text-center" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {t('modules.employees.footerCta.title', 'Ready to Simplify Your Workforce Management?')}
          </h2>
          <p className="text-xl text-blue-100">
            {t('modules.employees.footerCta.subtitle', 'Join rope access companies already using OnRopePro to protect their operations, reduce administrative burden, and ensure compliance.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <FreeTrialButton 
              className="bg-white text-[#0B64A3] hover:bg-blue-50" 
              onClick={() => setShowRegistration(true)} 
              testId="button-footer-trial"
            />
          </div>
        </div>
      </section>

      <EmployerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}

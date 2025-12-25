import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/PublicHeader";
import {
  ArrowRight,
  Clock,
  DollarSign,
  Shield,
  Briefcase,
  HardHat,
  Building2,
  Users,
  Home,
  Ticket,
  BarChart3,
  Rocket,
  Eye,
  Camera,
  Timer,
  Phone,
  RefreshCw,
  TrendingUp,
  Scale,
  ClipboardList,
  FolderOpen,
  Calendar,
  Wrench,
  BookOpen,
  FileText,
  MessageSquare,
  UserCog,
  Award,
  LineChart,
  Palette,
  CheckCircle2,
  XCircle,
  Lock,
  HeartHandshake,
  Mail,
  LayoutGrid,
  Settings,
  HeartPulse,
  Wallet,
  IdCard,
  Search,
  Globe,
  Package,
  Gauge,
  ClipboardCheck,
  UserCheck,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Segment =
  | "employer"
  | "technician"
  | "property-manager"
  | "building-manager"
  | "resident";

const segmentIcons = {
  employer: {
    pillars: [Clock, DollarSign, Shield],
  },
  technician: {
    pillars: [Ticket, BarChart3, Rocket],
  },
  "property-manager": {
    pillars: [BarChart3, Scale, ClipboardList],
  },
  "building-manager": {
    pillars: [Phone, RefreshCw, TrendingUp],
  },
  resident: {
    pillars: [Eye, Camera, Timer],
  },
};

const segmentHrefs = {
  employer: {
    primaryCta: "/get-license",
    secondaryCta: "/pricing",
  },
  technician: {
    primaryCta: "/technician",
    secondaryCta: "/technician",
  },
  "property-manager": {
    primaryCta: "/property-manager",
    secondaryCta: "/property-manager",
  },
  "building-manager": {
    primaryCta: "/building-portal",
    secondaryCta: "/building-portal",
  },
  resident: {
    primaryCta: "/resident",
    secondaryCta: "/resident",
  },
};

const moduleCategoryIds = ["all", "operations", "safety", "team", "financial", "communication"];
const moduleCategoryIcons = {
  all: LayoutGrid,
  operations: Settings,
  safety: HeartPulse,
  team: Users,
  financial: Wallet,
  communication: MessageSquare,
};
const moduleCategoryColors = {
  all: "text-foreground",
  operations: "text-blue-600",
  safety: "text-red-600",
  team: "text-violet-600",
  financial: "text-emerald-600",
  communication: "text-rose-600",
};

const moduleData = [
  { key: "projectManagement", icon: FolderOpen, category: "operations" },
  { key: "workSession", icon: Clock, category: "operations" },
  { key: "scheduling", icon: Calendar, category: "operations" },
  { key: "gearInventory", icon: Package, category: "operations" },
  { key: "whiteLabel", icon: Palette, category: "operations" },
  { key: "safetyCompliance", icon: Shield, category: "safety" },
  { key: "companySafetyRating", icon: Gauge, category: "safety" },
  { key: "personalSafetyRating", icon: UserCheck, category: "safety" },
  { key: "irataSpratLogging", icon: ClipboardCheck, category: "safety" },
  { key: "documentManagement", icon: FileText, category: "safety" },
  { key: "employeeManagement", icon: UserCog, category: "team" },
  { key: "technicianPassport", icon: IdCard, category: "team" },
  { key: "jobBoard", icon: Search, category: "team" },
  { key: "userAccess", icon: Lock, category: "team" },
  { key: "payrollFinancial", icon: DollarSign, category: "financial" },
  { key: "quotingSales", icon: Briefcase, category: "financial" },
  { key: "crm", icon: Building2, category: "financial" },
  { key: "residentPortal", icon: Home, category: "communication" },
  { key: "propertyManagerInterface", icon: Globe, category: "communication" },
];

export default function HomePage() {
  const { t } = useTranslation();
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const [selectedModuleCategory, setSelectedModuleCategory] = useState<string>("all");

  const filteredModules =
    selectedModuleCategory === "all"
      ? moduleData
      : moduleData.filter((m) => m.category === selectedModuleCategory);

  const segmentButtons: {
    id: Segment;
    label: string;
    icon: typeof Briefcase;
  }[] = [
    { id: "employer", label: t("home.segments.employer.buttonLabel"), icon: Briefcase },
    { id: "technician", label: t("home.segments.technician.buttonLabel"), icon: HardHat },
    { id: "property-manager", label: t("home.segments.propertyManager.buttonLabel"), icon: Users },
    { id: "building-manager", label: t("home.segments.buildingManager.buttonLabel"), icon: Building2 },
    { id: "resident", label: t("home.segments.resident.buttonLabel"), icon: Home },
  ];

  const getSegmentContent = (segment: Segment) => {
    const segmentKey = segment === "property-manager" ? "propertyManager" : segment === "building-manager" ? "buildingManager" : segment;
    return {
      headline: t(`home.segments.${segmentKey}.headline`),
      subheadline: t(`home.segments.${segmentKey}.subheadline`),
      pillars: [
        {
          icon: segmentIcons[segment].pillars[0],
          headline: t(`home.segments.${segmentKey}.pillars.0.headline`),
          text: t(`home.segments.${segmentKey}.pillars.0.text`),
        },
        {
          icon: segmentIcons[segment].pillars[1],
          headline: t(`home.segments.${segmentKey}.pillars.1.headline`),
          text: t(`home.segments.${segmentKey}.pillars.1.text`),
        },
        {
          icon: segmentIcons[segment].pillars[2],
          headline: t(`home.segments.${segmentKey}.pillars.2.headline`),
          text: t(`home.segments.${segmentKey}.pillars.2.text`),
        },
      ],
      primaryCta: {
        text: t(`home.segments.${segmentKey}.primaryCta`),
        href: segmentHrefs[segment].primaryCta,
        subtext: segment === "property-manager" ? t(`home.segments.${segmentKey}.primaryCtaSubtext`) : undefined,
      },
      secondaryCta: {
        text: t(`home.segments.${segmentKey}.secondaryCta`),
        href: segmentHrefs[segment].secondaryCta,
      },
      secondarySubtext: segment === "employer" ? t(`home.segments.${segmentKey}.secondarySubtext`) : undefined,
      trustSignal: t(`home.segments.${segmentKey}.trustSignal`),
    };
  };

  const content = activeSegment ? getSegmentContent(activeSegment) : null;

  const chaosItems = [
    t("home.problem.chaos.items.0"),
    t("home.problem.chaos.items.1"),
    t("home.problem.chaos.items.2"),
    t("home.problem.chaos.items.3"),
    t("home.problem.chaos.items.4"),
    t("home.problem.chaos.items.5"),
    t("home.problem.chaos.items.6"),
  ];

  const leakItems = [
    { amount: t("home.problem.leaks.items.0.amount"), desc: t("home.problem.leaks.items.0.desc") },
    { amount: t("home.problem.leaks.items.1.amount"), desc: t("home.problem.leaks.items.1.desc") },
    { amount: t("home.problem.leaks.items.2.amount"), desc: t("home.problem.leaks.items.2.desc") },
    { amount: t("home.problem.leaks.items.3.amount"), desc: t("home.problem.leaks.items.3.desc") },
    { amount: t("home.problem.leaks.items.4.amount"), desc: t("home.problem.leaks.items.4.desc") },
  ];

  const fixItems = [
    t("home.problem.fix.items.0"),
    t("home.problem.fix.items.1"),
    t("home.problem.fix.items.2"),
    t("home.problem.fix.items.3"),
    t("home.problem.fix.items.4"),
    t("home.problem.fix.items.5"),
  ];

  const beforeAfterData = [
    { metric: t("home.roi.beforeAfter.0.metric"), before: t("home.roi.beforeAfter.0.before"), after: t("home.roi.beforeAfter.0.after") },
    { metric: t("home.roi.beforeAfter.1.metric"), before: t("home.roi.beforeAfter.1.before"), after: t("home.roi.beforeAfter.1.after") },
    { metric: t("home.roi.beforeAfter.2.metric"), before: t("home.roi.beforeAfter.2.before"), after: t("home.roi.beforeAfter.2.after") },
    { metric: t("home.roi.beforeAfter.3.metric"), before: t("home.roi.beforeAfter.3.before"), after: t("home.roi.beforeAfter.3.after") },
    { metric: t("home.roi.beforeAfter.4.metric"), before: t("home.roi.beforeAfter.4.before"), after: t("home.roi.beforeAfter.4.after") },
  ];

  const roiExample = [
    { label: t("home.roi.example.0.label"), value: t("home.roi.example.0.value") },
    { label: t("home.roi.example.1.label"), value: t("home.roi.example.1.value") },
    { label: t("home.roi.example.2.label"), value: t("home.roi.example.2.value") },
    { label: t("home.roi.example.3.label"), value: t("home.roi.example.3.value") },
    { label: t("home.roi.example.4.label"), value: t("home.roi.example.4.value") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <section
        className="relative text-white pb-[120px]"
        style={{
          backgroundImage: "linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0zNCAyNGgydjRoLTJ2LTR6TTI0IDI0aDJ2NGgtMnYtNHptMCA2aDJ2NGgtMnYtNHptMCA2aDJ2NGgtMnYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge
              className="bg-white/20 text-white border-white/30 text-sm px-4 py-1"
              data-testid="badge-preheadline"
            >
              {t("home.hero.badge")}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("home.hero.headline1")}
              <br />
              {t("home.hero.headline2")}
              <br />
              <span className="text-blue-100">{t("home.hero.headline3")}</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {t("home.hero.subheadline1")}
              <br />
              <br />
              {t("home.hero.subheadline2")}
            </p>

            <div className="pt-8">
              <p className="text-lg font-medium mb-4">{t("home.hero.iAmA")}</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {segmentButtons.map((btn) => (
                  <Button
                    key={btn.id}
                    variant={activeSegment === btn.id ? "default" : "outline"}
                    className={
                      activeSegment === btn.id
                        ? "bg-white text-[#0B64A3] hover:bg-blue-50"
                        : "border-white/40 text-white hover:bg-white hover:text-[#0B64A3] transition-colors"
                    }
                    onClick={() => setActiveSegment(btn.id)}
                    data-testid={`button-segment-${btn.id}`}
                  >
                    <btn.icon className="w-4 h-4 mr-2" />
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {content && (
            <div className="mt-12 text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-4"
                  data-testid="text-segment-headline"
                >
                  {content.headline}
                </h2>
                <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                  {content.subheadline}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-4">
                {content.pillars.map((pillar, i) => (
                  <Card
                    key={i}
                    className="bg-white/10 border-white/20 backdrop-blur-sm"
                  >
                    <CardContent className="p-6 text-center">
                      <pillar.icon className="w-10 h-10 mx-auto mb-4 text-white" />
                      <h3 className="text-lg font-bold text-white mb-2">
                        {pillar.headline}
                      </h3>
                      <p className="text-blue-100 text-base">{pillar.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <div className="flex flex-col items-center gap-1">
                  <Button
                    size="lg"
                    className="bg-white text-[#0B64A3] hover:bg-blue-50"
                    asChild
                  >
                    <Link href={content.primaryCta.href}>
                      {content.primaryCta.text}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  {content.primaryCta.subtext && (
                    <span className="text-xs text-blue-100">
                      {content.primaryCta.subtext}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href={content.secondaryCta.href}>
                      {content.secondaryCta.text}
                    </Link>
                  </Button>
                  {content.secondarySubtext && (
                    <span className="text-xs text-blue-100">
                      {content.secondarySubtext}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-blue-100 italic">
                {content.trustSignal}
              </p>
            </div>
          )}
        </div>

        <div className="absolute -bottom-[1px] left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto block"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-white dark:fill-slate-950"
            />
          </svg>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-950 py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("home.socialProof.title")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("home.socialProof.description")}
          </p>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("home.problem.title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {t("home.problem.chaos.title")}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  {t("home.problem.chaos.subtitle")}
                </p>
                <ul className="space-y-3">
                  {chaosItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base">
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base font-medium text-muted-foreground italic">
                  {t("home.problem.chaos.conclusion")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {t("home.problem.leaks.title")}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  {t("home.problem.leaks.subtitle")}
                </p>
                <ul className="space-y-3">
                  {leakItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base">
                      <DollarSign className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-rose-600">{item.amount}</strong>{" "}
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-lg font-bold text-rose-600">
                  {t("home.problem.leaks.total")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-2 border-[#0B64A3]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#0B64A3]">
                  {t("home.problem.fix.title")}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  {t("home.problem.fix.subtitle")}
                </p>
                <ul className="space-y-3">
                  {fixItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base font-medium text-muted-foreground">
                  {t("home.problem.fix.conclusion")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-950 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.modules.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.modules.subtitle")}
            </p>
          </div>

          <div className="mb-8">
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2 justify-center">
                {moduleCategoryIds.map((categoryId) => {
                  const modulesInCategory =
                    categoryId === "all"
                      ? moduleData.length
                      : moduleData.filter((m) => m.category === categoryId).length;
                  const isSelected = selectedModuleCategory === categoryId;
                  const Icon = moduleCategoryIcons[categoryId as keyof typeof moduleCategoryIcons];
                  const color = moduleCategoryColors[categoryId as keyof typeof moduleCategoryColors];

                  return (
                    <Button
                      key={categoryId}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedModuleCategory(categoryId)}
                      className="gap-2 whitespace-nowrap"
                      data-testid={`button-module-category-${categoryId}`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "" : color}`} />
                      {t(`home.modules.categories.${categoryId}`)}
                      {categoryId !== "all" && (
                        <Badge
                          variant="secondary"
                          className="ml-1 min-w-[20px] h-5 text-xs"
                        >
                          {modulesInCategory}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredModules.map((module) => (
                <motion.div
                  key={module.key}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Card
                    className="hover-elevate h-full"
                    data-testid={`card-module-${module.key}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0B64A3]/10 flex items-center justify-center shrink-0">
                          <module.icon className="w-5 h-5 text-[#0B64A3]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {t(`home.modules.items.${module.key}.name`)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t(`home.modules.items.${module.key}.desc`)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              className="bg-[#0B64A3] text-white hover:bg-[#0369A1]"
              asChild
            >
              <Link href="/pricing">
                {t("home.modules.seeAllCta")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("home.roi.title")}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-card">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-6">{t("home.roi.investment.title")}</h3>
                <div className="bg-muted/50 rounded-xl p-6 mb-6">
                  <div className="text-4xl font-bold text-[#0B64A3] mb-2">
                    {t("home.roi.investment.basePrice")}<span className="text-xl font-normal">{t("home.roi.investment.basePriceSuffix")}</span>
                  </div>
                  <div className="text-2xl font-semibold mb-2">
                    {t("home.roi.investment.perTechPrice")}
                    <span className="text-base font-normal">
                      {t("home.roi.investment.perTechPriceSuffix")}
                    </span>
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {t("home.roi.investment.equals")}
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  {t("home.roi.investment.comparison1")}
                  <br />
                  {t("home.roi.investment.comparison2")}
                </p>
                <p className="text-base text-muted-foreground mt-4">
                  <strong>{t("home.roi.investment.mathSimple")}</strong>
                  <br />
                  {t("home.roi.investment.stressElimination")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 text-center">
                  {t("home.roi.return.title")}
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground pb-2 border-b">
                    <span>{t("home.roi.return.metricHeader")}</span>
                    <span className="text-center">{t("home.roi.return.withoutHeader")}</span>
                    <span className="text-center">{t("home.roi.return.withHeader")}</span>
                  </div>
                  {beforeAfterData.map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 gap-2 text-base py-2 border-b border-muted/50"
                    >
                      <span className="font-medium">{row.metric}</span>
                      <span className="text-center text-rose-600">
                        {row.before}
                      </span>
                      <span className="text-center text-emerald-600 font-medium">
                        {row.after}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-2 border-[#0B64A3]">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-center">
                {t("home.roi.exampleTitle")}
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  {roiExample.map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-muted/50"
                    >
                      <span className="text-base">{row.label}</span>
                      <span
                        className={`font-semibold ${i === 0 ? "text-foreground" : "text-emerald-600"}`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center items-center bg-[#0B64A3]/5 rounded-xl p-6">
                  <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                    {t("home.roi.totalAnnualValue")}
                  </div>
                  <div className="text-3xl font-bold text-[#0B64A3] mb-4">
                    $101,700
                  </div>
                  <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
                    {t("home.roi.netBenefit")}
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 mb-4">
                    $96,312
                  </div>
                  <div className="bg-[#0B64A3] text-white px-6 py-3 rounded-full">
                    <span className="text-2xl font-bold">1,788%</span>{" "}
                    <span className="text-lg">{t("home.roi.roiLabel")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-950 py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t("home.trust.title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-[#0B64A3]/10 flex items-center justify-center mx-auto mb-4">
                  <HardHat className="w-8 h-8 text-[#0B64A3]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{t("home.trust.builtBy.title")}</h3>
                <p className="text-base text-muted-foreground">
                  {t("home.trust.builtBy.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {t("home.trust.dataControl.title")}
                </h3>
                <p className="text-base text-muted-foreground">
                  {t("home.trust.dataControl.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                  <HeartHandshake className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {t("home.trust.noContracts.title")}
                </h3>
                <p className="text-base text-muted-foreground">
                  {t("home.trust.noContracts.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        className="relative text-white py-16 md:py-24 px-4"
        style={{
          backgroundImage: "linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("home.finalCta.title")}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t("home.finalCta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#0B64A3] hover:bg-blue-50"
              asChild
            >
              <Link href="/get-license">
                {t("home.finalCta.startTrial")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/pricing">{t("home.finalCta.scheduleDemo")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-semibold text-white mb-2">
                {t("home.footer.simplePricing.title")}
              </h4>
              <p className="text-base">
                {t("home.footer.simplePricing.description")}
              </p>
            </div>
            <div>
              <Lock className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-semibold text-white mb-2">
                {t("home.footer.noLockIn.title")}
              </h4>
              <p className="text-base">
                {t("home.footer.noLockIn.description")}
              </p>
            </div>
            <div>
              <Mail className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-semibold text-white mb-2">
                {t("home.footer.realSupport.title")}
              </h4>
              <p className="text-base">
                {t("home.footer.realSupport.description")}
              </p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-slate-700">
            <p className="text-sm text-slate-500">
              {t("home.footer.tagline")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

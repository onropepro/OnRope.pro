import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X, Presentation, Home } from "lucide-react";
import { useLocation } from "wouter";

interface Slide {
  title: string;
  description: string;
  screenshot?: string;
  features?: string[];
}

const slides: Slide[] = [
  {
    title: "Welcome to Rope Access Management Platform",
    description: "A comprehensive enterprise platform designed for rope access companies to manage high-rise building maintenance operations with precision and safety.",
    features: [
      "Multi-tenant role-based access control",
      "Real-time GPS workforce tracking",
      "IRATA-compliant safety inspections",
      "Intelligent project management",
      "Client relationship management",
      "Financial controls and quoting"
    ]
  },
  {
    title: "Dashboard Overview",
    description: "Your central command center provides real-time insights into all operations, active projects, and workforce status.",
    features: [
      "Quick access to all major features",
      "Active project tracking",
      "Recent inspections overview",
      "Employee status monitoring",
      "Role-based dashboard customization"
    ]
  },
  {
    title: "Project Management",
    description: "Manage diverse job types including window cleaning, pressure washing, painting, and inspections with visual selection and detailed tracking.",
    features: [
      "Visual job type selection grid",
      "Multiple progress tracking systems (4-Elevation, Parkade Grid, In-Suite)",
      "Building information with GPS location",
      "Custom project attributes",
      "Project status and completion tracking"
    ]
  },
  {
    title: "Client & Building Database",
    description: "Comprehensive client relationship management with intelligent autofill functionality for streamlined project creation.",
    features: [
      "Client and building records management",
      "Autofill intelligence for new projects",
      "Building contact information",
      "Project history per client",
      "Smart data reuse from previous jobs"
    ]
  },
  {
    title: "Job Scheduling System",
    description: "Dual-calendar system with drag-and-drop assignment, color-coding, and conflict detection for optimal resource allocation.",
    features: [
      "Job Schedule view (project-centric)",
      "Employee Schedule view (worker-centric)",
      "Color-coded job types",
      "Drag-and-drop assignment",
      "Conflict detection and warnings"
    ]
  },
  {
    title: "Workforce & Time Tracking",
    description: "Complete employee management with real-time clock-in/out, GPS verification, and comprehensive time tracking.",
    features: [
      "Employee onboarding and management",
      "Real-time GPS clock-in/out",
      "Billable vs non-billable hours",
      "Certification tracking",
      "Pay rate management",
      "Payroll-ready reporting"
    ]
  },
  {
    title: "Active Workers Map",
    description: "Live GPS tracking shows exactly where your team members are working in real-time with interactive map visualization.",
    features: [
      "Real-time location tracking",
      "Interactive Leaflet map display",
      "Worker status indicators",
      "Project assignment visibility",
      "Session duration monitoring"
    ]
  },
  {
    title: "IRATA Equipment Inspections",
    description: "Digital rope access equipment inspection system covering 11 categories with comprehensive pass/fail documentation.",
    features: [
      "11 inspection categories (harness, lanyards, rope, carabiners, etc.)",
      "Daily pre-work safety workflow",
      "Detailed findings documentation",
      "Professional PDF report generation",
      "Inspection history tracking",
      "Gear autofill from inventory"
    ]
  },
  {
    title: "Inventory & Gear Management",
    description: "Track rope access equipment with assignment tracking, serial numbers, and autofill capabilities for inspections.",
    features: [
      "Equipment inventory management",
      "Gear assignment to employees",
      "Serial number tracking",
      "Date in service tracking",
      "My Gear view for employees",
      "Autofill integration with inspections"
    ]
  },
  {
    title: "Safety & Compliance",
    description: "Digitized safety workflows ensure IRATA compliance and comprehensive documentation for all operations.",
    features: [
      "Harness inspection workflows",
      "Toolbox meeting documentation",
      "Safety equipment tracking",
      "Compliance reporting",
      "Audit trail maintenance"
    ]
  },
  {
    title: "Resident Portal & Communication",
    description: "Two-way communication system with complaint management and photo galleries for building residents.",
    features: [
      "Complaint submission and tracking",
      "Two-way messaging",
      "Photo gallery with unit-specific tagging",
      "Notification badges",
      "Service request management"
    ]
  },
  {
    title: "Financial Controls & Quoting",
    description: "Generate accurate quotes with labor cost calculations and maintain strict permission-based access to financial data.",
    features: [
      "Quote generation system",
      "Labor cost calculations",
      "Tax computation",
      "Permission-based financial access",
      "Project budgeting",
      "Cost tracking per job"
    ]
  },
  {
    title: "Role-Based Access Control",
    description: "Granular permissions ensure each user sees only what they need with multi-tenant data isolation.",
    features: [
      "Company Owner - Full system access",
      "Operations Manager - Operational oversight",
      "Site Supervisor - Project management",
      "Rope Access Tech - Field operations",
      "Resident - Portal access",
      "SuperUser - Multi-company administration"
    ]
  },
  {
    title: "Analytics & Reporting",
    description: "Comprehensive insights into operations, productivity, and financial performance across all projects.",
    features: [
      "Billable vs non-billable hours analysis",
      "Employee productivity metrics",
      "Project labor cost tracking",
      "Real-time active worker counts",
      "Custom date range reports"
    ]
  },
  {
    title: "SuperUser Administration",
    description: "Centralized oversight for managing multiple companies, license verification, and system-wide analytics.",
    features: [
      "Company dashboard with all organizations",
      "License status monitoring",
      "Detailed company views",
      "Cross-company analytics",
      "System-wide reporting"
    ]
  },
  {
    title: "Mobile-First Design",
    description: "Premium enterprise SaaS aesthetic with glass-morphism effects and responsive design for all devices.",
    features: [
      "Mobile-optimized interface",
      "44px minimum touch targets",
      "Responsive layouts",
      "Ocean Blue color palette",
      "Professional visual polish",
      "Accessible design standards"
    ]
  }
];

export default function FeaturePresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Presentation className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Platform Features & Capabilities</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-close-presentation"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="min-h-[600px] flex flex-col">
          <CardContent className="flex-1 p-8 flex flex-col">
            {/* Slide Number */}
            <div className="text-sm text-muted-foreground mb-4">
              Slide {currentSlide + 1} of {slides.length}
            </div>

            {/* Slide Content */}
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-primary">{slide.title}</h2>
                <p className="text-lg text-foreground/80 mb-6">{slide.description}</p>
              </div>

              {/* Features List */}
              {slide.features && slide.features.length > 0 && (
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="material-icons text-primary">check_circle</span>
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {slide.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="material-icons text-primary text-sm mt-0.5">chevron_right</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Screenshot Placeholder */}
              {slide.screenshot && (
                <div className="bg-muted rounded-lg p-4 border">
                  <img 
                    src={slide.screenshot} 
                    alt={slide.title}
                    className="w-full h-auto rounded"
                  />
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                data-testid="button-prev-slide"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {/* Slide Indicators */}
              <div className="flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide 
                        ? "w-8 bg-primary" 
                        : "w-2 bg-primary/30 hover-elevate"
                    }`}
                    data-testid={`indicator-slide-${idx}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <Button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                data-testid="button-next-slide"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back-to-dashboard"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

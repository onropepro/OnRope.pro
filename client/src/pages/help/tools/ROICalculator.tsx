import { useState } from 'react';
import { Link } from 'wouter';
import { 
  ArrowLeft, 
  Calculator, 
  DollarSign, 
  Clock, 
  Users,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import HelpBreadcrumb from '@/components/help/HelpBreadcrumb';
import HelpChatWidget from '@/components/help/HelpChatWidget';
import { PublicHeader } from '@/components/PublicHeader';

export default function ROICalculator() {
  const [technicians, setTechnicians] = useState(5);
  const [projectsPerMonth, setProjectsPerMonth] = useState(10);
  const [avgHourlyRate, setAvgHourlyRate] = useState(75);
  const [adminHoursPerWeek, setAdminHoursPerWeek] = useState(20);

  const annualSavings = calculateSavings(technicians, projectsPerMonth, avgHourlyRate, adminHoursPerWeek);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Link href="/help">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Help Center
              </Button>
            </Link>
            <HelpBreadcrumb items={[
              { label: 'Tools' },
              { label: 'ROI Calculator' },
            ]} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-roi-title">
                ROI Calculator
              </h1>
              <p className="text-muted-foreground">
                Calculate your potential savings with OnRopePro
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Business Details</CardTitle>
                  <CardDescription>
                    Adjust the sliders to match your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Number of Technicians</Label>
                      <span className="text-lg font-semibold">{technicians}</span>
                    </div>
                    <Slider
                      value={[technicians]}
                      onValueChange={(v) => setTechnicians(v[0])}
                      min={1}
                      max={50}
                      step={1}
                      data-testid="slider-technicians"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Projects per Month</Label>
                      <span className="text-lg font-semibold">{projectsPerMonth}</span>
                    </div>
                    <Slider
                      value={[projectsPerMonth]}
                      onValueChange={(v) => setProjectsPerMonth(v[0])}
                      min={1}
                      max={100}
                      step={1}
                      data-testid="slider-projects"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Average Billable Rate ($/hr)</Label>
                      <span className="text-lg font-semibold">${avgHourlyRate}</span>
                    </div>
                    <Slider
                      value={[avgHourlyRate]}
                      onValueChange={(v) => setAvgHourlyRate(v[0])}
                      min={25}
                      max={200}
                      step={5}
                      data-testid="slider-rate"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Admin Hours per Week</Label>
                      <span className="text-lg font-semibold">{adminHoursPerWeek}</span>
                    </div>
                    <Slider
                      value={[adminHoursPerWeek]}
                      onValueChange={(v) => setAdminHoursPerWeek(v[0])}
                      min={5}
                      max={60}
                      step={1}
                      data-testid="slider-admin-hours"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Estimated Annual Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-blue-600 mb-6" data-testid="text-total-savings">
                    ${annualSavings.total.toLocaleString()}
                  </div>
                  
                  <div className="space-y-4">
                    <SavingsItem
                      icon={Clock}
                      label="Time Saved on Admin"
                      value={annualSavings.adminTime}
                      description={`${Math.round(adminHoursPerWeek * 0.4 * 52)} hours/year at $${avgHourlyRate}/hr`}
                    />
                    <SavingsItem
                      icon={Users}
                      label="Reduced Payroll Errors"
                      value={annualSavings.payrollErrors}
                      description="Accurate time tracking prevents disputes"
                    />
                    <SavingsItem
                      icon={DollarSign}
                      label="Improved Billable Capture"
                      value={annualSavings.billableCapture}
                      description="Never miss billing for work performed"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to see these savings for your business?
                </p>
                <Link href="/">
                  <Button size="lg">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">How we calculate savings</h3>
            <p className="text-sm text-muted-foreground">
              Our ROI calculator estimates savings based on industry averages for rope access companies. 
              Admin time savings assume a 40% reduction in paperwork and scheduling tasks. 
              Payroll error reduction is estimated at 2% of total payroll costs. 
              Billable capture improvement assumes recovering 5% of previously unbilled work through accurate time tracking.
            </p>
          </div>
        </div>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}

function SavingsItem({ 
  icon: Icon, 
  label, 
  value, 
  description 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number; 
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{label}</span>
          <span className="text-blue-600 font-semibold">${value.toLocaleString()}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function calculateSavings(
  technicians: number, 
  projectsPerMonth: number, 
  avgHourlyRate: number,
  adminHoursPerWeek: number
) {
  const annualAdminHours = adminHoursPerWeek * 52;
  const savedAdminHours = annualAdminHours * 0.4;
  const adminTime = Math.round(savedAdminHours * avgHourlyRate * 0.5);

  const annualPayroll = technicians * avgHourlyRate * 40 * 52;
  const payrollErrors = Math.round(annualPayroll * 0.02);

  const annualBillable = projectsPerMonth * 12 * 8 * avgHourlyRate;
  const billableCapture = Math.round(annualBillable * 0.05);

  return {
    adminTime,
    payrollErrors,
    billableCapture,
    total: adminTime + payrollErrors + billableCapture,
  };
}

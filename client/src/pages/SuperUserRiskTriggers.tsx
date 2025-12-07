import { Link } from "wouter";
import SuperUserLayout from "@/components/SuperUserLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, AlertTriangle, Shield, TrendingDown, Users, 
  DollarSign, Clock, Activity, CheckCircle2, XCircle
} from "lucide-react";

const riskCategories = [
  {
    category: "Churn Risk",
    icon: TrendingDown,
    color: "red",
    triggers: [
      { signal: "Logo churn > 5%/month", response: "Immediate customer success outreach, exit interviews", severity: "critical" },
      { signal: "Revenue churn > 4%/month", response: "Pricing review, value-add features", severity: "critical" },
      { signal: "Usage drop > 30% in 2 weeks", response: "Proactive check-in, training offer", severity: "warning" },
      { signal: "Support tickets spike", response: "Engineering review, documentation update", severity: "warning" },
    ],
  },
  {
    category: "Growth Risk",
    icon: Activity,
    color: "orange",
    triggers: [
      { signal: "Pipeline < 3x quota", response: "Increase marketing spend, partner outreach", severity: "warning" },
      { signal: "Demo-to-close < 20%", response: "Sales training, demo script review", severity: "warning" },
      { signal: "Time-to-value > 30 days", response: "Onboarding optimization, quick-start guides", severity: "warning" },
      { signal: "NPS < 30", response: "Customer interviews, feature prioritization", severity: "critical" },
    ],
  },
  {
    category: "Financial Risk",
    icon: DollarSign,
    color: "yellow",
    triggers: [
      { signal: "CAC payback > 9 months", response: "Sales efficiency review, pricing optimization", severity: "critical" },
      { signal: "Gross margin < 70%", response: "Infrastructure optimization, vendor negotiation", severity: "warning" },
      { signal: "Burn rate > 18 mo runway", response: "Cost reduction plan, fundraising timeline", severity: "critical" },
      { signal: "LTV:CAC < 3:1", response: "Customer quality focus, upsell strategy", severity: "warning" },
    ],
  },
  {
    category: "Operational Risk",
    icon: Shield,
    color: "purple",
    triggers: [
      { signal: "Uptime < 99.5%", response: "Infrastructure investment, incident review", severity: "critical" },
      { signal: "Response time > 24hr", response: "Support team scaling, SLA review", severity: "warning" },
      { signal: "Security incident", response: "Immediate response protocol, customer notification", severity: "critical" },
      { signal: "Key person dependency", response: "Knowledge transfer, hiring plan", severity: "warning" },
    ],
  },
];

const earlyWarningSignals = [
  { signal: "Decreased login frequency", metric: "< 3 logins/week", action: "Engagement campaign" },
  { signal: "Feature adoption stall", metric: "< 50% using core features", action: "Training webinar" },
  { signal: "Billing failures", metric: "> 2% failed payments", action: "Payment method update" },
  { signal: "Support escalations", metric: "> 10% tickets escalated", action: "Product improvement" },
  { signal: "Competitor mentions", metric: "In support/sales calls", action: "Competitive analysis" },
  { signal: "Delayed renewals", metric: "> 30 days past due", action: "Account manager review" },
];

const responsePlaybooks = [
  {
    scenario: "High-Value Customer At Risk",
    steps: [
      "Immediate exec-level outreach within 24 hours",
      "Schedule on-site visit or video call",
      "Prepare custom value analysis report",
      "Offer retention incentives (extended trial, discount)",
      "Assign dedicated success manager",
    ],
  },
  {
    scenario: "Churn Spike Detected",
    steps: [
      "Pause all upsell/expansion activities",
      "Conduct exit interviews with churned customers",
      "Analyze common pain points and patterns",
      "Emergency product/support improvements",
      "Communicate improvements to at-risk customers",
    ],
  },
  {
    scenario: "Product Quality Issue",
    steps: [
      "Immediate engineering war room",
      "Customer communication with ETA",
      "Rollback or hotfix deployment",
      "Post-mortem and prevention plan",
      "Follow-up with affected customers",
    ],
  },
];

export default function SuperUserRiskTriggers() {
  const getSeverityBadge = (severity: string) => {
    const configs: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; text: string }> = {
      critical: { variant: "destructive", text: "Critical" },
      warning: { variant: "secondary", text: "Warning" },
      info: { variant: "outline", text: "Info" },
    };
    const config = configs[severity] || { variant: "outline" as const, text: severity };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    red: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-500", border: "border-red-200 dark:border-red-800" },
    orange: { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-500", border: "border-orange-200 dark:border-orange-800" },
    yellow: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-500", border: "border-amber-200 dark:border-amber-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-500", border: "border-purple-200 dark:border-purple-800" },
  };

  return (
    <SuperUserLayout title="Risk Triggers">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/superuser/goals">
              <Button variant="outline" size="icon" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Risk Triggers</h1>
                  <p className="text-gray-500 dark:text-gray-400">Warning signs and response protocols</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="grid-risk-categories">
            {riskCategories.map((category, idx) => {
              const Icon = category.icon;
              const colors = colorMap[category.color];

              return (
                <div key={idx} className={`su-card ${colors.border}`}>
                  <div className="su-card-header">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${colors.bg}`}>
                        <Icon className={`h-5 w-5 ${colors.text}`} />
                      </div>
                      <h3 className="font-semibold text-gray-800 dark:text-white/90">{category.category}</h3>
                    </div>
                  </div>
                  <div className="su-card-body">
                    <div className="space-y-3">
                      {category.triggers.map((trigger, tidx) => (
                        <div key={tidx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-sm font-medium text-gray-800 dark:text-white/90">{trigger.signal}</span>
                            {getSeverityBadge(trigger.severity)}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Response: {trigger.response}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Early Warning Signals */}
          <div className="su-card" data-testid="card-early-warnings">
            <div className="su-card-header">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Early Warning Signals</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Leading indicators to watch before problems escalate</p>
            </div>
            <div className="su-card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earlyWarningSignals.map((warning, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{warning.signal}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Threshold: {warning.metric}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Action: {warning.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Response Playbooks */}
          <div className="su-card" data-testid="card-response-playbooks">
            <div className="su-card-header">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Response Playbooks</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pre-defined action plans for common scenarios</p>
            </div>
            <div className="su-card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {responsePlaybooks.map((playbook, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-3">{playbook.scenario}</h4>
                    <ol className="space-y-2">
                      {playbook.steps.map((step, sidx) => (
                        <li key={sidx} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                            {sidx + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="su-card bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Current Risk Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">Churn</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">No triggers</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">Growth</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">No triggers</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">Financial</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">No triggers</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">Operations</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">No triggers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperUserLayout>
  );
}

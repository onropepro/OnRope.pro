import { SafetyRatingCard } from "./cards/SafetyRatingCard";
import { CertificationAlertsCard } from "./cards/CertificationAlertsCard";
import { ActiveProjectsCard } from "./cards/ActiveProjectsCard";
import { TodayScheduleCard } from "./cards/TodayScheduleCard";
import { ActiveWorkersCard } from "./cards/ActiveWorkersCard";
import { MyTimeCard } from "./cards/MyTimeCard";
import { PayPeriodCard } from "./cards/PayPeriodCard";
import { OvertimeAlertCard } from "./cards/OvertimeAlertCard";
import { HarnessStatusCard } from "./cards/HarnessStatusCard";
import { ToolboxCoverageCard } from "./cards/ToolboxCoverageCard";
import { OutstandingQuotesCard } from "./cards/OutstandingQuotesCard";
import { MyScheduleCard } from "./cards/MyScheduleCard";
import { WeekAtGlanceCard } from "./cards/WeekAtGlanceCard";
import { MyPerformanceCard } from "./cards/MyPerformanceCard";
import { TodaysHoursCard } from "./cards/TodaysHoursCard";
import { NotClockedInCard } from "./cards/NotClockedInCard";
import { OverdueProjectsCard } from "./cards/OverdueProjectsCard";
import { PendingApprovalsCard } from "./cards/PendingApprovalsCard";
import { ExpiringCertsCard } from "./cards/ExpiringCertsCard";
import { NewFeedbackCard } from "./cards/NewFeedbackCard";
import { PlaceholderCard } from "./cards/PlaceholderCard";
import { WeatherCard } from "./cards/WeatherCard";

export interface CardProps {
  currentUser: any;
  projects: any[];
  employees: any[];
  harnessInspections: any[];
  onNavigate: (tab: string) => void;
  onRouteNavigate: (path: string) => void;
  onCreateProject?: () => void;
  branding?: any;
}

export function getCardComponent(cardId: string, props: CardProps): React.ReactNode {
  switch (cardId) {
    case "safe-csr":
      return <SafetyRatingCard {...props} />;
    case "emp-certs":
      return <CertificationAlertsCard {...props} />;
    case "proj-active":
      return <ActiveProjectsCard {...props} />;
    case "sched-today":
      return <TodayScheduleCard {...props} />;
    case "time-active":
      return <ActiveWorkersCard {...props} />;
    case "time-my":
      return <MyTimeCard {...props} />;
    case "pay-period":
      return <PayPeriodCard {...props} />;
    case "pay-overtime":
      return <OvertimeAlertCard {...props} />;
    case "safe-harness":
      return <HarnessStatusCard {...props} />;
    case "safe-toolbox":
      return <ToolboxCoverageCard {...props} />;
    case "quote-pending":
      return <OutstandingQuotesCard {...props} />;
    case "sched-my":
      return <MyScheduleCard {...props} />;
    case "sched-week":
      return <WeekAtGlanceCard {...props} />;
    case "perf-my":
      return <MyPerformanceCard {...props} />;
    case "time-today":
      return <TodaysHoursCard {...props} />;
    case "time-notclocked":
      return <NotClockedInCard {...props} />;
    case "proj-overdue":
      return <OverdueProjectsCard {...props} />;
    case "pay-pending":
      return <PendingApprovalsCard {...props} />;
    case "safe-certs":
      return <ExpiringCertsCard {...props} />;
    case "feed-new":
      return <NewFeedbackCard {...props} />;
    case "ops-weather":
      return <WeatherCard {...props} />;
    default:
      return <PlaceholderCard cardId={cardId} />;
  }
}

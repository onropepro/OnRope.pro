# Payroll Preparation

Aggregate work hours, calculate overtime, and export payroll-ready data for external payroll software.

## Overview

The Payroll module creates a complete data pipeline from field work to payroll export. Every clock-in becomes payroll data automatically. Zero manual entry required between field work and payroll preparation. This module does NOT process payroll (no CPP, EI, tax calculations). It prepares payroll-ready data for export to external payroll software like QuickBooks, ADP, or Gusto.

## The Golden Rule: Automated Payroll Data Pipeline

```
Work Sessions -> Timesheets -> Payroll Export
```

The data flow:
1. **Work Session Created**: GPS-verified clock-in captures start time
2. **Hours Calculated**: Regular and overtime hours computed automatically
3. **Project Attribution**: Which building, which job, all tracked
4. **Pay Period Aggregation**: Automatic grouping by your configured period
5. **Timesheet Generation**: Employee-by-employee breakdown ready for review
6. **Export**: CSV for payroll software, PDF for records

## Key Features

### Pay Period Configuration
- Weekly
- Bi-Weekly
- Semi-Monthly
- Monthly
- System auto-generates period boundaries based on selection

### Automatic Aggregation
Work sessions flow directly into timesheets with zero manual data entry. Hours calculated automatically.

### Configurable Overtime
- Daily trigger (default: 8 hours)
- Weekly trigger (default: 40 hours)
- Custom thresholds available
- Multipliers adjustable (1.5x, 2x, 3x)
- Can disable entirely

### Project Attribution
Every work session shows which project it was logged against. Know exactly how many hours went to each building for job costing.

### Billable vs Non-Billable
Distinguish revenue-generating client hours from operational costs:
- Travel time
- Training
- Weather delays
- Administrative work

### Export Capabilities
- CSV export for payroll software integration
- PDF timesheet reports for records
- Per-employee breakdowns
- Pay period summaries

## How It Works

### Reviewing Timesheets
1. Navigate to Payroll section
2. Select pay period
3. View employee-by-employee hour summaries
4. Review regular vs overtime breakdown
5. Make any necessary adjustments

### Exporting for Payroll
1. Confirm timesheet accuracy
2. Click Export
3. Choose format (CSV or PDF)
4. Import into your payroll software

### Adjusting Overtime Settings
1. Go to Company Settings
2. Navigate to Payroll Configuration
3. Set daily and/or weekly overtime triggers
4. Choose overtime multiplier
5. Save changes

## Important Disclaimer

OnRopePro's Payroll module helps aggregate hours and prepare timesheet data, but is not a substitute for professional accounting or legal advice.

OnRopePro does NOT calculate:
- CPP/EI deductions (Canada)
- Social Security/Medicare (US)
- Federal, state/provincial, or local tax withholding
- Workers' compensation premiums
- Any statutory deductions

You are responsible for ensuring compliance with all applicable federal, state/provincial, and local labor laws including minimum wage, overtime rules, tax withholding, and reporting requirements. Requirements vary by jurisdiction. Consult with qualified accountants and employment attorneys.

## Integration Points

- **Time Tracking**: Hours flow automatically from work sessions
- **Project Management**: Labor costs attributed per project
- **Employee Management**: Pay rates and banking info
- **Analytics**: Labor cost analysis and trends

## Common Questions

**Q: Can I edit timesheet data?**
A: Yes, authorized managers can adjust hours before export.

**Q: How far back can I access payroll data?**
A: Historical access is unlimited for audit and job costing purposes.

**Q: What if an employee disputes their hours?**
A: GPS-verified work sessions provide documentation for resolution.

## Related Modules

- [Time Tracking](/help/modules/time-tracking)
- [Analytics](/help/modules/analytics-reporting)
- [Employee Management](/help/modules/employee-management)

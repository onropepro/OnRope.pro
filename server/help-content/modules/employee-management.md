# Employee Management

Manage employee profiles, certifications, onboarding documents, and workforce organization.

## Overview

The Employee Management module centralizes all workforce information for rope access companies. From initial onboarding through certification tracking to payroll data, every aspect of employee administration lives in one system. This eliminates scattered spreadsheets and paper files while ensuring compliance with industry requirements.

## Key Features

### Employee Profiles
- Personal information management
- Contact details and emergency contacts
- Role and permission assignment
- Employment status tracking
- Profile photo upload

### Certification Tracking
- IRATA/SPRAT certification levels
- First Aid and safety certifications
- Expiration date monitoring
- Renewal reminders (60-day yellow, 30-day red)
- Certificate document storage

### Onboarding Workflow
- New hire information collection
- Required document acknowledgment
- Policy signature capture
- Equipment assignment
- Training completion tracking

### Self-Registration
Technicians can self-register with:
- Personal information
- Certification details
- Contact information
- Banking details (encrypted)
- Driving information
- Experience history

### Referral System
- Unique 12-character referral codes per technician
- Referral count tracking
- Network growth visibility

## How It Works

### Adding New Employees
1. Navigate to Employees section
2. Click "Add Employee" or send registration link
3. Complete required information fields
4. Assign role and permissions
5. Trigger onboarding document workflow

### For Self-Registration
1. Technician receives registration link
2. Completes multi-step registration form
3. Uploads certifications and resume
4. Reviews and signs privacy notices
5. Account created pending company approval

### Managing Certifications
1. View employee profile
2. Navigate to Certifications tab
3. Add certification with expiry date
4. Upload supporting documents
5. System tracks expiration automatically

## Security Features

Sensitive employee data is encrypted at rest using AES-256-GCM:
- Social Insurance Number (SIN)
- Bank account details
- Driver's license information
- Medical conditions

## Integration Points

- **Payroll**: Employee pay rates and banking info flow to payroll
- **Scheduling**: Employee availability and assignments
- **Safety**: Certification status affects work eligibility
- **Gear Inventory**: Equipment assignments tracked per employee
- **Document Management**: Signed documents linked to profiles

## Common Questions

**Q: Can employees update their own information?**
A: Yes, technicians can update contact details and certifications through the Technician Portal.

**Q: How do I track who has signed company policies?**
A: The Document Review section shows signature status for all required documents.

**Q: What happens when a certification expires?**
A: The system displays warnings and can restrict scheduling for expired certifications.

## Related Modules

- [Document Management](/help/modules/document-management)
- [Gear Inventory](/help/modules/gear-inventory)
- [Payroll](/help/modules/payroll)
- [Scheduling](/help/modules/scheduling)

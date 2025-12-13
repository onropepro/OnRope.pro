# SCR Rating System (Safety Compliance Rating)

## Overview

The SCR (Safety Compliance Rating) is a point-based system that measures a company's safety compliance. The rating is visible to **company owners** and **property managers** only.

## Current Implementation

All SCR values are currently set to **0 points** as a baseline. The system tracks the following categories but does not apply any penalties or bonuses until further instructions:

### Rating Categories

1. **Documentation** (0 points)
   - Tracks: Health & Safety Manual, Company Policy, Certificate of Insurance
   - Currently: No points awarded or deducted

2. **Toolbox Meetings** (0 points)
   - Tracks: Meeting coverage for work days (7-day coverage window)
   - Currently: No points awarded or deducted

3. **Harness Inspections** (0 points)
   - Tracks: Daily harness inspections for workers with active work sessions
   - Currently: No points awarded or deducted

4. **Document Reviews** (0 points)
   - Tracks: Employee acknowledgment signatures on safety documents
   - Required docs: Health & Safety Manual, Company Policy, Safe Work Procedures, Safe Work Practices
   - Currently: No points awarded or deducted

5. **Project Documentation** (0 points)
   - Tracks: Anchor Inspection, Rope Access Plan, FLHA per project
   - Currently: No points awarded or deducted

## Access Permissions

- **Company Owners**: Always have access to view SCR
- **Property Managers**: Always have access to view SCR
- **Other Roles**: Require explicit `view_csr` permission

## Display Format

- Overall score: `X points` (e.g., "0 points")
- Breakdown categories: `X points` each
- Badge color changes based on score thresholds (currently red at 0)

## API Endpoints

1. **Main SCR Endpoint**: `GET /api/company-safety-rating`
   - Returns overall SCR and breakdown for the logged-in user's company

2. **Vendor SCR Endpoint**: `GET /api/property-managers/vendors/:linkId/csr`
   - Property managers can view SCR of their linked vendor companies

3. **History Endpoint**: `GET /api/company-safety-rating/history`
   - Returns SCR change history for the company

## Files

- **Frontend Component**: `client/src/components/CSRBadge.tsx`
- **Permissions**: `client/src/lib/permissions.ts` (function: `canViewCSR`)
- **Backend Endpoints**: `server/routes.ts` (lines ~13045 and ~13480)

## Future Development

When ready to implement the full scoring system:
1. Define point values for each category
2. Update the backend endpoints to calculate actual scores
3. The frontend will automatically display the calculated values

# Property Manager Feature - Production Schema Changes

## Overview
This document outlines the database schema changes required for the Property Manager feature. These changes have been tested in development and are ready to be pushed to production.

## Schema Changes Made

### 1. New User Role
- Added `property_manager` to the allowed user roles enum

### 2. New Fields in Users Table
- `firstName`: `varchar` (column: `first_name`, nullable) - Property manager first name
- `lastName`: `varchar` (column: `last_name`, nullable) - Property manager last name  
- `propertyManagementCompany`: `varchar` (column: `property_management_company`, nullable) - Property manager company name

### 3. New Table: property_manager_company_links
Junction table to support property managers linking to multiple rope access companies.

```sql
CREATE TABLE property_manager_company_links (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  property_manager_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_code varchar(10) NOT NULL,
  company_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  added_at timestamp DEFAULT now(),
  CONSTRAINT unique_property_manager_company UNIQUE (property_manager_id, company_code)
);
```

**Columns:**
- `id`: Primary key (UUID auto-generated)
- `property_manager_id`: Foreign key to property manager user (cascade delete)
- `company_code`: The 10-character company code being linked (from company's residentCode)
- `company_id`: Foreign key to the company this code belongs to (cascade delete)
- `added_at`: Timestamp when the link was created

**Constraints:**
- UNIQUE constraint on `(property_manager_id, company_code)` - prevents duplicate links to same company code
- Foreign key cascades ensure cleanup when users are deleted

## Pushing to Production

### Development Database (Already Complete)
Schema changes have been successfully pushed to development using:
```bash
npm run db:push
```

### Production Database (Action Required)
To push these changes to production, the user needs to:

1. **Via Replit Database Pane:**
   - Navigate to the Database tab in Replit
   - Switch to "Production" database view
   - Use the "Apply Schema" or similar option to sync changes

2. **Via Command Line (if applicable):**
   ```bash
   # Set DATABASE_URL to production database
   # Then run:
   npm run db:push --force
   ```

## What This Enables

Property managers can now:
- Register accounts with their first/last name and company
- Link to multiple rope access companies using 10-character company codes
- View all buildings and projects from all linked companies
- Manage their company links via the PropertyManagerSettings page
- Have read-only access to buildings/projects (no create/update/delete)

## Access Control Changes

### Projects
- Property managers can see projects from ALL linked companies in `/api/projects`
- `verifyProjectAccess` grants access to projects from linked companies
- New storage function: `getProjectsForPropertyManager(propertyManagerId, status?)`

### Buildings/Clients
- Property managers can see buildings from ALL linked companies in `/api/clients`
- Individual client access verified against linked companies in `/api/clients/:id`
- Property managers have read-only access (POST/PATCH/DELETE remain restricted)

## Migration Notes

- All schema changes use Drizzle ORM migrations
- Changes are non-destructive (adding columns and tables only)
- Existing data is not affected
- New columns are nullable to support existing user records
- Foreign key constraints ensure data integrity
- Unique constraint prevents duplicate company links

## Testing Checklist (Post-Production Push)

- [ ] Property manager registration flow
- [ ] Company code linking (valid and invalid codes)
- [ ] Multiple company code management
- [ ] Project list shows projects from all linked companies
- [ ] Building list shows buildings from all linked companies  
- [ ] Project detail access verification
- [ ] Building detail access verification
- [ ] Read-only restrictions (no create/update/delete for property managers)
- [ ] Company code removal
- [ ] Error handling and user feedback

## Rollback Plan

If issues occur in production:
1. Remove property_manager role validation from routes
2. Drop the property_manager_company_links table
3. Remove firstName, lastName, company fields from users table (if safe)
4. Restore previous schema version

Note: Rollback should only be necessary if critical bugs are discovered. The changes are designed to be non-breaking for existing functionality.

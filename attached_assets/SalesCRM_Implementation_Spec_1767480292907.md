# Sales CRM Implementation Specification

## Overview

Internal sales CRM for OnRopePro admin team to manage lead generation, outreach, and conversion tracking. SuperUser-only access. Integrates with existing SendGrid infrastructure and adds BrightData for lead enrichment.

## File Locations

| Type | Location |
|------|----------|
| Schema | `shared/schema.ts` |
| API Routes | `server/routes.ts` |
| Pages | `client/src/pages/admin/` |
| Components | `client/src/components/crm/` |

---

## Phase 1: Database Schema

Add to `shared/schema.ts`:

### Enums

```typescript
export const crmPipelineStageEnum = pgEnum('crm_pipeline_stage', [
  'lead_captured',
  'contacted',
  'demo_scheduled',
  'trial',
  'paid_subscriber',
  'churned',
  'lost'
]);

export const crmActivityTypeEnum = pgEnum('crm_activity_type', [
  'email_sent',
  'email_received',
  'email_opened',
  'email_clicked',
  'call_made',
  'call_received',
  'note',
  'demo_completed',
  'stage_change',
  'task_completed'
]);

export const crmLeadSourceEnum = pgEnum('crm_lead_source', [
  'brightdata_scrape',
  'sprat_directory',
  'irata_directory',
  'website_signup',
  'referral',
  'linkedin',
  'cold_outreach',
  'inbound_inquiry',
  'conference',
  'manual'
]);

export const crmConsentTypeEnum = pgEnum('crm_consent_type', [
  'none',
  'implied_published',
  'implied_business',
  'express'
]);
```

### Tables

```typescript
// CRM Companies (potential customers, NOT linked to users table)
export const crmCompanies = pgTable('crm_companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  website: varchar('website', { length: 500 }),
  phone: varchar('phone', { length: 50 }),
  
  // Location
  address: varchar('address', { length: 500 }),
  city: varchar('city', { length: 100 }),
  stateProvince: varchar('state_province', { length: 100 }),
  country: varchar('country', { length: 2 }).default('CA'), // CA or US
  postalCode: varchar('postal_code', { length: 20 }),
  
  // Industry data
  certifications: text('certifications').array(), // ['SPRAT', 'IRATA']
  estimatedSize: varchar('estimated_size', { length: 50 }), // '1-5', '6-15', '16-30', '31-50', '50+'
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  
  // Enrichment
  source: crmLeadSourceEnum('source').default('manual'),
  brightdataId: varchar('brightdata_id', { length: 255 }),
  lastEnrichedAt: timestamp('last_enriched_at'),
  
  // Link to converted customer (when they sign up)
  convertedUserId: integer('converted_user_id').references(() => users.id),
  convertedAt: timestamp('converted_at'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// CRM Contacts (people at companies)
export const crmContacts = pgTable('crm_contacts', {
  id: serial('id').primaryKey(),
  companyId: integer('company_id').references(() => crmCompanies.id, { onDelete: 'cascade' }),
  
  // Personal info
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  jobTitle: varchar('job_title', { length: 100 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  
  // Pipeline
  stage: crmPipelineStageEnum('stage').default('lead_captured').notNull(),
  leadScore: integer('lead_score').default(0),
  
  // Compliance (CASL/CAN-SPAM)
  consentType: crmConsentTypeEnum('consent_type').default('none'),
  consentDate: timestamp('consent_date'),
  consentSource: varchar('consent_source', { length: 255 }), // 'website_published', 'form_submission', etc.
  doNotContact: boolean('do_not_contact').default(false),
  unsubscribedAt: timestamp('unsubscribed_at'),
  
  // Source tracking
  source: crmLeadSourceEnum('source').default('manual'),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 100 }),
  
  // Engagement
  lastContactedAt: timestamp('last_contacted_at'),
  lastRespondedAt: timestamp('last_responded_at'),
  emailOpenCount: integer('email_open_count').default(0),
  emailClickCount: integer('email_click_count').default(0),
  
  // Notes
  notes: text('notes'),
  tags: text('tags').array(),
  
  // Link to converted user
  convertedUserId: integer('converted_user_id').references(() => users.id),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// CRM Activities (timeline of all interactions)
export const crmActivities = pgTable('crm_activities', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id').references(() => crmContacts.id, { onDelete: 'cascade' }).notNull(),
  companyId: integer('company_id').references(() => crmCompanies.id, { onDelete: 'cascade' }),
  
  type: crmActivityTypeEnum('type').notNull(),
  subject: varchar('subject', { length: 255 }),
  description: text('description'),
  
  // For emails
  emailMessageId: varchar('email_message_id', { length: 500 }),
  emailStatus: varchar('email_status', { length: 50 }), // 'sent', 'delivered', 'opened', 'clicked', 'bounced'
  
  // For stage changes
  previousStage: crmPipelineStageEnum('previous_stage'),
  newStage: crmPipelineStageEnum('new_stage'),
  
  // Metadata (flexible JSON for call duration, etc.)
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// CRM Email Templates
export const crmEmailTemplates = pgTable('crm_email_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  bodyHtml: text('body_html').notNull(),
  bodyText: text('body_text'),
  
  // Categorization
  category: varchar('category', { length: 50 }), // 'cold_outreach', 'follow_up', 'demo_request', etc.
  isActive: boolean('is_active').default(true),
  
  // Stats
  sentCount: integer('sent_count').default(0),
  openCount: integer('open_count').default(0),
  clickCount: integer('click_count').default(0),
  replyCount: integer('reply_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// CRM Email Sequences (automated follow-up cadences)
export const crmSequences = pgTable('crm_sequences', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('draft'), // 'draft', 'active', 'paused', 'archived'
  
  // Settings
  sendOnWeekends: boolean('send_on_weekends').default(false),
  sendStartHour: integer('send_start_hour').default(9), // 9 AM
  sendEndHour: integer('send_end_hour').default(17), // 5 PM
  timezone: varchar('timezone', { length: 50 }).default('America/Vancouver'),
  
  // Stats
  enrolledCount: integer('enrolled_count').default(0),
  completedCount: integer('completed_count').default(0),
  repliedCount: integer('replied_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// CRM Sequence Steps
export const crmSequenceSteps = pgTable('crm_sequence_steps', {
  id: serial('id').primaryKey(),
  sequenceId: integer('sequence_id').references(() => crmSequences.id, { onDelete: 'cascade' }).notNull(),
  stepNumber: integer('step_number').notNull(),
  delayDays: integer('delay_days').notNull(), // Days after previous step
  
  templateId: integer('template_id').references(() => crmEmailTemplates.id),
  // OR custom content
  subject: varchar('subject', { length: 255 }),
  bodyHtml: text('body_html'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// CRM Sequence Enrollments (contacts in sequences)
export const crmSequenceEnrollments = pgTable('crm_sequence_enrollments', {
  id: serial('id').primaryKey(),
  sequenceId: integer('sequence_id').references(() => crmSequences.id, { onDelete: 'cascade' }).notNull(),
  contactId: integer('contact_id').references(() => crmContacts.id, { onDelete: 'cascade' }).notNull(),
  
  status: varchar('status', { length: 20 }).default('active'), // 'active', 'paused', 'completed', 'replied', 'bounced', 'unsubscribed'
  currentStep: integer('current_step').default(1),
  nextSendAt: timestamp('next_send_at'),
  pauseReason: varchar('pause_reason', { length: 255 }),
  
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// CRM Tasks (to-dos for follow-ups)
export const crmTasks = pgTable('crm_tasks', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id').references(() => crmContacts.id, { onDelete: 'cascade' }),
  companyId: integer('company_id').references(() => crmCompanies.id, { onDelete: 'cascade' }),
  
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  dueDate: timestamp('due_date'),
  priority: varchar('priority', { length: 20 }).default('medium'), // 'low', 'medium', 'high', 'urgent'
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'completed', 'cancelled'
  
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// CRM BrightData Imports (track scraping jobs)
export const crmBrightdataImports = pgTable('crm_brightdata_imports', {
  id: serial('id').primaryKey(),
  
  // Search parameters
  country: varchar('country', { length: 2 }).notNull(),
  stateProvince: varchar('state_province', { length: 100 }),
  city: varchar('city', { length: 100 }),
  searchQuery: varchar('search_query', { length: 255 }),
  
  // Results
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'processing', 'completed', 'failed'
  recordsFound: integer('records_found').default(0),
  recordsImported: integer('records_imported').default(0),
  recordsDuplicate: integer('records_duplicate').default(0),
  
  // BrightData response
  brightdataJobId: varchar('brightdata_job_id', { length: 255 }),
  errorMessage: text('error_message'),
  
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});
```

### Indexes

```typescript
// Add after table definitions
export const crmContactsEmailIdx = index('crm_contacts_email_idx').on(crmContacts.email);
export const crmContactsStageIdx = index('crm_contacts_stage_idx').on(crmContacts.stage);
export const crmContactsScoreIdx = index('crm_contacts_score_idx').on(crmContacts.leadScore);
export const crmActivitiesContactIdx = index('crm_activities_contact_idx').on(crmActivities.contactId);
export const crmActivitiesCreatedIdx = index('crm_activities_created_idx').on(crmActivities.createdAt);
```

### Zod Schemas

```typescript
export const insertCrmCompanySchema = createInsertSchema(crmCompanies);
export const selectCrmCompanySchema = createSelectSchema(crmCompanies);
export const insertCrmContactSchema = createInsertSchema(crmContacts);
export const selectCrmContactSchema = createSelectSchema(crmContacts);
export const insertCrmActivitySchema = createInsertSchema(crmActivities);
export const selectCrmActivitySchema = createSelectSchema(crmActivities);
export const insertCrmEmailTemplateSchema = createInsertSchema(crmEmailTemplates);
export const selectCrmEmailTemplateSchema = createSelectSchema(crmEmailTemplates);
export const insertCrmSequenceSchema = createInsertSchema(crmSequences);
export const selectCrmSequenceSchema = createSelectSchema(crmSequences);
export const insertCrmTaskSchema = createInsertSchema(crmTasks);
export const selectCrmTaskSchema = createSelectSchema(crmTasks);
```

---

## Phase 2: API Routes

Add to `server/routes.ts`. All routes require SuperUser authentication.

### Authentication Middleware

```typescript
// Add helper function
function requireSuperUser(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.superuser) {
    return res.status(403).json({ message: 'SuperUser access required' });
  }
  next();
}
```

### CRM Companies Routes

```typescript
// GET /api/crm/companies - List all companies with filters
app.get('/api/crm/companies', requireSuperUser, async (req, res) => {
  const { country, stateProvince, city, source, hasContacts, search, page = 1, limit = 50 } = req.query;
  
  let query = db.select().from(crmCompanies);
  
  // Apply filters
  const conditions = [];
  if (country) conditions.push(eq(crmCompanies.country, country as string));
  if (stateProvince) conditions.push(eq(crmCompanies.stateProvince, stateProvince as string));
  if (city) conditions.push(ilike(crmCompanies.city, `%${city}%`));
  if (source) conditions.push(eq(crmCompanies.source, source as string));
  if (search) conditions.push(or(
    ilike(crmCompanies.name, `%${search}%`),
    ilike(crmCompanies.website, `%${search}%`)
  ));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  const offset = (Number(page) - 1) * Number(limit);
  const companies = await query.limit(Number(limit)).offset(offset).orderBy(desc(crmCompanies.createdAt));
  
  res.json(companies);
});

// GET /api/crm/companies/:id - Get single company with contacts
app.get('/api/crm/companies/:id', requireSuperUser, async (req, res) => {
  const company = await db.select().from(crmCompanies).where(eq(crmCompanies.id, Number(req.params.id))).limit(1);
  if (!company.length) return res.status(404).json({ message: 'Company not found' });
  
  const contacts = await db.select().from(crmContacts).where(eq(crmContacts.companyId, Number(req.params.id)));
  
  res.json({ ...company[0], contacts });
});

// POST /api/crm/companies - Create company
app.post('/api/crm/companies', requireSuperUser, async (req, res) => {
  const validated = insertCrmCompanySchema.parse(req.body);
  const [company] = await db.insert(crmCompanies).values(validated).returning();
  res.status(201).json(company);
});

// PATCH /api/crm/companies/:id - Update company
app.patch('/api/crm/companies/:id', requireSuperUser, async (req, res) => {
  const [company] = await db.update(crmCompanies)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(crmCompanies.id, Number(req.params.id)))
    .returning();
  res.json(company);
});

// DELETE /api/crm/companies/:id - Delete company (cascades to contacts)
app.delete('/api/crm/companies/:id', requireSuperUser, async (req, res) => {
  await db.delete(crmCompanies).where(eq(crmCompanies.id, Number(req.params.id)));
  res.status(204).send();
});
```

### CRM Contacts Routes

```typescript
// GET /api/crm/contacts - List contacts with pipeline filtering
app.get('/api/crm/contacts', requireSuperUser, async (req, res) => {
  const { stage, source, minScore, maxScore, country, search, tags, page = 1, limit = 50 } = req.query;
  
  let query = db.select({
    contact: crmContacts,
    company: crmCompanies
  })
  .from(crmContacts)
  .leftJoin(crmCompanies, eq(crmContacts.companyId, crmCompanies.id));
  
  const conditions = [];
  if (stage) conditions.push(eq(crmContacts.stage, stage as string));
  if (source) conditions.push(eq(crmContacts.source, source as string));
  if (minScore) conditions.push(gte(crmContacts.leadScore, Number(minScore)));
  if (maxScore) conditions.push(lte(crmContacts.leadScore, Number(maxScore)));
  if (country) conditions.push(eq(crmCompanies.country, country as string));
  if (search) conditions.push(or(
    ilike(crmContacts.firstName, `%${search}%`),
    ilike(crmContacts.lastName, `%${search}%`),
    ilike(crmContacts.email, `%${search}%`),
    ilike(crmCompanies.name, `%${search}%`)
  ));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  const offset = (Number(page) - 1) * Number(limit);
  const results = await query.limit(Number(limit)).offset(offset).orderBy(desc(crmContacts.createdAt));
  
  res.json(results);
});

// GET /api/crm/contacts/pipeline - Get contacts grouped by stage (for Kanban)
app.get('/api/crm/contacts/pipeline', requireSuperUser, async (req, res) => {
  const stages = ['lead_captured', 'contacted', 'demo_scheduled', 'trial', 'paid_subscriber'];
  
  const pipeline = await Promise.all(stages.map(async (stage) => {
    const contacts = await db.select({
      contact: crmContacts,
      company: crmCompanies
    })
    .from(crmContacts)
    .leftJoin(crmCompanies, eq(crmContacts.companyId, crmCompanies.id))
    .where(eq(crmContacts.stage, stage))
    .orderBy(desc(crmContacts.leadScore))
    .limit(50);
    
    return { stage, contacts, count: contacts.length };
  }));
  
  res.json(pipeline);
});

// GET /api/crm/contacts/:id - Get contact with activities
app.get('/api/crm/contacts/:id', requireSuperUser, async (req, res) => {
  const [contact] = await db.select({
    contact: crmContacts,
    company: crmCompanies
  })
  .from(crmContacts)
  .leftJoin(crmCompanies, eq(crmContacts.companyId, crmCompanies.id))
  .where(eq(crmContacts.id, Number(req.params.id)));
  
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  
  const activities = await db.select()
    .from(crmActivities)
    .where(eq(crmActivities.contactId, Number(req.params.id)))
    .orderBy(desc(crmActivities.createdAt))
    .limit(100);
  
  const tasks = await db.select()
    .from(crmTasks)
    .where(eq(crmTasks.contactId, Number(req.params.id)))
    .orderBy(asc(crmTasks.dueDate));
  
  res.json({ ...contact, activities, tasks });
});

// POST /api/crm/contacts - Create contact
app.post('/api/crm/contacts', requireSuperUser, async (req, res) => {
  const validated = insertCrmContactSchema.parse(req.body);
  const [contact] = await db.insert(crmContacts).values(validated).returning();
  
  // Log activity
  await db.insert(crmActivities).values({
    contactId: contact.id,
    companyId: contact.companyId,
    type: 'note',
    subject: 'Contact created',
    description: `Contact added from source: ${contact.source}`
  });
  
  res.status(201).json(contact);
});

// PATCH /api/crm/contacts/:id - Update contact
app.patch('/api/crm/contacts/:id', requireSuperUser, async (req, res) => {
  const existingContact = await db.select().from(crmContacts).where(eq(crmContacts.id, Number(req.params.id))).limit(1);
  
  const [contact] = await db.update(crmContacts)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(crmContacts.id, Number(req.params.id)))
    .returning();
  
  // Log stage change if applicable
  if (req.body.stage && existingContact[0]?.stage !== req.body.stage) {
    await db.insert(crmActivities).values({
      contactId: contact.id,
      companyId: contact.companyId,
      type: 'stage_change',
      subject: `Stage changed: ${existingContact[0]?.stage} → ${req.body.stage}`,
      previousStage: existingContact[0]?.stage,
      newStage: req.body.stage
    });
  }
  
  res.json(contact);
});

// DELETE /api/crm/contacts/:id
app.delete('/api/crm/contacts/:id', requireSuperUser, async (req, res) => {
  await db.delete(crmContacts).where(eq(crmContacts.id, Number(req.params.id)));
  res.status(204).send();
});
```

### CRM Activities Routes

```typescript
// POST /api/crm/activities - Log activity
app.post('/api/crm/activities', requireSuperUser, async (req, res) => {
  const validated = insertCrmActivitySchema.parse(req.body);
  const [activity] = await db.insert(crmActivities).values(validated).returning();
  
  // Update lastContactedAt if it's an outbound activity
  if (['email_sent', 'call_made'].includes(validated.type)) {
    await db.update(crmContacts)
      .set({ lastContactedAt: new Date(), updatedAt: new Date() })
      .where(eq(crmContacts.id, validated.contactId));
  }
  
  res.status(201).json(activity);
});

// GET /api/crm/activities - Get recent activities (global feed)
app.get('/api/crm/activities', requireSuperUser, async (req, res) => {
  const { limit = 50, type } = req.query;
  
  let query = db.select({
    activity: crmActivities,
    contact: crmContacts,
    company: crmCompanies
  })
  .from(crmActivities)
  .leftJoin(crmContacts, eq(crmActivities.contactId, crmContacts.id))
  .leftJoin(crmCompanies, eq(crmActivities.companyId, crmCompanies.id));
  
  if (type) {
    query = query.where(eq(crmActivities.type, type as string));
  }
  
  const activities = await query.orderBy(desc(crmActivities.createdAt)).limit(Number(limit));
  res.json(activities);
});
```

### CRM Email Routes

```typescript
// GET /api/crm/templates - List email templates
app.get('/api/crm/templates', requireSuperUser, async (req, res) => {
  const templates = await db.select().from(crmEmailTemplates).where(eq(crmEmailTemplates.isActive, true));
  res.json(templates);
});

// POST /api/crm/templates - Create template
app.post('/api/crm/templates', requireSuperUser, async (req, res) => {
  const validated = insertCrmEmailTemplateSchema.parse(req.body);
  const [template] = await db.insert(crmEmailTemplates).values(validated).returning();
  res.status(201).json(template);
});

// POST /api/crm/send-email - Send email to contact
app.post('/api/crm/send-email', requireSuperUser, async (req, res) => {
  const { contactId, templateId, subject, bodyHtml, fromName } = req.body;
  
  // Get contact
  const [contact] = await db.select().from(crmContacts).where(eq(crmContacts.id, contactId));
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  
  // Check do not contact
  if (contact.doNotContact) {
    return res.status(400).json({ message: 'Contact has opted out of communications' });
  }
  
  // Get template if provided
  let emailSubject = subject;
  let emailBody = bodyHtml;
  if (templateId) {
    const [template] = await db.select().from(crmEmailTemplates).where(eq(crmEmailTemplates.id, templateId));
    emailSubject = template.subject;
    emailBody = template.bodyHtml;
  }
  
  // Replace merge fields
  emailSubject = emailSubject.replace(/{{firstName}}/g, contact.firstName);
  emailBody = emailBody.replace(/{{firstName}}/g, contact.firstName);
  emailBody = emailBody.replace(/{{lastName}}/g, contact.lastName || '');
  
  // Send via SendGrid (use outreach domain)
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: contact.email,
    from: {
      email: 'outreach@mail.onropepro.com', // Separate outreach domain
      name: fromName || 'OnRopePro Team'
    },
    subject: emailSubject,
    html: emailBody,
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true }
    },
    customArgs: {
      contactId: String(contactId),
      source: 'crm'
    }
  };
  
  try {
    const [response] = await sgMail.send(msg);
    const messageId = response.headers['x-message-id'];
    
    // Log activity
    await db.insert(crmActivities).values({
      contactId,
      companyId: contact.companyId,
      type: 'email_sent',
      subject: emailSubject,
      emailMessageId: messageId,
      emailStatus: 'sent'
    });
    
    // Update contact
    await db.update(crmContacts)
      .set({ lastContactedAt: new Date(), updatedAt: new Date() })
      .where(eq(crmContacts.id, contactId));
    
    // Update template stats if used
    if (templateId) {
      await db.update(crmEmailTemplates)
        .set({ sentCount: sql`${crmEmailTemplates.sentCount} + 1` })
        .where(eq(crmEmailTemplates.id, templateId));
    }
    
    res.json({ success: true, messageId });
  } catch (error) {
    console.error('SendGrid error:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

// POST /api/crm/webhooks/sendgrid - Handle SendGrid events
app.post('/api/crm/webhooks/sendgrid', async (req, res) => {
  const events = req.body;
  
  for (const event of events) {
    const { email, event: eventType, sg_message_id, contactId } = event;
    
    if (!contactId) continue;
    
    switch (eventType) {
      case 'open':
        await db.update(crmContacts)
          .set({ emailOpenCount: sql`${crmContacts.emailOpenCount} + 1` })
          .where(eq(crmContacts.id, Number(contactId)));
        
        await db.insert(crmActivities).values({
          contactId: Number(contactId),
          type: 'email_opened',
          subject: 'Email opened',
          emailMessageId: sg_message_id
        });
        break;
        
      case 'click':
        await db.update(crmContacts)
          .set({ emailClickCount: sql`${crmContacts.emailClickCount} + 1` })
          .where(eq(crmContacts.id, Number(contactId)));
        
        await db.insert(crmActivities).values({
          contactId: Number(contactId),
          type: 'email_clicked',
          subject: 'Email link clicked',
          emailMessageId: sg_message_id
        });
        break;
        
      case 'bounce':
        await db.update(crmContacts)
          .set({ doNotContact: true })
          .where(eq(crmContacts.id, Number(contactId)));
        break;
        
      case 'unsubscribe':
        await db.update(crmContacts)
          .set({ doNotContact: true, unsubscribedAt: new Date() })
          .where(eq(crmContacts.email, email));
        break;
    }
  }
  
  res.status(200).send('OK');
});
```

### CRM Tasks Routes

```typescript
// GET /api/crm/tasks - Get tasks (with overdue filter)
app.get('/api/crm/tasks', requireSuperUser, async (req, res) => {
  const { status = 'pending', overdue } = req.query;
  
  let query = db.select({
    task: crmTasks,
    contact: crmContacts,
    company: crmCompanies
  })
  .from(crmTasks)
  .leftJoin(crmContacts, eq(crmTasks.contactId, crmContacts.id))
  .leftJoin(crmCompanies, eq(crmTasks.companyId, crmCompanies.id));
  
  const conditions = [eq(crmTasks.status, status as string)];
  
  if (overdue === 'true') {
    conditions.push(lt(crmTasks.dueDate, new Date()));
  }
  
  const tasks = await query.where(and(...conditions)).orderBy(asc(crmTasks.dueDate));
  res.json(tasks);
});

// POST /api/crm/tasks - Create task
app.post('/api/crm/tasks', requireSuperUser, async (req, res) => {
  const validated = insertCrmTaskSchema.parse(req.body);
  const [task] = await db.insert(crmTasks).values(validated).returning();
  res.status(201).json(task);
});

// PATCH /api/crm/tasks/:id/complete - Complete task
app.patch('/api/crm/tasks/:id/complete', requireSuperUser, async (req, res) => {
  const [task] = await db.update(crmTasks)
    .set({ status: 'completed', completedAt: new Date() })
    .where(eq(crmTasks.id, Number(req.params.id)))
    .returning();
  
  // Log activity
  if (task.contactId) {
    await db.insert(crmActivities).values({
      contactId: task.contactId,
      companyId: task.companyId,
      type: 'task_completed',
      subject: `Task completed: ${task.title}`
    });
  }
  
  res.json(task);
});
```

### CRM Dashboard/Stats Routes

```typescript
// GET /api/crm/stats - Dashboard statistics
app.get('/api/crm/stats', requireSuperUser, async (req, res) => {
  const [
    totalContacts,
    contactsByStage,
    recentActivities,
    overdueTasks,
    thisMonthContacted,
    conversionRate
  ] = await Promise.all([
    // Total contacts
    db.select({ count: sql<number>`count(*)` }).from(crmContacts),
    
    // Contacts by stage
    db.select({
      stage: crmContacts.stage,
      count: sql<number>`count(*)`
    }).from(crmContacts).groupBy(crmContacts.stage),
    
    // Recent activities count (last 7 days)
    db.select({ count: sql<number>`count(*)` })
      .from(crmActivities)
      .where(gte(crmActivities.createdAt, sql`NOW() - INTERVAL '7 days'`)),
    
    // Overdue tasks
    db.select({ count: sql<number>`count(*)` })
      .from(crmTasks)
      .where(and(
        eq(crmTasks.status, 'pending'),
        lt(crmTasks.dueDate, new Date())
      )),
    
    // Contacts contacted this month
    db.select({ count: sql<number>`count(*)` })
      .from(crmContacts)
      .where(gte(crmContacts.lastContactedAt, sql`DATE_TRUNC('month', NOW())`)),
    
    // Conversion rate (leads to paid)
    db.select({
      total: sql<number>`count(*)`,
      converted: sql<number>`count(*) FILTER (WHERE stage = 'paid_subscriber')`
    }).from(crmContacts)
  ]);
  
  res.json({
    totalContacts: totalContacts[0].count,
    contactsByStage,
    activitiesLast7Days: recentActivities[0].count,
    overdueTasks: overdueTasks[0].count,
    contactedThisMonth: thisMonthContacted[0].count,
    conversionRate: conversionRate[0].total > 0 
      ? (conversionRate[0].converted / conversionRate[0].total * 100).toFixed(1)
      : 0
  });
});
```

### BrightData Integration Routes

```typescript
// POST /api/crm/brightdata/search - Trigger BrightData search
app.post('/api/crm/brightdata/search', requireSuperUser, async (req, res) => {
  const { country, stateProvince, city, searchQuery = 'rope access company' } = req.body;
  
  // Create import record
  const [importRecord] = await db.insert(crmBrightdataImports).values({
    country,
    stateProvince,
    city,
    searchQuery,
    status: 'pending'
  }).returning();
  
  // Trigger BrightData API (async)
  // This would be implemented based on BrightData's specific API
  const brightdataApiKey = process.env.BRIGHTDATA_API_KEY;
  
  try {
    // Example BrightData Web Scraper API call
    const response = await fetch('https://api.brightdata.com/datasets/v3/trigger', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${brightdataApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dataset_id: 'gd_l1viktl72bvl7bjuj0', // Google Maps dataset
        include_errors: true,
        limit_per_input: 100,
        input: [{
          query: `${searchQuery} ${city || ''} ${stateProvince || ''} ${country}`.trim(),
          country: country === 'CA' ? 'Canada' : 'United States'
        }],
        webhook_url: `${process.env.APP_URL}/api/crm/webhooks/brightdata?importId=${importRecord.id}`
      })
    });
    
    const data = await response.json();
    
    await db.update(crmBrightdataImports)
      .set({ 
        status: 'processing',
        brightdataJobId: data.snapshot_id
      })
      .where(eq(crmBrightdataImports.id, importRecord.id));
    
    res.json({ importId: importRecord.id, status: 'processing' });
  } catch (error) {
    await db.update(crmBrightdataImports)
      .set({ status: 'failed', errorMessage: error.message })
      .where(eq(crmBrightdataImports.id, importRecord.id));
    
    res.status(500).json({ message: 'BrightData API error', error: error.message });
  }
});

// POST /api/crm/webhooks/brightdata - Handle BrightData results
app.post('/api/crm/webhooks/brightdata', async (req, res) => {
  const { importId } = req.query;
  const results = req.body;
  
  let imported = 0;
  let duplicates = 0;
  
  for (const business of results) {
    // Check for existing company by website or phone
    const existing = await db.select()
      .from(crmCompanies)
      .where(or(
        eq(crmCompanies.website, business.website),
        eq(crmCompanies.phone, business.phone)
      ))
      .limit(1);
    
    if (existing.length > 0) {
      duplicates++;
      continue;
    }
    
    // Create company
    const [company] = await db.insert(crmCompanies).values({
      name: business.name,
      website: business.website,
      phone: business.phone,
      address: business.address,
      city: business.city,
      stateProvince: business.state,
      country: business.country === 'Canada' ? 'CA' : 'US',
      postalCode: business.postal_code,
      source: 'brightdata_scrape',
      brightdataId: business.place_id
    }).returning();
    
    // Create contact if owner/manager info available
    if (business.owner_name || business.contact_email) {
      await db.insert(crmContacts).values({
        companyId: company.id,
        firstName: business.owner_name?.split(' ')[0] || 'Owner',
        lastName: business.owner_name?.split(' ').slice(1).join(' ') || '',
        email: business.contact_email || `info@${new URL(business.website).hostname}`,
        phone: business.phone,
        source: 'brightdata_scrape',
        consentType: 'implied_published' // Published business info
      });
    }
    
    imported++;
  }
  
  // Update import record
  await db.update(crmBrightdataImports)
    .set({
      status: 'completed',
      recordsFound: results.length,
      recordsImported: imported,
      recordsDuplicate: duplicates,
      completedAt: new Date()
    })
    .where(eq(crmBrightdataImports.id, Number(importId)));
  
  res.status(200).send('OK');
});

// GET /api/crm/brightdata/imports - List import jobs
app.get('/api/crm/brightdata/imports', requireSuperUser, async (req, res) => {
  const imports = await db.select()
    .from(crmBrightdataImports)
    .orderBy(desc(crmBrightdataImports.startedAt))
    .limit(50);
  res.json(imports);
});
```

---

## Phase 3: Frontend Pages

### File Structure

```
client/src/
├── pages/
│   └── admin/
│       ├── CRMDashboard.tsx      # Main CRM dashboard
│       ├── CRMPipeline.tsx       # Kanban pipeline view
│       ├── CRMContacts.tsx       # Contact list/table
│       ├── CRMContactDetail.tsx  # Single contact view
│       ├── CRMCompanies.tsx      # Company list
│       ├── CRMCompanyDetail.tsx  # Single company view
│       ├── CRMTemplates.tsx      # Email template management
│       ├── CRMLeadImport.tsx     # BrightData import UI
│       └── CRMSettings.tsx       # CRM settings
└── components/
    └── crm/
        ├── ContactCard.tsx       # Contact card for Kanban
        ├── ActivityTimeline.tsx  # Activity feed component
        ├── EmailComposer.tsx     # Email composition modal
        ├── LeadScoreBadge.tsx    # Lead score indicator
        ├── StageBadge.tsx        # Pipeline stage badge
        ├── TaskList.tsx          # Task list component
        └── StatsCards.tsx        # Dashboard stat cards
```

### Routing

Add to `client/src/App.tsx`:

```typescript
// Inside SuperUser routes section
<Route path="/admin/crm" component={CRMDashboard} />
<Route path="/admin/crm/pipeline" component={CRMPipeline} />
<Route path="/admin/crm/contacts" component={CRMContacts} />
<Route path="/admin/crm/contacts/:id" component={CRMContactDetail} />
<Route path="/admin/crm/companies" component={CRMCompanies} />
<Route path="/admin/crm/companies/:id" component={CRMCompanyDetail} />
<Route path="/admin/crm/templates" component={CRMTemplates} />
<Route path="/admin/crm/import" component={CRMLeadImport} />
```

### CRMDashboard.tsx Requirements

Dashboard with:
- Stat cards: Total contacts, Contacts by stage, Activities this week, Overdue tasks
- Pipeline summary chart (bar chart by stage)
- Recent activity feed (last 20 activities)
- Tasks due today/overdue
- Quick actions: Add contact, Import leads, Compose email

### CRMPipeline.tsx Requirements

Kanban board with:
- Columns: lead_captured, contacted, demo_scheduled, trial, paid_subscriber
- Drag-and-drop contact cards between stages (use @dnd-kit)
- Contact cards show: Name, company, lead score, last contacted
- Click card to open ContactDetail
- Filter by: source, country, tags
- Bulk actions: Move selected, Export CSV

### CRMContacts.tsx Requirements

Data table with:
- Columns: Name, Email, Company, Stage, Score, Last Contacted, Source
- Search across name, email, company
- Filters: Stage, Source, Score range, Country
- Sort by any column
- Pagination (50 per page)
- Bulk select for batch email/stage change
- Export to CSV

### CRMContactDetail.tsx Requirements

Single contact view with:
- Header: Name, job title, company (linked)
- Contact info: Email (click to compose), Phone (click to call), LinkedIn
- Stage selector (dropdown to change)
- Lead score with breakdown
- Activity timeline (all interactions)
- Task list with add task button
- Email history tab
- Notes section (editable)
- Tags (add/remove)
- Actions: Compose email, Log call, Add note, Create task

### CRMCompanies.tsx Requirements

Company list with:
- Columns: Name, Location, Certifications, Contacts count, Source
- Filters: Country, State/Province, City, Source
- Click to view company detail
- Add company button

### CRMLeadImport.tsx Requirements

BrightData import interface:
- Form: Country (CA/US dropdown), State/Province, City
- Search button triggers import
- Import history table showing past jobs
- Progress indicator for active imports
- Results summary: Found, Imported, Duplicates

### EmailComposer.tsx Requirements

Modal component for composing emails:
- Template selector dropdown
- Subject field (pre-filled from template)
- Rich text editor for body (use @tiptap/react)
- Merge field buttons: {{firstName}}, {{lastName}}, {{companyName}}
- Preview mode toggle
- Send button with confirmation
- CASL/CAN-SPAM compliance footer auto-added

---

## Phase 4: GTM/GA4 Event Tracking

### Events to Track

Add to existing analytics service:

```typescript
// CRM-specific events
interface CRMEvents {
  // Lead actions
  crm_contact_created: { source: string; hasEmail: boolean };
  crm_contact_stage_changed: { fromStage: string; toStage: string };
  crm_email_sent: { templateId?: number; isSequence: boolean };
  crm_email_opened: { contactId: number };
  crm_call_logged: { duration?: number; outcome: string };
  
  // Pipeline actions
  crm_lead_imported: { source: string; count: number };
  crm_sequence_enrolled: { sequenceId: number; contactCount: number };
  
  // Conversions
  crm_demo_scheduled: { contactId: number };
  crm_trial_started: { contactId: number; companyId: number };
  crm_customer_converted: { contactId: number; mrr: number };
}
```

### GTM Container Setup

```javascript
// dataLayer pushes for CRM events
window.dataLayer.push({
  event: 'crm_contact_stage_changed',
  crm_from_stage: 'lead_captured',
  crm_to_stage: 'contacted',
  crm_contact_id: 123
});
```

---

## Phase 5: Environment Variables

Add to `.env`:

```
# BrightData
BRIGHTDATA_API_KEY=your_api_key
BRIGHTDATA_DATASET_ID=gd_l1viktl72bvl7bjuj0

# SendGrid (outreach domain)
SENDGRID_OUTREACH_FROM_EMAIL=outreach@mail.onropepro.com
SENDGRID_OUTREACH_FROM_NAME=OnRopePro Team

# Webhook URLs (for SendGrid event tracking)
SENDGRID_WEBHOOK_SECRET=your_webhook_secret
```

---

## Implementation Order

### Sprint 1 (Week 1-2): Core Data Model
1. Add schema to `shared/schema.ts`
2. Run migration
3. Implement company/contact CRUD routes
4. Build CRMContacts and CRMContactDetail pages

### Sprint 2 (Week 3-4): Pipeline & Activities
1. Implement activity logging routes
2. Build CRMPipeline Kanban board
3. Add drag-and-drop stage changes
4. Build ActivityTimeline component

### Sprint 3 (Week 5-6): Email Integration
1. Set up outreach domain DNS
2. Implement email sending routes
3. Build EmailComposer component
4. Set up SendGrid webhook handler
5. Build CRMTemplates page

### Sprint 4 (Week 7-8): Lead Import & Dashboard
1. Implement BrightData integration
2. Build CRMLeadImport page
3. Build CRMDashboard with stats
4. Add task management
5. GTM event tracking

---

## Notes for Replit Agent

1. **SuperUser only**: All CRM routes check `req.session?.superuser`
2. **Separate from users table**: CRM contacts are NOT linked to existing users table until conversion
3. **CASL compliance**: Always check `doNotContact` before sending emails to Canadian contacts
4. **Outreach domain**: Use `mail.onropepro.com` for sales emails, NOT `onropepro.com`
5. **No emojis**: Follow existing design guidelines
6. **data-testid**: Add to all interactive elements
7. **Dark mode**: Support both light and dark themes
8. **Mobile-first**: All pages must be responsive

---

## Database Migration Command

After adding schema, run:

```bash
npm run db:push
```

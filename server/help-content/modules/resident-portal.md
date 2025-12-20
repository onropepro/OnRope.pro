# Resident Portal

Two-way feedback system connecting building residents with service providers.

## Overview

The Resident Portal creates a direct communication channel between building residents and rope access service providers. Residents can submit issues with photo evidence, track status, and receive updates. Vendors manage feedback centrally, improving response times and resident satisfaction.

## The Company Code (10-Character Code)

The **Company Code** is a 10-character alphanumeric code that connects residents to their service provider. This is sometimes called the "vendor code" or "company number".

### What is the Company Code?
- A unique 10-character code assigned to each rope access company
- Residents enter this code after creating their account
- It binds the resident's account to the correct service company
- Without it, the resident's control panel will be empty

### How to Get the Company Code
Residents can obtain the company code from:
1. Their building manager or strata council
2. The rope access service company directly
3. Notices posted in common areas during work

### Where to Enter the Company Code
After logging into the Resident Portal for the first time:
1. Go to onrope.pro/resident
2. Look for the "Enter Company Code" field on your dashboard
3. Enter the 10-character code provided
4. Click submit to link your account

**Important**: Active work and building information won't appear until you've entered the company code.

## The Access Formula

```
Company Code + Strata/LMS Number = Full Portal Access
```

Residents need both pieces of information:
- **Company Code**: The 10-character code from the service company (one code per company, not per building)
- **Strata/LMS Number**: Your building's strata plan identifier

This creates a portable account system. As vendors add more buildings, the network grows.

## Key Features

### For Residents

#### Issue Submission
- Report maintenance issues
- Upload photo evidence
- Describe the problem
- Select issue category

#### Status Tracking
Issues move through statuses:
- **New**: Just submitted
- **Viewed**: Vendor has seen it
- **Closed**: Issue resolved

#### Communication
- Receive updates on submitted issues
- View vendor replies
- Track resolution progress

#### Resilient Photo Uploads
Photos are uploaded reliably even during temporary storage issues:
- Your feedback is saved immediately (photos never block submission)
- Photos upload in the background automatically
- If upload fails, the system retries up to 5 times with increasing delays
- You receive confirmation that your photo is being processed

### For Vendors (Rope Access Companies)

#### Feedback Dashboard
- View all resident submissions
- Filter by building
- Sort by status
- Search by content

#### Response Management
- Mark issues as viewed (timestamp recorded)
- Add internal notes (not visible to resident)
- Reply to resident (visible reply)
- Close resolved issues

#### Building Association
- Link buildings to your company
- Residents at linked buildings can submit feedback
- One vendor code serves all your buildings

### For Property Managers

#### Read-Only Oversight
- View feedback for managed buildings
- Monitor vendor responsiveness
- See resolution status
- Cannot create or modify submissions

## How It Works

### Resident Access
1. Resident visits the portal
2. Enters vendor code (provided by building management)
3. Enters their Strata/LMS number
4. Creates account or logs in
5. Submits and tracks issues

### Vendor Workflow
1. Navigate to Resident Feedback
2. View new submissions
3. Click to view details
4. Add internal note or reply to resident
5. Mark as closed when resolved

### Property Manager View
1. Access My Vendors dashboard
2. Navigate to resident feedback section
3. View all feedback for managed buildings (read-only)

## Photo Upload System

The resident portal uses a resilient photo upload system:

### Supported Formats
- **JPEG, PNG, WebP** - Standard image formats
- **HEIC, HEIF** - iPhone photo formats fully supported
- **Maximum file size**: 10MB

### How It Works
1. When you submit feedback with a photo, your message is saved immediately
2. The photo is queued for upload in the background
3. A background worker processes the upload automatically
4. If storage is temporarily unavailable, the system retries with increasing delays (30 seconds, 2 minutes, 10 minutes, 30 minutes, 1 hour)
5. After 5 failed attempts, the photo is marked as failed but your feedback remains intact

### Photo Status Messages
- **"Photo is being uploaded in the background"** - Upload is queued and processing
- **"Photo could not be saved but your feedback was received"** - Queue failed but feedback was saved

### Why This Matters
Your feedback is never lost due to temporary storage issues. The system prioritizes saving your message first, then handles photos separately.

## What Does NOT Exist

- Residents cannot view photo galleries (no gallery feature)
- Residents cannot reopen closed issues (only vendor can)
- No /link?code= URL for building linking
- No building codes for access (only vendor code + Strata/LMS)

## Benefits

### For Residents
- Easy way to report issues
- Track resolution status
- Direct communication with service provider
- Photo evidence capability

### For Vendors
- Centralized feedback management
- Documented response history
- Improved resident relations
- Reduced phone calls

### For Property Managers
- Visibility into vendor responsiveness
- Oversight without administrative burden
- Documentation for building records

## Portable Accounts Network Effect

As more buildings connect through the same vendor code:
- Residents who move can reconnect easily
- Vendors build reputation across properties
- Network value increases for everyone

## Managing Your Profile

Your OnRopePro account is fully portable. If you move to a new building or need to update your information, use the Profile tab in your dashboard.

![Resident Profile Tab](resident-profile-tab.png)

### Accessing Your Profile
1. Log in to the Resident Portal
2. Click the **Profile** tab (rightmost tab)
3. View your Personal Information and Building Information

### Updating Your Information
1. Click the **Edit** button (or fields become editable automatically)
2. Update any of these fields:
   - **Full Name**: Your display name
   - **Phone Number**: Contact number
   - **Strata/HOA/LMS Number**: Your building's identifier
   - **Unit Number**: Your unit within the building
3. Click **Save** to confirm changes

### Moving to a New Building

If you're moving to a different building:

1. Go to the **Profile** tab
2. Update your **Strata/HOA/LMS Number** to match your new building
3. Update your **Unit Number**
4. Click **Save**

**Important**: If your new building uses a different service vendor:
1. Click **Switch** in the Vendor Connection section
2. Enter the new vendor's 10-character code
3. Your old feedback history stays with the previous building

### Switching Vendors

If your building changes service providers:

1. Go to the **Profile** tab
2. In the **Vendor Connection** section, click **Switch**
3. A dialog will appear - enter the new vendor's 10-character code
4. Click **Link Account** to confirm

Your account remains active - you're just connecting to a different service company. Your previous feedback history stays with the old vendor.

### Unlinking from a Vendor

If you no longer need to receive updates from your current vendor:

1. Go to the **Profile** tab
2. In the **Vendor Connection** section, click **Unlink**
3. A warning dialog will appear explaining the consequences
4. Click **Unlink** to confirm

**Note**: Unlinking means you won't see active projects or be able to submit feedback until you link to a vendor again. You can always re-link later by entering a new vendor code.

### Duplicate Unit Protection

If you try to register a strata/unit combination that's already registered by another resident, the system will display an error. This prevents duplicate claims to the same unit. Contact your building manager if you believe there's an error.

## Common Questions

**Q: How do residents get the vendor code?**
A: Building management provides the vendor code (from the rope access company).

**Q: Can residents see other residents' submissions?**
A: No, residents only see their own submissions.

**Q: What if a resident submits to the wrong building?**
A: The Strata/LMS number ensures submissions are routed correctly.

**Q: Can issues be reopened?**
A: Only the vendor can reopen a closed issue.

**Q: What happens if my photo fails to upload?**
A: Your feedback is saved immediately regardless of photo status. The system automatically retries photo uploads up to 5 times. If all retries fail, your feedback remains without the photo.

**Q: How long does photo upload take?**
A: Photos typically upload within 30 seconds. You can check status in your feedback history.

**Q: What happens when I move to a new building?**
A: Your account is fully portable. Go to the Profile tab and update your Strata/LMS number and unit number. If your new building uses a different vendor, click "Switch" in the Vendor Connection section and enter the new vendor's code. Your previous feedback stays with the old building.

**Q: Can I keep my account if I move to a different city?**
A: Yes! Your OnRopePro account works everywhere. Just update your building information in the Profile tab. If your new building's vendor uses OnRopePro, enter their vendor code to connect.

## Related Modules

- [Property Manager Interface](/help/modules/property-manager-interface)
- [Project Management](/help/modules/project-management)

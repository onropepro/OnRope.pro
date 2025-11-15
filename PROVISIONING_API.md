# Account Provisioning API

## Overview

The provisioning API enables external sales platforms to automatically create rope access company accounts without manual intervention. This endpoint is designed for integration with e-commerce platforms, marketplaces, or automated customer onboarding systems.

## Authentication

All requests must include an API key in the `x-api-key` header.

**Header**: `x-api-key: your-provisioning-api-key`

The API key is stored as the `PROVISIONING_API_KEY` environment variable.

## Endpoint

**POST** `/api/provision-account`

This endpoint is publicly accessible (does not require user authentication) but requires valid API key authentication.

## Request Body

All fields are required except `hourlyRate` and `licenseKey`.

```json
{
  "companyName": "Acme Rope Access Inc",
  "name": "John Smith",
  "email": "john@acmerope.com",
  "hourlyRate": "65.00",
  "streetAddress": "123 Industrial Way",
  "province": "BC",
  "country": "Canada",
  "zipCode": "V6B 2W9",
  "licenseKey": "MARKETPLACE-LICENSE-KEY-ABC123"
}
```

### Field Descriptions

- **companyName** (required): Legal business name. Must be unique across all registered companies.
- **name** (required): Full name of the company owner/administrator.
- **email** (required): Email address for the account owner. Must be unique. Used for login authentication.
- **hourlyRate** (optional): Default hourly billing rate for the company, formatted as a decimal string (e.g., "65.00").
- **streetAddress** (required): Street address of the company headquarters.
- **province** (required): Province or state code (e.g., "BC", "ON", "AB").
- **country** (required): Country name (e.g., "Canada", "United States").
- **zipCode** (required): Postal or ZIP code.
- **licenseKey** (optional): License key for the software platform. If provided, the system will verify it against the external licensing API.

## Response

### Success Response (HTTP 200)

```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@acmerope.com",
    "companyName": "Acme Rope Access Inc",
    "name": "John Smith",
    "licenseVerified": true
  },
  "credentials": {
    "email": "john@acmerope.com",
    "temporaryPassword": "Tempm3f8il9d!"
  },
  "message": "Account provisioned successfully. User should log in with email and change their password."
}
```

**Important**: The temporary password is only returned in this response and cannot be retrieved later. Store it securely and deliver it to the customer through your platform's notification system.

### Error Responses

**HTTP 401 - Unauthorized**
```json
{
  "message": "Unauthorized"
}
```
Invalid or missing API key.

**HTTP 400 - Validation Error**
```json
{
  "message": "Missing required fields"
}
```
One or more required fields are missing from the request.

**HTTP 400 - Duplicate Email**
```json
{
  "message": "Email already registered"
}
```
An account with this email address already exists.

**HTTP 400 - Duplicate Company**
```json
{
  "message": "Company name already taken"
}
```
An account with this company name already exists.

**HTTP 500 - Server Error**
```json
{
  "message": "Internal server error"
}
```
Unexpected server error during account creation.

## Account Details

### Temporary Password Format

Temporary passwords follow the format: `Temp{8-random-chars}!`

Example: `Tempnybk9c6n!`

Users must log in with their email and temporary password, then change their password on first login.

### Default Configuration

When an account is created, the system automatically:

1. Creates a company owner account with `company` role
2. Sets `companyId` to `null` (company owners ARE the company, not employees OF the company)
3. Creates a default payroll configuration (semi-monthly: 1st and 15th of each month)
4. Verifies the license key if provided (via external API)
5. Marks the account as `isTempPassword: false` (user can change password through the platform)

### License Verification

If a `licenseKey` is provided in the request:

- The system calls the external licensing API to verify the key
- If verification succeeds, `licenseVerified` is set to `true`
- If verification fails, the account is still created but `licenseVerified` is set to `false`
- Users with unverified licenses have read-only access to the platform

## Integration Example

### cURL

```bash
curl -X POST https://your-platform.com/api/provision-account \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "companyName": "Summit Rope Access Ltd",
    "name": "Sarah Johnson",
    "email": "sarah@summitrope.ca",
    "hourlyRate": "70.00",
    "streetAddress": "456 Mountain Road",
    "province": "AB",
    "country": "Canada",
    "zipCode": "T2P 1H9",
    "licenseKey": "SUMMIT-LICENSE-2024"
  }'
```

### Node.js (axios)

```javascript
const axios = require('axios');

async function provisionAccount(customerData) {
  try {
    const response = await axios.post(
      'https://your-platform.com/api/provision-account',
      {
        companyName: customerData.companyName,
        name: customerData.ownerName,
        email: customerData.email,
        hourlyRate: customerData.hourlyRate,
        streetAddress: customerData.streetAddress,
        province: customerData.province,
        country: customerData.country,
        zipCode: customerData.zipCode,
        licenseKey: customerData.licenseKey
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.PROVISIONING_API_KEY
        }
      }
    );
    
    console.log('Account created:', response.data.user);
    console.log('Temporary password:', response.data.credentials.temporaryPassword);
    
    // Send credentials to customer via email/SMS
    await notifyCustomer(
      response.data.credentials.email,
      response.data.credentials.temporaryPassword
    );
    
    return response.data;
  } catch (error) {
    console.error('Provisioning failed:', error.response?.data || error.message);
    throw error;
  }
}
```

### Python (requests)

```python
import requests
import os

def provision_account(customer_data):
    url = 'https://your-platform.com/api/provision-account'
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': os.environ['PROVISIONING_API_KEY']
    }
    
    payload = {
        'companyName': customer_data['company_name'],
        'name': customer_data['owner_name'],
        'email': customer_data['email'],
        'hourlyRate': customer_data['hourly_rate'],
        'streetAddress': customer_data['street_address'],
        'province': customer_data['province'],
        'country': customer_data['country'],
        'zipCode': customer_data['zip_code'],
        'licenseKey': customer_data.get('license_key')
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Account created: {data['user']['email']}")
        print(f"Temporary password: {data['credentials']['temporaryPassword']}")
        
        # Send credentials to customer
        notify_customer(
            data['credentials']['email'],
            data['credentials']['temporaryPassword']
        )
        
        return data
    else:
        print(f"Error: {response.json()['message']}")
        raise Exception(f"Provisioning failed: {response.status_code}")
```

## Testing

A test script is included at `test-provisioning-api.sh` for validating the provisioning flow:

```bash
chmod +x test-provisioning-api.sh
./test-provisioning-api.sh
```

The test script:
1. Creates a new account with unique test data
2. Verifies the account was created successfully
3. Tests login with the generated temporary password
4. Confirms the complete authentication flow

## Security Considerations

1. **API Key Protection**: Never expose the API key in client-side code or public repositories
2. **HTTPS Only**: Always use HTTPS in production to encrypt API key transmission
3. **Rate Limiting**: Implement rate limiting on your platform to prevent abuse
4. **Credential Delivery**: Use secure channels (encrypted email, SMS, secure portal) to deliver temporary passwords to customers
5. **Audit Logging**: Log all provisioning requests for security auditing and troubleshooting

## Support

For technical support or questions about the provisioning API, contact the platform development team.

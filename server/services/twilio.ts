import twilio from 'twilio';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=twilio',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.account_sid || !connectionSettings.settings.api_key || !connectionSettings.settings.api_key_secret)) {
    throw new Error('Twilio not connected');
  }
  return {
    accountSid: connectionSettings.settings.account_sid,
    apiKey: connectionSettings.settings.api_key,
    apiKeySecret: connectionSettings.settings.api_key_secret,
    phoneNumber: connectionSettings.settings.phone_number
  };
}

export async function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = await getCredentials();
  return twilio(apiKey, apiKeySecret, {
    accountSid: accountSid
  });
}

export async function getTwilioFromPhoneNumber() {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}

export async function sendSMS(to: string, body: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const client = await getTwilioClient();
    const fromNumber = await getTwilioFromPhoneNumber();
    
    if (!fromNumber) {
      return { success: false, error: 'Twilio phone number not configured' };
    }
    
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to
    });
    
    console.log(`[Twilio] SMS sent to ${to}, SID: ${message.sid}`);
    return { success: true, messageId: message.sid };
  } catch (error: any) {
    console.error('[Twilio] SMS send error:', error.message || error);
    return { success: false, error: error.message || 'Failed to send SMS' };
  }
}

export async function sendQuoteNotificationSMS(
  phoneNumber: string,
  buildingName: string,
  companyName: string,
  serviceTypes: string[],
  strataPlanNumber: string | null
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Build PM login URL from environment
  const domain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS?.split(',')[0] || 'onropepro.com';
  const pmLoginUrl = `https://${domain}/pm-dashboard`;
  
  // Format service types for display
  const servicesText = serviceTypes.length > 0 
    ? serviceTypes.join(', ').replace(/_/g, ' ')
    : 'building maintenance';
  
  // Build message with building name and strata
  const buildingInfo = strataPlanNumber 
    ? `${buildingName} (${strataPlanNumber})`
    : buildingName;
  
  // Twilio compliant: Sender ID + clear message + opt-out
  const message = `OnRopePro: ${companyName} has sent you a quote for ${servicesText} at ${buildingInfo}. Log in to review: ${pmLoginUrl} Reply STOP to opt out.`;
  
  return sendSMS(phoneNumber, message);
}

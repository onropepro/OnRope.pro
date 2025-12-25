import twilio from 'twilio';

let cachedCredentials: {
  accountSid: string;
  apiKey: string;
  apiKeySecret: string;
  phoneNumber: string;
} | null = null;

async function getCredentials() {
  if (cachedCredentials) {
    return cachedCredentials;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Twilio: X_REPLIT_TOKEN not found');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=twilio',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.account_sid || !connectionSettings.settings.api_key || !connectionSettings.settings.api_key_secret) {
    throw new Error('Twilio not connected');
  }

  cachedCredentials = {
    accountSid: connectionSettings.settings.account_sid,
    apiKey: connectionSettings.settings.api_key,
    apiKeySecret: connectionSettings.settings.api_key_secret,
    phoneNumber: connectionSettings.settings.phone_number
  };

  return cachedCredentials;
}

async function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = await getCredentials();
  return twilio(apiKey, apiKeySecret, { accountSid });
}

async function getTwilioFromPhoneNumber() {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}

export function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null;
  
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      cleaned = '+' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  
  const phoneRegex = /^\+[1-9]\d{6,14}$/;
  if (!phoneRegex.test(cleaned)) {
    console.warn(`[Twilio] Invalid phone format after cleanup: ${cleaned}`);
    return null;
  }
  
  return cleaned;
}

export async function sendSMS(to: string, body: string): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const formattedNumber = formatPhoneNumber(to);
    if (!formattedNumber) {
      return { success: false, error: 'Invalid phone number format' };
    }

    const client = await getTwilioClient();
    const fromNumber = await getTwilioFromPhoneNumber();

    if (!fromNumber) {
      return { success: false, error: 'Twilio phone number not configured' };
    }

    const message = await client.messages.create({
      body,
      from: fromNumber,
      to: formattedNumber
    });

    console.log(`[Twilio] SMS sent successfully to ${formattedNumber}, SID: ${message.sid}, status: ${message.status}`);
    return { success: true, messageId: message.sid, formattedTo: formattedNumber, status: message.status };
  } catch (error: any) {
    console.error('[Twilio] Failed to send SMS:', error.message);
    return { success: false, error: error.message };
  }
}

export async function sendTeamInvitationSMS(
  phoneNumber: string,
  companyName: string
): Promise<{ success: boolean; error?: string }> {
  // Use production domain for cleaner SMS - shorter and more professional
  // Twilio compliant: Sender ID + clear message + opt-out
  const message = `OnRopePro: ${companyName} has invited you to join their team. Log in at onropepro.com to respond. Reply STOP to opt out.`;
  
  const result = await sendSMS(phoneNumber, message);
  
  if (result.success) {
    console.log(`[Twilio] Team invitation SMS sent to ${phoneNumber} for ${companyName}`);
  }
  
  return result;
}

export async function sendInvitationAcceptedSMS(
  phoneNumber: string,
  employeeName: string,
  employeeRole: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const roleDisplay = employeeRole === 'ground_crew' ? 'ground crew member' : 'technician';
  // Twilio compliant: Sender ID + clear message + opt-out
  const message = `OnRopePro: ${employeeName} has accepted your invitation and joined as a ${roleDisplay}. Reply STOP to opt out.`;
  
  const result = await sendSMS(phoneNumber, message);
  
  if (result.success) {
    console.log(`[Twilio] Invitation accepted SMS sent to ${phoneNumber} for employee ${employeeName}`);
  }
  
  return result;
}

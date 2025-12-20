// SendGrid email client using Replit connector
// Integration: connection:conn_sendgrid_01KC2MWF0BENKQQK4Q03RQC80D
import sgMail from '@sendgrid/mail';

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
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key || !connectionSettings.settings.from_email)) {
    throw new Error('SendGrid not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, email: connectionSettings.settings.from_email };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableSendGridClient() {
  const { apiKey, email } = await getCredentials();
  sgMail.setApiKey(apiKey);
  return {
    client: sgMail,
    fromEmail: email
  };
}

// Helper function to send password reset email
export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();
    
    console.log('[SendGrid] Attempting to send email:');
    console.log('[SendGrid] - From:', fromEmail);
    console.log('[SendGrid] - To:', toEmail);
    console.log('[SendGrid] - Subject: Reset Your Password - OnRopePro');
    
    const response = await client.send({
      to: toEmail,
      from: fromEmail,
      subject: 'Reset Your Password - OnRopePro',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <h1 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Reset Your Password</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 24px;">
                Hi ${userName},
              </p>
              <p style="margin: 0 0 24px 0; color: #4a4a4a; font-size: 16px; line-height: 24px;">
                We received a request to reset your password for your OnRopePro account. Click the button below to create a new password:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 24px 40px; text-align: center;">
              <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background-color: #86A59C; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">Reset Password</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 14px; line-height: 22px;">
                This link will expire in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
              </p>
              <p style="margin: 0; color: #888888; font-size: 12px; line-height: 18px;">
                If the button above does not work, copy and paste this link into your browser:<br>
                <a href="${resetLink}" style="color: #86A59C; word-break: break-all;">${resetLink}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; color: #888888; font-size: 12px; text-align: center;">
                OnRopePro - Rope Access Management Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
    
    console.log('[SendGrid] API Response status code:', response?.[0]?.statusCode);
    console.log('[SendGrid] API Response headers:', JSON.stringify(response?.[0]?.headers || {}));
    
    return { success: true };
  } catch (error: any) {
    console.error('[SendGrid] Failed to send email:', error);
    // Log more details for SendGrid errors
    if (error.response) {
      console.error('[SendGrid] Response status:', error.response.statusCode);
      console.error('[SendGrid] Response body:', JSON.stringify(error.response.body));
    }
    return { success: false, error: error.message };
  }
}

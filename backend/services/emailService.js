// services/emailService.js

const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure Brevo API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Send password reset email using Brevo
 * @param {string} email - Recipient email
 * @param {string} username - Username for personalization
 @param {string} resetUrl - Password reset URL
 */

const sendPasswordResetEmail = async (email, username, resetUrl) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = 'Reset Your Twanalyze Password';
    sendSmtpEmail.to = [{ email: email, name: username }];
    sendSmtpEmail.sender = { 
      name: 'Twanalyze Support', 
      email: process.env.FROM_EMAIL || 'noreply@twanalyze.com' 
    };

    // HTML email template
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            background: linear-gradient(135deg, #1da9ff 0%, #0c8de0 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .content { 
            background: #f8f9fa; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
          }
          .button { 
            display: inline-block; 
            background: #1da9ff; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 20px 0; 
            font-weight: bold;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd; 
            color: #666; 
            font-size: 14px; 
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 15px; 
            border-radius: 5px; 
            margin: 20px 0; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔒 Password Reset Request</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${username}!</h2>
          
          <p>We received a request to reset your password for your Twanalyze account. If you made this request, click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset My Password</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 10 minutes for security reasons</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will remain unchanged if you don't click the link</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #1da9ff;">${resetUrl}</p>
          
          <p>If you have any questions or concerns, please contact our support team.</p>
          
          <p>Best regards,<br>The Twanalyze Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>© 2025 Twanalyze. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Plain text fallback
    sendSmtpEmail.textContent = `
      Hello ${username}!

      We received a request to reset your password for your Twanalyze account.

      If you made this request, please click the following link to reset your password:
      ${resetUrl}

      This link will expire in 10 minutes for security reasons.

      If you didn't request this reset, please ignore this email. Your password will remain unchanged.

      Best regards,
      The Twanalyze Team
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Password reset email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send password change confirmation email
 * @param {string} email - Recipient email
 * @param {string} username - Username for personalization
 */
const sendPasswordChangeConfirmation = async (email, username) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = 'Password Changed Successfully - Twanalyze';
    sendSmtpEmail.to = [{ email: email, name: username }];
    sendSmtpEmail.sender = { 
      name: 'Twanalyze Security', 
      email: process.env.FROM_EMAIL || 'security@twanalyze.com' 
    };

    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>✅ Password Changed Successfully</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2>Hello ${username}!</h2>
          
          <p>This email confirms that your Twanalyze account password was successfully changed on ${new Date().toLocaleString()}.</p>
          
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>🛡️ Security Notice:</strong>
            <p>If you didn't make this change, please contact our support team immediately.</p>
          </div>
          
          <p>For your security, we recommend:</p>
          <ul>
            <li>Using a strong, unique password</li>
            <li>Not sharing your password with anyone</li>
            <li>Logging out from shared or public devices</li>
          </ul>
          
          <p>Best regards,<br>The Twanalyze Team</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>© 2025 Twanalyze. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Password change confirmation sent:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error here as password change was successful
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordChangeConfirmation
};
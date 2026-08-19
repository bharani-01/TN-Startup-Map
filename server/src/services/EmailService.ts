import { logger } from '../utils/logger.js';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  metadata?: Record<string, any>;
  sentAt: string;
}

export class EmailService {
  private static instance: EmailService;
  private emailLogs: EmailPayload[] = [];

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public generateTempPassword(prefix: string = 'TN-Launch'): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomDigits}`;
  }

  public async sendFounderWelcomeEmail(params: {
    to: string;
    founderName: string;
    startupName: string;
    tempPassword?: string;
    loginUrl?: string;
    isExistingUser?: boolean;
  }): Promise<EmailPayload> {
    const loginUrl = params.loginUrl || 'http://localhost:5173/login';
    const sentAt = new Date().toISOString();

    const subject = params.isExistingUser
      ? `Startup "${params.startupName}" approved and added to your Founder Dashboard`
      : `Your startup "${params.startupName}" is verified on TN Startup Map`;

    const text = params.isExistingUser
      ? `
Hello ${params.founderName},

Great news! Your startup "${params.startupName}" has been verified and approved on the Tamil Nadu Startup Map.

Because you already have a registered founder account, "${params.startupName}" has been automatically linked to your existing dashboard. You can sign in using your existing account password to manage this startup.

Access Portal: ${loginUrl}

Tamil Nadu Startup Ecosystem Team
TN Startup Map
      `.trim()
      : `
Hello ${params.founderName},

Your startup "${params.startupName}" has been verified and published on the Tamil Nadu Interactive Startup Map.

Founder Account Credentials:
Login Email: ${params.to}
Temporary Password: ${params.tempPassword || 'TN-Launch-2024'}
Access Portal: ${loginUrl}

Once logged in, you can update your company metrics, team, and hiring status.

Tamil Nadu Startup Ecosystem Team
TN Startup Map
      `.trim();

    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b;">
        <div style="background: #0f172a; padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Tamil Nadu Startup Map</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">Official Ecosystem Verification Portal</p>
        </div>
        
        <div style="padding: 32px 24px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0;">
            Congratulations, ${params.founderName}!
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Your startup <strong>${params.startupName}</strong> has been verified and published on the <strong>Tamil Nadu Startup Map</strong>.
          </p>
          
          ${params.isExistingUser ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px; font-size: 13px; font-weight: 700; color: #166534;">
                Existing Account Detected
              </p>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #15803d;">
                This startup has been added to your existing Founder Dashboard. You can log in with your current email (<strong>${params.to}</strong>) and existing password.
              </p>
            </div>
          ` : `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
                Founder Credentials:
              </p>
              <div style="margin-bottom: 8px; font-size: 13px;">
                <span style="color: #64748b;">Login Email:</span> <strong style="color: #0f172a;">${params.to}</strong>
              </div>
              <div style="font-size: 13px;">
                <span style="color: #64748b;">Temporary Password:</span> 
                <span style="display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-weight: 700; font-size: 14px; margin-left: 6px;">
                  ${params.tempPassword}
                </span>
              </div>
            </div>
          `}

          <div style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" style="display: inline-block; background: #0071e3; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 13px;">
              Sign In to Founder Portal →
            </a>
          </div>

          <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-bottom: 0;">
            Tamil Nadu Startup Ecosystem Platform • Live Spatial Directory
          </p>
        </div>
      </div>
    `.trim();

    const payload: EmailPayload = {
      to: params.to,
      subject,
      text,
      html,
      metadata: {
        startupName: params.startupName,
        founderName: params.founderName,
        isExistingUser: params.isExistingUser,
        tempPassword: params.tempPassword,
      },
      sentAt,
    };

    this.emailLogs.unshift(payload);

    // Prominent Console Log
    console.log('\n======================================================');
    console.log('[EMAIL DISPATCHED] FOUNDER CREDENTIALS NOTIFICATION');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Startup: ${params.startupName}`);
    console.log(`Temporary Password: ${params.tempPassword}`);
    console.log(`Login URL: ${loginUrl}`);
    console.log('======================================================\n');

    logger.info(`Welcome email with temp password dispatched to ${params.to}`);

    return payload;
  }

  public getEmailLogs(): EmailPayload[] {
    return this.emailLogs;
  }
}

export const emailService = EmailService.getInstance();

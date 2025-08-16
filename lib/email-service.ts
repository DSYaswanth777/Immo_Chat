import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '', // App password for Gmail
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendOTP(email: string, otp: string, type: 'password_change' | 'password_reset' = 'password_change'): Promise<boolean> {
    const subject = type === 'password_change' 
      ? 'Codice OTP per Cambio Password - ImmoChat'
      : 'Codice OTP per Reset Password - ImmoChat';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { background: #007bff; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 8px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ImmoChat</h1>
          </div>
          <div class="content">
            <h2>Codice OTP per ${type === 'password_change' ? 'Cambio' : 'Reset'} Password</h2>
            <p>Ciao,</p>
            <p>Hai richiesto di ${type === 'password_change' ? 'cambiare' : 'reimpostare'} la tua password. Utilizza il seguente codice OTP per completare l'operazione:</p>
            
            <div class="otp-code">${otp}</div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Questo codice è valido per 10 minuti</li>
                <li>Non condividere questo codice con nessuno</li>
                <li>Se non hai richiesto questa operazione, ignora questa email</li>
              </ul>
            </div>
            
            <p>Se hai problemi, contatta il nostro supporto.</p>
            
            <p>Cordiali saluti,<br>Il team di ImmoChat</p>
          </div>
          <div class="footer">
            <p>Questa è una email automatica, non rispondere a questo messaggio.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      ImmoChat - Codice OTP per ${type === 'password_change' ? 'Cambio' : 'Reset'} Password
      
      Il tuo codice OTP è: ${otp}
      
      Questo codice è valido per 10 minuti.
      Non condividere questo codice con nessuno.
      
      Se non hai richiesto questa operazione, ignora questa email.
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return false;
    }
  }
}

// Utility functions
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export function getOTPExpiry(minutes: number = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// Singleton instance
export const emailService = new EmailService();

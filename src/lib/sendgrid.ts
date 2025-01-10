import sgMail from '@sendgrid/mail';

// A API key será configurada em runtime
export const initSendGrid = (apiKey: string) => {
  sgMail.setApiKey(apiKey);
};

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
    disposition: 'attachment';
  }[];
}

export const sendEmail = async ({ to, subject, html, attachments }: SendEmailParams) => {
  try {
    const msg = {
      to,
      from: 'seu-email-verificado@dominio.com', // Você precisará alterar para um e-mail verificado no SendGrid
      subject,
      html,
      attachments
    };

    const response = await sgMail.send(msg);
    return { success: true, response };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
};
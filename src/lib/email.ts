import { EmailData } from '../types/email';
import { formatCurrency } from './utils';

interface EmailTemplate {
  subject: string;
  content: string;
}

export function getEmailTemplate(data: EmailData, template: string): EmailTemplate {
  // Replace template variables
  const replacements = {
    '[[razaoSocial]]': data.razaoSocial,
    '[[numeroNF]]': data.numeroNF,
    '[[valorTotal]]': formatCurrency(data.valorTotal)
  };

  const subject = "Notificação de Crédito - DC Advisors";

  const content = template.replace(
    /\[\[(.*?)\]\]/g,
    (match) => replacements[match] || match
  );

  return { subject, content };
}
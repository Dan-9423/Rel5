export type EmailStatus = 'draft' | 'saved' | 'sent';

export interface EmailData {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj?: string;
  email: string;
  numeroNF: string;
  valorTotal: number;
  dataVencimento?: string;
  observacoes?: string;
}

export interface EmailHistory {
  id: string;
  emailData: EmailData;
  sentAt: string;
  status: EmailStatus;
  logs?: EmailLog[];
  attachments?: {
    name: string;
    size: number;
    type: string;
  }[];
}

export interface EmailLog {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
}
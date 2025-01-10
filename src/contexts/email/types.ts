import { EmailData, EmailHistory, EmailTemplateVersion } from '@/types/email';

export interface EmailState {
  templates: EmailTemplateVersion[];
  history: EmailHistory[];
  activeTemplate: EmailTemplateVersion | null;
  draftEmail: EmailData | null;
  isLoading: boolean;
  error: string | null;
}

export interface EmailContextValue extends EmailState {
  addTemplate: (template: Omit<EmailTemplateVersion, 'id' | 'createdAt'>) => void;
  updateTemplate: (id: string, template: Partial<EmailTemplateVersion>) => void;
  deleteTemplate: (id: string) => void;
  setActiveTemplate: (id: string) => void;
  saveDraft: (data: EmailData) => void;
  sendEmail: (data: EmailData) => Promise<void>;
  clearDraft: () => void;
}
export interface EmailTemplateVersion {
  id: string;
  version: string;
  subject: string;
  content: string;
  createdAt: string;
  isActive?: boolean;
}

export interface EmailTemplateState {
  templates: EmailTemplateVersion[];
}
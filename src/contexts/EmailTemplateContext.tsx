import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmailTemplateState, EmailTemplateVersion } from '../types/emailTemplate';

const defaultTemplates = [
  {
    id: '1',
    version: 'Template Padrão',
    subject: 'Notificação de Crédito - DC Advisors',
    content: `Prezado(s) Senhor(es),

Esperamos que esteja bem.

Gostaríamos de informar que a DC ADVISORS LTDA, adquiriu da(e) A. PAES LTDA (MEGAFIX) o(s) crédito(s) referente(s) ao(s) boleto(s) bancário(s) em anexo, sacado(s) contra [[razaoSocial]].

Destacamos que a nota fiscal correspondente a esta operação está sendo enviada em anexo, contendo o número [[numeroNF]] e o valor total de [[valorTotal]].

A partir de agora, a gestão dos pagamentos referentes aos produtos adquiridos através da A. PAES LTDA será realizada pela DC ADVISORS.

Informamos que o pagamento poderá ser efetuado em agências ou correspondentes bancários. Caso não seja pago até o vencimento, nossos títulos estarão sujeitos à multas, juros e protestos, após 3 dias de atraso.

Fazemos questão de ressaltar que somente os pagamentos efetuados diretamente à DC ADVISORS, como detentora do crédito, serão considerados como quitação do débito.

Estamos à disposição para quaisquer esclarecimentos adicionais. No silêncio, consideraremos a operação como concluída em até 24 horas após o recebimento desta mensagem.

Agradecemos a sua atenção e confiança em nossos serviços.

Atenciosamente,`,
    isActive: true,
  },
  // ... other default templates with isActive: false
];

interface EmailTemplateContextType {
  templates: EmailTemplateVersion[];
  addTemplate: (template: Omit<EmailTemplateVersion, 'id' | 'createdAt'>) => void;
  updateTemplate: (id: string, template: Partial<EmailTemplateVersion>) => void;
  deleteTemplate: (id: string) => void;
  setActiveTemplate: (id: string) => void;
  getActiveTemplate: () => EmailTemplateVersion | undefined;
}

const EmailTemplateContext = createContext<EmailTemplateContextType | undefined>(undefined);

export function EmailTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<EmailTemplateVersion[]>(() => {
    const saved = localStorage.getItem('emailTemplates');
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultTemplates.map(template => ({
      ...template,
      createdAt: new Date().toISOString()
    }));
  });

  useEffect(() => {
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
  }, [templates]);

  const addTemplate = (template: Omit<EmailTemplateVersion, 'id' | 'createdAt'>) => {
    const newTemplate: EmailTemplateVersion = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isActive: false
    };
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const updateTemplate = (id: string, template: Partial<EmailTemplateVersion>) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, ...template } : t
    ));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const setActiveTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => ({
      ...t,
      isActive: t.id === id
    })));
  };

  const getActiveTemplate = () => {
    return templates.find(t => t.isActive);
  };

  return (
    <EmailTemplateContext.Provider value={{
      templates,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      setActiveTemplate,
      getActiveTemplate
    }}>
      {children}
    </EmailTemplateContext.Provider>
  );
}

export function useEmailTemplate() {
  const context = useContext(EmailTemplateContext);
  if (context === undefined) {
    throw new Error('useEmailTemplate must be used within a EmailTemplateProvider');
  }
  return context;
}
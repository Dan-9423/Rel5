import { createStoreContext } from '@/lib/context/createStoreContext';
import { EmailState, EmailContextValue } from './types';
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: EmailState = {
  templates: [],
  history: [],
  activeTemplate: null,
  draftEmail: null,
  isLoading: false,
  error: null,
};

const [EmailStoreProvider, useEmailStore] = createStoreContext({
  name: 'Email',
  initialState,
  persistKey: 'email_state',
});

export function EmailProvider({ children }: { children: React.ReactNode }) {
  return <EmailStoreProvider>{children}</EmailStoreProvider>;
}

export function useEmail(): EmailContextValue {
  const [state, setState] = useEmailStore();
  const { toast } = useToast();

  const addTemplate = useCallback((templateData: Omit<typeof state.templates[0], 'id' | 'createdAt'>) => {
    const newTemplate = {
      ...templateData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isActive: false,
    };

    setState({
      ...state,
      templates: [newTemplate, ...state.templates],
    });
  }, [state, setState]);

  const updateTemplate = useCallback((id: string, templateData: Partial<typeof state.templates[0]>) => {
    setState({
      ...state,
      templates: state.templates.map(template =>
        template.id === id ? { ...template, ...templateData } : template
      ),
    });
  }, [state, setState]);

  const deleteTemplate = useCallback((id: string) => {
    setState({
      ...state,
      templates: state.templates.filter(template => template.id !== id),
      activeTemplate: state.activeTemplate?.id === id ? null : state.activeTemplate,
    });
  }, [state, setState]);

  const setActiveTemplate = useCallback((id: string) => {
    setState({
      ...state,
      templates: state.templates.map(template => ({
        ...template,
        isActive: template.id === id,
      })),
      activeTemplate: state.templates.find(template => template.id === id) || null,
    });
  }, [state, setState]);

  const saveDraft = useCallback((data: typeof state.draftEmail) => {
    setState({
      ...state,
      draftEmail: data,
    });

    toast({
      title: "Rascunho salvo",
      description: "O e-mail foi salvo como rascunho.",
    });
  }, [state, setState, toast]);

  const sendEmail = useCallback(async (data: typeof state.draftEmail) => {
    try {
      setState({ ...state, isLoading: true, error: null });

      // Simular envio de e-mail
      const emailEntry = {
        id: crypto.randomUUID(),
        emailData: data!,
        sentAt: new Date().toISOString(),
        status: 'sent' as const,
      };

      setState({
        ...state,
        history: [emailEntry, ...state.history],
        draftEmail: null,
        isLoading: false,
      });

      toast({
        title: "E-mail enviado",
        description: "O e-mail foi enviado com sucesso.",
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Erro ao enviar e-mail',
      });

      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar o e-mail.",
        variant: "destructive",
      });
    }
  }, [state, setState, toast]);

  const clearDraft = useCallback(() => {
    setState({
      ...state,
      draftEmail: null,
    });
  }, [state, setState]);

  return {
    ...state,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    setActiveTemplate,
    saveDraft,
    sendEmail,
    clearDraft,
  };
}
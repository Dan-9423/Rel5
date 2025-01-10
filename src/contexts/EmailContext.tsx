import { createContext, useContext, useState } from 'react';
import { initSendGrid, sendEmail } from '@/lib/sendgrid';

interface EmailContextType {
  initializeEmailService: (apiKey: string) => void;
  sendEmail: (to: string, subject: string, html: string, attachments?: any[]) => Promise<any>;
  isInitialized: boolean;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeEmailService = (apiKey: string) => {
    initSendGrid(apiKey);
    setIsInitialized(true);
  };

  const handleSendEmail = async (to: string, subject: string, html: string, attachments?: any[]) => {
    if (!isInitialized) {
      throw new Error('Email service not initialized');
    }

    return sendEmail({
      to,
      subject,
      html,
      attachments
    });
  };

  return (
    <EmailContext.Provider value={{
      initializeEmailService,
      sendEmail: handleSendEmail,
      isInitialized
    }}>
      {children}
    </EmailContext.Provider>
  );
}

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};
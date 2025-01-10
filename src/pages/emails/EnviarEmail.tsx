import { useState } from 'react';
import { Paperclip, Upload } from 'lucide-react';
import { useCustomers } from '@/contexts/CustomerContext';
import { useEmailTemplate } from '@/contexts/EmailTemplateContext';
import { EmailData, EmailHistory } from '@/types/email';
import EmailForm from '@/components/forms/EmailForm';
import EmailPreview from '@/components/emails/EmailPreview';
import { getEmailTemplate } from '@/lib/email';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export default function EnviarEmail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers } = useCustomers();
  const { templates, getActiveTemplate } = useEmailTemplate();
  const [emailData, setEmailData] = useState<EmailData | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);

  const activeTemplate = getActiveTemplate();

  const handleEmailSubmit = (data: EmailData) => {
    setEmailData(data);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const createHistoryEntry = (status: 'draft' | 'saved' | 'sent'): EmailHistory => {
    if (!emailData) throw new Error('No email data');

    return {
      id: crypto.randomUUID(),
      emailData,
      sentAt: new Date().toISOString(),
      status,
      attachments: attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };
  };

  const handleSave = async () => {
    if (!emailData) return;

    try {
      // Create history entry
      const historyEntry = createHistoryEntry('saved');
      
      // Get existing history from localStorage
      const existingHistory = JSON.parse(localStorage.getItem('emailHistory') || '[]');
      
      // Add new entry
      const updatedHistory = [historyEntry, ...existingHistory];
      
      // Save to localStorage
      localStorage.setItem('emailHistory', JSON.stringify(updatedHistory));

      toast({
        title: "E-mail salvo",
        description: "O e-mail foi salvo com sucesso no histórico.",
      });
      
      // Clear form
      setEmailData(null);
      setAttachments([]);
      
      // Navigate to history
      navigate('/emails/historico');
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o e-mail.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAndSend = async () => {
    if (!emailData) return;

    setIsSending(true);
    try {
      // Create history entry
      const historyEntry = createHistoryEntry('sent');
      
      // Get existing history
      const existingHistory = JSON.parse(localStorage.getItem('emailHistory') || '[]');
      
      // Add new entry
      const updatedHistory = [historyEntry, ...existingHistory];
      
      // Save to localStorage
      localStorage.setItem('emailHistory', JSON.stringify(updatedHistory));
      
      toast({
        title: "E-mail enviado",
        description: "O e-mail foi salvo e enviado com sucesso.",
      });
      
      // Clear form
      setEmailData(null);
      setAttachments([]);
      
      // Navigate to history
      navigate('/emails/historico');
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar o e-mail.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!activeTemplate) {
    return (
      <div className="bg-white dark:bg-[#1C1C1C] rounded-lg p-6 shadow-lg">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Nenhum template ativo definido</h2>
          <p className="text-muted-foreground mb-6">
            Para enviar e-mails, primeiro defina um template ativo na página de templates.
          </p>
          <Button onClick={() => navigate('/emails/template')}>
            Ir para Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white dark:bg-[#1C1C1C] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Inserção de Dados</h2>
        
        <EmailForm 
          onSubmit={handleEmailSubmit}
          customers={customers}
        />

        <div className="mt-6 p-6 border-2 border-dashed rounded-lg border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <Upload className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-1">Anexar Arquivos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Arraste arquivos PDF aqui ou clique para selecionar
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="w-full max-w-xs"
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Selecionar Arquivos
              </Button>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf"
              multiple
              onChange={handleAttachmentChange}
            />
          </div>

          {attachments.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium mb-2">Arquivos Anexados:</h4>
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center">
                    <Paperclip className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => removeAttachment(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C1C1C] rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Visualização do E-mail</h2>
          {emailData && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                Salvar
              </Button>
              <Button onClick={handleSaveAndSend} disabled={isSending}>
                {isSending ? "Enviando..." : "Salvar e Enviar"}
              </Button>
            </div>
          )}
        </div>
        
        {emailData ? (
          <EmailPreview
            data={emailData}
            template={getEmailTemplate(emailData, activeTemplate.content)}
            attachments={attachments}
          />
        ) : (
          <div className="flex items-center justify-center h-[600px] text-muted-foreground">
            Preencha os dados do e-mail para visualizar
          </div>
        )}
      </div>
    </div>
  );
}
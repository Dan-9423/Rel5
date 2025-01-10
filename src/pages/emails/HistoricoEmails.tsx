import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import EmailHistoryList from '@/components/emails/EmailHistoryList';
import { EmailData, EmailHistory } from '@/types/email';
import EmailPreview from '@/components/emails/EmailPreview';
import { useEmailTemplate } from '@/contexts/EmailTemplateContext';
import { getEmailTemplate } from '@/lib/email';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HistoricoEmails() {
  const { toast } = useToast();
  const { templates } = useEmailTemplate();
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [history, setHistory] = useState<EmailHistory[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('emailHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSelectEmail = (id: string) => {
    setSelectedEmails(prev => {
      if (prev.includes(id)) {
        return prev.filter(emailId => emailId !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === history.filter(h => h.status === 'saved').length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(history.filter(h => h.status === 'saved').map(h => h.id));
    }
  };

  const handleSendSelected = async () => {
    if (selectedEmails.length === 0) return;

    setIsSending(true);
    try {
      // Update status of selected emails to 'sent'
      const updatedHistory = history.map(email => 
        selectedEmails.includes(email.id) 
          ? { ...email, status: 'sent' as const } 
          : email
      );
      
      // Save to localStorage
      localStorage.setItem('emailHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      
      toast({
        title: "E-mails enviados",
        description: `${selectedEmails.length} e-mail(s) foram enviados com sucesso.`,
      });
      setSelectedEmails([]);
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar os e-mails.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleEdit = (email: EmailHistory) => {
    // Implement edit logic
    toast({
      title: "Edição iniciada",
      description: "Você está editando o e-mail selecionado.",
    });
  };

  const handleDelete = (email: EmailHistory) => {
    setDeleteConfirmation(email.id);
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;

    const updatedHistory = history.filter(email => email.id !== deleteConfirmation);
    setHistory(updatedHistory);
    localStorage.setItem('emailHistory', JSON.stringify(updatedHistory));
    setDeleteConfirmation(null);
    
    toast({
      title: "E-mail excluído",
      description: "O e-mail foi excluído com sucesso.",
    });
  };

  const savedEmails = history.filter(h => h.status === 'saved');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1C1C1C] rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Histórico de E-mails</h2>
          {savedEmails.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedEmails.length === savedEmails.length && savedEmails.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm">
                  Selecionar todos não enviados
                </label>
              </div>
              {selectedEmails.length > 0 && (
                <Button onClick={handleSendSelected} disabled={isSending}>
                  <Mail className="h-4 w-4 mr-2" />
                  {isSending ? "Enviando..." : `Enviar ${selectedEmails.length} e-mail(s)`}
                </Button>
              )}
            </div>
          )}
        </div>
        
        <EmailHistoryList
          history={history}
          onView={(email) => setSelectedEmail(email.emailData)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedEmails={selectedEmails}
          onSelect={handleSelectEmail}
        />
      </div>

      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualização do E-mail</DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <EmailPreview
              data={selectedEmail}
              template={getEmailTemplate(selectedEmail, templates[0]?.content || '')}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este e-mail? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
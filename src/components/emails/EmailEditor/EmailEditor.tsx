import { useState } from 'react';
import { Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailData } from '@/types/email';
import { EmailForm } from './EmailForm';
import { EmailPreview } from './EmailPreview';
import { EmailAttachments } from './EmailAttachments';
import { Card } from '@/components/ui/card';

interface EmailEditorProps {
  onSave: (data: EmailData, status: 'draft' | 'saved') => void;
  onSend: (data: EmailData) => void;
  initialData?: EmailData;
}

export function EmailEditor({ onSave, onSend, initialData }: EmailEditorProps) {
  const [emailData, setEmailData] = useState<EmailData | null>(initialData || null);
  const [showPreview, setShowPreview] = useState(false);

  const handleEmailSubmit = (data: EmailData) => {
    setEmailData(data);
    setShowPreview(true);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Composição do E-mail</h2>
          {emailData && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onSave(emailData, 'draft')}>
                Salvar Rascunho
              </Button>
              <Button onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </div>
          )}
        </div>

        <EmailForm
          onSubmit={handleEmailSubmit}
          initialData={initialData}
        />

        <EmailAttachments />
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Visualização</h2>
          {emailData && showPreview && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onSave(emailData, 'saved')}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={() => onSend(emailData)}>
                Enviar E-mail
              </Button>
            </div>
          )}
        </div>

        {emailData && showPreview ? (
          <EmailPreview data={emailData} />
        ) : (
          <div className="flex items-center justify-center h-[600px] text-muted-foreground">
            Preencha os dados do e-mail para visualizar
          </div>
        )}
      </Card>
    </div>
  );
}
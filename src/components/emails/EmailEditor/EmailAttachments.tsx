import { useState } from 'react';
import { Paperclip, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/common/Forms/FormSection';

export function EmailAttachments() {
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <FormSection title="Anexos">
      <div className="p-6 border-2 border-dashed rounded-lg border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
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
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
}
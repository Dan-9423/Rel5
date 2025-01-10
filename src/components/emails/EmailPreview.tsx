import { EmailData } from '@/types/email';
import { Card, CardContent } from '@/components/ui/card';
import { Paperclip } from 'lucide-react';

interface EmailPreviewProps {
  data: EmailData;
  template: {
    subject: string;
    content: string;
  };
  attachments?: File[];
}

export default function EmailPreview({ data, template, attachments }: EmailPreviewProps) {
  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .split('\n')
      .map((line) => 
        line.startsWith('- ') ? 
          `<li class="ml-4">${line.substring(2)}</li>` : 
          `<p class="mb-4">${line}</p>`
      )
      .join('');
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Para:</p>
          <p>{data.email}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Assunto:</p>
          <p>{template.subject}</p>
        </div>

        <div className="h-px bg-border" />
        
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: formatContent(template.content)
          }}
        />

        {attachments && attachments.length > 0 && (
          <>
            <div className="h-px bg-border" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Anexos:</p>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
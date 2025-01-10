import { Bold, Italic, List, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TemplateEditorProps {
  value: {
    version?: string;
    subject: string;
    content: string;
  };
  onChange: (value: {
    version?: string;
    subject: string;
    content: string;
  }) => void;
  onPreview: () => void;
}

export default function TemplateEditor({ value, onChange, onPreview }: TemplateEditorProps) {
  const handleFormat = (format: string) => {
    const textarea = document.querySelector('#template-editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.content.substring(start, end);
    
    let newContent = value.content;
    switch (format) {
      case 'bold':
        newContent = value.content.substring(0, start) + `**${selectedText}**` + value.content.substring(end);
        break;
      case 'italic':
        newContent = value.content.substring(0, start) + `_${selectedText}_` + value.content.substring(end);
        break;
      case 'list':
        const lines = selectedText.split('\n').map(line => `- ${line}`);
        newContent = value.content.substring(0, start) + lines.join('\n') + value.content.substring(end);
        break;
    }
    
    onChange({ ...value, content: newContent });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nome do Template</Label>
        <Input
          value={value.version}
          onChange={(e) => onChange({ ...value, version: e.target.value })}
          placeholder="Ex: Template de Cobrança"
        />
      </div>

      <div className="space-y-2">
        <Label>Assunto do E-mail</Label>
        <Input
          value={value.subject}
          onChange={(e) => onChange({ ...value, subject: e.target.value })}
          placeholder="Digite o assunto do e-mail..."
        />
      </div>

      <div className="space-y-2">
        <Label>Conteúdo do E-mail</Label>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center gap-1 border-b p-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFormat('bold')}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Negrito</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFormat('italic')}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Itálico</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFormat('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Lista</TooltipContent>
              </Tooltip>

              <div className="flex-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPreview}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Visualizar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="template-editor"
            value={value.content}
            onChange={(e) => onChange({ ...value, content: e.target.value })}
            className="min-h-[400px] rounded-none border-0 font-mono text-sm resize-none focus-visible:ring-0"
          />
        </div>
      </div>
    </div>
  );
}
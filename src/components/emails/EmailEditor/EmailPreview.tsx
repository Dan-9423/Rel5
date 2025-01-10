import { EmailData } from '@/types/email';
import { formatCurrency, formatCNPJ } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Paperclip } from 'lucide-react';

interface EmailPreviewProps {
  data: EmailData;
  attachments?: File[];
}

export function EmailPreview({ data, attachments }: EmailPreviewProps) {
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

  const template = `
    Prezado(s) Senhor(es),

    Esperamos que esteja bem.

    Gostaríamos de informar que a DC ADVISORS LTDA, adquiriu da(e) A. PAES LTDA (MEGAFIX) o(s) crédito(s) referente(s) ao(s) boleto(s) bancário(s) em anexo, sacado(s) contra ${data.razaoSocial}.

    Destacamos que a nota fiscal correspondente a esta operação está sendo enviada em anexo, contendo o número ${data.numeroNF} e o valor total de ${formatCurrency(data.valorTotal)}.

    A partir de agora, a gestão dos pagamentos referentes aos produtos adquiridos através da A. PAES LTDA será realizada pela DC ADVISORS.

    Informamos que o pagamento poderá ser efetuado em agências ou correspondentes bancários. Caso não seja pago até o vencimento, nossos títulos estarão sujeitos à multas, juros e protestos, após 3 dias de atraso.

    Fazemos questão de ressaltar que somente os pagamentos efetuados diretamente à DC ADVISORS, como detentora do crédito, serão considerados como quitação do débito.

    Estamos à disposição para quaisquer esclarecimentos adicionais. No silêncio, consideraremos a operação como concluída em até 24 horas após o recebimento desta mensagem.

    Agradecemos a sua atenção e confiança em nossos serviços.

    Atenciosamente,
  `;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Para:</p>
          <p>{data.email}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Assunto:</p>
          <p>Notificação de Crédito - DC Advisors</p>
        </div>

        <div className="h-px bg-border" />
        
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: formatContent(template)
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
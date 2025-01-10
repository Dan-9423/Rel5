import { useState, useEffect } from 'react';
import { EmailData } from '@/types/email';
import { formatCurrency } from '@/lib/utils';

interface TemplateVariable {
  key: string;
  value: string | number;
  description: string;
}

interface EmailTemplateEngineProps {
  template: string;
  data: EmailData;
  onChange?: (content: string) => void;
}

export function EmailTemplateEngine({ template, data, onChange }: EmailTemplateEngineProps) {
  const [processedContent, setProcessedContent] = useState(template);

  const variables: TemplateVariable[] = [
    { key: '[[razaoSocial]]', value: data.razaoSocial, description: 'Nome da empresa' },
    { key: '[[numeroNF]]', value: data.numeroNF, description: 'Número da NF' },
    { key: '[[valorTotal]]', value: formatCurrency(data.valorTotal), description: 'Valor total' },
  ];

  useEffect(() => {
    let content = template;
    variables.forEach(({ key, value }) => {
      content = content.replace(new RegExp(key, 'g'), String(value));
    });
    setProcessedContent(content);
    onChange?.(content);
  }, [template, data, onChange]);

  return (
    <div className="space-y-4">
      <div className="prose dark:prose-invert max-w-none">
        {processedContent.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Variáveis Disponíveis:</h4>
        <ul className="space-y-2">
          {variables.map(({ key, description }) => (
            <li key={key} className="text-sm flex items-center gap-2">
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {key}
              </code>
              <span className="text-gray-500 dark:text-gray-400">
                {description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
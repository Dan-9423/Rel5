import { Eye, FileText, Pencil, Trash2, Lock } from 'lucide-react';
import { EmailHistory } from '@/types/email';
import { formatCurrency } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface EmailHistoryListProps {
  history: EmailHistory[];
  onView: (email: EmailHistory) => void;
  onEdit?: (email: EmailHistory) => void;
  onDelete?: (email: EmailHistory) => void;
  selectedEmails?: string[];
  onSelect?: (id: string) => void;
}

const statusConfig = {
  draft: {
    label: 'Rascunho',
    variant: 'secondary' as const
  },
  saved: {
    label: 'Salvo',
    variant: 'warning' as const
  },
  sent: {
    label: 'Enviado',
    variant: 'success' as const
  }
};

export default function EmailHistoryList({ 
  history, 
  onView, 
  onEdit,
  onDelete,
  selectedEmails = [], 
  onSelect 
}: EmailHistoryListProps) {
  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <Card key={entry.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {entry.status === 'saved' && onSelect && (
                  <Checkbox
                    checked={selectedEmails.includes(entry.id)}
                    onCheckedChange={() => onSelect(entry.id)}
                  />
                )}
                <div className="bg-blue-500/10 dark:bg-blue-500/20 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {entry.emailData.razaoSocial}
                    </h3>
                    <Badge variant={statusConfig[entry.status].variant}>
                      {statusConfig[entry.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    NF: {entry.emailData.numeroNF}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(entry.emailData.valorTotal)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.sentAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(entry)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Visualizar</TooltipContent>
                  </Tooltip>

                  {onEdit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(entry)}
                            disabled={entry.status === 'sent'}
                            className={entry.status === 'sent' ? 'cursor-not-allowed' : ''}
                          >
                            {entry.status === 'sent' ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Pencil className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {entry.status === 'sent' ? 'E-mail já enviado' : 'Editar'}
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {onDelete && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(entry)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Excluir</TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
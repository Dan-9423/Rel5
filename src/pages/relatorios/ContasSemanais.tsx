import { useState, useRef } from 'react';
import { Upload, Download, Plus, Trash2, Settings, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Draggable from 'react-draggable';

interface DraggablePosition {
  x: number;
  y: number;
}

interface DraggableElement {
  id: string;
  type: 'company' | 'financial' | 'payable' | 'receivable';
  position: DraggablePosition;
}

interface PaymentEntry {
  date: string;
  description: string;
  value: number;
  status: 'pending' | 'paid' | 'overdue';
}

export default function ContasSemanais() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backgroundSvg, setBackgroundSvg] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [payableEntries, setPayableEntries] = useState<PaymentEntry[]>([]);
  const [receivableEntries, setReceivableEntries] = useState<PaymentEntry[]>([]);

  // Add refs for draggable elements
  const nodeRefs = {
    'company-data': useRef(null),
    'financial-data': useRef(null),
    'payable-table': useRef(null),
    'receivable-table': useRef(null)
  };

  // Draggable elements state
  const [draggableElements, setDraggableElements] = useState<DraggableElement[]>([
    { id: 'company-data', type: 'company', position: { x: 0, y: 0 } },
    { id: 'financial-data', type: 'financial', position: { x: 0, y: 200 } },
    { id: 'payable-table', type: 'payable', position: { x: 0, y: 400 } },
    { id: 'receivable-table', type: 'receivable', position: { x: 0, y: 600 } }
  ]);

  const handleDragStop = (elementId: string, e: any, data: { x: number, y: number }) => {
    setDraggableElements(prev => prev.map(element => 
      element.id === elementId 
        ? { ...element, position: { x: data.x, y: data.y } }
        : element
    ));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'image/svg+xml') {
        toast({
          title: "Erro no upload",
          description: "Por favor, selecione um arquivo SVG válido.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundSvg(e.target?.result as string);
        toast({
          title: "SVG carregado",
          description: "O arquivo SVG foi carregado com sucesso.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderDraggableElements = () => (
    <div className="relative w-full h-full">
      {draggableElements.map((element) => (
        <Draggable
          key={element.id}
          position={element.position}
          onStop={(e, data) => handleDragStop(element.id, e, data)}
          bounds="parent"
          nodeRef={nodeRefs[element.id as keyof typeof nodeRefs]}
        >
          <div 
            ref={nodeRefs[element.id as keyof typeof nodeRefs]}
            className="absolute cursor-move bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {element.type === 'company' && (
              <div className="space-y-2">
                <h3 className="font-medium">Dados da Empresa</h3>
                <p>Empresa ABC Ltda</p>
                <p>CNPJ: 00.000.000/0000-00</p>
                <p>contato@empresa.com</p>
              </div>
            )}
            {element.type === 'financial' && (
              <div className="space-y-2">
                <h3 className="font-medium">Totais Financeiros</h3>
                <p>A Pagar: {formatCurrency(15000)}</p>
                <p>A Receber: {formatCurrency(25000)}</p>
                <p>Saldo: {formatCurrency(10000)}</p>
              </div>
            )}
            {element.type === 'payable' && (
              <div className="w-96">
                <h3 className="font-medium mb-2">Contas a Pagar</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payableEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>{formatCurrency(entry.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {element.type === 'receivable' && (
              <div className="w-96">
                <h3 className="font-medium mb-2">Contas a Receber</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivableEntries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>{formatCurrency(entry.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </Draggable>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Company Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
          <CardDescription>
            Informações básicas da empresa para o relatório
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Nome da Empresa</Label>
            <Input placeholder="Razão Social" />
          </div>
          <div className="space-y-2">
            <Label>CNPJ</Label>
            <Input placeholder="00.000.000/0000-00" />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input type="email" placeholder="contato@empresa.com" />
          </div>
        </CardContent>
      </Card>

      {/* Financial Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Financeiros</CardTitle>
          <CardDescription>
            Resumo dos valores a pagar e receber
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          {/* Payable Accounts */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contas a Pagar</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input type="date" className="w-40" />
                <Input placeholder="Descrição" className="flex-1" />
                <Input type="number" placeholder="Valor" className="w-32" />
                <Button onClick={() => setPayableEntries(prev => [
                  ...prev,
                  { date: '2024-01-15', description: 'Nova conta', value: 0, status: 'pending' }
                ])}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payableEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{formatCurrency(entry.value)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPayableEntries(prev => prev.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Receivable Accounts */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contas a Receber</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input type="date" className="w-40" />
                <Input placeholder="Descrição" className="flex-1" />
                <Input type="number" placeholder="Valor" className="w-32" />
                <Button onClick={() => setReceivableEntries(prev => [
                  ...prev,
                  { date: '2024-01-15', description: 'Nova conta', value: 0, status: 'pending' }
                ])}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivableEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{formatCurrency(entry.value)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setReceivableEntries(prev => prev.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Plano de Fundo</CardTitle>
          <CardDescription>
            Faça upload de uma imagem SVG para usar como plano de fundo do relatório (2480x3508 px)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept=".svg"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload SVG
            </Button>
            {backgroundSvg && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  SVG carregado com sucesso
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>Visualização do SVG</DialogTitle>
          </DialogHeader>
          <div className="w-full overflow-auto max-h-[80vh] relative">
            {backgroundSvg && (
              <>
                <img
                  src={backgroundSvg}
                  alt="Preview do SVG"
                  className="w-full h-auto"
                />
                {renderDraggableElements()}
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPreview(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Display SVG at the bottom if loaded */}
      {backgroundSvg && (
        <Card>
          <CardHeader>
            <CardTitle>SVG Carregado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden rounded-lg border relative">
              <img
                src={backgroundSvg}
                alt="SVG carregado"
                className="w-full h-auto"
              />
              {renderDraggableElements()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
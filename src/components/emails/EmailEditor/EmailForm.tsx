import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { EmailData } from '@/types/email';
import { formatCurrency } from '@/lib/utils';
import { FormSection } from '@/components/common/Forms/FormSection';

const formSchema = z.object({
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  nomeFantasia: z.string().optional(),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  email: z.string().email('E-mail inválido'),
  numeroNF: z.string().min(1, 'Número da NF é obrigatório'),
  valorTotal: z.number().min(0, 'Valor não pode ser negativo'),
  dataVencimento: z.string().optional(),
  observacoes: z.string().optional(),
});

interface EmailFormProps {
  onSubmit: (data: EmailData) => void;
  initialData?: EmailData;
}

export function EmailForm({ onSubmit, initialData }: EmailFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      email: '',
      numeroNF: '',
      valorTotal: 0,
      dataVencimento: '',
      observacoes: '',
    },
  });

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    const amount = parseInt(value) / 100;
    form.setValue('valorTotal', amount);
    e.target.value = formatCurrency(amount);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Dados do Cliente">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomeFantasia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Fantasia</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Dados da Nota">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="numeroNF"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da NF</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valorTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Total</FormLabel>
                  <FormControl>
                    <Input
                      onChange={handleCurrencyInput}
                      defaultValue={formatCurrency(field.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataVencimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <Button type="submit" className="w-full">
          Continuar
        </Button>
      </form>
    </Form>
  );
}
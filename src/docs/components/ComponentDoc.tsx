import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  description: string;
  component: ReactNode;
  code: string;
  usage?: string;
  api?: {
    props?: {
      name: string;
      type: string;
      default?: string;
      description: string;
      required?: boolean;
    }[];
    methods?: {
      name: string;
      parameters: string;
      returnType: string;
      description: string;
    }[];
  };
}

export function ComponentDoc({ title, description, component, code, usage, api }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="p-6">
        <div className="mb-6">{component}</div>
      </Card>

      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">Código</TabsTrigger>
          {usage && <TabsTrigger value="usage">Uso</TabsTrigger>}
          {api && <TabsTrigger value="api">API</TabsTrigger>}
        </TabsList>

        <TabsContent value="code" className="mt-4">
          <Card className="p-4">
            <pre className="language-typescript">
              <code>{code}</code>
            </pre>
          </Card>
        </TabsContent>

        {usage && (
          <TabsContent value="usage" className="mt-4">
            <Card className="p-6 prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: usage }} />
            </Card>
          </TabsContent>
        )}

        {api && (
          <TabsContent value="api" className="mt-4">
            <Card className="p-6">
              {api.props && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Props</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Nome</th>
                          <th className="text-left py-2 px-4">Tipo</th>
                          <th className="text-left py-2 px-4">Padrão</th>
                          <th className="text-left py-2 px-4">Descrição</th>
                        </tr>
                      </thead>
                      <tbody>
                        {api.props.map((prop) => (
                          <tr key={prop.name} className="border-b">
                            <td className="py-2 px-4">
                              {prop.name}
                              {prop.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </td>
                            <td className="py-2 px-4">
                              <code className="text-sm bg-muted px-1 py-0.5 rounded">
                                {prop.type}
                              </code>
                            </td>
                            <td className="py-2 px-4">
                              {prop.default && (
                                <code className="text-sm bg-muted px-1 py-0.5 rounded">
                                  {prop.default}
                                </code>
                              )}
                            </td>
                            <td className="py-2 px-4">{prop.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {api.methods && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Métodos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Nome</th>
                          <th className="text-left py-2 px-4">Parâmetros</th>
                          <th className="text-left py-2 px-4">Retorno</th>
                          <th className="text-left py-2 px-4">Descrição</th>
                        </tr>
                      </thead>
                      <tbody>
                        {api.methods.map((method) => (
                          <tr key={method.name} className="border-b">
                            <td className="py-2 px-4">{method.name}</td>
                            <td className="py-2 px-4">
                              <code className="text-sm bg-muted px-1 py-0.5 rounded">
                                {method.parameters}
                              </code>
                            </td>
                            <td className="py-2 px-4">
                              <code className="text-sm bg-muted px-1 py-0.5 rounded">
                                {method.returnType}
                              </code>
                            </td>
                            <td className="py-2 px-4">{method.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
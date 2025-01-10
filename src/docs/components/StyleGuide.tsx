import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function StyleGuide() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Cores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorCard name="primary" value="hsl(var(--primary))" />
          <ColorCard name="secondary" value="hsl(var(--secondary))" />
          <ColorCard name="accent" value="hsl(var(--accent))" />
          <ColorCard name="muted" value="hsl(var(--muted))" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Tipografia</h2>
        <Card className="p-6 space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Título H1</h1>
            <p className="text-sm text-muted-foreground">4xl / Bold</p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Título H2</h2>
            <p className="text-sm text-muted-foreground">3xl / Semibold</p>
          </div>
          <div>
            <h3 className="text-2xl font-medium">Título H3</h3>
            <p className="text-sm text-muted-foreground">2xl / Medium</p>
          </div>
          <div>
            <p className="text-base">Texto Base</p>
            <p className="text-sm text-muted-foreground">base / Regular</p>
          </div>
          <div>
            <p className="text-sm">Texto Pequeno</p>
            <p className="text-sm text-muted-foreground">sm / Regular</p>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Componentes</h2>
        <Card className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Botões</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Formulários</h3>
            <div className="max-w-sm space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input placeholder="Digite seu nome" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Digite seu email" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Tabs</h3>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="p-4">
                Conteúdo da Tab 1
              </TabsContent>
              <TabsContent value="tab2" className="p-4">
                Conteúdo da Tab 2
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </section>
    </div>
  );
}

function ColorCard({ name, value }: { name: string; value: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-20 rounded-lg bg-${name}`} />
      <div>
        <p className="font-medium capitalize">{name}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
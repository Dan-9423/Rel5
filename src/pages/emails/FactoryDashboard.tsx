import { useState } from 'react';
import { Mail, Paperclip, Calendar, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FactoryDashboard() {
  const [dateFilter, setDateFilter] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    {
      title: "E-mails Enviados",
      value: "1,234",
      description: "+20.1% em relação ao período anterior",
      icon: <Mail className="h-4 w-4 text-blue-600" />,
      trend: "up"
    },
    {
      title: "E-mails Pendentes",
      value: "23",
      description: "-5% em relação ao período anterior",
      icon: <Mail className="h-4 w-4 text-yellow-600" />,
      trend: "down"
    },
    {
      title: "Anexos Enviados",
      value: "3,456",
      description: "+12.5% em relação ao período anterior",
      icon: <Paperclip className="h-4 w-4 text-green-600" />,
      trend: "up"
    },
    {
      title: "Taxa de Entrega",
      value: "98.7%",
      description: "+1.2% em relação ao período anterior",
      icon: <Mail className="h-4 w-4 text-purple-600" />,
      trend: "up"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={cn(
                "text-xs",
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Buscar por cliente, número da NF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="yesterday">Ontem</SelectItem>
                  <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="thisMonth">Este mês</SelectItem>
                  <SelectItem value="lastMonth">Mês passado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Mais Filtros
              </Button>
              <Button>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de E-mails</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Cliente</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Número NF</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Data Envio</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Anexos</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample data rows */}
                <tr className="border-b">
                  <td className="p-4">Empresa ABC Ltda</td>
                  <td className="p-4">NF-123456</td>
                  <td className="p-4">2024-03-20 10:30</td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      Enviado
                    </span>
                  </td>
                  <td className="p-4">2</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">XYZ Comércio</td>
                  <td className="p-4">NF-789012</td>
                  <td className="p-4">2024-03-20 09:15</td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pendente
                    </span>
                  </td>
                  <td className="p-4">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
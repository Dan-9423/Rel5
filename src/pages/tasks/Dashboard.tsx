import { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, ListTodo, List, Calendar, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeFilter = 'today' | 'week' | 'month' | 'all';

export default function TasksDashboard() {
  const { taskLists } = useTasks();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Calculate statistics
  const totalLists = taskLists.length;
  const totalTasks = taskLists.reduce((acc, list) => acc + list.tasks.length, 0);
  const completedTasks = taskLists.reduce(
    (acc, list) => acc + list.tasks.filter(task => task.completed).length,
    0
  );
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Listas Ativas
            </CardTitle>
            <List className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLists}</div>
            <p className="text-xs text-muted-foreground">
              Total de listas criadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tarefas Concluídas
            </CardTitle>
            <ListChecks className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-green-600">
              {completionRate}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tarefas Pendentes
            </CardTitle>
            <ListTodo className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-yellow-600">
              {100 - completionRate}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Tarefas
            </CardTitle>
            <Filter className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Em todas as listas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Visão Geral</CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="all">Todo o Período</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Lists Overview */}
            {taskLists.map(list => (
              <div key={list.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{list.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {list.tasks.filter(t => t.completed).length} de {list.tasks.length} concluídas
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${list.tasks.length > 0 
                        ? (list.tasks.filter(t => t.completed).length / list.tasks.length) * 100 
                        : 0}%`
                    }}
                  />
                </div>
              </div>
            ))}

            {taskLists.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma lista de tarefas criada ainda.</p>
                <Button variant="outline" className="mt-4">
                  Criar Nova Lista
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
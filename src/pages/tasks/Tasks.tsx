import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronRight, ListFilter } from 'lucide-react';
import { useTasks } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FilterType = 'all' | 'pending' | 'completed';

export default function Tasks() {
  const {
    taskLists,
    selectedList,
    addTaskList,
    editTaskList,
    deleteTaskList,
    selectList,
    addTask,
    toggleTask,
    deleteTask
  } = useTasks();

  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [showEditListDialog, setShowEditListDialog] = useState(false);
  const [showDeleteListDialog, setShowDeleteListDialog] = useState(false);
  const [listName, setListName] = useState('');
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const handleAddList = () => {
    if (listName.trim()) {
      addTaskList(listName);
      setListName('');
      setShowNewListDialog(false);
    }
  };

  const handleEditList = () => {
    if (listName.trim() && selectedList) {
      editTaskList(selectedList.id, listName);
      setListName('');
      setShowEditListDialog(false);
    }
  };

  const handleDeleteList = () => {
    if (selectedList) {
      deleteTaskList(selectedList.id);
      setShowDeleteListDialog(false);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() && selectedList) {
      addTask(selectedList.id, newTask);
      setNewTask('');
    }
  };

  const handleToggleTask = (listId: string, taskId: string) => {
    toggleTask(listId, taskId);
  };

  // Get all tasks from all lists if no list is selected, or tasks from selected list
  const getAllTasks = () => {
    if (!selectedList || selectedList.id === 'all') {
      return taskLists.flatMap(list => 
        list.tasks.map(task => ({
          ...task,
          listName: list.name,
          listId: list.id
        }))
      ).sort((a, b) => {
        // Sort by creation date (newest first)
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
        return dateB.getTime() - dateA.getTime();
      });
    }
    return selectedList.tasks.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
      return dateB.getTime() - dateA.getTime();
    });
  };

  // Filter tasks based on selected filter
  const getFilteredTasks = () => {
    const allTasks = getAllTasks();
    switch (filter) {
      case 'pending':
        return allTasks.filter(task => !task.completed);
      case 'completed':
        return allTasks.filter(task => task.completed);
      default:
        return allTasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="flex gap-6">
      {/* Task Lists Sidebar */}
      <div className="w-80 bg-white dark:bg-[#1C1C1C] rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Listas</h2>
          <Button size="sm" onClick={() => setShowNewListDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Lista
          </Button>
        </div>

        <div className="space-y-2">
          <div
            className={cn(
              "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
              !selectedList || selectedList.id === 'all'
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
            onClick={() => selectList({ id: 'all', name: 'Todas as Listas', tasks: [] })}
          >
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              <span>Todas as Listas</span>
            </div>
          </div>

          {taskLists.map(list => (
            <div
              key={list.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                selectedList?.id === list.id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
              onClick={() => selectList(list)}
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                <span>{list.name}</span>
                <span className="text-sm text-gray-400">({list.tasks.length})</span>
              </div>
              {selectedList?.id === list.id && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setListName(list.name);
                      setShowEditListDialog(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteListDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Content */}
      <div className="flex-1 bg-white dark:bg-[#1C1C1C] rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {selectedList ? selectedList.id === 'all' ? 'Todas as Listas' : selectedList.name : 'Selecione uma lista'}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Todas
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Não Concluído
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Concluídas
            </Button>
          </div>
        </div>
        
        {selectedList && selectedList.id !== 'all' && (
          <form onSubmit={handleAddTask} className="mb-6">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Adicionar nova tarefa..."
              className="w-full"
            />
          </form>
        )}

        <div className="space-y-2">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800",
                task.completed && "text-gray-400"
              )}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggleTask('listId' in task ? task.listId : selectedList?.id || '', task.id)}
                className="cursor-pointer"
              />
              <div className="flex-1">
                <span className={cn(
                  task.completed && "line-through"
                )}>
                  {task.content}
                </span>
                {'listName' in task && (
                  <span className="ml-2 text-sm text-gray-400">
                    ({task.listName})
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-auto text-red-500 hover:text-red-600"
                onClick={() => deleteTask('listId' in task ? task.listId : selectedList?.id || '', task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showNewListDialog} onOpenChange={setShowNewListDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Lista</DialogTitle>
          </DialogHeader>
          <Input
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Nome da lista..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewListDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddList}>
              Criar Lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditListDialog} onOpenChange={setShowEditListDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Lista</DialogTitle>
          </DialogHeader>
          <Input
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Nome da lista..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditListDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditList}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteListDialog} onOpenChange={setShowDeleteListDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta lista? Todas as tarefas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteList}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
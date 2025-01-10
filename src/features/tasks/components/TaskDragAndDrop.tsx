import { useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface TaskDragAndDropProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksReorder: (startIndex: number, endIndex: number) => void;
}

export function TaskDragAndDrop({
  tasks,
  onTaskToggle,
  onTaskDelete,
  onTasksReorder
}: TaskDragAndDropProps) {
  const [draggedTask, setDraggedTask] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedTask(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedTask === null) return;

    const items = [...tasks];
    const draggedItem = items[draggedTask];
    items.splice(draggedTask, 1);
    items.splice(index, 0, draggedItem);

    onTasksReorder(draggedTask, index);
    setDraggedTask(index);
  };

  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-move",
            task.completed && "text-gray-400"
          )}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onTaskToggle(task.id)}
            className="cursor-pointer"
          />
          <span className={cn(task.completed && "line-through")}>
            {task.content}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-auto text-red-500 hover:text-red-600"
            onClick={() => onTaskDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
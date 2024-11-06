import { useDraggable } from '@dnd-kit/core';
import { Todo } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DraggableTodoProps {
  todo: Todo;
  category: { color: string } | undefined;
}

export function DraggableTodo({ todo, category }: DraggableTodoProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: todo.id,
    data: todo,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'flex items-center space-x-2 p-3 rounded-lg bg-card cursor-move',
        isDragging && 'opacity-50'
      )}
    >
      <div className={`w-3 h-3 rounded-full ${category?.color}`} />
      <div className="flex-1">
        <h3 className="font-medium">{todo.title}</h3>
        {todo.description && (
          <p className="text-sm text-muted-foreground">{todo.description}</p>
        )}
      </div>
      <div
        className={cn(
          'px-2 py-1 rounded text-xs',
          todo.priority === 'high'
            ? 'bg-red-100 text-red-800'
            : todo.priority === 'medium'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        )}
      >
        {todo.priority}
      </div>
    </div>
  );
}
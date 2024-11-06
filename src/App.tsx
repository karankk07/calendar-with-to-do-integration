import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { startOfDay, addHours } from 'date-fns';
import { CategoryList } from '@/components/CategoryList';
import { TodoList } from '@/components/TodoList';
import { Calendar } from '@/components/Calendar';
import { useTodoStore } from '@/lib/store';

function App() {
  const { updateTodo } = useTodoStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id.toString().startsWith('calendar-')) {
      const [, dateStr, hourStr] = over.id.toString().split('-');
      const date = new Date(dateStr);
      const hour = parseInt(hourStr, 10);
      
      const startTime = startOfDay(date);
      startTime.setHours(hour);
      
      updateTodo(active.id.toString(), {
        scheduledTime: {
          start: startTime.toISOString(),
          end: addHours(startTime, 1).toISOString(),
        },
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold mb-8">Todo Calendar</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-8">
              <CategoryList />
            </div>
            <div>
              <TodoList />
            </div>
            <div className="md:col-span-2">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default App;
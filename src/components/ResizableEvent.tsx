import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/lib/types';
import { useTodoStore } from '@/lib/store';

interface ResizableEventProps {
  event: CalendarEvent;
}

export function ResizableEvent({ event }: ResizableEventProps) {
  const { updateTodo } = useTodoStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const eventRef = useRef<HTMLDivElement>(null);

  const startHour = event.start.getHours() + event.start.getMinutes() / 60;
  const endHour = event.end.getHours() + event.end.getMinutes() / 60;
  const duration = endHour - startHour;

  const top = `${startHour * 4}rem`;
  const height = `${duration * 4}rem`;

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!eventRef.current) return;

      const rect = eventRef.current.parentElement!.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const newHour = Math.floor(y / 64); // 4rem = 64px
      const newMinutes = Math.round((y % 64) / 64 * 60);

      if (isDragging) {
        const newStart = new Date(event.start);
        newStart.setHours(newHour, newMinutes);
        const newEnd = new Date(newStart);
        newEnd.setHours(newStart.getHours() + duration);

        updateTodo(event.id, {
          scheduledTime: {
            start: newStart.toISOString(),
            end: newEnd.toISOString(),
          },
        });
      } else if (isResizing) {
        const newEnd = new Date(event.start);
        newEnd.setHours(newHour, newMinutes);

        if (newEnd > event.start) {
          updateTodo(event.id, {
            scheduledTime: {
              start: event.start.toISOString(),
              end: newEnd.toISOString(),
            },
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, event, duration, updateTodo]);

  return (
    <div
      ref={eventRef}
      className={cn(
        'absolute left-0 right-1 rounded-md p-2 cursor-move select-none',
        event.priority === 'high'
          ? 'bg-red-100 text-red-800'
          : event.priority === 'medium'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-green-100 text-green-800'
      )}
      style={{ top, height }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setIsDragging(true);
        }
      }}
    >
      <div className="text-xs font-medium truncate">{event.title}</div>
      <div className="text-xs opacity-75">
        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
        onMouseDown={() => setIsResizing(true)}
      />
    </div>
  );
}
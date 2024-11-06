import { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, addHours, startOfDay } from 'date-fns';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/lib/types';
import { useTodoStore } from '@/lib/store';
import { ResizableEvent } from './ResizableEvent';

interface TimeSlotProps {
  date: Date;
  hour: number;
}

function TimeSlot({ date, hour }: TimeSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `calendar-${date.toISOString()}-${hour}`,
    data: { date, hour },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'h-16 border-b border-r border-border relative',
        isOver && 'bg-accent/50'
      )}
    />
  );
}

interface DayColumnProps {
  date: Date;
  events: CalendarEvent[];
}

function DayColumn({ date, events }: DayColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="relative">
      {hours.map((hour) => (
        <TimeSlot key={hour} date={date} hour={hour} />
      ))}
      {events.map((event) => (
        <ResizableEvent key={event.id} event={event} />
      ))}
    </div>
  );
}

export function Calendar() {
  const [currentDate] = useState(new Date());
  const { todos } = useTodoStore();

  const startDate = startOfWeek(currentDate);
  const calendarDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const events: CalendarEvent[] = todos
    .filter((todo) => todo.scheduledTime)
    .map((todo) => ({
      ...todo,
      start: new Date(todo.scheduledTime!.start),
      end: new Date(todo.scheduledTime!.end),
    }));

  return (
    <div className="bg-card rounded-lg p-4 overflow-auto h-[calc(100vh-12rem)]">
      <div className="grid grid-cols-8 gap-px">
        <div className="w-16">
          {/* Time labels */}
          <div className="h-10" /> {/* Header spacer */}
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="h-16 text-xs text-muted-foreground pr-2 text-right">
              {format(addHours(startOfDay(new Date()), i), 'HH:mm')}
            </div>
          ))}
        </div>
        <div className="col-span-7">
          <div className="grid grid-cols-7">
            {calendarDays.map((date) => (
              <div key={date.toISOString()} className="text-center p-2 border-b border-r border-border">
                <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                <div className="text-sm text-muted-foreground">{format(date, 'd')}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((date) => (
              <DayColumn
                key={date.toISOString()}
                date={date}
                events={events.filter((event) => isSameDay(event.start, date))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
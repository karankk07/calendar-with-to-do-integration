export type Priority = 'low' | 'medium' | 'high';
export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Todo = {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  completed: boolean;
  priority: Priority;
  scheduledTime?: {
    start: string; // ISO string
    end: string; // ISO string
  };
};

export type CalendarEvent = Todo & {
  start: Date;
  end: Date;
};
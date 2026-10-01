import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ColumnId, Task } from '../types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
}

export function Column({ id, title, tasks, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className={`column column--${id} ${isOver ? 'column--over' : ''}`}
      aria-label={title}
    >
      <header className="column__header">
        <h2>{title}</h2>
        <span className="column__count">{tasks.length}</span>
      </header>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="column__list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && <li className="column__empty">Drop tasks here</li>}
        </ul>
      </SortableContext>
    </section>
  );
}

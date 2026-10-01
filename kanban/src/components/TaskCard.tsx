import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { statusClass, type Task } from '../types';

interface TaskCardContentProps {
  task: Task;
}

/**
 * The card face — shared by the in-place sortable card and the drag overlay.
 */
export function TaskCardContent({ task }: TaskCardContentProps) {
  const { character } = task;
  return (
    <>
      <img className="card__avatar" src={character.image} alt={character.name} />
      <div className="card__body">
        <span className="card__title">{task.title}</span>
        <span className="card__meta">
          {character.name}
          <span className={`status ${statusClass(character.status)}`}>{character.status}</span>
        </span>
      </div>
    </>
  );
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={[
        'card',
        isDragging ? 'card--dragging' : '',
        task.column === 'done' ? 'card--done' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      {...attributes}
      {...listeners}
    >
      <TaskCardContent task={task} />
      <button
        type="button"
        className="card__delete"
        aria-label={`Delete "${task.title}"`}
        onClick={() => onDelete(task.id)}
      >
        ×
      </button>
    </li>
  );
}

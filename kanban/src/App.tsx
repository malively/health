import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import confetti from 'canvas-confetti';
import { fetchCharacters } from './api';
import { Column } from './components/Column';
import { NewTaskForm } from './components/NewTaskForm';
import { TaskCardContent } from './components/TaskCard';
import { COLUMNS, type Character, type ColumnId, type Task } from './types';

const CONFETTI_COLORS = ['#97ce4c', '#44c1a3', '#ff8acc', '#f9bc60', '#e89ac7'];

const SEED_TASKS: { title: string; column: ColumnId }[] = [
  { title: 'Repair the portal gun', column: 'todo' },
  { title: 'Hide from the Council of Ricks', column: 'todo' },
  { title: 'Restock dark matter fuel', column: 'todo' },
  { title: 'Freeze time for the family', column: 'doing' },
  { title: 'Help Mr. Meeseeks with a task', column: 'doing' },
  { title: 'Turn myself into a pickle', column: 'done' },
];

function celebrate() {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { x: 0.2, y: 0.6 },
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
  });
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { x: 0.8, y: 0.6 },
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
  });
  window.setTimeout(() => {
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
    });
  }, 200);
}

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const startColumnRef = useRef<ColumnId | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCharacters(3)
      .then((chars) => {
        if (cancelled) return;
        setCharacters(chars);
        // Seed a few sample tasks so the board isn't empty on arrival.
        const pool = [...chars].sort(() => Math.random() - 0.5);
        setTasks(
          SEED_TASKS.map((seed, i) => ({
            id: crypto.randomUUID(),
            title: seed.title,
            column: seed.column,
            character: pool[i % pool.length],
          })),
        );
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load characters');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => load(), [load]);

  const addTask = useCallback((title: string, character: Character) => {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, character, column: 'todo' },
    ]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragStart(e: DragStartEvent) {
    const task = tasks.find((t) => t.id === e.active.id);
    setActiveTask(task ?? null);
    startColumnRef.current = task?.column ?? null;
  }

  /**
   * Moves the dragged card across columns live while hovering, so the
   * board always shows where the card would land.
   */
  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    setTasks((prev) => {
      const activeIdx = prev.findIndex((t) => t.id === activeId);
      if (activeIdx === -1) return prev;
      const overTask = prev.find((t) => t.id === overId);
      const targetColumn = overTask
        ? overTask.column
        : COLUMNS.some((c) => c.id === overId)
          ? (overId as ColumnId)
          : null;
      // Only react to cross-column hovers; same-column order is settled on drop.
      if (!targetColumn || prev[activeIdx].column === targetColumn) return prev;

      const moved = [...prev];
      moved[activeIdx] = { ...moved[activeIdx], column: targetColumn };
      const overIdx = overTask ? prev.findIndex((t) => t.id === overTask.id) : -1;
      return overIdx === -1 ? moved : arrayMove(moved, activeIdx, overIdx);
    });
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveTask(null);
    const startColumn = startColumnRef.current;
    startColumnRef.current = null;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setTasks((prev) => {
      const activeIdx = prev.findIndex((t) => t.id === activeId);
      const overIdx = prev.findIndex((t) => t.id === overId);
      if (activeIdx === -1 || overIdx === -1 || activeIdx === overIdx) return prev;
      return arrayMove(prev, activeIdx, overIdx);
    });

    // Delight time: the card only just finished in Done.
    const finalColumn = tasks.find((t) => t.id === activeId)?.column;
    if (startColumn && startColumn !== 'done' && finalColumn === 'done') {
      celebrate();
    }
  }

  if (loading) {
    return (
      <div className="state">
        <div className="portal-spinner" aria-hidden="true" />
        <p>Portaling characters in from dimension C-137…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state state--error" role="alert">
        <p>The portal collapsed: {error}</p>
        <button type="button" onClick={load}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>The Grand Kanban of Rick &amp; Morty</h1>
        <NewTaskForm characters={characters} onAdd={addTask} />
      </header>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="board">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.column === col.id)}
              onDelete={deleteTask}
            />
          ))}
        </main>
        <DragOverlay>
          {activeTask && (
            <div className="card card--overlay">
              <TaskCardContent task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

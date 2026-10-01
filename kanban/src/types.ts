export interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
}

export type ColumnId = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  character: Character;
  column: ColumnId;
}

export const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
];

export function statusClass(status: string): string {
  if (status === 'Alive') return 'status--alive';
  if (status === 'Dead') return 'status--dead';
  return 'status--unknown';
}

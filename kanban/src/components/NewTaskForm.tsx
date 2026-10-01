import { useState, type FormEvent } from 'react';
import type { Character } from '../types';

interface NewTaskFormProps {
  characters: Character[];
  onAdd: (title: string, character: Character) => void;
}

export function NewTaskForm({ characters, onAdd }: NewTaskFormProps) {
  const [title, setTitle] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [error, setError] = useState('');

  const selected = characters.find((c) => String(c.id) === characterId);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('A task needs a title, Morty.');
      return;
    }
    if (!selected) {
      setError('Assign a character to the task.');
      return;
    }
    setError('');
    onAdd(trimmed, selected);
    setTitle('');
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        className="form__input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task… e.g. Fix the portal gun"
        aria-label="Task title"
      />
      <select
        className="form__select"
        value={characterId}
        onChange={(e) => setCharacterId(e.target.value)}
        aria-label="Assign a character"
      >
        <option value="">Assign a character…</option>
        {characters.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {selected && (
        <div className="form__preview" title={selected.name}>
          <img src={selected.image} alt={selected.name} />
        </div>
      )}
      <button type="submit" className="form__submit">
        Add to To Do
      </button>
      {error && <p className="form__error" role="alert">{error}</p>}
    </form>
  );
}

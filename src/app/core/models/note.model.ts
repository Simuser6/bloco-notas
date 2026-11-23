/** Categorias fixas oferecidas ao usuário. Os valores são estáveis (persistidos). */
export const NOTE_CATEGORIES = ['study', 'work', 'personal', 'ideas'] as const;
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export const CATEGORY_LABELS: Readonly<Record<NoteCategory, string>> = {
  study: 'Estudos',
  work: 'Trabalho',
  personal: 'Pessoal',
  ideas: 'Ideias',
};

/** Cores/etiquetas visuais da nota. */
export const NOTE_COLORS = ['default', 'yellow', 'blue', 'green', 'pink', 'purple'] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];

export const COLOR_LABELS: Readonly<Record<NoteColor, string>> = {
  default: 'Padrão',
  yellow: 'Amarelo',
  blue: 'Azul',
  green: 'Verde',
  pink: 'Rosa',
  purple: 'Roxo',
};

export const NOTE_LIMITS = { title: 80, content: 5000 } as const;

export interface Note {
  readonly id: string;
  title: string;
  content: string;
  category: NoteCategory;
  color: NoteColor;
  pinned: boolean;
  archived: boolean;
  /** Datas em ISO 8601 (serializáveis em JSON). */
  readonly createdAt: string;
  updatedAt: string;
}

/** Campos editáveis pelo usuário no formulário. */
export type NoteInput = Pick<Note, 'title' | 'content' | 'category' | 'color'>;

export type ViewMode = 'grid' | 'list';
export type NotesScope = 'active' | 'archived';
export type CategoryFilter = NoteCategory | 'all';

const includes = <T extends readonly string[]>(list: T, value: unknown): value is T[number] =>
  typeof value === 'string' && (list as readonly string[]).includes(value);

export const isNoteCategory = (v: unknown): v is NoteCategory => includes(NOTE_CATEGORIES, v);
export const isNoteColor = (v: unknown): v is NoteColor => includes(NOTE_COLORS, v);

/** Type guard usado para validar dados vindos do armazenamento (que não são confiáveis). */
export function isNote(value: unknown): value is Note {
  if (typeof value !== 'object' || value === null) return false;
  const n = value as Record<string, unknown>;
  return (
    typeof n['id'] === 'string' &&
    typeof n['title'] === 'string' &&
    typeof n['content'] === 'string' &&
    isNoteCategory(n['category']) &&
    isNoteColor(n['color']) &&
    typeof n['pinned'] === 'boolean' &&
    typeof n['archived'] === 'boolean' &&
    typeof n['createdAt'] === 'string' &&
    typeof n['updatedAt'] === 'string'
  );
}

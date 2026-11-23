import { Injectable, computed, inject, signal } from '@angular/core';
import { CategoryFilter, Note, NoteInput, NotesScope, ViewMode } from '../models/note.model';
import { NotesRepository } from '../storage/notes.repository';
import { StorageService } from '../storage/storage.service';
import { generateId } from '../../shared/utils/id';
import { normalizeText } from '../../shared/utils/text';

const VIEW_MODE_KEY = 'bloco-notas:v1:view-mode';

/**
 * Fonte única da verdade para notas e filtros da UI.
 * Estado exposto como signals somente-leitura; alterações só via métodos.
 */
@Injectable({ providedIn: 'root' })
export class NotesStore {
  private readonly repository = inject(NotesRepository);
  private readonly storage = inject(StorageService);

  private readonly _notes = signal<readonly Note[]>(this.repository.load());

  // Estado de filtros (graváveis: ligados à toolbar via two-way binding).
  readonly query = signal('');
  readonly category = signal<CategoryFilter>('all');
  readonly scope = signal<NotesScope>('active');
  readonly viewMode = signal<ViewMode>(
    this.storage.read<ViewMode>(VIEW_MODE_KEY) === 'list' ? 'list' : 'grid',
  );

  readonly notes = this._notes.asReadonly();
  readonly activeCount = computed(() => this._notes().filter((n) => !n.archived).length);
  readonly archivedCount = computed(() => this._notes().filter((n) => n.archived).length);

  /** Notas do escopo atual após busca e filtro de categoria. */
  readonly filteredNotes = computed(() => {
    const archived = this.scope() === 'archived';
    const category = this.category();
    const query = normalizeText(this.query());

    return [...this._notes()]
      .filter((n) => n.archived === archived)
      .filter((n) => category === 'all' || n.category === category)
      .filter((n) => !query || normalizeText(`${n.title} ${n.content}`).includes(query))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  });

  readonly pinnedNotes = computed(() => this.filteredNotes().filter((n) => n.pinned));
  readonly otherNotes = computed(() => this.filteredNotes().filter((n) => !n.pinned));
  readonly hasActiveFilters = computed(
    () => this.query().trim() !== '' || this.category() !== 'all',
  );

  findById(id: string): Note | undefined {
    return this._notes().find((n) => n.id === id);
  }

  add(input: NoteInput): Note {
    const now = new Date().toISOString();
    const note: Note = {
      ...input,
      id: generateId(),
      pinned: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };
    this.commit([note, ...this._notes()]);
    return note;
  }

  update(id: string, input: NoteInput): void {
    this.mutate(id, () => ({ ...input }), true);
  }

  togglePinned(id: string): void {
    this.mutate(id, (n) => ({ pinned: !n.pinned }), false);
  }

  /** Arquivar também desafixa a nota. */
  toggleArchived(id: string): void {
    this.mutate(id, (n) => ({ archived: !n.archived, pinned: false }), false);
  }

  remove(id: string): void {
    this.commit(this._notes().filter((n) => n.id !== id));
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
    this.storage.write(VIEW_MODE_KEY, mode);
  }

  clearFilters(): void {
    this.query.set('');
    this.category.set('all');
  }

  private mutate(id: string, changes: (note: Note) => Partial<Note>, touch: boolean): void {
    this.commit(
      this._notes().map((n) =>
        n.id === id
          ? { ...n, ...changes(n), ...(touch ? { updatedAt: new Date().toISOString() } : {}) }
          : n,
      ),
    );
  }

  private commit(notes: readonly Note[]): void {
    this._notes.set(notes);
    this.repository.save(notes);
  }
}

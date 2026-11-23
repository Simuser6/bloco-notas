import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NoteInput } from '../models/note.model';
import { InMemoryNotesRepository } from '../testing/in-memory-notes.repository';
import { NotesRepository } from '../storage/notes.repository';
import { BROWSER_STORAGE } from '../storage/storage.service';
import { NotesStore } from './notes.store';

const input = (over: Partial<NoteInput> = {}): NoteInput => ({
  title: 'Título',
  content: 'Conteúdo',
  category: 'study',
  color: 'default',
  ...over,
});

describe('NotesStore', () => {
  let store: NotesStore;
  let repo: InMemoryNotesRepository;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T10:00:00Z'));
    repo = new InMemoryNotesRepository();
    TestBed.configureTestingModule({
      providers: [
        { provide: NotesRepository, useValue: repo },
        { provide: BROWSER_STORAGE, useValue: null },
      ],
    });
    store = TestBed.inject(NotesStore);
  });

  afterEach(() => vi.useRealTimers());

  it('adiciona nota e persiste', () => {
    const note = store.add(input());
    expect(store.notes()).toHaveLength(1);
    expect(note.pinned).toBe(false);
    expect(repo.saved).toHaveLength(1);
  });

  it('atualiza campos e a data de modificação', () => {
    const note = store.add(input());
    vi.setSystemTime(new Date('2026-01-02T10:00:00Z'));
    store.update(note.id, input({ title: 'Novo' }));
    const updated = store.findById(note.id)!;
    expect(updated.title).toBe('Novo');
    expect(updated.createdAt).toBe(note.createdAt);
    expect(updated.updatedAt).toBe('2026-01-02T10:00:00.000Z');
  });

  it('exclui nota', () => {
    const note = store.add(input());
    store.remove(note.id);
    expect(store.notes()).toHaveLength(0);
    expect(repo.saved).toHaveLength(0);
  });

  it('fixar não altera updatedAt e separa fixadas das demais', () => {
    const a = store.add(input({ title: 'A' }));
    store.add(input({ title: 'B' }));
    store.togglePinned(a.id);
    expect(store.pinnedNotes().map((n) => n.title)).toEqual(['A']);
    expect(store.otherNotes().map((n) => n.title)).toEqual(['B']);
    expect(store.findById(a.id)!.updatedAt).toBe(a.updatedAt);
  });

  it('arquivar move a nota de escopo e remove o destaque', () => {
    const a = store.add(input());
    store.togglePinned(a.id);
    store.toggleArchived(a.id);
    expect(store.activeCount()).toBe(0);
    expect(store.archivedCount()).toBe(1);
    expect(store.findById(a.id)!.pinned).toBe(false);

    store.scope.set('archived');
    expect(store.filteredNotes()).toHaveLength(1);
  });

  it('busca por título ou conteúdo ignorando acentos e caixa', () => {
    store.add(input({ title: 'Ação do dia', content: 'x' }));
    store.add(input({ title: 'Outra', content: 'Reunião às 10h' }));
    store.query.set('acao');
    expect(store.filteredNotes().map((n) => n.title)).toEqual(['Ação do dia']);
    store.query.set('REUNIAO');
    expect(store.filteredNotes().map((n) => n.title)).toEqual(['Outra']);
  });

  it('filtra por categoria e limpa filtros', () => {
    store.add(input({ title: 'E', category: 'study' }));
    store.add(input({ title: 'T', category: 'work' }));
    store.category.set('work');
    expect(store.filteredNotes().map((n) => n.title)).toEqual(['T']);
    expect(store.hasActiveFilters()).toBe(true);
    store.clearFilters();
    expect(store.filteredNotes()).toHaveLength(2);
    expect(store.hasActiveFilters()).toBe(false);
  });

  it('ordena pela modificação mais recente', () => {
    store.add(input({ title: 'Antiga' }));
    vi.setSystemTime(new Date('2026-01-03T10:00:00Z'));
    store.add(input({ title: 'Nova' }));
    expect(store.filteredNotes().map((n) => n.title)).toEqual(['Nova', 'Antiga']);
  });
});

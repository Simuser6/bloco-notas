import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Note } from '../models/note.model';
import { LocalStorageNotesRepository, NOTES_STORAGE_KEY } from './local-storage-notes.repository';
import { BROWSER_STORAGE } from './storage.service';

const valid: Note = {
  id: '1',
  title: 't',
  content: 'c',
  category: 'work',
  color: 'blue',
  pinned: false,
  archived: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('LocalStorageNotesRepository', () => {
  let repo: LocalStorageNotesRepository;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        LocalStorageNotesRepository,
        { provide: BROWSER_STORAGE, useValue: localStorage },
      ],
    });
    repo = TestBed.inject(LocalStorageNotesRepository);
  });

  it('retorna lista vazia sem dados', () => {
    expect(repo.load()).toEqual([]);
  });

  it('salva e recarrega', () => {
    expect(repo.save([valid])).toBe(true);
    expect(repo.load()).toEqual([valid]);
  });

  it('ignora JSON corrompido', () => {
    localStorage.setItem(NOTES_STORAGE_KEY, '{quebrado');
    expect(repo.load()).toEqual([]);
  });

  it('descarta registros inválidos e mantém os válidos', () => {
    localStorage.setItem(
      NOTES_STORAGE_KEY,
      JSON.stringify([valid, { id: 2 }, null, { ...valid, color: 'neon' }]),
    );
    expect(repo.load()).toEqual([valid]);
  });

  it('retorna false quando não há storage disponível', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [LocalStorageNotesRepository, { provide: BROWSER_STORAGE, useValue: null }],
    });
    expect(TestBed.inject(LocalStorageNotesRepository).save([valid])).toBe(false);
  });
});

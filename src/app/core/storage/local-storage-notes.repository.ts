import { Injectable, inject } from '@angular/core';
import { Note, isNote } from '../models/note.model';
import { NotesRepository } from './notes.repository';
import { StorageService } from './storage.service';

export const NOTES_STORAGE_KEY = 'bloco-notas:v1:notes';

@Injectable()
export class LocalStorageNotesRepository extends NotesRepository {
  private readonly storage = inject(StorageService);

  load(): Note[] {
    const data = this.storage.read<unknown>(NOTES_STORAGE_KEY);
    // Descarta registros inválidos/corrompidos em vez de quebrar a aplicação.
    return Array.isArray(data) ? data.filter(isNote) : [];
  }

  save(notes: readonly Note[]): boolean {
    return this.storage.write(NOTES_STORAGE_KEY, notes);
  }
}

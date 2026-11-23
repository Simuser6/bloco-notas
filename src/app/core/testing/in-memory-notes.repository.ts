import { Note } from '../models/note.model';
import { NotesRepository } from '../storage/notes.repository';

/** Dublê de teste: mantém as notas em memória (usar com `useValue`). */
export class InMemoryNotesRepository extends NotesRepository {
  saved: readonly Note[];

  constructor(private readonly initial: Note[] = []) {
    super();
    this.saved = initial;
  }

  load(): Note[] {
    return [...this.initial];
  }

  save(notes: readonly Note[]): boolean {
    this.saved = notes;
    return true;
  }
}

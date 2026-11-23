import { Note } from '../models/note.model';

/**
 * Contrato de persistência das notas.
 * A store depende desta abstração; trocar LocalStorage por IndexedDB ou uma API REST
 * exige apenas uma nova implementação registrada em `app.config.ts`.
 */
export abstract class NotesRepository {
  abstract load(): Note[];
  /** @returns `false` se não foi possível persistir. */
  abstract save(notes: readonly Note[]): boolean;
}

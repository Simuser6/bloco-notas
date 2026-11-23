import { Routes } from '@angular/router';

export const NOTES_ROUTES: Routes = [
  {
    path: '',
    title: 'Minhas notas · Bloco de Notas',
    loadComponent: () => import('./pages/notes-page/notes-page').then((m) => m.NotesPage),
  },
  {
    path: 'nova',
    title: 'Nova nota · Bloco de Notas',
    loadComponent: () =>
      import('./pages/note-editor-page/note-editor-page').then((m) => m.NoteEditorPage),
  },
  {
    path: ':id/editar',
    title: 'Editar nota · Bloco de Notas',
    loadComponent: () =>
      import('./pages/note-editor-page/note-editor-page').then((m) => m.NoteEditorPage),
  },
];

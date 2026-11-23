import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'notas' },
  {
    path: 'notas',
    loadChildren: () => import('./features/notes/notes.routes').then((m) => m.NOTES_ROUTES),
  },
  { path: '**', redirectTo: 'notas' },
];

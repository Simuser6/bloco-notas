import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { LocalStorageNotesRepository } from './core/storage/local-storage-notes.repository';
import { NotesRepository } from './core/storage/notes.repository';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    // Ponto único de troca da estratégia de persistência.
    { provide: NotesRepository, useClass: LocalStorageNotesRepository },
  ],
};

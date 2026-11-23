import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryNotesRepository } from '../../../../core/testing/in-memory-notes.repository';
import { NotesRepository } from '../../../../core/storage/notes.repository';
import { BROWSER_STORAGE } from '../../../../core/storage/storage.service';
import { NotesStore } from '../../../../core/state/notes.store';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { NotesPage } from './notes-page';

describe('NotesPage', () => {
  const confirm = { confirm: vi.fn() };

  beforeEach(() => {
    confirm.confirm.mockReset();
    TestBed.configureTestingModule({
      imports: [NotesPage],
      providers: [
        provideRouter([]),
        { provide: NotesRepository, useValue: new InMemoryNotesRepository() },
        { provide: BROWSER_STORAGE, useValue: null },
        { provide: ConfirmService, useValue: confirm },
      ],
    });
  });

  it('mostra estado vazio sem notas', () => {
    const fixture = TestBed.createComponent(NotesPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('ainda não tem notas');
  });

  it('renderiza notas e exclui após confirmação', () => {
    const store = TestBed.inject(NotesStore);
    store.add({ title: 'Prova', content: 'Estudar', category: 'study', color: 'default' });
    const fixture = TestBed.createComponent(NotesPage);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('bn-note-card')).toHaveLength(1);

    const del = root.querySelector<HTMLButtonElement>('button[aria-label="Excluir nota"]')!;

    confirm.confirm.mockReturnValue(false);
    del.click();
    expect(store.notes()).toHaveLength(1);

    confirm.confirm.mockReturnValue(true);
    del.click();
    expect(store.notes()).toHaveLength(0);
  });
});

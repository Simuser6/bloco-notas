import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { NoteInput } from '../../../../core/models/note.model';
import { NoteForm } from './note-form';

describe('NoteForm', () => {
  let fixture: ComponentFixture<NoteForm>;
  let emitted: NoteInput[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NoteForm] }).compileComponents();
    fixture = TestBed.createComponent(NoteForm);
    emitted = [];
    fixture.componentInstance.saved.subscribe((v) => emitted.push(v));
    fixture.detectChanges();
  });

  const el = () => fixture.nativeElement as HTMLElement;
  const type = (selector: string, value: string) => {
    const field = el().querySelector<HTMLInputElement>(selector)!;
    field.value = value;
    field.dispatchEvent(new Event('input'));
  };

  it('não emite e mostra erros quando inválido', async () => {
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(emitted).toHaveLength(0);
    expect(el().querySelectorAll('[role="alert"]')).toHaveLength(2);
  });

  it('emite valores aparados quando válido', () => {
    type('#titulo', '  Minha nota ');
    type('#conteudo', ' texto ');
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    expect(emitted).toEqual([
      { title: 'Minha nota', content: 'texto', category: 'study', color: 'default' },
    ]);
  });
});

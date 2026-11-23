import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CATEGORY_LABELS,
  COLOR_LABELS,
  NOTE_CATEGORIES,
  NOTE_COLORS,
  NOTE_LIMITS,
  Note,
  NoteInput,
} from '../../../../core/models/note.model';

/** Formulário puro: recebe a nota inicial e emite o resultado; não conhece store nem router. */
@Component({
  selector: 'bn-note-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './note-form.html',
  styleUrl: './note-form.scss',
})
export class NoteForm implements OnInit {
  readonly initial = input<Note>();

  readonly saved = output<NoteInput>();
  readonly cancelled = output<void>();

  protected readonly limits = NOTE_LIMITS;
  protected readonly categories = NOTE_CATEGORIES.map((value) => ({
    value,
    label: CATEGORY_LABELS[value],
  }));
  protected readonly colors = NOTE_COLORS.map((value) => ({ value, label: COLOR_LABELS[value] }));

  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(NOTE_LIMITS.title)]],
    content: ['', [Validators.required, Validators.maxLength(NOTE_LIMITS.content)]],
    category: [NOTE_CATEGORIES[0] as NoteInput['category']],
    color: ['default' as NoteInput['color']],
  });

  ngOnInit(): void {
    const note = this.initial();
    if (note) {
      this.form.patchValue({
        title: note.title,
        content: note.content,
        category: note.category,
        color: note.color,
      });
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { title, content, category, color } = this.form.getRawValue();
    this.saved.emit({ title: title.trim(), content: content.trim(), category, color });
  }

  protected showError(control: 'title' | 'content'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }
}

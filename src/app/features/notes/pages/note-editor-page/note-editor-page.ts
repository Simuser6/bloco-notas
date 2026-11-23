import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NoteInput } from '../../../../core/models/note.model';
import { NotesStore } from '../../../../core/state/notes.store';
import { Icon } from '../../../../shared/ui/icon/icon';
import { NoteForm } from '../../components/note-form/note-form';

/** Serve as rotas `nova` e `:id/editar` (o `id` chega via withComponentInputBinding). */
@Component({
  selector: 'bn-note-editor-page',
  imports: [RouterLink, Icon, NoteForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './note-editor-page.html',
  styleUrl: './note-editor-page.scss',
})
export class NoteEditorPage {
  private readonly store = inject(NotesStore);
  private readonly router = inject(Router);

  readonly id = input<string>();

  protected readonly note = computed(() => {
    const id = this.id();
    return id ? this.store.findById(id) : undefined;
  });
  protected readonly isEditing = computed(() => this.id() !== undefined);
  protected readonly notFound = computed(() => this.isEditing() && !this.note());

  protected save(input: NoteInput): void {
    const id = this.id();
    if (id) {
      this.store.update(id, input);
    } else {
      this.store.add(input);
    }
    this.goBack();
  }

  protected goBack(): void {
    void this.router.navigate(['/notas']);
  }
}

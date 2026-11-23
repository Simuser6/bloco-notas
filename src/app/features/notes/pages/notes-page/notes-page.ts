import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotesStore } from '../../../../core/state/notes.store';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { Icon } from '../../../../shared/ui/icon/icon';
import { NoteList } from '../../components/note-list/note-list';
import { NotesToolbar } from '../../components/notes-toolbar/notes-toolbar';

@Component({
  selector: 'bn-notes-page',
  imports: [RouterLink, Icon, NotesToolbar, NoteList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notes-page.html',
  styleUrl: './notes-page.scss',
})
export class NotesPage {
  protected readonly store = inject(NotesStore);
  private readonly confirmService = inject(ConfirmService);

  protected remove(id: string): void {
    const note = this.store.findById(id);
    if (!note) return;
    const label = note.title || 'esta nota';
    if (this.confirmService.confirm(`Excluir "${label}"? Esta ação não pode ser desfeita.`)) {
      this.store.remove(id);
    }
  }
}

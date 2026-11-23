import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORY_LABELS, Note } from '../../../../core/models/note.model';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'bn-note-card',
  imports: [RouterLink, DatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './note-card.html',
  styleUrl: './note-card.scss',
})
export class NoteCard {
  readonly note = input.required<Note>();

  readonly pinToggle = output<string>();
  readonly archiveToggle = output<string>();
  readonly remove = output<string>();

  protected readonly categoryLabel = computed(() => CATEGORY_LABELS[this.note().category]);
}

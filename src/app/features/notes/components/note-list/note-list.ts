import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Note, ViewMode } from '../../../../core/models/note.model';
import { NoteCard } from '../note-card/note-card';

@Component({
  selector: 'bn-note-list',
  imports: [NoteCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="list" [class.list--rows]="viewMode() === 'list'">
      @for (note of notes(); track note.id) {
        <li>
          <bn-note-card
            [note]="note"
            (pinToggle)="pinToggle.emit($event)"
            (archiveToggle)="archiveToggle.emit($event)"
            (remove)="remove.emit($event)"
          />
        </li>
      }
    </ul>
  `,
  styles: `
    .list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
      gap: var(--space-4);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .list--rows {
      grid-template-columns: 1fr;
    }
    li {
      display: grid;
    }
  `,
})
export class NoteList {
  readonly notes = input.required<readonly Note[]>();
  readonly viewMode = input<ViewMode>('grid');

  readonly pinToggle = output<string>();
  readonly archiveToggle = output<string>();
  readonly remove = output<string>();
}

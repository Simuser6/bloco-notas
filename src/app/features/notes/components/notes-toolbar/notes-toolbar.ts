import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import {
  CATEGORY_LABELS,
  CategoryFilter,
  NOTE_CATEGORIES,
  NotesScope,
  ViewMode,
} from '../../../../core/models/note.model';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'bn-notes-toolbar',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notes-toolbar.html',
  styleUrl: './notes-toolbar.scss',
})
export class NotesToolbar {
  readonly query = model.required<string>();
  readonly category = model.required<CategoryFilter>();
  readonly scope = model.required<NotesScope>();
  readonly viewMode = model.required<ViewMode>();

  readonly activeCount = input(0);
  readonly archivedCount = input(0);

  protected readonly categories = NOTE_CATEGORIES.map((value) => ({
    value,
    label: CATEGORY_LABELS[value],
  }));

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onCategory(event: Event): void {
    this.category.set((event.target as HTMLSelectElement).value as CategoryFilter);
  }
}

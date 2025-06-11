import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Signal,
  Output,
  EventEmitter,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@components/common/button/button.component';

@Component({
  selector: 'app-paginator',
  imports: [FormsModule, ButtonComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  @Input({ required: true }) totalItems = 0;
  @Input() showPageSizeSelector = true;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() defaultPageSize = 10;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  private _currentPage = signal(1);
  private _pageSize = signal(this.defaultPageSize);

  currentPage = this._currentPage.asReadonly();
  pageSize = this._pageSize.asReadonly();

  totalPages: Signal<number> = computed(() => Math.ceil(this.totalItems / this._pageSize()));
  isDisabled: Signal<boolean> = computed(() => this.totalItems === 0);

  prevPage() {
    if (this._currentPage() > 1) {
      this._currentPage.update((p) => p - 1);
      this.pageChange.emit(this._currentPage());
    }
  }

  nextPage() {
    if (this._currentPage() < this.totalPages()) {
      this._currentPage.update((p) => p + 1);
      this.pageChange.emit(this._currentPage());
    }
  }

  onPageSizeChange(event: Event) {
    const newSize = +(event.target as HTMLSelectElement).value;
    this._pageSize.set(newSize);
    this._currentPage.set(1); // Reset to first page
    this.pageSizeChange.emit(newSize);
    this.pageChange.emit(1);
  }
}

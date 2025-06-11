import {
  Component,
  Input,
  signal,
  TemplateRef,
  OnInit,
  HostListener,
  Output,
  EventEmitter,
  ContentChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { PaginatorComponent } from '@components/common/paginator/paginator.component';

export interface TableColumn<T = any> {
  field: Extract<keyof T, string>;
  header: string;
  template?: TemplateRef<any> | null;
  fixed?: boolean;
  sortable?: boolean;
  visible?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'multi-select';
  filterOptions?: { label: string; value: any }[];
  placeholder?: string;
}

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, FormsModule, PaginatorComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends object> implements OnInit {
  @Input() loading: boolean = false;
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) columns: TableColumn<T>[] = [];
  @Input() actionsTemplate?: any;

  @Input() showColumnToggles = true;
  @Input() columnToggleSlot: TemplateRef<any> | null = null;
  @Input() storageKey: string | null = null;
  @Input() stickyHeader?: boolean;
  @Input() stickyColumn?: boolean;

  @Input() rowTemplate?: TemplateRef<any>;
  @Input() multiExpand: boolean = true;
  @Input() expandedRowIndices?: number[] = [];
  @Input() expandedWhen?: (row: T, index: number) => boolean;

  @Output() sortChange = new EventEmitter<{ field: string | null; direction: 'asc' | 'desc' }>();
  @Output() filterChange = new EventEmitter<Record<string, string | string[]>>();

  sortColumn = signal<string | null>(null);
  sortAsc = signal(true);

  dropdownOpen = false;
  private defaultVisibilityMap = new Map<string, boolean>();

  protected filters: Record<string, string | string[]> = {};
  private filterInput$ = new Subject<{ field: string; value: string }>();

  expandedRows = new Set<number>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.column-toggle-dropdown')) {
      this.dropdownOpen = false;
    }
  }

  @ContentChild('loading-template') loadingTemplate?: TemplateRef<any>;
  get hasLoadingSlot(): boolean {
    return !!this.loadingTemplate;
  }

  constructor() {
    this.filterInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe(({ field, value }) => {
        this.filters[field] = value;
        this.filterChange.emit({ ...this.filters });
      });
  }

  ngOnInit(): void {
    this.captureDefaultVisibility();
    this.loadColumnVisibility();
    if (this.expandedWhen) {
      this.expandedRows = new Set(
        this.data.map((row, i) => (this.expandedWhen!(row, i) ? i : -1)).filter((i) => i >= 0),
      );
    } else {
      this.expandedRows = new Set(this.expandedRowIndices);
    }
  }

  private captureDefaultVisibility() {
    this.columns.forEach((col) => {
      if (col.field) {
        this.defaultVisibilityMap.set(String(col.field), col.visible !== false);
      }
    });
  }

  private loadColumnVisibility() {
    if (!this.storageKey) return;

    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const visibilityMap = JSON.parse(stored) as Record<string, boolean>;

        for (const col of this.columns) {
          if (col.field && visibilityMap[col.field as string] !== undefined) {
            col.visible = visibilityMap[col.field as string];
          }
        }
      } catch (e) {
        console.warn('Failed to parse stored column visibility', e);
      }
    }
  }

  saveColumnVisibility() {
    if (!this.storageKey) return;

    const visibilityMap: Record<string, boolean> = {};
    for (const col of this.columns) {
      if (col.field) {
        visibilityMap[col.field as string] = col.visible !== false;
      }
    }

    localStorage.setItem(this.storageKey, JSON.stringify(visibilityMap));
  }

  resetColumnVisibility() {
    this.columns.forEach((col) => {
      if (col.field && this.defaultVisibilityMap.has(String(col.field))) {
        col.visible = this.defaultVisibilityMap.get(String(col.field))!;
      }
    });
    this.saveColumnVisibility();
  }

  get visibleColumns(): TableColumn<T>[] {
    return this.columns.filter((col) => col.visible !== false);
  }

  toggleSort(field: string) {
    if (this.sortColumn() === field) {
      this.sortAsc.set(!this.sortAsc());
    } else {
      this.sortColumn.set(field);
      this.sortAsc.set(true);
    }
    this.emitSortChange();
  }

  emitSortChange() {
    this.sortChange.emit({
      field: this.sortColumn(),
      direction: this.sortAsc() ? 'asc' : 'desc',
    });
  }

  get hasFilterableColumns(): boolean {
    return this.columns?.some((c) => c.filterable);
  }

  handleInput(event: Event, field: string): void {
    const value = (event.target as HTMLInputElement).value;
    this.filters[field] = value;
    this.filterInput$.next({ ...this.filters } as any);
  }

  handleSelectInput(event: Event, field: string, multi: boolean): void {
    if (multi) {
      const selected = Array.from((event.target as HTMLSelectElement).selectedOptions).map((option) => option.value);
      this.filters[field] = selected;
      this.filterInput$.next({ ...this.filters } as any);
    } else {
      const value = (event.target as HTMLSelectElement).value;
      this.filters[field] = value;
      this.filterInput$.next({ ...this.filters } as any);
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  showAllColumns() {
    this.columns.forEach((col) => (col.visible = true));
    this.saveColumnVisibility();
  }

  hideAllColumns() {
    this.columns.forEach((col) => (col.visible = false));
    this.saveColumnVisibility();
  }

  toggleRow(index: number): void {
    const alreadyExpanded = this.expandedRows.has(index);

    if (!this.multiExpand) {
      this.expandedRows.clear();
    }

    if (!alreadyExpanded) {
      this.expandedRows.add(index);
    } else if (this.multiExpand) {
      this.expandedRows.delete(index);
    }
  }

  getActiveFilterKeys(): string[] {
    return Object.keys(this.filters).filter((key) => {
      const val = this.filters[key];
      return val !== '' && val !== undefined && !(Array.isArray(val) && val.length === 0);
    });
  }

  hasActiveFilters(): boolean {
    return this.getActiveFilterKeys().length > 0;
  }

  isMultiSelectFilter(field: string): boolean {
    const col = this.columns.find((c) => c.field === field);
    return col?.filterType === 'multi-select';
  }

  getColumnHeader(field: string): string {
    return this.columns.find((c) => c.field === field)?.header || field;
  }

  getOptionLabel(field: string, value: any): string {
    const col = this.columns.find((c) => c.field === field);
    const opt = col?.filterOptions?.find((o) => o.value === value);
    return opt?.label ?? value;
  }

  // Helper to get filters as array (for iteration)
  getFilterArray(field: string): string[] {
    const val = this.filters[field];
    if (Array.isArray(val)) return val;
    else if (val) return [val];
    else return [];
  }

  // Remove single-value filter
  clearFilter(field: string) {
    this.filters[field] = '';
    this.filterInput$.next({ ...this.filters } as any);
  }

  // Remove one value from multi-select filter
  removeMultiSelectFilter(field: string, value: any) {
    if (!Array.isArray(this.filters[field])) return;
    this.filters[field] = (this.filters[field] as string[]).filter((v) => v !== value);
    this.filterInput$.next({ ...this.filters } as any);
  }

  // Clear all filters
  clearAllFilters() {
    this.filters = {};
    this.filterInput$.next({ ...this.filters } as any);
  }

  total = 300;

  onPageChange(page: number) {
    console.log('Go to page:', page);
  }

  onPageSizeChange(size: number) {
    console.log('Page size selected:', size);
  }
}

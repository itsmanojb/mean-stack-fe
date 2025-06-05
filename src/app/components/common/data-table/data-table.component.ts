import { Component, Input, signal, TemplateRef, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn<T = any> {
  field: Extract<keyof T, string>;
  header: string;
  fixed?: boolean;
  sortable?: boolean;
  template?: TemplateRef<any> | null;
  visible?: boolean;
}

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends object> implements OnInit {
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

  sortColumn = signal<string | null>(null);
  sortAsc = signal(true);

  dropdownOpen = false;
  private defaultVisibilityMap = new Map<string, boolean>();

  expandedRows = new Set<number>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.column-toggle-dropdown')) {
      this.dropdownOpen = false;
    }
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
}

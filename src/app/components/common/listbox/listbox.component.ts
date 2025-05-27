import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  forwardRef,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectItem {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface SearchResult {
  items: SelectItem[];
  totalCount: number;
}

@Component({
  selector: 'app-listbox',
  imports: [CommonModule, FormsModule],
  templateUrl: './listbox.component.html',
  styleUrl: './listbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListboxComponent),
      multi: true,
    },
  ],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))]),
    ]),
  ],
})
export class ListboxComponent implements ControlValueAccessor, OnChanges {
  @Input() items: SelectItem[] = [];
  @Input() totalCount: number = 0;
  @Input() multi = false;
  @Input() disabled = false;
  @Input() placeholder = 'Select';
  @Input() loading = false;
  @Input() loadingMore = false;
  @Input() error: string | null = null;
  @Input() suggestedItems: SelectItem[] = [];
  @Input() initialSelected: SelectItem[] = [];

  @Output() selectionChange = new EventEmitter<string | any[] | null>();
  @Output() searchChange = new EventEmitter<{ term: string; page: number }>();

  dropdownOpen = false;
  searchText = '';
  searchInput$ = new Subject<string>();
  pageNo = 1;

  // Holds the selected value(s) as an array of values (strings)
  selectedValues: string[] = [];
  private globalClickUnlistener?: () => void;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.globalClickUnlistener = this.renderer.listen('document', 'click', (event: Event) => {
      this.onDocumentClick(event);
    });

    this.setupSearchDebounce();
  }

  setupSearchDebounce() {
    this.searchInput$
      .pipe(
        debounceTime(500), // wait 300ms after last keystroke
        distinctUntilChanged(),
      )
      .subscribe((term) => {
        this.searchText = term;
        this.pageNo = 1;
        this.searchChange.emit({ term, page: this.pageNo });
      });
  }

  // ControlValueAccessor callbacks
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: string | string[]): void {
    if (this.multi) {
      this.selectedValues = Array.isArray(val) ? val : val ? [val] : [];
    } else {
      this.selectedValues = val ? [val as string] : [];
    }
    this.syncSelectionWithItems();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && !changes['items'].firstChange) {
      // When items change (e.g. after search), sync selection
      this.syncSelectionWithItems();
    }
    if (this.initialSelected.length) {
      this.selectedValues = [...this.initialSelected].map((item) => item.value);
    }
  }

  get selectedValueText() {
    return this.items.find((i) => i.value === this.selectedValues[0])?.label || this.selectedValues[0];
  }

  get displayItems(): SelectItem[] {
    // Show suggested items if search is empty, else show async search results
    return this.searchText.trim() === '' ? this.suggestedItems : this.items;
  }

  // Ensure selectedValues only contains values present in current items
  private syncSelectionWithItems() {
    const availableValues = this.items.map((i) => i.value);
    this.selectedValues = this.selectedValues.filter((v) => availableValues.includes(v));

    // Emit changes to notify parent/form of updated valid selections
    this.emitChanges();
  }

  toggleDropdown() {
    if (!this.disabled) this.dropdownOpen = !this.dropdownOpen;
  }

  selectItem(item: SelectItem) {
    if (item.disabled) return;

    if (this.multi) {
      const index = this.selectedValues.indexOf(item.value);
      if (index > -1) {
        this.selectedValues.splice(index, 1);
      } else {
        this.selectedValues.push(item.value);
      }
    } else {
      this.selectedValues = [item.value];
      this.dropdownOpen = false;
    }

    this.emitChanges();
  }

  clearSelection(event: MouseEvent) {
    event.stopPropagation();
    this.selectedValues = [];
    this.initialSelected = []; // clear initial mode
    this.items = [];
    this.selectionChange.emit(this.multi ? [] : null);

    // Optionally show suggestions again
    // this.pageNo = 1;
    // this.searchChange.emit({ term: '', page: this.pageNo });
  }

  emitChanges() {
    const output = this.multi ? [...this.selectedValues] : this.selectedValues[0];
    this.onChange(output);
    this.selectionChange.emit(output);
  }

  isSelected(item: SelectItem): boolean {
    return this.selectedValues.includes(item.value);
  }

  onSearchInput(value: string) {
    this.searchInput$.next(value);
  }

  searchTerm(): string {
    return this.searchText;
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const threshold = 100; // px from bottom

    const atBottom = target.scrollHeight - target.scrollTop - target.clientHeight < threshold;

    if (atBottom && !this.loading && !this.loadingMore && this.items.length < this.totalCount) {
      this.searchChange.emit({ term: this.searchText, page: this.pageNo + 1 });
    }
  }

  focusedIndex: number = -1; // -1 means nothing focused

  // Call this when dropdown opens or items change to reset focus:
  resetFocus() {
    this.focusedIndex = this.displayItems.length > 0 ? 0 : -1;
  }

  // Move focus up/down cyclically
  focusNext() {
    if (this.displayItems.length === 0) return;
    this.focusedIndex = (this.focusedIndex + 1) % this.displayItems.length;
  }

  focusPrev() {
    if (this.displayItems.length === 0) return;
    this.focusedIndex = (this.focusedIndex - 1 + this.displayItems.length) % this.displayItems.length;
  }

  onControlKeydown(event: KeyboardEvent) {
    if (this.disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.dropdownOpen) {
          this.openDropdown();
        } else {
          this.focusNext();
          this.scrollToFocused();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.dropdownOpen) {
          this.openDropdown();
        } else {
          this.focusPrev();
          this.scrollToFocused();
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.dropdownOpen) {
          this.openDropdown();
        } else if (this.focusedIndex >= 0) {
          this.selectItem(this.displayItems[this.focusedIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
    }
  }

  onSearchKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNext();
        this.scrollToFocused();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPrev();
        this.scrollToFocused();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.focusedIndex >= 0) {
          this.selectItem(this.displayItems[this.focusedIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
    }
  }

  openDropdown() {
    this.dropdownOpen = true;
    this.resetFocus();
  }

  closeDropdown() {
    this.dropdownOpen = false;
    this.focusedIndex = -1;
  }

  ngOnDestroy() {
    if (this.globalClickUnlistener) {
      this.globalClickUnlistener();
    }
  }

  onDocumentClick(event: Event) {
    if (!this.dropdownOpen) return;

    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  scrollToFocused() {
    setTimeout(() => {
      const panel = document.querySelector('.dropdown-panel');
      if (!panel) return;

      const focusedOption = panel.querySelectorAll('.option')[this.focusedIndex];
      if (focusedOption) {
        (focusedOption as HTMLElement).scrollIntoView({
          block: 'nearest',
        });
      }
    }, 0);
  }
}

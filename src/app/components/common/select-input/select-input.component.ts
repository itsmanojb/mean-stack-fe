import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  TemplateRef,
  signal,
  computed,
  effect,
  HostListener,
} from '@angular/core';
import { OverlayModule, ConnectedPosition } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

export interface SelectItem {
  label: string;
  value: any;
  group?: string;
  disabled?: boolean;
}

export interface GroupedItem {
  group: string;
  items: SelectItem[];
}

@Component({
  selector: 'app-select-input',
  imports: [FormsModule, OverlayModule, PortalModule],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
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
export class SelectComponent {
  @Input() placeholder = 'Select';
  @Input() showClearButton = false;
  @Input() filterKey = '';
  @Input() multiple = false;
  @Input() maxValuesToShow = 1;
  @Input() items: SelectItem[] = [];
  @Input() preselected: SelectItem[] = [];
  @Input({ required: false }) hideDisabled = false;

  @Output() valueChange = new EventEmitter<SelectItem[]>();
  @Output() selectionChange = new EventEmitter<SelectItem[]>();

  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<any>;
  @ViewChild('triggerButton') triggerButton!: ElementRef;

  dropdownOpen = signal(false);
  overlayPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ];

  selectedItems = signal<SelectItem[]>([]);
  searchText = signal('');

  filteredItems = computed(() => {
    const search = this.searchText().toLowerCase();
    const preselectedIds = this.normalizedPreselected.map((p) => this.getItemKey(p));

    return this.items.filter((item) => {
      const normalized = this.normalizeItem(item);
      if (this.hideDisabled && this.isItemDisabled(normalized)) {
        return false;
      }

      if (preselectedIds.includes(this.getItemKey(normalized))) return false;

      const label = normalized.label.toLowerCase();
      const valueStr = typeof normalized.value === 'string' ? normalized.value.toLowerCase() : '';
      return label.includes(search) || valueStr.includes(search);
    });
  });

  visibleEnabledItems = computed(() => this.filteredItems().filter((item) => !this.isItemDisabled(item)));

  groupedItems = computed(() => {
    const groups = new Map<string, SelectItem[]>();
    const ungrouped: SelectItem[] = [];

    for (const item of this.filteredItems()) {
      if (typeof item === 'string') {
        ungrouped.push(item);
      } else if (item.group) {
        if (!groups.has(item.group)) {
          groups.set(item.group, []);
        }
        groups.get(item.group)!.push(item);
      } else {
        ungrouped.push(item);
      }
    }

    const result: GroupedItem[] = Array.from(groups.entries()).map(([group, items]) => ({ group, items }));
    if (ungrouped.length) {
      result.push({ group: '', items: ungrouped });
    }

    return result;
  });

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.dropdownOpen()) {
      this.closeDropdown();
    }
  }

  focusedIndex = -1;

  constructor() {
    effect(() => {
      const value = this.selectedItems();
      this.valueChange.emit(value);
      this.selectionChange.emit(value);
    });
  }

  ngOnInit() {
    if (this.preselected?.length) {
      this.selectedItems.set(this.preselected);
    }
  }

  toggleDropdown() {
    if (this.dropdownOpen()) {
      setTimeout(() => this.focusFirstVisibleItem(), 0);
    }
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }

  toggleSelection(item: SelectItem) {
    const current = [...this.selectedItems()];
    const index = current.findIndex((s) => JSON.stringify(s) === JSON.stringify(item));

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      if (!this.multiple) current.length = 0;
      current.push(item);
    }

    this.selectedItems.set(current);
  }

  displayText() {
    const selected = this.selectedItems();
    if (selected.length === 0) return this.placeholder;

    const labels = selected
      .slice(0, this.maxValuesToShow)
      .map((item) => (typeof item === 'string' ? item : (item.label ?? item.value)));
    const count = selected.length > this.maxValuesToShow ? ` (+${selected.length - this.maxValuesToShow})` : '';

    return labels.join(', ') + count;
  }

  isAllSelected(): boolean {
    const selected = this.selectedItems();
    const visible = this.visibleEnabledItems();
    return visible.every((item) => selected.some((s) => this.isEqual(s, item)));
  }

  // Check if all enabled items in the group are selected
  isAllSelectedInGroup(groupItems: SelectItem[]): boolean {
    const selected = this.selectedItems();
    const enabledItems = groupItems.filter((item) => !this.isItemDisabled(item));

    return enabledItems.every((item) => selected.some((s) => this.isEqual(s, item)));
  }

  isIndeterminateInGroup(groupItems: SelectItem[]): boolean {
    const selected = this.selectedItems();
    const enabledItems = groupItems.filter((item) => !this.isItemDisabled(item));

    if (enabledItems.length === 0) return false;

    const selectedCount = enabledItems.filter((item) => selected.some((s) => this.isEqual(s, item))).length;
    return selectedCount > 0 && selectedCount < enabledItems.length;
  }

  isAllDisabledInGroup(groupItems: SelectItem[]): boolean {
    return groupItems.filter((item) => !this.isItemDisabled(item)).length === 0;
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      const remaining = this.selectedItems().filter((s) => !this.visibleEnabledItems().some((v) => this.isEqual(s, v)));
      this.selectedItems.set(remaining);
    } else {
      const combined = [
        ...this.selectedItems().filter((s) => !this.visibleEnabledItems().some((v) => this.isEqual(s, v))),
        ...this.visibleEnabledItems(),
      ];
      this.selectedItems.set(combined);
    }
  }

  // Toggle select all for a group
  toggleSelectAllInGroup(groupItems: SelectItem[]) {
    const selected = this.selectedItems();

    if (this.isAllSelectedInGroup(groupItems)) {
      // Remove group items from selection
      const remaining = selected.filter((s) => !groupItems.some((g) => this.isEqual(s, g)));
      this.selectedItems.set(remaining);
    } else {
      // Add group items to selection (avoid duplicates)
      const toAdd = groupItems.filter((g) => !selected.some((s) => this.isEqual(s, g)) && !this.isItemDisabled(g));
      this.selectedItems.set([...selected, ...toAdd]);
    }
  }

  onItemToggle(rawItem: string | SelectItem) {
    const item = this.normalizeItem(rawItem);
    if (item.disabled) return;

    const current = this.selectedItems();

    const alreadySelected = current.some((i) => this.compareItems(i, item));

    let updated: SelectItem[];

    if (alreadySelected) {
      updated = current.filter((i) => !this.compareItems(i, item));
    } else {
      updated = [...current, item];
    }

    this.selectedItems.set(updated);
    this.selectionChange.emit([item]);
    this.valueChange.emit([...updated]);
  }

  private compareItems(a: string | SelectItem, b: string | SelectItem): boolean {
    const itemA = this.normalizeItem(a);
    const itemB = this.normalizeItem(b);

    if (typeof itemA.value === 'object' && typeof itemB.value === 'object') {
      return itemA.value?.id === itemB.value?.id;
    }

    return itemA.value === itemB.value;
  }

  normalizeItem(item: string | SelectItem): SelectItem {
    return typeof item === 'string' ? { label: item, value: item } : item;
  }

  isSelected(rawItem: string | SelectItem): boolean {
    const item = this.normalizeItem(rawItem);
    return this.selectedItems().some((selected) => this.compareItems(selected, item));
  }

  isSelectItem(item: string | SelectItem): item is SelectItem {
    return typeof item !== 'string';
  }

  isEqual(a: SelectItem, b: SelectItem): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  isItemDisabled(item: string | SelectItem): boolean {
    return typeof item === 'object' && !!item.disabled;
  }

  get normalizedPreselected(): SelectItem[] {
    return this.preselected.map((p) => this.normalizeItem(p));
  }

  private getItemKey(item: SelectItem): string {
    return typeof item.value === 'object' ? item.value?.id?.toString() : item.value?.toString();
  }

  clearAllSelections() {
    this.selectedItems.set([]);
    this.valueChange.emit([]);
  }

  getFlatList(): SelectItem[] {
    return [...this.normalizedPreselected, ...this.filteredItems()];
  }

  focusFirstVisibleItem() {
    const list = this.getFlatList();
    const firstIndex = list.findIndex((item) => !item.disabled);
    this.focusedIndex = firstIndex >= 0 ? firstIndex : 0;
  }

  onKeyDown(event: KeyboardEvent) {
    const items = this.getFlatList();
    if (!items.length) return;

    switch (event.key) {
      case 'ArrowDown':
        this.focusNext(items);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.focusPrevious(items);
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        const focused = items[this.focusedIndex];
        if (focused && !focused.disabled) this.onItemToggle(focused);
        event.preventDefault();
        break;
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }

  focusNext(items: SelectItem[]) {
    let i = this.focusedIndex;
    do {
      i = (i + 1) % items.length;
    } while (items[i]?.disabled && i !== this.focusedIndex);

    this.focusedIndex = i;
    console.log('this.focusedIndex', this.focusedIndex);
    this.scrollToFocused();
  }

  focusPrevious(items: SelectItem[]) {
    let i = this.focusedIndex;
    do {
      i = (i - 1 + items.length) % items.length;
    } while (items[i]?.disabled && i !== this.focusedIndex);

    this.focusedIndex = i;
    console.log('this.focusedIndex', this.focusedIndex);
    this.scrollToFocused();
  }

  scrollToFocused() {
    const el = document.querySelector(`#dropdown-item-${this.focusedIndex}`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }
}

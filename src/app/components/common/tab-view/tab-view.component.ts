import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  Component,
  computed,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  signal,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { TabComponent } from './tab.component';

export interface TabItem {
  label: string;
  content: string;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-tab-view',
  imports: [NgTemplateOutlet, TabComponent, NgStyle, NgClass],
  templateUrl: './tab-view.component.html',
  styleUrl: './tab-view.component.scss',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))]),
    ]),
  ],
})
export class TabViewComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  @ViewChildren('tabRefs') tabRefs!: QueryList<ElementRef<HTMLElement>>;

  @Input({ required: false }) initialIndex = 0;
  @Output() tabChange = new EventEmitter<{ index: number; tab: TabComponent }>();

  private _activeIndex: WritableSignal<number> = signal(0);
  activeIndex = computed(() => this._activeIndex());

  indicatorLeft = signal(0);
  indicatorWidth = signal(0);

  constructor() {}

  ngAfterContentInit(): void {
    const index = this.initialIndex < this.tabs.length ? this.initialIndex : 0;
    this._activeIndex.set(index);

    setTimeout(() => {
      requestAnimationFrame(() => this.updateIndicator());
    }, 500);
  }

  selectTab(index: number) {
    if (!this.tabs.get(index)?.disabled && this._activeIndex() !== index) {
      this._activeIndex.set(index);
      this.updateIndicator();
      this.tabChange.emit({ index, tab: this.tabs.get(index)! });
    }
  }

  onKeyDown(event: KeyboardEvent, currentIndex: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      let nextIndex = currentIndex;

      do {
        nextIndex = (nextIndex + dir + this.tabs.length) % this.tabs.length;
      } while (this.tabs.get(nextIndex)?.disabled && nextIndex !== currentIndex);

      this.selectTab(nextIndex);
      queueMicrotask(() => {
        const list = document.querySelectorAll('.tab-list .tab-item');
        (list[nextIndex] as HTMLElement)?.focus();
      });
    }
  }

  updateIndicator() {
    const index = this._activeIndex();
    const tab = this.tabRefs.get(index);
    if (tab) {
      const el = tab.nativeElement;
      this.indicatorLeft.set(el.offsetLeft);
      this.indicatorWidth.set(el.offsetWidth);
    }
  }

  indicatorStyle() {
    return {
      left: this.indicatorLeft() + 'px',
      width: this.indicatorWidth() + 'px',
    };
  }
}

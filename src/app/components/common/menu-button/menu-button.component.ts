import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  signal,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-menu-button',
  imports: [],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss',
})
export class MenuButtonComponent {
  @Input() options: any[] = [];
  @Input() displayKey: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() horizontalAlign: 'left' | 'right' = 'left';
  @Output() optionSelected = new EventEmitter<any>();

  isOpen = signal(false);
  selected = signal<any>(null);
  highlightedIndex = signal<number>(-1);
  currentPosition = signal<'top' | 'bottom' | 'left' | 'right'>(this.position);

  @ViewChild('triggerBtn') triggerBtnRef!: ElementRef;
  @ViewChild('menu') menuRef!: ElementRef;

  constructor(
    private eRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    if (this.menuRef) {
      this.renderer.setStyle(this.menuRef.nativeElement, 'visibility', 'hidden');
    }
  }

  toggleMenu() {
    this.isOpen.update((open) => !open);
    if (this.isOpen()) {
      setTimeout(() => this.positionMenu(), 0);
      this.highlightedIndex.set(-1);
    }
  }

  selectOption(option: any) {
    this.selected.set(option);
    this.optionSelected.emit(option);
    this.isOpen.set(false);
  }

  getDisplay(option: any): string {
    return this.displayKey && option ? option[this.displayKey] : option;
  }

  positionMenu() {
    if (!this.triggerBtnRef || !this.menuRef) return;

    const trigger = this.triggerBtnRef.nativeElement;
    const menu = this.menuRef.nativeElement;

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let transformOrigin = 'top left';

    // Start with input position
    let pos = this.position;

    // Calculate candidate positions
    const fits = {
      top: triggerRect.top >= menuRect.height,
      bottom: viewportHeight - triggerRect.bottom >= menuRect.height,
      left: triggerRect.left >= menuRect.width,
      right: viewportWidth - triggerRect.right >= menuRect.width,
    };

    // Auto-flip logic:
    // If requested position does not fit, try opposite side
    if (!fits[pos]) {
      switch (pos) {
        case 'top':
          if (fits.bottom) pos = 'bottom';
          else if (fits.left) pos = 'left';
          else if (fits.right) pos = 'right';
          break;
        case 'bottom':
          if (fits.top) pos = 'top';
          else if (fits.left) pos = 'left';
          else if (fits.right) pos = 'right';
          break;
        case 'left':
          if (fits.right) pos = 'right';
          else if (fits.top) pos = 'top';
          else if (fits.bottom) pos = 'bottom';
          break;
        case 'right':
          if (fits.left) pos = 'left';
          else if (fits.top) pos = 'top';
          else if (fits.bottom) pos = 'bottom';
          break;
      }
    }

    this.currentPosition.set(pos);

    // Calculate actual styles based on final position
    let top = 0,
      left = 0;

    switch (pos) {
      case 'top':
        top = trigger.offsetTop - menu.offsetHeight;
        left =
          this.horizontalAlign === 'left'
            ? trigger.offsetLeft
            : trigger.offsetLeft + trigger.offsetWidth - menu.offsetWidth;
        transformOrigin = this.horizontalAlign === 'left' ? 'bottom left' : 'bottom right';
        break;
      case 'bottom':
        top = trigger.offsetTop + trigger.offsetHeight;
        left =
          this.horizontalAlign === 'left'
            ? trigger.offsetLeft
            : trigger.offsetLeft + trigger.offsetWidth - menu.offsetWidth;
        transformOrigin = this.horizontalAlign === 'left' ? 'top left' : 'top right';
        break;
      case 'left':
        top = trigger.offsetTop;
        left = trigger.offsetLeft - menu.offsetWidth;
        transformOrigin = 'top right';
        break;
      case 'right':
        top = trigger.offsetTop;
        left = trigger.offsetLeft + trigger.offsetWidth;
        transformOrigin = 'top left';
        break;
    }

    // Apply styles
    this.renderer.setStyle(menu, 'position', 'absolute');
    this.renderer.setStyle(menu, 'top', `${top}px`);
    this.renderer.setStyle(menu, 'left', `${left}px`);
    this.renderer.setStyle(menu, 'visibility', 'visible');
    this.renderer.setStyle(menu, 'transform-origin', transformOrigin);
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.isOpen()) {
      this.positionMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:keydown.arrowDown', ['$event'])
  onArrowDown(event: KeyboardEvent) {
    if (this.isOpen()) {
      this.highlightedIndex.update((i) => (i + 1) % this.options.length);
      event.preventDefault();
    }
  }

  @HostListener('document:keydown.arrowUp', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    if (this.isOpen()) {
      this.highlightedIndex.update((i) => (i - 1 + this.options.length) % this.options.length);
      event.preventDefault();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (this.isOpen() && this.highlightedIndex() >= 0) {
      this.selectOption(this.options[this.highlightedIndex()]);
      event.preventDefault();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape() {
    this.isOpen.set(false);
  }
}

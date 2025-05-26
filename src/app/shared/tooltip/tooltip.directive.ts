import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  HostListener,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  ComponentRef,
} from '@angular/core';
import { NgZone } from '@angular/core';
import { take } from 'rxjs/operators';
import { TooltipComponent } from './tooltip.component';

type Position = 'top' | 'bottom' | 'left' | 'right' | 'smart';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText = '';
  @Input() tooltipPosition: Position = 'top';
  @Input() tooltipDelay = 300;
  @Input() tooltipTrigger: 'hover' | 'click' = 'hover';
  @Input() tooltipTheme: 'dark' | 'light' = 'dark';

  private showTimeout: any;
  private componentRef: ComponentRef<TooltipComponent> | null = null;

  constructor(
    private el: ElementRef,
    private appRef: ApplicationRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private ngZone: NgZone,
  ) {}

  // Hover/focus events
  @HostListener('mouseenter') onMouseEnter() {
    if (this.tooltipTrigger === 'hover') {
      this.showTimeout = setTimeout(() => this.showTooltip(), this.tooltipDelay);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipTrigger === 'hover') {
      clearTimeout(this.showTimeout);
      this.hideTooltip();
    }
  }

  @HostListener('focus') onFocus() {
    if (this.tooltipTrigger === 'hover') {
      this.showTimeout = setTimeout(() => this.showTooltip(), this.tooltipDelay);
    }
  }

  @HostListener('blur') onBlur() {
    this.hideTooltip();
  }

  // Click toggle
  @HostListener('click') onClick() {
    if (this.tooltipTrigger === 'click') {
      this.componentRef ? this.hideTooltip() : this.showTooltip();
    }
  }

  // Click outside to close
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.tooltipTrigger !== 'click' || !this.componentRef || this.el.nativeElement.contains(event.target)) return;

    this.hideTooltip();
  }

  private showTooltip() {
    if (this.componentRef) return;

    const factory = this.resolver.resolveComponentFactory(TooltipComponent);
    this.componentRef = factory.create(this.injector);
    const tooltipInstance = this.componentRef.instance;

    tooltipInstance.text = this.tooltipText;
    tooltipInstance.theme = this.tooltipTheme;

    this.appRef.attachView(this.componentRef.hostView);
    document.body.appendChild(this.componentRef.location.nativeElement);

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipEl = this.componentRef.location.nativeElement;
    const tooltipRect = tooltipEl.getBoundingClientRect();
    console.log('tooltipRect', tooltipRect);

    const { top, left, pos } = this.calculatePosition(hostRect, tooltipRect);
    tooltipInstance.setPosition(top, left, pos);
  }

  private hideTooltip() {
    if (!this.componentRef) return;

    this.componentRef.instance.hide();
    setTimeout(() => {
      if (this.componentRef) {
        this.appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
        this.componentRef = null;
      }
    }, 200); // Wait for fade-out animation
  }

  private calculatePosition(host: DOMRect, tooltip: DOMRect) {
    const spacing = 20;

    const centerHorizontally = () => host.left + host.width / 2 - tooltip.width / 2 + window.scrollX;
    const centerVertically = () => host.top + host.height / 2 - tooltip.height / 2 + window.scrollY;

    console.log('window.scrollY', window.scrollY);
    console.log('tooltip.height', tooltip.height);
    console.log('host.top', host.top);
    const positions: any = {
      top: () => ({
        top: host.top - tooltip.height - spacing + window.scrollY,
        left: centerHorizontally(),
        pos: 'top',
      }),
      bottom: () => ({
        top: host.bottom + spacing + window.scrollY,
        left: centerHorizontally(),
        pos: 'bottom',
      }),
      left: () => ({
        top: centerVertically(),
        left: host.left - tooltip.width - spacing + window.scrollX,
        pos: 'left',
      }),
      right: () => ({
        top: centerVertically(),
        left: host.right + spacing + window.scrollX,
        pos: 'right',
      }),
    };

    if (this.tooltipPosition !== 'smart') {
      return positions[this.tooltipPosition]();
    }

    const tryOrder: Position[] = ['top', 'bottom', 'right', 'left'];
    for (const p of tryOrder) {
      const pos = positions[p]();
      const fits =
        pos.left >= 0 &&
        pos.left + tooltip.width <= window.innerWidth &&
        pos.top >= 0 &&
        pos.top + tooltip.height <= window.innerHeight;
      if (fits) return pos;
    }

    return positions.top(); // fallback
  }

  ngOnDestroy() {
    clearTimeout(this.showTimeout);
    this.hideTooltip();
  }
}

import { NgClass } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  imports: [NgClass],
  template: `<div class="tooltip-content" [ngClass]="[position, theme]">
    {{ text }}
    <span class="tooltip-arrow" [ngClass]="[position, theme]"></span>
  </div>`,
  styleUrl: './tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  @Input() text = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() theme: 'dark' | 'light' = 'dark';

  @HostBinding('style.top.px') top!: number;
  @HostBinding('style.left.px') left!: number;
  @HostBinding('class.visible') visible = false;

  setPosition(top: number, left: number, pos: string) {
    this.top = top;
    this.left = left;
    this.position = pos as any;

    requestAnimationFrame(() => {
      this.visible = true;
    });
  }

  hide() {
    this.visible = false;
  }
}

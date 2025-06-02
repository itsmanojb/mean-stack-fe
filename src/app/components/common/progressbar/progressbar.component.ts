import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  template: `<div
    role="progressbar"
    class="progress-bar"
    [class.striped]="striped"
    [class.indeterminate]="indeterminate"
    [attr.aria-valuemin]="indeterminate ? null : 0"
    [attr.aria-valuemax]="indeterminate ? null : 100"
    [attr.aria-valuenow]="indeterminate ? null : value"
    [attr.aria-busy]="indeterminate ? 'true' : 'false'"
  >
    @if (indeterminate) {
      <div class="indeterminate-bar"></div>
    } @else {
      <div class="progress-fill" [style.width.%]="value"></div>
    }
  </div> `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        --progress-value: 0%;
      }
    `,
  ],
})
export class ProgressbarComponent {
  @Input() indeterminate: boolean = false;
  @Input() value: number = 0;

  @Input() striped = true;

  @HostBinding('style.--progress-value')
  get progressValue(): string {
    return `${Math.min(100, Math.max(0, this.value))}%`;
  }
}

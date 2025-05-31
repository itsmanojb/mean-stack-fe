import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '@components/common/button/button.component';

@Component({
  selector: 'app-empty-block',
  imports: [ButtonComponent],
  templateUrl: './empty-block.component.html',
  styleUrl: './empty-block.component.scss',
})
export class EmptyBlockComponent {
  @Input() title?: string = 'There is nothing here';
  @Input() withIcon?: boolean = false;
  @Input() description?: string = '';
  @Input() ctaText?: string = '';
  @Output() onCallToAction = new EventEmitter<void>();

  ctaButtonClicked(): void {
    this.onCallToAction.emit();
  }
}

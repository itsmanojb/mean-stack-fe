import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [NgClass, NgIf],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input() variant?: 'solid' | 'outline' | 'ghost';
  @Input() color?: 'primary' | 'secondary' | 'default';
  @Input() size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  @Input() rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | 'left' | 'right';
  @Input() loadingText?: string;
  @Input() ariaLabel?: string;
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() activated = false;
  @Input() loading = false;
  @Input() iconOnly = false;
}

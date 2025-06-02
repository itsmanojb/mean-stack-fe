import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-heading',
  imports: [],
  templateUrl: './page-heading.component.html',
  styleUrl: './page-heading.component.scss',
})
export class PageHeadingComponent {
  @Input() title = '';
  @Input() showBackButton = false;
  @Input() subtitle?: string | undefined;
  @Output() onBack = new EventEmitter<void>();
}

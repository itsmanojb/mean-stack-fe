import { Component, Input, TemplateRef, ContentChild } from '@angular/core';

@Component({
  selector: 'app-tab',
  imports: [],
  template: ` <ng-content select="[tab-icon]"></ng-content>
    <ng-content></ng-content>`,
})
export class TabComponent {
  @Input() label!: string;
  @Input() customClass?: string;
  @Input() disabled = false;

  @ContentChild(TemplateRef) content!: TemplateRef<any>;
  @ContentChild('tabIcon', { read: TemplateRef }) iconTemplate?: TemplateRef<any>;
}

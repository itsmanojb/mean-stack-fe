import { Component, Input, TemplateRef, ContentChild, Directive, ViewChild } from '@angular/core';

@Directive({ selector: '[tabLabel]' })
export class TabLabelDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-tab',
  imports: [],
  template: `<ng-template #defaultContent><ng-content></ng-content></ng-template>`,
})
export class TabComponent {
  @Input() label?: string;
  @Input() customClass = '';
  @Input() disabled = false;

  @ContentChild(TabLabelDirective) labelTpl?: TabLabelDirective;
  @ContentChild('tabContent') userContentTpl?: TemplateRef<unknown>;
  @ViewChild('defaultContent', { static: true }) defaultTpl!: TemplateRef<unknown>;

  get contentTpl(): TemplateRef<unknown> {
    return this.userContentTpl ?? this.defaultTpl;
  }
}

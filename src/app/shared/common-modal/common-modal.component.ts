import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Type,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { trigger, state, style, animate, transition, AnimationEvent } from '@angular/animations';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-common-modal',
  imports: [NgClass, NgIf],
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss'],
  animations: [
    trigger('fadeBackdrop', [
      state('void', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('* <=> void', animate('200ms ease')),
    ]),
    trigger('slideModal', [
      state('void', style({ opacity: 0, transform: 'translate(-50%, -60%)' })),
      state('visible', style({ opacity: 1, transform: 'translate(-50%, -50%)' })),
      transition('* <=> void', animate('200ms ease')),
    ]),
  ],
})
export class CommonModalComponent implements AfterViewInit, OnDestroy {
  @Input() title = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showFooter = false;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;

  visible = false;
  animatingOut = false;
  private currentComponentRef?: ComponentRef<any>;

  private pendingComponent?: {
    component: Type<any>;
    inputs?: any;
    outputs?: any;
  };

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }

  ngAfterViewInit() {
    if (this.pendingComponent) {
      const { component, inputs, outputs } = this.pendingComponent;
      this.loadComponent(component, inputs, outputs);
      this.pendingComponent = undefined;
    }
  }
  ngOnDestroy() {
    this.destroyContent();
  }

  open<T>(component: Type<T>, inputs?: Partial<T>, outputs?: { [K in keyof T]?: (value: any) => void }) {
    this.visible = true;
    this.animatingOut = false;

    if (this.contentContainer) {
      this.loadComponent(component, inputs, outputs);
    } else {
      this.pendingComponent = { component, inputs, outputs };
    }
  }

  close() {
    this.animatingOut = true;
  }

  onAnimationDone(event: AnimationEvent) {
    if (this.animatingOut && event.toState === 'void') {
      this.visible = false;
      this.destroyContent();
      this.closed.emit();
    }
  }

  private loadComponent<T>(
    component: Type<T>,
    inputs?: Partial<T>,
    outputs?: { [K in keyof T]?: (value: any) => void },
  ) {
    this.contentContainer.clear();
    const ref = this.contentContainer.createComponent(component);

    if (inputs) Object.assign(ref.instance as any, inputs);

    if (outputs) {
      for (const key in outputs) {
        const emitter = (ref.instance as any)[key];
        if (emitter?.subscribe) {
          emitter.subscribe((value: any) => outputs[key]?.(value));
        }
      }
    }

    this.currentComponentRef = ref;
  }

  private destroyContent() {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = undefined;
    }
  }

  onConfirm() {
    this.confirmed.emit();
    this.close();
  }
}

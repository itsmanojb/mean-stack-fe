import { ApplicationRef, ComponentRef, Injectable, Type, createComponent } from '@angular/core';
import { ModalComponent } from './modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalRef?: ComponentRef<ModalComponent>;

  constructor(private appRef: ApplicationRef) {}

  open<T>(
    component: Type<T>,
    inputs?: Partial<T>,
    outputs?: { [K in keyof T]?: (value: any) => void },
    modalOptions?: {
      title?: string;
      size?: 'small' | 'medium' | 'large';
      showFooter?: boolean;
    },
  ) {
    if (this.modalRef) return; // prevent duplicate modals

    this.modalRef = createComponent(ModalComponent, {
      environmentInjector: this.appRef.injector,
    });

    const instance = this.modalRef.instance;
    instance.title = modalOptions?.title ?? '';
    instance.size = modalOptions?.size ?? 'medium';
    instance.showFooter = modalOptions?.showFooter ?? false;

    this.appRef.attachView(this.modalRef.hostView);
    document.body.appendChild(this.modalRef.location.nativeElement);

    instance.closed.subscribe(() => this.close());

    instance.open(component, inputs, outputs);
  }

  close() {
    if (this.modalRef) {
      this.appRef.detachView(this.modalRef.hostView);
      this.modalRef.destroy();
      this.modalRef = undefined;
    }
  }
}

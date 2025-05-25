import { Injectable, ApplicationRef, ComponentRef, inject, EnvironmentInjector, createComponent } from '@angular/core';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private dialogRef?: ComponentRef<ConfirmDialogComponent>;
  private envInjector = inject(EnvironmentInjector);
  private appRef = inject(ApplicationRef);

  confirm(message: string, title = 'Confirm'): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.dialogRef) {
        this.close();
      }

      const component = createComponent(ConfirmDialogComponent, {
        environmentInjector: this.envInjector,
      });
      this.dialogRef = component;

      component.instance.message = message;
      component.instance.title = title;

      component.instance.confirm.subscribe(() => {
        resolve(true);
        this.close();
      });

      component.instance.cancel.subscribe(() => {
        resolve(false);
        this.close();
      });

      component.instance.closed.subscribe(() => {
        this.appRef.detachView(component.hostView);
        component.destroy();
        this.dialogRef = undefined;
      });

      this.appRef.attachView(component.hostView);
      document.body.appendChild(component.location.nativeElement);
    });
  }

  private close() {
    if (this.dialogRef) {
      this.appRef.detachView(this.dialogRef.hostView);
      this.dialogRef.destroy();
      this.dialogRef = undefined;
    }
  }
}

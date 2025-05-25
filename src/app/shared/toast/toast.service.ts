import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  autoDismiss: boolean;
  duration: number;
  position: ToastPosition;
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private idCounter = 0;

  toasts$ = this.toastsSubject.asObservable();

  private maxStack = 3;

  constructor() {}

  show(message: string, type: ToastType = 'default', options?: Partial<Toast>) {
    if (this.isDuplicate(message)) return;

    if (this.toasts.length >= this.maxStack) {
      this.toasts.shift();
    }

    const toast: Toast = {
      id: ++this.idCounter,
      type,
      message,
      autoDismiss: options?.autoDismiss ?? true,
      duration: options?.duration ?? 3000,
      position: options?.position ?? 'top-center',
    };

    this.toasts.push(toast);
    this.toastsSubject.next([...this.toasts]);

    return toast.id;
  }

  success(msg: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) {
    return this.show(msg, 'success', options);
  }
  error(msg: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) {
    return this.show(msg, 'error', options);
  }
  info(msg: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) {
    return this.show(msg, 'info', options);
  }
  warning(msg: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) {
    return this.show(msg, 'warning', options);
  }
  default(msg: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) {
    return this.show(msg, 'default', options);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }

  clearAll() {
    this.toasts = [];
    this.toastsSubject.next([]);
  }

  private isDuplicate(message: string) {
    return this.toasts.some((t) => t.message === message);
  }
}

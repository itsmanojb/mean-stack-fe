import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-confirm-dialog',
  imports: [NgIf],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  animations: [
    trigger('fadeScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))]),
    ]),
  ],
})
export class ConfirmDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLElement>;

  @Input() message = '';
  @Input() title = 'Confirm';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isVisible = true;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // Focus first focusable element after dialog loads
    setTimeout(() => this.trapFocus());
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    event.preventDefault();
    this.onCancel();
  }

  @HostListener('click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const dialog = this.host.nativeElement.querySelector('.dialog');
    if (dialog && !dialog.contains(event.target as Node)) {
      this.onCancel();
    }
  }

  onConfirm() {
    this.startClose(() => this.confirm.emit());
  }

  onCancel() {
    this.startClose(() => this.cancel.emit());
  }

  startClose(callback: () => void) {
    this.isVisible = false; // trigger :leave animation
    setTimeout(() => {
      callback();
      this.closed.emit(); // notify parent to destroy
    }, 200); // match the leave animation duration
  }

  private trapFocus() {
    const dialog = this.dialogRef.nativeElement;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first.focus();

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    dialog.addEventListener('keydown', handleKeydown);

    this.cleanupFn = () => dialog.removeEventListener('keydown', handleKeydown);
  }

  private cleanupFn: (() => void) | null = null;

  ngOnDestroy(): void {
    this.cleanupFn?.();
  }
}

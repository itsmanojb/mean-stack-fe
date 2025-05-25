import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ToastService, Toast } from './toast.service';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { trigger, transition, style, animate, AnimationTriggerMetadata } from '@angular/animations';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toastAnimation', [
      transition(
        ':enter',
        [
          style({ opacity: 0, transform: '{{enterTransform}}' }),
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0) translateY(0)' })),
        ],
        { params: { enterTransform: 'translateY(20px)' } },
      ),

      transition(':leave', [animate('300ms ease-in', style({ opacity: 0, transform: '{{leaveTransform}}' }))], {
        params: { leaveTransform: 'translateY(20px)' },
      }),
    ]),
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  toastGroups: { [pos: string]: Toast[] } = {};
  private timers = new Map<number, Subscription>();
  private sub = new Subscription();

  constructor(
    public toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.sub = this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
      this.toastGroups = this.groupToastsByPosition(toasts);
      this.handleTimers();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.timers.forEach((t) => t.unsubscribe());
    this.sub.unsubscribe();
  }

  remove(id: number) {
    this.toastService.remove(id);
    this.timers.get(id)?.unsubscribe();
    this.timers.delete(id);
    this.cdr.markForCheck();
  }

  getAnimationTrigger(position: string) {
    if (position === 'top-left' || position === 'bottom-left') {
      return { value: '', params: { enterTransform: 'translateX(-100%)', leaveTransform: 'translateX(-100%)' } };
    }
    if (position === 'top-right' || position === 'bottom-right') {
      return { value: '', params: { enterTransform: 'translateX(100%)', leaveTransform: 'translateX(100%)' } };
    }
    if (position === 'top-center') {
      return { value: '', params: { enterTransform: 'translateY(-20px)', leaveTransform: 'translateY(-20px)' } };
    }
    if (position === 'bottom-center') {
      return { value: '', params: { enterTransform: 'translateY(20px)', leaveTransform: 'translateY(20px)' } };
    }
    return { value: '', params: { enterTransform: 'translateY(20px)', leaveTransform: 'translateY(20px)' } }; // default
  }

  private handleTimers() {
    this.toasts.forEach((toast) => {
      if (toast.autoDismiss && !this.timers.has(toast.id)) {
        const sub = timer(toast.duration).subscribe(() => this.remove(toast.id));
        this.timers.set(toast.id, sub);
      }
    });
  }

  private groupToastsByPosition(toasts: Toast[]) {
    return toasts.reduce(
      (groups, toast) => {
        if (!groups[toast.position]) groups[toast.position] = [];
        groups[toast.position].push(toast);
        return groups;
      },
      {} as { [pos: string]: Toast[] },
    );
  }
}

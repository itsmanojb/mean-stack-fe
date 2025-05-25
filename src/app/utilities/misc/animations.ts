import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const staggerAnimation = trigger('staggerAnimation', [
  transition(':enter', [
    query(':self, :enter', [
      style({ opacity: 0, transform: 'translateY(-10px)' }),
      stagger(100, [
        animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ]),
]);

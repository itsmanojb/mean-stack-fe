import { ApplicationConfig } from '@angular/core';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, TitleStrategy, withViewTransitions } from '@angular/router';
import { PageTitleStrategy } from '@app/utilities/misc/page-title';

import { routes } from './app.routes';

const disableAnimations: boolean = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    !disableAnimations ? provideAnimations() : provideNoopAnimations(),
  ],
};

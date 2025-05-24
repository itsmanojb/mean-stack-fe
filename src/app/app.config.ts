import { ApplicationConfig } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { PageTitleStrategy } from '@utils/misc/page-title.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
  ],
};

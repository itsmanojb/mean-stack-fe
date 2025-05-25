import { Routes } from '@angular/router';
import {
  LoginComponent,
  DashboardComponent,
  ProjectHomeComponent,
  PageNotFoundComponent,
} from '@pages/index';
import { sessionGuard, authenticationGuard } from '@utils/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Login',
    canActivate: [sessionGuard],
    component: LoginComponent,
  },
  {
    path: 'app',
    title: 'Dashboard',
    canActivate: [authenticationGuard],
    component: DashboardComponent,
  },
  {
    path: 'project/:id',
    canActivate: [authenticationGuard],
    component: ProjectHomeComponent,
    children: [
      {
        path: 'overview',
        title: 'Project Overview',
        loadComponent: () =>
          import(
            '@components/pages/projects/project-overview/project-overview.component'
          ).then((c) => c.ProjectOverviewComponent),
      },
      {
        path: 'analytics',
        title: 'Project Analytics',
        loadComponent: () =>
          import(
            '@components/pages/projects/project-analytics/project-analytics.component'
          ).then((c) => c.ProjectAnalyticsComponent),
      },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

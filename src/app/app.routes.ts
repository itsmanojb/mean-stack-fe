import { Routes } from '@angular/router';
import { LoginComponent, DashboardComponent, PageNotFoundComponent } from '@pages/index';
import { ProjectHomeComponent } from '@pages/projects/project-home/project-home.component';
import { authenticationGuard } from '@utils/guards/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Login',
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

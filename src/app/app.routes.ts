import { Routes } from '@angular/router';
import { LoginComponent, DashboardComponent, ProjectLayoutComponent, PageNotFoundComponent } from '@app/pages/index';
import { sessionGuard, authenticationGuard } from '@utils/guards';
import { ProjectRoutesEnum, ProjectRouteNamesEnum } from '@shared/constants';

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
    component: ProjectLayoutComponent,
    children: [
      {
        path: ProjectRoutesEnum.OVERVIEW,
        title: ProjectRouteNamesEnum.OVERVIEW,
        loadComponent: () =>
          import('@app/pages/projects/project-overview/project-overview.component').then(
            (c) => c.ProjectOverviewComponent,
          ),
      },
      {
        path: ProjectRoutesEnum.JOBS,
        title: ProjectRouteNamesEnum.JOBS,
        loadComponent: () =>
          import('@app/pages/projects/jobs-library/jobs-library.component').then((c) => c.JobsLibraryComponent),
      },
      {
        path: ProjectRoutesEnum.TASKS,
        title: ProjectRouteNamesEnum.TASKS,
        loadComponent: () =>
          import('@app/pages/projects/tasks-library/tasks-library.component').then((c) => c.TasksLibraryComponent),
      },
      {
        path: ProjectRoutesEnum.UPLOAD,
        title: ProjectRouteNamesEnum.UPLOAD,
        loadComponent: () =>
          import('@app/pages/projects/bulk-upload/bulk-upload.component').then((c) => c.BulkUploadComponent),
      },
      {
        path: ProjectRoutesEnum.BUILDER,
        title: ProjectRouteNamesEnum.BUILDER,
        loadComponent: () =>
          import('@app/pages/projects/job-builder/job-builder.component').then((c) => c.JobBuilderComponent),
      },
      {
        path: ProjectRoutesEnum.ANALYSIS,
        title: ProjectRouteNamesEnum.ANALYSIS,
        loadComponent: () =>
          import('@app/pages/projects/project-analytics/project-analytics.component').then(
            (c) => c.ProjectAnalyticsComponent,
          ),
      },
      { path: '**', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

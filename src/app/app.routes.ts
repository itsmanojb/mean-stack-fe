import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { LoginComponent, DashboardComponent, ProjectLayoutComponent, PageNotFoundComponent } from '@app/pages/index';
import { sessionGuard, authenticationGuard } from '@utils/guards';
import { ProjectRoutesEnum, ProjectRouteNamesEnum } from '@shared/constants';
import { ProjectResolver } from '@utils/resolvers/project.resolver';

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
    data: { breadcrumb: 'Home' },
    component: DashboardComponent,
  },
  {
    path: 'project/:id',
    canActivate: [authenticationGuard],
    component: ProjectLayoutComponent,
    resolve: { project: ProjectResolver },
    data: {
      breadcrumb: (route: ActivatedRouteSnapshot) =>
        route.data['project']?.projectName || `Project ${route.paramMap.get('id')}`,
    },
    children: [
      {
        path: ProjectRoutesEnum.OVERVIEW,
        title: ProjectRouteNamesEnum.OVERVIEW,
        data: { breadcrumb: ProjectRouteNamesEnum.OVERVIEW },
        loadComponent: () =>
          import('@app/pages/projects/project-overview/project-overview.component').then(
            (c) => c.ProjectOverviewComponent,
          ),
      },
      {
        path: ProjectRoutesEnum.JOBS,
        title: ProjectRouteNamesEnum.JOBS,
        data: { breadcrumb: ProjectRouteNamesEnum.JOBS },
        loadComponent: () =>
          import('@app/pages/projects/jobs-library/jobs-library.component').then((c) => c.JobsLibraryComponent),
      },
      {
        path: ProjectRoutesEnum.TASKS,
        title: ProjectRouteNamesEnum.TASKS,
        data: { breadcrumb: ProjectRouteNamesEnum.TASKS },
        loadComponent: () =>
          import('@app/pages/projects/tasks-library/tasks-library.component').then((c) => c.TasksLibraryComponent),
      },
      {
        path: ProjectRoutesEnum.UPLOAD,
        title: ProjectRouteNamesEnum.UPLOAD,
        data: { breadcrumb: ProjectRouteNamesEnum.UPLOAD },
        loadComponent: () =>
          import('@app/pages/projects/bulk-upload/bulk-upload.component').then((c) => c.BulkUploadComponent),
      },
      {
        path: ProjectRoutesEnum.BUILDER,
        title: ProjectRouteNamesEnum.BUILDER,
        data: { breadcrumb: ProjectRouteNamesEnum.BUILDER },
        loadComponent: () =>
          import('@app/pages/projects/job-builder/job-builder.component').then((c) => c.JobBuilderComponent),
      },
      {
        path: ProjectRoutesEnum.ANALYSIS,
        title: ProjectRouteNamesEnum.ANALYSIS,
        data: { breadcrumb: ProjectRouteNamesEnum.ANALYSIS },
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

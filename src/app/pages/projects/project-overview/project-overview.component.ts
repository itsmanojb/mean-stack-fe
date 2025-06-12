import { Component } from '@angular/core';
import {
  ProjectStatsComponent,
  ProjectTrendsComponent,
  ProjectOpportunitiesComponent,
} from '@components/features/project-overview';
import { ButtonComponent } from '@components/common/button/button.component';
import { PageHeadingComponent } from '@components/features/page-heading/page-heading.component';

@Component({
  selector: 'app-project-overview',
  imports: [
    PageHeadingComponent,
    ButtonComponent,
    ProjectStatsComponent,
    ProjectTrendsComponent,
    ProjectOpportunitiesComponent,
  ],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss',
})
export class ProjectOverviewComponent {}

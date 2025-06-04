import { Component } from '@angular/core';
import { ButtonComponent } from '@components/common/button/button.component';
import { PageHeadingComponent } from '@components/features/page-heading/page-heading.component';

@Component({
  selector: 'app-project-analytics',
  imports: [PageHeadingComponent, ButtonComponent],
  templateUrl: './project-analytics.component.html',
  styleUrl: './project-analytics.component.scss',
})
export class ProjectAnalyticsComponent {}

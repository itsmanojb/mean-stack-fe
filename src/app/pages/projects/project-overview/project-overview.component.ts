import { Component } from '@angular/core';
import { ButtonComponent } from '@components/common/button/button.component';
import { PageHeadingComponent } from '@components/features/page-heading/page-heading.component';

@Component({
  selector: 'app-project-overview',
  imports: [PageHeadingComponent, ButtonComponent],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss',
})
export class ProjectOverviewComponent {}

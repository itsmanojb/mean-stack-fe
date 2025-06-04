import { Component } from '@angular/core';
import { ButtonComponent } from '@components/common/button/button.component';
import { PageHeadingComponent } from '@components/features/page-heading/page-heading.component';

@Component({
  selector: 'app-job-builder',
  imports: [PageHeadingComponent, ButtonComponent],
  templateUrl: './job-builder.component.html',
  styleUrl: './job-builder.component.scss',
})
export class JobBuilderComponent {}

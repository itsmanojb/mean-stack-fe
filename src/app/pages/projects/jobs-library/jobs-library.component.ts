import { Component } from '@angular/core';
import { ButtonComponent } from '@components/common/button/button.component';
import { PageHeadingComponent } from '@components/features/page-heading/page-heading.component';

@Component({
  selector: 'app-jobs-library',
  imports: [PageHeadingComponent, ButtonComponent],
  templateUrl: './jobs-library.component.html',
  styleUrl: './jobs-library.component.scss',
})
export class JobsLibraryComponent {}

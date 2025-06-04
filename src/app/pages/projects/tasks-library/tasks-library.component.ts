import { Component } from '@angular/core';
import { ButtonComponent } from '@components/common/button/button.component';
import { PageHeadingComponent } from '@components/features/page-heading/page-heading.component';

@Component({
  selector: 'app-tasks-library',
  imports: [PageHeadingComponent, ButtonComponent],
  templateUrl: './tasks-library.component.html',
  styleUrl: './tasks-library.component.scss',
})
export class TasksLibraryComponent {}

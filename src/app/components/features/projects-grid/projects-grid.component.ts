import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@interfaces/project.interface';
import { AvatarsGroupComponent } from '@components/features/avatars-group/avatars-group.component';
import { staggerAnimation } from '@utils/misc/animations';

@Component({
  selector: 'app-projects-grid',
  imports: [RouterLink, AvatarsGroupComponent],
  templateUrl: './projects-grid.component.html',
  styleUrl: './projects-grid.component.scss',
  animations: [staggerAnimation],
})
export class ProjectsGridComponent {
  loading = input<boolean>(false);
  projects = input<Project[]>([], { alias: 'items' });
}

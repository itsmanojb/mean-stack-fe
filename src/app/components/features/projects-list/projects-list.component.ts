import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@interfaces/project.interface';
import { AvatarsGroupComponent } from '@components/features/avatars-group/avatars-group.component';
import { staggerAnimation } from '@utils/misc/animations';

@Component({
  selector: 'app-projects-list',
  imports: [RouterLink, AvatarsGroupComponent],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
  animations: [staggerAnimation],
})
export class ProjectsListComponent {
  loading = input<boolean>(false);
  projects = input<Project[]>([], { alias: 'items' });
}

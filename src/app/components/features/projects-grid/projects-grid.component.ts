import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@interfaces/project.interface';
import { AvatarsGroupComponent } from '@components/features/avatars-group/avatars-group.component';
import { staggerAnimation } from '@utils/misc/animations';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';

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

  confirmService = inject(ConfirmDialogService);

  async deleteProject(project: Project) {
    const confirmed = await this.confirmService.confirm(`Are you sure you want to delete ${project.projectName}?`);
    if (confirmed) {
      // proceed with delete
    } else {
      // cancelled
    }
  }
}

import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@interfaces/project.interface';
import { AvatarsGroupComponent } from '@components/features/avatars-group/avatars-group.component';
import { staggerAnimation } from '@utils/misc/animations';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { DropdownMenuComponent } from '@components/common/dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-projects-grid',
  imports: [RouterLink, AvatarsGroupComponent, DropdownMenuComponent],
  templateUrl: './projects-grid.component.html',
  styleUrl: './projects-grid.component.scss',
  animations: [staggerAnimation],
})
export class ProjectsGridComponent {
  loading = input<boolean>(false);
  projects = input<Project[]>([], { alias: 'items' });

  confirmService = inject(ConfirmDialogService);

  options = [
    { id: 1, name: 'Mango' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Apple' },
  ];

  onOptionSelected(opt: any) {
    this.deleteProject('test');
  }

  async deleteProject(project: string) {
    const confirmed = await this.confirmService.confirm(`Are you sure you want to delete ${project}?`);
    if (confirmed) {
      // proceed with delete
    } else {
      // cancelled
    }
  }
}

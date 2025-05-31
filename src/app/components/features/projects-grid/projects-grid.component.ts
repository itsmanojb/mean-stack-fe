import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@interfaces/project.interface';
import { AvatarsGroupComponent } from '@components/features/avatars-group/avatars-group.component';
import { staggerAnimation } from '@utils/misc/animations';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { CommonModalService } from '@shared/common-modal/common-modal.service';
import { MenuButtonComponent } from '@components/common/menu-button/menu-button.component';
import { EmptyBlockComponent } from '@components/features/empty-block/empty-block.component';
import { ProjectFormComponent } from '@components/features/project-form/project-form.component';

@Component({
  selector: 'app-projects-grid',
  imports: [RouterLink, AvatarsGroupComponent, MenuButtonComponent, EmptyBlockComponent],
  templateUrl: './projects-grid.component.html',
  styleUrl: './projects-grid.component.scss',
  animations: [staggerAnimation],
})
export class ProjectsGridComponent {
  loading = input<boolean>(false);
  projects = input<Project[]>([], { alias: 'items' });

  private confirmService = inject(ConfirmDialogService);
  private modalService = inject(CommonModalService);

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

  openProjectModal() {
    console.log('openProjectModal');
    this.modalService.open(
      ProjectFormComponent,
      { name: 'Manoj' },
      {
        submitted: (value) => {
          console.log('Submitted:', value);
        },
      },
      {
        title: 'User Form',
        size: 'small',
        showFooter: false,
      },
    );
  }
}

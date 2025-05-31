import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@interfaces/project.interface';
import { AvatarsGroupComponent } from '@components/features/avatars-group/avatars-group.component';
import { MenuButtonComponent } from '@components/common/menu-button/menu-button.component';
import { EmptyBlockComponent } from '@components/features/empty-block/empty-block.component';
import { staggerAnimation } from '@utils/misc/animations';

@Component({
  selector: 'app-projects-list',
  imports: [RouterLink, AvatarsGroupComponent, MenuButtonComponent, EmptyBlockComponent],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
  animations: [staggerAnimation],
})
export class ProjectsListComponent {
  loading = input<boolean>(false);
  projects = input<Project[]>([], { alias: 'items' });

  options = [
    { id: 1, name: 'Mango' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Apple' },
  ];

  onOptionSelected(opt: any) {
    console.log('opt', opt);
  }
}

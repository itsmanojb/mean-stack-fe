import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { MenuButtonComponent } from '@components/common/menu-button/menu-button.component';

type MenuOption = {
  id: number;
  label: string;
  act: 'profile' | 'settings' | 'logout';
};

@Component({
  selector: 'app-top-navbar',
  imports: [MenuButtonComponent, RouterLink],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss',
})
export class TopNavbarComponent {
  private confirmService = inject(ConfirmDialogService);
  accountOptions: MenuOption[] = [
    {
      id: 1,
      label: 'My Profile',
      act: 'profile',
    },
    {
      id: 2,
      label: 'Settings',
      act: 'settings',
    },
    {
      id: 3,
      label: 'Logout',
      act: 'logout',
    },
  ];

  onOptionSelected(e: MenuOption) {
    switch (e.act) {
      case 'logout':
        this.confirmLogOut();
        break;

      default:
        break;
    }
    console.log('e', e);
  }

  async confirmLogOut() {
    const confirmed = await this.confirmService.confirm(`Are you sure you want to logout?`);
    if (confirmed) {
      // proceed with delete
    } else {
      // cancelled
    }
  }
}

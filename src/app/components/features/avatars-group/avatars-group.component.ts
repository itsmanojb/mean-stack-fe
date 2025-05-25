import { Component, computed, input } from '@angular/core';
import { getInitials } from '@app/utilities/misc/helper';
import { User } from '@interfaces/project.interface';

@Component({
  selector: 'app-avatars-group',
  imports: [],
  templateUrl: './avatars-group.component.html',
  styleUrl: './avatars-group.component.scss',
})
export class AvatarsGroupComponent {
  aligned = input<'start' | 'end'>('start');
  maxItems = input<number>(2);
  users = input.required<User[]>({ alias: 'items' });

  initials = computed(() => {
    const _users =
      this.users().length > this.maxItems()
        ? this.users().slice(0, this.maxItems())
        : this.users();
    const remainingCount = this.users().length - _users.length;
    const _initials = _users.map((u) => getInitials(u.name));
    if (remainingCount > 0) {
      _initials.push(`+${remainingCount}`);
    }
    return _initials;
  });
}

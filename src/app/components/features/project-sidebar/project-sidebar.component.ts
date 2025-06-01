import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-project-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './project-sidebar.component.html',
  styleUrl: './project-sidebar.component.scss',
  animations: [
    trigger('slideSidebar', [
      state('expanded', style({ transform: 'translateX(0)' })),
      state('collapsed', style({ transform: 'translateX(-100%)' })),
      transition('collapsed <=> expanded', animate('100ms ease-in-out')),
    ]),
  ],
})
export class ProjectSidebarComponent {
  @Input() projectId: string | null = null;
  @Input() fixedHeader = false;
  @Input() fixedFooter = false;
  @Input() isCollapsed = false;
  @Input() isMobile = false;
  @Output() onBackdrop = new EventEmitter<void>();

  get sidebarState() {
    return this.isCollapsed ? 'collapsed' : 'expanded';
  }
}

import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProjectSidebarComponent } from '@components/features/project-sidebar/project-sidebar.component';
import { TopNavbarComponent } from '@components/common/top-navbar/top-navbar.component';

@Component({
  selector: 'app-project-home',
  imports: [RouterModule, CommonModule, TopNavbarComponent, ProjectSidebarComponent],
  templateUrl: './project-layout.component.html',
  animations: [
    trigger('slideSidebar', [
      state('expanded', style({ transform: 'translateX(0)' })),
      state('collapsed', style({ transform: 'translateX(-100%)' })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ProjectLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  isMobile = false;

  projectId: string | null = null;
  private readonly route = inject(ActivatedRoute);

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
    if (this.isMobile) {
      this.isSidebarCollapsed = true;
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = params.get('id');
    });
    this.checkScreenSize();
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      this.isSidebarCollapsed = saved === 'true';
    } else if (this.isMobile) {
      this.isSidebarCollapsed = true;
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  get sidebarState() {
    return this.isSidebarCollapsed ? 'collapsed' : 'expanded';
  }

  get mainClasses() {
    return {
      collapsed: this.isSidebarCollapsed,
    };
  }
}

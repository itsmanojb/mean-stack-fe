import { Component } from '@angular/core';
import { TabViewComponent, TabComponent, TabLabelDirective } from '@components/common/tab-view';
import { ButtonComponent } from '@components/common/button/button.component';
import { PageHeadingComponent } from '@components/features/page-heading/page-heading.component';

@Component({
  selector: 'app-project-analytics',
  imports: [PageHeadingComponent, ButtonComponent, TabViewComponent, TabComponent, TabLabelDirective],
  templateUrl: './project-analytics.component.html',
  styleUrl: './project-analytics.component.scss',
})
export class ProjectAnalyticsComponent {
  initialIndex = 0;

  onTabChange(tab: any) {
    console.log('Active tab:', tab);
    // You can perform other logic here
  }
}

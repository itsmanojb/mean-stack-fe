import { Component } from '@angular/core';

@Component({
  selector: 'app-project-opportunities',
  imports: [],
  templateUrl: './project-opportunities.component.html',
  styleUrl: './project-opportunities.component.scss',
})
export class ProjectOpportunitiesComponent {
  placeholderData = [
    [10, 30, 40, 20, 0],
    [25, 25, 10, 15, 25],
    [10, 10, 0, 30, 50],
    [50, 5, 10, 0, 35],
    [30, 0, 45, 0, 25],
    [10, 10, 15, 40, 25],
    [5, 5, 60, 10, 20],
  ];

  loading = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 5500);
  }
}

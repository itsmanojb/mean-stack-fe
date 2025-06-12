import { Component } from '@angular/core';

@Component({
  selector: 'app-project-stats',
  imports: [],
  templateUrl: './project-stats.component.html',
  styleUrl: './project-stats.component.scss',
})
export class ProjectStatsComponent {
  loading = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 2500);
  }
}

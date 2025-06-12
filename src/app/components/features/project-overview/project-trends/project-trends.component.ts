import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-project-trends',
  imports: [NgTemplateOutlet],
  templateUrl: './project-trends.component.html',
  styleUrl: './project-trends.component.scss',
})
export class ProjectTrendsComponent {
  placeholderDataCount = 5;
  loading = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 3500);
  }
}

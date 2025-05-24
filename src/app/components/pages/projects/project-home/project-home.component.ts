import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-home',
  imports: [RouterModule],
  templateUrl: './project-home.component.html',
  styleUrl: './project-home.component.scss',
})
export class ProjectHomeComponent implements OnInit {
  projectId: string | null = null;
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = params.get('id');
    });
  }
}

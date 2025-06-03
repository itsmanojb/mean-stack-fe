import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DummyDataService } from '@app/data/dummy-data.service';
import { Project } from '@shared/interfaces/project.interface';

@Injectable({ providedIn: 'root' })
export class ProjectResolver implements Resolve<any> {
  constructor(private dataService: DummyDataService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Project | null> {
    const id = route.paramMap.get('id');
    return this.dataService.getProjectById(id);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOpportunitiesComponent } from './project-opportunities.component';

describe('ProjectOpportunitiesComponent', () => {
  let component: ProjectOpportunitiesComponent;
  let fixture: ComponentFixture<ProjectOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectOpportunitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTrendsComponent } from './project-trends.component';

describe('ProjectTrendsComponent', () => {
  let component: ProjectTrendsComponent;
  let fixture: ComponentFixture<ProjectTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTrendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

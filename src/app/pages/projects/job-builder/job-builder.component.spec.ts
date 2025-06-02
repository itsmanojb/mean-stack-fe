import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBuilderComponent } from './job-builder.component';

describe('JobBuilderComponent', () => {
  let component: JobBuilderComponent;
  let fixture: ComponentFixture<JobBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

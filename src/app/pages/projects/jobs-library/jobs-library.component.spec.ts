import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsLibraryComponent } from './jobs-library.component';

describe('JobsLibraryComponent', () => {
  let component: JobsLibraryComponent;
  let fixture: ComponentFixture<JobsLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksLibraryComponent } from './tasks-library.component';

describe('TasksLibraryComponent', () => {
  let component: TasksLibraryComponent;
  let fixture: ComponentFixture<TasksLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

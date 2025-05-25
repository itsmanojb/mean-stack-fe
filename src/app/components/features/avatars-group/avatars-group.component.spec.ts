import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsGroupComponent } from './avatars-group.component';

describe('AvatarsGroupComponent', () => {
  let component: AvatarsGroupComponent;
  let fixture: ComponentFixture<AvatarsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarsGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRightBarComponent } from './profile-right-bar.component';

describe('ProfileRightBarComponent', () => {
  let component: ProfileRightBarComponent;
  let fixture: ComponentFixture<ProfileRightBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileRightBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRightBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

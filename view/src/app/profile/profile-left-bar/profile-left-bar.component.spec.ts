import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLeftBarComponent } from './profile-left-bar.component';

describe('ProfileLeftBarComponent', () => {
  let component: ProfileLeftBarComponent;
  let fixture: ComponentFixture<ProfileLeftBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileLeftBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLeftBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

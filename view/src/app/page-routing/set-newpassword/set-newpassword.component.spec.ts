import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetNewpasswordComponent } from './set-newpassword.component';

describe('SetNewpasswordComponent', () => {
  let component: SetNewpasswordComponent;
  let fixture: ComponentFixture<SetNewpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetNewpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetNewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

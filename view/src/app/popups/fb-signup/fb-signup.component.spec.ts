import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbSignupComponent } from './fb-signup.component';

describe('FbSignupComponent', () => {
  let component: FbSignupComponent;
  let fixture: ComponentFixture<FbSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

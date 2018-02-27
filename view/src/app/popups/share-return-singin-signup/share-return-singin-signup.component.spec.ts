import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareReturnSinginSignupComponent } from './share-return-singin-signup.component';

describe('ShareReturnSinginSignupComponent', () => {
  let component: ShareReturnSinginSignupComponent;
  let fixture: ComponentFixture<ShareReturnSinginSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareReturnSinginSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareReturnSinginSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

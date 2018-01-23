import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsRightBarComponent } from './feeds-right-bar.component';

describe('FeedsRightBarComponent', () => {
  let component: FeedsRightBarComponent;
  let fixture: ComponentFixture<FeedsRightBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsRightBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsRightBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

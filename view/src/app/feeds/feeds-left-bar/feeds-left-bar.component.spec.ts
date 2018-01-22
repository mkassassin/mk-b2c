import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsLeftBarComponent } from './feeds-left-bar.component';

describe('FeedsLeftBarComponent', () => {
  let component: FeedsLeftBarComponent;
  let fixture: ComponentFixture<FeedsLeftBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsLeftBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsLeftBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

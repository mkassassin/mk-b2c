import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsHighlightsComponent } from './feeds-highlights.component';

describe('FeedsHighlightsComponent', () => {
  let component: FeedsHighlightsComponent;
  let fixture: ComponentFixture<FeedsHighlightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsHighlightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

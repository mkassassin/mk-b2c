import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightsPostComponent } from './highlights-post.component';

describe('HighlightsPostComponent', () => {
  let component: HighlightsPostComponent;
  let fixture: ComponentFixture<HighlightsPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlightsPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightsPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

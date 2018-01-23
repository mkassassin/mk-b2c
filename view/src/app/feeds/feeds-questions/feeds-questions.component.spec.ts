import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsQuestionsComponent } from './feeds-questions.component';

describe('FeedsQuestionsComponent', () => {
  let component: FeedsQuestionsComponent;
  let fixture: ComponentFixture<FeedsQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

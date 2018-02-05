import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsPostComponent } from './questions-post.component';

describe('QuestionsPostComponent', () => {
  let component: QuestionsPostComponent;
  let fixture: ComponentFixture<QuestionsPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

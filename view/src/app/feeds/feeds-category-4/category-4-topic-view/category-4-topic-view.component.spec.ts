import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Category4TopicViewComponent } from './category-4-topic-view.component';

describe('Category4TopicViewComponent', () => {
  let component: Category4TopicViewComponent;
  let fixture: ComponentFixture<Category4TopicViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Category4TopicViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Category4TopicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

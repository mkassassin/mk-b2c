import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Category4TopicPostComponent } from './category-4-topic-post.component';

describe('Category4TopicPostComponent', () => {
  let component: Category4TopicPostComponent;
  let fixture: ComponentFixture<Category4TopicPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Category4TopicPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Category4TopicPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategory4TopicCommentComponent } from './edit-category-4-topic-comment.component';

describe('EditCategory4TopicCommentComponent', () => {
  let component: EditCategory4TopicCommentComponent;
  let fixture: ComponentFixture<EditCategory4TopicCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategory4TopicCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategory4TopicCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

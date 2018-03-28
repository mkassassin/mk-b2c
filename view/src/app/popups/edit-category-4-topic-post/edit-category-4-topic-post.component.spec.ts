import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategory4TopicPostComponent } from './edit-category-4-topic-post.component';

describe('EditCategory4TopicPostComponent', () => {
  let component: EditCategory4TopicPostComponent;
  let fixture: ComponentFixture<EditCategory4TopicPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategory4TopicPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategory4TopicPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

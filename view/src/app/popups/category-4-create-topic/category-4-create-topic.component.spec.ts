import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Category4CreateTopicComponent } from './category-4-create-topic.component';

describe('Category4CreateTopicComponent', () => {
  let component: Category4CreateTopicComponent;
  let fixture: ComponentFixture<Category4CreateTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Category4CreateTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Category4CreateTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

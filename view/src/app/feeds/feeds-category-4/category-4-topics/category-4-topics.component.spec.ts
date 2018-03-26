import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Category4TopicsComponent } from './category-4-topics.component';

describe('Category4TopicsComponent', () => {
  let component: Category4TopicsComponent;
  let fixture: ComponentFixture<Category4TopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Category4TopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Category4TopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

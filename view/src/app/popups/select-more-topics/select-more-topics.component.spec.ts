import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMoreTopicsComponent } from './select-more-topics.component';

describe('SelectMoreTopicsComponent', () => {
  let component: SelectMoreTopicsComponent;
  let fixture: ComponentFixture<SelectMoreTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMoreTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMoreTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

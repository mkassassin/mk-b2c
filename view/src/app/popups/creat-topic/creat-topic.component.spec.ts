import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatTopicComponent } from './creat-topic.component';

describe('CreatTopicComponent', () => {
  let component: CreatTopicComponent;
  let fixture: ComponentFixture<CreatTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

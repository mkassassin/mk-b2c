import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicPageRoutingComponent } from './topic-page-routing.component';

describe('TopicPageRoutingComponent', () => {
  let component: TopicPageRoutingComponent;
  let fixture: ComponentFixture<TopicPageRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicPageRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicPageRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverTopicsComponent } from './discover-topics.component';

describe('DiscoverTopicsComponent', () => {
  let component: DiscoverTopicsComponent;
  let fixture: ComponentFixture<DiscoverTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

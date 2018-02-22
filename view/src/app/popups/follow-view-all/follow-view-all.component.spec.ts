import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowViewAllComponent } from './follow-view-all.component';

describe('FollowViewAllComponent', () => {
  let component: FollowViewAllComponent;
  let fixture: ComponentFixture<FollowViewAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowViewAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

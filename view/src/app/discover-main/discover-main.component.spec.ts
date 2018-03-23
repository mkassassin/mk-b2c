import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverMainComponent } from './discover-main.component';

describe('DiscoverMainComponent', () => {
  let component: DiscoverMainComponent;
  let fixture: ComponentFixture<DiscoverMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

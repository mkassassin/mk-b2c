import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRoutingComponent } from './page-routing.component';

describe('PageRoutingComponent', () => {
  let component: PageRoutingComponent;
  let fixture: ComponentFixture<PageRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

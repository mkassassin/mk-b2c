import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Category4MainComponent } from './category-4-main.component';

describe('Category4MainComponent', () => {
  let component: Category4MainComponent;
  let fixture: ComponentFixture<Category4MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Category4MainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Category4MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

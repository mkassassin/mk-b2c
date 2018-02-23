import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPeoplesComponent } from './select-peoples.component';

describe('SelectPeoplesComponent', () => {
  let component: SelectPeoplesComponent;
  let fixture: ComponentFixture<SelectPeoplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPeoplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeoplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
